// Analytics tabs - to be implemented
// For now, return undefined to use default view system

interface AnalyticsTabProps {
  data?: any[]
  loading?: boolean
}

export const ANALYTICS_TAB_COMPONENTS: Record<string, React.ComponentType<AnalyticsTabProps> | undefined> = {
  // Add custom analytics tab components here when needed
}

export function getAnalyticsTabComponent(tabSlug: string): React.ComponentType<AnalyticsTabProps> | undefined {
  return ANALYTICS_TAB_COMPONENTS[tabSlug]
}
