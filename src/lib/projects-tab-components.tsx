// Projects module uses generic view system with contextual mock data
// No custom tab components are defined - all tabs use the standard view components

interface ProjectsTabProps {
  data?: any[]
  loading?: boolean
}

export const PROJECTS_TAB_COMPONENTS: Record<string, React.ComponentType<ProjectsTabProps> | undefined> = {
  // Projects uses generic views with contextual mock data
}

export function getProjectsTabComponent(tabSlug: string): React.ComponentType<ProjectsTabProps> | undefined {
  return PROJECTS_TAB_COMPONENTS[tabSlug]
}
