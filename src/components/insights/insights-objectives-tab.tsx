"use client"

import { useState } from "react"
import { Target, Plus, Edit, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
import { useInsightsData } from "@/hooks/use-insights-data"

const objectives = [
  {
    id: "1",
    nameKey: "increase_customer_satisfaction_score",
    descriptionKey: "improve_overall_customer_satisfaction_from_85_to_90",
    owner: "Customer Success Team",
    progress: 87,
    target: 90,
    status: "on_track",
    keyResults: 3,
    dueDate: "2025-12-31"
  },
  {
    id: "2",
    nameKey: "reduce_operational_costs",
    descriptionKey: "decrease_operational_expenses_by_15_through_process_optimiza",
    owner: "Operations Team",
    progress: 53,
    target: 100,
    status: "at_risk",
    keyResults: 4,
    dueDate: "2025-12-31"
  },
  {
    id: "3",
    nameKey: "expand_market_presence",
    descriptionKey: "enter_3_new_geographic_markets_and_establish_local_operation",
    owner: "Business Development",
    progress: 33,
    target: 100,
    status: "on_track",
    keyResults: 5,
    dueDate: "2026-06-30"
  },
  {
    id: "4",
    nameKey: "improve_product_quality",
    descriptionKey: "reduce_defect_rate_to_below_1_and_increase_quality_scores",
    owner: "Product Team",
    progress: 78,
    target: 85,
    status: "on_track",
    keyResults: 3,
    dueDate: "2025-12-31"
  },
  {
    id: "5",
    nameKey: "enhance_employee_engagement",
    descriptionKey: "increase_employee_satisfaction_score_to_4550",
    owner: "HR Team",
    progress: 82,
    target: 90,
    status: "on_track",
    keyResults: 4,
    dueDate: "2025-12-31"
  },
]

interface InsightsObjectivesTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsObjectivesTab({ data = [], loading = false }: InsightsObjectivesTabProps) {
  const t = useTranslations('intelligence.insights.insightsobjectives')
  const tCommon = useTranslations('common')
  
  // Transform data to ensure owner has name field
  const transformedData = data.length > 0 ? data.map((item: any) => ({
    ...item,
    owner: item.owner ? {
      ...item.owner,
      name: item.owner.first_name && item.owner.last_name 
        ? `${item.owner.first_name} ${item.owner.last_name}`
        : item.owner.name || 'Unknown'
    } : null
  })) : objectives
  
  const displayObjectives = transformedData
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('totalObjectives')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">{objectives.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('onTrack')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-green-600" aria-live="polite">
              {objectives.filter(o => (o as any).status === "on_track").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('atRisk')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-yellow-600" aria-live="polite">
              {objectives.filter(o => (o as any).status === "at_risk").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('avgProgress')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">
              {Math.round(objectives.reduce((sum: number, o) => sum + o.progress, 0) / objectives.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {objectives.map((objective: any) => (
          <Card key={objective.id} className="hover:shadow-md transition-shadow">
            <CardContent aria-hidden="true" className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <Target aria-hidden="true" className="h-6 w-6 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{t(objective.nameKey)}</h3>
                      <Badge 
                        variant={objective.status === "on_track" ? "default" : "secondary"}
                        className={objective.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}
                      >
                        {objective.status === "on_track" ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" aria-hidden="true" /> On Track</>
                        ) : (
                          "At Risk"
                        )}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{t(objective.descriptionKey)}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">{t('owner')}</p>
                        <p className="font-medium">{objective.owner}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('keyResults')}</p>
                        <p className="font-medium">{objective.keyResults} KRs</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('dueDate')}</p>
                        <p className="font-medium">{objective.dueDate}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('progress')}</span>
                        <span className="font-bold">{objective.progress}% / {objective.target}%</span>
                      </div>
                      <Progress value={objective.progress} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <Button variant="outline" size="sm">
                  <Edit aria-hidden="true" className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>


    </div>
  )
}
