"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  CheckSquare,
  Calendar,
  AlertCircle,
  Flag,
  Plus,
  Filter,
  User
} from "lucide-react"
import { useMyTasks } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyTasksTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.tasks')
  const tCommon = useTranslations('common')
  const { tasks, loading } = useMyTasks(workspaceId, userId)
  
  // Transform real data
  const tasksList = tasks.map(task => ({
    id: task.id,
    title: task.title || task.name,
    project: task.production?.name || 'No Project',
    dueDate: task.due_date ? new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date',
    priority: task.priority || 'medium',
    status: task.status || 'pending',
    assignedBy: task.created_by === userId ? 'You' : 'Team',
    isCreator: task.created_by === userId,
    completed: task.status === 'completed',
    subtasks: { total: 0, completed: 0 },
  }))
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const isOverdue = (dueDate: string) => {
    return dueDate.includes("Today") || dueDate.includes("Yesterday")
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Stats */}
      <section role="region" aria-labelledby="tasks-stats">
        <h2 id="tasks-stats" className="sr-only">{t('summaryStats')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold text-red-600" aria-label={t('tasksDueToday', { count: 4 })}>4</p>
              <p className="text-xs text-muted-foreground mt-1">{t('dueToday')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold text-blue-600" aria-label={t('tasksInProgress', { count: 3 })}>3</p>
              <p className="text-xs text-muted-foreground mt-1">{t('inProgress')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold text-purple-600" aria-label={t('tasksCreatedByYou', { count: 3 })}>3</p>
              <p className="text-xs text-muted-foreground mt-1">{t('createdByYou')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold text-green-600" aria-label={t('tasksCompletedThisWeek', { count: 42 })}>42</p>
              <p className="text-xs text-muted-foreground mt-1">{t('completedThisWeek')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>

      {/* Tasks List */}
      <section role="region" aria-labelledby="tasks-list">
        <Card>
          <CardHeader>
            <CardTitle id="tasks-list" className="text-base">{t('allTasks')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasksList.map((task: any) => (
              <div
                key={task.id}
                role="button"
                tabIndex={0}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
                onClick={() => router.push(`/workspace/${workspaceId}/projects/tasks?id=${task.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    router.push(`/workspace/${workspaceId}/projects/tasks?id=${task.id}`)
                  }
                }}
                aria-label={t('viewTask', { title: task.title || 'Task' })}
              >
                <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 md:gap-3 lg:gap-4">
                  <Checkbox 
                    checked={task.completed}
                    className="mt-1"
                    aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.project}</p>
                      </div>
                      {task.isCreator && (
                        <Badge variant="outline" className="text-xs">
                          {t('creator')}
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-3 text-sm">
                      <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {task.dueDate}
                      </div>
                      
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                        <User className="h-3.5 w-3.5" aria-hidden="true" />
                        {task.assignedBy}
                      </div>

                      <div className={`flex items-center gap-1 font-medium ${getPriorityColor(task.priority)}`}>
                        <Flag className="h-3.5 w-3.5" aria-hidden="true" />
                        {task.priority}
                      </div>

                      <Badge variant="secondary" className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>

                      {task.subtasks.total > 0 && (
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-muted-foreground">
                          <CheckSquare className="h-3.5 w-3.5" aria-hidden="true" />
                          {task.subtasks.completed}/{task.subtasks.total} {t('subtasks')}
                        </div>
                      )}
                    </div>

                    {task.subtasks.total > 0 && (
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden md:block">
                          <div 
                            className="h-full bg-blue-500 transition-all"
                            style={{ width: `${(task.subtasks.completed / task.subtasks.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {Math.round((task.subtasks.completed / task.subtasks.total) * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </section>

      {/* Productivity Stats */}
      <section role="region" aria-labelledby="productivity-heading">
        <Card>
          <CardHeader>
            <CardTitle id="productivity-heading" className="text-base">{t('thisWeeksProductivity')}</CardTitle>
          </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-label="42 completed">42</p>
              <p className="text-xs text-muted-foreground mt-1">{t('completed')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-label="7 active">7</p>
              <p className="text-xs text-muted-foreground mt-1">{t('active')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-label="94% on-time rate">94%</p>
              <p className="text-xs text-muted-foreground mt-1">{t('onTimeRate')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      </section>
      </div>
    </main>
  )
}
