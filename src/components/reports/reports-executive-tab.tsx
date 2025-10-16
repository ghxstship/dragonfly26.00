"use client"

import { Crown, TrendingUp, DollarSign, Users, Target, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"

const executiveReports = [
  {
    id: "1",
    titleKey: "ceo_monthly_dashboard",
    descriptionKey: "companywide_performance_overview",
    metrics: ["Revenue", "Growth", "Customer Acquisition", "Market Share"],
    lastUpdated: "2025-10-10",
    recipients: ["CEO", "Board of Directors"],
    status: "ready"
  },
  {
    id: "2",
    titleKey: "board_of_directors_quarterly_report",
    descriptionKey: "comprehensive_quarterly_business_review",
    metrics: ["Financial Performance", "Strategic Initiatives", "Risk Assessment", "Market Position"],
    lastUpdated: "2025-10-01",
    recipients: ["Board Members"],
    status: "ready"
  },
  {
    id: "3",
    titleKey: "cfo_financial_summary",
    descriptionKey: "detailed_financial_performance_and_forecasting",
    metrics: ["P&L", "Cash Flow", "Budget vs Actual", "Financial Projections"],
    lastUpdated: "2025-10-09",
    recipients: ["CFO", "Finance Committee"],
    status: "ready"
  },
  {
    id: "4",
    titleKey: "strategic_plan_progress_report",
    descriptionKey: "progress_against_3year_strategic_plan",
    metrics: ["Strategic Goals", "KPIs", "Milestones", "Roadmap"],
    lastUpdated: "2025-09-30",
    recipients: ["Executive Team"],
    status: "ready"
  },
]

const kpiSummary = [
  { nameKey: "revenue_growth", value: "+12.5%", target: "+15%", progress: 83, status: "on_track" },
  { nameKey: "customer_retention", value: "94%", target: "95%", progress: 99, status: "on_track" },
  { nameKey: "market_share", value: "18.2%", target: "20%", progress: 91, status: "on_track" },
  { nameKey: "operating_margin", value: "22%", target: "25%", progress: 88, status: "at_risk" },
]

interface ReportsExecutiveTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsExecutiveTab({ data = [], loading = false }: ReportsExecutiveTabProps) {
  const t = useTranslations('intelligence.reports.executive')
  const tCommon = useTranslations('common')
  const displayData = data || []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <Button size="sm" aria-label={`${tCommon('create')} executive report`}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {tCommon('create')}
        </Button>
      </div>


      {/* KPI Summary Dashboard */}
      <Card role="region" aria-labelledby="kpi-summary-title">
        <CardHeader>
          <CardTitle id="kpi-summary-title">{t('executiveKPISummary')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {kpiSummary.map((kpi: any, index: number) => (
              <div key={index} className="space-y-2" role="article" aria-label={`KPI: ${t(kpi.nameKey)}`}>
                <div className="flex items-center justify-between">
                  <p className="font-medium" id={`kpi-${index}`}>{t(kpi.nameKey)}</p>
                  <Badge variant={kpi.status === "on_track" ? "default" : "secondary"} className={kpi.status === "on_track" ? "bg-green-600" : "bg-yellow-600"} aria-label={`Status: ${kpi.status === "on_track" ? t('onTrack') : t('atRisk')}`}>
                    {kpi.status === "on_track" ? t('onTrack') : t('atRisk')}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold" aria-labelledby={`kpi-${index}`}>{kpi.value}</span>
                  <span className="text-sm text-muted-foreground" aria-label={`Target: ${kpi.target}`}>/ {kpi.target}</span>
                </div>
                <Progress value={kpi.progress} className="h-2" aria-label={`${t(kpi.nameKey)} progress: ${kpi.progress}%`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Reports List */}
      <div className="grid gap-4">
        {executiveReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow" role="article" aria-label={`Executive report: ${t(report.titleKey)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-purple-600" aria-hidden="true" />
                    <h3 className="font-semibold text-lg" id={`report-${report.id}`}>{t(report.titleKey)}</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200" aria-label={`Status: ${report.status}`}>
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{t(report.descriptionKey)}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t('keyMetrics')}</p>
                      <div className="flex flex-wrap gap-2">
                        {report.metrics.map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{t('recipients')}</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        <span className="text-sm" aria-label={`Recipients: ${report.recipients.join(", ")}`}>{report.recipients.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {t('lastUpdated')}: {report.lastUpdated}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button aria-label={`${t('viewReport')}: ${t(report.titleKey)}`}>
                    <Target className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('viewReport')}
                  </Button>
                  <Button variant="outline" aria-label={`${t('customize')}: ${t(report.titleKey)}`}>
                    <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('customize')}
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
