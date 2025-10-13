// Locations tabs - to be implemented
// For now, return undefined to use default view system

interface LocationsTabProps {
  data?: any[]
  loading?: boolean
}

export const LOCATIONS_TAB_COMPONENTS: Record<string, React.ComponentType<LocationsTabProps> | undefined> = {
  // Add custom location tab components here when needed
}

export function getLocationsTabComponent(tabSlug: string): React.ComponentType<LocationsTabProps> | undefined {
  return LOCATIONS_TAB_COMPONENTS[tabSlug]
}
