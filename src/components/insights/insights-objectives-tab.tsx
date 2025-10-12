"use client"

import { Target, Plus, Edit, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const objectives = [
  {
    id: "1",
    name: "Increase Customer Satisfaction Score",
    description: "Improve overall customer satisfaction from 85% to 90%",
    owner: "Customer Success Team",
    progress: 87,
    target: 90,
    status: "on_track",
    keyResults: 3,
    dueDate: "2025-12-31"
  },
  {
    id: "2",
    name: "Reduce Operational Costs",
    description: "Decrease operational expenses by 15% through process optimization",
    owner: "Operations Team",
    progress: 53,
    target: 100,
    status: "at_risk",
    keyResults: 4,
    dueDate: "2025-12-31"
  },
  {
    id: "3",
    name: "Expand Market Presence",
    description: "Enter 3 new geographic markets and establish local operations",
    owner: "Business Development",
    progress: 33,
    target: 100,
    status: "on_track",
    keyResults: 5,
    dueDate: "2026-06-30"
  },
  {
    id: "4",
    name: "Improve Product Quality",
    description: "Reduce defect rate to below 1% and increase quality scores",
    owner: "Product Team",
    progress: 78,
    target: 85,
    status: "on_track",
    keyResults: 3,
    dueDate: "2025-12-31"
  },
  {
    id: "5",
    name: "Enhance Employee Engagement",
    description: "Increase employee satisfaction score to 4.5/5.0",
    owner: "HR Team",
    progress: 82,
    target: 90,
    status: "on_track",
    keyResults: 4,
    dueDate: "2025-12-31"
  },
]

export function InsightsObjectivesTab() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Objectives</p>
            <p className="text-2xl font-bold mt-1">{objectives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On Track</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {objectives.filter(o => o.status === "on_track").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">At Risk</p>
            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {objectives.filter(o => o.status === "at_risk").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Progress</p>
            <p className="text-2xl font-bold mt-1">
              {Math.round(objectives.reduce((sum, o) => sum + o.progress, 0) / objectives.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {objectives.map((objective) => (
          <Card key={objective.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <Target className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{objective.name}</h3>
                      <Badge 
                        variant={objective.status === "on_track" ? "default" : "secondary"}
                        className={objective.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}
                      >
                        {objective.status === "on_track" ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" /> On Track</>
                        ) : (
                          "At Risk"
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{objective.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Owner</p>
                        <p className="font-medium">{objective.owner}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Key Results</p>
                        <p className="font-medium">{objective.keyResults} KRs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{objective.dueDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-bold">{objective.progress}% / {objective.target}%</span>
                      </div>
                      <Progress value={objective.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Objective */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center">
          <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <h3 className="font-semibold mb-2">Create New Objective</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Define a strategic objective to track progress and align your team
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Objective
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
