"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ChevronDown, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"
import { getDisplayValue, getAssigneeValue } from "@/lib/schema-helpers"

/**
 * WorkloadViewOrganism - Organism Component
 * 
 * Team workload view showing capacity and allocation per user.
 * Groups items by assignee with expandable sections.
 * 
 * Features:
 * - Groups by assignee
 * - Shows capacity vs allocated hours
 * - Visual utilization bars
 * - Expandable user sections
 * - Overallocation warnings
 * 
 * Usage:
 * <WorkloadViewOrganism 
 *   data={items} 
 *   columns={schema}
 *   onItemClick={handleClick}
 * />
 */

interface UserWorkload {
  user: string
  userId: string
  userName: string
  capacity: number
  allocated: number
  items: DataItem[]
}

export interface WorkloadViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function WorkloadViewOrganism({ 
  data, 
  schema, 
  onItemClick, 
  createActionLabel, 
  onCreateAction 
}: WorkloadViewOrganismProps) {
  const t = useTranslations()
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  // Group data by assignee
  const userWorkloads: UserWorkload[] = data.reduce((acc: UserWorkload[], item: DataItem) => {
    const userId = getAssigneeValue(item, schema) || "unassigned"
    const userName = item.assignee_name || "Unassigned"
    
    let userWorkload = acc.find((w: UserWorkload) => w.userId === userId)
    if (!userWorkload) {
      userWorkload = {
        user: userId,
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
        <div className="border rounded-lg">
          <EmptyState
            variant="inline"
            mainMessage={t('views.emptyState.nothingToSeeYet')}
            description={t('views.emptyState.workloadViewDescription')}
            actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
            onAction={onCreateAction}
          />
        </div>
      ) : (
        userWorkloads.map((workload: any) => {
        const isExpanded = expandedUsers.has(workload.userId)
        const utilizationPercent = Math.round((workload.allocated / workload.capacity) * 100)
        const isOverallocated = workload.allocated > workload.capacity

        return (
          <div key={workload.userId} className="border rounded-lg">
            {/* User Header */}
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 p-4 bg-muted/50 border-b hover:bg-muted/70 transition-colors">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => toggleUser(workload.userId)}
                aria-label={isExpanded ? "Collapse user" : "Expand user"}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
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

              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                {/* Capacity Bar */}
                <div className="w-48">
                  <div className="flex flex-wrap justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className={getUtilizationColor(workload.allocated, workload.capacity)}>
                      {workload.allocated}h / {workload.capacity}h
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
                    <div
                      className={cn(
                        "h-full transition-all",
                        isOverallocated ? "bg-red-500" : "bg-green-500"
                      )}
                      style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                      aria-hidden="true"
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
                {workload.items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row items-center gap-3 p-3 hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => onItemClick?.(item)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{getDisplayValue(item, schema)}</div>
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
