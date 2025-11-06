"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  Activity, Upload, Download, Eye, Edit3, Share2, 
  Trash2, FolderOpen, MessageCircle, Lock, Unlock,
  GitBranch, CheckCircle, XCircle
} from "lucide-react"
import { useFileActivities } from "@/hooks/use-file-collaboration"
import { formatDistanceToNow } from "date-fns"

interface FileActivityTimelineProps {
  fileId: string
  className?: string
}

export function FileActivityTimeline({ fileId, className }: FileActivityTimelineProps) {
  const { activities, loading } = useFileActivities(fileId, 50)

  const getActivityIcon = (type: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      created: Upload,
      uploaded: Upload,
      viewed: Eye,
      downloaded: Download,
      edited: Edit3,
      renamed: Edit3,
      moved: FolderOpen,
      copied: GitBranch,
      deleted: Trash2,
      restored: CheckCircle,
      shared: Share2,
      unshared: XCircle,
      permission_changed: Lock,
      commented: MessageCircle,
      version_created: GitBranch,
      locked: Lock,
      unlocked: Unlock,
      synced: CheckCircle,
      sync_error: XCircle
    }
    return icons[type] || Activity
  }

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      created: "text-green-500",
      uploaded: "text-blue-500",
      viewed: "text-gray-500",
      downloaded: "text-purple-500",
      edited: "text-yellow-500",
      deleted: "text-red-500",
      shared: "text-green-500",
      commented: "text-blue-500",
      locked: "text-orange-500",
      synced: "text-green-500",
      sync_error: "text-red-500"
    }
    return colors[type] || "text-gray-500"
  }

  const formatActivityText = (activity: any) => {
    const user = activity.user ? `${activity.user.first_name} ${activity.user.last_name}` : "Someone"
    
    const actions: Record<string, string> = {
      created: "created this file",
      uploaded: "uploaded this file",
      viewed: "viewed this file",
      downloaded: "downloaded this file",
      edited: "edited this file",
      renamed: "renamed this file",
      moved: "moved this file",
      copied: "copied this file",
      deleted: "deleted this file",
      restored: "restored this file",
      shared: "shared this file",
      unshared: "unshared this file",
      permission_changed: "changed permissions",
      commented: "commented on this file",
      version_created: "created a new version",
      locked: "locked this file",
      unlocked: "unlocked this file",
      synced: "synced with external storage",
      sync_error: "failed to sync"
    }

    const action = actions[activity.activity_type] || activity.activity_type
    return `${user} ${action}`
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "recently"
    }
  }

  return (
    <Card aria-hidden="true" className={className}>
      <CardHeader>
        <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Activity aria-hidden="true" className="h-5 w-5" />
          Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
            Loading activity...
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
            <Activity aria-hidden="true" className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No activity yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity: any, index: number) => {
              const Icon = getActivityIcon(activity.activity_type)
              const color = getActivityColor(activity.activity_type)
              
              return (
                <div key={activity.id} className="flex flex-wrap gap-3 relative">
                  {/* Timeline line */}
                  {index < activities.length - 1 && (
                    <div className="absolute sm:relative sm:inset-auto left-4 top-10 bottom-0 w-px bg-border sm:relative sm:inset-auto" />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 flex items-center justify-center h-8 w-8 rounded-full bg-background border-2 ${color}`}>
                    <Icon aria-hidden="true" className="h-4 w-4" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 flex-1">
                        {activity.user && (
                          <Avatar aria-hidden="true" className="h-6 w-6">
                            <AvatarImage src={activity.user.avatar_url} />
                            <AvatarFallback aria-hidden="true" className="text-xs">
                              {activity.user.first_name?.[0]}{activity.user.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <span className="text-sm">
                          {formatActivityText(activity)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                        {formatTime(activity.created_at)}
                      </span>
                    </div>
                    
                    {/* Details */}
                    {activity.details && Object.keys(activity.details).length > 0 && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {activity.details.oldName && activity.details.newName && (
                          <span>from &quot;{activity.details.oldName}&quot; to &quot;{activity.details.newName}&quot;</span>
                        )}
                        {activity.details.sharedWith && (
                          <span>with {activity.details.sharedWith}</span>
                        )}
                        {activity.details.permissionLevel && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            {activity.details.permissionLevel}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
