'use client'

import { useTranslations } from 'next-intl'
import { useInsightsData } from '@/hooks/use-insights-data'
import { DataTableOrganism } from '@/components/organisms/data-views/DataTableOrganism'

export function InsightsPatternsTab(): JSX.Element {
  const t = useTranslations('insights.patterns')
  const { data, loading } = useInsightsData()

  const columns = [
    {
      key: 'pattern',
      label: t('columns.pattern'),
      sortable: true
    },
    {
      key: 'confidence',
      label: t('columns.confidence'),
      sortable: true
    },
    {
      key: 'occurrences',
      label: t('columns.occurrences'),
      sortable: true
    },
    {
      key: 'impact',
      label: t('columns.impact'),
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
