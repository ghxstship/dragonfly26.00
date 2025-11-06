"use client"

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ArrowRight, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
const recommendations = [
  {
    id: "1",
    categoryKey: "revenue_optimization",
    titleKey: "implement_dynamic_pricing_strategy",
    descriptionKey: "our_analysis_shows_that_adjusting_pricing_by_timedemand_coul",
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
    categoryKey: "process_improvement",
    titleKey: "automate_manual_approval_workflows",
    descriptionKey: "56_of_approval_processes_are_manual_automation_could_save_24",
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
    categoryKey: "risk_mitigation",
    titleKey: "diversify_supplier_base",
    descriptionKey: "72_of_critical_materials_from_single_source_presents_supply_",
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
    categoryKey: "customer_experience",
    titleKey: "launch_customer_selfservice_portal",
    descriptionKey: "68_of_support_requests_could_be_resolved_via_selfservice_red",
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
    categoryKey: "resource_allocation",
    titleKey: "redistribute_project_resources",
    descriptionKey: "team_a_is_at_92_capacity_while_team_b_is_at_64_rebalancing_c",
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

interface InsightsRecommendationsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsRecommendationsTab({ data = [], loading = false }: InsightsRecommendationsTabProps) {
  const t = useTranslations('intelligence.insights.insightsrecommendations')
  const tCommon = useTranslations('common')

  const displayRecommendations = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="space-y-4">
        {recommendations.map((rec: any) => {
          const Icon = rec.icon
          return (
            <Card key={rec.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent rounded-lg">
                      <Icon aria-hidden="true" className={`h-6 w-6 ${rec.color}`} />
                    </div>
                    <div>
                      <Badge variant="outline" className="mb-2">{t(rec.categoryKey)}</Badge>
                      <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl">{t(rec.titleKey)}</CardTitle>
                      <CardDescription aria-hidden="true" className="mt-2 text-base">{t(rec.descriptionKey)}</CardDescription>
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
                  <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 p-4 bg-accent rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('estimatedBenefit')}</p>
                      <p className="text-sm font-bold mt-1">{rec.estimatedBenefit}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('implementationEffort')}</p>
                      <p className="text-sm font-bold mt-1">{rec.effort}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{t('confidenceLevel')}</p>
                      <p className="text-sm font-bold mt-1">{rec.confidence}%</p>
                    </div>
                  </div>

                  {/* Data Sources */}
                  <div>
                    <p className="text-sm font-medium mb-2">Based on analysis of:</p>
                    <div className="flex flex-wrap gap-2">
                      {rec.dataPoints.map((point: any, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Timeline and Action */}
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Timeline:</span> {rec.timeline}
                    </p>
                    <Button>
                      View Details
                      <ArrowRight aria-hidden="true" className="h-4 w-4 ml-2" />
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
