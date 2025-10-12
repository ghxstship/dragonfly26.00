/**
 * Item types for different modules
 */
export type ItemType = "project" | "task" | "event" | "person" | "asset" | "location" | "file" | "company" | "product" | "resource" | "job"

/**
 * Maps module slugs to the appropriate item type for creation
 */
export function getItemTypeForModule(moduleSlug: string): ItemType {
  const mapping: Record<string, ItemType> = {
    // Production Hub
    projects: "project",
    events: "task", // Events are tasks with date/time
    people: "task", // People entries can be tasks
    assets: "task", // Asset items
    locations: "task", // Location entries
    files: "file", // Files/Documents
    
    // Network Hub
    companies: "task", // Company entries
    community: "task", // Community member entries
    marketplace: "task", // Marketplace items
    resources: "file", // Resource documents
    
    // Business Hub
    finance: "task", // Financial items
    procurement: "task", // Purchase orders
    jobs: "task", // Job postings
    
    // Intelligence Hub
    reports: "task", // Reports
    analytics: "task", // Analytics items
    insights: "task", // Strategic insights & objectives
    
    // Default
    dashboard: "task",
  }

  return mapping[moduleSlug] || "task"
}

/**
 * Gets the display name for a new item based on module
 */
export function getNewItemLabel(moduleSlug: string, moduleName: string): string {
  const customLabels: Record<string, string> = {
    projects: "Project",
    events: "Event",
    people: "Person",
    assets: "Asset",
    locations: "Location",
    files: "Document",
    companies: "Company",
    community: "Member",
    marketplace: "Item",
    resources: "Resource",
    finance: "Transaction",
    procurement: "Purchase Order",
    jobs: "Job Posting",
    reports: "Report",
    analytics: "Analysis",
    insights: "Objective",
  }

  return customLabels[moduleSlug] || moduleName.slice(0, -1) // Remove trailing 's'
}
