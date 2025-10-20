"use client"

import { BarChart3, TrendingUp, Award, Building2, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useInsightsData } from "@/hooks/use-insights-data"

interface BenchmarkMetric {
  nameKey: string
  yours: string
  industry: string
  status: string
}

interface Benchmark {
  categoryKey: string
  yourScore: number
  industryAvg: number
  topPerformer: number
  percentile: number
  metrics: BenchmarkMetric[]
}

const benchmarks: Benchmark[] = [
  {
    categoryKey: "customer_satisfaction",
    yourScore: 87,
    industryAvg: 82,
    topPerformer: 94,
    percentile: 78,
    metrics: [
      { nameKey: "response_time", yours: "1.2 hrs", industry: "2.5 hrs", status: "above" },
      { nameKey: "resolution_rate", yours: "94%", industry: "87%", status: "above" },
      { nameKey: "nps_score", yours: "45", industry: "38", status: "above" },
    ]
  },
  {
    categoryKey: "operational_efficiency",
    yourScore: 84,
    industryAvg: 80,
    topPerformer: 92,
    percentile: 72,
    metrics: [
      { nameKey: "process_completion_time", yours: "2.3 days", industry: "3.1 days", status: "above" },
      { nameKey: "error_rate", yours: "1.2%", industry: "2.5%", status: "above" },
      { nameKey: "resource_utilization", yours: "84%", industry: "75%", status: "above" },
    ]
  },
  {
    categoryKey: "financial_performance",
    yourScore: 78,
    industryAvg: 85,
    topPerformer: 96,
    percentile: 45,
    metrics: [
      { nameKey: "revenue_growth", yours: "12%", industry: "15%", status: "below" },
      { nameKey: "profit_margin", yours: "18%", industry: "22%", status: "below" },
      { nameKey: "roi", yours: "24%", industry: "28%", status: "below" },
    ]
  },
  {
    categoryKey: "innovation__growth",
    yourScore: 91,
    industryAvg: 76,
    topPerformer: 95,
    percentile: 89,
    metrics: [
      { nameKey: "new_product_development", yours: "12", industry: "8", status: "above" },
      { nameKey: "market_expansion", yours: "3 regions", industry: "2 regions", status: "above" },
      { nameKey: "rd_investment", yours: "8.5%", industry: "5.2%", status: "above" },
    ]
  },
]

interface InsightsBenchmarksTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsBenchmarksTab({ data = [], loading = false }: InsightsBenchmarksTabProps) {
  const t = useTranslations('intelligence.insights.insightsbenchmarks')
  const tCommon = useTranslations('common')

  const displayData = data || []
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {benchmarks.map((benchmark, index: number) => {
          const isAboveAvg = benchmark.yourScore > benchmark.industryAvg
          const gapToTop = benchmark.topPerformer - benchmark.yourScore
          
          return (
            <Card key={index} role="article">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" aria-hidden="true" />
                      {t(benchmark.categoryKey)}
                    </CardTitle>
                    <CardDescription className="mt-2 flex items-center gap-4">
                      <span>Your Score: <span className="font-bold text-lg text-foreground">{benchmark.yourScore}</span></span>
                      <span>•</span>
                      <span>Top {benchmark.percentile}th percentile</span>
                    </CardDescription>
                  </div>
                  <Badge variant={isAboveAvg ? "default" : "secondary"} className={isAboveAvg ? "bg-green-600" : "bg-yellow-600"}>
                    {isAboveAvg ? "Above Average" : "Below Average"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Comparison Bars */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{t('yourPerformance')}</span>
                        <span className="font-bold">{benchmark.yourScore}</span>
                      </div>
                      <Progress value={benchmark.yourScore} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" aria-hidden="true" />
                          Industry Average
                        </span>
                        <span>{benchmark.industryAvg}</span>
                      </div>
                      <Progress value={benchmark.industryAvg} className="h-2 opacity-50" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" aria-hidden="true" />
                          Top Performer
                        </span>
                        <span>{benchmark.topPerformer}</span>
                      </div>
                      <Progress value={benchmark.topPerformer} className="h-2 opacity-30" />
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">{t('detailedBreakdown')}</p>
                    <div className="grid grid-cols-3 gap-4">
                      {benchmark.metrics.map((metric, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs text-muted-foreground">{t(metric.nameKey)}</p>
                          <p className="text-sm font-bold">{metric.yours}</p>
                          <p className="text-xs text-muted-foreground">
                            Industry: {metric.industry}
                            {metric.status === "above" && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" aria-hidden="true" />}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insight */}
                  <div className="p-3 bg-accent rounded-lg text-sm">
                    {isAboveAvg ? (
                      <p>
                        ✓ You&apos;re performing <span className="font-medium">{benchmark.yourScore - benchmark.industryAvg} points above</span> industry average. 
                        To reach top performer level, improve by <span className="font-medium">{gapToTop} points</span>.
                      </p>
                    ) : (
                      <p>
                        ⚠ You&apos;re <span className="font-medium">{benchmark.industryAvg - benchmark.yourScore} points below</span> industry average. 
                        Focus on improvement to reach competitive levels.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
