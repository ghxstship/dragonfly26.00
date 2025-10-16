"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package, Truck, CheckCircle2, Clock, XCircle, Plus, Search } from "lucide-react"
import { useMyOrders } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyOrdersTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.my-orders')
  const tCommon = useTranslations('common')
  const { orders, loading } = useMyOrders(workspaceId, userId)
  

  
  const ordersList = orders.map(order => ({
    id: order.id,
    item: order.product_name || 'Item',
    vendor: 'Vendor',
    orderDate: new Date(order.created_at).toLocaleDateString(),
    status: order.status || 'pending',
    quantity: order.items?.[0]?.quantity || 1,
    total: `$${order.total || 0}`,
    trackingNumber: order.tracking_number || 'Pending',
    project: order.production?.name || 'No Project',
    deliveryDate: order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : undefined,
    estimatedDelivery: order.estimated_delivery ? new Date(order.estimated_delivery).toLocaleDateString() : undefined,
    cancellationReason: order.cancellation_reason || undefined,
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
    totalOrders: 28,
    pending: 1,
    processing: 1,
    inTransit: 1,
    delivered: 24,
    cancelled: 1,
    totalSpent: "$42,350",
    thisMonth: "$5,745",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "in_transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "pending":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return CheckCircle2
      case "in_transit":
        return Truck
      case "processing":
        return Package
      case "pending":
        return Clock
      case "cancelled":
        return XCircle
      default:
        return Package
    }
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Orders</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.inTransit}</p>
              <p className="text-xs text-muted-foreground mt-1">In Transit</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalSpent}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
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

      {/* Order Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-gray-600">{summary.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('pending')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-yellow-600">{summary.processing}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('processing')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-blue-600">{summary.inTransit}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('inTransit')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-green-600">{summary.delivered}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('delivered')}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-red-600">{summary.cancelled}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('cancelled')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('recentOrders')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ordersList.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => router.push(`/workspace/${workspaceId}/marketplace/purchases?id=${order.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{order.item}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('orderNumber', {number: order.id})} • {order.vendor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <p className="text-xs text-muted-foreground mt-1">{t('qty')}: {order.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          <StatusIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {order.project}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>{t('ordered')}: {order.orderDate}</span>
                        {order.deliveryDate && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              {t('delivered')}: {order.deliveryDate}
                            </span>
                          </>
                        )}
                        {order.estimatedDelivery && (
                          <>
                            <span>•</span>
                            <span>{t('estDelivery')}: {order.estimatedDelivery}</span>
                          </>
                        )}
                        {order.trackingNumber !== "Not yet assigned" && order.trackingNumber !== "Pending" && (
                          <>
                            <span>•</span>
                            <span>{t('tracking')}: {order.trackingNumber}</span>
                          </>
                        )}
                        {order.cancellationReason && (
                          <>
                            <span>•</span>
                            <span className="text-red-600">{order.cancellationReason}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Spending Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$42.4k</p>
              <p className="text-xs text-muted-foreground mt-1">Total Spent</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$5.7k</p>
              <p className="text-xs text-muted-foreground mt-1">This Month</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$1.5k</p>
              <p className="text-xs text-muted-foreground mt-1">Avg. Order Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </main>
  )
}
