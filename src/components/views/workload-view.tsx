"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronRight, User as UserIcon, Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"

interface WorkloadViewProps {
  data: DataItem[]
  onItemClick?: (item: DataItem) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

interface UserWorkload {
  userId: string
  userName: string
  capacity: number
  allocated: number
  items: DataItem[]
}

export function WorkloadView({ data, onItemClick, createActionLabel, onCreateAction }: WorkloadViewProps) {
  const t = useTranslations()
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  // Group data by assignee
  const userWorkloads: UserWorkload[] = data.reduce((acc, item) => {
    const userId = item.assignee || "unassigned"
    const userName = item.assignee_name || "Unassigned"
    
    let userWorkload = acc.find((w) => w.userId === userId)
    if (!userWorkload) {
      userWorkload = {
        userId,
        userName,
        capacity: 40, // hours per week
        allocated: 0,
        items: [],
      }
      acc.push(userWorkload)
    }
    
    const estimate = item.estimate || 0
    userWorkload.allocated += estimate
    userWorkload.items.push(item)
    
    return acc
  }, [] as UserWorkload[])

  const toggleUser = (userId: string) => {
    setExpandedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  const getUtilizationColor = (allocated: number, capacity: number) => {
    const percentage = (allocated / capacity) * 100
    if (percentage > 100) return "text-red-500"
    if (percentage > 80) return "text-orange-500"
    return "text-green-500"
  }

  return (
    <div className="space-y-4">
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-lg">
          <h3 className="text-xl font-bold mb-2">{t('views.emptyState.nothingToSeeYet')}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            {t('views.emptyState.workloadViewDescription')}
          </p>
          {(createActionLabel || onCreateAction) && (
            <Button size="lg" onClick={onCreateAction}>
              <Plus className="h-4 w-4 mr-2" />
              {createActionLabel || t('views.emptyState.createFirstItem')}
            </Button>
          )}
        </div>
      ) : (
        userWorkloads.map((workload) => {
        const isExpanded = expandedUsers.has(workload.userId)
        const utilizationPercent = Math.round((workload.allocated / workload.capacity) * 100)
        const isOverallocated = workload.allocated > workload.capacity

        return (
          <div key={workload.userId} className="border rounded-lg">
            {/* User Header */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 border-b hover:bg-muted/70 transition-colors">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleUser(workload.userId)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>

              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {workload.userName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="font-semibold">{workload.userName}</div>
                <div className="text-sm text-muted-foreground">
                  {workload.items.length} {workload.items.length === 1 ? "task" : "tasks"}
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Capacity Bar */}
                <div className="w-48">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className={getUtilizationColor(workload.allocated, workload.capacity)}>
                      {workload.allocated}h / {workload.capacity}h
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all",
                        isOverallocated ? "bg-red-500" : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                    />
                  </div>
                </div>

                <Badge variant={isOverallocated ? "destructive" : "secondary"}>
                  {utilizationPercent}%
                </Badge>
              </div>
            </div>

            {/* User's Items */}
            {isExpanded && (
              <div className="divide-y">
                {workload.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{item.name || item.title || "Untitled"}</div>
                      {item.description && (
                        <div className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </div>
                      )}
                    </div>

                    {item.estimate && (
                      <Badge variant="outline">{item.estimate}h</Badge>
                    )}

                    {item.due_date && (
                      <div className="text-sm text-muted-foreground">
                        {new Date(item.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })
      )}
    </div>
  )
}
