"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { OverviewTemplateOrganism, OverviewStat, OverviewQuickAction, OverviewSummaryItem } from '@/components/organisms'
import { Building2, Users, FileText, TrendingUp, Plus, Phone, Mail, Calendar } from 'lucide-react'
import { useCompaniesData } from '@/hooks/use-companies-data'

export interface CompaniesOverviewTabProps {
  workspaceId?: string
  userId?: string
}

export function CompaniesOverviewTab({ workspaceId = '', userId = '' }: CompaniesOverviewTabProps): JSX.Element {
  const t = useTranslations('companies.overview')
  const { companies, loading } = useCompaniesData()
  
  const totalCompanies = companies.length
  const activeRelationships = companies.filter((c: any) => c.status === 'active').length
  const activeContracts = companies.reduce((sum: number, c: any) => sum + (c.active_contracts || 0), 0)
  const pendingActivities = companies.reduce((sum: number, c: any) => sum + (c.pending_activities || 0), 0)
  
  const stats: OverviewStat[] = [
    {
      labelKey: 'totalCompanies',
      value: totalCompanies.toString(),
      change: "+8",
      trend: "up",
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      labelKey: 'activeRelationships',
      value: activeRelationships.toString(),
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      labelKey: 'activeContracts',
      value: activeContracts.toString(),
      change: "+3",
      trend: "up",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      labelKey: 'pendingActivities',
      value: pendingActivities.toString(),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ]
  
  const quickActions: OverviewQuickAction[] = [
    { labelKey: 'addCompany', icon: Plus, color: "text-blue-600", action: () => console.log('Add company') },
    { labelKey: 'scheduleCall', icon: Phone, color: "text-green-600", action: () => console.log('Schedule call') },
    { labelKey: 'sendEmail', icon: Mail, color: "text-orange-600", action: () => console.log('Send email') },
    { labelKey: 'logActivity', icon: Calendar, color: "text-purple-600", action: () => console.log('Log activity') },
  ]
  
  const summaryItems: OverviewSummaryItem[] = [
    { labelKey: 'newCompanies', value: '8', ariaLabel: '8 new companies added this week' },
    { labelKey: 'meetingsHeld', value: '23', ariaLabel: '23 meetings held' },
    { labelKey: 'contractsSigned', value: '5', ariaLabel: '5 contracts signed' },
    { labelKey: 'revenueGenerated', value: '$124K', ariaLabel: '$124,000 revenue generated' },
  ]
  
  return (
    <div role="main" aria-label="Overview content">
      <OverviewTemplateOrganism
      translationNamespace="companies.overview"
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
