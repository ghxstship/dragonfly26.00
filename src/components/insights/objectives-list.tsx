"use client"

import { useTranslations } from "next-intl"
import { TrendingUp, TrendingDown, Minus, Calendar, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"
import type { Goal } from "@/types"

interface GoalsListProps {
  goals: Goal[]
  onGoalClick: (goal: Goal) => void
  onGoalUpdate: (goal: Goal) => void
}

const STATUS_CONFIG = {
  not_started: { label: "Not Started", color: "text-gray-500", bg: "bg-gray-100" },
  on_track: { label: "On Track", color: "text-green-600", bg: "bg-green-100" },
  at_risk: { label: "At Risk", color: "text-yellow-600", bg: "bg-yellow-100" },
  behind: { label: "Behind", color: "text-red-600", bg: "bg-red-100" },
  completed: { label: "Completed", color: "text-blue-600", bg: "bg-blue-100" },
}

export function ObjectivesList({ goals, onGoalClick, onGoalUpdate }: GoalsListProps) {
  const t = useTranslations()
  const getProgress = (goal: Goal) => {
    if (!goal.target_value) return 0
    return Math.min(100, Math.round((goal.current_value / goal.target_value) * 100))
  }

  const formatValue = (value: number, type: string, unit?: string) => {
    if (type === "currency") {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: unit || 'USD',
      }).format(value)
    }
    if (type === "percentage") {
      return `${value}%`
    }
    return `${value}${unit ? ` ${unit}` : ""}`
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getTrendIcon = (goal: Goal) => {
    const progress = getProgress(goal)
    const daysTotal = Math.ceil((new Date(goal.end_date).getTime() - new Date(goal.start_date).getTime()) / (1000 * 60 * 60 * 24))
    const daysPassed = Math.ceil((new Date().getTime() - new Date(goal.start_date).getTime()) / (1000 * 60 * 60 * 24))
    const expectedProgress = (daysPassed / daysTotal) * 100

    if (progress > expectedProgress) {
      return <TrendingUp className="h-4 w-4 text-green-600" />
    } else if (progress < expectedProgress - 10) {
      return <TrendingDown className="h-4 w-4 text-red-600" />
    }
    return <Minus className="h-4 w-4 text-yellow-600" />
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => {
        const progress = getProgress(goal)
        const statusConfig = STATUS_CONFIG[goal.status]
        const daysRemaining = getDaysRemaining(goal.end_date)

        return (
          <Card
            key={goal.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onGoalClick(goal)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{goal.name}</h3>
                    {getTrendIcon(goal)}
                  </div>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </div>

                <div className={cn("px-3 py-1 rounded-full text-xs font-medium", statusConfig.bg, statusConfig.color)}>
                  {statusConfig.label}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">
                    {formatValue(goal.current_value, goal.type, goal.unit)}
                  </span>
                  <span className="text-muted-foreground">
                    of {formatValue(goal.target_value || 0, goal.type, goal.unit)}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progress}% complete</span>
                  <span>{formatValue(goal.target_value! - goal.current_value, goal.type, goal.unit)} remaining</span>
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
                  </span>
                </div>

                {goal.owner && (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={goal.owner.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {getInitials(goal.owner.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{goal.owner.name}</span>
                  </div>
                )}

                {goal.linked_items.length > 0 && (
                  <span>{goal.linked_items.length} linked items</span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}

      {goals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first goal to start tracking objectives
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
