"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Activity as ActivityIcon, Filter, MessageSquare, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * ActivityViewOrganism - Organism Component
 * 
 * Activity stream view showing chronological events.
 * Displays user actions with filtering capabilities.
 * 
 * Features:
 * - Chronological activity feed
 * - Filter by user and action type
 * - Grouped by date
 * - Action icons and colors
 * - User avatars
 * 
 * Usage:
 * <ActivityViewOrganism 
 *   data={activityItems} 
 *   columns={schema}
 *   onItemClick={handleClick}
 * />
 */

interface ActivityItem {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  timestamp: string
  metadata?: any
}

export interface ActivityViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
}

export function ActivityViewOrganism({ data, schema, onItemClick }: ActivityViewOrganismProps) {
  const t = useTranslations()
  const [filterByUser, setFilterByUser] = useState<string[]>([])
  const [filterByAction, setFilterByAction] = useState<string[]>([])

  // Convert data to activity items
  const activities: ActivityItem[] = data.map((item: any) => ({
    id: item.id,
    userId: item.user_id || "system",
    userName: item.user_name || "System",
    action: item.action || "created",
    entity: item.entity_type || "item",
    timestamp: item.created_at || new Date().toISOString(),
    metadata: item.metadata,
  }))

  // Get unique users and actions for filters
  const users = Array.from(new Set(activities.map((a: any) => a.userName)))
  const actions = Array.from(new Set(activities.map((a: any) => a.action)))

  // Apply filters
  const filteredActivities = activities.filter((activity: any) => {
    if (filterByUser.length > 0 && !filterByUser.includes(activity.userName)) {
      return false
    }
    if (filterByAction.length > 0 && !filterByAction.includes(activity.action)) {
      return false
    }
    return true
  })

  // Group by date
  const groupedActivities = filteredActivities.reduce((acc: Record<string, ActivityItem[]>, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(activity)
    return acc
  }, {})

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created":
        return <Plus className="h-3 w-3" aria-hidden="true" />
      case "updated":
        return <Edit className="h-3 w-3" aria-hidden="true" />
      case "deleted":
        return <Trash2 className="h-3 w-3" aria-hidden="true" />
      case "commented":
        return <MessageSquare className="h-3 w-3" aria-hidden="true" />
      default:
        return <ActivityIcon className="h-3 w-3" aria-hidden="true" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "created":
        return "text-green-500"
      case "updated":
        return "text-blue-500"
      case "deleted":
        return "text-red-500"
      case "commented":
        return "text-purple-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" aria-hidden="true" />
          <h3 className="font-semibold">Activity Stream</h3>
          <Badge variant="secondary">{filteredActivities.length} events</Badge>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                Filter
                {(filterByUser.length > 0 || filterByAction.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {filterByUser.length + filterByAction.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="max-h-[400px] overflow-y-auto p-1">
                <DropdownMenuLabel>Filter by User</DropdownMenuLabel>
                {users.map((user: any) => (
                  <DropdownMenuCheckboxItem
                    key={user}
                    checked={filterByUser.includes(user)}
                    onCheckedChange={(checked) => {
                      setFilterByUser((prev) =>
                        checked ? [...prev, user] : prev.filter((u: any) => u !== user)
                      )
                    }}
                  >
                    {user}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Filter by Action</DropdownMenuLabel>
                {actions.map((action: any) => (
                  <DropdownMenuCheckboxItem
                    key={action}
                    checked={filterByAction.includes(action)}
                    onCheckedChange={(checked) => {
                      setFilterByAction((prev) =>
                        checked ? [...prev, action] : prev.filter((a: any) => a !== action)
                      )
                    }}
                  >
                    {action}
                  </DropdownMenuCheckboxItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Activity Stream */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              <div className="sticky top-0 bg-background/95 backdrop-blur py-2 mb-4 border-b">
                <h4 className="font-semibold text-sm">{date}</h4>
              </div>
              <div className="space-y-4">
                {activities.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="flex gap-3 hover:bg-accent p-3 -mx-3 rounded-lg transition-colors cursor-pointer"
                    onClick={() => onItemClick?.(data.find((d: any) => d.id === activity.id)!)}
                  >
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarFallback>
                        {activity.userName.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{activity.userName}</span>
                        <div className={cn("flex items-center gap-1", getActionColor(activity.action))}>
                          {getActionIcon(activity.action)}
                          <span className="text-sm">{activity.action}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.entity}</span>
                      </div>
                      {activity.metadata?.comment && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          &ldquo;{activity.metadata.comment}&rdquo;
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
