/**
 * =====================================================
 * BRANDED RBAC SYSTEM - TYPESCRIPT TYPES
 * =====================================================
 * Type definitions for the comprehensive role-based
 * access control system
 * =====================================================
 */

// =====================================================
// ROLE TYPES
// =====================================================

/**
 * Branded role slugs - 11 distinct roles
 */
export type RoleSlug =
  | 'legend'      // Level 1: Platform super admin
  | 'phantom'     // Level 2: Organization super admin
  | 'aviator'     // Level 3: Strategic leader
  | 'gladiator'   // Level 4: Project manager
  | 'navigator'   // Level 5: Department manager
  | 'deviator'    // Level 6: Team lead
  | 'raider'      // Level 7: Team member
  | 'merchant'    // Level 8: External contractor
  | 'visitor'     // Level 9: Temporary custom access
  | 'passenger'   // Level 10: Read-only stakeholder
  | 'ambassador'  // Level 11: Marketing affiliate

/**
 * Role scope types
 */
export type RoleScope = 
  | 'platform'      // Platform-wide access (Legend)
  | 'organization'  // Organization-wide access (Phantom, Aviator)
  | 'project'       // Project-level access (Gladiator, Navigator)
  | 'team'          // Team-level access (Deviator, Raider)
  | 'custom'        // Custom scope (Merchant, Visitor, Passenger, Ambassador)

/**
 * Role definition interface
 */
export interface Role {
  id: string
  slug: RoleSlug
  name: string
  description: string
  level: number
  scope: RoleScope
  isSystem: boolean
  canBeTimeLimited: boolean
  color: string
  icon: string
  createdAt: string
  updatedAt: string
}

/**
 * Role metadata for UI display
 */
export interface RoleMetadata {
  slug: RoleSlug
  name: string
  description: string
  level: number
  scope: RoleScope
  color: string
  icon: string
  badge: string // Display badge text
  capabilities: string[] // Key capabilities for UI
}

// =====================================================
// PERMISSION TYPES
// =====================================================

/**
 * Permission category slugs - 12 categories
 */
export type PermissionCategorySlug =
  | 'organization'    // Organization Management
  | 'users'          // User Management
  | 'projects'       // Project Management
  | 'finance'        // Budget & Finance
  | 'scheduling'     // Scheduling & Timeline
  | 'resources'      // Resource Management
  | 'documents'      // Document Management
  | 'communication'  // Communication & Collaboration
  | 'vendors'        // Vendor & External Relations
  | 'reporting'      // Reporting & Analytics
  | 'marketing'      // Marketing & Promotional Assets
  | 'system'         // System Administration

/**
 * Access levels for permissions
 */
export type AccessLevel =
  | 'full'     // Create, read, update, delete, manage all aspects
  | 'manage'   // Create, read, update, delete within assigned scope
  | 'edit'     // Read and update existing records
  | 'create'   // Read and create new records (cannot edit others')
  | 'view'     // Read-only access
  | 'limited'  // Restricted view (only assigned items or filtered data)
  | 'none'     // No access
  | 'custom'   // Configurable per-instance (for Visitor role)

/**
 * Permission category interface
 */
export interface PermissionCategory {
  id: string
  slug: PermissionCategorySlug
  name: string
  description: string
  sortOrder: number
  icon: string
  createdAt: string
}

/**
 * Permission interface
 */
export interface Permission {
  id: string
  categoryId: string
  slug: string
  name: string
  description: string
  sortOrder: number
  createdAt: string
}

/**
 * Role permission mapping
 */
export interface RolePermission {
  id: string
  roleId: string
  permissionId: string
  accessLevel: AccessLevel
  createdAt: string
}

// =====================================================
// USER ROLE ASSIGNMENT TYPES
// =====================================================

/**
 * User role assignment interface
 */
export interface UserRoleAssignment {
  id: string
  userId: string
  roleId: string
  workspaceId: string
  
  // Scope fields
  organizationId?: string
  projectId?: string
  teamId?: string
  departmentId?: string
  
  // Time-limited access
  validFrom: string
  validUntil?: string
  isActive: boolean
  
  // Custom permissions (for Visitor role)
  customPermissions?: Record<string, AccessLevel>
  
  // Metadata
  assignedBy?: string
  assignedAt: string
  notes?: string
  
  createdAt: string
  updatedAt: string
}

/**
 * Role assignment with populated role data
 */
export interface UserRoleAssignmentWithRole extends UserRoleAssignment {
  role: Role
}

/**
 * Role assignment scope information
 */
