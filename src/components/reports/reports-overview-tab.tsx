"use client"

import { FileText, Download, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const recentReports = [
  { id: "1", name: "Q4 Performance Summary", type: "Executive", generated: "2025-10-10", size: "2.4 MB", downloads: 45 },
  { id: "2", name: "Weekly Operations Report", type: "Operational", generated: "2025-10-09", size: "1.8 MB", downloads: 23 },
  { id: "3", name: "Compliance Audit 2025", type: "Compliance", generated: "2025-10-08", size: "5.2 MB", downloads: 12 },
  { id: "4", name: "Customer Satisfaction Analysis", type: "Custom", generated: "2025-10-07", size: "3.1 MB", downloads: 34 },
  { id: "5", name: "Monthly Financial Report", type: "Executive", generated: "2025-10-05", size: "4.6 MB", downloads: 67 },
]

const stats = [
  { label: "Reports Generated", value: "142", change: "+12%", icon: FileText, color: "text-blue-600" },
  { label: "Total Downloads", value: "1,284", change: "+8%", icon: Download, color: "text-green-600" },
  { label: "Scheduled Reports", value: "28", change: "+3", icon: Calendar, color: "text-purple-600" },
  { label: "Avg. Generation Time", value: "2.4s", change: "-0.3s", icon: TrendingUp, color: "text-orange-600" },
]

interface ReportsOverviewTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsOverviewTab({ data = [], loading = false }: ReportsOverviewTabProps) {
  const displayReports = data || []
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-2">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Recently generated and accessed reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • Generated {report.generated} • {report.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{report.downloads} downloads</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
