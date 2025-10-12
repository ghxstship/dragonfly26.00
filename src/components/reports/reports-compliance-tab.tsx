"use client"

import { ShieldCheck, Download, FileText, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const complianceReports = [
  {
    id: "1",
    name: "GDPR Compliance Report",
    category: "Data Privacy",
    status: "current",
    lastGenerated: "2025-10-01",
    nextDue: "2025-11-01",
    frequency: "Monthly",
    requirement: "EU General Data Protection Regulation"
  },
  {
    id: "2",
    name: "SOC 2 Type II Audit",
    category: "Security",
    status: "current",
    lastGenerated: "2025-09-15",
    nextDue: "2026-09-15",
    frequency: "Annual",
    requirement: "SOC 2 Compliance"
  },
  {
    id: "3",
    name: "Financial Audit Report",
    category: "Financial",
    status: "current",
    lastGenerated: "2025-07-01",
    nextDue: "2025-10-01",
    frequency: "Quarterly",
    requirement: "Standard Accounting Practices"
  },
  {
    id: "4",
    name: "Safety Compliance Report",
    category: "Workplace Safety",
    status: "due_soon",
    lastGenerated: "2025-09-01",
    nextDue: "2025-10-15",
    frequency: "Monthly",
    requirement: "OSHA Standards"
  },
  {
    id: "5",
    name: "ISO 27001 Certification",
    category: "Information Security",
    status: "current",
    lastGenerated: "2025-01-01",
    nextDue: "2026-01-01",
    frequency: "Annual",
    requirement: "ISO 27001 Standard"
  },
  {
    id: "6",
    name: "Environmental Impact Report",
    category: "Environmental",
    status: "overdue",
    lastGenerated: "2025-06-01",
    nextDue: "2025-09-01",
    frequency: "Quarterly",
    requirement: "Environmental Regulations"
  },
]

export function ReportsComplianceTab() {
  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Current</div>
            <div className="text-2xl font-bold text-green-600">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Due Soon</div>
            <div className="text-2xl font-bold text-yellow-600">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Overdue</div>
            <div className="text-2xl font-bold text-red-600">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Reports</div>
            <div className="text-2xl font-bold">6</div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Reports List */}
      <div className="space-y-3">
        {complianceReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <ShieldCheck className="h-8 w-8 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{report.name}</h3>
                      <Badge 
                        variant={report.status === "current" ? "default" : report.status === "due_soon" ? "secondary" : "destructive"}
                        className={
                          report.status === "current" ? "bg-green-600" : 
                          report.status === "due_soon" ? "bg-yellow-600" : 
                          "bg-red-600"
                        }
                      >
                        {report.status === "current" ? "Current" : report.status === "due_soon" ? "Due Soon" : "Overdue"}
                      </Badge>
                      <Badge variant="outline">{report.category}</Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{report.requirement}</p>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Generated</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {report.lastGenerated}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Due</p>
                        <p className="font-medium flex items-center gap-1">
                          {report.status === "overdue" && <AlertCircle className="h-3 w-3 text-red-600" />}
                          <Calendar className="h-3 w-3" />
                          {report.nextDue}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Frequency</p>
                        <p className="font-medium">{report.frequency}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate
                  </Button>
                  <Button variant="outline">
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
