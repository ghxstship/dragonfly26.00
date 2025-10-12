import { 
  InsightsOverviewTab,
  InsightsRecommendationsTab,
  InsightsBenchmarksTab,
  InsightsObjectivesTab,
  InsightsKeyResultsTab,
  InsightsPrioritiesTab,
  InsightsProgressTrackingTab,
  InsightsReviewsTab,
  InsightsIntelligenceFeedTab,
  InsightsSuccessMetricsTab,
} from '@/components/insights'

// Map tab slugs to components
const insightsTabComponents: Record<string, React.ComponentType> = {
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

export function getInsightsTabComponent(tabSlug: string): React.ComponentType | undefined {
  return insightsTabComponents[tabSlug]
}
