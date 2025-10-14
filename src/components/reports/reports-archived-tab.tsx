"use client"

import { Archive, Search, Filter, Calendar, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const archivedReports = [
  { id: "1", name: "Q3 2024 Financial Report", type: "Executive", archivedDate: "2024-10-15", size: "4.2 MB", year: "2024" },
  { id: "2", name: "Annual Compliance Audit 2023", type: "Compliance", archivedDate: "2024-01-30", size: "8.7 MB", year: "2023" },
  { id: "3", name: "Project Completion Summary Q2 2024", type: "Operational", archivedDate: "2024-07-05", size: "2.1 MB", year: "2024" },
  { id: "4", name: "Customer Satisfaction Report 2023", type: "Custom", archivedDate: "2024-01-15", size: "3.4 MB", year: "2023" },
  { id: "5", name: "Board Meeting Report - June 2024", type: "Executive", archivedDate: "2024-07-10", size: "5.8 MB", year: "2024" },
  { id: "6", name: "Q1 2024 Operations Overview", type: "Operational", archivedDate: "2024-04-15", size: "3.2 MB", year: "2024" },
  { id: "7", name: "GDPR Compliance Report 2023", type: "Compliance", archivedDate: "2024-02-01", size: "6.1 MB", year: "2023" },
  { id: "8", name: "Strategic Plan Review 2023", type: "Executive", archivedDate: "2023-12-31", size: "9.3 MB", year: "2023" },
]

interface ReportsArchivedTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsArchivedTab({ data = [], loading = false }: ReportsArchivedTabProps) {
  const displayReports = data || []
  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search archived reports..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
            <div className="flex gap-2">
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">2024 ({archivedReports.filter(r => r.year === "2024").length})</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">2023 ({archivedReports.filter(r => r.year === "2023").length})</Badge>
              <Badge variant="outline" className="cursor-pointer hover:bg-accent">All ({archivedReports.length})</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Archived</p>
            <p className="text-2xl font-bold mt-1">{archivedReports.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Executive</p>
            <p className="text-2xl font-bold mt-1 text-purple-600">
              {archivedReports.filter(r => r.type === "Executive").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Compliance</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {archivedReports.filter(r => r.type === "Compliance").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Operational</p>
            <p className="text-2xl font-bold mt-1 text-orange-600">
              {archivedReports.filter(r => r.type === "Operational").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Archived Reports List */}
      <div className="space-y-2">
        {archivedReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Archive className="h-8 w-8 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{report.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Archived {report.archivedDate}
                      </span>
                      <span>{report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
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
