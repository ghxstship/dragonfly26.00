'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hooks for file collaboration features
 * Supports file sharing, permissions, comments, workflows, etc.
 */

// Hook for file permissions
export function useFilePermissions(fileId: string | null) {
  const [permissions, setPermissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setPermissions([])
      setLoading(false)
      return
    }

    async function fetchPermissions() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_permissions')
          .select(`
            *,
            user:profiles!user_id(first_name, last_name, avatar_url),
            granted_by_user:profiles!granted_by(first_name, last_name)
          `)
          .eq('file_id', fileId)
          .order('created_at', { ascending: false })

        if (queryError) throw queryError
        setPermissions(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file permissions:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchPermissions()

    // Real-time subscription
    const channel = supabase
      .channel(`file-permissions:${fileId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_permissions',
        filter: `file_id=eq.${fileId}`
      }, fetchPermissions)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId])

  return { permissions, loading, error }
}

// Hook for file comments
export function useFileComments(fileId: string | null) {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setComments([])
      setLoading(false)
      return
    }

    async function fetchComments() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_comments')
          .select(`
            *,
            user:profiles!user_id(first_name, last_name, avatar_url),
            replies:file_comments!parent_comment_id(
              *,
              user:profiles!user_id(first_name, last_name, avatar_url)
            )
          `)
          .eq('file_id', fileId)
          .is('parent_comment_id', null)
          .order('created_at', { ascending: false })

        if (queryError) throw queryError
        setComments(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file comments:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()

    // Real-time subscription
    const channel = supabase
      .channel(`file-comments:${fileId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_comments',
        filter: `file_id=eq.${fileId}`
      }, fetchComments)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId])

  return { comments, loading, error }
}

// Hook for file activities (audit log)
export function useFileActivities(fileId: string | null, limit = 50) {
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setActivities([])
      setLoading(false)
      return
    }

    async function fetchActivities() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_activities')
          .select(`
            *,
            user:profiles!user_id(first_name, last_name, avatar_url)
          `)
          .eq('file_id', fileId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (queryError) throw queryError
        setActivities(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file activities:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Real-time subscription
    const channel = supabase
      .channel(`file-activities:${fileId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'file_activities',
        filter: `file_id=eq.${fileId}`
      }, fetchActivities)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId, limit])

  return { activities, loading, error }
}

// Hook for file folders
export function useFileFolders(workspaceId: string | null, parentFolderId?: string | null) {
  const [folders, setFolders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!workspaceId) {
      setFolders([])
      setLoading(false)
      return
    }

    async function fetchFolders() {
      try {
        setLoading(true)
        let query = supabase
          .from('file_folders')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('name')

        if (parentFolderId !== undefined) {
          if (parentFolderId === null) {
            query = query.is('parent_folder_id', null)
          } else {
            query = query.eq('parent_folder_id', parentFolderId)
          }
        }

        const { data, error: queryError } = await query

        if (queryError) throw queryError
        setFolders(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file folders:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchFolders()

    // Real-time subscription
    const channel = supabase
      .channel(`file-folders:${workspaceId}:${parentFolderId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_folders',
        filter: `workspace_id=eq.${workspaceId}`
      }, fetchFolders)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, parentFolderId])

  return { folders, loading, error }
}

