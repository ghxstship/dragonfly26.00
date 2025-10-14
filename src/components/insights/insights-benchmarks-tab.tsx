"use client"

import { BarChart3, TrendingUp, Award, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const benchmarks = [
  {
    category: "Customer Satisfaction",
    yourScore: 87,
    industryAvg: 82,
    topPerformer: 94,
    percentile: 78,
    metrics: [
      { name: "Response Time", yours: "1.2 hrs", industry: "2.5 hrs", status: "above" },
      { name: "Resolution Rate", yours: "94%", industry: "87%", status: "above" },
      { name: "NPS Score", yours: "45", industry: "38", status: "above" },
    ]
  },
  {
    category: "Operational Efficiency",
    yourScore: 84,
    industryAvg: 80,
    topPerformer: 92,
    percentile: 72,
    metrics: [
      { name: "Process Completion Time", yours: "2.3 days", industry: "3.1 days", status: "above" },
      { name: "Error Rate", yours: "1.2%", industry: "2.5%", status: "above" },
      { name: "Resource Utilization", yours: "84%", industry: "75%", status: "above" },
    ]
  },
  {
    category: "Financial Performance",
    yourScore: 78,
    industryAvg: 85,
    topPerformer: 96,
    percentile: 45,
    metrics: [
      { name: "Revenue Growth", yours: "12%", industry: "15%", status: "below" },
      { name: "Profit Margin", yours: "18%", industry: "22%", status: "below" },
      { name: "ROI", yours: "24%", industry: "28%", status: "below" },
    ]
  },
  {
    category: "Innovation & Growth",
    yourScore: 91,
    industryAvg: 76,
    topPerformer: 95,
    percentile: 89,
    metrics: [
      { name: "New Product Development", yours: "12", industry: "8", status: "above" },
      { name: "Market Expansion", yours: "3 regions", industry: "2 regions", status: "above" },
      { name: "R&D Investment", yours: "8.5%", industry: "5.2%", status: "above" },
    ]
  },
]

interface InsightsBenchmarksTabProps {
  data?: any[]
  loading?: boolean
}

export function InsightsBenchmarksTab({ data = [], loading = false }: InsightsBenchmarksTabProps) {
  const displayData = data || []
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {benchmarks.map((benchmark, index) => {
          const isAboveAvg = benchmark.yourScore > benchmark.industryAvg
          const gapToTop = benchmark.topPerformer - benchmark.yourScore
          
          return (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      {benchmark.category}
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
                        <span className="font-medium">Your Performance</span>
                        <span className="font-bold">{benchmark.yourScore}</span>
                      </div>
                      <Progress value={benchmark.yourScore} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          Industry Average
                        </span>
                        <span>{benchmark.industryAvg}</span>
                      </div>
                      <Progress value={benchmark.industryAvg} className="h-2 opacity-50" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          Top Performer
                        </span>
                        <span>{benchmark.topPerformer}</span>
                      </div>
                      <Progress value={benchmark.topPerformer} className="h-2 opacity-30" />
                    </div>
                  </div>

                  {/* Detailed Metrics */}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-3">Detailed Breakdown</p>
                    <div className="grid grid-cols-3 gap-4">
                      {benchmark.metrics.map((metric, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs text-muted-foreground">{metric.name}</p>
                          <p className="text-sm font-bold">{metric.yours}</p>
                          <p className="text-xs text-muted-foreground">
                            Industry: {metric.industry}
                            {metric.status === "above" && <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />}
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
