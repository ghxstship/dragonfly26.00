"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { OverviewTemplateOrganism, OverviewStat, OverviewQuickAction, OverviewSummaryItem } from '@/components/organisms'
import { MapPin, Building, Warehouse, TruckIcon, Zap, Map, Package, FileText } from 'lucide-react'
import { useLocationsData } from '@/hooks/use-locations-data'

export interface LocationsOverviewTabProps {
  workspaceId?: string
  userId?: string
}

export function LocationsOverviewTab({ workspaceId = '', userId = '' }: LocationsOverviewTabProps): JSX.Element {
  const t = useTranslations('locations.overview')
  const { locations, loading } = useLocationsData()
  
  const totalLocations = locations.length
  const activeSites = locations.filter((l: any) => l.status === 'active').length
  const warehouses = locations.filter((l: any) => l.type === 'warehouse').length
  const pendingAccess = locations.filter((l: any) => l.access_requests > 0).length
  
  const stats: OverviewStat[] = [
    {
      labelKey: 'totalLocations',
      value: totalLocations.toString(),
      change: "+2",
      trend: "up",
      icon: MapPin,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      labelKey: 'activeSites',
      value: activeSites.toString(),
      change: "+1",
      trend: "up",
      icon: Building,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      labelKey: 'warehouses',
      value: warehouses.toString(),
      icon: Warehouse,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      labelKey: 'pendingAccess',
      value: pendingAccess.toString(),
      change: "-3",
      trend: "down",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ]
  
  const quickActions: OverviewQuickAction[] = [
    { labelKey: 'addLocation', icon: MapPin, color: "text-blue-600", action: () => console.log('Add location') },
    { labelKey: 'viewMap', icon: Map, color: "text-green-600", action: () => console.log('View map') },
    { labelKey: 'scheduleLogistics', icon: TruckIcon, color: "text-orange-600", action: () => console.log('Schedule logistics') },
    { labelKey: 'manageUtilities', icon: Zap, color: "text-purple-600", action: () => console.log('Manage utilities') },
  ]
  
  const summaryItems: OverviewSummaryItem[] = [
    { labelKey: 'deliveriesCompleted', value: '87', ariaLabel: '87 deliveries completed this week' },
    { labelKey: 'accessGranted', value: '34', ariaLabel: '34 access requests granted' },
    { labelKey: 'maintenanceOrders', value: '12', ariaLabel: '12 maintenance orders' },
    { labelKey: 'inventoryMoves', value: '156', ariaLabel: '156 inventory moves' },
  ]
  
  return (
    <div role="main" aria-label="Overview content">
      <OverviewTemplateOrganism
      translationNamespace="locations.overview"
      stats={stats}
      quickActions={quickActions}
      summaryItems={summaryItems}
      loading={loading}
      workspaceId={workspaceId}
      userId={userId}
    />
    </div>
  )
}
