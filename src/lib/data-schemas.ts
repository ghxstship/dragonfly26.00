/**
 * Data Schema Registry
 * Defines consistent field structures for all modules/tabs
 */

export type FieldType = 
  // Text types
  | 'text' | 'textarea' | 'richtext' | 'markdown'
  // Number types
  | 'number' | 'currency' | 'percent' | 'duration' | 'decimal'
  // Date/Time types
  | 'date' | 'datetime' | 'time' | 'daterange'
  // Selection types
  | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'toggle'
  // User types
  | 'user' | 'users' | 'createdby' | 'modifiedby'
  // Link types
  | 'email' | 'phone' | 'url' | 'location' | 'address'
  // Media types
  | 'file' | 'files' | 'image' | 'images' | 'signature'
  // Visual types
  | 'color' | 'icon' | 'avatar' | 'rating' | 'progress'
  // Status types
  | 'status' | 'priority' | 'label' | 'tags' | 'badge'
  // Advanced types
  | 'relation' | 'lookup' | 'rollup' | 'formula' | 'count'
  // Specialized types
  | 'barcode' | 'qrcode' | 'button' | 'json' | 'autonumber'
  // Location types
  | 'coordinates' | 'timezone' | 'country'

export interface FieldSchema {
  id: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  description?: string
  defaultValue?: any
  options?: Array<{ label: string; value: string; color?: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
  showInList?: boolean
  showInDetail?: boolean
  showInForm?: boolean
  showInCreate?: boolean
  sortable?: boolean
  filterable?: boolean
  width?: number
  order?: number
}

export interface ModuleSchema {
  moduleId: string
  tabId: string
  tableName: string
  primaryKey: string
  displayField: string
  fields: FieldSchema[]
}

// Common field templates
export const commonFields = {
  id: { id: 'id', label: 'ID', type: 'text' as const, showInList: false, showInForm: false },
  name: { id: 'name', label: 'Name', type: 'text' as const, required: true, showInList: true, showInDetail: true, showInForm: true, sortable: true, filterable: true, order: 1 },
  title: { id: 'title', label: 'Title', type: 'text' as const, required: true, showInList: true, showInDetail: true, showInForm: true, sortable: true, filterable: true, order: 1 },
  description: { id: 'description', label: 'Description', type: 'textarea' as const, showInList: false, showInDetail: true, showInForm: true, order: 2 },
  status: { id: 'status', label: 'Status', type: 'status' as const, showInList: true, showInDetail: true, showInForm: true, sortable: true, filterable: true, order: 3 },
  priority: { id: 'priority', label: 'Priority', type: 'priority' as const, showInList: true, showInDetail: true, showInForm: true, sortable: true, filterable: true, order: 4 },
  assignee: { id: 'assignee', label: 'Assignee', type: 'user' as const, showInList: true, showInDetail: true, showInForm: true, filterable: true, order: 5 },
  dueDate: { id: 'due_date', label: 'Due Date', type: 'date' as const, showInList: true, showInDetail: true, showInForm: true, sortable: true, filterable: true, order: 6 },
  tags: { id: 'tags', label: 'Tags', type: 'tags' as const, showInList: true, showInDetail: true, showInForm: true, filterable: true, order: 9 },
  createdAt: { id: 'created_at', label: 'Created', type: 'datetime' as const, showInList: true, showInDetail: true, showInForm: false, sortable: true, order: 98 },
}

export function getSchemaForTab(moduleId: string, tabId: string): ModuleSchema | null {
  const schemaKey = `${moduleId}-${tabId}`
  return DATA_SCHEMAS[schemaKey] || null
}

// Schema registry - will be populated with all module schemas
export const DATA_SCHEMAS: Record<string, ModuleSchema> = {}
