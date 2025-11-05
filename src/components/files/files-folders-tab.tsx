'use client'

import { useTranslations } from 'next-intl'
import { useFilesData } from '@/hooks/use-files-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function FilesFoldersTab(): JSX.Element {
  const t = useTranslations('files.folders')
  const { data, loading } = useFilesData()

  const columns = [
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true
    },
    {
      key: 'items',
      label: t('columns.items'),
      sortable: true
    },
    {
      key: 'size',
      label: t('columns.size'),
      sortable: true
    },
    {
      key: 'modified',
      label: t('columns.modified'),
      sortable: true
    },
    {
      key: 'owner',
      label: t('columns.owner'),
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
