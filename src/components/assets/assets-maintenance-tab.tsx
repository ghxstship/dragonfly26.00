'use client'

import { useTranslations } from 'next-intl'
import { useAssets } from '@/hooks/use-assets-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function AssetsMaintenanceTab(): JSX.Element {
  const t = useTranslations('assets.maintenance')
  
  // TODO: Get workspace ID from context or props
  const workspaceId = '' // Placeholder - should come from workspace context
  const { assets, loading } = useAssets(workspaceId)

  const columns = [
    {
      key: 'name',
      label: t('columns.asset'),
      sortable: true
    },
    {
      key: 'type',
      label: t('columns.type'),
      sortable: true
    },
    {
      key: 'status',
      label: t('columns.status'),
      sortable: true
    },
    {
      key: 'category',
      label: t('columns.category'),
      sortable: true
    }
  ]

  return (
    <DataTableOrganism
      data={assets || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
