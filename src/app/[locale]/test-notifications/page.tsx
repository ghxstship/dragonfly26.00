"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks"
import { notificationService } from "@/lib/services/notification-service"
import { createClient } from "@/lib/supabase/client"
import { Bell, Plus, CheckCheck, Trash2, RefreshCw } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function TestNotificationsPage() {
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications()
  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  // Get current user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    fetchUserId()
  }, [])

  const handleCreateTestNotifications = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      })
      return
    }

    setCreating(true)
    try {
      await notificationService.createTestNotifications(userId)
      toast({
        title: "Success",
        description: "Test notifications created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create test notifications",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id)
      toast({
        title: "Success",
        description: "Notification marked as read",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead()
      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to mark all as read",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Notifications Test Page</h1>
          <p className="text-muted-foreground mt-2">
            Test the notifications system and view real-time updates
          </p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications Stats
            </CardTitle>
            <CardDescription>
              Current notification statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{notifications.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <div className="text-2xl font-bold text-primary">{unreadCount}</div>
                <div className="text-sm text-muted-foreground">Unread</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <div className="text-2xl font-bold">{notifications.length - unreadCount}</div>
                <div className="text-sm text-muted-foreground">Read</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Create test notifications and manage existing ones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleCreateTestNotifications}
                disabled={creating || !userId}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Test Notifications
              </Button>
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
                className="gap-2"
              >
                <CheckCheck className="h-4 w-4" />
                Mark All Read
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <CardTitle>All Notifications</CardTitle>
            <CardDescription>
              Real-time list of all notifications (auto-updates)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No notifications yet. Create some test notifications to get started!
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border ${
                        notification.read ? 'bg-muted/50' : 'bg-primary/5 border-primary/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">{notification.title}</div>
                            {!notification.read && (
                              <Badge variant="default" className="text-xs">New</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{notification.type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                            >
                              <CheckCheck className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Test</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click &ldquo;Create Test Notifications&rdquo; to add 3 unread notifications</li>
              <li>Check the top bar - you should see the red badge with the count</li>
              <li>Click a notification to mark it as read and watch the count decrease</li>
              <li>Open the notifications panel from the top bar to see the full interface</li>
              <li>The count updates in real-time across all open tabs/windows</li>
              <li>You can also test by inserting notifications directly via SQL</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
