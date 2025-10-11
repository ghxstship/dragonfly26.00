"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { CheckCheck, MessageSquare, AtSign, UserPlus, Clock, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotificationsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type NotificationType = "mention" | "comment" | "assignment" | "update"

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  link: string
  read: boolean
  created_at: string
  priority?: "low" | "medium" | "high"
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "mention",
    title: "You were mentioned",
    message: "John Doe mentioned you in Project Alpha",
    link: "/projects/alpha",
    read: false,
    priority: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    type: "comment",
    title: "New comment",
    message: "Jane Smith commented on your task",
    link: "/tasks/123",
    read: false,
    priority: "medium",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    type: "assignment",
    title: "Task assigned",
    message: "You were assigned to Update Documentation",
    link: "/tasks/456",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "4",
    type: "update",
    title: "Status changed",
    message: "Task 'Design Review' moved to In Progress",
    link: "/tasks/789",
    read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

const notificationIcons: Record<NotificationType, any> = {
  mention: AtSign,
  comment: MessageSquare,
  assignment: UserPlus,
  update: Clock,
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const groupedNotifications = {
    today: notifications.filter(
      (n) => new Date(n.created_at).toDateString() === new Date().toDateString()
    ),
    earlier: notifications.filter(
      (n) => new Date(n.created_at).toDateString() !== new Date().toDateString()
    ),
  }

  const renderNotification = (notification: Notification) => {
    const Icon = notificationIcons[notification.type]
    
    return (
      <button
        key={notification.id}
        className={cn(
          "w-full text-left p-3 rounded-lg hover:bg-accent transition-colors relative",
          !notification.read && "bg-accent/50"
        )}
        onClick={() => {
          // Handle notification click
          onOpenChange(false)
        }}
      >
        <div className="flex gap-3">
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
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-sm">{notification.title}</div>
              <div className="flex items-center gap-2">
                {notification.priority === "high" && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                    High
                  </Badge>
                )}
                {!notification.read && (
                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification.message}
            </div>
            <div className="flex items-center gap-2 mt-2">
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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-96">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Notifications</SheetTitle>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-4 w-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </Button>
            )}
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="mentions">Mentions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-4">
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
                  <div className="text-center py-12">
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

          <TabsContent value="unread" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1">
                {notifications
                  .filter((n) => !n.read)
                  .map(renderNotification)}
                {notifications.filter((n) => !n.read).length === 0 && (
                  <div className="text-center py-12">
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

          <TabsContent value="mentions" className="mt-4">
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <div className="space-y-1">
                {notifications
                  .filter((n) => n.type === "mention")
                  .map(renderNotification)}
                {notifications.filter((n) => n.type === "mention").length === 0 && (
                  <div className="text-center py-12">
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
      </SheetContent>
    </Sheet>
  )
}
