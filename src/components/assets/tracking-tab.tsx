"use client"

import { useTranslations } from 'next-intl'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ScanLine,
  MapPin,
  Package,
  Clock,
  User,
  Search,
  QrCode,
  Plus,
  Download,
  Filter,
  Calendar
} from "lucide-react"
import { DataTableOrganism } from "@/components/organisms"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function TrackingTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const t = useTranslations('production.assets.tracking')
  const tCommon = useTranslations('common')
  const { data: trackingData, loading } = useModuleData(workspaceId, 'assets', 'tracking')
  const [scannerOpen, setScannerOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tracking data...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'checked_out': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
      'checked_in': 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
      'in_transit': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
      'maintenance': 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400',
      'available': 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  // Schema for tracking table
  const trackingSchema = [
    {
      key: 'asset_name',
      label: 'Asset',
      render: (value: any, item: any) => (
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-xs text-muted-foreground">{(item as any).asset_tag || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <Badge className={getStatusColor(value as string)}>
          {(value as string)?.replace(/_/g, ' ')}
        </Badge>
      )
    },
    {
      key: 'location',
      label: 'Location',
      render: (value: any) => (
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
          <span>{(value as string) || 'Unknown'}</span>
        </div>
      )
    },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      render: (value: any) => {
        if (!value) return <span className="text-muted-foreground">-</span>
        const assignee = value as any
        return (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            <span>{assignee.first_name} {assignee.last_name}</span>
          </div>
        )
      }
    },
    {
      key: 'checked_out_at',
      label: 'Checked Out',
      render: (value: any) => value ? new Date(value as string).toLocaleDateString() : '-'
    },
    {
      key: 'expected_return',
      label: 'Expected Return',
      render: (value: any, item: any) => {
        if (!value) return '-'
        const returnDate = new Date(value as string)
        const today = new Date()
        const isOverdue = returnDate < today && (item as any).status === 'checked_out'
        return (
          <div className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {returnDate.toLocaleDateString()}
            {isOverdue && ' (Overdue)'}
          </div>
        )
      }
    },
    {
      key: 'days_out',
      label: 'Days Out',
      render: (value: any, item: any) => {
        const row = item as any
        if (!row.checked_out_at) return '-'
        const checkedOutDate = typeof row.checked_out_at === 'string' || typeof row.checked_out_at === 'number' 
          ? new Date(row.checked_out_at)
          : new Date()
        const daysOut = Math.floor((new Date().getTime() - checkedOutDate.getTime()) / (1000 * 60 * 60 * 24))
        return <span>{daysOut} days</span>
      }
    },
  ]

  // Filter data
  const filteredData = statusFilter
    ? trackingData.filter((item: any) => (item as any).status === statusFilter)
    : trackingData

  // Calculate metrics
  const checkedOut = trackingData.filter((item: any) => (item as any).status === 'checked_out').length
  const inTransit = trackingData.filter((item: any) => (item as any).status === 'in_transit').length
  const available = trackingData.filter((item: any) => (item as any).status === 'available').length
  const overdue = trackingData.filter((item: any) => {
    if (item.status !== 'checked_out' || !item.expected_return) return false
    return new Date(item.expected_return) < new Date()
  }).length

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Checked Out</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{checkedOut}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>In Transit</CardDescription>
            <CardTitle className="text-2xl text-yellow-600">{inTransit}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('available')}</CardDescription>
            <CardTitle className="text-2xl text-green-600">{available}</CardTitle>
          </CardHeader>
        </Card>
        <Card className={overdue > 0 ? "border-red-200 dark:border-red-900" : ""}>
          <CardHeader className="pb-3">
            <CardDescription>{t('overdue')}</CardDescription>
            <CardTitle className={`text-2xl ${overdue > 0 ? 'text-red-600' : ''}`}>{overdue}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filter:</span>
        {['checked_out', 'checked_in', 'in_transit', 'maintenance', 'available'].map(status => (
          <Badge
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
          >
            {status.replace(/_/g, ' ')}
          </Badge>
        ))}
        {statusFilter && (
          <Button variant="ghost" size="sm" onClick={() => setStatusFilter(null)}>
            Clear
          </Button>
        )}
      </div>

      {/* Tracking Table */}
      <DataTableOrganism
        data={filteredData}
        columns={trackingSchema}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search assets..."
        sortable={true}
        emptyMessage="No tracking data found"
      />

      {/* Recent Check-ins/Check-outs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest check-ins and check-outs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trackingData.slice(0, 5).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.asset_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.assigned_to ? `${item.assigned_to.first_name} ${item.assigned_to.last_name}` : 'Unassigned'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(item.status)}>
                    {item.status?.replace(/_/g, ' ')}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.checked_out_at && new Date(item.checked_out_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
