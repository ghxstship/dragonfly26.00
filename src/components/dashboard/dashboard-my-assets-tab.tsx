"use client"

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
import { useRouter } from "next/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyAssetsTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const { assets, loading } = useMyAssets(workspaceId, userId)
  
  const mockAssets = [
    {
      id: "1",
      name: "Shure SM58 Microphone",
      category: "Audio",
      type: "Owned",
      quantity: 4,
      condition: "Excellent",
      lastUsed: "Oct 8, 2024",
      project: "Concert Series",
      value: "$400",
      location: "Home Studio",
      maintenanceDate: "Dec 15, 2024",
    },
    {
      id: "2",
      name: "Martin MAC Viper Profile",
      category: "Lighting",
      type: "Rented",
      quantity: 8,
      condition: "Excellent",
      lastUsed: "Oct 10, 2024",
      project: "Summer Festival",
      value: "$2,400/week",
      location: "Festival Site",
      returnDate: "Oct 30, 2024",
    },
    {
      id: "3",
      name: "Barco HDX-W20 Projector",
      category: "Video",
      type: "Leased",
      quantity: 2,
      condition: "Good",
      lastUsed: "Oct 9, 2024",
      project: "Corporate Gala",
      value: "$1,200/month",
      location: "Convention Center",
      leaseEnd: "Nov 30, 2024",
    },
    {
      id: "4",
      name: "Sennheiser EW-D Wireless System",
      category: "Audio",
      type: "Owned",
      quantity: 6,
      condition: "Excellent",
      lastUsed: "Oct 5, 2024",
      project: "Theater Revival",
      value: "$3,600",
      location: "Home Studio",
      maintenanceDate: "Jan 10, 2025",
    },
    {
      id: "5",
      name: "Chauvet Rogue R2X Wash",
      category: "Lighting",
      type: "Owned",
      quantity: 12,
      condition: "Good",
      lastUsed: "Oct 7, 2024",
      project: "Fashion Week",
      value: "$8,400",
      location: "Warehouse Unit B",
      maintenanceDate: "Nov 20, 2024",
    },
    {
      id: "6",
      name: "Blackmagic ATEM Mini Pro",
      category: "Video",
      type: "Owned",
      quantity: 2,
      condition: "Excellent",
      lastUsed: "Oct 6, 2024",
      project: "Corporate Gala",
      value: "$600",
      location: "Home Studio",
      maintenanceDate: "Feb 1, 2025",
    },
  ]
  
  const assetsList = assets.length > 0 ? assets.map(asset => ({
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
  })) : mockAssets
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading assets...</p>
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
    { name: "Audio", count: 10, icon: Music, color: "text-purple-600" },
    { name: "Lighting", count: 20, icon: Lightbulb, color: "text-yellow-600" },
    { name: "Video", count: 4, icon: Video, color: "text-blue-600" },
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
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" disabled>
            <Search className="h-4 w-4" />
            Search
          </Button>
          <Button 
            size="sm" 
            className="gap-2"
            onClick={() => router.push(`/workspace/${workspaceId}/assets/inventory`)}
          >
            <Plus className="h-4 w-4" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary.owned}</p>
              <p className="text-xs text-muted-foreground mt-1">Owned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{summary.rented}</p>
              <p className="text-xs text-muted-foreground mt-1">Rented</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{summary.leased}</p>
              <p className="text-xs text-muted-foreground mt-1">Leased</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold">{summary.totalValue}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{summary.inUse}</p>
              <p className="text-xs text-muted-foreground mt-1">In Use</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-600">{summary.available}</p>
              <p className="text-xs text-muted-foreground mt-1">Available</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">By Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {categoryStats.map((category) => {
              const Icon = category.icon
              return (
                <div
                  key={category.name}
                  className="p-4 border rounded-lg text-center hover:bg-accent transition-colors cursor-pointer"
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${category.color}`} />
                  <p className="font-semibold">{category.count}</p>
                  <p className="text-xs text-muted-foreground">{category.name}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assetsList.map((asset) => (
              <div
                key={asset.id}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => router.push(`/workspace/${workspaceId}/assets/inventory?id=${asset.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{asset.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Qty: {asset.quantity} • {asset.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <Badge variant="secondary" className={getTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                      <Badge variant="outline">
                        {asset.category}
                      </Badge>
                      <span className={`flex items-center gap-1 font-medium ${getConditionColor(asset.condition)}`}>
                        <AlertCircle className="h-3.5 w-3.5" />
                        {asset.condition}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Last used: {asset.lastUsed}</span>
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
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Asset Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$15.4k</p>
              <p className="text-xs text-muted-foreground mt-1">Owned Assets</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$3.6k</p>
              <p className="text-xs text-muted-foreground mt-1">Monthly Rental/Lease</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$19.0k</p>
              <p className="text-xs text-muted-foreground mt-1">Total Portfolio</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
