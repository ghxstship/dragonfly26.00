"use client"

import { Lightbulb, Target, TrendingUp, AlertTriangle, CheckCircle2, Sparkles, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useInsightsData } from "@/hooks/use-insights-data"

interface StrategicInsight {
  id: string
  type: string
  priority: string
  titleKey: string
  descriptionKey: string
  impact: string
  confidence: number
  recommendation: string
}

interface Objective {
  nameKey: string
  progress: number
  target: number
  status: string
}

const strategicInsights: StrategicInsight[] = [
  {
    id: "1",
    type: "opportunity",
    priority: "high",
    titleKey: "market_expansion_opportunity",
    descriptionKey: "analysis_shows_23_untapped_market_potential_in_southeast_reg",
    impact: "High Revenue Impact",
    confidence: 87,
    recommendation: "Allocate resources to regional expansion in Q1 2026"
  },
  {
    id: "2",
    type: "risk",
    priority: "medium",
    titleKey: "resource_utilization_below_target",
    descriptionKey: "team_capacity_at_68_17_below_optimal_utilization_rate",
    impact: "Efficiency Loss",
    confidence: 92,
    recommendation: "Redistribute workload and consider strategic hiring"
  },
  {
    id: "3",
    type: "achievement",
    priority: "low",
    titleKey: "customer_satisfaction_milestone",
    descriptionKey: "exceeded_quarterly_satisfaction_target_by_12",
    impact: "Positive Brand Impact",
    confidence: 95,
    recommendation: "Document and replicate successful practices"
  },
]

const objectives: Objective[] = [
  { nameKey: "increase_customer_satisfaction", progress: 87, target: 90, status: "on_track" },
  { nameKey: "reduce_operational_costs", progress: 53, target: 100, status: "at_risk" },
  { nameKey: "expand_market_presence", progress: 33, target: 100, status: "on_track" },
  { nameKey: "improve_process_efficiency", progress: 78, target: 85, status: "on_track" },
]

interface InsightsOverviewTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsOverviewTab({ data = [], loading = false }: InsightsOverviewTabProps) {
  const t = useTranslations('intelligence.insights.insightsoverview')
  const tCommon = useTranslations('common')

  const displayGoals = data || []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('activeObjectives')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-2" aria-live="polite">12</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('onTrack')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-2 text-green-600" aria-live="polite">9</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600 flex-shrink-0" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('atRisk')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-2 text-yellow-600" aria-live="polite">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('insightsGenerated')}</p>
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-2" aria-live="polite">47</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-600" aria-hidden="true" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Powered Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" aria-hidden="true" />
            {t('strategicInsightsRecommendations')}
          </CardTitle>
          <CardDescription>{t('aiPoweredAnalysisDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategicInsights.map((insight: any) => (
              <div key={insight.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {insight.type === "opportunity" && <TrendingUp className="h-5 w-5 text-green-600 mt-1" aria-hidden="true" />}
                    {insight.type === "risk" && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-1" aria-hidden="true" />}
                    {insight.type === "achievement" && <CheckCircle2 className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" aria-hidden="true" />}
                    <div>
                      <h4 className="font-semibold">{t(insight.titleKey)}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{t(insight.descriptionKey)}</p>
                    </div>
                  </div>
                  <Badge variant={insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"}>
                    {insight.priority} {t('priority')}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm mt-3 pt-3 border-t">
                  <span className="text-muted-foreground">{insight.impact}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    {t('confidence')}: <span className="font-medium">{insight.confidence}%</span>
                  </span>
                </div>
                
                <div className="mt-3 p-3 bg-accent rounded-md">
                  <p className="text-sm"><span className="font-medium">{t('recommendation')}:</span> {insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Objectives Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t('activeObjectivesProgress')}</CardTitle>
          <CardDescription>{t('trackProgressDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {objectives.map((obj, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <p className="font-medium">{t(obj.nameKey)}</p>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
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
