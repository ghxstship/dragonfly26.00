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

interface DashboardOverviewTabProps {
  data?: any[]
  loading?: boolean
}

export function DashboardOverviewTab({ data = [], loading = false }: DashboardOverviewTabProps) {
  // Quick stats for user's personal dashboard
  const stats = data.length > 0 ? data : [
    {
      label: "Tasks Due Today",
      value: "8",
      change: "+2",
      trend: "up",
      icon: CheckSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Upcoming Events",
      value: "5",
      change: "This week",
      trend: "neutral",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Active Jobs",
      value: "3",
      change: "In progress",
      trend: "neutral",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Pending Expenses",
      value: "$1,240",
      change: "Awaiting approval",
      trend: "neutral",
      icon: Receipt,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
  ]

  // Widget suggestions for customizable dashboard
  const widgetTypes = [
    { name: "My Tasks", icon: CheckSquare, color: "bg-purple-500" },
    { name: "My Calendar", icon: Calendar, color: "bg-red-500" },
    { name: "Recent Files", icon: FolderOpen, color: "bg-blue-500" },
    { name: "Expense Summary", icon: Receipt, color: "bg-green-500" },
    { name: "Travel Schedule", icon: Plane, color: "bg-cyan-500" },
    { name: "My Reports", icon: FileBarChart, color: "bg-violet-500" },
  ]

  // Quick actions for the user
  const quickActions = [
    { label: "Log Expense", icon: Receipt, color: "text-green-600" },
    { label: "Book Travel", icon: Plane, color: "text-cyan-600" },
    { label: "Create Task", icon: CheckSquare, color: "text-purple-600" },
    { label: "Upload File", icon: FolderOpen, color: "text-blue-600" },
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
