"use client"

import { CheckCircle2, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const keyResults = [
  {
    id: "1",
    objective: "Increase Customer Satisfaction Score",
    name: "Achieve NPS score of 50+",
    current: 45,
    target: 50,
    unit: "points",
    progress: 90,
    owner: "Sarah Chen",
    dueDate: "2025-12-31",
    status: "on_track"
  },
  {
    id: "2",
    objective: "Increase Customer Satisfaction Score",
    name: "Reduce response time to under 1 hour",
    current: 1.2,
    target: 1.0,
    unit: "hours",
    progress: 83,
    owner: "Mike Johnson",
    dueDate: "2025-12-31",
    status: "on_track"
  },
  {
    id: "3",
    objective: "Reduce Operational Costs",
    name: "Decrease overhead by $500K annually",
    current: 265,
    target: 500,
    unit: "K saved",
    progress: 53,
    owner: "Alex Rivera",
    dueDate: "2025-12-31",
    status: "at_risk"
  },
  {
    id: "4",
    objective: "Reduce Operational Costs",
    name: "Improve resource utilization to 85%",
    current: 78,
    target: 85,
    unit: "%",
    progress: 92,
    owner: "Jordan Lee",
    dueDate: "2025-12-31",
    status: "on_track"
  },
  {
    id: "5",
    objective: "Expand Market Presence",
    name: "Launch in 3 new markets",
    current: 1,
    target: 3,
    unit: "markets",
    progress: 33,
    owner: "Taylor Kim",
    dueDate: "2026-06-30",
    status: "on_track"
  },
  {
    id: "6",
    objective: "Expand Market Presence",
    name: "Achieve $2M revenue from new markets",
    current: 0.4,
    target: 2.0,
    unit: "M",
    progress: 20,
    owner: "Casey Martinez",
    dueDate: "2026-06-30",
    status: "on_track"
  },
]

export function InsightsKeyResultsTab() {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Key Results</p>
            <p className="text-2xl font-bold mt-1">{keyResults.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On Track</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {keyResults.filter(kr => kr.status === "on_track").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">At Risk</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {keyResults.filter(kr => kr.status === "at_risk").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Group by Objective */}
      {Array.from(new Set(keyResults.map(kr => kr.objective))).map((objective) => (
        <div key={objective}>
          <h3 className="font-semibold mb-3">{objective}</h3>
          <div className="space-y-3 mb-6">
            {keyResults.filter(kr => kr.objective === objective).map((kr) => (
              <Card key={kr.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle2 className={`h-5 w-5 ${kr.status === "on_track" ? "text-green-600" : "text-yellow-600"}`} />
                      <div className="flex-1">
                        <h4 className="font-medium">{kr.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Owner: {kr.owner} • Due: {kr.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-2xl font-bold">
                        {kr.current}<span className="text-sm font-normal text-muted-foreground">/{kr.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{kr.unit}</p>
                    </div>
                    <Badge 
                      variant={kr.status === "on_track" ? "default" : "secondary"}
                      className={kr.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}
                    >
                      {kr.status === "on_track" ? "On Track" : "At Risk"}
                    </Badge>
                  </div>
                  <Progress value={kr.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
