"use client"

import { BarChart2, TrendingUp, TrendingDown, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

interface Period {
  nameKey: string
  value: number
  color: string
}

interface ComparisonData {
  categoryKey: string
  periods: Period[]
  change: string
}

const useComparisonData = (t: (key: string) => string): ComparisonData[] => [
  {
    categoryKey: "revenue",
    periods: [
      { nameKey: "q1_2024", value: 2.1, color: "bg-blue-600" },
      { nameKey: "q2_2024", value: 2.3, color: "bg-blue-600" },
      { nameKey: "q3_2024", value: 2.6, color: "bg-blue-600" },
      { nameKey: "q4_2024", value: 2.8, color: "bg-blue-600" },
    ],
    change: "+33%"
  },
  {
    categoryKey: "customer_acquisition",
    periods: [
      { nameKey: "q1_2024", value: 1100, color: "bg-green-600" },
      { nameKey: "q2_2024", value: 1250, color: "bg-green-600" },
      { nameKey: "q3_2024", value: 1180, color: "bg-green-600" },
      { nameKey: "q4_2024", value: 1400, color: "bg-green-600" },
    ],
    change: "+27%"
  },
  {
    categoryKey: "operating_costs",
    periods: [
      { nameKey: "q1_2024", value: 1.4, color: "bg-red-600" },
      { nameKey: "q2_2024", value: 1.35, color: "bg-red-600" },
      { nameKey: "q3_2024", value: 1.3, color: "bg-red-600" },
      { nameKey: "q4_2024", value: 1.2, color: "bg-red-600" },
    ],
    change: "-14%"
  },
]

interface RegionComparison {
  regionKey: string
  revenue: number
  growth: number
  customers: number
  color: string
}

const useRegionComparison = (t: (key: string) => string): RegionComparison[] => [
  { regionKey: "north_america", revenue: 45, growth: 12, customers: 5400, color: "text-blue-600" },
  { regionKey: "europe", revenue: 32, growth: 18, customers: 3800, color: "text-green-600" },
  { regionKey: "asia_pacific", revenue: 18, growth: 24, customers: 2100, color: "text-purple-600" },
  { regionKey: "latin_america", revenue: 5, growth: 15, customers: 700, color: "text-orange-600" },
]

interface AnalyticsComparisonsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsComparisonsTab({ data = [], loading = false }: AnalyticsComparisonsTabProps) {
  const t = useTranslations('intelligence.analytics.analyticscomparisons')
  const tCommon = useTranslations('common')
  const comparisonData = useComparisonData(t)
  const regionComparison = useRegionComparison(t)
  const displayData = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Tabs defaultValue="quarterly">
        <TabsList>
          <TabsTrigger value="quarterly">{t('quarterly')}</TabsTrigger>
          <TabsTrigger value="regional">{t('regional')}</TabsTrigger>
          <TabsTrigger value="yoy">{t('yearOverYear')}</TabsTrigger>
        </TabsList>

        <TabsContent value="quarterly" className="space-y-3 md:space-y-4 lg:space-y-6 mt-6">
          {comparisonData.map((data: ComparisonData, index: number) => {
            const maxValue = Math.max(...data.periods.map((p: Period) => p.value))
            const isPositive = data.change.startsWith("+")
            
            return (
              <Card key={index} role="article">
                <CardHeader>
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                    <CardTitle>{t(data.categoryKey)}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={isPositive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1 inline" aria-hidden="true" /> : <TrendingDown className="h-3 w-3 mr-1 inline" aria-hidden="true" />}
                      {data.change} {t('vsQ1')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                      {data.periods.map((period: Period, idx: number) => {
                        const heightPercent = (period.value / maxValue) * 100
                        
                        return (
                          <div key={idx} className="space-y-2">
                            <div className="h-40 flex flex-wrap items-end">
                              <div className="w-full space-y-1 max-w-full">
                                <div className="text-center text-sm font-bold mb-1">{period.value}</div>
                                <div className={`${period.color} rounded-t-lg transition-all`} style={{ height: `${heightPercent}%` }}></div>
                              </div>
                            </div>
                            <p className="text-center text-sm font-medium">{t(period.nameKey)}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="regional" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('regionalPerformanceComparison')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionComparison.map((region: RegionComparison, index: number) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-3">
                      <h3 className={`font-semibold text-lg ${region.color}`}>{t(region.regionKey)}</h3>
                      <Badge variant="outline">{region.revenue}% {t('ofTotalRevenue')}</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{t('revenueShare')}</p>
                        <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">{region.revenue}%</p>
                        <div className="h-2 bg-accent rounded-full mt-2">
                          <div className={`h-2 ${region.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${region.revenue}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('growthRate')}</p>
                        <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-green-600" aria-live="polite">+{region.growth}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t('customers')}</p>
                        <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">{region.customers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
