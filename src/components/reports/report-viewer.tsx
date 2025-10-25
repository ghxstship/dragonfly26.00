"use client"

import { useTranslations } from "next-intl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Download, Share2, RefreshCw } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Report } from "@/types"

interface ReportViewerProps {
  report: Report
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockChartData = [
  { name: "Mon", value: 12 },
  { name: "Tue", value: 19 },
  { name: "Wed", value: 15 },
  { name: "Thu", value: 25 },
  { name: "Fri", value: 22 },
  { name: "Sat", value: 8 },
  { name: "Sun", value: 10 },
]

const mockPieData = [
  { name: "Active", value: 45, color: "#10b981" },
  { name: "On Hold", value: 20, color: "#f59e0b" },
  { name: "Completed", value: 35, color: "#3b82f6" },
]

export function ReportViewer({ report, open, onOpenChange }: ReportViewerProps) {
  const t = useTranslations()
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-4xl overflow-y-auto">
        <SheetHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
            <div>
              <SheetTitle>{report.name}</SheetTitle>
              <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
            </div>
            <TooltipProvider delayDuration={300}>
              <div className="flex flex-wrap gap-2">
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh data</p>
                  </TooltipContent>
                </UITooltip>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share report</p>
                  </TooltipContent>
                </UITooltip>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download report</p>
                  </TooltipContent>
                </UITooltip>
              </div>
            </TooltipProvider>
          </div>
        </SheetHeader>

        <Tabs defaultValue="visualization" className="mt-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-full">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{report.type}</Badge>
                    {report.chart_type && (
                      <Badge variant="outline" className="capitalize">{report.chart_type}</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {report.chart_type === "pie" ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={mockPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockPieData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">127</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average</p>
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">15.9</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trend</p>
                    <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">↑ 12%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 font-medium pb-2 border-b">
                    <span>Date</span>
                    <span>Category</span>
                    <span>Value</span>
                    <span>Change</span>
                  </div>
                  {mockChartData.map((row: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-3 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 text-sm">
                      <span>{row.name}</span>
                      <span>Tasks</span>
                      <span>{row.value}</span>
                      <span className="text-green-600">+{Math.floor(Math.random() * 10)}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Report Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="text-muted-foreground">Data Source</span>
                  <span className="capitalize">{report.data_source}</span>
                </div>
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="text-muted-foreground">Public Access</span>
                  <span>{report.is_public ? "Yes" : "No"}</span>
                </div>
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span>{report.schedule_enabled ? "Yes" : "No"}</span>
                </div>
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex flex-wrap justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span>{new Date(report.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
