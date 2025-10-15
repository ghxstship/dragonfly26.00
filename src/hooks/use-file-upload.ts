'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface FileUploadOptions {
  workspaceId: string
  bucket: 'media' | 'documents' | 'receipts' | 'inventory-photos'
  folder?: string
  fileType?: string
  onProgress?: (progress: number) => void
  metadata?: Record<string, any>
}

export interface UploadResult {
  success: boolean
  fileId?: string
  fileUrl?: string
  storagePath?: string
  error?: string
}

/**
 * Hook for uploading files to Supabase Storage and creating file records
 */
export function useFileUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const uploadFile = async (
    file: File,
    options: FileUploadOptions
  ): Promise<UploadResult> => {
    try {
      setUploading(true)
      setProgress(0)
      setError(null)

      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Authentication required')
      }

      // Generate unique file path
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const folder = options.folder || 'uploads'
      const storagePath = `${options.workspaceId}/${folder}/${timestamp}-${sanitizedFileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(options.bucket)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      setProgress(50)
      if (options.onProgress) options.onProgress(50)

      // Get public URL or signed URL based on bucket privacy
      let fileUrl: string
      const publicBuckets = ['avatars', 'logos']
      
      if (publicBuckets.includes(options.bucket)) {
        const { data: urlData } = supabase.storage
          .from(options.bucket)
          .getPublicUrl(storagePath)
        fileUrl = urlData.publicUrl
      } else {
        const { data: urlData, error: urlError } = await supabase.storage
          .from(options.bucket)
          .createSignedUrl(storagePath, 3600 * 24 * 365) // 1 year
        
        if (urlError) throw urlError
        fileUrl = urlData.signedUrl
      }

      setProgress(75)
      if (options.onProgress) options.onProgress(75)

      // Create file record in database
      const { data: fileRecord, error: dbError } = await supabase
        .from('files')
        .insert({
          workspace_id: options.workspaceId,
          name: file.name,
          type: file.type,
          storage_path: storagePath,
          size_bytes: file.size,
          file_type: options.fileType || 'other',
          uploaded_by: user.id,
          custom_fields: options.metadata || {}
        })
        .select()
        .single()

      if (dbError) {
        // If database insert fails, try to clean up the uploaded file
        await supabase.storage.from(options.bucket).remove([storagePath])
        throw new Error(`Database error: ${dbError.message}`)
      }

      setProgress(100)
      if (options.onProgress) options.onProgress(100)

      setUploading(false)
      return {
        success: true,
        fileId: fileRecord.id,
        fileUrl,
        storagePath
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed'
      setError(errorMessage)
      setUploading(false)
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const uploadMultiple = async (
    files: File[],
    options: FileUploadOptions
  ): Promise<UploadResult[]> => {
    const results: UploadResult[] = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileProgress = (i / files.length) * 100
      
      if (options.onProgress) {
        options.onProgress(fileProgress)
      }

      const result = await uploadFile(file, {
        ...options,
        onProgress: (fileUploadProgress) => {
          const totalProgress = fileProgress + (fileUploadProgress / files.length)
          if (options.onProgress) {
            options.onProgress(totalProgress)
          }
        }
      })
      
      results.push(result)
    }

    return results
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return {
    uploadFile,
    uploadMultiple,
    uploading,
    progress,
    error,
    reset
  }
}

/**
 * Helper function to validate file before upload
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number // in bytes
    allowedTypes?: string[]
  }
): { valid: boolean; error?: string } {
  const { maxSize, allowedTypes } = options

  // Check file size
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return {
      valid: false,
      error: `File size exceeds ${maxSizeMB}MB limit`
    }
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const isAllowed = allowedTypes.some(type => {
      // Handle wildcard types like "image/*"
      if (type.endsWith('/*')) {
        const baseType = type.split('/')[0]
        return file.type.startsWith(`${baseType}/`)
      }
      return file.type === type
    })

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`
      }
    }
  }

  return { valid: true }
}

/**
 * Helper function to convert data URL (from camera) to File
 */
export function dataURLtoFile(dataURL: string, filename: string): File {
  const arr = dataURL.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  
  return new File([u8arr], filename, { type: mime })
}

/**
 * Helper function to compress image before upload
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number
    maxHeight?: number
    quality?: number
  } = {}
): Promise<File> {
  const { maxWidth = 1920, maxHeight = 1080, quality = 0.8 } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'))
              return
            }
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          },
          file.type,
          quality
        )
      }
      
      img.onerror = () => {
        reject(new Error('Image loading failed'))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('File reading failed'))
    }
  })
}
