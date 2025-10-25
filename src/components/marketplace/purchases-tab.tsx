"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClipboardList, FileText, Package, Truck, CheckCircle, Clock, XCircle, Search, Plus } from "lucide-react"
import { useMarketplaceData } from "@/hooks/use-marketplace-data"
import { useTranslations } from 'next-intl'

interface Purchase {
  id: string
  order_number: string
  status: string
  total: string
  items_count?: number
  date?: string
  vendor?: string
  [key: string]: any
}

interface PurchasesTabProps {
  data?: Purchase[]
  loading?: boolean
}

export function PurchasesTab({ data = [], loading: loadingProp = false }: PurchasesTabProps) {
  const { orders, loading: liveLoading } = useMarketplaceData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.purchases')
  const tCommon = useTranslations('common')
  const purchasesData: Purchase[] = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('completed')}</Badge>
      case "delivered":
        return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('delivered')}</Badge>
      case "shipped":
        return <Badge className="bg-blue-600"><Truck className="h-3 w-3 mr-1" aria-hidden="true" />{t('shipped')}</Badge>
      case "processing":
        return <Badge className="bg-cyan-600"><Package className="h-3 w-3 mr-1" aria-hidden="true" />{t('processing')}</Badge>
      case "pending":
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" aria-hidden="true" />{t('pending')}</Badge>
      case "cancelled":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('cancelled')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case "paid":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">{t('paid')}</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Payment Pending</Badge>
      case "processing":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">{t('processing')}</Badge>
      default:
        return null
    }
  }

  const getPurchaseTypeIcon = (name: string) => {
    if (name.includes("Product Order")) return <Package className="h-5 w-5 text-blue-500" aria-hidden="true" />
    if (name.includes("Service Order")) return <FileText className="h-5 w-5 text-purple-500" aria-hidden="true" />
    if (name.includes("Equipment Rental")) return <Truck className="h-5 w-5 text-green-500" aria-hidden="true" />
    if (name.includes("Software License")) return <ClipboardList className="h-5 w-5 text-orange-500" aria-hidden="true" />
    return <Package className="h-5 w-5 text-gray-500" aria-hidden="true" />
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('pending')}</CardDescription>
            <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
              {purchasesData.filter(p => (p as any).status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('processing')}</CardDescription>
            <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
              {purchasesData.filter(p => (p as any).status === 'processing').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('shipped')}</CardDescription>
            <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
              {purchasesData.filter(p => (p as any).status === 'shipped').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('delivered')}</CardDescription>
            <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
              {purchasesData.filter(p => (p as any).status === 'delivered').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-xs">{t('completed')}</CardDescription>
            <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
              {purchasesData.filter(p => (p as any).status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap flex-col sm:flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
          <Input placeholder={t('searchPurchases')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full max-w-[200px]">
            <SelectValue placeholder={t('purchaseType')} />
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
          <SelectTrigger className="w-full max-w-[180px]">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">{t('allStatus')}</SelectItem>
            <SelectItem value="pending">{t('pending')}</SelectItem>
            <SelectItem value="processing">{t('processing')}</SelectItem>
            <SelectItem value="shipped">{t('shipped')}</SelectItem>
            <SelectItem value="delivered">{t('delivered')}</SelectItem>
            <SelectItem value="completed">{t('completed')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Purchases List */}
      <div className="space-y-4">
        {purchasesData.map((purchase: any) => (
          <Card key={purchase.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-start gap-3">
                  {getPurchaseTypeIcon(purchase.name)}
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{purchase.name}</CardTitle>
                    <CardDescription>
                      Vendor: {purchase.assignee_name}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap flex-col items-end gap-2">
                  {getStatusBadge(purchase.status)}
                  {purchase.payment_status && getPaymentBadge(purchase.payment_status)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('amount')}</p>
                  <p className="text-lg font-semibold">{purchase.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('purchased')}</p>
                  <p className="text-sm">{new Date(purchase.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('expected')}</p>
                  <p className="text-sm">{new Date(purchase.due_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('priority')}</p>
                  <Badge variant="outline" className="capitalize">{purchase.priority}</Badge>
                </div>
                <div className="flex flex-wrap items-end justify-end gap-2">
                  <Button variant="outline" size="sm">{t('track')}</Button>
                  <Button size="sm">{tCommon('details')}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
