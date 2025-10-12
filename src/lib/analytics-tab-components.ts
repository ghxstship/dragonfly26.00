import { 
  AnalyticsOverviewTab,
  AnalyticsPerformanceTab,
  AnalyticsTrendsTab,
  AnalyticsComparisonsTab,
  AnalyticsForecastingTab,
  AnalyticsRealtimeTab,
  AnalyticsCustomViewsTab,
  AnalyticsPivotTablesTab,
  AnalyticsMetricsLibraryTab,
  AnalyticsDataSourcesTab,
} from '@/components/analytics'

// Map tab slugs to components
const analyticsTabComponents: Record<string, React.ComponentType> = {
  'overview': AnalyticsOverviewTab,
  'performance': AnalyticsPerformanceTab,
  'trends': AnalyticsTrendsTab,
  'comparisons': AnalyticsComparisonsTab,
  'forecasting': AnalyticsForecastingTab,
  'realtime': AnalyticsRealtimeTab,
  'custom-views': AnalyticsCustomViewsTab,
  'pivot-tables': AnalyticsPivotTablesTab,
  'metrics-library': AnalyticsMetricsLibraryTab,
  'data-sources': AnalyticsDataSourcesTab,
}

export function getAnalyticsTabComponent(tabSlug: string): React.ComponentType | undefined {
  return analyticsTabComponents[tabSlug]
}
