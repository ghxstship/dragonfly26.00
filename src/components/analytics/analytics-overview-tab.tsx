"use client"

import { TrendingUp, TrendingDown, Activity, Users, DollarSign, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface AnalyticsOverviewTabProps {
  data?: any[]
  loading?: boolean
}

const metrics = [
  { 
    label: "Total Revenue", 
    value: "$2.4M", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign, 
    color: "text-green-600",
    bgColor: "bg-green-100"
  },
  { 
    label: "Active Users", 
    value: "14,234", 
    change: "+8.2%", 
    trend: "up",
    icon: Users, 
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  { 
    label: "Conversion Rate", 
    value: "3.24%", 
    change: "-0.4%", 
    trend: "down",
    icon: Target, 
    color: "text-purple-600",
    bgColor: "bg-purple-100"
  },
  { 
    label: "Avg. Session Duration", 
    value: "4m 32s", 
    change: "+15.3%", 
    trend: "up",
    icon: Activity, 
    color: "text-orange-600",
    bgColor: "bg-orange-100"
  },
]

const kpis = [
  { name: "Customer Satisfaction", current: 87, target: 90, unit: "%" },
  { name: "Project Completion Rate", current: 94, target: 95, unit: "%" },
  { name: "Resource Utilization", current: 78, target: 85, unit: "%" },
  { name: "Quality Score", current: 92, target: 95, unit: "%" },
]

export function AnalyticsOverviewTab({ data = [], loading = false }: AnalyticsOverviewTabProps) {
  const displayMetrics = data || []
  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayMetrics.map((metric: any, index: number) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === "up" ? TrendingUp : TrendingDown
          
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <Icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold mt-1">{metric.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* KPI Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <CardDescription>Progress against strategic targets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {kpis.map((kpi, index) => {
              const percentage = (kpi.current / kpi.target) * 100
              const isOnTrack = kpi.current >= kpi.target * 0.9
              
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{kpi.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{kpi.current}{kpi.unit}</span>
                      <span className="text-sm text-muted-foreground">/ {kpi.target}{kpi.unit}</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {isOnTrack ? "✓ On track" : "⚠ Needs attention"} • {Math.round(kpi.target - kpi.current)}{kpi.unit} to target
                  </p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
