"use client"

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recommendations = [
  {
    id: "1",
    category: "Revenue Optimization",
    title: "Implement Dynamic Pricing Strategy",
    description: "Our analysis shows that adjusting pricing by time/demand could increase revenue by 15-18%",
    impact: "High",
    effort: "Medium",
    confidence: 89,
    dataPoints: ["Historical sales data", "Competitor pricing", "Market demand patterns"],
    estimatedBenefit: "+$340K annual revenue",
    timeline: "3-4 months to implement",
    icon: TrendingUp,
    color: "text-green-600"
  },
  {
    id: "2",
    category: "Process Improvement",
    title: "Automate Manual Approval Workflows",
    description: "56% of approval processes are manual. Automation could save 240 hours/month",
    impact: "High",
    effort: "Low",
    confidence: 94,
    dataPoints: ["Process mining data", "Time tracking", "Employee surveys"],
    estimatedBenefit: "240 hrs/month saved",
    timeline: "4-6 weeks to implement",
    icon: Lightbulb,
    color: "text-blue-600"
  },
  {
    id: "3",
    category: "Risk Mitigation",
    title: "Diversify Supplier Base",
    description: "72% of critical materials from single source presents supply chain risk",
    impact: "Medium",
    effort: "High",
    confidence: 87,
    dataPoints: ["Supply chain analysis", "Vendor performance", "Market research"],
    estimatedBenefit: "Reduced risk exposure",
    timeline: "6-8 months to implement",
    icon: AlertTriangle,
    color: "text-yellow-600"
  },
  {
    id: "4",
    category: "Customer Experience",
    title: "Launch Customer Self-Service Portal",
    description: "68% of support requests could be resolved via self-service, reducing costs by $180K/year",
    impact: "High",
    effort: "Medium",
    confidence: 91,
    dataPoints: ["Support ticket analysis", "Customer feedback", "Industry benchmarks"],
    estimatedBenefit: "$180K/year cost reduction",
    timeline: "2-3 months to implement",
    icon: TrendingUp,
    color: "text-purple-600"
  },
  {
    id: "5",
    category: "Resource Allocation",
    title: "Redistribute Project Resources",
    description: "Team A is at 92% capacity while Team B is at 64%. Rebalancing could improve delivery by 20%",
    impact: "Medium",
    effort: "Low",
    confidence: 86,
    dataPoints: ["Resource utilization data", "Project timelines", "Skill assessments"],
    estimatedBenefit: "+20% delivery improvement",
    timeline: "Immediate implementation",
    icon: Lightbulb,
    color: "text-orange-600"
  },
]

export function InsightsRecommendationsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {recommendations.map((rec) => {
          const Icon = rec.icon
          return (
            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent rounded-lg">
                      <Icon className={`h-6 w-6 ${rec.color}`} />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{rec.category}</Badge>
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <CardDescription className="mt-2 text-base">{rec.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={rec.impact === "High" ? "default" : "secondary"} className={rec.impact === "High" ? "bg-purple-600" : ""}>
                      {rec.impact} Impact
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-accent rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Estimated Benefit</p>
                      <p className="text-sm font-bold mt-1">{rec.estimatedBenefit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Implementation Effort</p>
                      <p className="text-sm font-bold mt-1">{rec.effort}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence Level</p>
                      <p className="text-sm font-bold mt-1">{rec.confidence}%</p>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div>
                    <p className="text-sm font-medium mb-2">Based on analysis of:</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.dataPoints.map((point, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Timeline and Action */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Timeline:</span> {rec.timeline}
                    </p>
                    <Button>
                      View Details
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
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
