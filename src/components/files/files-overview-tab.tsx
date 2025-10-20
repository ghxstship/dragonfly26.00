"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { OverviewTemplateOrganism, OverviewStat, OverviewQuickAction, OverviewSummaryItem } from '@/components/organisms'
import { FileText, Upload, Star, Share2, Trash2, FolderOpen, Download, Clock } from 'lucide-react'
import { useFilesData } from '@/hooks/use-files-data'

export interface FilesOverviewTabProps {
  workspaceId?: string
  userId?: string
}

export function FilesOverviewTab({ workspaceId = '', userId = '' }: FilesOverviewTabProps): JSX.Element {
  const t = useTranslations('files.overview')
  const { files, loading } = useFilesData()
  
  const totalFiles = files.length
  const recentFiles = files.filter((f: any) => {
    const uploadDate = new Date(f.created_at)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return uploadDate >= weekAgo
  }).length
  const starredFiles = files.filter((f: any) => f.starred).length
  const sharedFiles = files.filter((f: any) => f.shared).length
  
  const stats: OverviewStat[] = [
    {
      labelKey: 'totalFiles',
      value: totalFiles.toString(),
      change: "+24",
      trend: "up",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      labelKey: 'recentUploads',
      value: recentFiles.toString(),
      change: "+12",
      trend: "up",
      icon: Upload,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      labelKey: 'starredFiles',
      value: starredFiles.toString(),
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-950",
    },
    {
      labelKey: 'sharedFiles',
      value: sharedFiles.toString(),
      change: "+5",
      trend: "up",
      icon: Share2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
  ]
  
  const quickActions: OverviewQuickAction[] = [
    { labelKey: 'uploadFile', icon: Upload, color: "text-blue-600", action: () => console.log('Upload file') },
    { labelKey: 'createFolder', icon: FolderOpen, color: "text-green-600", action: () => console.log('Create folder') },
    { labelKey: 'shareFile', icon: Share2, color: "text-purple-600", action: () => console.log('Share file') },
    { labelKey: 'viewRecent', icon: Clock, color: "text-orange-600", action: () => console.log('View recent') },
  ]
  
  const summaryItems: OverviewSummaryItem[] = [
    { labelKey: 'filesUploaded', value: '24', ariaLabel: '24 files uploaded this week' },
    { labelKey: 'filesShared', value: '18', ariaLabel: '18 files shared' },
    { labelKey: 'downloads', value: '156', ariaLabel: '156 downloads' },
    { labelKey: 'storageUsed', value: '12.4 GB', ariaLabel: '12.4 gigabytes storage used' },
  ]
  
  return (
    <div role="main" aria-label="Overview content">
      <OverviewTemplateOrganism
      translationNamespace="files.overview"
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
