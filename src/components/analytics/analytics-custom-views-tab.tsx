"use client"

import { useState } from "react"
import { Sliders, Plus, Edit, Trash2, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

const customViews = [
  {
    id: "1",
    nameKey: "executive_dashboard",
    descriptionKey: "highlevel_kpis_for_leadership",
    widgets: ["Revenue Chart", "Customer Growth", "Market Share", "Profit Margin"],
    isDefault: true,
    lastModified: "2025-10-08"
  },
  {
    id: "2",
    nameKey: "sales_performance",
    descriptionKey: "detailed_sales_metrics_and_pipeline",
    widgets: ["Conversion Rate", "Deal Pipeline", "Sales by Region", "Top Performers"],
    isDefault: false,
    lastModified: "2025-10-05"
  },
  {
    id: "3",
    nameKey: "operations_overview",
    descriptionKey: "operational_efficiency_metrics",
    widgets: ["Task Completion", "Resource Utilization", "Project Status", "Team Velocity"],
    isDefault: false,
    lastModified: "2025-09-28"
  },
  {
    id: "4",
    nameKey: "customer_analytics",
    descriptionKey: "customer_behavior_and_satisfaction",
    widgets: ["Satisfaction Score", "Churn Rate", "LTV Analysis", "Support Tickets"],
    isDefault: false,
    lastModified: "2025-10-02"
  },
]

interface AnalyticsCustomViewsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsCustomViewsTab({ data = [], loading = false }: AnalyticsCustomViewsTabProps) {
  const t = useTranslations('intelligence.analytics.analyticscustomviews')
  const tCommon = useTranslations('common')

  const displayViews = data || []
  
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {customViews.map((view: any) => (
          <Card key={view.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{t(view.nameKey)}</CardTitle>
                    {view.isDefault && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        <Star className="h-3 w-3 mr-1 fill-current" aria-hidden="true" />
                        {t('default')}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{t(view.descriptionKey)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">{t('widgets')} ({view.widgets.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {view.widgets.map((widget: any, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {widget}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {t('modified')} {view.lastModified}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" aria-hidden="true" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create New View Card */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-6 md:p-4 sm:p-6 md:p-8 lg:p-12 text-center">
          <Sliders className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" aria-hidden="true" />
          <h3 className="font-semibold mb-2">{t('createCustomView')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('buildPersonalizedDashboard')}
          </p>
        </CardContent>
      </Card>

    </div>
  )
}
