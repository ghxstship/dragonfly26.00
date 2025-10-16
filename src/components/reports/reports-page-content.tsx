"use client"

import { useState } from "react"
import { Plus, BarChart3, LineChart, PieChart, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReportsList } from "@/components/reports/reports-list"
import { CreateReportDialog } from "@/components/reports/create-report-dialog"
import { ReportViewer } from "@/components/reports/report-viewer"
import type { Report } from "@/types"

const mockReports: Report[] = [
  {
    id: "1",
    organization_id: "org-1",
    name: "Task Completion Rate",
    description: t('reports.mockData.report1Desc'),
    type: "chart",
    data_source: "tasks",
    filters: [],
    grouping: [{ field: "status" }],
    sorting: [],
    aggregations: [{ function: "count", field: "id" }],
    chart_type: "line",
    chart_config: { xAxis: "week", yAxis: "count" },
    is_public: false,
    schedule_enabled: false,
    created_by: "user-1",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    name: "Project Status Distribution",
    description: t('reports.mockData.report2Desc'),
    type: "chart",
    data_source: "projects",
    filters: [],
    grouping: [{ field: "status" }],
    sorting: [],
    aggregations: [{ function: "count", field: "id" }],
    chart_type: "pie",
    chart_config: {},
    is_public: true,
    schedule_enabled: false,
    created_by: "user-1",
    created_at: "2025-01-05T00:00:00Z",
    updated_at: "2025-01-15T00:00:00Z",
  },
]

export function ReportsPageContent() {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-2">
              Create custom reports and dashboards
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">{mockReports.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Charts</p>
                  <p className="text-2xl font-bold">
                    {mockReports.filter((r) => r.type === "chart").length}
                  </p>
                </div>
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tables</p>
                  <p className="text-2xl font-bold">
                    {mockReports.filter((r) => r.type === "table").length}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold">
                    {mockReports.filter((r) => r.schedule_enabled).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ReportsList
              reports={mockReports}
              onSelect={setSelectedReport}
            />
          </TabsContent>

          <TabsContent value="charts" className="mt-6">
            <ReportsList
              reports={mockReports.filter((r) => r.type === "chart")}
              onSelect={setSelectedReport}
            />
          </TabsContent>

          <TabsContent value="tables" className="mt-6">
            <ReportsList
              reports={mockReports.filter((r) => r.type === "table")}
              onSelect={setSelectedReport}
            />
          </TabsContent>

          <TabsContent value="dashboards" className="mt-6">
            <ReportsList
              reports={mockReports.filter((r) => r.type === "dashboard")}
              onSelect={setSelectedReport}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <CreateReportDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {selectedReport && (
        <ReportViewer
          report={selectedReport}
          open={!!selectedReport}
          onOpenChange={(open) => !open && setSelectedReport(null)}
        />
      )}
    </div>
  )
}
