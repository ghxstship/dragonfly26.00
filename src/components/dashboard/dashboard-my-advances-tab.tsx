"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  FileText,
  Tag,
  Wrench,
  Truck
} from "lucide-react"
import { useMyAdvances } from "@/hooks/use-dashboard-data"
import { useRouter } from "next/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyAdvancesTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const { advances, loading } = useMyAdvances(workspaceId, userId)
  
  const mockAdvances = [
    {
      id: "ADV-2024-001",
      title: "Lighting Package - Summer Festival",
      project: "Summer Music Festival",
      type: "Equipment",
      requestDate: "Sep 20, 2024",
      approvedDate: "Sep 22, 2024",
      status: "active",
      items: 12,
      purpose: "Main stage lighting package including moving heads and LED panels",
      approver: "Sarah Johnson",
      dateNeeded: "Oct 1, 2024",
      returnDate: "Oct 15, 2024",
      returned: 8,
      pending: 4,
    },
    {
      id: "ADV-2024-002",
      title: "Access Credentials - Corporate Gala",
      project: "Corporate Gala",
      type: "Credentials",
      requestDate: "Oct 5, 2024",
      approvedDate: "Oct 6, 2024",
      status: "active",
      items: 5,
      purpose: "Backstage passes and load-in credentials for production crew",
      approver: "Mike Chen",
      dateNeeded: "Oct 12, 2024",
      returnDate: "Oct 13, 2024",
      returned: 5,
      pending: 0,
    },
    {
      id: "ADV-2024-003",
      title: "Camera & Audio Kit - Theater Revival",
      project: "Theater Revival",
      type: "Equipment",
      requestDate: "Oct 10, 2024",
      status: "pending",
      items: 8,
      purpose: "Multi-camera setup and wireless audio system for documentation",
      dateNeeded: "Oct 20, 2024",
      returnDate: "Oct 25, 2024",
      returned: 0,
      pending: 8,
    },
    {
      id: "ADV-2024-004",
      title: "Staging Materials - Fashion Week",
      project: "Fashion Week",
      type: "Materials",
      requestDate: "Oct 11, 2024",
      status: "pending",
      items: 25,
      purpose: "Runway materials, truss sections, and decorative elements",
      dateNeeded: "Oct 13, 2024",
      returnDate: "Oct 16, 2024",
      returned: 0,
      pending: 25,
    },
    {
      id: "ADV-2024-005",
      title: "Vehicle Fleet - Concert Series",
      project: "Concert Series",
      type: "Transportation",
      requestDate: "Aug 15, 2024",
      approvedDate: "Aug 16, 2024",
      status: "completed",
      items: 3,
      purpose: "Production trucks and crew vans for multi-city tour",
      approver: "David Kim",
      dateNeeded: "Aug 20, 2024",
      returnDate: "Sep 30, 2024",
      returned: 3,
      pending: 0,
      reconciledDate: "Sep 30, 2024",
    },
  ]
  
  const advancesList = advances.length > 0 ? advances.map(adv => ({
    id: adv.id,
    title: adv.title || adv.description || 'Advance Request',
    project: adv.production?.name || 'No Project',
    type: adv.type || 'Equipment',
    requestDate: new Date(adv.created_at).toLocaleDateString(),
    approvedDate: adv.approved_at ? new Date(adv.approved_at).toLocaleDateString() : undefined,
    status: adv.status || 'pending',
    items: adv.quantity || 0,
    purpose: adv.description || '',
    approver: adv.approver?.name || undefined,
    dateNeeded: adv.date_needed ? new Date(adv.date_needed).toLocaleDateString() : undefined,
    returnDate: adv.return_date ? new Date(adv.return_date).toLocaleDateString() : undefined,
    returned: 0,
    pending: adv.quantity || 0,
    reconciledDate: adv.reconciled_at ? new Date(adv.reconciled_at).toLocaleDateString() : undefined,
  })) : mockAdvances
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading advances...</p>
        </div>
      </div>
    )
  }

  const summary = {
    totalAdvances: 12,
    pending: 2,
    active: 2,
    completed: 8,
    totalItems: 145,
    itemsOut: 53,
    itemsReturned: 92,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "overdue":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle2
      case "pending":
        return Clock
      case "completed":
        return CheckCircle2
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Materials":
        return "text-purple-600"
      case "Equipment":
        return "text-blue-600"
      case "Credentials":
        return "text-cyan-600"
      case "Transportation":
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Materials":
        return Wrench
      case "Equipment":
        return Package
      case "Credentials":
        return Tag
      case "Transportation":
        return Truck
      default:
        return Package
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => router.push(`/workspace/${workspaceId}/assets/advances`)}
        >
          <Plus className="h-4 w-4" />
          Request Advance
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalAdvances}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Advances</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Approval</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.itemsOut}</p>
              <p className="text-xs text-muted-foreground mt-1">Items Out</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advances List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Advances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {advancesList.map((advance) => {
              const StatusIcon = getStatusIcon(advance.status)
              const TypeIcon = getTypeIcon(advance.type)
              return (
                <div
                  key={advance.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/assets/advances?id=${advance.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{advance.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {advance.id} • {advance.project}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{advance.items} items</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{advance.purpose}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(advance.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {advance.status}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(advance.type)}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {advance.type}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Requested: {advance.requestDate}</span>
                        {advance.approvedDate && (
                          <>
                            <span>•</span>
                            <span>Approved: {advance.approvedDate}</span>
                          </>
                        )}
                        {advance.approver && (
                          <>
                            <span>•</span>
                            <span>By: {advance.approver}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Needed: {advance.dateNeeded}</span>
                        {advance.returnDate && (
                          <>
                            <span>•</span>
                            <span>Return: {advance.returnDate}</span>
                          </>
                        )}
                        {advance.reconciledDate && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">Completed: {advance.reconciledDate}</span>
                          </>
                        )}
                      </div>

                      {(advance.status === "active" || advance.status === "completed") && (
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Items Returned</span>
                              <span className="font-medium">{advance.returned} / {advance.items}</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all"
                                style={{ 
                                  width: `${(advance.returned / advance.items) * 100}%` 
                                }}
                              />
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Still Out</p>
                            <p className="font-semibold text-sm">{advance.pending}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Items Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">{summary.totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Items</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{summary.itemsOut}</p>
              <p className="text-xs text-muted-foreground mt-1">Currently Out</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold text-green-600">{summary.itemsReturned}</p>
              <p className="text-xs text-muted-foreground mt-1">Returned</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
