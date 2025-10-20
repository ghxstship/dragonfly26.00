/**
 * Design System Helper Functions
 * 
 * Centralized helper functions to replace all hardcoded color/style logic
 * across the 219 custom tab components.
 * 
 * Usage:
 * import { getStatusColor, getPriorityColor, getTypeColor } from '@/lib/design-system'
 * <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
 */

import {
  statusColors,
  priorityColors,
  typeColors,
  categoryColors,
  conditionColors,
  iconBackgroundColors,
  solidBackgroundColors,
  type StatusColor,
  type PriorityColor,
  type TypeColor,
  type CategoryColor,
  type ConditionColor,
} from '@/design-tokens/colors'

// ============================================================================
// STATUS COLORS
// ============================================================================

/**
 * Get status color class for badges and indicators
 * @param status - Status string (active, pending, completed, etc.)
 * @returns Tailwind CSS classes for status badge
 */
export function getStatusColor(status: string | null | undefined): string {
  if (!status) return statusColors.inactive
  
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_') as StatusColor
  return statusColors[normalizedStatus] || statusColors.inactive
}

/**
 * Get status icon based on status type
 * @param status - Status string
 * @returns Lucide icon component
 */
export function getStatusIcon(status: string | null | undefined) {
  const normalizedStatus = status?.toLowerCase().replace(/\s+/g, '_')
  
  // Import icons dynamically to avoid bundle bloat
  const { CheckCircle2, Clock, AlertCircle, XCircle, Package, FileText, Truck } = require('lucide-react')
  
  switch (normalizedStatus) {
    case 'active':
    case 'confirmed':
    case 'completed':
    case 'approved':
    case 'delivered':
      return CheckCircle2
      
    case 'pending':
    case 'tentative':
      return Clock
      
    case 'in_progress':
    case 'processing':
      return Package
      
    case 'under_review':
      return FileText
      
    case 'in_transit':
      return Truck
      
    case 'cancelled':
    case 'rejected':
    case 'failed':
      return XCircle
      
    case 'overdue':
      return AlertCircle
      
    default:
      return Clock
  }
}

// ============================================================================
// PRIORITY COLORS
// ============================================================================

/**
 * Get priority color class for text and icons
 * @param priority - Priority string (high, medium, low, etc.)
 * @returns Tailwind CSS classes for priority indicator
 */
export function getPriorityColor(priority: string | null | undefined): string {
  if (!priority) return priorityColors.none
  
  const normalizedPriority = priority.toLowerCase() as PriorityColor
  return priorityColors[normalizedPriority] || priorityColors.none
}

/**
 * Get priority icon based on priority level
 * @param priority - Priority string
 * @returns Lucide icon component
 */
export function getPriorityIcon(priority: string | null | undefined) {
  const { Flag, AlertCircle, Info } = require('lucide-react')
  
  const normalizedPriority = priority?.toLowerCase()
  
  switch (normalizedPriority) {
    case 'high':
    case 'urgent':
    case 'critical':
      return AlertCircle
      
    case 'medium':
    case 'normal':
      return Flag
      
    case 'low':
    case 'minor':
    case 'none':
    default:
      return Info
  }
}

// ============================================================================
// TYPE COLORS
// ============================================================================

/**
 * Get type color class for badges and labels
 * @param type - Type string (contract, venue, meeting, etc.)
 * @returns Tailwind CSS classes for type indicator
 */
export function getTypeColor(type: string | null | undefined): string {
  if (!type) return typeColors.default
  
  const normalizedType = type.toLowerCase().replace(/\s+/g, '') as TypeColor
  return typeColors[normalizedType] || typeColors.default
}

/**
 * Get type icon based on type category
 * @param type - Type string
 * @returns Lucide icon component
 */
export function getTypeIcon(type: string | null | undefined) {
  const {
    Briefcase, Building, Warehouse, Home, MapPin, Calendar,
    Users, Video, Package, FileText, Music, Lightbulb,
    Plane, Hotel, Car, Receipt
  } = require('lucide-react')
  
  const normalizedType = type?.toLowerCase().replace(/\s+/g, '')
  
  // Employment types
  if (['contract', 'fulltime', 'parttime', 'freelance'].includes(normalizedType || '')) {
    return Briefcase
  }
  
  // Location types
  if (normalizedType === 'venue') return Building
  if (normalizedType === 'warehouse') return Warehouse
  if (normalizedType === 'office') return Home
  if (normalizedType === 'studio') return Building
  if (normalizedType === 'outdoor') return MapPin
  
  // Event types
  if (normalizedType === 'meeting') return Users
  if (normalizedType === 'rehearsal') return Music
  if (normalizedType === 'presentation') return Video
  
  // Travel types
  if (normalizedType === 'flights') return Plane
  if (normalizedType === 'lodging') return Hotel
  if (normalizedType === 'rental_cars') return Car
  
  // Default
  return Package
}

