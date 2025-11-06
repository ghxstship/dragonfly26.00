"use client"

import { useState } from "react"
import { CheckCircle2, TrendingUp, Calendar, Plus, type LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
const keyResults = [
  {
    id: "1",
    objective: "Increase Customer Satisfaction Score",
    nameKey: "achieve_nps_score_of_50",
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
    nameKey: "reduce_response_time_to_under_1_hour",
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
    nameKey: "decrease_overhead_by_500k_annually",
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
    nameKey: "improve_resource_utilization_to_85",
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
    nameKey: "launch_in_3_new_markets",
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
    nameKey: "achieve_2m_revenue_from_new_markets",
    current: 0.4,
    target: 2.0,
    unit: "M",
    progress: 20,
    owner: "Casey Martinez",
    dueDate: "2026-06-30",
    status: "on_track"
  },
]

interface InsightsKeyResultsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsKeyResultsTab({ data = [], loading = false }: InsightsKeyResultsTabProps) {
  const t = useTranslations('intelligence.insights.insightskeyresults')
  const tCommon = useTranslations('common')

  const displayKeyResults = data || []
  
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('totalKeyResults')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">{keyResults.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('onTrack')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-green-600" aria-live="polite">
              {keyResults.filter(kr => kr.status === "on_track").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('atRisk')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1 text-yellow-600" aria-live="polite">
              {keyResults.filter(kr => kr.status === "at_risk").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="p-4">
            <p className="text-sm text-muted-foreground">{t('avgProgress')}</p>
            <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold mt-1" aria-live="polite">
              {Math.round(keyResults.reduce((sum: number, kr) => sum + kr.progress, 0) / keyResults.length)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Group by Objective */}
      {Array.from(new Set(keyResults.map(kr => kr.objective))).map((objective: any) => (
        <div key={objective}>
          <h3 className="font-semibold mb-3">{objective}</h3>
          <div className="space-y-3 mb-6">
            {keyResults.filter(kr => kr.objective === objective).map((kr: any) => (
              <Card key={kr.id} className="hover:shadow-md transition-shadow">
                <CardContent aria-hidden="true" className="p-4">
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-3">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 flex-1">
                      <CheckCircle2 className={`h-5 w-5 ${kr.status === "on_track" ? "text-green-600" : "text-yellow-600"}`} aria-hidden="true" />
                      <div className="flex-1">
                        <h4 className="font-medium">{t(kr.nameKey)}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Owner: {kr.owner} • Due: {kr.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold" aria-live="polite">
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
