'use client'

import { useTranslations } from 'next-intl'
import { useEventsData } from '@/hooks/use-events-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'
import { Calendar, MapPin, Users, Clock } from 'lucide-react'

export function EventsOverviewTab(): JSX.Element {
  const t = useTranslations('events.overview')
  const { events, loading } = useEventsData()

  const columns = [
    {
      key: 'name',
      label: t('columns.name'),
      sortable: true
    },
    {
      key: 'type',
      label: t('columns.type'),
      sortable: true
    },
    {
      key: 'start_date',
      label: t('columns.startDate'),
      sortable: true
    },
    {
      key: 'location',
      label: t('columns.location'),
      sortable: false
    },
    {
      key: 'status',
      label: t('columns.status'),
      sortable: true
    }
  ]

  const stats = [
    {
      icon: Calendar,
      label: t('stats.total'),
      value: events?.length || 0
    },
    {
      icon: Clock,
      label: t('stats.upcoming'),
      value: events?.filter(e => e.status === 'upcoming').length || 0
    },
    {
      icon: Users,
      label: t('stats.active'),
      value: events?.filter(e => e.status === 'active').length || 0
    },
    {
      icon: MapPin,
      label: t('stats.locations'),
      value: new Set(events?.map(e => e.location_id)).size || 0
    }
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DataTableOrganism
        data={events || []}
        columns={columns}
        loading={loading}
        searchPlaceholder={t('search')}
        emptyStateMessage={t('emptyState')}
      />
    </div>
  )
}
