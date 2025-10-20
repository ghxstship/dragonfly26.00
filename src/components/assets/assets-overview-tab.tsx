"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Wrench,
  DollarSign,
  CheckCircle2,
  Clock,
  Plus,
  Download } from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function AssetsOverviewTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.assets.overview')
  const tCommon = useTranslations('common')
  const { data: assets, loading } = useModuleData(workspaceId, 'assets', 'overview')

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount)
  }

  // Sample data - should be replaced with real data from useModuleData
  const overview = {
    totalAssets: 1247,
    totalValue: 3850000,
    availableAssets: 892,
    rentedAssets: 245,
    maintenanceAssets: 78,
    retiredAssets: 32,
    utilizationRate: 73,
    avgAssetAge: 3.2,
  }

  const assetsByCategory = [
    { category: 'Audio Equipment', count: 342, value: 980000, percentage: 27 },
    { category: 'Lighting', count: 287, value: 750000, percentage: 23 },
    { category: 'Video Equipment', count: 198, value: 1200000, percentage: 16 },
    { category: 'Staging & Rigging', count: 156, value: 450000, percentage: 13 },
    { category: 'Vehicles', count: 89, value: 320000, percentage: 7 },
    { category: 'Tools & Accessories', count: 175, value: 150000, percentage: 14 },
  ]

  const recentActivity = [
    { action: 'Checked Out', asset: 'Sony FX6 Cinema Camera #42', user: 'John Smith', time: '5 minutes ago' },
    { action: 'Maintenance Completed', asset: 'Genie SX-180 Lift #12', user: 'Service Team', time: '1 hour ago' },
    { action: 'Added to Inventory', asset: 'Shure Wireless Mic System', user: 'Sarah Johnson', time: '2 hours ago' },
    { action: 'Checked In', asset: 'Martin MAC Viper Profile', user: 'Mike Chen', time: '3 hours ago' },
  ]

  const alerts = [
    { id: 1, type: 'warning', message: '78 assets due for maintenance within 30 days', priority: 'high' },
    { id: 2, type: 'info', message: '15 assets have low stock levels', priority: 'medium' },
    { id: 3, type: 'success', message: 'Asset utilization up 12% this month', priority: 'low' },
  ]

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalAssets')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalAssets}</div>
            <p className="text-xs text-muted-foreground">
              {overview.availableAssets} available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalValue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Asset portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('utilizationRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overview.utilizationRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" aria-hidden="true" />
              +5% vs last month
            </div>
          </CardContent>
        </Card>

        <Card className={overview.maintenanceAssets > 50 ? "border-yellow-200 dark:border-yellow-900" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('inMaintenance')}</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overview.maintenanceAssets > 50 ? 'text-yellow-600' : ''}`}>
              {overview.maintenanceAssets}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Asset Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{t('assetStatusDistribution')}</CardTitle>
          <CardDescription>{t('cardDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{overview.availableAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('available')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{overview.rentedAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('inUseRented')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{overview.maintenanceAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('maintenance')}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{overview.retiredAssets}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('retired')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Assets by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Assets by Category</CardTitle>
            <CardDescription>Distribution across asset types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(assetsByCategory as any[]).map((category: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-muted-foreground">
                      {category.count} items · {formatCurrency(category.value)}
                    </span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest asset movements and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(recentActivity as any[]).map((activity: any, index: number) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.action === 'Checked Out' ? "bg-blue-500" :
                    activity.action === 'Checked In' ? "bg-green-500" :
                    activity.action === 'Maintenance Completed' ? "bg-purple-500" :
                    "bg-orange-500"
                  }`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.action}</span>
                      {" · "}
                      <span className="text-muted-foreground">{activity.asset}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user} · {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Alerts & Notifications</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert: any) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  (alert as any).type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-200' :
                  (alert as any).type === 'success' ? 'bg-green-50 dark:bg-green-950 border-green-200' :
                  'bg-blue-50 dark:bg-blue-950 border-blue-200'
                }`}
              >
                <AlertCircle className={`h-5 w-5 mt-0.5 ${
                  (alert as any).type === 'warning' ? 'text-yellow-600' :
                  (alert as any).type === 'success' ? 'text-green-600' :
                  'text-blue-600'
                }`} />
                <div className="flex-1">
                  <div className="text-sm font-medium">{alert.message}</div>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {alert.priority} priority
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">View Inventory</Button>
            <Button variant="outline">Schedule Maintenance</Button>
            <Button variant="outline">Check Out Asset</Button>
            <Button variant="outline">Run Count</Button>
            <Button variant="outline">Generate Report</Button>
          </div>
        </CardContent>
      </Card>

    </div>
    </main>
  )
}
