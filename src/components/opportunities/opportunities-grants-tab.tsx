"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { DataTableOrganism } from '@/components/organisms'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, DollarSign, Globe } from 'lucide-react'
import { useOpportunitiesData } from '@/hooks/use-opportunities-data'

/**
 * Opportunities Grants Tab
 * 
 * Global grant opportunities (moved from Resources module)
 * Features web scraping for global grant discovery
 * Part of new Opportunities module
 */

export interface OpportunitiesGrantsTabProps {
  workspaceId?: string
  userId?: string
}

export function OpportunitiesGrantsTab({ workspaceId = '', userId = '' }: OpportunitiesGrantsTabProps): JSX.Element {
  const t = useTranslations('opportunities.grants')
  const { grants, loading, refreshGrants } = useOpportunitiesData(workspaceId)
  
  const columns = [
    { key: 'title', label: t('title'), sortable: true },
    { key: 'organization', label: t('organization'), sortable: true },
    { key: 'amount', label: t('amount'), sortable: true },
    { key: 'region', label: t('region'), sortable: true },
    { key: 'category', label: t('category'), sortable: true },
    { key: 'deadline', label: t('deadline'), sortable: true },
    { key: 'eligibility', label: t('eligibility'), sortable: false },
    { key: 'status', label: t('status'), sortable: true },
  ]
  
  return (
    <div role="main" aria-label="Tab content" className="space-y-4">
      <h2 className="sr-only">{t("title")}</h2>
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
          <Globe className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div>
            <p className="text-sm text-muted-foreground">{t('description')}</p>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" aria-hidden="true" />
                {t('totalAvailable')}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {t('globalSources')}
              </Badge>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshGrants}
          aria-label={t('refreshGrants')}
        >
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('refreshGrants')}
        </Button>
      </div>
      
      <DataTableOrganism
        data={grants}
        columns={columns}
        loading={loading}
        searchable
      />
    </div>
  )
}
