"use client"

import { Shield, AlertCircle, CheckCircle2, Clock, Download, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

const complianceReports = [
  {
    id: "1",
    nameKey: "gdpr_compliance_report",
    categoryKey: "data_privacy",
    status: "current",
    lastGenerated: "2025-10-01",
    nextDue: "2025-11-01",
    frequency: "Monthly",
    requirement: "EU General Data Protection Regulation"
  },
  {
    id: "2",
    nameKey: "soc_2_type_ii_audit",
    categoryKey: "security",
    status: "current",
    lastGenerated: "2025-09-15",
    nextDue: "2026-09-15",
    frequency: "Annual",
    requirement: "SOC 2 Compliance"
  },
  {
    id: "3",
    nameKey: "financial_audit_report",
    categoryKey: "financial",
    status: "current",
    lastGenerated: "2025-07-01",
    nextDue: "2025-10-01",
    frequency: "Quarterly",
    requirement: "Standard Accounting Practices"
  },
  {
    id: "4",
    nameKey: "safety_compliance_report",
    categoryKey: "workplace_safety",
    status: "due_soon",
    lastGenerated: "2025-09-01",
    nextDue: "2025-10-15",
    frequency: "Monthly",
    requirement: "OSHA Standards"
  },
  {
    id: "5",
    nameKey: "iso_27001_certification",
    categoryKey: "information_security",
    status: "current",
    lastGenerated: "2025-01-01",
    nextDue: "2026-01-01",
    frequency: "Annual",
    requirement: "ISO 27001 Standard"
  },
  {
    id: "6",
    nameKey: "environmental_impact_report",
    categoryKey: "environmental",
    status: "overdue",
    lastGenerated: "2025-06-01",
    nextDue: "2025-09-01",
    frequency: "Quarterly",
    requirement: "Environmental Regulations"
  },
]

interface ReportsComplianceTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsComplianceTab({ data = [], loading = false }: ReportsComplianceTabProps) {
  const t = useTranslations('intelligence.reports.compliance')
  const tCommon = useTranslations('common')
  const displayData = data || []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <Button size="sm" aria-label={`${tCommon('create')} compliance report`}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {tCommon('create')}
        </Button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card role="region" aria-label={`${t('current')} reports metric`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('current')}</p>
                <p className="text-2xl font-bold mt-1 text-green-600" aria-live="polite">
                  {complianceReports.filter(r => r.status === "current").length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card role="region" aria-label={`${t('dueSoon')} reports metric`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('dueSoon')}</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600" aria-live="polite">
                  {complianceReports.filter(r => r.status === "due_soon").length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card role="region" aria-label={`${t('overdue')} reports metric`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('overdue')}</p>
                <p className="text-2xl font-bold mt-1 text-red-600" aria-live="polite">
                  {complianceReports.filter(r => r.status === "overdue").length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>

        <Card role="region" aria-label={`${t('totalReports')} metric`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('totalReports')}</p>
                <p className="text-2xl font-bold mt-1" aria-live="polite">{complianceReports.length}</p>
              </div>
              <Shield className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Reports List */}
      <div className="space-y-3">
        {complianceReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Shield className="h-8 w-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{t(report.nameKey)}</h3>
                      <Badge 
                        variant={report.status === "current" ? "default" : report.status === "due_soon" ? "secondary" : "destructive"}
                        className={
                          report.status === "current" ? "bg-green-600" : 
                          report.status === "due_soon" ? "bg-yellow-600" : 
                          "bg-red-600"
                        }
                      >
                        {report.status === "current" ? t('current') : report.status === "due_soon" ? t('dueSoon') : t('overdue')}
                      </Badge>
                      <Badge variant="outline">{t(report.categoryKey)}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('lastGenerated')}</p>
                        <p className="font-medium" aria-label={`Last generated: ${report.lastGenerated}`}>{report.lastGenerated}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('nextDue')}</p>
                        <p className="font-medium" aria-label={`Next due: ${report.nextDue}`}>{report.nextDue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('frequency')}</p>
                        <p className="font-medium" aria-label={`Frequency: ${report.frequency}`}>{report.frequency}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <p className="text-sm font-medium mb-2">{t('requirement')}</p>
                      <p className="text-sm text-muted-foreground">{report.requirement}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" aria-label={`${t('generate')} ${t(report.nameKey)}`}>
                        <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                        {t('generate')}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" aria-label={`${t('download')} ${t(report.nameKey)}`}>
                        {t('download')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
