"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  FolderKanban, 
  Calendar,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export function AdminOverviewTab() {
  const stats = [
    {
      label: "Total Members",
      value: "42",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: "Active Projects",
      value: "18",
      change: "+2",
      trend: "up",
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: "Events This Month",
      value: "127",
      change: "-5",
      trend: "down",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: "Monthly Spend",
      value: "$24.5k",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
  ]

  const recentActivity = [
    { user: "Sarah Johnson", action: "created a new project", project: "Summer Festival 2024", time: "5 minutes ago", type: "create" },
    { user: "Mike Chen", action: "updated budget for", project: "Corporate Gala", time: "12 minutes ago", type: "update" },
    { user: "Emily Rodriguez", action: "completed milestone in", project: "Product Launch", time: "1 hour ago", type: "complete" },
    { user: "David Kim", action: "added 3 new members to", project: "Tour 2024", time: "2 hours ago", type: "member" },
    { user: "Lisa Anderson", action: "scheduled event for", project: "Conference Setup", time: "3 hours ago", type: "event" },
  ]

  const systemHealth = [
    { metric: "API Response Time", value: "145ms", status: "healthy", icon: Clock },
    { metric: "Storage Used", value: "64%", status: "warning", icon: AlertCircle },
    { metric: "Active Sessions", value: "38", status: "healthy", icon: Activity },
    { metric: "Uptime", value: "99.9%", status: "healthy", icon: CheckCircle2 },
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
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest actions across your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.type === "complete" ? "bg-green-500" :
                    activity.type === "create" ? "bg-blue-500" :
                    activity.type === "update" ? "bg-yellow-500" :
                    activity.type === "member" ? "bg-purple-500" :
                    "bg-red-500"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>{" "}
                      <span className="font-medium">{activity.project}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Health</CardTitle>
            <CardDescription>Current system status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.metric} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.metric}</p>
                        <p className="text-xs text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                    <Badge variant={item.status === "healthy" ? "default" : "secondary"}>
                      {item.status === "healthy" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Healthy
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Warning
                        </>
                      )}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">This Month&apos;s Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">23</p>
              <p className="text-xs text-muted-foreground mt-1">New Assets</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-xs text-muted-foreground mt-1">On-Time Delivery</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-2xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
