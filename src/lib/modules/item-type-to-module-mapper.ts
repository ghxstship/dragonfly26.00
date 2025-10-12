// Maps legacy ItemType to new moduleId and tabSlug system
export type ItemType = "task" | "project" | "job" | "asset" | "location" | "file" | "report" | "list" | "workspace" | "event" | "person" | "company"

interface ModuleTabMapping {
  moduleId: string
  tabSlug: string
}

export function getModuleTabForItemType(itemType: ItemType): ModuleTabMapping {
  const mappings: Record<ItemType, ModuleTabMapping> = {
    task: { moduleId: 'dashboard', tabSlug: 'my-tasks' },
    project: { moduleId: 'projects', tabSlug: 'productions' },
    job: { moduleId: 'dashboard', tabSlug: 'my-jobs' },
    asset: { moduleId: 'assets', tabSlug: 'inventory' },
    location: { moduleId: 'locations', tabSlug: 'directory' },
    file: { moduleId: 'files', tabSlug: 'all-files' },
    report: { moduleId: 'reports', tabSlug: 'custom-builder' },
    list: { moduleId: 'dashboard', tabSlug: 'overview' },
    workspace: { moduleId: 'dashboard', tabSlug: 'overview' },
    event: { moduleId: 'events', tabSlug: 'all-events' },
    person: { moduleId: 'people', tabSlug: 'personnel' },
    company: { moduleId: 'companies', tabSlug: 'organizations' },
  }

  return mappings[itemType]
}
