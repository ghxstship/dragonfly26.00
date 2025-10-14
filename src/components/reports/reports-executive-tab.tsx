"use client"

import { Crown, TrendingUp, DollarSign, Users, Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const executiveReports = [
  {
    id: "1",
    title: "CEO Monthly Dashboard",
    description: "Company-wide performance overview",
    metrics: ["Revenue", "Growth", "Customer Acquisition", "Market Share"],
    lastUpdated: "2025-10-10",
    recipients: ["CEO", "Board of Directors"],
    status: "ready"
  },
  {
    id: "2",
    title: "Board of Directors Quarterly Report",
    description: "Comprehensive quarterly business review",
    metrics: ["Financial Performance", "Strategic Initiatives", "Risk Assessment", "Market Position"],
    lastUpdated: "2025-10-01",
    recipients: ["Board Members"],
    status: "ready"
  },
  {
    id: "3",
    title: "CFO Financial Summary",
    description: "Detailed financial performance and forecasting",
    metrics: ["P&L", "Cash Flow", "Budget vs Actual", "Financial Projections"],
    lastUpdated: "2025-10-09",
    recipients: ["CFO", "Finance Committee"],
    status: "ready"
  },
  {
    id: "4",
    title: "Strategic Plan Progress Report",
    description: "Progress against 3-year strategic plan",
    metrics: ["Strategic Goals", "KPIs", "Milestones", "Roadmap"],
    lastUpdated: "2025-09-30",
    recipients: ["Executive Team"],
    status: "ready"
  },
]

const kpiSummary = [
  { name: "Revenue Growth", value: "+12.5%", target: "+15%", progress: 83, status: "on_track" },
  { name: "Customer Retention", value: "94%", target: "95%", progress: 99, status: "on_track" },
  { name: "Market Share", value: "18.2%", target: "20%", progress: 91, status: "on_track" },
  { name: "Operating Margin", value: "22%", target: "25%", progress: 88, status: "at_risk" },
]

interface ReportsExecutiveTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsExecutiveTab({ data = [], loading = false }: ReportsExecutiveTabProps) {
  const displayData = data || []
  return (
    <div className="space-y-6">
      {/* KPI Summary Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle>Executive KPI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {kpiSummary.map((kpi, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{kpi.name}</p>
                  <Badge variant={kpi.status === "on_track" ? "default" : "secondary"} className={kpi.status === "on_track" ? "bg-green-600" : "bg-yellow-600"}>
                    {kpi.status === "on_track" ? "On Track" : "At Risk"}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  <span className="text-sm text-muted-foreground">/ {kpi.target}</span>
                </div>
                <Progress value={kpi.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Reports List */}
      <div className="grid gap-4">
        {executiveReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      {report.status}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{report.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Key Metrics</p>
                      <div className="flex flex-wrap gap-2">
                        {report.metrics.map((metric, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Recipients</p>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{report.recipients.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Last updated: {report.lastUpdated}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button>
                    <Target className="h-4 w-4 mr-2" />
                    View Report
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
