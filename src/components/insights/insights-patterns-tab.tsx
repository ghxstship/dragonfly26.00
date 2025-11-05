'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'
import { Calendar } from 'lucide-react'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function InsightsPatternsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('insights.patterns')
  const { data, loading, error } = useModuleData(workspaceId, 'insights', 'patterns-tab')

  const columns = [
    {
      key: 'pattern',
      label: t('columns.pattern'),
      sortable: true
    },
    {
      key: 'confidence',
      label: t('columns.confidence'),
      sortable: true
    },
    {
      key: 'occurrences',
      label: t('columns.occurrences'),
      sortable: true
    },
    {
      key: 'impact',
      label: t('columns.impact'),
      sortable: true
    },
    {
      key: 'status',
      label: t('columns.status'),
      sortable: true
    }
  ]

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-destructive mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">Failed to load data</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <DataTableOrganism
      data={data || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
