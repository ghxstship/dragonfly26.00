"use client"

import { useTranslations } from "next-intl"
import { Bell, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { Notification } from "@/types"

const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "user-1",
    organization_id: "org-1",
    type: "mention",
    title: "You were mentioned in a comment",
    message: "@john mentioned you in \"Design Homepage\"",
    link_url: "/tasks/123",
    is_read: false,
    priority: "normal",
    created_at: "2025-01-15T14:30:00Z",
  },
  {
    id: "2",
    user_id: "user-1",
    organization_id: "org-1",
    type: "assignment",
    title: "New task assigned",
    message: "Sarah assigned you to \"Fix navigation bug\"",
    link_url: "/tasks/124",
    is_read: false,
    priority: "high",
    created_at: "2025-01-15T13:15:00Z",
  },
  {
    id: "3",
    user_id: "user-1",
    organization_id: "org-1",
    type: "due_date",
    title: "Task due soon",
    message: "\"API Integration\" is due in 2 hours",
    link_url: "/tasks/125",
    is_read: true,
    priority: "urgent",
    created_at: "2025-01-15T12:00:00Z",
  },
]

const priorityColors = {
  low: "text-gray-600",
  normal: "text-blue-600",
  high: "text-orange-600",
  urgent: "text-red-600",
}

export function NotificationsPanel() {
  const t = useTranslations()
  const unreadCount = mockNotifications.filter((n) => !n.is_read).length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            <Button variant="ghost" size="sm">
              <Check className="h-4 w-4 mr-2" />
              Mark all read
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          <div className="space-y-3">
            {mockNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  "cursor-pointer hover:shadow-md transition-shadow",
                  !notification.is_read && "border-l-4 border-l-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="capitalize">
                          {notification.type}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={cn("capitalize", priorityColors[notification.priority])}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {mockNotifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
