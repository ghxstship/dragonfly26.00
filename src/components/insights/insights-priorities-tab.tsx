"use client"

import { ListOrdered, ArrowUp, ArrowRight, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const priorities = [
  {
    id: "1",
    rank: 1,
    title: "Customer Retention Initiative",
    description: "Focus on reducing churn and increasing customer lifetime value",
    impact: "high",
    effort: "medium",
    score: 9.2,
    owner: "Customer Success",
    focusAreas: ["Onboarding", "Support", "Product Training"]
  },
  {
    id: "2",
    rank: 2,
    title: "Process Automation",
    description: "Automate manual workflows to improve efficiency",
    impact: "high",
    effort: "low",
    score: 8.8,
    owner: "Operations",
    focusAreas: ["Approvals", "Data Entry", "Reporting"]
  },
  {
    id: "3",
    rank: 3,
    title: "Market Expansion - Southeast Region",
    description: "Enter new geographic market with high growth potential",
    impact: "high",
    effort: "high",
    score: 8.5,
    owner: "Business Development",
    focusAreas: ["Market Research", "Partnerships", "Local Operations"]
  },
  {
    id: "4",
    rank: 4,
    title: "Product Quality Improvements",
    description: "Reduce defects and enhance product reliability",
    impact: "medium",
    effort: "medium",
    score: 7.9,
    owner: "Product Team",
    focusAreas: ["Testing", "Code Review", "Quality Metrics"]
  },
  {
    id: "5",
    rank: 5,
    title: "Employee Development Program",
    description: "Invest in training and career growth opportunities",
    impact: "medium",
    effort: "medium",
    score: 7.5,
    owner: "Human Resources",
    focusAreas: ["Training", "Mentorship", "Career Paths"]
  },
  {
    id: "6",
    rank: 6,
    title: "Technology Infrastructure Upgrade",
    description: "Modernize legacy systems for better performance",
    impact: "medium",
    effort: "high",
    score: 7.2,
    owner: "Engineering",
    focusAreas: ["Migration", "Testing", "Documentation"]
  },
]

interface InsightsPrioritiesTabProps {
  data?: any[]
  loading?: boolean
}

export function InsightsPrioritiesTab({ data = [], loading = false }: InsightsPrioritiesTabProps) {
  const displayPriorities = data || []
  return (
    <div className="space-y-6">
      {/* Prioritization Matrix */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Impact vs Effort Matrix</h3>
              <div className="grid grid-cols-2 gap-2 h-64">
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-medium text-green-800 mb-2">
                    <ArrowUp className="h-3 w-3" />
                    High Impact, Low Effort
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Badge className="bg-green-600">Quick Wins: 1</Badge>
                  </div>
                </div>
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-medium text-blue-800 mb-2">
                    <ArrowUp className="h-3 w-3" />
                    High Impact, High Effort
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Badge className="bg-blue-600">Strategic: 2</Badge>
                  </div>
                </div>
                <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-medium text-yellow-800 mb-2">
                    <ArrowRight className="h-3 w-3" />
                    Medium Impact, Low Effort
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Badge className="bg-yellow-600">Fill-ins: 0</Badge>
                  </div>
                </div>
                <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-3 flex flex-col">
                  <div className="flex items-center gap-1 text-xs font-medium text-gray-800 mb-2">
                    <ArrowDown className="h-3 w-3" />
                    Medium Impact, High Effort
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <Badge variant="secondary">Lower Priority: 3</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Priority Score Distribution</h3>
              <div className="space-y-3">
                {priorities.slice(0, 3).map((priority) => (
                  <div key={priority.id} className="flex items-center gap-3">
                    <div className="text-2xl font-bold text-muted-foreground w-8">{priority.rank}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-accent rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center px-3"
                          style={{ width: `${priority.score * 10}%` }}
                        >
                          <span className="text-xs font-bold text-white">{priority.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ranked Priorities List */}
      <div className="space-y-3">
        {priorities.map((priority) => (
          <Card key={priority.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-xl flex-shrink-0">
                  {priority.rank}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{priority.title}</h3>
                    <Badge variant="outline" className={
                      priority.impact === "high" && priority.effort === "low" ? "bg-green-100 text-green-800 border-green-200" :
                      priority.impact === "high" && priority.effort === "high" ? "bg-blue-100 text-blue-800 border-blue-200" :
                      "bg-gray-100 text-gray-800 border-gray-200"
                    }>
                      Score: {priority.score}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{priority.description}</p>
                  
                  <div className="flex items-center gap-6 text-sm mb-3">
                    <div>
                      <span className="text-muted-foreground">Impact: </span>
                      <Badge variant={priority.impact === "high" ? "default" : "secondary"} className={priority.impact === "high" ? "bg-purple-600" : ""}>
                        {priority.impact}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Effort: </span>
                      <Badge variant="outline">{priority.effort}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Owner: </span>
                      <span className="font-medium">{priority.owner}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm text-muted-foreground">Focus Areas: </span>
                    {priority.focusAreas.map((area, idx) => (
                      <Badge key={idx} variant="outline" className="ml-1 text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
