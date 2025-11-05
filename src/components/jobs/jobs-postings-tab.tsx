'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function JobsPostingsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('jobs.postings')
  const { data, loading } = useModuleData(workspaceId, 'jobs', 'postings-tab')

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
      emptyMessage={t('emptyState')}
    />
  )
}
