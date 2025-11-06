'use client'

import { useTranslations } from 'next-intl'
import { Calendar } from 'lucide-react'
import { useModuleData } from '@/hooks/use-module-data'
import { useFilesData } from '@/hooks/use-files-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}

export function FilesFoldersTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('files.folders')
  const { data: folders, loading, error } = useModuleData(workspaceId, 'files', 'folders')

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
      data={folders || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
