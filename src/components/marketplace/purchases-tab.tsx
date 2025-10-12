"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, FileText, Package, Truck, CheckCircle, Clock, XCircle, Search, Plus } from "lucide-react"
import { generateMarketplaceMockData } from "@/lib/modules/marketplace-mock-data"

export function PurchasesTab() {
  const purchasesData = generateMarketplaceMockData('purchases', 20)
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case "delivered":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>
      case "shipped":
        return <Badge className="bg-blue-600"><Truck className="h-3 w-3 mr-1" />Shipped</Badge>
      case "processing":
        return <Badge className="bg-cyan-600"><Package className="h-3 w-3 mr-1" />Processing</Badge>
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Payment Pending</Badge>
      case "processing":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Processing</Badge>
      default:
        return null
    }
  }

  const getPurchaseTypeIcon = (name: string) => {
    if (name.includes("Product Order")) return <Package className="h-5 w-5 text-blue-500" />
    if (name.includes("Service Order")) return <FileText className="h-5 w-5 text-purple-500" />
    if (name.includes("Equipment Rental")) return <Truck className="h-5 w-5 text-green-500" />
    if (name.includes("Software License")) return <ClipboardList className="h-5 w-5 text-orange-500" />
    return <Package className="h-5 w-5 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Purchase
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Pending</CardDescription>
            <CardTitle className="text-2xl">
              {purchasesData.filter(p => p.status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Processing</CardDescription>
            <CardTitle className="text-2xl">
              {purchasesData.filter(p => p.status === 'processing').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Shipped</CardDescription>
            <CardTitle className="text-2xl">
              {purchasesData.filter(p => p.status === 'shipped').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Delivered</CardDescription>
            <CardTitle className="text-2xl">
              {purchasesData.filter(p => p.status === 'delivered').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">Completed</CardDescription>
            <CardTitle className="text-2xl">
              {purchasesData.filter(p => p.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search purchases..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Purchase Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="product">Product Orders</SelectItem>
            <SelectItem value="service">Service Orders</SelectItem>
            <SelectItem value="rental">Equipment Rentals</SelectItem>
            <SelectItem value="license">Software Licenses</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchasesData.map((purchase) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getPurchaseTypeIcon(purchase.name)}
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{purchase.name}</CardTitle>
                    <CardDescription>
                      Vendor: {purchase.assignee_name}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(purchase.status)}
                  {purchase.payment_status && getPaymentBadge(purchase.payment_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">{purchase.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Purchased</p>
                  <p className="text-sm">{new Date(purchase.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expected</p>
                  <p className="text-sm">{new Date(purchase.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="capitalize">{purchase.priority}</Badge>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button variant="outline" size="sm">Track</Button>
                  <Button size="sm">Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
