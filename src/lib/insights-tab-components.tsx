// Insights tabs - to be implemented
// For now, return undefined to use default view system

interface InsightsTabProps {
  data?: any[]
  loading?: boolean
}

export const INSIGHTS_TAB_COMPONENTS: Record<string, React.ComponentType<InsightsTabProps> | undefined> = {
  // Add custom insights tab components here when needed
}

export function getInsightsTabComponent(tabSlug: string) {
  return INSIGHTS_TAB_COMPONENTS[tabSlug]
}
