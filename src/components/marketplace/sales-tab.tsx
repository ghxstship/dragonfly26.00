"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, DollarSign, Package, Clock, CheckCircle2, XCircle, AlertCircle, Search, Download, Plus } from "lucide-react"
import { useMarketplaceData } from "@/hooks/use-marketplace-data"
import { useTranslations } from 'next-intl'

interface Sale {
  id: string
  status: string
  price: string
  buyer?: string
  date?: string
  [key: string]: any
}

interface SalesTabProps {
  data?: Sale[]
  loading?: boolean
}

export function SalesTab({ data = [], loading: loadingProp = false }: SalesTabProps) {
  const { orders, loading: liveLoading } = useMarketplaceData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.sales')
  const tCommon = useTranslations('common')
  const salesData: Sale[] = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />{t('completed')}</Badge>
      case "in-progress":
        return <Badge className="bg-blue-600"><Clock className="h-3 w-3 mr-1" aria-hidden="true" />{t('inProgress')}</Badge>
      case "confirmed":
        return <Badge className="bg-purple-600"><CheckCircle2 className="h-3 w-3 mr-1 flex-shrink-0" />{t('confirmed')}</Badge>
      case "pending":
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" aria-hidden="true" />{t('pending')}</Badge>
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
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">{t('pending')}</Badge>
      case "partial":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">{t('partial')}</Badge>
      case "overdue":
        return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">{t('overdue')}</Badge>
      default:
        return null
    }
  }

  const totalRevenue = salesData.reduce((sum: any, item: any) => sum + parseFloat(item.price?.replace(/[$,]/g, '') || '0'), 0)
  const completedSales = salesData.filter(s => s.status === 'completed').length
  const pendingSales = salesData.filter(s => s.status === 'pending').length

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl flex flex-wrap flex-col md:flex-row items-center gap-2">
              <DollarSign className="h-6 w-6 text-green-600"  aria-hidden="true" />
              ${totalRevenue.toLocaleString()}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Completed Sales</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl flex flex-wrap flex-col md:flex-row items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
              {completedSales}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Sales</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-600" aria-hidden="true" />
              {pendingSales}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap flex-col sm:flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
        <div className="flex-1 relative">
          <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
          <Input placeholder={t('searchSales')} className="pl-9" />
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" aria-hidden="true" />
          Export
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Sales</TabsTrigger>
          <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
          <TabsTrigger value="in-progress">{t('inProgress')}</TabsTrigger>
          <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {salesData.map((sale: any) => (
            <Card key={sale.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{sale.name}</CardTitle>
                    <CardDescription>
                      Customer: {sale.assignee_name}
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap flex-col items-end gap-2">
                    {getStatusBadge(sale.status)}
                    {sale.payment_status && getPaymentBadge(sale.payment_status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('amount')}</p>
                    <p className="text-lg font-semibold">{sale.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('date')}</p>
                    <p className="text-sm">{new Date(sale.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="text-sm">{new Date(sale.due_date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap items-end justify-end gap-2">
                    <Button variant="outline" size="sm">{tCommon('view')}</Button>
                    <Button size="sm">{t('manage')}</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for pending sales
          </div>
        </TabsContent>

        <TabsContent value="in-progress" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for in-progress sales
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for completed sales
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
