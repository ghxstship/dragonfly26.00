'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface FileItem {
  id: string
  organization_id: string
  name: string
  path: string
  size: number
  mime_type: string
  storage_url: string
  folder_id: string | null
  uploaded_by: string
  version: number
  is_latest: boolean
  tags: string[]
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface FileVersion {
  id: string
  file_id: string
  version: number
  size: number
  storage_url: string
  uploaded_by: string
  change_notes: string | null
  created_at: string
}

export interface FileShare {
  id: string
  file_id: string
  shared_with_user_id: string | null
  shared_with_email: string | null
  access_level: 'view' | 'edit' | 'download'
  expires_at: string | null
  share_link: string | null
  created_by: string
  created_at: string
}

export interface Folder {
  id: string
  organization_id: string
  name: string
  parent_folder_id: string | null
  path: string
  created_by: string
  created_at: string
  updated_at: string
}

export function useFilesData() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [versions, setVersions] = useState<FileVersion[]>([])
  const [shares, setShares] = useState<FileShare[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('files-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'files' }, fetchFiles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'file_shares' }, fetchShares)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchFiles(), fetchVersions(), fetchShares(), fetchFolders()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchFiles() {
    const { data, error } = await supabase.from('files').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setFiles(data || [])
  }

  async function fetchVersions() {
    const { data, error } = await supabase.from('file_versions').select('*').order('version', { ascending: false })
    if (error) throw error
    setVersions(data || [])
  }

  async function fetchShares() {
    const { data, error } = await supabase.from('file_shares').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setShares(data || [])
  }

  async function fetchFolders() {
    const { data, error } = await supabase.from('folders').select('*').order('path')
    if (error) throw error
    setFolders(data || [])
  }

  async function uploadFile(file: File, folderId: string | null = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const filePath = `${user.id}/${Date.now()}-${file.name}`
    
    const { error: uploadError } = await supabase.storage.from('user-files').upload(filePath, file)
    if (uploadError) throw uploadError

    const { data: storageData } = supabase.storage.from('user-files').getPublicUrl(filePath)

    const { data: fileRecord, error } = await supabase.from('files').insert({
      name: file.name,
      path: filePath,
      size: file.size,
      mime_type: file.type,
      storage_url: storageData.publicUrl,
      folder_id: folderId,
      uploaded_by: user.id,
      version: 1,
      is_latest: true,
      tags: [],
      metadata: {},
    }).select().single()

    if (error) throw error
    await fetchFiles()
    return fileRecord
  }

  async function uploadNewVersion(fileId: string, file: File, changeNotes: string | null = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const existingFile = files.find(f => f.id === fileId)
    if (!existingFile) throw new Error('File not found')

    const filePath = `${user.id}/${Date.now()}-${file.name}`
    
    const { error: uploadError } = await supabase.storage.from('user-files').upload(filePath, file)
    if (uploadError) throw uploadError

    const { data: storageData } = supabase.storage.from('user-files').getPublicUrl(filePath)

    // Create version record
    await supabase.from('file_versions').insert({
      file_id: fileId,
      version: existingFile.version + 1,
      size: file.size,
      storage_url: storageData.publicUrl,
      uploaded_by: user.id,
      change_notes: changeNotes,
    })

    // Update file record
    const { data, error } = await supabase.from('files').update({
      version: existingFile.version + 1,
      size: file.size,
      storage_url: storageData.publicUrl,
      updated_at: new Date().toISOString(),
    }).eq('id', fileId).select().single()

    if (error) throw error
    await Promise.all([fetchFiles(), fetchVersions()])
    return data
  }

  async function shareFile(fileId: string, shareData: Omit<FileShare, 'id' | 'created_by' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase.from('file_shares').insert({
      ...shareData,
      file_id: fileId,
      created_by: user.id,
    }).select().single()

    if (error) throw error
    await fetchShares()
    return data
  }

  async function deleteFile(id: string) {
    const file = files.find(f => f.id === id)
    if (!file) throw new Error('File not found')

    // Delete from storage
    await supabase.storage.from('user-files').remove([file.path])

    // Delete from database
    const { error } = await supabase.from('files').delete().eq('id', id)
    if (error) throw error
    await fetchFiles()
  }

  async function createFolder(name: string, parentFolderId: string | null = null) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const path = parentFolderId 
      ? `${folders.find(f => f.id === parentFolderId)?.path}/${name}`
      : `/${name}`

    const { data, error } = await supabase.from('folders').insert({
      name,
      parent_folder_id: parentFolderId,
      path,
      created_by: user.id,
    }).select().single()

    if (error) throw error
    await fetchFolders()
    return data
  }

  async function downloadFile(fileId: string) {
    const file = files.find(f => f.id === fileId)
    if (!file) throw new Error('File not found')

    const { data, error } = await supabase.storage.from('user-files').download(file.path)
    if (error) throw error
    
    const url = URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  return {
    files, versions, shares, folders, loading, error,
    uploadFile, uploadNewVersion, shareFile, deleteFile,
    createFolder, downloadFile,
    refresh: fetchAllData,
  }
}
