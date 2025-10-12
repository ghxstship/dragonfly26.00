"use client"

import { Trophy, Target, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const successMetrics = [
  {
    category: "Customer Success",
    metrics: [
      { name: "Customer Satisfaction", current: 87, target: 90, unit: "%", weight: 30 },
      { name: "Net Promoter Score", current: 45, target: 50, unit: "points", weight: 25 },
      { name: "Retention Rate", current: 94, target: 95, unit: "%", weight: 25 },
      { name: "Response Time", current: 1.2, target: 1.0, unit: "hrs", weight: 20 },
    ],
    overallScore: 88
  },
  {
    category: "Business Growth",
    metrics: [
      { name: "Revenue Growth", current: 12.5, target: 15, unit: "%", weight: 35 },
      { name: "Market Share", current: 18.2, target: 20, unit: "%", weight: 30 },
      { name: "New Customer Acquisition", current: 1234, target: 1500, unit: "customers", weight: 20 },
      { name: "Expansion Revenue", current: 340, target: 400, unit: "K", weight: 15 },
    ],
    overallScore: 82
  },
  {
    category: "Operational Excellence",
    metrics: [
      { name: "Process Efficiency", current: 87, target: 90, unit: "%", weight: 30 },
      { name: "Error Rate", current: 1.2, target: 1.0, unit: "%", weight: 25 },
      { name: "Resource Utilization", current: 84, target: 90, unit: "%", weight: 25 },
      { name: "Delivery Time", current: 2.3, target: 2.0, unit: "days", weight: 20 },
    ],
    overallScore: 90
  },
]

export function InsightsSuccessMetricsTab() {
  const totalScore = Math.round(
    successMetrics.reduce((sum, cat) => sum + cat.overallScore, 0) / successMetrics.length
  )

  return (
    <div className="space-y-6">
      {/* Overall Success Score */}
      <Card className="border-2">
        <CardContent className="p-8">
          <div className="text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
            <h2 className="text-3xl font-bold mb-2">Overall Success Score</h2>
            <div className="text-6xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {totalScore}%
            </div>
            <p className="text-muted-foreground">Composite score across all success criteria</p>
            <div className="mt-6 max-w-md mx-auto">
              <Progress value={totalScore} className="h-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {successMetrics.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{category.category}</CardTitle>
              <div className="text-right">
                <p className="text-3xl font-bold">{category.overallScore}%</p>
                <p className="text-sm text-muted-foreground">Category Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {category.metrics.map((metric, idx) => {
                const progress = metric.unit === "hrs" || metric.unit === "days"
                  ? ((metric.target / metric.current) * 100)
                  : ((metric.current / metric.target) * 100)
                
                const isOnTarget = progress >= 95

                return (
                  <div key={idx} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Target className={`h-5 w-5 ${isOnTarget ? 'text-green-600' : 'text-yellow-600'}`} />
                        <div>
                          <p className="font-medium">{metric.name}</p>
                          <p className="text-xs text-muted-foreground">Weight: {metric.weight}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {metric.current}<span className="text-sm font-normal text-muted-foreground">/{metric.target}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{metric.unit}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={Math.min(progress, 100)} className="flex-1 h-2" />
                      <Badge 
                        variant={isOnTarget ? "default" : "secondary"}
                        className={isOnTarget ? "bg-green-600" : "bg-yellow-600"}
                      >
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
