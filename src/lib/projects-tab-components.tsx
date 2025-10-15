// Projects module tab components registry
import { ProjectsProductionsTab } from '@/components/projects/projects-productions-tab'
import { ProjectsScheduleTab } from '@/components/projects/projects-schedule-tab'
import type { TabComponentProps } from '@/types'

export const PROJECTS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'productions': ProjectsProductionsTab,
  'schedule': ProjectsScheduleTab,
  // Other projects tabs use generic views (table, timeline, etc.)
}

export function getProjectsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return PROJECTS_TAB_COMPONENTS[tabSlug]
}
