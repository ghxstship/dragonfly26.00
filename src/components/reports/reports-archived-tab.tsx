"use client"

import { Archive, Search, Filter, Calendar, Download, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

const archivedReports = [
  { id: "1", nameKey: "q3_2024_financial_report", type: "Executive", archivedDate: "2024-10-15", size: "4.2 MB", year: "2024" },
  { id: "2", nameKey: "annual_compliance_audit_2023", type: "Compliance", archivedDate: "2024-01-30", size: "8.7 MB", year: "2023" },
  { id: "3", nameKey: "project_completion_summary_q2_2024", type: "Operational", archivedDate: "2024-07-05", size: "2.1 MB", year: "2024" },
  { id: "4", nameKey: "customer_satisfaction_report_2023", type: "Custom", archivedDate: "2024-01-15", size: "3.4 MB", year: "2023" },
  { id: "5", nameKey: "board_meeting_report__june_2024", type: "Executive", archivedDate: "2024-07-10", size: "5.8 MB", year: "2024" },
  { id: "6", nameKey: "q1_2024_operations_overview", type: "Operational", archivedDate: "2024-04-15", size: "3.2 MB", year: "2024" },
  { id: "7", nameKey: "gdpr_compliance_report_2023", type: "Compliance", archivedDate: "2024-02-01", size: "6.1 MB", year: "2023" },
  { id: "8", nameKey: "strategic_plan_review_2023", type: "Executive", archivedDate: "2023-12-31", size: "9.3 MB", year: "2023" },
]

interface ReportsArchivedTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsArchivedTab({ data = [], loading = false }: ReportsArchivedTabProps) {
  const t = useTranslations('intelligence.reports.archived')
  const tCommon = useTranslations('common')
  const displayReports = data || []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <Button size="sm" aria-label={`${tCommon('create')} report`}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {tCommon('create')}
        </Button>
      </div>


      {/* Search and Filter Bar */}
      <Card role="search" aria-label="Search archived reports">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input placeholder={t('searchPlaceholder')} className="pl-10" aria-label="Search reports" />
            </div>
            <Button variant="outline" size="icon" aria-label={tCommon('filter')}>
              <Filter className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex gap-2" role="group" aria-label="Filter by year">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" role="button" tabIndex={0}>2024 ({archivedReports.filter(r => r.year === "2024").length})</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" role="button" tabIndex={0}>2023 ({archivedReports.filter(r => r.year === "2023").length})</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent" role="button" tabIndex={0}>{t('allReports')} ({archivedReports.length})</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card role="region" aria-label={`${t('totalArchived')} metric`}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('totalArchived')}</p>
            <p className="text-2xl font-bold mt-1" aria-live="polite">{archivedReports.length}</p>
          </CardContent>
        </Card>
        <Card role="region" aria-label={`${t('executive')} reports metric`}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('executive')}</p>
            <p className="text-2xl font-bold mt-1 text-purple-600" aria-live="polite">
              {archivedReports.filter(r => r.type === "Executive").length}
            </p>
          </CardContent>
        </Card>
        <Card role="region" aria-label={`${t('compliance')} reports metric`}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('compliance')}</p>
            <p className="text-2xl font-bold mt-1 text-green-600" aria-live="polite">
              {archivedReports.filter(r => r.type === "Compliance").length}
            </p>
          </CardContent>
        </Card>
        <Card role="region" aria-label={`${t('operational')} reports metric`}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('operational')}</p>
            <p className="text-2xl font-bold mt-1 text-orange-600" aria-live="polite">
              {archivedReports.filter(r => r.type === "Operational").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Archived Reports List */}
      <div className="space-y-2">
        {archivedReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow" role="article" aria-label={`Archived report: ${t(report.nameKey)}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Archive className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  <div className="flex-1">
                    <h3 className="font-semibold" id={`report-${report.id}`}>{t(report.nameKey)}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1" aria-label={`Type: ${report.type}, Archived: ${report.archivedDate}, Size: ${report.size}`}>
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {t('archived')} {report.archivedDate}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" aria-label={`${t('view')} ${t(report.nameKey)}`}>
                    {t('view')}
                  </Button>
                  <Button variant="outline" size="sm" aria-label={`${t('download')} ${t(report.nameKey)}`}>
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('download')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
