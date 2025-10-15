// Events module tab components registry
import { EventsCalendarTab } from '@/components/events/events-calendar-tab'
import { EventsRunOfShowTab } from '@/components/events/events-run-of-show-tab'
import { EventsToursTab } from '@/components/events/events-tours-tab'
import type { TabComponentProps } from '@/types'

export const EVENTS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'all-events': EventsCalendarTab,
  'run-of-show': EventsRunOfShowTab,
  'tours': EventsToursTab,
  // Other events tabs use generic views (table, calendar, etc.)
}

export function getEventsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return EVENTS_TAB_COMPONENTS[tabSlug]
}
