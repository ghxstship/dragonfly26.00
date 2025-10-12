/**
 * =====================================================
 * PERMISSION SERVICE - Role & Permission Management
 * =====================================================
 * Centralized service for checking permissions and
 * managing role assignments
 * =====================================================
 */

import { createClient } from '@/lib/supabase/client'
import type {
  RoleSlug,
  AccessLevel,
  UserRoleAssignment,
  PermissionCheckResult,
  PermissionCheckOptions,
} from '@/types/rbac'
import { PERMISSION_MATRIX, getAccessLevel, meetsRequirement } from './permission-matrix'
import { getRoleLevel, compareRoleLevels } from './role-definitions'

/**
 * Permission Service Class
 */
export class PermissionService {
  private supabase = createClient()

  /**
   * Check if user has a specific permission
   */
  async hasPermission(
    userId: string,
    permissionSlug: string,
    options: PermissionCheckOptions = {}
  ): Promise<boolean> {
    const result = await this.checkPermission(userId, permissionSlug, options)
    return result.hasPermission
  }

  /**
   * Check permission with detailed result
   */
  async checkPermission(
    userId: string,
    permissionSlug: string,
    options: PermissionCheckOptions = {}
  ): Promise<PermissionCheckResult> {
    // Get user's active role assignments
    const assignments = await this.getUserRoleAssignments(userId, options)

    if (assignments.length === 0) {
      return {
        hasPermission: false,
        accessLevel: 'none',
        roleLevel: 999,
        roleName: 'None',
        source: 'direct',
      }
    }

    // Find the highest access level granted by any role
    let highestLevel: AccessLevel = 'none'
    let grantingRole: (typeof assignments)[0] | null = null

    for (const assignment of assignments) {
      if (!assignment.role?.slug) continue
      const roleSlug = assignment.role.slug as RoleSlug

      // Check custom permissions first (for Visitor role)
      if (assignment.customPermissions && assignment.customPermissions[permissionSlug]) {
        const customLevel = assignment.customPermissions[permissionSlug]
        if (meetsRequirement(customLevel, options.requiredLevel || 'view')) {
          return {
            hasPermission: true,
            accessLevel: customLevel,
            roleLevel: getRoleLevel(roleSlug),
            roleName: assignment.role.name,
            source: 'custom',
          }
        }
      }

      // Check role's standard permissions
      const accessLevel = getAccessLevel(roleSlug, permissionSlug)
      
      if (accessLevel !== 'none' && (!grantingRole || this.isHigherAccessLevel(accessLevel, highestLevel))) {
        highestLevel = accessLevel
        grantingRole = assignment
      }
    }

    if (!grantingRole || highestLevel === 'none') {
      return {
        hasPermission: false,
        accessLevel: 'none',
        roleLevel: 999,
        roleName: 'None',
        source: 'direct',
      }
    }

    const hasRequiredLevel = !options.requiredLevel || meetsRequirement(highestLevel, options.requiredLevel)

    return {
      hasPermission: hasRequiredLevel,
      accessLevel: highestLevel,
      roleLevel: getRoleLevel(grantingRole.role.slug as RoleSlug),
      roleName: grantingRole.role.name,
      source: 'direct',
    }
  }

