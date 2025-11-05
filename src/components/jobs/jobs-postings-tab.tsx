'use client'

import { useTranslations } from 'next-intl'
import { useJobsData } from '@/hooks/use-jobs-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function JobsPostingsTab(): JSX.Element {
  const t = useTranslations('jobs.postings')
  const { data, loading } = useJobsData()

  const columns = [
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
      key: 'rate',
      label: t('columns.rate'),
      sortable: true
    },
    {
      key: 'applications',
      label: t('columns.applications'),
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
