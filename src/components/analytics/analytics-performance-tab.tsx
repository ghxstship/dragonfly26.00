"use client"

import { Award, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const performanceAreas = [
  { 
    name: "Operational Efficiency", 
    score: 87, 
    benchmark: 82, 
    status: "above",
    metrics: [
      { label: "Process Completion Time", value: "2.3 days", benchmark: "3.1 days", status: "good" },
      { label: "Error Rate", value: "1.2%", benchmark: "2.5%", status: "good" },
      { label: "Resource Utilization", value: "84%", benchmark: "75%", status: "good" },
    ]
  },
  { 
    name: "Customer Experience", 
    score: 92, 
    benchmark: 88, 
    status: "above",
    metrics: [
      { label: "Satisfaction Score", value: "4.6/5.0", benchmark: "4.2/5.0", status: "good" },
      { label: "Response Time", value: "1.2 hrs", benchmark: "2.5 hrs", status: "good" },
      { label: "Resolution Rate", value: "94%", benchmark: "87%", status: "good" },
    ]
  },
  { 
    name: "Financial Performance", 
    score: 78, 
    benchmark: 85, 
    status: "below",
    metrics: [
      { label: "Revenue Growth", value: "12%", benchmark: "15%", status: "warning" },
      { label: "Profit Margin", value: "18%", benchmark: "22%", status: "warning" },
      { label: "Cost Efficiency", value: "76%", benchmark: "82%", status: "warning" },
    ]
  },
  { 
    name: "Innovation & Growth", 
    score: 85, 
    benchmark: 80, 
    status: "above",
    metrics: [
      { label: "New Initiatives", value: "12", benchmark: "10", status: "good" },
      { label: "Market Expansion", value: "3 regions", benchmark: "2 regions", status: "good" },
      { label: "Product Development", value: "89%", benchmark: "75%", status: "good" },
    ]
  },
]

export function AnalyticsPerformanceTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {performanceAreas.map((area, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    {area.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    Performance Score: <span className="font-bold text-lg text-foreground">{area.score}</span> / 100
                  </CardDescription>
                </div>
                <Badge variant={area.status === "above" ? "default" : "secondary"} className={area.status === "above" ? "bg-green-600" : "bg-yellow-600"}>
                  {area.status === "above" ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Above Benchmark</>
                  ) : (
                    <><AlertCircle className="h-3 w-3 mr-1" /> Below Benchmark</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">vs. Industry Benchmark ({area.benchmark})</span>
                    <span className={area.status === "above" ? "text-green-600" : "text-yellow-600"}>
                      {area.status === "above" ? "+" : ""}{area.score - area.benchmark} points
                    </span>
                  </div>
                  <Progress value={area.score} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  {area.metrics.map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-bold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">
                        Benchmark: {metric.benchmark}
                        {metric.status === "good" && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />}
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
