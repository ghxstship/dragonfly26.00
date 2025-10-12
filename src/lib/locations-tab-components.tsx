// Locations tabs - to be implemented
// For now, return undefined to use default view system

export const LOCATIONS_TAB_COMPONENTS: Record<string, React.ComponentType | undefined> = {
  // Add custom location tab components here when needed
}

export function getLocationsTabComponent(tabSlug: string) {
  return LOCATIONS_TAB_COMPONENTS[tabSlug]
}
