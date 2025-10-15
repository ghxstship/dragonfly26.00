// Resources module tab components registry
import { ResourcesLibraryTab } from '@/components/resources/resources-library-tab'
import type { TabComponentProps } from '@/types'

export const RESOURCES_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'library': ResourcesLibraryTab,
  // Other resources tabs use generic views (table, list, etc.)
}

export function getResourcesTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return RESOURCES_TAB_COMPONENTS[tabSlug]
}
