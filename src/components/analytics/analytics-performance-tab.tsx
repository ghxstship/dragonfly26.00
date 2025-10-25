"use client"

import { Award, TrendingUp, AlertCircle, CheckCircle, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

interface PerformanceMetric {
  labelKey: string
  value: string
  benchmark: string
  status: string
}

interface PerformanceArea {
  nameKey: string
  score: number
  benchmark: number
  status: string
  metrics: PerformanceMetric[]
}

const performanceAreas: PerformanceArea[] = [
  { 
    nameKey: "operational_efficiency", 
    score: 87, 
    benchmark: 82, 
    status: "above",
    metrics: [
      { labelKey: "process_completion_time", value: "2.3 days", benchmark: "3.1 days", status: "good" },
      { labelKey: "error_rate", value: "1.2%", benchmark: "2.5%", status: "good" },
      { labelKey: "resource_utilization", value: "84%", benchmark: "75%", status: "good" },
    ]
  },
  { 
    nameKey: "customer_experience", 
    score: 92, 
    benchmark: 88, 
    status: "above",
    metrics: [
      { labelKey: "satisfaction_score", value: "4.6/5.0", benchmark: "4.2/5.0", status: "good" },
      { labelKey: "response_time", value: "1.2 hrs", benchmark: "2.5 hrs", status: "good" },
      { labelKey: "resolution_rate", value: "94%", benchmark: "87%", status: "good" },
    ]
  },
  { 
    nameKey: "financial_performance", 
    score: 78, 
    benchmark: 85, 
    status: "below",
    metrics: [
      { labelKey: "revenue_growth", value: "12%", benchmark: "15%", status: "warning" },
      { labelKey: "profit_margin", value: "18%", benchmark: "22%", status: "warning" },
      { labelKey: "cost_efficiency", value: "76%", benchmark: "82%", status: "warning" },
    ]
  },
  { 
    nameKey: "innovation__growth", 
    score: 85, 
    benchmark: 80, 
    status: "above",
    metrics: [
      { labelKey: "new_initiatives", value: "12", benchmark: "10", status: "good" },
      { labelKey: "market_expansion", value: "3 regions", benchmark: "2 regions", status: "good" },
      { labelKey: "product_development", value: "89%", benchmark: "75%", status: "good" },
    ]
  },
]

interface AnalyticsPerformanceTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsPerformanceTab({ data = [], loading = false }: AnalyticsPerformanceTabProps) {
  const t = useTranslations('intelligence.analytics.performance')
  const tCommon = useTranslations('common')
  const displayData = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {performanceAreas.map((area: PerformanceArea, index: number) => (
          <Card key={index} role="region" aria-label={`${t(area.nameKey)} performance`}>
            <CardHeader>
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" aria-hidden="true" />
                    {t(area.nameKey)}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Performance Score: <span className="font-bold text-lg text-foreground">{area.score}</span> / 100
                  </CardDescription>
                </div>
                <Badge variant={(area as any).status === "above" ? "default" : "secondary"} className={(area as any).status === "above" ? "bg-green-600" : "bg-yellow-600"}>
                  {(area as any).status === "above" ? (
                    <><CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" /> Above Benchmark</>
                  ) : (
                    <><AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" /> Below Benchmark</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                    <span className="text-muted-foreground">vs. Industry Benchmark ({area.benchmark})</span>
                    <span className={(area as any).status === "above" ? "text-green-600" : "text-yellow-600"}>
                      {(area as any).status === "above" ? "+" : ""}{(area as any).score - (area as any).benchmark} points
                    </span>
                  </div>
                  <Progress value={area.score} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 pt-4 border-t">
                  {area.metrics.map((metric: PerformanceMetric, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{t(metric.labelKey)}</p>
                      <p className="text-sm font-bold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">
                        Benchmark: {metric.benchmark}
                        {(metric as any).status === "good" && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" aria-hidden="true" />}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
