'use client'

import { useTranslations } from 'next-intl'
import { useReportsData } from '@/hooks/use-reports-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function ReportsBuilderTab(): JSX.Element {
  const t = useTranslations('reports.builder')
  const { data, loading } = useReportsData()

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
      emptyStateMessage={t('emptyState')}
    />
  )
}
