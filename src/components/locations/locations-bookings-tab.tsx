'use client'

import { useTranslations } from 'next-intl'
import { useLocationsData } from '@/hooks/use-locations-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function LocationsBookingsTab(): JSX.Element {
  const t = useTranslations('locations.bookings')
  const { data, loading } = useLocationsData()

  const columns = [
    {
      key: 'location',
      label: t('columns.location'),
      sortable: true
    },
    {
      key: 'event',
      label: t('columns.event'),
      sortable: true
    },
    {
      key: 'start_date',
      label: t('columns.start_date'),
      sortable: true
    },
    {
      key: 'end_date',
      label: t('columns.end_date'),
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
