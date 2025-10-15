"use client"

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
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tasks...</p>
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => router.push(`/workspace/${workspaceId}/projects/tasks`)}
          >
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">4</p>
              <p className="text-xs text-muted-foreground mt-1">Due Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">3</p>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">3</p>
              <p className="text-xs text-muted-foreground mt-1">Created by You</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">42</p>
              <p className="text-xs text-muted-foreground mt-1">Completed This Week</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasksList.map((task) => (
              <div
                key={task.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => router.push(`/workspace/${workspaceId}/projects/tasks?id=${task.id}`)}
              >
                <div className="flex items-start gap-4">
                  <Checkbox 
                    checked={task.completed}
                    className="mt-1"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.project}</p>
                      </div>
                      {task.isCreator && (
                        <Badge variant="outline" className="text-xs">
                          Creator
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm">
                      <div className={`flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : 'text-muted-foreground'}`}>
                        <Calendar className="h-3.5 w-3.5" />
                        {task.dueDate}
                      </div>
                      
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <User className="h-3.5 w-3.5" />
                        {task.assignedBy}
                      </div>

                      <div className={`flex items-center gap-1 font-medium ${getPriorityColor(task.priority)}`}>
                        <Flag className="h-3.5 w-3.5" />
                        {task.priority}
                      </div>

                      <Badge variant="secondary" className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>

                      {task.subtasks.total > 0 && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <CheckSquare className="h-3.5 w-3.5" />
                          {task.subtasks.completed}/{task.subtasks.total} subtasks
                        </div>
                      )}
                    </div>

                    {task.subtasks.total > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
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

      {/* Productivity Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Week&apos;s Productivity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">42</p>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-muted-foreground mt-1">Active</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">94%</p>
              <p className="text-xs text-muted-foreground mt-1">On-Time Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
