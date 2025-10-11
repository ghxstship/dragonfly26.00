"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"

const mockActivities = [
  {
    id: "1",
    user: { name: "John Doe", avatar_url: null },
    action: "created task",
    entity_type: "task",
    entity_id: "123",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user: { name: "Jane Smith", avatar_url: null },
    action: "commented on",
    entity_type: "task",
    entity_id: "123",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    user: { name: "Bob Wilson", avatar_url: null },
    action: "updated status to",
    entity_type: "task",
    entity_id: "123",
    metadata: { status: t('statuses.inProgress') },
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

export function ActivityFeed() {
  const t = useTranslations()
  return (
    <div className="space-y-4">
      {mockActivities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={activity.user.avatar_url || undefined} />
            <AvatarFallback className="text-xs">
              {getInitials(activity.user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm">
              <span className="font-medium">{activity.user.name}</span>{" "}
              <span className="text-muted-foreground">{activity.action}</span>
              {activity.metadata?.status && (
                <span className="font-medium"> {activity.metadata.status}</span>
              )}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {formatDate(activity.created_at)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
