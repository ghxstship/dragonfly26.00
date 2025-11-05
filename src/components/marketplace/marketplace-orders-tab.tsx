'use client'

import { useTranslations } from 'next-intl'
import { useMarketplaceData } from '@/hooks/use-marketplace-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function MarketplaceOrdersTab(): JSX.Element {
  const t = useTranslations('marketplace.orders')
  const { data, loading } = useMarketplaceData()

  const columns = [
    {
      key: 'order_number',
      label: t('columns.order_number'),
      sortable: true
    },
    {
      key: 'product',
      label: t('columns.product'),
      sortable: true
    },
    {
      key: 'quantity',
      label: t('columns.quantity'),
      sortable: true
    },
    {
      key: 'total',
      label: t('columns.total'),
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
