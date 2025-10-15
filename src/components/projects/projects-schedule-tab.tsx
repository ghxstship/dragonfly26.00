"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Plus,
  Download
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function ProjectsScheduleTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: tasks, loading } = useModuleData(workspaceId, 'projects', 'schedule')
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading schedule...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in_progress': return 'bg-blue-500'
      case 'at_risk': return 'bg-yellow-500'
      case 'blocked': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 border-l-4'
      case 'high': return 'border-orange-500 border-l-4'
      case 'normal': return 'border-blue-500 border-l-4'
      case 'low': return 'border-gray-300 border-l-4'
      default: return ''
    }
  }

  // Calculate task positioning
  const calculateTaskBar = (task: any) => {
    const start = new Date(task.start_date)
    const end = new Date(task.end_date)
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const progress = task.progress || 0
    
    return { start, end, duration, progress }
  }

  // Group tasks by project/phase
  const groupedTasks = tasks.reduce((acc: any, task: any) => {
    const group = task.project_name || 'Unassigned'
    if (!acc[group]) acc[group] = []
    acc[group].push(task)
    return acc
  }, {})

  const criticalPath = tasks.filter((t: any) => t.is_critical_path)
  const blockedTasks = tasks.filter((t: any) => t.status === 'blocked')
  const completedTasks = tasks.filter((t: any) => t.status === 'completed')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Schedule</h2>
          <p className="text-muted-foreground">
            Gantt chart timeline with dependencies and critical path
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {completedTasks.length} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Path</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalPath.length}</div>
            <p className="text-xs text-muted-foreground">Tasks on critical path</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{blockedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Timeline View</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode('day')}>
                Day
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode('week')}>
                Week
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode('month')}>
                Month
              </Button>
              <div className="border-l pl-2 ml-2 flex gap-1">
                <Button variant="ghost" size="icon">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="border-l pl-2 ml-2 flex gap-1">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Today
                </Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gantt Chart Area */}
          <div className="space-y-4">
            {Object.entries(groupedTasks).map(([project, projectTasks]: [string, any]) => (
              <div key={project} className="space-y-2">
                <div className="font-semibold text-sm text-muted-foreground">{project}</div>
                {projectTasks.map((task: any) => {
                  const { duration, progress } = calculateTaskBar(task)
                  
                  return (
                    <div
                      key={task.id}
                      className={`relative min-h-14 rounded-lg border bg-card p-3 hover:shadow-md transition-shadow ${getPriorityColor(task.priority)}`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Task Info */}
                        <div className="flex-1 min-w-48">
                          <div className="font-medium text-sm">{task.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className={`${getStatusColor(task.status)} text-white text-xs`}>
                              {task.status}
                            </Badge>
                            {task.is_critical_path && (
                              <Badge variant="outline" className="text-xs border-red-500 text-red-500">
                                Critical
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Timeline Bar */}
                        <div className="flex-1 min-w-96">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{new Date(task.start_date).toLocaleDateString()}</span>
                              <span>{duration} days</span>
                              <span>{new Date(task.end_date).toLocaleDateString()}</span>
                            </div>
                            <div className="relative h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className={`absolute inset-y-0 left-0 ${getStatusColor(task.status)} opacity-80`}
                                style={{ width: `${progress}%` }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                                {progress}%
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Assignee */}
                        {task.assignee && (
                          <div className="flex-shrink-0 w-32">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Users className="h-3 w-3" />
                              <span className="truncate">{task.assignee}</span>
                            </div>
                          </div>
                        )}

                        {/* Dependencies */}
                        {task.dependencies && task.dependencies.length > 0 && (
                          <div className="flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              {task.dependencies.length} deps
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Critical Path Alert */}
      {criticalPath.length > 0 && (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Path Items
            </CardTitle>
            <CardDescription>
              These tasks directly impact the project end date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {criticalPath.slice(0, 5).map((task: any) => (
                <div key={task.id} className="flex items-center justify-between p-2 rounded border">
                  <span className="font-medium">{task.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{task.status}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(task.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {tasks.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schedule Yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start by adding tasks to create your project timeline
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Task
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
