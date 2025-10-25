"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { CheckCheck, MessageSquare, AtSign, UserPlus, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useToast } from "@/lib/hooks/use-toast"

interface NotificationData {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  link: string | null
  read: boolean
  created_at: string
}

const notificationIcons: Record<string, any> = {
  mention: AtSign,
  comment: MessageSquare,
  assignment: UserPlus,
  update: Clock,
  system: CheckCircle2,
}

export function NotificationsTabContent() {
  const supabase = getSupabaseClient()
  const { toast } = useToast()
  
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const unreadCount = notifications.filter((n) => !n.read).length

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        setNotifications(data || [])
      } catch (error: any) {
        console.error('Error fetching notifications:', error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [supabase, currentUser, toast])

  // Subscribe to real-time notifications
  useEffect(() => {
    if (!currentUser) return

    const channel = supabase
      .channel(`notifications:${currentUser.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const newNotification = payload.new as NotificationData
          setNotifications((prev) => [newNotification, ...prev])
          
          // Show toast for new notification
          toast({
            title: newNotification.title,
            description: newNotification.message,
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          const updated = payload.new as NotificationData
          setNotifications((prev) =>
            prev.map((n) => (n.id === updated.id ? updated : n))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentUser, toast])

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error: any) {
      console.error('Error marking notification as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const markAllAsRead = async () => {
    if (!currentUser) return
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', currentUser.id)
        .eq('read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error: any) {
      console.error('Error marking all as read:', error)
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      })
    }
  }

  const groupedNotifications = {
    today: notifications.filter(
      (n) => new Date(n.created_at).toDateString() === new Date().toDateString()
    ),
    earlier: notifications.filter(
      (n) => new Date(n.created_at).toDateString() !== new Date().toDateString()
    ),
  }

  const renderNotification = (notification: NotificationData) => {
    const Icon = notificationIcons[notification.type] || CheckCircle2
    
    return (
      <button
        key={notification.id}
        className={cn(
          "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors relative",
          !notification.read && "bg-accent/50"
        )}
        onClick={() => {
          if (!notification.read) {
            markAsRead(notification.id)
          }
        }}
      >
        <div className="flex flex-wrap gap-3">
          <div className="flex-shrink-0 mt-1">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                notification.type === "mention" && "bg-blue-100 dark:bg-blue-950",
                notification.type === "comment" && "bg-green-100 dark:bg-green-950",
                notification.type === "assignment" && "bg-purple-100 dark:bg-purple-950",
                notification.type === "update" && "bg-orange-100 dark:bg-orange-950"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  notification.type === "mention" && "text-blue-600 dark:text-blue-400",
                  notification.type === "comment" && "text-green-600 dark:text-green-400",
                  notification.type === "assignment" && "text-purple-600 dark:text-purple-400",
                  notification.type === "update" && "text-orange-600 dark:text-orange-400"
                )}
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2">
              <div className="font-medium text-sm">{notification.title}</div>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-2">
              <div className="text-xs text-muted-foreground">
                {formatDate(notification.created_at)}
              </div>
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs ml-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    markAsRead(notification.id)
                  }}
                >
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Mark read
                </Button>
              )}
            </div>
          </div>
        </div>
      </button>
    )
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center justify-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Header Actions */}
      {unreadCount > 0 && (
        <div className="px-4 py-2 border-b">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full gap-2 justify-center max-w-full"
            onClick={markAllAsRead}
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read ({unreadCount})
          </Button>
        </div>
      )}

      <Tabs defaultValue="all" className="flex-1 flex flex-wrap flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mx-4 mt-4 max-w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="flex-1 mt-4 m-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-4 pb-4">
              {groupedNotifications.today.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
                    Today
                  </h3>
                  <div className="space-y-1">
                    {groupedNotifications.today.map(renderNotification)}
                  </div>
                </div>
              )}
              {groupedNotifications.earlier.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2 px-3">
                    Earlier
                  </h3>
                  <div className="space-y-1">
                    {groupedNotifications.earlier.map(renderNotification)}
                  </div>
                </div>
              )}
              {notifications.length === 0 && (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No new notifications
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="unread" className="flex-1 mt-4 m-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-1 pb-4">
              {notifications
                .filter((n) => !n.read)
                .map(renderNotification)}
              {notifications.filter((n) => !n.read).length === 0 && (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No unread notifications
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="mentions" className="flex-1 mt-4 m-0">
          <ScrollArea className="h-full px-4">
            <div className="space-y-1 pb-4">
              {notifications
                .filter((n: any) => n.type === "mention")
                .map(renderNotification)}
              {notifications.filter((n: any) => n.type === "mention").length === 0 && (
                <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
                  <AtSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm font-medium">No mentions</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You haven&apos;t been mentioned recently
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
