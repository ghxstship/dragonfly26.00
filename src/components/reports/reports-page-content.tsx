"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, BarChart3, LineChart, PieChart, Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ReportsList } from "@/components/reports/reports-list"
import { CreateReportDialog } from "@/components/reports/create-report-dialog"
import { ReportViewer } from "@/components/reports/report-viewer"
import type { Report } from "@/types"

export function ReportsPageContent() {
  const t = useTranslations()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

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

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-4 sm:p-6">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h1 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">Reports</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{mockReports.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Charts</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
                    {mockReports.filter((r: any) => (r as any).type === "chart").length}
                  </p>
                </div>
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tables</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
                    {mockReports.filter((r: any) => (r as any).type === "table").length}
                  </p>
                </div>
                <PieChart className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
                    {mockReports.filter((r: any) => r.schedule_enabled).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
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
              reports={mockReports.filter((r: any) => (r as any).type === "chart")}
              onSelect={setSelectedReport}
            />
          </TabsContent>

          <TabsContent value="tables" className="mt-6">
            <ReportsList
              reports={mockReports.filter((r: any) => (r as any).type === "table")}
              onSelect={setSelectedReport}
            />
          </TabsContent>

          <TabsContent value="dashboards" className="mt-6">
            <ReportsList
              reports={mockReports.filter((r: any) => (r as any).type === "dashboard")}
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
