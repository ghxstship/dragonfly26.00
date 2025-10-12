// Events tabs - to be implemented
// For now, return undefined to use default view system

export const EVENTS_TAB_COMPONENTS: Record<string, React.ComponentType | undefined> = {
  // Add custom event tab components here when needed
}

export function getEventsTabComponent(tabSlug: string) {
  return EVENTS_TAB_COMPONENTS[tabSlug]
}
