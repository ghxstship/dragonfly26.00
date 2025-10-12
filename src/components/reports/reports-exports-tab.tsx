"use client"

import { Download, FileText, FileSpreadsheet, FileImage, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const exports = [
  { id: "1", name: "Q4_Performance_Summary.pdf", type: "PDF", size: "2.4 MB", date: "2025-10-10 14:30", status: "Ready", expires: "2025-11-10" },
  { id: "2", name: "Weekly_Operations_Report.xlsx", type: "Excel", size: "1.8 MB", date: "2025-10-09 09:15", status: "Ready", expires: "2025-11-09" },
  { id: "3", name: "Customer_Data_Export.csv", type: "CSV", size: "5.2 MB", date: "2025-10-08 16:45", status: "Ready", expires: "2025-11-08" },
  { id: "4", name: "Analytics_Dashboard.png", type: "Image", size: "890 KB", date: "2025-10-07 11:20", status: "Ready", expires: "2025-11-07" },
  { id: "5", name: "Financial_Report_Oct.pdf", type: "PDF", size: "3.6 MB", date: "2025-10-05 08:00", status: "Ready", expires: "2025-11-05" },
  { id: "6", name: "Compliance_Audit_2025.pdf", type: "PDF", size: "8.1 MB", date: "2025-10-03 13:30", status: "Ready", expires: "2025-11-03" },
]

const getFileIcon = (type: string) => {
  switch (type) {
    case "PDF": return FileText
    case "Excel": case "CSV": return FileSpreadsheet
    case "Image": return FileImage
    default: return FileText
  }
}

const getFileColor = (type: string) => {
  switch (type) {
    case "PDF": return "text-red-600"
    case "Excel": return "text-green-600"
    case "CSV": return "text-blue-600"
    case "Image": return "text-purple-600"
    default: return "text-gray-600"
  }
}

export function ReportsExportsTab() {
  return (
    <div className="space-y-6">
      <div className="grid gap-3">
        {exports.map((file) => {
          const Icon = getFileIcon(file.type)
          const colorClass = getFileColor(file.type)
          
          return (
            <Card key={file.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Icon className={`h-10 w-10 ${colorClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {file.date}
                        </span>
                        <span>•</span>
                        <span>Expires: {file.expires}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{file.type}</Badge>
                    <Badge variant="default" className="bg-green-600">
                      {file.status}
                    </Badge>
                    <Button size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
