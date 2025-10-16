"use client"

import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Target, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"
const insights = [
  {
    id: "1",
    type: "opportunity",
    titleKey: "untapped_market_segment_identified",
    message: "Analysis shows 18% of your target demographic is underserved. Consider targeted marketing campaign.",
    source: "Customer Analytics",
    confidence: 89,
    timestamp: "2 hours ago",
    priority: "high"
  },
  {
    id: "2",
    type: "trend",
    titleKey: "customer_satisfaction_trending_upward",
    message: "NPS score has increased 12% over last 3 months. Current initiatives are driving positive results.",
    source: "Customer Success Data",
    confidence: 94,
    timestamp: "4 hours ago",
    priority: "medium"
  },
  {
    id: "3",
    type: "risk",
    titleKey: "resource_utilization_below_optimal",
    message: "Team capacity at 68% for 3rd consecutive week. Consider workload redistribution or strategic hiring.",
    source: "Operations Analytics",
    confidence: 91,
    timestamp: "6 hours ago",
    priority: "high"
  },
  {
    id: "4",
    type: "recommendation",
    titleKey: "automate_approval_workflows",
    message: "56% of approval processes are manual, taking average of 4.2 hours. Automation could save 240 hrs/month.",
    source: "Process Mining",
    confidence: 87,
    timestamp: "8 hours ago",
    priority: "medium"
  },
  {
    id: "5",
    type: "benchmark",
    titleKey: "above_industry_average_in_quality_metrics",
    message: "Your quality score (92%) exceeds industry average (85%) by 7 points. Strong competitive advantage.",
    source: "Industry Benchmarks",
    confidence: 96,
    timestamp: "1 day ago",
    priority: "low"
  },
  {
    id: "6",
    type: "opportunity",
    titleKey: "crosssell_potential_detected",
    message: "23% of customers using Product A show high propensity for Product B based on usage patterns.",
    source: "Product Analytics",
    confidence: 82,
    timestamp: "1 day ago",
    priority: "medium"
  },
]

interface InsightsIntelligenceFeedTabProps {
  data?: any[]
  loading?: boolean
}

export function InsightsIntelligenceFeedTab({ data = [], loading = false }: InsightsIntelligenceFeedTabProps) {
  const t = useTranslations('intelligence.insights.insightsintelligencefeed')
  const tCommon = useTranslations('common')

  const displayInsights = data || []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <Button size="sm" aria-label={`${tCommon('create')} item`}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {tCommon('create')}
        </Button>
      </div>


      {/* Filter Badges */}
      <div className="flex gap-2">
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">All ({insights.length})</Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          High Priority ({insights.filter(i => i.priority === "high").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Opportunities ({insights.filter(i => i.type === "opportunity").length})
        </Badge>
        <Badge variant="outline" className="cursor-pointer hover:bg-accent">
          Risks ({insights.filter(i => i.type === "risk").length})
        </Badge>
      </div>

      {/* Intelligence Feed */}
      <div className="space-y-3">
        {insights.map((insight) => {
          const Icon = 
            insight.type === "opportunity" ? TrendingUp :
            insight.type === "risk" ? AlertTriangle :
            insight.type === "recommendation" ? Lightbulb :
            insight.type === "trend" ? Sparkles :
            Target

          const colorClass =
            insight.type === "opportunity" ? "text-green-600" :
            insight.type === "risk" ? "text-yellow-600" :
            insight.type === "recommendation" ? "text-blue-600" :
            insight.type === "trend" ? "text-purple-600" :
            "text-gray-600"

          const bgClass =
            insight.type === "opportunity" ? "bg-green-100" :
            insight.type === "risk" ? "bg-yellow-100" :
            insight.type === "recommendation" ? "bg-blue-100" :
            insight.type === "trend" ? "bg-purple-100" :
            "bg-gray-100"

          return (
            <Card key={insight.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${bgClass} flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${colorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{t(insight.titleKey)}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge 
                          variant={insight.priority === "high" ? "destructive" : insight.priority === "medium" ? "default" : "secondary"}
                        >
                          {insight.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{insight.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Source:</span> {insight.source}
                      </span>
                      <span>•</span>
                      <span>{insight.timestamp}</span>
                    </div>
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
