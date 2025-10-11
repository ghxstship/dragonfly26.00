"use client"

import { useTranslations } from "next-intl"
import { MoreHorizontal, BarChart3, LineChart, PieChart, Table } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Report } from "@/types"

interface ReportsListProps {
  reports: Report[]
  onSelect: (report: Report) => void
}

const chartIcons = {
  bar: BarChart3,
  line: LineChart,
  pie: PieChart,
  area: LineChart,
  scatter: BarChart3,
  funnel: BarChart3,
}

export function ReportsList({ reports, onSelect }: ReportsListProps) {
  const t = useTranslations()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => {
        const Icon = report.type === "table" ? Table : chartIcons[report.chart_type || "bar"]
        
        return (
          <Card
            key={report.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => onSelect(report)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Share</DropdownMenuItem>
                    <DropdownMenuItem>Export</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{report.name}</h3>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {report.description}
              </p>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{report.type}</Badge>
                {report.chart_type && (
                  <Badge variant="outline" className="capitalize">{report.chart_type}</Badge>
                )}
                {report.is_public && <Badge variant="secondary">Public</Badge>}
                {report.schedule_enabled && <Badge variant="default">Scheduled</Badge>}
              </div>
            </CardContent>
          </Card>
        )
      })}
      
      {reports.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No reports found</p>
        </div>
      )}
    </div>
  )
}
