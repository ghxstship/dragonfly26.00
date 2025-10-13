// Field mappings for all modules based on Supabase database schemas
// Maps module tabs to their actual database fields for proper data display

export interface FieldMapping {
  id: string
  label: string
  type: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'user' | 'currency' | 'percent' | 'array' | 'boolean' | 'json'
  visible: boolean
  locked?: boolean
  sortable?: boolean
  filterable?: boolean
}

// PROJECTS MODULE - Productions Table
export const productionsFields: FieldMapping[] = [
  { id: 'name', label: 'Name', type: 'text', visible: true, locked: true, sortable: true, filterable: true },
  { id: 'code', label: 'Project Code', type: 'text', visible: true, sortable: true, filterable: true },
  { id: 'type', label: 'Type', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'description', label: 'Description', type: 'text', visible: false, sortable: false, filterable: true },
  { id: 'status', label: 'Status', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'priority', label: 'Priority', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'start_date', label: 'Start Date', type: 'date', visible: true, sortable: true, filterable: true },
  { id: 'end_date', label: 'End Date', type: 'date', visible: true, sortable: true, filterable: true },
  { id: 'venue_id', label: 'Venue', type: 'text', visible: true, sortable: false, filterable: true },
  { id: 'project_manager_id', label: 'Project Manager', type: 'user', visible: true, sortable: false, filterable: true },
  { id: 'budget', label: 'Budget', type: 'currency', visible: true, sortable: true, filterable: true },
  { id: 'budget_spent', label: 'Budget Spent', type: 'currency', visible: true, sortable: true, filterable: true },
  { id: 'health', label: 'Health', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'progress', label: 'Progress', type: 'percent', visible: true, sortable: true, filterable: true },
  { id: 'tags', label: 'Tags', type: 'array', visible: true, sortable: false, filterable: true },
  { id: 'created_at', label: 'Created', type: 'datetime', visible: true, sortable: true, filterable: true },
  { id: 'updated_at', label: 'Updated', type: 'datetime', visible: false, sortable: true, filterable: true },
]

// PROJECTS MODULE - Tasks Table
export const projectTasksFields: FieldMapping[] = [
  { id: 'name', label: 'Task Name', type: 'text', visible: true, locked: true, sortable: true, filterable: true },
  { id: 'description', label: 'Description', type: 'text', visible: false, sortable: false, filterable: true },
  { id: 'status', label: 'Status', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'priority', label: 'Priority', type: 'select', visible: true, sortable: true, filterable: true },
  { id: 'assignee_id', label: 'Assignee', type: 'user', visible: true, sortable: false, filterable: true },
  { id: 'start_date', label: 'Start Date', type: 'datetime', visible: true, sortable: true, filterable: true },
  { id: 'due_date', label: 'Due Date', type: 'datetime', visible: true, sortable: true, filterable: true },
  { id: 'estimated_hours', label: 'Estimated Hours', type: 'number', visible: true, sortable: true, filterable: true },
  { id: 'actual_hours', label: 'Actual Hours', type: 'number', visible: true, sortable: true, filterable: true },
  { id: 'production_id', label: 'Production', type: 'text', visible: true, sortable: false, filterable: true },
  { id: 'created_at', label: 'Created', type: 'datetime', visible: true, sortable: true, filterable: true },
  { id: 'updated_at', label: 'Updated', type: 'datetime', visible: false, sortable: true, filterable: true },
]

// Export field mappings by module and tab
export const MODULE_FIELD_MAPPINGS: Record<string, Record<string, FieldMapping[]>> = {
  projects: {
    productions: productionsFields,
    tasks: projectTasksFields,
  },
}

// Helper function to get fields for a module/tab
export function getFieldsForTab(moduleSlug: string, tabSlug: string): FieldMapping[] {
  return MODULE_FIELD_MAPPINGS[moduleSlug]?.[tabSlug] || []
}
