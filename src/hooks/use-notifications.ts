import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase/hooks-client'

export interface NotificationData {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
}

export function useNotifications() {
  const supabase = getSupabaseClient()
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<unknown>(null)

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch notifications and unread count
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return

      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', (currentUser as any)?.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        
        setNotifications(data || [])
        setUnreadCount(data?.filter(n => !n.read).length || 0)
      } catch (error: Error | unknown) {
        console.error('Error fetching notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [supabase, currentUser])

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!currentUser) return

    const channel = supabase
      .channel(`notifications:${(currentUser as any)?.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${(currentUser as any)?.id}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationData
          setNotifications((prev) => [newNotification, ...prev])
          if (!newNotification.read) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${(currentUser as any)?.id}`,
        },
        (payload) => {
          const updated = payload.new as NotificationData
          const old = payload.old as NotificationData
          
          setNotifications((prev) =>
            prev.map((n: any) => (n.id === updated.id ? updated : n))
          )
          
          // Update unread count
          if (old.read !== updated.read) {
            setUnreadCount((prev) => updated.read ? Math.max(0, prev - 1) : prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentUser])

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n: any) => (n.id === id ? { ...n, read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (error: Error | unknown) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  const markAllAsRead = async () => {
    if (!currentUser) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', (currentUser as any)?.id)
        .eq('read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n: any) => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (error: Error | unknown) {
      console.error('Error marking all as read:', error)
      throw error
    }
  }

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  }
}
