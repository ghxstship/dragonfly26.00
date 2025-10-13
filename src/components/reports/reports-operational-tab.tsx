"use client"

import { Activity, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const operationalReports = [
  {
    id: "1",
    title: "Daily Operations Summary",
    frequency: "Daily at 6:00 PM",
    metrics: {
      completed: 45,
      inProgress: 23,
      blocked: 3,
      efficiency: 87
    },
    lastRun: "Today at 6:00 PM",
    trend: "up"
  },
  {
    id: "2",
    title: "Team Performance Report",
    frequency: "Weekly on Monday",
    metrics: {
      completed: 234,
      inProgress: 67,
      blocked: 12,
      efficiency: 82
    },
    lastRun: "Oct 7, 2025",
    trend: "up"
  },
  {
    id: "3",
    title: "Resource Utilization",
    frequency: "Daily at 8:00 AM",
    metrics: {
      completed: 156,
      inProgress: 89,
      blocked: 8,
      efficiency: 78
    },
    lastRun: "Today at 8:00 AM",
    trend: "down"
  },
  {
    id: "4",
    title: "Project Status Updates",
    frequency: "Weekly on Friday",
    metrics: {
      completed: 18,
      inProgress: 42,
      blocked: 5,
      efficiency: 91
    },
    lastRun: "Oct 4, 2025",
    trend: "up"
  },
  {
    id: "5",
    title: "Quality Metrics Dashboard",
    frequency: "Daily at 5:00 PM",
    metrics: {
      completed: 89,
      inProgress: 34,
      blocked: 2,
      efficiency: 94
    },
    lastRun: "Today at 5:00 PM",
    trend: "stable"
  },
]

interface ReportsOperationalTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsOperationalTab({ data = [], loading = false }: ReportsOperationalTabProps) {
  const displayData = data.length > 0 ? data : []
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold mt-1">{operationalReports.length}</p>
              </div>
              <Activity className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {Math.round(operationalReports.reduce((sum, r) => sum + r.metrics.efficiency, 0) / operationalReports.length)}%
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Items Blocked</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {operationalReports.reduce((sum, r) => sum + r.metrics.blocked, 0)}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {operationalReports.reduce((sum, r) => sum + r.metrics.inProgress, 0)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Reports Grid */}
      <div className="grid gap-4">
        {operationalReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{report.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {report.frequency}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={
                    report.trend === "up" ? "bg-green-100 text-green-800 border-green-200" :
                    report.trend === "down" ? "bg-red-100 text-red-800 border-red-200" :
                    "bg-gray-100 text-gray-800 border-gray-200"
                  }>
                    {report.trend === "up" ? "↑ Improving" : report.trend === "down" ? "↓ Declining" : "→ Stable"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{report.metrics.completed}</p>
                  <p className="text-xs text-muted-foreground mt-1">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{report.metrics.inProgress}</p>
                  <p className="text-xs text-muted-foreground mt-1">In Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{report.metrics.blocked}</p>
                  <p className="text-xs text-muted-foreground mt-1">Blocked</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{report.metrics.efficiency}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Efficiency</p>
                </div>
                <div className="text-center border-l pl-4">
                  <p className="text-sm font-medium">Last Run</p>
                  <p className="text-xs text-muted-foreground mt-1">{report.lastRun}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
