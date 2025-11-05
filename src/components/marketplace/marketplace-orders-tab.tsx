'use client'

import { useTranslations } from 'next-intl'
import { useModuleData } from '@/hooks/use-module-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

interface TabComponentProps {
  workspaceId: string
  moduleId?: string
  tabSlug?: string
}


export function MarketplaceOrdersTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('marketplace.orders')
  const { data, loading } = useModuleData(workspaceId, 'marketplace', 'orders-tab')

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
      emptyMessage={t('emptyState')}
    />
  )
}
