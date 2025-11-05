'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function PeopleDirectoryTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('people.directory')
  const { data, loading } = useModuleData(workspaceId, 'people', 'directory-tab')

  const columns = [
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true
    },
    {
      key: 'role',
      label: t('columns.role'),
      sortable: true
    },
    {
      key: 'department',
      label: t('columns.department'),
      sortable: true
    },
    {
      key: 'email',
      label: t('columns.email'),
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
