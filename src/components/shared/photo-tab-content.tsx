'use client'

import { useState, useRef, useCallback } from 'react'
import { Camera, Image as ImageIcon, X, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/ui-store'
import { useFileUpload, validateFile, compressImage } from '@/hooks/use-file-upload'
import { cn } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'

export function PhotoTabContent() {
  const { currentWorkspace } = useUIStore()
  const { uploadFile, uploadMultiple, uploading, progress } = useFileUpload()
  const { toast } = useToast()
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      })
      
      setStream(mediaStream)
      setShowCamera(true)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Please check permissions.',
        variant: 'destructive'
      })
    }
  }

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }, [stream])

  // Capture photo from camera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.9)
        setCapturedPhoto(photoDataUrl)
        stopCamera()
      }
    }
  }

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null)
    startCamera()
  }

  // Save captured photo
  const saveCapturedPhoto = async () => {
    if (!capturedPhoto || !currentWorkspace) return

    try {
      // Convert data URL to File
      const response = await fetch(capturedPhoto)
      const blob = await response.blob()
      const timestamp = Date.now()
      const file = new File([blob], `photo-${timestamp}.jpg`, { type: 'image/jpeg' })

      // Compress image
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85
      })

      // Upload to storage
      const result = await uploadFile(compressedFile, {
        workspaceId: currentWorkspace.id,
        bucket: 'media',
        folder: 'photos',
        fileType: 'media',
        metadata: {
          captureMethod: 'camera',
          capturedAt: new Date().toISOString()
        }
      })

      if (result.success) {
        toast({
          title: 'Photo Saved',
          description: 'Your photo has been saved successfully.'
        })
        setCapturedPhoto(null)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error saving photo:', error)
      toast({
        title: 'Save Failed',
        description: error instanceof Error ? error.message : 'Failed to save photo',
        variant: 'destructive'
      })
    }
  }

  // Handle file upload from device
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0 || !currentWorkspace) return

    const fileArray = Array.from(files)
    
    // Validate files
    const invalidFiles = fileArray.filter(file => {
      const validation = validateFile(file, {
        maxSize: 10 * 1024 * 1024, // 10MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
      })
      return !validation.valid
    })

    if (invalidFiles.length > 0) {
      toast({
        title: 'Invalid Files',
        description: 'Some files are too large or not supported image types.',
        variant: 'destructive'
      })
      return
    }

    try {
      // Compress all images
      const compressedFiles = await Promise.all(
        fileArray.map(file => compressImage(file, {
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.85
        }))
      )

      // Upload files
      const results = await uploadMultiple(compressedFiles, {
        workspaceId: currentWorkspace.id,
        bucket: 'media',
        folder: 'photos',
        fileType: 'media',
        metadata: {
          captureMethod: 'upload',
          uploadedAt: new Date().toISOString()
        }
      })

      const successCount = results.filter(r => r.success).length
      
      toast({
        title: 'Upload Complete',
        description: `${successCount} of ${results.length} photos uploaded successfully.`
      })
    } catch (error) {
      console.error('Error uploading photos:', error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload photos',
        variant: 'destructive'
      })
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // View gallery
  const viewGallery = () => {
    // TODO: Navigate to files module filtered by photos
    toast({
      title: 'Gallery',
      description: 'Opening photo gallery...'
    })
  }

  return (
    <div className="space-y-4">
      {/* Description */}
      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm font-medium mb-2">Photo Capture</p>
        <p className="text-xs text-muted-foreground">
          Take photos directly from your device and attach them to your workspace items. 
          Perfect for site visits, meetings, and visual documentation.
        </p>
      </div>

      {/* Camera View or Preview */}
      {showCamera ? (
        <div className="relative rounded-lg overflow-hidden md:block bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-48 md:h-56 lg:h-64 object-cover max-w-full"
          />
          <div className="absolute sm:relative sm:inset-auto bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 sm:relative sm:inset-auto flex-col sm:flex-row">
        <Button
              variant="secondary"
              size="sm"
              onClick={stopCamera}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={capturePhoto}
              className="rounded-full h-14 w-14 p-0"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : capturedPhoto ? (
        <div className="relative rounded-lg overflow-hidden md:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={capturedPhoto}
            alt="Captured"
            className="w-full h-48 md:h-56 lg:h-64 object-cover max-w-full"
          />
          {uploading ? (
            <div className="absolute sm:relative sm:inset-auto inset-0 bg-black/50 flex flex-wrap items-center justify-center sm:relative sm:inset-auto">
              <div className="text-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">Saving... {progress}%</p>
              </div>
            </div>
          ) : (
            <div className="absolute sm:relative sm:inset-auto bottom-4 left-0 right-0 flex flex-wrap justify-center gap-2 sm:relative sm:inset-auto flex-col sm:flex-row">
        <Button
                variant="secondary"
                size="sm"
                onClick={retakePhoto}
              >
                <X className="h-4 w-4 mr-2" />
                Retake
              </Button>
              <Button
                size="sm"
                onClick={saveCapturedPhoto}
              >
                <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                Save Photo
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64 border-2 border-dashed rounded-lg bg-muted/20">
          <div className="text-center">
            <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium mb-1">Camera Ready</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Capture images for your workspace items and documentation
            </p>
          </div>
        </div>
      )}

      {/* Canvas for photo capture (hidden) */}
      <canvas ref={canvasRef} className="hidden md:block" />

      {/* Action Buttons */}
      {!showCamera && !capturedPhoto && (
        <>
          <Button
            className={cn("w-full", uploading && "opacity-50")}
            size="lg"
            onClick={startCamera}
            disabled={uploading}
          >
            <Camera className="h-4 w-4 mr-2" />
            Open Camera
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {progress}%
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Image
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={viewGallery}
            >
              View Gallery
            </Button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            multiple
            onChange={handleFileUpload}
            className="hidden md:block"
          />
        </>
      )}
    </div>
  )
}
