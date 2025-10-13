"use client"

import { Calendar, Clock, Mail, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

const scheduledReports = [
  {
    id: "1",
    name: "Weekly Performance Summary",
    frequency: "Weekly",
    schedule: "Every Monday at 9:00 AM",
    recipients: ["executive@company.com", "managers@company.com"],
    lastRun: "2025-10-07 09:00",
    nextRun: "2025-10-14 09:00",
    enabled: true,
    format: "PDF"
  },
  {
    id: "2",
    name: "Daily Operations Report",
    frequency: "Daily",
    schedule: "Every day at 8:00 AM",
    recipients: ["operations@company.com"],
    lastRun: "2025-10-10 08:00",
    nextRun: "2025-10-11 08:00",
    enabled: true,
    format: "Excel"
  },
  {
    id: "3",
    name: "Monthly Financial Report",
    frequency: "Monthly",
    schedule: "1st of every month at 7:00 AM",
    recipients: ["finance@company.com", "cfo@company.com"],
    lastRun: "2025-10-01 07:00",
    nextRun: "2025-11-01 07:00",
    enabled: true,
    format: "PDF"
  },
  {
    id: "4",
    name: "Quarterly Board Report",
    frequency: "Quarterly",
    schedule: "First Monday of quarter at 10:00 AM",
    recipients: ["board@company.com"],
    lastRun: "2025-07-01 10:00",
    nextRun: "2025-10-07 10:00",
    enabled: false,
    format: "PDF + Excel"
  },
]

interface ReportsScheduledTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsScheduledTab({ data = [], loading = false }: ReportsScheduledTabProps) {
  const displayReports = data.length > 0 ? data : scheduledReports
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {scheduledReports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle>{report.name}</CardTitle>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {report.frequency}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {report.schedule}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={report.enabled ? "default" : "secondary"}>
                    {report.enabled ? "Active" : "Paused"}
                  </Badge>
                  <Switch checked={report.enabled} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Run</p>
                    <p className="text-sm">{report.lastRun}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Next Run</p>
                    <p className="text-sm">{report.nextRun}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Recipients ({report.recipients.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.recipients.map((email, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        {email}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Format: <span className="font-medium text-foreground">{report.format}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
