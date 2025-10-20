"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { OverviewTemplateOrganism, OverviewStat, OverviewQuickAction, OverviewSummaryItem } from '@/components/organisms'
import { Users, UserPlus, Shield, Crown, Mail, Settings, UserCheck, Clock } from 'lucide-react'
import { useAdminData } from '@/hooks/use-admin-data'

export interface MembersOverviewTabProps {
  workspaceId?: string
  userId?: string
}

export function MembersOverviewTab({ workspaceId = '', userId = '' }: MembersOverviewTabProps): JSX.Element {
  const t = useTranslations('admin.membersOverview')
  const { members, loading } = useAdminData()
  
  const totalMembers = members?.length || 0
  const activeMembers = members?.filter((m: any) => m.status === 'active').length || 0
  const admins = members?.filter((m: any) => m.role === 'admin').length || 0
  const pendingInvites = members?.filter((m: any) => m.invite_status === 'pending').length || 0
  
  const stats: OverviewStat[] = [
    {
      labelKey: 'totalMembers',
      value: totalMembers.toString(),
      change: "+12",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      labelKey: 'activeMembers',
      value: activeMembers.toString(),
      change: "+8",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      labelKey: 'administrators',
      value: admins.toString(),
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      labelKey: 'pendingInvites',
      value: pendingInvites.toString(),
      change: "-3",
      trend: "down",
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-950",
    },
  ]
  
  const quickActions: OverviewQuickAction[] = [
    { labelKey: 'inviteMember', icon: UserPlus, color: "text-blue-600", action: () => console.log('Invite member') },
    { labelKey: 'manageRoles', icon: Shield, color: "text-purple-600", action: () => console.log('Manage roles') },
    { labelKey: 'sendAnnouncement', icon: Mail, color: "text-green-600", action: () => console.log('Send announcement') },
    { labelKey: 'configureSettings', icon: Settings, color: "text-orange-600", action: () => console.log('Configure settings') },
  ]
  
  const summaryItems: OverviewSummaryItem[] = [
    { labelKey: 'newMembers', value: '12', ariaLabel: '12 new members this week' },
    { labelKey: 'invitesSent', value: '18', ariaLabel: '18 invites sent' },
    { labelKey: 'roleChanges', value: '5', ariaLabel: '5 role changes' },
    { labelKey: 'loginActivity', value: '847', ariaLabel: '847 login activities' },
  ]
  
  return (
    <div role="main" aria-label="Overview content">
      <OverviewTemplateOrganism
      translationNamespace="admin.membersOverview"
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
