'use client'

import { useTranslations } from 'next-intl'
import { useMarketplaceData } from '@/hooks/use-marketplace-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function MarketplaceShopTab(): JSX.Element {
  const t = useTranslations('marketplace.shop')
  const { data, loading } = useMarketplaceData()

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
      emptyStateMessage={t('emptyState')}
    />
  )
}
