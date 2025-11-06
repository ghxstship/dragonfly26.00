'use client'

import { useTranslations } from 'next-intl'
import { Calendar } from 'lucide-react'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function JobsRequisitionsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('jobs.requisitions')
  const { data, loading , error } = useModuleData(workspaceId, 'jobs', 'requisitions-tab')

  const columns = [
    {
      key: 'requisition_number',
      label: t('columns.requisition_number'),
      sortable: true
    },
    {
      key: 'title',
      label: t('columns.title'),
      sortable: true
    },
    {
      key: 'type',
      label: t('columns.type'),
      sortable: true
    },
    {
      key: 'budget',
      label: t('columns.budget'),
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
          <Calendar aria-hidden="true" className="h-8 w-8 text-destructive mx-auto mb-4" />
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
