'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Enterprise hooks for Files Module - Migration 080 features
 * Storage quotas, trash, presence, bookmarks, audit logs, etc.
 */

// Hook for workspace storage quotas
export function useStorageQuota(workspaceId: string | null) {
  const [quota, setQuota] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!workspaceId) {
      setQuota(null)
      setLoading(false)
      return
    }

    async function fetchQuota() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('workspace_storage_quotas')
          .select('*')
          .eq('workspace_id', workspaceId)
          .single()

        if (queryError) throw queryError
        setQuota(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching storage quota:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuota()

    // Real-time subscription
    const channel = supabase
      .channel(`storage-quota:${workspaceId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'workspace_storage_quotas',
        filter: `workspace_id=eq.${workspaceId}`
      }, fetchQuota)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { quota, loading, error }
}

// Hook for file trash
export function useFileTrash(workspaceId: string | null) {
  const [trashedFiles, setTrashedFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!workspaceId) {
      setTrashedFiles([])
      setLoading(false)
      return
    }

    async function fetchTrashedFiles() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_trash')
          .select(`
            *,
            file:files(*)
          `)
          .eq('restore_available', true)
          .order('deleted_at', { ascending: false })

        if (queryError) throw queryError
        setTrashedFiles(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching trashed files:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrashedFiles()
  }, [workspaceId])

  return { trashedFiles, loading, error, refetch: () => {} }
}

// Hook for file presence (real-time collaborators)
export function useFilePresence(fileId: string | null) {
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setActiveUsers([])
      setLoading(false)
      return
    }

    async function fetchPresence() {
      try {
        setLoading(true)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        
        const { data, error: queryError } = await supabase
          .from('file_presence')
          .select(`
            *,
            user:profiles!user_id(first_name, last_name, avatar_url)
          `)
          .eq('file_id', fileId)
          .gt('last_heartbeat', fiveMinutesAgo)
          .order('last_heartbeat', { ascending: false })

        if (queryError) throw queryError
        setActiveUsers(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file presence:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPresence()

    // Real-time subscription
    const channel = supabase
      .channel(`file-presence:${fileId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_presence',
        filter: `file_id=eq.${fileId}`
      }, fetchPresence)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId])

  return { activeUsers, loading, error }
}

// Hook for file bookmarks
export function useFileBookmarks(userId: string | null) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setBookmarks([])
      setLoading(false)
      return
    }

    async function fetchBookmarks() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_bookmarks')
          .select(`
            *,
            file:files(*),
            folder:file_folders(*)
          `)
          .eq('user_id', userId)
          .order('sort_order')

        if (queryError) throw queryError
        setBookmarks(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching bookmarks:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookmarks()
  }, [userId])

  return { bookmarks, loading, error }
}

// Hook for file audit logs
export function useFileAuditLogs(fileId: string | null, limit = 50) {
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setAuditLogs([])
      setLoading(false)
      return
    }

    async function fetchAuditLogs() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_audit_logs')
          .select('*')
          .eq('file_id', fileId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (queryError) throw queryError
        setAuditLogs(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching audit logs:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()

    // Real-time subscription
    const channel = supabase
      .channel(`audit-logs:${fileId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'file_audit_logs',
        filter: `file_id=eq.${fileId}`
      }, fetchAuditLogs)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId, limit])

  return { auditLogs, loading, error }
}

// Helper function to move file to trash
export async function moveFileToTrash(fileId: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('move_file_to_trash', {
      p_file_id: fileId
    })

    if (error) throw error
    return data || false
  } catch (err) {
    console.error('Error moving file to trash:', err)
    return false
  }
}

// Helper function to restore file from trash
export async function restoreFileFromTrash(fileId: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('restore_file_from_trash', {
      p_file_id: fileId
    })

    if (error) throw error
    return data || false
  } catch (err) {
    console.error('Error restoring file from trash:', err)
    return false
  }
}

// Helper function to check storage quota
export async function checkStorageQuota(workspaceId: string, fileSize: number): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('check_storage_quota', {
      p_workspace_id: workspaceId,
      p_file_size_bytes: fileSize
    })

    if (error) throw error
    return data || false
  } catch (err) {
    console.error('Error checking storage quota:', err)
    return false
  }
}

// Helper function to toggle file bookmark
export async function toggleFileBookmark(fileId: string, folderId?: string): Promise<boolean> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Check if bookmark exists
    const { data: existing } = await supabase
      .from('file_bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq(fileId ? 'file_id' : 'folder_id', fileId || folderId)
      .single()

    if (existing) {
      // Remove bookmark
      await supabase
        .from('file_bookmarks')
        .delete()
        .eq('id', existing.id)
    } else {
      // Add bookmark
      await supabase
        .from('file_bookmarks')
        .insert({
          user_id: user.id,
          file_id: fileId || null,
          folder_id: folderId || null,
          bookmark_type: fileId ? 'file' : 'folder'
        })
    }

    return true
  } catch (err) {
    console.error('Error toggling bookmark:', err)
    return false
  }
}

// Helper function to update file presence heartbeat
export async function updateFilePresence(
  fileId: string,
  activityType: 'viewing' | 'editing' | 'commenting' | 'idle' = 'viewing'
): Promise<void> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('file_presence')
      .upsert({
        file_id: fileId,
        user_id: user.id,
        activity_type: activityType,
        last_heartbeat: new Date().toISOString()
      }, {
        onConflict: 'file_id,user_id'
      })
  } catch (err) {
    console.error('Error updating file presence:', err)
  }
}

// Helper function to log comprehensive audit entry
export async function logFileAudit(
  fileId: string,
  actionType: string,
  actionDetails?: Record<string, any>,
  complianceRelevant: boolean = false
): Promise<void> {
  const supabase = createClient()
  
  try {
    await supabase.rpc('log_file_audit', {
      p_file_id: fileId,
      p_action_type: actionType,
      p_action_details: actionDetails || {},
      p_compliance_relevant: complianceRelevant
    })
  } catch (err) {
    console.error('Error logging file audit:', err)
  }
}
