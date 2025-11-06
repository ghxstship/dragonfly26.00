"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package,
  Music,
  Lightbulb,
  Video,
  Plus,
  Search,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { useMyAssets } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyAssetsTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.my-assets')
  const tCommon = useTranslations('common')
  const { assets, loading, error } = useMyAssets(workspaceId, userId)
  

  
  const assetsList = assets.map((asset: any) => ({
    id: asset.id,
    name: asset.name || asset.title,
    category: asset.category?.name || 'Uncategorized',
    type: asset.ownership_type || 'Owned',
    quantity: asset.quantity || 1,
    condition: asset.condition || 'Good',
    lastUsed: asset.last_used ? new Date(asset.last_used).toLocaleDateString() : 'Never',
    project: asset.current_production || 'Available',
    value: asset.purchase_price ? `$${asset.purchase_price}` : 'N/A',
    location: asset.location?.name || 'Unknown',
    returnDate: asset.return_date ? new Date(asset.return_date).toLocaleDateString() : undefined,
    leaseEnd: asset.lease_end_date ? new Date(asset.lease_end_date).toLocaleDateString() : undefined,
    maintenanceDate: asset.next_maintenance_date ? new Date(asset.next_maintenance_date).toLocaleDateString() : undefined,
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

  if (error) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="alert"
        aria-live="assertive"
      >
        <div className="text-center">
          <Package aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-muted-foreground">{tCommon('error.loadFailed')}</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  const summary = {
    owned: 24,
    rented: 8,
    leased: 2,
    totalValue: "$15,400",
    inUse: 18,
    available: 16,
  }

  const categoryStats = [
    { nameKey: "audio", count: 10, icon: Music, color: "text-purple-600" },
    { nameKey: "lighting", count: 20, icon: Lightbulb, color: "text-yellow-600" },
    { nameKey: "video", count: 4, icon: Video, color: "text-blue-600" },
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Owned":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "Rented":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
      case "Leased":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "Excellent":
        return "text-green-600"
      case "Good":
        return "text-blue-600"
      case "Fair":
        return "text-yellow-600"
      case "Poor":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-green-600">{summary.owned}</p>
              <p className="text-xs text-muted-foreground mt-1">Owned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-blue-600">{summary.rented}</p>
              <p className="text-xs text-muted-foreground mt-1">Rented</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-purple-600">{summary.leased}</p>
              <p className="text-xs text-muted-foreground mt-1">Leased</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{summary.totalValue}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalValue')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-orange-600">{summary.inUse}</p>
              <p className="text-xs text-muted-foreground mt-1">In Use</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent aria-hidden="true" className="pt-6">
            <div className="text-center">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-cyan-600">{summary.available}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('available')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="text-base">By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            {categoryStats.map((category: any) => {
              const Icon = category.icon
              return (
                <div
                  key={t(category.nameKey)}
                  className="p-4 border rounded-lg text-center hover:bg-accent transition-colors cursor-pointer"
                >
                  <Icon aria-hidden="true" className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                  <p className="font-semibold">{category.count}</p>
                  <p className="text-xs text-muted-foreground">{t(category.nameKey)}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="text-base">All Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assetsList.map((asset: any) => (
              <div
                key={asset.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                 role="button" tabIndex={0} onClick={() => router.push(`/workspace/${workspaceId}/assets/inventory?id=${asset.id}`)}
              >
                <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {asset.quantity} • {asset.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 text-sm">
                      <Badge variant="secondary" className={getTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                      <Badge variant="outline">
                        {asset.category}
                      </Badge>
                      <span className={`flex items-center gap-1 font-medium ${getConditionColor(asset.condition)}`}>
                        <AlertCircle aria-hidden="true" className="h-3.5 w-3.5" />
                        {asset.condition}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{t('lastUsed')}: {asset.lastUsed}</span>
                      <span>•</span>
                      <span>Project: {asset.project}</span>
                      <span>•</span>
                      <span>Value: {asset.value}</span>
                      {asset.returnDate && (
                        <>
                          <span>•</span>
                          <span className="text-orange-600 font-medium">Return: {asset.returnDate}</span>
                        </>
                      )}
                      {asset.leaseEnd && (
                        <>
                          <span>•</span>
                          <span className="text-purple-600 font-medium">Lease ends: {asset.leaseEnd}</span>
                        </>
                      )}
                      {asset.maintenanceDate && (
                        <>
                          <span>•</span>
                          <span>Next maintenance: {asset.maintenanceDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Value */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="text-base flex flex-wrap flex-col md:flex-row items-center gap-2">
            <TrendingUp aria-hidden="true" className="h-4 w-4" />
            Asset Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">$15.4k</p>
              <p className="text-xs text-muted-foreground mt-1">Owned Assets</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">$3.6k</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Rental/Lease</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">$19.0k</p>
              <p className="text-xs text-muted-foreground mt-1">Total Portfolio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </main>
  )
}
