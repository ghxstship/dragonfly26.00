// Analytics module tab components registry
import { AnalyticsOverviewTab } from '@/components/analytics/analytics-overview-tab'
import { AnalyticsPerformanceTab } from '@/components/analytics/analytics-performance-tab'
import { AnalyticsTrendsTab } from '@/components/analytics/analytics-trends-tab'
import { AnalyticsComparisonsTab } from '@/components/analytics/analytics-comparisons-tab'
import { AnalyticsForecastingTab } from '@/components/analytics/analytics-forecasting-tab'
import { AnalyticsRealtimeTab } from '@/components/analytics/analytics-realtime-tab'
import { AnalyticsCustomViewsTab } from '@/components/analytics/analytics-custom-views-tab'
import { AnalyticsPivotTablesTab } from '@/components/analytics/analytics-pivot-tables-tab'
import { AnalyticsMetricsLibraryTab } from '@/components/analytics/analytics-metrics-library-tab'
import { AnalyticsDataSourcesTab } from '@/components/analytics/analytics-data-sources-tab'
import type { TabComponentProps } from '@/types'

export const ANALYTICS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'overview': AnalyticsOverviewTab as any,
  'performance': AnalyticsPerformanceTab as any,
  'trends': AnalyticsTrendsTab as any,
  'comparisons': AnalyticsComparisonsTab as any,
  'forecasting': AnalyticsForecastingTab as any,
  'realtime': AnalyticsRealtimeTab as any,
  'custom-views': AnalyticsCustomViewsTab as any,
  'pivot-tables': AnalyticsPivotTablesTab as any,
  'metrics-library': AnalyticsMetricsLibraryTab as any,
  'data-sources': AnalyticsDataSourcesTab as any,
}

export function getAnalyticsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return ANALYTICS_TAB_COMPONENTS[tabSlug]
}
