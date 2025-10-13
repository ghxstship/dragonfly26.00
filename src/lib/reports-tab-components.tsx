// Reports tabs - to be implemented
// For now, return undefined to use default view system

interface ReportsTabProps {
  data?: any[]
  loading?: boolean
}

export const REPORTS_TAB_COMPONENTS: Record<string, React.ComponentType<ReportsTabProps> | undefined> = {
  // Add custom reports tab components here when needed
}

export function getReportsTabComponent(tabSlug: string) {
  return REPORTS_TAB_COMPONENTS[tabSlug]
}
