'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function ReportsBuilderTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('reports.builder')
  const { data, loading } = useModuleData(workspaceId, 'reports', 'builder-tab')

  const columns = [
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true
    },
    {
      key: 'type',
      label: t('columns.type'),
      sortable: true
    },
    {
      key: 'data_source',
      label: t('columns.data_source'),
      sortable: true
    },
    {
      key: 'last_run',
      label: t('columns.last_run'),
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
