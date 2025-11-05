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


export function MarketplaceShopTab({ workspaceId }: TabComponentProps): JSX.Element {
  const t = useTranslations('marketplace.shop')
  const { data, loading , error } = useModuleData(workspaceId, 'marketplace', 'shop-tab')

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

  if (error) {
    return (
      <div className="flex items-center justify-center h-full" role="alert" aria-live="assertive">
        <div className="text-center">
          <Calendar className="h-8 w-8 text-destructive mx-auto mb-4" aria-hidden="true" />
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
