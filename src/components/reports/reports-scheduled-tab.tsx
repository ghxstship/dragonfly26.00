"use client"

import { Calendar, Clock, Mail, Users, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useReportsData } from "@/hooks/use-reports-data"

const scheduledReports = [
  {
    id: "1",
    nameKey: "weekly_performance_summary",
    frequency: "Weekly",
    schedule: "Every Monday at 9:00 AM",
    recipients: ["executive@company.com", "managers@company.com"],
    lastRun: "2025-10-07 09:00",
    nextRun: "2025-10-14 09:00",
    enabled: true,
    format: "PDF"
  },
  {
    id: "2",
    nameKey: "daily_operations_report",
    frequency: "Daily",
    schedule: "Every day at 8:00 AM",
    recipients: ["operations@company.com"],
    lastRun: "2025-10-10 08:00",
    nextRun: "2025-10-11 08:00",
    enabled: true,
    format: "Excel"
  },
  {
    id: "3",
    nameKey: "monthly_financial_report",
    frequency: "Monthly",
    schedule: "1st of every month at 7:00 AM",
    recipients: ["finance@company.com", "cfo@company.com"],
    lastRun: "2025-10-01 07:00",
    nextRun: "2025-11-01 07:00",
    enabled: true,
    format: "PDF"
  },
  {
    id: "4",
    nameKey: "quarterly_board_report",
    frequency: "Quarterly",
    schedule: "First Monday of quarter at 10:00 AM",
    recipients: ["board@company.com"],
    lastRun: "2025-07-01 10:00",
    nextRun: "2025-10-07 10:00",
    enabled: false,
    format: "PDF + Excel"
  },
]

interface ReportsScheduledTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ReportsScheduledTab({ data = [], loading = false }: ReportsScheduledTabProps) {
  const t = useTranslations('intelligence.reports.scheduled')
  const tCommon = useTranslations('common')
  const displayReports = data || []
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {scheduledReports.map((report: any) => (
          <Card key={report.id} role="article" aria-label={`Scheduled report: ${t(report.nameKey)}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle id={`report-${report.id}`}>{t(report.nameKey)}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1" aria-label={`Frequency: ${report.frequency}`}>
                      <Calendar className="h-3 w-3" aria-hidden="true" />
                      {report.frequency}
                    </span>
                    <span className="flex items-center gap-1" aria-label={`Schedule: ${report.schedule}`}>
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {report.schedule}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={report.enabled ? "default" : "secondary"} aria-label={`Status: ${report.enabled ? t('active') : t('paused')}`}>
                    {report.enabled ? t('active') : t('paused')}
                  </Badge>
                  <Switch checked={report.enabled} aria-label={`Toggle ${t(report.nameKey)}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('lastRun')}</p>
                    <p className="text-sm" aria-label={`Last run: ${report.lastRun}`}>{report.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t('nextRun')}</p>
                    <p className="text-sm" aria-label={`Next run: ${report.nextRun}`}>{report.nextRun}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" aria-hidden="true" />
                    {t('recipients')} ({report.recipients.length})
                  </p>
                  <div className="flex flex-wrap gap-2" role="list" aria-label="Report recipients">
                    {report.recipients.map((email: any, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs" role="listitem">
                        <Mail className="h-3 w-3 mr-1" aria-hidden="true" />
                        {email as string}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {t('format')}: <span className="font-medium text-foreground">{report.format}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
