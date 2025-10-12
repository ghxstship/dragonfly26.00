"use client"

import { BarChart2, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const comparisonData = [
  {
    category: "Revenue",
    periods: [
      { name: "Q1 2024", value: 2.1, color: "bg-blue-600" },
      { name: "Q2 2024", value: 2.3, color: "bg-blue-600" },
      { name: "Q3 2024", value: 2.6, color: "bg-blue-600" },
      { name: "Q4 2024", value: 2.8, color: "bg-blue-600" },
    ],
    change: "+33%"
  },
  {
    category: "Customer Acquisition",
    periods: [
      { name: "Q1 2024", value: 1100, color: "bg-green-600" },
      { name: "Q2 2024", value: 1250, color: "bg-green-600" },
      { name: "Q3 2024", value: 1180, color: "bg-green-600" },
      { name: "Q4 2024", value: 1400, color: "bg-green-600" },
    ],
    change: "+27%"
  },
  {
    category: "Operating Costs",
    periods: [
      { name: "Q1 2024", value: 1.4, color: "bg-red-600" },
      { name: "Q2 2024", value: 1.35, color: "bg-red-600" },
      { name: "Q3 2024", value: 1.3, color: "bg-red-600" },
      { name: "Q4 2024", value: 1.2, color: "bg-red-600" },
    ],
    change: "-14%"
  },
]

const regionComparison = [
  { region: "North America", revenue: 45, growth: 12, customers: 5400, color: "text-blue-600" },
  { region: "Europe", revenue: 32, growth: 18, customers: 3800, color: "text-green-600" },
  { region: "Asia Pacific", revenue: 18, growth: 24, customers: 2100, color: "text-purple-600" },
  { region: "Latin America", revenue: 5, growth: 15, customers: 700, color: "text-orange-600" },
]

export function AnalyticsComparisonsTab() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="quarterly">
        <TabsList>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="yoy">Year over Year</TabsTrigger>
        </TabsList>

        <TabsContent value="quarterly" className="space-y-6 mt-6">
          {comparisonData.map((data, index) => {
            const maxValue = Math.max(...data.periods.map(p => p.value))
            const isPositive = data.change.startsWith("+")
            
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{data.category}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={isPositive ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1 inline" /> : <TrendingDown className="h-3 w-3 mr-1 inline" />}
                      {data.change} vs Q1
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                      {data.periods.map((period, idx) => {
                        const heightPercent = (period.value / maxValue) * 100
                        
                        return (
                          <div key={idx} className="space-y-2">
                            <div className="h-40 flex items-end">
                              <div className="w-full space-y-1">
                                <div className="text-center text-sm font-bold mb-1">{period.value}</div>
                                <div className={`${period.color} rounded-t-lg transition-all`} style={{ height: `${heightPercent}%` }}></div>
                              </div>
                            </div>
                            <p className="text-center text-sm font-medium">{period.name}</p>
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
              <CardTitle>Regional Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionComparison.map((region, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className={`font-semibold text-lg ${region.color}`}>{region.region}</h3>
                      <Badge variant="outline">{region.revenue}% of total revenue</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue Share</p>
                        <p className="text-2xl font-bold mt-1">{region.revenue}%</p>
                        <div className="h-2 bg-accent rounded-full mt-2">
                          <div className={`h-2 ${region.color.replace('text-', 'bg-')} rounded-full`} style={{ width: `${region.revenue}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                        <p className="text-2xl font-bold mt-1 text-green-600">+{region.growth}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Customers</p>
                        <p className="text-2xl font-bold mt-1">{region.customers.toLocaleString()}</p>
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
