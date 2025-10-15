/**
 * Schema Helper Utilities
 * Provides runtime field resolution for schema-driven views
 */

import type { FieldSchema } from './data-schemas'
import type { DataItem } from '@/types'

/**
 * Get the primary display field value from an item based on schema
 * Falls back to common field names if schema not provided
 */
export function getDisplayValue(item: DataItem, schema?: FieldSchema[]): string {
  if (!schema) {
    // Fallback to common field names
    return item.name || item.title || item.description || item.id || 'Untitled'
  }
  
  // Find the primary display field (usually first text field with order 1-3)
  const displayField = schema
    .filter(f => f.showInList && ['text', 'textarea', 'richtext'].includes(f.type))
    .sort((a, b) => (a.order || 99) - (b.order || 99))[0]
  
  if (displayField && item[displayField.id]) {
    return String(item[displayField.id])
  }
  
  // Fallback
  return item.name || item.title || 'Untitled'
}

/**
 * Get the status field value from an item based on schema
 */
export function getStatusValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.status
  }
  
  const statusField = schema.find(f => f.type === 'status' || f.id === 'status')
  return statusField ? item[statusField.id] : item.status
}

/**
 * Get the priority field value from an item based on schema
 */
export function getPriorityValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.priority
  }
  
  const priorityField = schema.find(f => f.type === 'priority' || f.id === 'priority')
  return priorityField ? item[priorityField.id] : item.priority
}

/**
 * Get the assignee field value from an item based on schema
 */
export function getAssigneeValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.assignee || item.assignee_name
  }
  
  const assigneeField = schema.find(f => f.type === 'user' || f.id === 'assignee' || f.id === 'assignee_id')
  return assigneeField ? item[assigneeField.id] : (item.assignee || item.assignee_name)
}

/**
 * Get the primary date field value from an item based on schema
 * Prioritizes due_date, then end_date, then any date field
 */
export function getDateValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.due_date || item.end_date || item.start_date
  }
  
  // Prioritize specific date fields
  const dueDateField = schema.find(f => f.id === 'due_date' || f.id === 'target_date')
  if (dueDateField && item[dueDateField.id]) {
    return item[dueDateField.id]
  }
  
  const endDateField = schema.find(f => f.id === 'end_date' || f.id === 'completion_date')
  if (endDateField && item[endDateField.id]) {
    return item[endDateField.id]
  }
  
  // Find any date field
  const anyDateField = schema.find(f => ['date', 'datetime'].includes(f.type) && f.showInList)
  return anyDateField ? item[anyDateField.id] : item.due_date
}

/**
 * Get the start date field value from an item based on schema
 */
export function getStartDateValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.start_date || item.created_at
  }
  
  const startField = schema.find(f => f.id === 'start_date' || f.id === 'issue_date' || f.id === 'created_at')
  return startField ? item[startField.id] : item.start_date
}

/**
 * Get the end date field value from an item based on schema
 */
export function getEndDateValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.end_date || item.due_date
  }
  
  const endField = schema.find(f => f.id === 'end_date' || f.id === 'due_date' || f.id === 'completion_date')
  return endField ? item[endField.id] : item.end_date
}

/**
 * Get the description field value from an item based on schema
 */
export function getDescriptionValue(item: DataItem, schema?: FieldSchema[]): string | undefined {
  if (!schema) {
    return item.description || item.notes
  }
  
  const descField = schema.find(f => 
    ['textarea', 'richtext', 'markdown'].includes(f.type) || 
    f.id === 'description' || 
    f.id === 'notes'
  )
  return descField ? item[descField.id] : item.description
}

/**
 * Get the grouping field for list/board views based on schema
 * Returns the field ID to group by (defaults to 'status')
 */
export function getGroupingField(schema?: FieldSchema[]): string {
  if (!schema) return 'status'
  
  // Prefer status field
  const statusField = schema.find(f => f.type === 'status')
  if (statusField) return statusField.id
  
  // Fall back to first select field
  const selectField = schema.find(f => f.type === 'select' && f.showInList)
  if (selectField) return selectField.id
  
  return 'status'
}

/**
 * Get list of visible fields for a view type
 */
export function getVisibleFields(schema?: FieldSchema[], viewType: 'list' | 'table' | 'board' = 'list'): FieldSchema[] {
  if (!schema) return []
  
  return schema
    .filter(f => f.showInList !== false && f.id !== 'id')
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .slice(0, viewType === 'list' ? 5 : 10) // Limit fields for performance
}

/**
 * Get the field schema by ID
 */
export function getFieldById(fieldId: string, schema?: FieldSchema[]): FieldSchema | undefined {
  return schema?.find(f => f.id === fieldId)
}

/**
 * Format a field value based on its type
 */
export function formatFieldValue(value: any, field?: FieldSchema): string {
  if (value === null || value === undefined) return '—'
  
  if (!field) return String(value)
  
  switch (field.type) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    
    case 'percent':
      return `${value}%`
    
    case 'date':
      return new Date(value).toLocaleDateString()
    
    case 'datetime':
      return new Date(value).toLocaleString()
    
    case 'toggle':
    case 'checkbox':
      return value ? '✓' : '—'
    
    default:
      return String(value)
  }
}
