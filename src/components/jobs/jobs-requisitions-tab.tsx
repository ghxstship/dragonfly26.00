'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function JobsRequisitionsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('jobs.requisitions')
  const { data, loading } = useModuleData(workspaceId, 'jobs', 'requisitions-tab')

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
