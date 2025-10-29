"use client"

import { ListOrdered, ArrowUp, ArrowRight, ArrowDown, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useInsightsData } from "@/hooks/use-insights-data"
const priorities = [
  {
    id: "1",
    rank: 1,
    titleKey: "customer_retention_initiative",
    descriptionKey: "focus_on_reducing_churn_and_increasing_customer_lifetime_val",
    impact: "high",
    effort: "medium",
    score: 9.2,
    owner: "Customer Success",
    focusAreas: ["Onboarding", "Support", "Product Training"]
  },
  {
    id: "2",
    rank: 2,
    titleKey: "process_automation",
    descriptionKey: "automate_manual_workflows_to_improve_efficiency",
    impact: "high",
    effort: "low",
    score: 8.8,
    owner: "Operations",
    focusAreas: ["Approvals", "Data Entry", "Reporting"]
  },
  {
    id: "3",
    rank: 3,
    titleKey: "market_expansion__southeast_region",
    descriptionKey: "enter_new_geographic_market_with_high_growth_potential",
    impact: "high",
    effort: "high",
    score: 8.5,
    owner: "Business Development",
    focusAreas: ["Market Research", "Partnerships", "Local Operations"]
  },
  {
    id: "4",
    rank: 4,
    titleKey: "product_quality_improvements",
    descriptionKey: "reduce_defects_and_enhance_product_reliability",
    impact: "medium",
    effort: "medium",
    score: 7.9,
    owner: "Product Team",
    focusAreas: ["Testing", "Code Review", "Quality Metrics"]
  },
  {
    id: "5",
    rank: 5,
    titleKey: "employee_development_program",
    descriptionKey: "invest_in_training_and_career_growth_opportunities",
    impact: "medium",
    effort: "medium",
    score: 7.5,
    owner: "Human Resources",
    focusAreas: ["Training", "Mentorship", "Career Paths"]
  },
  {
    id: "6",
    rank: 6,
    titleKey: "technology_infrastructure_upgrade",
    descriptionKey: "modernize_legacy_systems_for_better_performance",
    impact: "medium",
    effort: "high",
    score: 7.2,
    owner: "Engineering",
    focusAreas: ["Migration", "Testing", "Documentation"]
  },
]

interface InsightsPrioritiesTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsPrioritiesTab({ data = [], loading = false }: InsightsPrioritiesTabProps) {
  const t = useTranslations('intelligence.insights.insightspriorities')
  const tCommon = useTranslations('common')

  const displayPriorities = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Priority Matrix */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
            <div>
              <h3 className="font-semibold mb-3">{t('impactVsEffortMatrix')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 h-48 md:h-56 lg:h-64">
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-3 flex flex-wrap flex-col">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs font-medium text-green-800 mb-2">
                    <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    High Impact, Low Effort
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center">
                    <Badge className="bg-green-600">Quick Wins: 1</Badge>
                  </div>
                </div>
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-3 flex flex-wrap flex-col">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs font-medium text-blue-800 mb-2">
                    <ArrowUp className="h-3 w-3" aria-hidden="true" />
                    High Impact, High Effort
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center">
                    <Badge className="bg-blue-600">Strategic: 2</Badge>
                  </div>
                </div>
                <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3 flex flex-wrap flex-col">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs font-medium text-yellow-800 mb-2">
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    Medium Impact, Low Effort
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center">
                    <Badge className="bg-yellow-600">Fill-ins: 0</Badge>
                  </div>
                </div>
                <div className="border-2 border-gray-200 bg-gray-50 rounded-lg p-3 flex flex-wrap flex-col">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs font-medium text-gray-800 mb-2">
                    <ArrowDown className="h-3 w-3" aria-hidden="true" />
                    Medium Impact, High Effort
                  </div>
                  <div className="flex-1 flex flex-wrap items-center justify-center">
                    <Badge variant="secondary">Lower Priority: 3</Badge>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">{t('priorityScoreDistribution')}</h3>
              <div className="space-y-3">
                {priorities.slice(0, 3).map((priority: any) => (
                  <div key={priority.id} className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-muted-foreground w-8">{priority.rank}</div>
                    <div className="flex-1">
                      <div className="h-8 bg-accent rounded-lg overflow-hidden md:block">
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
        {priorities.map((priority: any) => (
          <Card key={priority.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 md:gap-3 lg:gap-4">
                <div className="flex flex-wrap items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-base md:text-lg lg:text-xl flex-shrink-0">
                  {priority.rank}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{t(priority.titleKey)}</h3>
                    <Badge variant="outline" className={
                      priority.impact === "high" && priority.effort === "low" ? "bg-green-100 text-green-800 border-green-200" :
                      priority.impact === "high" && priority.effort === "high" ? "bg-blue-100 text-blue-800 border-blue-200" :
                      "bg-gray-100 text-gray-800 border-gray-200"
                    }>
                      Score: {priority.score}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{t(priority.descriptionKey)}</p>
                  
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 text-sm mb-3">
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
                    {priority.focusAreas.map((area: any, idx: number) => (
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
