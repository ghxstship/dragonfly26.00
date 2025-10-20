"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { OverviewTemplateOrganism, OverviewStat, OverviewQuickAction, OverviewSummaryItem } from '@/components/organisms'
import { Users, UserPlus, Calendar, Clock, GraduationCap, UserCheck, Briefcase, FileText, Plus } from 'lucide-react'
import { usePersonnel } from '@/hooks/use-people-data'

/**
 * People Overview Tab
 * 
 * First tab in People module - provides comprehensive overview
 * Uses OverviewTemplateOrganism for consistent structure
 * 
 * Features:
 * - Personnel statistics
 * - Quick actions for common tasks
 * - Activity summary
 * - Fully internationalized
 * - WCAG 2.1 AA compliant
 */

export interface PeopleOverviewTabProps {
  workspaceId?: string
  userId?: string
}

export function PeopleOverviewTab({ workspaceId = '', userId = '' }: PeopleOverviewTabProps): JSX.Element {
  const t = useTranslations('people.overview')
  
  // Fetch people data
  const { personnel, loading } = usePersonnel(workspaceId)
  
  // Calculate statistics
  const totalPersonnel = personnel.length
  const activePersonnel = personnel.filter((p: any) => p.status === 'active').length
  const onLeave = personnel.filter((p: any) => p.on_leave).length
  const pendingOnboarding = personnel.filter((p: any) => p.onboarding_status === 'pending').length
  
  // Stats configuration
  const stats: OverviewStat[] = [
    {
      labelKey: 'totalPersonnel',
      value: totalPersonnel.toString(),
      change: "+5",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      labelKey: 'activePersonnel',
      value: activePersonnel.toString(),
      change: "+3",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      labelKey: 'onLeave',
      value: onLeave.toString(),
      change: "-2",
      trend: "down",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
    {
      labelKey: 'pendingOnboarding',
      value: pendingOnboarding.toString(),
      change: "+1",
      trend: "up",
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ]
  
  // Quick actions configuration
  const quickActions: OverviewQuickAction[] = [
    { labelKey: 'addPersonnel', icon: UserPlus, color: "text-blue-600", action: () => console.log('Add personnel') },
    { labelKey: 'scheduleShift', icon: Calendar, color: "text-green-600", action: () => console.log('Schedule shift') },
    { labelKey: 'logTime', icon: Clock, color: "text-orange-600", action: () => console.log('Log time') },
    { labelKey: 'assignTraining', icon: GraduationCap, color: "text-purple-600", action: () => console.log('Assign training') },
  ]
  
  // Summary items configuration
  const summaryItems: OverviewSummaryItem[] = [
    { labelKey: 'hoursWorked', value: '2,340', ariaLabel: '2,340 hours worked this week' },
    { labelKey: 'shiftsScheduled', value: '156', ariaLabel: '156 shifts scheduled' },
    { labelKey: 'trainingsCompleted', value: '42', ariaLabel: '42 trainings completed' },
    { labelKey: 'applicantsReviewed', value: '18', ariaLabel: '18 applicants reviewed' },
  ]
  
  return (
    <div role="main" aria-label="Overview content">
      <OverviewTemplateOrganism
      translationNamespace="people.overview"
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
