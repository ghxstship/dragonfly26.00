'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}

export function FilesFoldersTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('files.folders')
  const { data: folders, loading } = useModuleData(workspaceId, 'files', 'folders')

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
      data={folders || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
