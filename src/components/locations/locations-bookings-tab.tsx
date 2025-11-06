'use client'

import { useTranslations } from 'next-intl'
import { Calendar } from 'lucide-react'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function LocationsBookingsTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('locations.bookings')
  const { data, loading , error } = useModuleData(workspaceId, 'locations', 'bookings-tab')

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
      data={data || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
