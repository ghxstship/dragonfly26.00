'use client'

import { useTranslations } from 'next-intl'
import { useCompaniesData } from '@/hooks/use-companies-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function CompaniesContractsTab(): JSX.Element {
  const t = useTranslations('companies.contracts')
  const { contracts, loading } = useCompaniesData()

  const columns = [
    {
      key: 'contract_number',
      label: t('columns.contract_number'),
      sortable: true
    },
    {
      key: 'title',
      label: t('columns.title'),
      sortable: true
    },
    {
      key: 'type',
      label: t('columns.type'),
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
      data={contracts || []}
      columns={columns}
      loading={loading}
      searchPlaceholder={t('search')}
      emptyMessage={t('emptyState')}
    />
  )
}
