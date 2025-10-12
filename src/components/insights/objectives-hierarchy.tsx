"use client"

import { ChevronRight, ChevronDown } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import type { Goal } from "@/types"

interface GoalsHierarchyProps {
  goals: Goal[]
  onGoalClick: (goal: Goal) => void
}

export function ObjectivesHierarchy({ goals, onGoalClick }: GoalsHierarchyProps) {
  const t = useTranslations()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // Build hierarchy
  const topLevelGoals = goals.filter((g) => !g.parent_goal_id)
  const childGoalsMap = new Map<string, Goal[]>()
  
  goals.forEach((goal) => {
    if (goal.parent_goal_id) {
      if (!childGoalsMap.has(goal.parent_goal_id)) {
        childGoalsMap.set(goal.parent_goal_id, [])
      }
      childGoalsMap.get(goal.parent_goal_id)!.push(goal)
    }
  })

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const getProgress = (goal: Goal) => {
    if (!goal.target_value) return 0
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
  }

  const renderGoal = (goal: Goal, level: number = 0) => {
    const children = childGoalsMap.get(goal.id) || []
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(goal.id)
    const progress = getProgress(goal)

    return (
      <div key={goal.id}>
        <div
          className={cn(
            "flex items-center gap-2 p-3 border rounded-lg hover:bg-accent cursor-pointer mb-2",
            level > 0 && "ml-8"
          )}
          onClick={() => onGoalClick(goal)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpanded(goal.id)
              }}
              className="p-1 hover:bg-accent rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}

          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{goal.name}</div>
            <div className="flex items-center gap-4 mt-2">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {children.map((child) => renderGoal(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {topLevelGoals.map((goal) => renderGoal(goal))}
      
      {topLevelGoals.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No goals to display
        </div>
      )}
    </div>
  )
}
