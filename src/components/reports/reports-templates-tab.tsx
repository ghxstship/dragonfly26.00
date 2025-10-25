"use client"

import { FileStack, Star, Download, Eye, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { useReportsData } from "@/hooks/use-reports-data"

const templates = [
  { 
    id: "1", 
    nameKey: "executive_summary_template", 
    descriptionKey: "highlevel_overview_for_stakeholders",
    categoryKey: "executive",
    uses: 234,
    rating: 4.8,
    tags: ["Performance", "KPIs", "Summary"]
  },
  { 
    id: "2", 
    nameKey: "operational_daily_report", 
    descriptionKey: "daytoday_operations_tracking",
    categoryKey: "operational",
    uses: 567,
    rating: 4.9,
    tags: ["Daily", "Operations", "Metrics"]
  },
  { 
    id: "3", 
    nameKey: "compliance_audit_report", 
    descriptionKey: "regulatory_compliance_documentation",
    categoryKey: "compliance",
    uses: 89,
    rating: 4.7,
    tags: ["Audit", "Compliance", "Legal"]
  },
  { 
    id: "4", 
    nameKey: "financial_performance", 
    descriptionKey: "revenue_expenses_and_profitability",
    categoryKey: "executive",
    uses: 445,
    rating: 4.9,
    tags: ["Finance", "Revenue", "P&L"]
  },
  { 
    id: "5", 
    nameKey: "customer_insights_report", 
    descriptionKey: "customer_behavior_and_satisfaction",
    categoryKey: "custom",
    uses: 178,
    rating: 4.6,
    tags: ["Customer", "Analytics", "Insights"]
  },
  { 
    id: "6", 
    nameKey: "project_status_update", 
    descriptionKey: "project_progress_and_milestones",
    categoryKey: "operational",
    uses: 312,
    rating: 4.8,
    tags: ["Projects", "Status", "Timeline"]
  },
]

interface ReportsTemplatesTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ReportsTemplatesTab({ data = [], loading = false }: ReportsTemplatesTabProps) {
  const t = useTranslations('intelligence.reports.templates')
  const tCommon = useTranslations('common')
  const displayTemplates = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {templates.map((template: any) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow" role="article" aria-label={`Template: ${t(template.nameKey)}`}>
            <CardHeader>
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                <FileStack className="h-8 w-8 text-blue-600" aria-hidden="true" />
                <Badge variant="secondary" aria-label={`Category: ${t(template.categoryKey)}`}>{t(template.categoryKey)}</Badge>
              </div>
              <CardTitle className="mt-4" id={`template-${template.id}`}>{t(template.nameKey)}</CardTitle>
              <CardDescription>{t(template.descriptionKey)}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag: any) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm text-muted-foreground">
                  <div className="flex flex-col md:flex-row items-center gap-1" aria-label={`Rating: ${template.rating} out of 5`}>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-1" aria-label={`${template.uses} uses`}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                    <span>{template.uses} {t('uses')}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="flex-1" size="sm" aria-label={`${t('useTemplate')}: ${t(template.nameKey)}`}>
                    {t('useTemplate')}
                  </Button>
                  <Button variant="outline" size="sm" aria-label={`${t('previewTemplate')}: ${t(template.nameKey)}`}>
                    <Eye className="h-4 w-4" aria-hidden="true" />
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
