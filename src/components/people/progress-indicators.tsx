"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  showPercentage?: boolean
  variant?: "default" | "success" | "warning" | "error"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showPercentage = true,
  variant = "default",
  size = "md",
  className
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  const variantClasses = {
    default: "[&>div]:bg-primary",
    success: "[&>div]:bg-green-500",
    warning: "[&>div]:bg-yellow-500",
    error: "[&>div]:bg-red-500"
  }

  const sizeClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  }

  return (
    <div className="space-y-1">
      <Progress 
        value={percentage} 
        className={cn(
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
      />
      {showPercentage && (
        <div className="flex flex-wrap justify-between text-xs text-muted-foreground">
          <span>{value} / {max}</span>
          <span>{percentage}%</span>
        </div>
      )}
    </div>
  )
}

// Onboarding Progress Card
interface OnboardingProgressProps {
  personnelName: string
  overallProgress: number
  tasks: Array<{
    category: string
    completed: number
    total: number
    status?: "completed" | "in_progress" | "pending"
  }>
  onViewDetails?: () => void
  onMarkComplete?: () => void
}

export function OnboardingProgressCard({
  personnelName,
  overallProgress,
  tasks,
  onViewDetails,
  onMarkComplete
}: OnboardingProgressProps) {
  return (
    <Card>
      <CardHeader aria-hidden="true" className="pb-3">
        <CardTitle aria-hidden="true" className="text-sm flex flex-wrap flex-col md:flex-row items-center gap-2">
          <span className="text-muted-foreground">📋</span>
          Onboarding: {personnelName}
        </CardTitle>
      </CardHeader>
      <CardContent aria-hidden="true" className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{overallProgress}%</span>
          </div>
          <ProgressBar 
            value={overallProgress} 
            variant={overallProgress === 100 ? "success" : "default"}
            showPercentage={false}
          />
        </div>

        {/* Task Breakdown */}
        <div className="space-y-3">
          {tasks.map((task, i) => {
            const taskProgress = Math.round((task.completed / task.total) * 100)
            const isComplete = task.completed === task.total

            return (
              <div key={i} className="space-y-1">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    {isComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : task.status === "in_progress" ? (
                      <Clock aria-hidden="true" className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Clock aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className={cn(
                      "font-medium",
                      isComplete && "text-muted-foreground"
                    )}>
                      {task.category}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {task.completed}/{task.total}
                  </span>
                </div>
                <ProgressBar 
                  value={taskProgress} 
                  variant={isComplete ? "success" : "default"}
                  size="sm"
                  showPercentage={false}
                />
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" className="flex-1" onClick={onViewDetails}>
              View Details
            </Button>
          )}
          {onMarkComplete && overallProgress === 100 && (
            <Button size="sm" className="flex-1" onClick={onMarkComplete}>
              <CheckCircle2 className="h-4 w-4 mr-1 flex-shrink-0" />
              Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Goal Progress Card
interface GoalProgressProps {
  goalTitle: string
  progress: number
  status: "not_started" | "in_progress" | "at_risk" | "completed"
  targetDate?: string
  keyResults?: Array<{
    title: string
    completed: boolean
  }>
  onViewDetails?: () => void
}

export function GoalProgressCard({
  goalTitle,
  progress,
  status,
  targetDate,
  keyResults = [],
  onViewDetails
}: GoalProgressProps) {
  const statusConfig = {
    not_started: { label: "Not Started", variant: "outline", color: "text-muted-foreground" },
    in_progress: { label: "In Progress", variant: "default", color: "text-blue-500" },
    at_risk: { label: "At Risk", variant: "destructive", color: "text-red-500" },
    completed: { label: "Completed", variant: "default", color: "text-green-500" }
  }

  const config = statusConfig[status]

  return (
    <Card>
      <CardHeader aria-hidden="true" className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle aria-hidden="true" className="text-sm line-clamp-2">{goalTitle}</CardTitle>
          <Badge variant={config.variant as any} className="ml-2">
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent aria-hidden="true" className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>
          <ProgressBar 
            value={progress} 
            variant={status === "completed" ? "success" : status === "at_risk" ? "error" : "default"}
            showPercentage={false}
          />
        </div>

        {/* Target Date */}
        {targetDate && (
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs">
            <span className="text-muted-foreground">Target Date</span>
            <span className="font-medium">{targetDate}</span>
          </div>
        )}

        {/* Key Results */}
        {keyResults.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground font-medium">Key Results</span>
            {keyResults.map((kr, i) => (
              <div key={i} className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm">
                {kr.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded border border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={cn(
                  "text-xs",
                  kr.completed && "line-through text-muted-foreground"
                )}>
                  {kr.title}
                </span>
              </div>
            ))}
          </div>
        )}

        {onViewDetails && (
          <Button variant="ghost" size="sm" className="w-full max-w-full" onClick={onViewDetails}>
            View Details
            <ArrowRight aria-hidden="true" className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Circular Progress Indicator
export function CircularProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  label,
  className
}: {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-all duration-300"
        />
      </svg>
      <div className="absolute sm:relative sm:inset-auto inset-0 flex flex-wrap flex-col items-center justify-center sm:relative sm:inset-auto">
        <span className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{Math.round(percentage)}%</span>
        {label && <span className="text-xs text-muted-foreground">{label}</span>}
      </div>
    </div>
  )
}
