'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function PeopleAvailabilityTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('people.availability')
  const { data, loading } = useModuleData(workspaceId, 'people', 'availability-tab')

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
      emptyMessage={t('emptyState')}
    />
  )
}
