"use client"

import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  FileText,
  Calendar,
  ArrowRight,
  Trash2,
  Archive,
  RotateCcw,
  UserMinus,
  AtSign,
  Heart,
  Paperclip,
  Upload,
  Share2,
  FolderOpen,
  Copy,
  AlertCircle,
  Flag
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import type { Activity } from "@/types"

interface ActivityFeedProps {
  activities?: Activity[]
  limit?: number
}

const mockActivities: Activity[] = [
  {
    id: "1",
    organization_id: "org-1",
    user_id: "user-1",
    action: "completed",
    item_id: "task-1",
    item_type: "task",
    item_name: "Implement user authentication",
    is_public: true,
    created_at: "2025-01-15T14:30:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    user_id: "user-2",
    action: "commented",
    item_id: "task-2",
    item_type: "task",
    item_name: "Design landing page",
    is_public: true,
    created_at: "2025-01-15T14:15:00Z",
  },
  {
    id: "3",
    organization_id: "org-1",
    user_id: "user-3",
    action: "assigned",
    item_id: "task-3",
    item_type: "task",
    item_name: "Fix navigation bug",
    is_public: true,
    created_at: "2025-01-15T13:45:00Z",
  },
]

const activityIcons = {
  created: FileText,
  updated: FileText,
  deleted: Trash2,
  completed: CheckCircle2,
  archived: Archive,
  restored: RotateCcw,
  assigned: UserPlus,
  unassigned: UserMinus,
  commented: MessageSquare,
  mentioned: AtSign,
  reacted: Heart,
  attached: Paperclip,
  uploaded: Upload,
  shared: Share2,
  moved: FolderOpen,
  duplicated: Copy,
  status_changed: ArrowRight,
  priority_changed: Flag,
  due_date_changed: Calendar,
}

const activityColors = {
  created: "text-blue-600",
  updated: "text-yellow-600",
  deleted: "text-red-600",
  completed: "text-green-600",
  archived: "text-gray-600",
  restored: "text-cyan-600",
  assigned: "text-indigo-600",
  unassigned: "text-slate-600",
  commented: "text-purple-600",
  mentioned: "text-pink-600",
  reacted: "text-rose-600",
  attached: "text-teal-600",
  uploaded: "text-emerald-600",
  shared: "text-violet-600",
  moved: "text-amber-600",
  duplicated: "text-lime-600",
  status_changed: "text-orange-600",
  priority_changed: "text-red-500",
  due_date_changed: "text-pink-600",
}

export function ActivityFeed({ activities = mockActivities, limit }: ActivityFeedProps) {
  const t = useTranslations()
  const displayed = limit ? activities.slice(0, limit) : activities

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-4">
        {displayed.map((activity) => {
          const Icon = activityIcons[activity.action] || FileText
          const colorClass = activityColors[activity.action] || "text-gray-600"

          return (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className={cn("mt-1", colorClass)}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`/avatars/${activity.user_id}.jpg`} />
                          <AvatarFallback className="text-xs">
                            {getInitials(activity.user_id)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm truncate">{activity.user_id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(activity.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <p className="text-sm mt-2">
                      <span className="capitalize">{activity.action.replace(/_/g, " ")}</span>
                      {" "}
                      <span className="font-medium">{activity.item_name}</span>
                    </p>

                    {activity.old_value && activity.new_value && (
                      <div className="flex items-center gap-2 mt-2 text-xs">
                        <Badge variant="outline">{activity.old_value.toString()}</Badge>
                        <ArrowRight className="h-3 w-3" />
                        <Badge variant="default">{activity.new_value.toString()}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {displayed.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">No recent activity</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
