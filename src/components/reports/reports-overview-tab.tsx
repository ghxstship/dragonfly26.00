"use client"

import { FileText, Download, Calendar, TrendingUp, Plus, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

const recentReports = [
  { id: "1", nameKey: "q4_performance_summary", type: "Executive", generated: "2025-10-10", size: "2.4 MB", downloads: 45 },
  { id: "2", nameKey: "weekly_operations_report", type: "Operational", generated: "2025-10-09", size: "1.8 MB", downloads: 23 },
  { id: "3", nameKey: "compliance_audit_2025", type: "Compliance", generated: "2025-10-08", size: "5.2 MB", downloads: 12 },
  { id: "4", nameKey: "customer_satisfaction_analysis", type: "Custom", generated: "2025-10-07", size: "3.1 MB", downloads: 34 },
  { id: "5", nameKey: "monthly_financial_report", type: "Executive", generated: "2025-10-05", size: "4.6 MB", downloads: 67 },
]

interface StatItem {
  labelKey: string
  value: string
  change: string
  icon: LucideIcon
  color: string
}

const useStats = (t: (key: string) => string): StatItem[] => [
  { labelKey: "reportsGenerated", value: "142", change: "+12%", icon: FileText, color: "text-blue-600" },
  { labelKey: "totalDownloads", value: "1,284", change: "+8%", icon: Download, color: "text-green-600" },
  { labelKey: "scheduledReports", value: "28", change: "+3", icon: Calendar, color: "text-purple-600" },
  { labelKey: "avgGenerationTime", value: "2.4s", change: "-0.3s", icon: TrendingUp, color: "text-orange-600" },
]

interface ReportsOverviewTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ReportsOverviewTab({ data = [], loading = false }: ReportsOverviewTabProps) {
  const t = useTranslations('intelligence.reports.overview')
  const tCommon = useTranslations('common')
  const stats = useStats(t)
  const displayReports = data || []
  
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {stats.map((stat, index: number) => {
          const Icon = stat.icon
          return (
            <Card key={index} role="region" aria-label={`${t(stat.labelKey)} metric`}>
              <CardContent aria-hidden="true" className="p-4 sm:p-6">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground" id={`stat-label-${index}`}>{t(stat.labelKey)}</p>
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-2" aria-labelledby={`stat-label-${index}`} aria-live="polite">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1" aria-label={`Change: ${stat.change}`}>{stat.change}</p>
                  </div>
                  <Icon aria-hidden="true" className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Reports */}
      <Card role="region" aria-labelledby="recent-reports-title">
        <CardHeader>
          <CardTitle id="recent-reports-title">{t('recentReports')}</CardTitle>
          <CardDescription>{t('recentReportsDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report: any) => (
              <div 
                key={report.id} 
                className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                role="article"
                aria-label={`Report: ${t(report.nameKey)}`}
              >
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                  <FileText aria-hidden="true" className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium" id={`report-name-${report.id}`}>{t(report.nameKey)}</p>
                    <p className="text-sm text-muted-foreground" aria-label={`Type: ${report.type}, Generated: ${report.generated}, Size: ${report.size}`}>
                      {report.type} • {t('generated')} {report.generated} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground" aria-label={`${report.downloads} downloads`}>{report.downloads} {t('downloads')}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    aria-label={`Download ${t(report.nameKey)}`}
                    onClick={() => {}}
                  >
                    <Download aria-hidden="true" className="h-4 w-4 mr-2" />
                    {t('downloadAction')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
