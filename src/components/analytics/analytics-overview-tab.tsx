"use client"

import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

interface AnalyticsOverviewTabProps {
  data?: any[]
  loading?: boolean
}

const metrics = [
  { 
    labelKey: "total_revenue", 
    value: "$2.4M", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    labelKey: "active_users", 
    value: "14,234", 
    change: "+8.2%", 
    trend: "up",
    icon: Users, 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    labelKey: "conversion_rate", 
    value: "3.24%", 
    change: "-0.4%", 
    trend: "down",
    icon: Target, 
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  { 
    labelKey: "avg_session_duration", 
    value: "4m 32s", 
    change: "+15.3%", 
    trend: "up",
    icon: Activity, 
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
]

const kpis = [
  { nameKey: "customer_satisfaction", current: 87, target: 90, unit: "%" },
  { nameKey: "project_completion_rate", current: 94, target: 95, unit: "%" },
  { nameKey: "resource_utilization", current: 78, target: 85, unit: "%" },
  { nameKey: "quality_score", current: 92, target: 95, unit: "%" },
]

export function AnalyticsOverviewTab({ data = [], loading = false }: AnalyticsOverviewTabProps) {
  const t = useTranslations('intelligence.analytics.overview')
  const displayMetrics = data.length > 0 ? data : metrics
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric: any, index: number) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          
          return (
            <Card key={index} role="region" aria-label={`${t(metric.labelKey)} metric`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} aria-hidden="true" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} aria-label={`Change: ${metric.change}`}>
                    <TrendIcon className="h-4 w-4" aria-hidden="true" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t(metric.labelKey)}</p>
                  <p className="text-2xl font-bold mt-1" aria-live="polite">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* KPI Progress */}
      <Card role="region" aria-labelledby="kpi-title">
        <CardHeader>
          <CardTitle id="kpi-title">{t('keyPerformanceIndicators')}</CardTitle>
          <CardDescription>{t('kpiDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {kpis.map((kpi, index) => {
              const percentage = (kpi.current / kpi.target) * 100
              const isOnTrack = kpi.current >= kpi.target * 0.9
              
              return (
                <div key={index} className="space-y-2" role="article" aria-label={`${t(kpi.nameKey)} KPI`}>
                  <div className="flex items-center justify-between">
                    <p className="font-medium" id={`kpi-${index}`}>{t(kpi.nameKey)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold" aria-labelledby={`kpi-${index}`}>{kpi.current}{kpi.unit}</span>
                      <span className="text-sm text-muted-foreground">/ {kpi.target}{kpi.unit}</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" aria-label={`${t(kpi.nameKey)} progress: ${Math.round(percentage)}%`} />
                  <p className="text-xs text-muted-foreground">
                    {isOnTrack ? `✓ ${t('onTrack')}` : `⚠ ${t('needsAttention')}`} • {Math.round(kpi.target - kpi.current)}{kpi.unit} {t('toTarget')}
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
