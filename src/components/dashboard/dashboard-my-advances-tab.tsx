"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Package, Calendar, CheckCircle2, Clock, AlertCircle, Plus, FileText, Tag, Wrench, Truck } from "lucide-react"
import { useMyAdvances } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyAdvancesTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.my-advances')
  const tCommon = useTranslations('common')
  const { advances, loading } = useMyAdvances(workspaceId, userId)
  

  
  const advancesList = advances.map(adv => ({
    id: adv.id,
    title: adv.asset_item || 'Advance Request',
    project: adv.production?.name || 'No Project',
    category: adv.asset_category || 'equipment',
    requestDate: new Date(adv.created_at).toLocaleDateString(),
    approvedDate: adv.approved_at ? new Date(adv.approved_at).toLocaleDateString() : undefined,
    status: adv.status || 'pending',
    quantity: adv.quantity || 0,
    purpose: adv.operational_purpose || '',
    location: adv.site_location_name || 'TBD',
    approver: adv.approver?.name || undefined,
    startDate: adv.start_date ? new Date(adv.start_date).toLocaleDateString() : undefined,
    endDate: adv.end_date ? new Date(adv.end_date).toLocaleDateString() : undefined,
    assignedUsers: adv.assigned_users?.length || 0,
    accessories: adv.accessories || [],
    returned: 0,
    pending: adv.quantity || 0,
  }))
  
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "site_infrastructure":
        return "text-gray-600"
      case "site_services":
        return "text-blue-600"
      case "site_safety":
        return "text-red-600"
      case "site_vehicles":
        return "text-orange-600"
      case "heavy_equipment":
        return "text-yellow-600"
      case "consumables":
        return "text-purple-600"
      case "event_rentals":
        return "text-green-600"
      case "signage":
        return "text-pink-600"
      case "backline":
        return "text-indigo-600"
      case "access":
        return "text-cyan-600"
      case "credentials":
        return "text-teal-600"
      case "parking":
        return "text-slate-600"
      case "meals":
        return "text-amber-600"
      case "flights":
        return "text-sky-600"
      case "lodging":
        return "text-violet-600"
      case "rental_cars":
        return "text-emerald-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "site_vehicles":
        return Truck
      case "heavy_equipment":
        return Wrench
      case "consumables":
      case "event_rentals":
        return Package
      case "signage":
        return Tag
      default:
        return Package
    }
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      site_infrastructure: 'Site Infrastructure',
      site_services: 'Site Services',
      site_safety: 'Site Safety',
      site_vehicles: 'Site Vehicles',
      heavy_equipment: 'Heavy Equipment',
      consumables: 'Consumables',
      event_rentals: 'Event Rentals',
      signage: 'Signage',
      backline: 'Backline',
      access: 'Access',
      credentials: 'Credentials',
      parking: 'Parking',
      meals: 'Meals',
      flights: 'Flights',
      lodging: 'Lodging',
      rental_cars: 'Rental Cars'
    }
    return labels[category] || category
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
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
              <p className="text-xs text-muted-foreground mt-1">{t('totalItems')}</p>
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
              const CategoryIcon = getCategoryIcon(advance.category)
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
                            {advance.project} • {advance.location}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">{advance.quantity}x</p>
                          <p className="text-xs text-muted-foreground">quantity</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">{advance.purpose}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(advance.status)}>
                          <StatusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          {advance.status}
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(advance.category)}>
                          <CategoryIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          {getCategoryLabel(advance.category)}
                        </Badge>
                        {advance.assignedUsers > 0 && (
                          <Badge variant="outline">
                            {advance.assignedUsers} user{advance.assignedUsers > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{t('requested')}: {advance.requestDate}</span>
                        {advance.startDate && (
                          <>
                            <span>•</span>
                            <span>{t('start')}: {advance.startDate}</span>
                          </>
                        )}
                        {advance.endDate && (
                          <>
                            <span>•</span>
                            <span>{t('end')}: {advance.endDate}</span>
                          </>
                        )}
                        {advance.approvedDate && (
                          <>
                            <span>•</span>
                            <span className="text-green-600">Approved: {advance.approvedDate}</span>
                          </>
                        )}
                        {advance.approver && (
                          <>
                            <span>•</span>
                            <span>{t('by')}: {advance.approver}</span>
                          </>
                        )}
                      </div>

                      {(advance.status === "active" || advance.status === "returned" || advance.status === "partially_returned") && (
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Items Returned</span>
                              <span className="font-medium">{advance.returned} / {advance.quantity}</span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all"
                                style={{ 
                                  width: `${(advance.returned / advance.quantity) * 100}%` 
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
                      <FileText className="h-4 w-4" aria-hidden="true" />
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
            <Package className="h-4 w-4" aria-hidden="true" />
            Items Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">{summary.totalItems}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalItems')}</p>
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
    </main>
  )
}
