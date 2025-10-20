"use client"

import { TrendingUp, Calendar, Target, Plus, ChartLine, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
import { useInsightsData } from "@/hooks/use-insights-data"

interface TimelinePoint {
  month: string
  progress: number
  target: number
}

interface ProgressData {
  objective: string
  timeline: TimelinePoint[]
  status: string
  velocity: string
}

const progressData: ProgressData[] = [
  {
    objective: "Increase Customer Satisfaction",
    timeline: [
      { month: "Jul", progress: 75, target: 78 },
      { month: "Aug", progress: 80, target: 82 },
      { month: "Sep", progress: 84, target: 86 },
      { month: "Oct", progress: 87, target: 90 },
    ],
    status: "on_track",
    velocity: "+3% per month"
  },
  {
    objective: "Reduce Operational Costs",
    timeline: [
      { month: "Jul", progress: 30, target: 40 },
      { month: "Aug", progress: 38, target: 55 },
      { month: "Sep", progress: 45, target: 70 },
      { month: "Oct", progress: 53, target: 85 },
    ],
    status: "at_risk",
    velocity: "+7.5% per month"
  },
  {
    objective: "Expand Market Presence",
    timeline: [
      { month: "Jul", progress: 10, target: 15 },
      { month: "Aug", progress: 18, target: 30 },
      { month: "Sep", progress: 25, target: 50 },
      { month: "Oct", progress: 33, target: 70 },
    ],
    status: "on_track",
    velocity: "+8% per month"
  },
]

interface InsightsProgressTrackingTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function InsightsProgressTrackingTab({ data = [], loading = false }: InsightsProgressTrackingTabProps) {
  const t = useTranslations('intelligence.insights.insightsprogresstracking')
  const tCommon = useTranslations('common')

  const displayProgress = data || []
  return (
    <div className="space-y-6">
      {/* Overall Progress Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('overallProgress')}</p>
            <p className="text-2xl font-bold mt-1" aria-live="polite">58%</p>
            <p className="text-xs text-green-600 mt-1">+12% this quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('objectivesOnTrack')}</p>
            <p className="text-2xl font-bold mt-1 text-green-600" aria-live="polite">2/3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{t('avgVelocity')}</p>
            <p className="text-2xl font-bold mt-1" aria-live="polite">+6.2%</p>
            <p className="text-xs text-muted-foreground mt-1">per month</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      {progressData.map((data, index: number) => (
        <Card key={index} role="article">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{data.objective}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Velocity: {data.velocity}
                </p>
              </div>
              <Badge 
                variant={data.status === "on_track" ? "default" : "secondary"}
                className={data.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}
              >
                {data.status === "on_track" ? "On Track" : "At Risk"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Timeline visualization */}
              <div className="grid grid-cols-4 gap-4">
                {data.timeline.map((month, idx: number) => {
                  const isAhead = month.progress >= month.target
                  
                  return (
                    <div key={idx} className="text-center">
                      <p className="text-sm font-medium mb-3">{month.month}</p>
                      <div className="relative h-32 bg-accent rounded-lg overflow-hidden">
                        <div 
                          className={`absolute bottom-0 w-full ${isAhead ? 'bg-green-600' : 'bg-blue-600'} transition-all`}
                          style={{ height: `${month.progress}%` }}
                        >
                          <div className="absolute top-2 left-0 right-0 text-xs font-bold text-white">
                            {month.progress}%
                          </div>
                        </div>
                        <div 
                          className="absolute w-full border-t-2 border-dashed border-yellow-600"
                          style={{ bottom: `${month.target}%` }}
                        >
                          <div className="absolute -top-4 right-1 text-xs text-yellow-600 font-medium">
                            {month.target}%
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {month.progress >= month.target ? '✓ On target' : `${month.target - month.progress}% behind`}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Current Status */}
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{t('currentVsTarget')}</span>
                  <span className="text-sm font-bold">
                    {data.timeline[3].progress}% / {data.timeline[3].target}%
                  </span>
                </div>
                <Progress 
                  value={(data.timeline[3].progress / data.timeline[3].target) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
