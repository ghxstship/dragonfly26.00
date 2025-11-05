'use client'

import { useTranslations } from 'next-intl'
import { usePeopleData } from '@/hooks/use-people-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function PeopleAvailabilityTab(): JSX.Element {
  const t = useTranslations('people.availability')
  const { data, loading } = usePeopleData()

  const columns = [
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true
    },
    {
      key: 'date',
      label: t('columns.date'),
      sortable: true
    },
    {
      key: 'status',
      label: t('columns.status'),
      sortable: true
    },
    {
      key: 'hours',
      label: t('columns.hours'),
      sortable: true
    },
    {
      key: 'notes',
      label: t('columns.notes'),
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
