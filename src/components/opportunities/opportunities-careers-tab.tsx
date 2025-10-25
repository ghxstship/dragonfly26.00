"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DataTableOrganism } from '@/components/organisms'
import { Button } from '@/components/ui/button'
import { Plus, Users } from 'lucide-react'
import { useOpportunitiesData } from '@/hooks/use-opportunities-data'

/**
 * Opportunities Careers Tab
 * 
 * Staffing and permanent career opportunities
 * Part of new Opportunities module
 */

export interface OpportunitiesCareersTabProps {
  workspaceId?: string
  userId?: string
}

export function OpportunitiesCareersTab({ workspaceId = '', userId = '' }: OpportunitiesCareersTabProps): JSX.Element {
  const t = useTranslations('opportunities.careers')
  const { careers, loading } = useOpportunitiesData(workspaceId)
  
  const columns = [
    { key: 'position', label: t('position'), sortable: true },
    { key: 'company', label: t('company'), sortable: true },
    { key: 'department', label: t('department'), sortable: true },
    { key: 'level', label: t('level'), sortable: true },
    { key: 'salary', label: t('salary'), sortable: true },
    { key: 'benefits', label: t('benefits'), sortable: false },
    { key: 'posted', label: t('posted'), sortable: true },
    { key: 'applicants', label: t('applicants'), sortable: true },
  ]
  
  return (
    <div role="main" aria-label="Tab content" className="space-y-4">
      <h2 className="sr-only">{t("title")}</h2>
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">{t('description')}</p>
        </div>
        <Button aria-label={t('postCareer')}>
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('postCareer')}
        </Button>
      </div>
      
      <DataTableOrganism
        data={careers}
        columns={columns}
        loading={loading}
        searchable
      />
    </div>
  )
}