// Hook for file collaboration sessions
export function useFileCollaboration(fileId: string | null) {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setSessions([])
      setLoading(false)
      return
    }

    async function fetchSessions() {
      try {
        setLoading(true)
        // Only get active sessions from last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        
        const { data, error: queryError } = await supabase
          .from('file_collaboration_sessions')
          .select(`
            *,
            user:profiles!user_id(first_name, last_name, avatar_url)
          `)
          .eq('file_id', fileId)
          .eq('is_active', true)
          .gt('last_heartbeat', fiveMinutesAgo)
          .order('last_heartbeat', { ascending: false })

        if (queryError) throw queryError
        setSessions(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching collaboration sessions:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()

    // Real-time subscription
    const channel = supabase
      .channel(`file-collab:${fileId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'file_collaboration_sessions',
        filter: `file_id=eq.${fileId}`
      }, fetchSessions)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fileId])

  return { sessions, loading, error }
}

// Hook for external storage connections
export function useExternalStorage(userId: string | null) {
  const [connections, setConnections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setConnections([])
      setLoading(false)
      return
    }

    async function fetchConnections() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('external_storage_connections')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (queryError) throw queryError
        setConnections(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching external storage connections:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchConnections()
  }, [userId])

  return { connections, loading, error }
}

// Hook for checking file permission
export function useCheckFilePermission(fileId: string | null, requiredPermission: 'viewer' | 'commenter' | 'editor' | 'owner' = 'viewer') {
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!fileId) {
      setHasPermission(false)
      setLoading(false)
      return
    }

    async function checkPermission() {
      try {
        setLoading(true)
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setHasPermission(false)
          setLoading(false)
          return
        }

        const { data, error: rpcError } = await supabase.rpc('check_file_permission', {
          p_file_id: fileId,
          p_user_id: user.id,
          p_required_permission: requiredPermission
        })

        if (rpcError) throw rpcError
        setHasPermission(data || false)
        setError(null)
      } catch (err) {
        console.error('Error checking file permission:', err)
        setError(err as Error)
        setHasPermission(false)
      } finally {
        setLoading(false)
      }
    }

    checkPermission()
  }, [fileId, requiredPermission])

  return { hasPermission, loading, error }
}

// Helper function to generate share link
export async function generateFileShareLink(fileId: string): Promise<string | null> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase.rpc('generate_file_share_link', {
      p_file_id: fileId
    })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error generating share link:', err)
    return null
  }
}

// Helper function to log file activity
export async function logFileActivity(
  fileId: string,
  activityType: string,
  details?: Record<string, any>
): Promise<void> {
  const supabase = createClient()
  
  try {
    await supabase.rpc('log_file_activity', {
      p_file_id: fileId,
      p_activity_type: activityType,
      p_details: details || {}
    })
  } catch (err) {
    console.error('Error logging file activity:', err)
  }
}

// Helper function to add file permission
export async function addFilePermission(
  fileId: string,
  userId: string,
  permissionLevel: 'viewer' | 'commenter' | 'editor' | 'owner',
  options: {
    canDownload?: boolean
    canShare?: boolean
    expiresAt?: Date
  } = {}
): Promise<any> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('file_permissions')
      .insert({
        file_id: fileId,
        user_id: userId,
        permission_level: permissionLevel,
        can_download: options.canDownload ?? true,
        can_share: options.canShare ?? false,
        expires_at: options.expiresAt?.toISOString(),
        granted_by: user.id
      })
      .select()
      .single()

    if (error) throw error
    
    // Log activity
    await logFileActivity(fileId, 'shared', { sharedWith: userId, permissionLevel })
    
    return data
  } catch (err) {
    console.error('Error adding file permission:', err)
    throw err
  }
}

// Helper function to add file comment
export async function addFileComment(
  fileId: string,
  content: string,
  options: {
    parentCommentId?: string
    mentions?: string[]
    annotationType?: 'general' | 'text_selection' | 'area' | 'point'
    annotationData?: Record<string, any>
  } = {}
): Promise<any> {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('file_comments')
      .insert({
        file_id: fileId,
        user_id: user.id,
        content,
        parent_comment_id: options.parentCommentId,
        mentions: options.mentions || [],
        annotation_type: options.annotationType || 'general',
        annotation_data: options.annotationData
      })
      .select()
      .single()

    if (error) throw error
    
    // Log activity
    await logFileActivity(fileId, 'commented')
    
    return data
  } catch (err) {
    console.error('Error adding file comment:', err)
    throw err
  }
}

// Hook for smart folders
export function useSmartFolders(userId: string | null, workspaceId: string | null) {
  const [smartFolders, setSmartFolders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId || !workspaceId) {
      setSmartFolders([])
      setLoading(false)
      return
    }

    async function fetchSmartFolders() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('smart_folders')
          .select('*')
          .eq('user_id', userId)
          .eq('workspace_id', workspaceId)
          .order('is_pinned', { ascending: false })
          .order('name')

        if (queryError) throw queryError
        setSmartFolders(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching smart folders:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSmartFolders()
  }, [userId, workspaceId])

  return { smartFolders, loading, error }
}

// Hook for file favorites
export function useFileFavorites(userId: string | null) {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!userId) {
      setFavorites([])
      setLoading(false)
      return
    }

    async function fetchFavorites() {
      try {
        setLoading(true)
        const { data, error: queryError } = await supabase
          .from('file_favorites')
          .select(`
            *,
            file:files(
              *,
              uploader:profiles!uploaded_by(first_name, last_name, avatar_url)
            )
          `)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (queryError) throw queryError
        setFavorites(data || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching file favorites:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [userId])

  return { favorites, loading, error }
}
