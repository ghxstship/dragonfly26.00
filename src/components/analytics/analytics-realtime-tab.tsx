"use client"

import { Waves, Activity, Users, Zap, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
const realtimeMetrics = [
  { labelKey: "active_users", value: "1,234", change: "+45 in last minute", status: "up" },
  { labelKey: "requestssec", value: "847", change: "+12% vs avg", status: "up" },
  { labelKey: "response_time", value: "124ms", change: "-8ms vs avg", status: "down" },
  { labelKey: "error_rate", value: "0.03%", change: "Normal", status: "stable" },
]

const recentEvents = [
  { id: "1", type: "user_signup", message: "New user registered", time: "2 seconds ago", severity: "info" },
  { id: "2", type: "purchase", message: "$2,450 transaction completed", time: "5 seconds ago", severity: "success" },
  { id: "3", type: "api_call", message: "API endpoint accessed", time: "7 seconds ago", severity: "info" },
  { id: "4", type: "user_action", message: "Dashboard viewed by user", time: "12 seconds ago", severity: "info" },
  { id: "5", type: "alert", message: "High CPU usage detected", time: "18 seconds ago", severity: "warning" },
  { id: "6", type: "purchase", message: "$890 transaction completed", time: "23 seconds ago", severity: "success" },
  { id: "7", type: "user_signup", message: "New user registered", time: "31 seconds ago", severity: "info" },
  { id: "8", type: "api_call", message: "Data export requested", time: "45 seconds ago", severity: "info" },
]

interface AnalyticsRealtimeTabProps {
  data?: any[]
  loading?: boolean
}

export function AnalyticsRealtimeTab({ data = [], loading = false }: AnalyticsRealtimeTabProps) {
  const t = useTranslations('intelligence.analytics.analyticsrealtime')
  const tCommon = useTranslations('common')

  const displayMetrics = data || []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <Button size="sm" aria-label={`${tCommon('create')} item`}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {tCommon('create')}
        </Button>
      </div>


      {/* Real-time Metrics */}
      <div className="grid grid-cols-4 gap-4">
        {realtimeMetrics.map((metric, index) => (
          <Card key={index} className="border-2">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-muted-foreground">{t(metric.labelKey)}</p>
                {metric.status === "up" && <Activity className="h-4 w-4 text-green-600" aria-hidden="true" />}
                {metric.status === "down" && <Zap className="h-4 w-4 text-blue-600" aria-hidden="true" />}
                {metric.status === "stable" && <div className="h-2 w-2 rounded-full bg-gray-400"></div>}
              </div>
              <p className="text-3xl font-bold mb-2">{metric.value}</p>
              <p className={`text-xs ${
                metric.status === "up" ? "text-green-600" : 
                metric.status === "down" ? "text-blue-600" : 
                "text-gray-600"
              }`}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" aria-hidden="true" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  event.severity === "success" ? "bg-green-600" :
                  event.severity === "warning" ? "bg-yellow-600" :
                  event.severity === "error" ? "bg-red-600" :
                  "bg-blue-600"
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{event.type}</p>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{event.time}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>{t('systemStatus')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t('database')}</p>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t('healthy')}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Latency: 12ms</p>
                <p>Connections: 234/500</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t('apiServer')}</p>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t('healthy')}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Uptime: 99.98%</p>
                <p>Load: 45%</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{t('cache')}</p>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{t('healthy')}</Badge>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Hit Rate: 94%</p>
                <p>Memory: 2.1GB/4GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