  /**
   * Get user's role assignments with scope filtering
   */
  private async getUserRoleAssignments(
    userId: string,
    options: PermissionCheckOptions = {}
  ): Promise<Array<UserRoleAssignment & { role: { id: string; slug: RoleSlug; name: string } }>> {
    let query = this.supabase
      .from('user_role_assignments')
      .select(`
        *,
        role:role_id (*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .or('valid_until.is.null,valid_until.gt.now()')

    if (options.workspaceId) {
      query = query.eq('workspace_id', options.workspaceId)
    }

    if (options.organizationId) {
      query = query.or(`organization_id.eq.${options.organizationId},organization_id.is.null`)
    }

    if (options.projectId) {
      query = query.or(`project_id.eq.${options.projectId},project_id.is.null`)
    }

    if (options.teamId) {
      query = query.or(`team_id.eq.${options.teamId},team_id.is.null`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching user roles:', error)
      return []
    }

    return data || []
  }

  /**
   * Get user's highest role level
   */
  async getUserHighestRoleLevel(userId: string, workspaceId?: string): Promise<number> {
    const assignments = await this.getUserRoleAssignments(userId, { workspaceId })
    
    if (assignments.length === 0) return 999

    return Math.min(...assignments.map(a => getRoleLevel(a.role.slug as RoleSlug)))
  }

  /**
   * Check if user has a role
   */
  async hasRole(userId: string, roleSlug: RoleSlug, workspaceId?: string): Promise<boolean> {
    const assignments = await this.getUserRoleAssignments(userId, { workspaceId })
    return assignments.some(a => a.role.slug === roleSlug)
  }

  /**
   * Check if user has a role at or above a certain level
   */
  async hasRoleLevel(userId: string, minimumLevel: number, workspaceId?: string): Promise<boolean> {
    const userLevel = await this.getUserHighestRoleLevel(userId, workspaceId)
    return userLevel <= minimumLevel // Lower number = higher role
  }

  /**
   * Assign role to user
   */
  async assignRole(
    userId: string,
    roleSlug: RoleSlug,
    assignedBy: string,
    options: {
      workspaceId: string
      organizationId?: string
      projectId?: string
      teamId?: string
      departmentId?: string
      validUntil?: Date
      customPermissions?: Record<string, AccessLevel>
      notes?: string
    }
  ): Promise<{ success: boolean; error?: string }> {
    // Get role ID
    const { data: role, error: roleError } = await this.supabase
      .from('roles')
      .select('id, slug, can_be_time_limited')
      .eq('slug', roleSlug)
      .single()

    if (roleError || !role) {
      return { success: false, error: 'Role not found' }
    }

    // Validate time limit
    if (options.validUntil && !role.can_be_time_limited) {
      return { success: false, error: 'This role cannot have time limits' }
    }

    // Insert role assignment
    const { error: insertError } = await this.supabase
      .from('user_role_assignments')
      .insert({
        user_id: userId,
        role_id: role.id,
        workspace_id: options.workspaceId,
        organization_id: options.organizationId,
        project_id: options.projectId,
        team_id: options.teamId,
        department_id: options.departmentId,
        valid_until: options.validUntil?.toISOString(),
        custom_permissions: options.customPermissions,
        assigned_by: assignedBy,
        notes: options.notes,
      })

    if (insertError) {
      console.error('Error assigning role:', insertError)
      return { success: false, error: insertError.message }
    }

    return { success: true }
  }

  /**
   * Remove role from user
   */
  async removeRole(assignmentId: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await this.supabase
      .from('user_role_assignments')
      .update({ is_active: false })
      .eq('id', assignmentId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  /**
   * Update role assignment
   */
  async updateRoleAssignment(
    assignmentId: string,
    updates: {
      validUntil?: Date
      customPermissions?: Record<string, AccessLevel>
      isActive?: boolean
      notes?: string
    }
  ): Promise<{ success: boolean; error?: string }> {
    const updateData: any = {}
    
    if (updates.validUntil !== undefined) {
      updateData.valid_until = updates.validUntil?.toISOString()
    }
    if (updates.customPermissions !== undefined) {
      updateData.custom_permissions = updates.customPermissions
    }
    if (updates.isActive !== undefined) {
      updateData.is_active = updates.isActive
    }
    if (updates.notes !== undefined) {
      updateData.notes = updates.notes
    }

    const { error } = await this.supabase
      .from('user_role_assignments')
      .update(updateData)
      .eq('id', assignmentId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  /**
   * Helper: Compare access levels
   */
  private isHigherAccessLevel(level1: AccessLevel, level2: AccessLevel): boolean {
    const hierarchy: AccessLevel[] = ['none', 'limited', 'view', 'create', 'edit', 'manage', 'full', 'custom']
    return hierarchy.indexOf(level1) > hierarchy.indexOf(level2)
  }

  /**
   * Get all permissions for a user
   */
  async getUserPermissions(
    userId: string,
    workspaceId?: string
  ): Promise<Record<string, AccessLevel>> {
    const assignments = await this.getUserRoleAssignments(userId, { workspaceId })
    
    const permissions: Record<string, AccessLevel> = {}

    // Aggregate permissions from all roles
    for (const permission of Object.keys(PERMISSION_MATRIX)) {
      let highestLevel: AccessLevel = 'none'

      for (const assignment of assignments) {
        const roleSlug = assignment.role?.slug as RoleSlug
        if (!roleSlug) continue

        // Check custom permissions
        if (assignment.customPermissions?.[permission]) {
          const customLevel = assignment.customPermissions[permission]
          if (this.isHigherAccessLevel(customLevel, highestLevel)) {
            highestLevel = customLevel
          }
        }

        // Check role permissions
        const roleLevel = getAccessLevel(roleSlug, permission)
        if (this.isHigherAccessLevel(roleLevel, highestLevel)) {
          highestLevel = roleLevel
        }
      }

      if (highestLevel !== 'none') {
        permissions[permission] = highestLevel
      }
    }

    return permissions
  }
}

/**
 * Singleton instance
 */
export const permissionService = new PermissionService()

/**
 * Convenience hooks for React components
 */
export function usePermission() {
  return permissionService
}
