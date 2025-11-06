"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FileEdit,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Package,
  Truck,
  Plus,
  Download, Calendar} from "lucide-react"
import type { TabComponentProps } from "@/types"
import { useTranslations } from "next-intl"
import { useLocale } from "next-intl"
import { formatCurrency, formatDate, formatPercentage, formatNumber } from "@/lib/utils/locale-formatting"

export function ProcurementOrdersDashboardTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('business.procurement.ordersDashboard')
  const tCommon = useTranslations('business.common')
  const locale = useLocale()
  const { data: orders, loading, error } = useModuleData(workspaceId, 'procurement', 'orders')

  if (loading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true"
        className="flex items-center justify-center h-full"
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <p className="text-muted-foreground">
            {tCommon('loading', { resource: t('title') })}
          </p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'approved': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'ordered': 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
      'received': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'cancelled': 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Group orders by status for pipeline
  const stages = [
    { id: 'pending', name: t('stages.pendingApproval'), icon: Clock },
    { id: 'approved', name: t('stages.approved'), icon: CheckCircle2 },
    { id: 'ordered', name: t('stages.ordered'), icon: FileEdit },
    { id: 'in_transit', name: t('stages.inTransit'), icon: Truck },
    { id: 'received', name: t('stages.received'), icon: Package },
  ]

  const getOrdersByStage = (stage: string) => {
    return orders.filter((order: any) => (order as any).status === stage)
  }

  const totalValue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
  const pendingApprovals = orders.filter((o: any) => (o as any).status === 'pending').length
  const overdueOrders = orders.filter((o: any) => 
    new Date(o.expected_delivery) < new Date() && o.status !== 'received'
  ).length

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Orders</CardTitle>
            <FileEdit aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">Active purchase orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{formatCurrency(totalValue, locale)}</div>
            <p className="text-xs text-muted-foreground">Across all orders</p>
          </CardContent>
        </Card>

        <Card aria-hidden="true" className={pendingApprovals > 0 ? "border-yellow-200 dark:border-yellow-900" : ""}>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${pendingApprovals > 0 ? 'text-yellow-600' : ''}`}>
              {pendingApprovals}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card aria-hidden="true" className={overdueOrders > 0 ? "border-red-200 dark:border-red-900" : ""}>
          <CardHeader aria-hidden="true" className="flex flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle aria-hidden="true" className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overdueOrders > 0 ? 'text-red-600' : ''}`}>
              {overdueOrders}
            </div>
            <p className="text-xs text-muted-foreground">Past expected delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Order Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status Pipeline</CardTitle>
          <CardDescription>Track orders through the procurement process</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4 overflow-x-auto pb-4">
            {stages.map((stage: any) => {
              const stageOrders = getOrdersByStage(stage.id)
              const stageValue = stageOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0)
              const StageIcon = stage.icon

              return (
                <div key={stage.id} className="flex flex-wrap flex-col lg:flex-row-shrink-0 w-full sm:w-full lg:w-64">
                  <Card>
                    <CardHeader aria-hidden="true" className="pb-3">
                      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                        <CardTitle aria-hidden="true" className="text-sm font-medium">{stage.name}</CardTitle>
                        <StageIcon aria-hidden="true" className="h-4 w-4" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stageOrders.length} orders · {formatCurrency(stageValue, locale)}
                      </div>
                    </CardHeader>
                    <CardContent aria-hidden="true" className="space-y-2 max-h-64 md:h-80 lg:h-96 overflow-y-auto">
                      {stageOrders.map((order: any) => (
                        <Card key={order.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">{order.title || order.po_number}</div>
                                <div className="text-xs text-muted-foreground truncate">{order.vendor}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs">
                              <span className="font-medium">{formatCurrency(order.total, locale)}</span>
                              <Badge variant="secondary" className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>
                            {order.expected_delivery && (
                              <div className="text-xs text-muted-foreground">
                                Expected: {new Date(order.expected_delivery).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                      {stageOrders.length === 0 && (
                        <div className="text-center py-4 md:py-6 lg:py-8 text-sm text-muted-foreground">
                          No orders in this stage
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6 md:grid-cols-2">
        {/* Vendor Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vendors</CardTitle>
            <CardDescription>By order volume</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const vendorStats = orders.reduce((acc: any, order: any) => {
                const vendor = order.vendor || 'Unknown'
                if (!acc[vendor]) {
                  acc[vendor] = { count: 0, total: 0 }
                }
                acc[vendor].count++
                acc[vendor].total += order.total || 0
                return acc
              }, {})

              const topVendors = Object.entries(vendorStats)
                .map(([vendor, stats]: [string, any]) => ({ vendor, ...stats }))
                .sort((a: any, b: any) => b.count - a.count)
                .slice(0, 5)

              return (
                <div className="space-y-3">
                  {topVendors.map((vendor: Record<string, any>, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex flex-wrap justify-between text-sm">
                        <span className="font-medium">{vendor.vendor as string}</span>
                        <span className="text-muted-foreground">
                          {vendor.count as number} orders · {formatCurrency(vendor.total as number, locale)}
                        </span>
                      </div>
                      <Progress value={((vendor.count as number) / orders.length) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              )
            })()}
          </CardContent>
        </Card>

        {/* Delivery Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Expected Deliveries</CardTitle>
            <CardDescription>Next 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const today = new Date()
              const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
              const upcomingDeliveries = orders
                .filter((o: any) => {
                  const deliveryDate = new Date(o.expected_delivery)
                  return deliveryDate >= today && deliveryDate <= thirtyDaysLater && o.status !== 'received'
                })
                .sort((a: any, b: any) => new Date(a.expected_delivery).getTime() - new Date(b.expected_delivery).getTime())
                .slice(0, 5)

              return (
                <div className="space-y-2">
                  {upcomingDeliveries.map((order: any) => {
                    const daysUntil = Math.ceil((new Date(order.expected_delivery).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                    return (
                      <div key={order.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{order.title || order.po_number}</div>
                          <div className="text-xs text-muted-foreground">{order.vendor}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{new Date(order.expected_delivery).toLocaleDateString()}</div>
                          <div className="text-xs text-muted-foreground">
                            {daysUntil === 0 ? 'Today' : `${daysUntil} days`}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  {upcomingDeliveries.length === 0 && (
                    <div className="text-center py-4 md:py-6 lg:py-8 text-sm text-muted-foreground">
                      No deliveries expected in the next 30 days
                    </div>
                  )}
                </div>
              )
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals > 0 && (
        <Card aria-hidden="true" className="border-yellow-200 dark:border-yellow-900">
          <CardHeader>
            <CardTitle aria-hidden="true" className="text-yellow-600 flex flex-col md:flex-row items-center gap-2">
              <Clock aria-hidden="true" className="h-5 w-5" />
              Pending Approvals
            </CardTitle>
            <CardDescription>{pendingApprovals} orders awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {orders.filter((o: any) => (o as any).status === 'pending').slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{order.title || order.po_number}</div>
                    <div className="text-sm text-muted-foreground">{order.vendor} · {formatCurrency(order.total, locale)}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline">Reject</Button>
                    <Button size="sm">Approve</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  )
}
