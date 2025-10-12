"use client"

import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const strategicInsights = [
  {
    id: "1",
    type: "opportunity",
    priority: "high",
    title: "Market Expansion Opportunity",
    description: "Analysis shows 23% untapped market potential in Southeast region",
    impact: "High Revenue Impact",
    confidence: 87,
    recommendation: "Allocate resources to regional expansion in Q1 2026"
  },
  {
    id: "2",
    type: "risk",
    priority: "medium",
    title: "Resource Utilization Below Target",
    description: "Team capacity at 68%, 17% below optimal utilization rate",
    impact: "Efficiency Loss",
    confidence: 92,
    recommendation: "Redistribute workload and consider strategic hiring"
  },
  {
    id: "3",
    type: "achievement",
    priority: "low",
    title: "Customer Satisfaction Milestone",
    description: "Exceeded quarterly satisfaction target by 12%",
    impact: "Positive Brand Impact",
    confidence: 95,
    recommendation: "Document and replicate successful practices"
  },
]

const objectives = [
  { name: "Increase Customer Satisfaction", progress: 87, target: 90, status: "on_track" },
  { name: "Reduce Operational Costs", progress: 53, target: 100, status: "at_risk" },
  { name: "Expand Market Presence", progress: 33, target: 100, status: "on_track" },
  { name: "Improve Process Efficiency", progress: 78, target: 85, status: "on_track" },
]

export function InsightsOverviewTab() {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Objectives</p>
                <p className="text-2xl font-bold mt-2">12</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold mt-2 text-green-600">9</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold mt-2 text-yellow-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Insights Generated</p>
                <p className="text-2xl font-bold mt-2">47</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Strategic Insights & Recommendations
          </CardTitle>
          <CardDescription>AI-powered analysis of your performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicInsights.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-green-600 mt-1" />}
                    {insight.type === "risk" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" />}
                    {insight.type === "achievement" && <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1" />}
                    <div>
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                    </div>
                  </div>
                  <Badge variant={insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"}>
                    {insight.priority} priority
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t">
                  <span className="text-muted-foreground">{insight.impact}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex items-center gap-1">
                    Confidence: <span className="font-medium">{insight.confidence}%</span>
                  </span>
                </div>
                
                <div className="mt-3 p-3 bg-accent rounded-md">
                  <p className="text-sm"><span className="font-medium">Recommendation:</span> {insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Objectives Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Active Objectives Progress</CardTitle>
          <CardDescription>Track progress against your strategic goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives.map((obj, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{obj.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={obj.status === "on_track" ? "default" : "secondary"} className={obj.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}>
                      {obj.status === "on_track" ? "On Track" : "At Risk"}
                    </Badge>
                    <span className="text-sm font-bold">{obj.progress}%</span>
                  </div>
                </div>
                <Progress value={obj.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
