// Insights tab components registry
import {
  InsightsOverviewTab,
  InsightsObjectivesTab,
  InsightsKeyResultsTab,
  InsightsBenchmarksTab,
  InsightsRecommendationsTab,
  InsightsPrioritiesTab,
  InsightsProgressTrackingTab,
  InsightsReviewsTab,
  InsightsIntelligenceFeedTab,
  InsightsSuccessMetricsTab,
} from '@/components/insights'

interface InsightsTabProps {
  data?: any[]
  loading?: boolean
}

export const INSIGHTS_TAB_COMPONENTS: Record<string, React.ComponentType<InsightsTabProps> | undefined> = {
  'overview': InsightsOverviewTab,
  'objectives': InsightsObjectivesTab,
  'key-results': InsightsKeyResultsTab,
  'benchmarks': InsightsBenchmarksTab,
  'recommendations': InsightsRecommendationsTab,
  'priorities': InsightsPrioritiesTab,
  'progress-tracking': InsightsProgressTrackingTab,
  'reviews': InsightsReviewsTab,
  'intelligence-feed': InsightsIntelligenceFeedTab,
  'success-metrics': InsightsSuccessMetricsTab,
}

export function getInsightsTabComponent(tabSlug: string): React.ComponentType<InsightsTabProps> | undefined {
  return INSIGHTS_TAB_COMPONENTS[tabSlug]
}
