"use client"

import { BookMarked, Plus, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
const savedMetrics = [
  {
    id: "1",
    nameKey: "monthly_recurring_revenue_mrr",
    descriptionKey: "total_predictable_revenue_generated_per_month",
    formula: "SUM(subscription_revenue) WHERE status='active'",
    categoryKey: "financial",
    isFavorite: true,
    lastValue: "$2.4M",
    trend: "+12%"
  },
  {
    id: "2",
    nameKey: "customer_acquisition_cost_cac",
    descriptionKey: "average_cost_to_acquire_a_new_customer",
    formula: "SUM(marketing_spend + sales_spend) / COUNT(new_customers)",
    categoryKey: "marketing",
    isFavorite: true,
    lastValue: "$245",
    trend: "-8%"
  },
  {
    id: "3",
    nameKey: "net_promoter_score_nps",
    descriptionKey: "customer_loyalty_and_satisfaction_metric",
    formula: "% Promoters - % Detractors",
    categoryKey: "customer_success",
    isFavorite: false,
    lastValue: "45",
    trend: "+5"
  },
  {
    id: "4",
    nameKey: "employee_productivity_index",
    descriptionKey: "output_per_employee_over_time",
    formula: "SUM(completed_tasks) / COUNT(active_employees)",
    categoryKey: "operations",
    isFavorite: true,
    lastValue: "87%",
    trend: "+3%"
  },
  {
    id: "5",
    nameKey: "gross_profit_margin",
    descriptionKey: "revenue_minus_cost_of_goods_sold",
    formula: "(Revenue - COGS) / Revenue * 100",
    categoryKey: "financial",
    isFavorite: false,
    lastValue: "68%",
    trend: "+2%"
  },
  {
    id: "6",
    nameKey: "customer_lifetime_value_ltv",
    descriptionKey: "total_revenue_expected_from_a_customer",
    formula: "AVG(purchase_value) * AVG(purchase_frequency) * AVG(customer_lifespan)",
    categoryKey: "marketing",
    isFavorite: true,
    lastValue: "$12,450",
    trend: "+18%"
  },
]

interface AnalyticsMetricsLibraryTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsMetricsLibraryTab({ data = [], loading = false }: AnalyticsMetricsLibraryTabProps) {
  const t = useTranslations('intelligence.analytics.analyticsmetricslibrary')
  const tCommon = useTranslations('common')

  const displayMetrics = data || []
  
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div>
        <h3 className="font-semibold mb-3 flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Star aria-hidden="true" className="h-4 w-4 text-yellow-600 fill-current" />
          Favorite Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
          {savedMetrics.filter(m => m.isFavorite).map((metric: any) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
                      <CardTitle aria-hidden="true" className="text-base">{t(metric.nameKey)}</CardTitle>
                      <Star aria-hidden="true" className="h-4 w-4 text-yellow-600 fill-current" />
                    </div>
                    <Badge variant="outline" className="text-xs">{t(metric.categoryKey)}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-live="polite">{metric.lastValue}</p>
                    <p className="text-xs text-green-600 flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <TrendingUp aria-hidden="true" className="h-3 w-3" />
                      {metric.trend}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{t(metric.descriptionKey)}</p>
                <div className="p-2 bg-muted rounded text-xs font-mono">
                  {metric.formula}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* All Metrics */}
      <div>
        <h3 className="font-semibold mb-3">{t('allMetrics')}</h3>
        <div className="space-y-2">
          {savedMetrics.map((metric: any) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardContent aria-hidden="true" className="p-4">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 mb-2">
                      <h4 className="font-semibold">{t(metric.nameKey)}</h4>
                      <Badge variant="secondary" className="text-xs">{t(metric.categoryKey)}</Badge>
                      {metric.isFavorite && <Star aria-hidden="true" className="h-4 w-4 text-yellow-600 fill-current" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{t(metric.descriptionKey)}</p>
                    <div className="p-2 bg-muted rounded text-xs font-mono inline-block">
                      {metric.formula}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground">{t('currentValue')}</p>
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-live="polite">{metric.lastValue}</p>
                    <p className="text-sm text-green-600 mt-1">{metric.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  )
}
