'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function LocationsBookingsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('locations.bookings')
  const { data, loading } = useModuleData(workspaceId, 'locations', 'bookings-tab')

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
      emptyMessage={t('emptyState')}
    />
  )
}
