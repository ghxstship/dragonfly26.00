'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function MarketplaceShopTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('marketplace.shop')
  const { data, loading } = useModuleData(workspaceId, 'marketplace', 'shop-tab')

  const columns = [
    {
      key: 'product',
      label: t('columns.product'),
      sortable: true
    },
    {
      key: 'category',
      label: t('columns.category'),
      sortable: true
    },
    {
      key: 'price',
      label: t('columns.price'),
      sortable: true
    },
    {
      key: 'vendor',
      label: t('columns.vendor'),
      sortable: true
    },
    {
      key: 'rating',
      label: t('columns.rating'),
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
