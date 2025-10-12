// Projects module uses generic view system with contextual mock data
// No custom tab components are defined - all tabs use the standard view components

export const PROJECTS_TAB_COMPONENTS: Record<string, React.ComponentType> = {
  // Projects uses generic views with contextual mock data
}

export function getProjectsTabComponent(tabSlug: string) {
  return PROJECTS_TAB_COMPONENTS[tabSlug]
}
