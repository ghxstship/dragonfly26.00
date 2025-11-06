"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DataTableOrganism } from '@/components/organisms'
import { Button } from '@/components/ui/button'
import { Plus, Briefcase } from 'lucide-react'
import { useOpportunitiesData } from '@/hooks/use-opportunities-data'

/**
 * Opportunities Jobs Tab
 * 
 * Contractors and subcontractors job opportunities
 * Part of new Opportunities module
 */

export interface OpportunitiesJobsTabProps {
  workspaceId?: string
  userId?: string
}

export function OpportunitiesJobsTab({ workspaceId = '', userId = '' }: OpportunitiesJobsTabProps): JSX.Element {
  const t = useTranslations('opportunities.jobs')
  const { jobs, loading } = useOpportunitiesData(workspaceId)
  
  const columns = [
    { key: 'title', label: t('title'), sortable: true },
    { key: 'company', label: t('company'), sortable: true },
    { key: 'type', label: t('type'), sortable: true },
    { key: 'location', label: t('location'), sortable: true },
    { key: 'rate', label: t('rate'), sortable: true },
    { key: 'duration', label: t('duration'), sortable: false },
    { key: 'posted', label: t('posted'), sortable: true },
    { key: 'status', label: t('status'), sortable: true },
  ]
  
  return (
    <div role="main" aria-label="Tab content" className="space-y-4">
      <h2 className="sr-only">{t("title")}</h2>
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Briefcase aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Button aria-label={t('postJob')}>
          <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
          {t('postJob')}
        </Button>
      </div>
      
      <DataTableOrganism
        data={jobs}
        columns={columns}
        loading={loading}
        searchable
      />
    </div>
  )
}
