"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileBarChart, Star, Calendar, Download, Eye, Plus, Clock, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { useMyReports } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyReportsTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.my-reports')
  const tCommon = useTranslations('common')
  const { reports, loading } = useMyReports(workspaceId, userId)
  

  
  const reportsList = reports.map(report => ({
    id: report.id,
    name: report.name || 'Report',
    type: 'custom',
    category: 'General',
    isFavorite: false,
    isRecurring: report.schedule_enabled || false,
    frequency: report.schedule_cron || undefined,
    lastGenerated: report.last_run_at ? new Date(report.last_run_at).toLocaleDateString() : new Date(report.created_at).toLocaleDateString(),
    nextScheduled: undefined,
    format: 'PDF',
    icon: FileBarChart,
    description: report.description || '',
    fileSize: '1 MB',
    views: 0,
  }))
  
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

  const summary = {
    totalReports: 24,
    favorites: 4,
    recurring: 4,
    custom: 18,
    thisMonth: 12,
  }

  const categories = [
    { nameKey: "performance", count: 8, color: "bg-purple-500" },
    { nameKey: "financial", count: 6, color: "bg-green-500" },
    { nameKey: "assets", count: 4, color: "bg-blue-500" },
    { nameKey: "travel", count: 3, color: "bg-cyan-500" },
    { nameKey: "other", count: 3, color: "bg-gray-500" },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "custom":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400"
      case "subscribed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "shared":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case "PDF":
        return "text-red-600"
      case "Excel":
        return "text-green-600"
      case "CSV":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{summary.totalReports}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-yellow-600">{summary.favorites}</p>
              <p className="text-xs text-muted-foreground mt-1">Favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">{summary.recurring}</p>
              <p className="text-xs text-muted-foreground mt-1">Recurring</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-purple-600">{summary.custom}</p>
              <p className="text-xs text-muted-foreground mt-1">Custom</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{summary.thisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            {categories.map((category: any) => (
              <div
                key={t(category.nameKey)}
                className="p-4 border rounded-lg text-center hover:bg-accent transition-colors cursor-pointer"
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-2`} />
                <p className="font-semibold">{category.count}</p>
                <p className="text-xs text-muted-foreground">{t(category.nameKey)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportsList.map((report: any) => {
              const Icon = report.icon
              return (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/reports/templates?id=${report.id}`)}
                >
                  <div className="flex flex-wrap flex-col md:flex-row items-start justify-between gap-2 md:gap-3 lg:gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded">
                            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                          </div>
                          <div>
                            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                              <h3 className="font-semibold">{report.name}</h3>
                              {report.isFavorite && (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {report.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                        <Badge variant="outline">
                          {report.category}
                        </Badge>
                        <Badge variant="outline" className={getFormatColor(report.format)}>
                          {report.format}
                        </Badge>
                        {report.isRecurring && (
                          <Badge variant="outline" className="text-blue-600">
                            <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                            {report.frequency}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{t('lastGenerated')}: {report.lastGenerated}</span>
                        {report.nextScheduled && (
                          <>
                            <span>•</span>
                            <span>{t('next')}: {report.nextScheduled}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{report.fileSize}</span>
                        <span>•</span>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          <Eye className="h-4 w-4" aria-hidden="true" />
                          {report.views} {t('views')}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap flex-col gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        {tCommon('download')}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        {tCommon('view')}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-wrap flex-col md:flex-row flex-col items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" aria-hidden="true" />
              <span className="text-sm">{t('performanceReport')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-wrap flex-col md:flex-row flex-col items-center gap-2">
              <PieChart className="h-4 w-4 text-green-600" aria-hidden="true" />
              <span className="text-sm">{t('financialReport')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-wrap flex-col md:flex-row flex-col items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span className="text-sm">{t('assetsReport')}</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-wrap flex-col md:flex-row flex-col items-center gap-2">
              <Calendar className="h-4 w-4 text-cyan-600" aria-hidden="true" />
              <span className="text-sm">{t('timeReport')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </main>
  )
}
