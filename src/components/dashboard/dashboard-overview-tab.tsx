"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard,
  Calendar,
  CheckSquare,
  Briefcase,
  Package,
  TrendingUp,
  Plane,
  Receipt,
  FileBarChart,
  FolderOpen,
  Plus,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMyTasks, useMyAgenda, useMyJobs, useMyExpenses } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardOverviewTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  
  // Fetch data from multiple hooks
  const { tasks, loading: tasksLoading } = useMyTasks(workspaceId, userId)
  const { events, loading: eventsLoading } = useMyAgenda(workspaceId, userId)
  const { jobs, loading: jobsLoading } = useMyJobs(workspaceId, userId)
  const { expenses, loading: expensesLoading } = useMyExpenses(workspaceId, userId)
  
  const loading = tasksLoading || eventsLoading || jobsLoading || expensesLoading
  
  // Calculate real stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tasksDueToday = tasks.filter(t => {
    if (!t.due_date) return false
    const dueDate = new Date(t.due_date)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate.getTime() === today.getTime()
  }).length
  
  const upcomingEvents = events.filter(e => {
    const eventDate = new Date(e.start_time)
    return eventDate >= today
  }).length
  
  const activeJobs = jobs.filter(j => j.status === 'active').length
  
  const pendingExpenses = expenses.filter(e => e.status === 'pending' || e.status === 'submitted').length
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  // Use real stats from Supabase data
  const stats = [
    {
      label: "Tasks Due Today",
      value: tasksDueToday.toString(),
      change: "+2",
      trend: "up",
      icon: CheckSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.toString(),
      change: "+1",
      trend: "up",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Active Jobs",
      value: activeJobs.toString(),
      change: "0",
      trend: "neutral",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Pending Expenses",
      value: pendingExpenses.toString(),
      change: "-1",
      trend: "down",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
  ]

  // Widget suggestions for customizable dashboard
  const widgetTypes = [
    { id: 1, name: "My Tasks", icon: CheckSquare, color: "bg-purple-500", route: `/workspace/${workspaceId}/dashboard/my-tasks` },
    { id: 2, name: "My Agenda", icon: Calendar, color: "bg-red-500", route: `/workspace/${workspaceId}/dashboard/my-agenda` },
    { id: 3, name: "My Jobs", icon: Briefcase, color: "bg-blue-500", route: `/workspace/${workspaceId}/dashboard/my-jobs` },
    { id: 4, name: "My Assets", icon: Package, color: "bg-orange-500", route: `/workspace/${workspaceId}/dashboard/my-assets` },
    { id: 5, name: "My Expenses", icon: Receipt, color: "bg-green-500", route: `/workspace/${workspaceId}/dashboard/my-expenses` },
    { id: 6, name: "My Reports", icon: FileBarChart, color: "bg-cyan-500", route: `/workspace/${workspaceId}/dashboard/my-reports` },
  ]

  const quickActions = [
    { label: "Log Expense", icon: Receipt, color: "text-green-600", action: () => router.push(`/workspace/${workspaceId}/finance/expenses`) },
    { label: "Book Travel", icon: Plane, color: "text-blue-600", action: () => {} },
    { label: "Create Task", icon: CheckSquare, color: "text-purple-600", action: () => router.push(`/workspace/${workspaceId}/projects/tasks`) },
    { label: "Upload File", icon: FolderOpen, color: "text-orange-600", action: () => router.push(`/workspace/${workspaceId}/files/all-documents`) },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-xs">{stat.label}</CardDescription>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2"
                  >
                    <Icon className={`h-5 w-5 ${action.color}`} />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Customize Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customize Dashboard</CardTitle>
            <CardDescription>Add widgets to personalize your view</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {widgetTypes.map((widget) => {
                const Icon = widget.icon
                return (
                  <div
                    key={widget.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${widget.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{widget.name}</span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Week&apos;s Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">24</p>
              <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground mt-1">Events Attended</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">$3.2k</p>
              <p className="text-xs text-muted-foreground mt-1">Expenses Submitted</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">18</p>
              <p className="text-xs text-muted-foreground mt-1">Files Uploaded</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
