/**
 * Design Tokens: Colors
 * 
 * Centralized color system extracted from all 219 custom tab components.
 * All color classes follow Tailwind CSS conventions with dark mode support.
 * 
 * Usage:
 * import { statusColors, priorityColors, typeColors } from '@/design-tokens/colors'
 * <Badge className={statusColors.active}>Active</Badge>
 */

// ============================================================================
// STATUS COLORS
// ============================================================================

export const statusColors = {
  // Active/Success states
  active: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
  
  // Pending/Warning states
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
  tentative: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
  under_review: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
  processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
  maintenance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400',
  
  // In Progress states
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
  in_transit: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
  
  // Error/Cancelled states
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
  
  // Inactive/Neutral states
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
  
  // Purple states
  subscribed: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
  leased: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-400',
} as const

// ============================================================================
// PRIORITY COLORS
// ============================================================================

export const priorityColors = {
  high: 'text-red-600',
  urgent: 'text-red-600',
  critical: 'text-red-600',
  
  medium: 'text-yellow-600',
  normal: 'text-yellow-600',
  
  low: 'text-green-600',
  minor: 'text-green-600',
  
  none: 'text-gray-600',
} as const

// ============================================================================
// TYPE COLORS (by category)
// ============================================================================

export const typeColors = {
  // Employment/Contract types
  contract: 'text-blue-600',
  fulltime: 'text-purple-600',
  parttime: 'text-green-600',
  freelance: 'text-orange-600',
  
  // Location types
  venue: 'text-purple-600',
  warehouse: 'text-blue-600',
  office: 'text-green-600',
  studio: 'text-orange-600',
  outdoor: 'text-yellow-600',
  stage: 'text-red-600',
  
  // Event types
  meeting: 'text-blue-600',
  rehearsal: 'text-purple-600',
  logistics: 'text-orange-600',
  checkin: 'text-green-600',
  presentation: 'text-red-600',
  production: 'text-purple-600',
  sitevisit: 'text-blue-600',
  
  // Asset types
  owned: 'text-green-600',
  rented: 'text-blue-600',
  leased: 'text-purple-600',
  
  // Document types
  document: 'text-blue-600',
  spreadsheet: 'text-green-600',
  design: 'text-purple-600',
  video: 'text-red-600',
  archive: 'text-orange-600',
  
  // Report types
  custom: 'text-purple-600',
  subscribed: 'text-blue-600',
  shared: 'text-green-600',
  
  // Generic fallback
  default: 'text-gray-600',
} as const

// ============================================================================
// CATEGORY COLORS (for asset categories, etc.)
// ============================================================================

export const categoryColors = {
  // Site categories
  site_infrastructure: 'text-gray-600',
  site_services: 'text-blue-600',
  site_safety: 'text-red-600',
  site_vehicles: 'text-orange-600',
  heavy_equipment: 'text-yellow-600',
  consumables: 'text-purple-600',
  event_rentals: 'text-green-600',
  signage: 'text-pink-600',
  backline: 'text-indigo-600',
  
  // Access categories
  access: 'text-cyan-600',
  credentials: 'text-teal-600',
  parking: 'text-slate-600',
  
  // Travel categories
  meals: 'text-amber-600',
  flights: 'text-sky-600',
  lodging: 'text-violet-600',
  rental_cars: 'text-emerald-600',
  
  // Expense categories
  equipment: 'text-purple-600',
  travel: 'text-blue-600',
  meals_expense: 'text-green-600',
  software: 'text-cyan-600',
  
  // File categories
  technical: 'text-purple-600',
  design: 'text-blue-600',
  media: 'text-red-600',
  assets: 'text-green-600',
  other: 'text-gray-600',
  
  // Report categories
  performance: 'text-purple-600',
  financial: 'text-green-600',
  assets_report: 'text-blue-600',
  travel_report: 'text-cyan-600',
} as const

// ============================================================================
// CONDITION COLORS (for asset condition, health status, etc.)
// ============================================================================

export const conditionColors = {
  excellent: 'text-green-600',
  good: 'text-blue-600',
  fair: 'text-yellow-600',
  poor: 'text-red-600',
  unknown: 'text-gray-600',
} as const

// ============================================================================
// ICON BACKGROUND COLORS
// ============================================================================

export const iconBackgroundColors = {
  purple: 'bg-purple-100 dark:bg-purple-950',
  blue: 'bg-blue-100 dark:bg-blue-950',
  green: 'bg-green-100 dark:bg-green-950',
  red: 'bg-red-100 dark:bg-red-950',
  orange: 'bg-orange-100 dark:bg-orange-950',
  yellow: 'bg-yellow-100 dark:bg-yellow-950',
  cyan: 'bg-cyan-100 dark:bg-cyan-950',
  gray: 'bg-gray-100 dark:bg-gray-950',
} as const

// ============================================================================
// SOLID BACKGROUND COLORS (for widgets, badges, etc.)
// ============================================================================

export const solidBackgroundColors = {
  purple: 'bg-purple-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  gray: 'bg-gray-500',
} as const

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type StatusColor = keyof typeof statusColors
export type PriorityColor = keyof typeof priorityColors
export type TypeColor = keyof typeof typeColors
export type CategoryColor = keyof typeof categoryColors
export type ConditionColor = keyof typeof conditionColors
export type IconBackgroundColor = keyof typeof iconBackgroundColors
export type SolidBackgroundColor = keyof typeof solidBackgroundColors
