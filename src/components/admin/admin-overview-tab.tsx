"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  ArrowDownRight,
  Plus
} from "lucide-react"

export function AdminOverviewTab() {
  const t = useTranslations()
  const stats = [
    {
      label: t('admin.totalMembers'),
      value: "42",
      change: "+3",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      label: t('admin.activeProjects'),
      value: "18",
      change: "+2",
      trend: "up",
      icon: FolderKanban,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      label: t('admin.eventsThisMonth'),
      value: "127",
      change: "-5",
      trend: "down",
      icon: Calendar,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-950",
    },
    {
      label: t('admin.monthlySpend'),
      value: "$24.5k",
      change: "+12%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
  ]

  const recentActivity = [
    { user: t('admin.mockData.user1'), action: t('admin.mockData.action1'), project: t('admin.mockData.project1'), time: "5 minutes ago", type: "create" },
    { user: t('admin.mockData.user2'), action: t('admin.mockData.action2'), project: t('admin.mockData.project2'), time: "12 minutes ago", type: "update" },
    { user: t('admin.mockData.user3'), action: t('admin.mockData.action3'), project: t('admin.mockData.project3'), time: "1 hour ago", type: "complete" },
    { user: t('admin.mockData.user4'), action: t('admin.mockData.action4'), project: t('admin.mockData.project4'), time: "2 hours ago", type: "member" },
    { user: t('admin.mockData.user5'), action: t('admin.mockData.action5'), project: t('admin.mockData.project5'), time: "3 hours ago", type: "event" },
  ]

  const systemHealth = [
    { metric: t('admin.systemHealth.apiResponseTime'), value: "145ms", status: "healthy", icon: Clock },
    { metric: t('admin.systemHealth.storageUsed'), value: "64%", status: "warning", icon: AlertCircle },
    { metric: t('admin.systemHealth.activeSessions'), value: "38", status: "healthy", icon: Activity },
    { metric: t('admin.systemHealth.uptime'), value: "99.9%", status: "healthy", icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {t('admin.overview.statsUpdated')}
      </div>
        {stats.map((stat: any) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardHeader aria-hidden="true" className="pb-3">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <CardDescription aria-hidden="true" className="text-xs">{stat.label}</CardDescription>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon aria-hidden="true" className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex flex-wrap items-end justify-between">
                  <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{stat.value}</CardTitle>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.trend === "up" ? (
                      <ArrowUpRight aria-hidden="true" className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDownRight aria-hidden="true" className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle aria-hidden="true" className="text-base">{t('admin.recentActivity')}</CardTitle>
            <CardDescription>{t('admin.recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    (activity as any).type === "complete" ? "bg-green-500" :
                    (activity as any).type === "create" ? "bg-blue-500" :
                    (activity as any).type === "update" ? "bg-yellow-500" :
                    (activity as any).type === "member" ? "bg-purple-500" :
                    "bg-gray-500"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{(activity as any).user}</span>{" "}
                      <span className="text-muted-foreground">{(activity as any).action}</span>{" "}
                      <span className="font-medium">{(activity as any).project}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{(activity as any).time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle aria-hidden="true" className="text-base">{t('admin.systemHealth')}</CardTitle>
            <CardDescription>{t('admin.systemHealthDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemHealth.map((item: any) => {
                const Icon = item.icon
                return (
                  <div key={item.metric} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 border rounded-lg">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                      <Icon aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{item.metric}</p>
                        <p className="text-xs text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                    <Badge variant={(item as any).status === "healthy" ? "default" : "secondary"}>
                      {(item as any).status === "healthy" ? (
                        <>
                          <CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" />
                          {t('admin.healthy')}
                        </>
                      ) : (
                        <>
                          <AlertCircle aria-hidden="true" className="h-3 w-3 mr-1" />
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
          <CardTitle aria-hidden="true" className="text-base">This Month&apos;s Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground mt-1">Tasks Completed</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">23</p>
              <p className="text-xs text-muted-foreground mt-1">New Assets</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">89%</p>
              <p className="text-xs text-muted-foreground mt-1">On-Time Delivery</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">4.8</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Rating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
