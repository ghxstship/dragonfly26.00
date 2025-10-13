"use client"

import { LineChart, TrendingUp, TrendingDown, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const trendData = [
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
  data?: any[]
  loading?: boolean
}

export function AnalyticsTrendsTab({ data = [], loading = false }: AnalyticsTrendsTabProps) {
  const displayData = data.length > 0 ? data : trendData
  return (
    <div className="space-y-6">
      <Tabs defaultValue="6months" className="space-y-4">
        <TabsList>
          <TabsTrigger value="3months">Last 3 Months</TabsTrigger>
          <TabsTrigger value="6months">Last 6 Months</TabsTrigger>
          <TabsTrigger value="12months">Last 12 Months</TabsTrigger>
          <TabsTrigger value="ytd">Year to Date</TabsTrigger>
        </TabsList>

        <TabsContent value="6months" className="space-y-4">
          {trendData.map((data, index) => {
            const TrendIcon = data.trend === "up" ? TrendingUp : TrendingDown
            const trendColor = data.trend === "up" ? "text-green-600" : "text-red-600"
            const bgColor = data.trend === "up" ? "bg-green-100" : "bg-red-100"
            
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{data.metric}</CardTitle>
                      <CardDescription>6-month trend analysis</CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{data.current}</p>
                      <Badge variant="outline" className={`${bgColor} ${trendColor} mt-2`}>
                        <TrendIcon className="h-3 w-3 mr-1" />
                        {data.change}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simple bar chart representation */}
                    <div className="flex items-end gap-2 h-40">
                      {data.periods.map((period, idx) => {
                        const maxValue = Math.max(...data.periods.map(p => p.value))
                        const height = (period.value / maxValue) * 100
                        
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-accent rounded-t-lg flex items-end justify-center relative" style={{ height: `${height}%` }}>
                              <div className="absolute -top-6 text-xs font-medium">{period.value}</div>
                              <div className="w-full h-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors"></div>
                            </div>
                            <span className="text-xs text-muted-foreground">{period.period}</span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Insights */}
                    <div className="flex items-center gap-2 p-3 bg-accent rounded-lg text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>
                        {data.trend === "up" ? "Positive trend" : "Negative trend"} over the last 6 months with 
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