export interface RoleAssignmentScope {
  workspaceId: string
  organizationId?: string
  projectId?: string
  teamId?: string
  departmentId?: string
}

// =====================================================
// PERMISSION CHECK TYPES
// =====================================================

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  hasPermission: boolean
  accessLevel: AccessLevel
  roleLevel: number
  roleName: string
  source: 'direct' | 'inherited' | 'custom'
}

/**
 * Permission check options
 */
export interface PermissionCheckOptions {
  workspaceId?: string
  organizationId?: string
  projectId?: string
  teamId?: string
  requiredLevel?: AccessLevel
}

/**
 * Bulk permission check result
 */
export interface BulkPermissionCheck {
  [permissionSlug: string]: PermissionCheckResult
}

// =====================================================
// ROLE HIERARCHY TYPES
// =====================================================

/**
 * Role hierarchy relationship
 */
export interface RoleHierarchy {
  parentRoleId: string
  childRoleId: string
  inheritsPermissions: boolean
  createdAt: string
}

/**
 * Role with hierarchy information
 */
export interface RoleWithHierarchy extends Role {
  parentRoles: Role[]
  childRoles: Role[]
  inheritedPermissions: RolePermission[]
}

// =====================================================
// PERMISSION MATRIX TYPES
// =====================================================

/**
 * Permission matrix row (one permission across all roles)
 */
export interface PermissionMatrixRow {
  permission: Permission
  category: PermissionCategory
  accessByRole: Record<RoleSlug, AccessLevel>
}

/**
 * Full permission matrix
 */
export interface PermissionMatrix {
  categories: PermissionCategory[]
  permissions: Permission[]
  roles: Role[]
  matrix: PermissionMatrixRow[]
}

// =====================================================
// ROLE ASSIGNMENT FORM TYPES
// =====================================================

/**
 * Form data for assigning a role to a user
 */
export interface AssignRoleFormData {
  userId: string
  roleSlug: RoleSlug
  workspaceId: string
  
  // Scope (required for certain roles)
  organizationId?: string
  projectId?: string
  teamId?: string
  departmentId?: string
  
  // Time limits (for Visitor and Passenger roles)
  validFrom?: Date
  validUntil?: Date
  
  // Custom permissions (for Visitor role)
  customPermissions?: Record<string, AccessLevel>
  
  // Notes
  notes?: string
}

/**
 * Form data for updating a role assignment
 */
export interface UpdateRoleAssignmentFormData {
  isActive?: boolean
  validUntil?: Date
  customPermissions?: Record<string, AccessLevel>
  notes?: string
}

// =====================================================
// UI DISPLAY TYPES
// =====================================================

/**
 * Role card data for UI display
 */
export interface RoleCardData {
  role: Role
  memberCount: number
  permissions: {
    category: string
    granted: number
    total: number
  }[]
  capabilities: string[]
}

/**
 * User with roles for display
 */
export interface UserWithRoles {
  id: string
  email: string
  name?: string
  avatar?: string
  roles: UserRoleAssignmentWithRole[]
  highestRole: Role
  permissions: string[]
}

/**
 * Role comparison data
 */
export interface RoleComparison {
  roles: Role[]
  permissionDiffs: {
    permission: Permission
    levels: Record<RoleSlug, AccessLevel>
  }[]
}

// =====================================================
// HELPER TYPES
// =====================================================

/**
 * Permission requirement for a feature/action
 */
export interface PermissionRequirement {
  permissionSlug: string
  minimumLevel: AccessLevel
  scope?: RoleAssignmentScope
}

/**
 * Role constraint (for validating role assignments)
 */
export interface RoleConstraint {
  requiresScope: ('organization' | 'project' | 'team' | 'department')[]
  canBeTimeLimited: boolean
  allowCustomPermissions: boolean
  maximumDuration?: number // in days
}

/**
 * Audit log entry for role changes
 */
export interface RoleAuditLog {
  id: string
  action: 'assigned' | 'removed' | 'modified' | 'expired'
  userId: string
  roleId: string
  changes: Record<string, unknown>
  performedBy: string
  timestamp: string
  notes?: string
}

// =====================================================
// VALIDATION TYPES
// =====================================================

/**
 * Role assignment validation result
 */
export interface RoleAssignmentValidation {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Permission conflict detection
 */
export interface PermissionConflict {
  userId: string
  permission: Permission
  conflictingRoles: Role[]
  resolution: 'highest' | 'custom' | 'manual'
}

// =====================================================
// EXPORT ALL
// =====================================================

export type {
  // Re-export for convenience
  RoleSlug as BrandedRole,
  AccessLevel as PermissionLevel,
}
