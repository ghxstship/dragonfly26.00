"use client"

import { TrendingUp, Target, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const forecasts = [
  {
    metric: "Revenue",
    current: "$2.4M",
    forecast: [
      { period: "Oct 2025", value: 2.5, confidence: 95 },
      { period: "Nov 2025", value: 2.7, confidence: 92 },
      { period: "Dec 2025", value: 2.9, confidence: 88 },
      { period: "Jan 2026", value: 3.1, confidence: 82 },
    ],
    trend: "up"
  },
  {
    metric: "Customer Growth",
    current: "14,234",
    forecast: [
      { period: "Oct 2025", value: 14800, confidence: 93 },
      { period: "Nov 2025", value: 15500, confidence: 90 },
      { period: "Dec 2025", value: 16200, confidence: 86 },
      { period: "Jan 2026", value: 17000, confidence: 80 },
    ],
    trend: "up"
  },
  {
    metric: "Operating Costs",
    current: "$1.2M",
    forecast: [
      { period: "Oct 2025", value: 1.18, confidence: 96 },
      { period: "Nov 2025", value: 1.15, confidence: 94 },
      { period: "Dec 2025", value: 1.12, confidence: 91 },
      { period: "Jan 2026", value: 1.08, confidence: 87 },
    ],
    trend: "down"
  },
]

export function AnalyticsForecastingTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {forecasts.map((forecast, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{forecast.metric} Forecast</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: <span className="font-bold text-foreground">{forecast.current}</span>
                  </p>
                </div>
                <Badge variant="outline" className={
                  forecast.trend === "up" ? "bg-green-100 text-green-800 border-green-200" : "bg-blue-100 text-blue-800 border-blue-200"
                }>
                  {forecast.trend === "up" ? "↑ Growing" : "↓ Optimizing"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Forecast Timeline */}
                <div className="grid grid-cols-4 gap-4">
                  {forecast.forecast.map((item, idx) => (
                    <div key={idx} className="p-4 border rounded-lg hover:bg-accent transition-colors">
                      <p className="text-sm font-medium text-muted-foreground mb-2">{item.period}</p>
                      <p className="text-2xl font-bold mb-2">{item.value.toLocaleString()}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.confidence >= 90 ? 'bg-green-600' : item.confidence >= 85 ? 'bg-yellow-600' : 'bg-orange-600'}`}
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{item.confidence}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">confidence</p>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div className="p-4 bg-accent rounded-lg flex items-start gap-3">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium mb-1">Forecast Insight</p>
                    <p className="text-sm text-muted-foreground">
                      Based on historical trends and current data, {forecast.metric.toLowerCase()} is projected to {
                        forecast.trend === "up" ? "increase" : "decrease"
                      } by approximately {Math.round(((forecast.forecast[3].value / parseFloat(forecast.current.replace(/[$,KM]/g, ''))) - 1) * 100)}% over the next 4 months. 
                      Confidence decreases over time as external factors introduce variability.
                    </p>
                  </div>
                </div>

                {/* Warning for low confidence */}
                {forecast.forecast[3].confidence < 85 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">
                      Long-term forecast confidence is below 85%. Consider reviewing assumptions and market conditions.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
