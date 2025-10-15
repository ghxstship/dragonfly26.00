"use client"

import { useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { useFilePresence, updateFilePresence } from "@/hooks/use-file-enterprise"
import { Eye, Edit3, MessageCircle, User } from "lucide-react"

interface FilePresenceIndicatorProps {
  fileId: string
  currentActivity?: 'viewing' | 'editing' | 'commenting'
  className?: string
}

export function FilePresenceIndicator({ 
  fileId, 
  currentActivity = 'viewing',
  className 
}: FilePresenceIndicatorProps) {
  const { activeUsers, loading } = useFilePresence(fileId)

  // Update presence heartbeat every 30 seconds
  useEffect(() => {
    if (!fileId) return

    // Initial presence update
    updateFilePresence(fileId, currentActivity)

    // Set up interval for heartbeat
    const interval = setInterval(() => {
      updateFilePresence(fileId, currentActivity)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fileId, currentActivity])

  if (loading || activeUsers.length === 0) {
    return null
  }

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'editing': return Edit3
      case 'commenting': return MessageCircle
      default: return Eye
    }
  }

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'editing': return 'text-green-500'
      case 'commenting': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1 ${className}`}>
        {activeUsers.length > 0 && (
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 5).map((presence) => {
              const ActivityIcon = getActivityIcon(presence.activity_type)
              const activityColor = getActivityColor(presence.activity_type)
              
              return (
                <Tooltip key={presence.id}>
                  <TooltipTrigger>
                    <div className="relative">
                      <Avatar className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={presence.user?.avatar_url} />
                        <AvatarFallback>
                          {presence.user?.first_name?.[0]}{presence.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background flex items-center justify-center bg-white ${activityColor}`}>
                        <ActivityIcon className="h-2 w-2" />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <p className="font-medium">
                        {presence.user?.first_name} {presence.user?.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {presence.activity_type}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
        
        {activeUsers.length > 5 && (
          <Badge variant="secondary" className="text-xs">
            +{activeUsers.length - 5}
          </Badge>
        )}
      </div>
    </TooltipProvider>
  )
}
