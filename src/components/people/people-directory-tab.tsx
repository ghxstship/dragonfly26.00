'use client'

import { useTranslations } from 'next-intl'
import { usePeopleData } from '@/hooks/use-people-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function PeopleDirectoryTab(): JSX.Element {
  const t = useTranslations('people.directory')
  const { data, loading } = usePeopleData()

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
      emptyStateMessage={t('emptyState')}
    />
  )
}
