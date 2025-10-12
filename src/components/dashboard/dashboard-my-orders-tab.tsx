"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ShoppingCart,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Search
} from "lucide-react"

export function DashboardMyOrdersTab() {
  // User's orders (to be integrated with marketplace)
  const orders = [
    {
      id: "ORD-2024-1234",
      item: "Wireless Microphone System Bundle",
      vendor: "Audio Pro Supplies",
      orderDate: "Oct 8, 2024",
      status: "delivered",
      quantity: 2,
      total: "$2,400",
      deliveryDate: "Oct 10, 2024",
      trackingNumber: "1Z999AA10123456784",
      project: "Concert Series",
    },
    {
      id: "ORD-2024-1235",
      item: "LED Par Light Set (12 units)",
      vendor: "Stage Lighting Co.",
      orderDate: "Oct 9, 2024",
      status: "in_transit",
      quantity: 1,
      total: "$1,800",
      estimatedDelivery: "Oct 13, 2024",
      trackingNumber: "1Z999AA10123456785",
      project: "Fashion Week",
    },
    {
      id: "ORD-2024-1236",
      item: "Professional Video Cables (assorted)",
      vendor: "Tech Gear Direct",
      orderDate: "Oct 10, 2024",
      status: "processing",
      quantity: 1,
      total: "$345",
      estimatedDelivery: "Oct 15, 2024",
      trackingNumber: "Pending",
      project: "Corporate Gala",
    },
    {
      id: "ORD-2024-1237",
      item: "Road Case for Lighting Equipment",
      vendor: "Case Warehouse",
      orderDate: "Oct 11, 2024",
      status: "pending",
      quantity: 3,
      total: "$1,200",
      estimatedDelivery: "Oct 18, 2024",
      trackingNumber: "Not yet assigned",
      project: "Summer Festival",
    },
    {
      id: "ORD-2024-1233",
      item: "Wireless Intercom System",
      vendor: "Clear-Com",
      orderDate: "Oct 3, 2024",
      status: "cancelled",
      quantity: 1,
      total: "$3,500",
      cancellationReason: "Found alternative solution",
      project: "Theater Revival",
    },
  ]

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
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Order
          </Button>
        </div>
      </div>

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
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-yellow-600">{summary.processing}</p>
              <p className="text-xs text-muted-foreground mt-1">Processing</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-blue-600">{summary.inTransit}</p>
              <p className="text-xs text-muted-foreground mt-1">In Transit</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-green-600">{summary.delivered}</p>
              <p className="text-xs text-muted-foreground mt-1">Delivered</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-xl font-bold text-red-600">{summary.cancelled}</p>
              <p className="text-xs text-muted-foreground mt-1">Cancelled</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => {
              const StatusIcon = getStatusIcon(order.status)
              return (
                <div
                  key={order.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{order.item}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Order #{order.id} • {order.vendor}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{order.total}</p>
                          <p className="text-xs text-muted-foreground mt-1">Qty: {order.quantity}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className={getStatusColor(order.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {order.project}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        <span>Ordered: {order.orderDate}</span>
                        {order.deliveryDate && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">
                              Delivered: {order.deliveryDate}
                            </span>
                          </>
                        )}
                        {order.estimatedDelivery && (
                          <>
                            <span>•</span>
                            <span>Est. Delivery: {order.estimatedDelivery}</span>
                          </>
                        )}
                        {order.trackingNumber !== "Not yet assigned" && order.trackingNumber !== "Pending" && (
                          <>
                            <span>•</span>
                            <span>Tracking: {order.trackingNumber}</span>
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
  )
}