// ============================================================================
// CATEGORY COLORS
// ============================================================================

/**
 * Get category color class for badges and labels
 * @param category - Category string
 * @returns Tailwind CSS classes for category indicator
 */
export function getCategoryColor(category: string | null | undefined): string {
  if (!category) return categoryColors.other
  
  const normalizedCategory = category.toLowerCase().replace(/\s+/g, '_') as CategoryColor
  return categoryColors[normalizedCategory] || categoryColors.other
}

/**
 * Get category icon based on category type
 * @param category - Category string
 * @returns Lucide icon component
 */
export function getCategoryIcon(category: string | null | undefined) {
  const {
    Truck, Wrench, Package, Tag, Shield, Zap,
    Wifi, CreditCard, Plane, Hotel, Car, Receipt,
    Monitor, Palette, Film, FileText
  } = require('lucide-react')
  
  const normalizedCategory = category?.toLowerCase().replace(/\s+/g, '_')
  
  // Site categories
  if (normalizedCategory === 'site_vehicles') return Truck
  if (normalizedCategory === 'heavy_equipment') return Wrench
  if (normalizedCategory === 'site_safety') return Shield
  if (normalizedCategory === 'signage') return Tag
  
  // Infrastructure
  if (normalizedCategory === 'power') return Zap
  if (normalizedCategory === 'network') return Wifi
  
  // Travel
  if (normalizedCategory === 'flights') return Plane
  if (normalizedCategory === 'lodging') return Hotel
  if (normalizedCategory === 'rental_cars') return Car
  if (normalizedCategory === 'meals' || normalizedCategory === 'meals_expense') return Receipt
  
  // File categories
  if (normalizedCategory === 'technical') return Monitor
  if (normalizedCategory === 'design') return Palette
  if (normalizedCategory === 'media') return Film
  if (normalizedCategory === 'documents') return FileText
  
  // Default
  return Package
}

// ============================================================================
// CONDITION COLORS
// ============================================================================

/**
 * Get condition color class for asset condition, health status, etc.
 * @param condition - Condition string (excellent, good, fair, poor)
 * @returns Tailwind CSS classes for condition indicator
 */
export function getConditionColor(condition: string | null | undefined): string {
  if (!condition) return conditionColors.unknown
  
  const normalizedCondition = condition.toLowerCase() as ConditionColor
  return conditionColors[normalizedCondition] || conditionColors.unknown
}

// ============================================================================
// ICON BACKGROUND COLORS
// ============================================================================

/**
 * Get icon background color class
 * @param color - Color name (purple, blue, green, etc.)
 * @returns Tailwind CSS classes for icon background
 */
export function getIconBackgroundColor(color: keyof typeof iconBackgroundColors): string {
  return iconBackgroundColors[color] || iconBackgroundColors.gray
}

/**
 * Get solid background color class
 * @param color - Color name (purple, blue, green, etc.)
 * @returns Tailwind CSS classes for solid background
 */
export function getSolidBackgroundColor(color: keyof typeof solidBackgroundColors): string {
  return solidBackgroundColors[color] || solidBackgroundColors.gray
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format status string for display
 * @param status - Status string
 * @returns Formatted status string
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return 'Unknown'
  return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * Check if status is a success state
 * @param status - Status string
 * @returns True if status is a success state
 */
export function isSuccessStatus(status: string | null | undefined): boolean {
  const successStatuses = ['active', 'confirmed', 'completed', 'approved', 'delivered']
  return successStatuses.includes(status?.toLowerCase() || '')
}

/**
 * Check if status is a warning state
 * @param status - Status string
 * @returns True if status is a warning state
 */
export function isWarningStatus(status: string | null | undefined): boolean {
  const warningStatuses = ['pending', 'tentative', 'under_review', 'processing', 'maintenance']
  return warningStatuses.includes(status?.toLowerCase().replace(/\s+/g, '_') || '')
}

/**
 * Check if status is an error state
 * @param status - Status string
 * @returns True if status is an error state
 */
export function isErrorStatus(status: string | null | undefined): boolean {
  const errorStatuses = ['cancelled', 'rejected', 'overdue', 'failed']
  return errorStatuses.includes(status?.toLowerCase() || '')
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  statusColors,
  priorityColors,
  typeColors,
  categoryColors,
  conditionColors,
  iconBackgroundColors,
  solidBackgroundColors,
}
