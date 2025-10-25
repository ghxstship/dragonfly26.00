"use client"

import { Activity, Clock, CheckCircle2, AlertTriangle, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useReportsData } from "@/hooks/use-reports-data"

const operationalReports = [
  {
    id: "1",
    titleKey: "daily_operations_summary",
    frequency: "Daily at 6:00 PM",
    metrics: {
      completed: 45,
      inProgress: 23,
      blocked: 3,
      efficiency: 87
    },
    lastRun: "Today at 6:00 PM",
    trend: "up"
  },
  {
    id: "2",
    titleKey: "team_performance_report",
    frequency: "Weekly on Monday",
    metrics: {
      completed: 234,
      inProgress: 67,
      blocked: 12,
      efficiency: 82
    },
    lastRun: "Oct 7, 2025",
    trend: "up"
  },
  {
    id: "3",
    titleKey: "resource_utilization",
    frequency: "Daily at 8:00 AM",
    metrics: {
      completed: 156,
      inProgress: 89,
      blocked: 8,
      efficiency: 78
    },
    lastRun: "Today at 8:00 AM",
    trend: "down"
  },
  {
    id: "4",
    titleKey: "project_status_updates",
    frequency: "Weekly on Friday",
    metrics: {
      completed: 18,
      inProgress: 42,
      blocked: 5,
      efficiency: 91
    },
    lastRun: "Oct 4, 2025",
    trend: "up"
  },
  {
    id: "5",
    titleKey: "quality_metrics_dashboard",
    frequency: "Daily at 5:00 PM",
    metrics: {
      completed: 89,
      inProgress: 34,
      blocked: 2,
      efficiency: 94
    },
    lastRun: "Today at 5:00 PM",
    trend: "stable"
  },
]

interface ReportsOperationalTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ReportsOperationalTab({ data = [], loading = false }: ReportsOperationalTabProps) {
  const t = useTranslations('intelligence.reports.operational')
  const tCommon = useTranslations('common')
  const displayData = data.length > 0 ? data : []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card role="region" aria-label={`${t('totalReports')} metric`}>
          <CardContent className="p-4">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalReports')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">{operationalReports.length}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        
        <Card role="region" aria-label={`${t('avgEfficiency')} metric`}>
          <CardContent className="p-4">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('avgEfficiency')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-green-600" aria-live="polite">
                  {Math.round(operationalReports.reduce((sum: number, r) => sum + r.metrics.efficiency, 0) / operationalReports.length)}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card role="region" aria-label={`${t('itemsBlocked')} metric`}>
          <CardContent className="p-4">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('itemsBlocked')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-red-600" aria-live="polite">
                  {operationalReports.reduce((sum: number, r) => sum + r.metrics.blocked, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card role="region" aria-label={`${t('inProgress')} metric`}>
          <CardContent className="p-4">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('inProgress')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-blue-600" aria-live="polite">
                  {operationalReports.reduce((sum: number, r) => sum + r.metrics.inProgress, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Reports Grid */}
      <div className="grid gap-2 md:gap-3 lg:gap-4">
        {operationalReports.map((report: any) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow" role="article" aria-label={`Operational report: ${t(report.titleKey)}`}>
            <CardHeader>
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg" id={`report-${report.id}`}>{t(report.titleKey)}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex flex-col md:flex-row items-center gap-1" aria-label={`Frequency: ${report.frequency}`}>
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {report.frequency}
                  </p>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Badge variant="outline" className={
                    report.trend === "up" ? "bg-green-100 text-green-800 border-green-200" :
                    report.trend === "down" ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-gray-100 text-gray-800 border-gray-200"
                  } aria-label={`Trend: ${report.trend === "up" ? t('improving') : report.trend === "down" ? t('declining') : t('stable')}`}>
                    {report.trend === "up" ? `↑ ${t('improving')}` : report.trend === "down" ? `↓ ${t('declining')}` : `→ ${t('stable')}`}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
                <div className="text-center" aria-label={`${report.metrics.completed} ${t('completed')}`}>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{report.metrics.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('completed')}</p>
                </div>
                <div className="text-center" aria-label={`${report.metrics.inProgress} ${t('inProgress')}`}>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">{report.metrics.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('inProgress')}</p>
                </div>
                <div className="text-center" aria-label={`${report.metrics.blocked} ${t('blocked')}`}>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-red-600">{report.metrics.blocked}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('blocked')}</p>
                </div>
                <div className="text-center" aria-label={`${report.metrics.efficiency}% ${t('efficiency')}`}>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-purple-600">{report.metrics.efficiency}%</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('efficiency')}</p>
                </div>
                <div className="text-center border-l pl-4">
                  <p className="text-sm font-medium">{t('lastRun')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{report.lastRun}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
