"use client"

import { LineChart, TrendingUp, TrendingDown, Calendar, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useIsMobile } from "@/hooks/use-is-mobile"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

interface TrendPeriod {
  period: string
  value: number
}

interface TrendData {
  metric: string
  current: string
  trend: string
  change: string
  periods: TrendPeriod[]
}

const trendData: TrendData[] = [
  {
    metric: "Revenue",
    current: "$2.4M",
    trend: "up",
    change: "+12.5%",
    periods: [
      { period: "Jan", value: 1.8 },
      { period: "Feb", value: 1.9 },
      { period: "Mar", value: 2.0 },
      { period: "Apr", value: 2.1 },
      { period: "May", value: 2.2 },
      { period: "Jun", value: 2.4 },
    ]
  },
  {
    metric: "Customer Acquisition",
    current: "1,234",
    trend: "up",
    change: "+8.2%",
    periods: [
      { period: "Jan", value: 980 },
      { period: "Feb", value: 1050 },
      { period: "Mar", value: 1100 },
      { period: "Apr", value: 1150 },
      { period: "May", value: 1200 },
      { period: "Jun", value: 1234 },
    ]
  },
  {
    metric: "Operating Costs",
    current: "$1.2M",
    trend: "down",
    change: "-5.3%",
    periods: [
      { period: "Jan", value: 1.35 },
      { period: "Feb", value: 1.32 },
      { period: "Mar", value: 1.28 },
      { period: "Apr", value: 1.25 },
      { period: "May", value: 1.22 },
      { period: "Jun", value: 1.20 },
    ]
  },
  {
    metric: "Employee Satisfaction",
    current: "87%",
    trend: "up",
    change: "+4.5%",
    periods: [
      { period: "Jan", value: 82 },
      { period: "Feb", value: 83 },
      { period: "Mar", value: 84 },
      { period: "Apr", value: 85 },
      { period: "May", value: 86 },
      { period: "Jun", value: 87 },
    ]
  },
]

interface AnalyticsTrendsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsTrendsTab({ data = [], loading = false }: AnalyticsTrendsTabProps) {
  const t = useTranslations('intelligence.analytics.analyticstrends')
  const tCommon = useTranslations('common')

  const isMobile = useIsMobile()
  const displayData = data || []
  
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Tabs defaultValue="6months" className="space-y-4">
        <TabsList className="w-full grid grid-cols-2 sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-auto max-w-full">
          <TabsTrigger value="3months" className="text-xs sm:text-sm">
            <span className="hidden md:block sm:inline">{t('last')}</span> 3M
          </TabsTrigger>
          <TabsTrigger value="6months" className="text-xs sm:text-sm">
            <span className="hidden md:block sm:inline">{t('last')}</span> 6M
          </TabsTrigger>
          <TabsTrigger value="12months" className="text-xs sm:text-sm">
            <span className="hidden md:block sm:inline">{t('last')}</span> 12M
          </TabsTrigger>
          <TabsTrigger value="ytd" className="text-xs sm:text-sm">YTD</TabsTrigger>
        </TabsList>

        <TabsContent value="6months" className="space-y-4">
          {trendData.map((data: TrendData, index: number) => {
            const TrendIcon = data.trend === "up" ? TrendingUp : TrendingDown
            const trendColor = data.trend === "up" ? "text-green-600" : "text-red-600"
            const bgColor = data.trend === "up" ? "bg-green-100" : "bg-red-100"
            
            // Show fewer periods on mobile
            const periodsToShow = isMobile ? data.periods.slice(-3) : data.periods
            
            return (
              <Card key={index} role="article">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base sm:text-lg">{data.metric}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        {isMobile ? '3-month trend' : '6-month trend analysis'}
                      </CardDescription>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-base md:text-lg lg:text-xl sm:text-lg md:text-xl lg:text-2xl font-bold">{data.current}</p>
                      <Badge variant="outline" className={`${bgColor} ${trendColor} mt-2 text-xs`}>
                        <TrendIcon className="h-3 w-3 mr-1" aria-hidden="true" />
                        {data.change}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simple bar chart representation */}
                    <div className="overflow-x-auto -mx-2 px-2">
                      <div className="flex flex-wrap items-end gap-2 h-32 sm:h-40 min-w-[280px]">
                        {periodsToShow.map((period: TrendPeriod, idx: number) => {
                          const maxValue = Math.max(...periodsToShow.map((p: TrendPeriod) => p.value))
                          const height = (period.value / maxValue) * 100
                          
                          return (
                            <div key={idx} className="flex flex-col md:flex-row-1 flex flex-wrap flex-col items-center gap-2 min-w-[40px]">
                              <div className="w-full bg-accent rounded-t-lg flex items-end justify-center relative max-w-full" style={{ height: `${height}%` }}>
                                <div className="absolute sm:relative sm:inset-auto -top-6 text-[10px] sm:text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                                  {period.value}
                                </div>
                                <div className="w-full h-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors touch-manipulation max-w-full"></div>
                              </div>
                              <span className="text-[10px] sm:text-xs text-muted-foreground">
                                {period.period}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Insights */}
                    <div className="flex sm:items-center gap-2 p-3 bg-accent rounded-lg text-xs sm:text-sm items-start">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                      <p className="leading-relaxed">
                        {data.trend === "up" ? "Positive" : "Negative"} trend over the last {isMobile ? '3' : '6'} months with 
                        <span className="font-medium"> {data.change} </span>
                        change from starting period
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
