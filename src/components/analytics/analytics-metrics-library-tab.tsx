"use client"

import { BookMarked, Plus, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const savedMetrics = [
  {
    id: "1",
    name: "Monthly Recurring Revenue (MRR)",
    description: "Total predictable revenue generated per month",
    formula: "SUM(subscription_revenue) WHERE status='active'",
    category: "Financial",
    isFavorite: true,
    lastValue: "$2.4M",
    trend: "+12%"
  },
  {
    id: "2",
    name: "Customer Acquisition Cost (CAC)",
    description: "Average cost to acquire a new customer",
    formula: "SUM(marketing_spend + sales_spend) / COUNT(new_customers)",
    category: "Marketing",
    isFavorite: true,
    lastValue: "$245",
    trend: "-8%"
  },
  {
    id: "3",
    name: "Net Promoter Score (NPS)",
    description: "Customer loyalty and satisfaction metric",
    formula: "% Promoters - % Detractors",
    category: "Customer Success",
    isFavorite: false,
    lastValue: "45",
    trend: "+5"
  },
  {
    id: "4",
    name: "Employee Productivity Index",
    description: "Output per employee over time",
    formula: "SUM(completed_tasks) / COUNT(active_employees)",
    category: "Operations",
    isFavorite: true,
    lastValue: "87%",
    trend: "+3%"
  },
  {
    id: "5",
    name: "Gross Profit Margin",
    description: "Revenue minus cost of goods sold",
    formula: "(Revenue - COGS) / Revenue * 100",
    category: "Financial",
    isFavorite: false,
    lastValue: "68%",
    trend: "+2%"
  },
  {
    id: "6",
    name: "Customer Lifetime Value (LTV)",
    description: "Total revenue expected from a customer",
    formula: "AVG(purchase_value) * AVG(purchase_frequency) * AVG(customer_lifespan)",
    category: "Marketing",
    isFavorite: true,
    lastValue: "$12,450",
    trend: "+18%"
  },
]

interface AnalyticsMetricsLibraryTabProps {
  data?: any[]
  loading?: boolean
}

export function AnalyticsMetricsLibraryTab({ data = [], loading = false }: AnalyticsMetricsLibraryTabProps) {
  const displayMetrics = data || []
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Metric
        </Button>
      </div>

      {/* Favorites */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Star className="h-4 w-4 text-yellow-600 fill-current" />
          Favorite Metrics
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {savedMetrics.filter(m => m.isFavorite).map((metric) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                      <Star className="h-4 w-4 text-yellow-600 fill-current" />
                    </div>
                    <Badge variant="outline" className="text-xs">{metric.category}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{metric.lastValue}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {metric.trend}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
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
        <h3 className="font-semibold mb-3">All Metrics</h3>
        <div className="space-y-2">
          {savedMetrics.map((metric) => (
            <Card key={metric.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{metric.name}</h4>
                      <Badge variant="secondary" className="text-xs">{metric.category}</Badge>
                      {metric.isFavorite && <Star className="h-4 w-4 text-yellow-600 fill-current" />}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{metric.description}</p>
                    <div className="p-2 bg-muted rounded text-xs font-mono inline-block">
                      {metric.formula}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="text-2xl font-bold">{metric.lastValue}</p>
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
