/**
 * =====================================================
 * PERMISSION MATRIX - COMPREHENSIVE RBAC MAPPING
 * =====================================================
 */

import type { RoleSlug, AccessLevel } from '@/types/rbac'

type PermissionMatrix = Record<string, Record<RoleSlug, AccessLevel>>

/**
 * Complete permission matrix mapping all 11 roles to all permissions
 * Format: { 'category.permission': { role: accessLevel } }
 */
export const PERMISSION_MATRIX: PermissionMatrix = {
  // Organization Management
  'org.create': { legend: 'full', phantom: 'none', aviator: 'none', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'org.edit': { legend: 'full', phantom: 'full', aviator: 'view', gladiator: 'view', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'org.delete': { legend: 'full', phantom: 'none', aviator: 'none', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'org.view_analytics': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'limited', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'limited', ambassador: 'none' },
  'org.manage_billing': { legend: 'full', phantom: 'full', aviator: 'view', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'org.export_data': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'limited', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // User Management
  'users.invite': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'users.remove': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'users.assign_roles': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'users.view_activity': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'users.manage_permissions': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'users.deactivate': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'limited', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  
  // Project Management
  'projects.create': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'projects.edit': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'projects.delete': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'projects.archive': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'projects.manage_teams': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'projects.view_dashboard': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'limited', deviator: 'limited', raider: 'limited', merchant: 'limited', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'projects.export_data': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // Budget & Finance
  'finance.create_budget': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'finance.edit_budget': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'finance.approve_expenses': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'finance.view_reports': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'finance.process_payments': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'finance.manage_invoices': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'create', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'finance.export_data': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  
  // Scheduling & Timeline
  'scheduling.create': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'scheduling.edit': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'limited', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'scheduling.assign_tasks': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'scheduling.manage_milestones': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'scheduling.view_gantt': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'manage', deviator: 'manage', raider: 'limited', merchant: 'limited', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'scheduling.notifications': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'scheduling.export': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // Resource Management  
  'resources.add': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'resources.edit': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'resources.remove': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'resources.book': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'create', merchant: 'create', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'resources.view_availability': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'resources.approve_requests': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'resources.manage_conflicts': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  
  // Document Management
  'documents.upload': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'create', merchant: 'create', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'documents.download': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'view', ambassador: 'view' },
  'documents.edit': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'manage', raider: 'edit', merchant: 'edit', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'documents.delete': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'documents.share_external': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'documents.manage_versions': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'documents.set_permissions': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  
  // Communication & Collaboration
  'communication.post': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'create', merchant: 'create', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'communication.tag': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'communication.announcements': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'communication.dm': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'communication.participate': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'communication.view_feed': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'full', deviator: 'full', raider: 'view', merchant: 'view', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // Vendor & External Relations
  'vendors.add': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'vendors.edit': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'edit', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'vendors.assign_contracts': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'vendors.review_deliverables': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'manage', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'vendors.approve_payments': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'vendors.view_performance': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // Reporting & Analytics
  'reporting.view_dashboards': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'full', navigator: 'limited', deviator: 'limited', raider: 'limited', merchant: 'limited', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'reporting.create_reports': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'limited', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'none', ambassador: 'none' },
  'reporting.export_data': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  'reporting.view_audit_logs': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'limited', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'reporting.historical_data': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'custom', passenger: 'view', ambassador: 'none' },
  
  // Marketing & Promotional Assets
  'marketing.access_materials': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'full' },
  'marketing.download_content': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'manage', navigator: 'limited', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'full' },
  'marketing.view_guidelines': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'view', navigator: 'view', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'view' },
  'marketing.share_social': { legend: 'full', phantom: 'full', aviator: 'manage', gladiator: 'limited', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'full' },
  'marketing.track_metrics': { legend: 'full', phantom: 'full', aviator: 'full', gladiator: 'limited', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'view' },
  
  // System Administration
  'system.configure': { legend: 'full', phantom: 'limited', aviator: 'none', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'system.integrations': { legend: 'full', phantom: 'manage', aviator: 'limited', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'system.webhooks': { legend: 'full', phantom: 'manage', aviator: 'limited', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'system.notifications': { legend: 'full', phantom: 'manage', aviator: 'limited', gladiator: 'limited', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'system.api': { legend: 'full', phantom: 'manage', aviator: 'none', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
  'system.logs': { legend: 'full', phantom: 'view', aviator: 'none', gladiator: 'none', navigator: 'none', deviator: 'none', raider: 'none', merchant: 'none', visitor: 'none', passenger: 'none', ambassador: 'none' },
}

/**
 * Check if a role has a permission
 */
export function hasPermission(role: RoleSlug, permission: string): boolean {
  const accessLevel = PERMISSION_MATRIX[permission]?.[role]
  return accessLevel !== undefined && accessLevel !== 'none'
}

/**
 * Get access level for a role and permission
 */
export function getAccessLevel(role: RoleSlug, permission: string): AccessLevel {
  return PERMISSION_MATRIX[permission]?.[role] || 'none'
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: RoleSlug): Record<string, AccessLevel> {
  const permissions: Record<string, AccessLevel> = {}
  
  for (const [permission, roles] of Object.entries(PERMISSION_MATRIX)) {
    const accessLevel = roles[role]
    if (accessLevel && accessLevel !== 'none') {
      permissions[permission] = accessLevel
    }
  }
  
  return permissions
}

/**
 * Get all roles that have a specific permission
 */
export function getRolesWithPermission(permission: string): RoleSlug[] {
  const permissionMap = PERMISSION_MATRIX[permission]
  if (!permissionMap) return []
  
  return (Object.entries(permissionMap) as [RoleSlug, AccessLevel][])
    .filter(([_, level]) => level !== 'none')
    .map(([role, _]) => role)
}

/**
 * Compare permission access levels
 */
export function compareAccessLevels(level1: AccessLevel, level2: AccessLevel): number {
  const hierarchy: AccessLevel[] = ['none', 'limited', 'view', 'create', 'edit', 'manage', 'full', 'custom']
  return hierarchy.indexOf(level1) - hierarchy.indexOf(level2)
}

/**
 * Check if access level meets requirement
 */
export function meetsRequirement(actual: AccessLevel, required: AccessLevel): boolean {
  if (actual === 'custom') return true // Custom can be configured to meet any requirement
  return compareAccessLevels(actual, required) >= 0
}
