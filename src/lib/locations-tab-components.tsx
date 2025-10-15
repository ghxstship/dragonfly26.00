// Locations module tab components registry
import { LocationsDirectoryTab } from '@/components/locations/locations-directory-tab'
import { LocationsSiteMapsTab } from '@/components/locations/locations-site-maps-tab'
import type { TabComponentProps } from '@/types'

export const LOCATIONS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'directory': LocationsDirectoryTab,
  'site-maps': LocationsSiteMapsTab,
  // Other locations tabs use generic views (table, map, etc.)
}

export function getLocationsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return LOCATIONS_TAB_COMPONENTS[tabSlug]
}
