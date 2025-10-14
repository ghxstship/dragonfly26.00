"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileBarChart,
  Star,
  Calendar,
  Download,
  Eye,
  Plus,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react"
import { useMyReports } from "@/hooks/use-dashboard-data"
import { useRouter } from "next/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyReportsTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const { reports, loading } = useMyReports(workspaceId, userId)
  
  const mockReports = [
    {
      id: "RPT-001",
      name: "Personal Task Performance",
      type: "custom",
      category: "Performance",
      isFavorite: true,
      isRecurring: true,
      frequency: "Weekly",
      lastGenerated: "Oct 11, 2024",
      nextScheduled: "Oct 18, 2024",
      format: "PDF",
      icon: TrendingUp,
      description: "Weekly summary of task completion rates and efficiency",
      fileSize: "2.4 MB",
      views: 24,
    },
    {
      id: "RPT-002",
      name: "My Expense Summary",
      type: "subscribed",
      category: "Financial",
      isFavorite: true,
      isRecurring: true,
      frequency: "Monthly",
      lastGenerated: "Oct 1, 2024",
      nextScheduled: "Nov 1, 2024",
      format: "Excel",
      icon: PieChart,
      description: "Monthly breakdown of personal expenses by category",
      fileSize: "1.8 MB",
      views: 12,
    },
    {
      id: "RPT-003",
      name: "Project Contribution Analysis",
      type: "custom",
      category: "Performance",
      isFavorite: false,
      isRecurring: false,
      lastGenerated: "Oct 8, 2024",
      format: "PDF",
      icon: BarChart3,
      description: "Analysis of contributions across all active projects",
      fileSize: "3.2 MB",
      views: 8,
    },
    {
      id: "RPT-004",
      name: "Equipment Utilization Report",
      type: "custom",
      category: "Assets",
      isFavorite: true,
      isRecurring: true,
      frequency: "Bi-weekly",
      lastGenerated: "Oct 10, 2024",
      nextScheduled: "Oct 24, 2024",
      format: "PDF",
      icon: BarChart3,
      description: "Personal equipment usage and availability tracking",
      fileSize: "1.5 MB",
      views: 16,
    },
    {
      id: "RPT-005",
      name: "Travel & Time Away Report",
      type: "subscribed",
      category: "Travel",
      isFavorite: false,
      isRecurring: true,
      frequency: "Monthly",
      lastGenerated: "Oct 1, 2024",
      nextScheduled: "Nov 1, 2024",
      format: "Excel",
      icon: PieChart,
      description: "Monthly travel statistics and time allocation",
      fileSize: "890 KB",
      views: 6,
    },
    {
      id: "RPT-006",
      name: "Job Revenue Analysis",
      type: "custom",
      category: "Financial",
      isFavorite: true,
      isRecurring: false,
      lastGenerated: "Oct 5, 2024",
      format: "PDF",
      icon: TrendingUp,
      description: "Year-to-date revenue from all contracts and jobs",
      fileSize: "2.1 MB",
      views: 18,
    },
  ]
  
  const reportsList = reports.length > 0 ? reports.map(report => ({
    id: report.id,
    name: report.name || 'Report',
    type: 'custom',
    category: report.category || 'General',
    isFavorite: false,
    isRecurring: report.is_recurring || false,
    frequency: report.frequency || undefined,
    lastGenerated: new Date(report.created_at).toLocaleDateString(),
    nextScheduled: report.next_scheduled ? new Date(report.next_scheduled).toLocaleDateString() : undefined,
    format: 'PDF',
    icon: FileBarChart,
    description: report.description || '',
    fileSize: '1 MB',
    views: 0,
  })) : mockReports
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    )
  }

  const summary = {
    totalReports: 24,
    favorites: 4,
    recurring: 4,
    custom: 18,
    thisMonth: 12,
  }

  const categories = [
    { name: "Performance", count: 8, color: "bg-purple-500" },
    { name: "Financial", count: 6, color: "bg-green-500" },
    { name: "Assets", count: 4, color: "bg-blue-500" },
    { name: "Travel", count: 3, color: "bg-cyan-500" },
    { name: "Other", count: 3, color: "bg-gray-500" },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "custom":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400"
      case "subscribed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "shared":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getFormatColor = (format: string) => {
    switch (format) {
      case "PDF":
        return "text-red-600"
      case "Excel":
        return "text-green-600"
      case "CSV":
        return "text-blue-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => router.push(`/workspace/${workspaceId}/reports/templates`)}
        >
          <Plus className="h-4 w-4" />
          Create Report
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalReports}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.favorites}</p>
              <p className="text-xs text-muted-foreground mt-1">Favorites</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.recurring}</p>
              <p className="text-xs text-muted-foreground mt-1">Recurring</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{summary.custom}</p>
              <p className="text-xs text-muted-foreground mt-1">Custom</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.thisMonth}</p>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="p-4 border rounded-lg text-center hover:bg-accent transition-colors cursor-pointer"
              >
                <div className={`w-12 h-12 ${category.color} rounded-lg mx-auto mb-2`} />
                <p className="font-semibold">{category.count}</p>
                <p className="text-xs text-muted-foreground">{category.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportsList.map((report) => {
              const Icon = report.icon
              return (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/reports/templates?id=${report.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{report.name}</h3>
                              {report.isFavorite && (
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {report.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={getTypeColor(report.type)}>
                          {report.type}
                        </Badge>
                        <Badge variant="outline">
                          {report.category}
                        </Badge>
                        <Badge variant="outline" className={getFormatColor(report.format)}>
                          {report.format}
                        </Badge>
                        {report.isRecurring && (
                          <Badge variant="outline" className="text-blue-600">
                            <Clock className="h-3 w-3 mr-1" />
                            {report.frequency}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Last generated: {report.lastGenerated}</span>
                        {report.nextScheduled && (
                          <>
                            <span>•</span>
                            <span>Next: {report.nextScheduled}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{report.fileSize}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {report.views} views
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="h-3.5 w-3.5" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-sm">Performance Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <PieChart className="h-5 w-5 text-green-600" />
              <span className="text-sm">Financial Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <span className="text-sm">Assets Report</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-600" />
              <span className="text-sm">Time Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
