"use client"

import { Download, FileText, FileSpreadsheet, FileImage, Calendar, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { useReportsData } from "@/hooks/use-reports-data"

const exports = [
  { id: "1", nameKey: "q4_performance_summarypdf", type: "PDF", size: "2.4 MB", date: "2025-10-10 14:30", status: "Ready", expires: "2025-11-10" },
  { id: "2", nameKey: "weekly_operations_reportxlsx", type: "Excel", size: "1.8 MB", date: "2025-10-09 09:15", status: "Ready", expires: "2025-11-09" },
  { id: "3", nameKey: "customer_data_exportcsv", type: "CSV", size: "5.2 MB", date: "2025-10-08 16:45", status: "Ready", expires: "2025-11-08" },
  { id: "4", nameKey: "analytics_dashboardpng", type: "Image", size: "890 KB", date: "2025-10-07 11:20", status: "Ready", expires: "2025-11-07" },
  { id: "5", nameKey: "financial_report_octpdf", type: "PDF", size: "3.6 MB", date: "2025-10-05 08:00", status: "Ready", expires: "2025-11-05" },
  { id: "6", nameKey: "compliance_audit_2025pdf", type: "PDF", size: "8.1 MB", date: "2025-10-03 13:30", status: "Ready", expires: "2025-11-03" },
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

interface ReportsExportsTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function ReportsExportsTab({ data = [], loading = false }: ReportsExportsTabProps) {
  const t = useTranslations('intelligence.reports.exports')
  const tCommon = useTranslations('common')
  const displayData = data.length > 0 ? data : []
  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="space-y-4">
        {exports.map((file: any) => {
          const Icon = getFileIcon(file.type)
          const colorClass = getFileColor(file.type)
          
          return (
            <Card key={file.id} className="hover:shadow-md transition-shadow" role="article" aria-label={`Export file: ${t(file.nameKey)}`}>
              <CardContent aria-hidden="true" className="p-4">
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 flex-1">
                    <Icon aria-hidden="true" className={`h-10 w-10 ${colorClass}`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" id={`file-${file.id}`}>{t(file.nameKey)}</p>
                      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm text-muted-foreground mt-1" aria-label={`Size: ${file.size}, Date: ${file.date}, Expires: ${file.expires}`}>
                        <span>{file.size}</span>
                        <span>•</span>
                        <span className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          <Calendar aria-hidden="true" className="h-3 w-3" />
                          {file.date}
                        </span>
                        <span>•</span>
                        <span>{t('expires')}: {file.expires}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <Badge variant="outline" aria-label={`File type: ${file.type}`}>{file.type}</Badge>
                    <Badge variant="default" className="bg-green-600" aria-label={`Status: ${file.status}`}>
                      {t('ready')}
                    </Badge>
                    <Button size="sm" aria-label={`Download ${t(file.nameKey)}`}>
                      <Download aria-hidden="true" className="h-4 w-4 mr-2" />
                      {tCommon('export')}
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
