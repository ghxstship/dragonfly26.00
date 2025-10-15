// People module tab components registry
import { PeopleSchedulingTab } from '@/components/people/people-scheduling-tab'
import type { TabComponentProps } from '@/types'

export const PEOPLE_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'scheduling': PeopleSchedulingTab,
  // Other people tabs use generic views (table, calendar, etc.)
}

export function getPeopleTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return PEOPLE_TAB_COMPONENTS[tabSlug]
}
