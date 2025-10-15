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
  
  // First check if we have a manually defined schema
  if (DATA_SCHEMAS[schemaKey]) {
    return DATA_SCHEMAS[schemaKey]
  }
  
  // Otherwise, try to convert from form field config
  return convertFormConfigToSchema(moduleId, tabId)
}

/**
 * Convert a form config to a ModuleSchema for use in table views
 * This allows automatic table column generation from form field definitions
 */
import { getFormConfig } from './modules/form-fields-registry'

export function convertFormConfigToSchema(moduleId: string, tabId: string): ModuleSchema | null {
  const formConfig = getFormConfig(moduleId, tabId)
  if (!formConfig) return null
  
  // Convert form fields to FieldSchema, adding order based on array position
  const fields: FieldSchema[] = formConfig.fields.map((field, index) => ({
    ...convertFormFieldToFieldSchema(field),
    order: index + 1
  }))
  
  // Add common system fields if not already present
  const hasId = fields.some(f => f.id === 'id')
  const hasCreatedAt = fields.some(f => f.id === 'created_at')
  
  if (!hasId) {
    fields.unshift(commonFields.id)
  }
  if (!hasCreatedAt) {
    fields.push(commonFields.createdAt)
  }
  
  return {
    moduleId,
    tabId,
    tableName: tabId, // Will be resolved by table mapping
    primaryKey: 'id',
    displayField: fields.find(f => f.id === 'name' || f.id === 'title')?.id || 'id',
    fields
  }
}

// Schema registry - will be populated with all module schemas
export const DATA_SCHEMAS: Record<string, ModuleSchema> = {}

/**
 * Convert FormFieldConfig to FieldSchema for table views
 * This allows us to reuse form field definitions for table columns
 */
import type { FormFieldConfig } from './modules/form-fields-registry'

export function convertFormFieldToFieldSchema(formField: FormFieldConfig): FieldSchema {
  return {
    id: formField.name,
    label: formField.label,
    type: mapFormFieldType(formField.type),
    required: formField.required,
    placeholder: formField.placeholder,
    description: formField.description,
    defaultValue: formField.defaultValue,
    options: formField.options?.map(opt => ({
      label: opt.label,
      value: opt.value,
      color: undefined
    })),
    validation: formField.validation,
    showInList: shouldShowInList(formField.type, formField.name),
    showInDetail: true,
    showInForm: true,
    showInCreate: true,
    sortable: isSortableType(formField.type),
    filterable: isFilterableType(formField.type),
    order: 99, // Will be overridden by field order in array
  }
}

/**
 * Map form field types to FieldSchema types
 */
function mapFormFieldType(formType: string): FieldType {
  const typeMap: Record<string, FieldType> = {
    'text': 'text',
    'textarea': 'textarea',
    'richtext': 'richtext',
    'email': 'email',
    'phone': 'phone',
    'url': 'url',
    'number': 'number',
    'currency': 'currency',
    'percentage': 'percent',
    'date': 'date',
    'datetime': 'datetime',
    'time': 'time',
    'select': 'select',
    'multiselect': 'multiselect',
    'radio': 'radio',
    'checkbox': 'checkbox',
    'switch': 'toggle',
    'file': 'file',
    'color': 'color',
    'rating': 'rating',
    'slider': 'progress',
    'tags': 'tags',
    'autocomplete': 'relation',
    'location': 'location',
    'user': 'user',
    'multiuser': 'users',
  }
  return typeMap[formType] || 'text'
}

/**
 * Determine if field should show in list view by default
 */
function shouldShowInList(type: string, fieldName: string): boolean {
  // Hide these in list view by default
  const hideInList = ['textarea', 'richtext', 'file']
  const hideFields = ['description', 'notes', 'content', 'details']
  
  if (hideInList.includes(type)) return false
  if (hideFields.includes(fieldName.toLowerCase())) return false
  
  return true
}

/**
 * Determine if field type is sortable
 */
function isSortableType(type: string): boolean {
  const sortableTypes = ['text', 'number', 'currency', 'date', 'datetime', 'time', 'percentage']
  return sortableTypes.includes(type)
}

/**
 * Determine if field type is filterable
 */
function isFilterableType(type: string): boolean {
  const filterableTypes = ['text', 'select', 'multiselect', 'checkbox', 'switch', 'tags', 'user', 'multiuser']
  return filterableTypes.includes(type)
}
