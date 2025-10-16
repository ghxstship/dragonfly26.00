"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, FileText, Package, Truck, AlertCircle, CheckCircle, Clock, XCircle, Search, Plus } from "lucide-react"
import { useTranslations } from 'next-intl'

interface OrdersTabProps {
  data?: any[]
  loading?: boolean
}

export function OrdersTab({ data = [], loading = false }: OrdersTabProps) {
  const t = useTranslations('marketplace.orders')
  const tCommon = useTranslations('common')
  const ordersData = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('completed')}</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600"><Truck className="h-3 w-3 mr-1" aria-hidden="true" />{t('inProgress')}</Badge>
      case "approved":
        return <Badge className="bg-purple-600"><CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('approved')}</Badge>
      case "submitted":
        return <Badge className="bg-cyan-600"><FileText className="h-3 w-3 mr-1" aria-hidden="true" />{t('submitted')}</Badge>
      case "draft":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" aria-hidden="true" />{t('draft')}</Badge>
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('cancelled')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getApprovalBadge = (approvalStatus: string) => {
    switch (approvalStatus) {
      case "approved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{t('approved')}</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{t('pendingApproval')}</Badge>
      case "needs-review":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">{t('needsReview')}</Badge>
      default:
        return null
    }
  }

  const getOrderTypeIcon = (name: string) => {
    if (name.includes("Purchase Order")) return <Package className="h-5 w-5 text-blue-500" aria-hidden="true" />
    if (name.includes("Work Order")) return <ClipboardList className="h-5 w-5 text-purple-500" aria-hidden="true" />
    if (name.includes("Rental Order")) return <Truck className="h-5 w-5 text-green-500" aria-hidden="true" />
    if (name.includes("Change Order")) return <AlertCircle className="h-5 w-5 text-orange-500" aria-hidden="true" />
    return <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('description')}
        </p>
        <Button>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />{t('createOrder')}</Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('draft')}</CardDescription>
            <CardTitle className="text-2xl">
              {ordersData.filter(o => o.status === 'draft').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('submitted')}</CardDescription>
            <CardTitle className="text-2xl">
              {ordersData.filter(o => o.status === 'submitted').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('approved')}</CardDescription>
            <CardTitle className="text-2xl">
              {ordersData.filter(o => o.status === 'approved').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('inProgress')}</CardDescription>
            <CardTitle className="text-2xl">
              {ordersData.filter(o => o.status === 'in-progress').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('completed')}</CardDescription>
            <CardTitle className="text-2xl">
              {ordersData.filter(o => o.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input placeholder={t('searchOrders')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('orderType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="purchase">Purchase Orders</SelectItem>
            <SelectItem value="work">Work Orders</SelectItem>
            <SelectItem value="rental">Rental Orders</SelectItem>
            <SelectItem value="change">Change Orders</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">{t('allStatus')}</SelectItem>
            <SelectItem value="draft">{t('draft')}</SelectItem>
            <SelectItem value="submitted">{t('submitted')}</SelectItem>
            <SelectItem value="approved">{t('approved')}</SelectItem>
            <SelectItem value="in-progress">{t('inProgress')}</SelectItem>
            <SelectItem value="completed">{t('completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {ordersData.map((order) => (
          <Card key={order.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getOrderTypeIcon(order.name)}
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{order.name}</CardTitle>
                    <CardDescription>
                      Vendor: {order.assignee_name}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(order.status)}
                  {order.approval_status && getApprovalBadge(order.approval_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold">{order.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="text-sm">{new Date(order.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Priority</p>
                  <Badge variant="outline" className="capitalize">{order.priority}</Badge>
                </div>
                <div className="flex items-end justify-end gap-2">
                  <Button variant="outline" size="sm">{tCommon('view')}</Button>
                  <Button size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
