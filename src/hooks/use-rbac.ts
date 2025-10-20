/**
 * Role-Based Access Control (RBAC) Hook
 * 
 * Provides access to the branded 11-role RBAC system integrated with organizational hierarchy
 * 
 * Roles:
 * 1. Legend - Platform Super Admin
 * 2. Phantom - Organization Super Admin
 * 3. Aviator - Strategic Leader
 * 4. Gladiator - Project Manager
 * 5. Navigator - Department/Area Manager
 * 6. Deviator - Team Lead
 * 7. Raider - Team Member
 * 8. Vendor - External Contractor
 * 9. Visitor - Temporary Custom Access
 * 10. Partner - Read-Only Stakeholder
 * 11. Ambassador - Marketing Affiliate
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// =============================================
// TYPES
// =============================================

export type RoleName = 
  | 'legend'      // Platform Super Admin
  | 'phantom'     // Organization Super Admin
  | 'aviator'     // Strategic Leader
  | 'gladiator'   // Project Manager
  | 'navigator'   // Department/Area Manager
  | 'deviator'    // Team Lead
  | 'raider'      // Team Member
  | 'vendor'      // External Contractor
  | 'visitor'     // Temporary Custom Access
  | 'partner'     // Read-Only Stakeholder
  | 'ambassador'  // Marketing Affiliate

export type RoleScope = 
  | 'platform'
  | 'organization'
  | 'project'
  | 'department'
  | 'team'
  | 'individual'
  | 'external'
  | 'custom'
  | 'observer'
  | 'marketing'

export type AccessLevel = 
  | 'full'
  | 'manage'
  | 'edit'
  | 'create'
  | 'view'
  | 'limited'
  | 'none'
  | 'custom'

export interface Role {
  id: string
  name: RoleName
  level: number
  scope: RoleScope
  description: string
  is_system_role: boolean
  created_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  organization_id: string | null
  project_id: string | null
  department_id: string | null
  team_id: string | null
  expires_at: string | null
  custom_permissions: Record<string, unknown>
  granted_by: string | null
  granted_at: string
  role?: Role
}

export interface Permission {
  id: string
  category: string
  action: string
  resource: string
  description: string
  created_at: string
}

export interface RolePermission {
  id: string
  role_id: string
  permission_id: string
  access_level: AccessLevel
  conditions: Record<string, unknown>
  created_at: string
  permission?: Permission
}

export interface UserPermission {
  category: string
  action: string
  resource: string
  access_level: AccessLevel
}

// =============================================
// ROLE QUERIES
// =============================================

/**
 * Get all available roles
 */
export function useRoles() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('level', { ascending: true })

      if (error) throw error
      return data as Role[]
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Get role by name
 */
export function useRole(roleName: RoleName) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['role', roleName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .eq('name', roleName)
        .single()

      if (error) throw error
      return data as Role
    },
    enabled: !!roleName,
    staleTime: 10 * 60 * 1000,
  })
}

/**
 * Get permissions for a role
 */
export function useRolePermissions(roleId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['role-permissions', roleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select(`
          *,
          permission:permissions(*)
        `)
        .eq('role_id', roleId)

      if (error) throw error
      return data as RolePermission[]
    },
    enabled: !!roleId,
  })
}

// =============================================
// USER ROLE ASSIGNMENTS
// =============================================

/**
 * Get current user's role assignments
 */
export function useMyRoles() {
  const supabase = createClient()

  return useQuery({
    queryKey: ['my-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles(*)
        `)
        .eq('user_id', user.id)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

      if (error) throw error
      return data as UserRole[]
    },
  })
}

/**
 * Get user's role assignments for a specific organization
 */
export function useUserRolesInOrganization(userId: string, organizationId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['user-roles', userId, organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles(*)
        `)
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

      if (error) throw error
      return data as UserRole[]
    },
    enabled: !!userId && !!organizationId,
  })
}

/**
 * Get all users with a specific role in an organization
 */
export function useUsersWithRole(roleName: RoleName, organizationId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['users-with-role', roleName, organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          role:roles!inner(*),
          user:auth.users(*)
        `)
        .eq('roles.name', roleName)
        .eq('organization_id', organizationId)
        .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)

      if (error) throw error
      return data
    },
    enabled: !!roleName && !!organizationId,
  })
}

// =============================================
// PERMISSION CHECKS
// =============================================

/**
 * Check if current user has a specific permission
 */
export function useHasPermission(
  category: string,
  action: string,
  entityType?: string,
  entityId?: string
) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['has-permission', category, action, entityType, entityId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { data, error } = await supabase
        .rpc('user_has_permission', {
          user_uuid: user.id,
          permission_category: category,
          permission_action: action,
          entity_type: entityType || null,
          entity_uuid: entityId || null,
        })

      if (error) throw error
      return data as boolean
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get all effective permissions for current user on an entity
 */
export function useUserPermissions(entityType: string, entityId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['user-permissions', entityType, entityId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .rpc('get_user_permissions', {
          user_uuid: user.id,
          entity_type: entityType,
          entity_uuid: entityId,
        })

      if (error) throw error
      return data as UserPermission[]
    },
    enabled: !!entityType && !!entityId,
  })
}

/**
 * Check if current user has any of the specified roles
 */
export function useHasRole(...roleNames: RoleName[]) {
  const { data: myRoles } = useMyRoles()

  return {
    hasRole: myRoles?.some(ur => roleNames.includes(ur.role?.name as RoleName)) ?? false,
    roles: myRoles,
  }
}

/**
 * Check if current user is Legend (Platform Super Admin)
 */
export function useIsLegend() {
  return useHasRole('legend')
}

/**
 * Check if current user is Phantom (Organization Super Admin) in any organization
 */
export function useIsPhantom() {
  return useHasRole('phantom')
}

/**
 * Get highest role level for current user
 */
export function useHighestRoleLevel() {
  const { data: myRoles } = useMyRoles()

  const highestLevel = myRoles?.reduce((min, ur) => {
    const level = ur.role?.level ?? Infinity
    return level < min ? level : min
  }, Infinity)

  return {
    level: highestLevel === Infinity ? null : highestLevel,
    isLegend: highestLevel === 1,
    isPhantom: highestLevel === 2,
    isAviator: highestLevel === 3,
    isGladiator: highestLevel === 4,
  }
}

// =============================================
// ROLE ASSIGNMENT MUTATIONS
// =============================================

/**
 * Assign a role to a user
 */
export function useAssignRole() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      userId,
      roleName,
      organizationId,
      projectId,
      departmentId,
      teamId,
      expiresAt,
      customPermissions,
    }: {
      userId: string
      roleName: RoleName
      organizationId?: string
      projectId?: string
      departmentId?: string
      teamId?: string
      expiresAt?: string
      customPermissions?: Record<string, unknown>
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get role ID
      const { data: role, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single()

      if (roleError) throw roleError

      // Assign role
      const { data, error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role_id: role.id,
          organization_id: organizationId || null,
          project_id: projectId || null,
          department_id: departmentId || null,
          team_id: teamId || null,
          expires_at: expiresAt || null,
          custom_permissions: customPermissions || {},
          granted_by: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-roles', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['my-roles'] })
    },
  })
}

/**
 * Remove a role from a user
 */
export function useRemoveRole() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (userRoleId: string) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('id', userRoleId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] })
      queryClient.invalidateQueries({ queryKey: ['my-roles'] })
    },
  })
}

/**
 * Update role assignment (e.g., extend expiration for Visitor)
 */
export function useUpdateRoleAssignment() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({
      userRoleId,
      expiresAt,
      customPermissions,
    }: {
      userRoleId: string
      expiresAt?: string
      customPermissions?: Record<string, unknown>
    }) => {
      const updates: Record<string, unknown> = {}
      if (expiresAt !== undefined) updates.expires_at = expiresAt
      if (customPermissions !== undefined) updates.custom_permissions = customPermissions

      const { data, error } = await supabase
        .from('user_roles')
        .update(updates)
        .eq('id', userRoleId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roles'] })
      queryClient.invalidateQueries({ queryKey: ['my-roles'] })
    },
  })
}

// =============================================
// UTILITY FUNCTIONS
// =============================================

/**
 * Get role display name
 */
export function getRoleDisplayName(roleName: RoleName): string {
  const names: Record<RoleName, string> = {
    legend: 'Legend',
    phantom: 'Phantom',
    aviator: 'Aviator',
    gladiator: 'Gladiator',
    navigator: 'Navigator',
    deviator: 'Deviator',
    raider: 'Raider',
    vendor: 'Vendor',
    visitor: 'Visitor',
    partner: 'Partner',
    ambassador: 'Ambassador',
  }
  return names[roleName] || roleName
}

/**
 * Get role description
 */
export function getRoleDescription(roleName: RoleName): string {
  const descriptions: Record<RoleName, string> = {
    legend: 'Platform Super Admin - Ultimate authority across all organizations',
    phantom: 'Organization Super Admin - Full control within assigned organizations',
    aviator: 'Strategic Leader - Full access to assigned projects, cross-project reporting',
    gladiator: 'Project Manager - Full access to assigned projects, team assignment, budget approval',
    navigator: 'Department/Area Manager - Manage assigned department/zone within project',
    deviator: 'Team Lead - Manage assigned team, task assignment, team scheduling',
    raider: 'Team Member - Edit access to assigned tasks and deliverables',
    vendor: 'External Contractor - Limited access to vendor-specific project areas',
    visitor: 'Temporary Custom Access - Configurable permissions with expiration',
    partner: 'Read-Only Stakeholder - View-only access to assigned project elements',
    ambassador: 'Marketing Affiliate - Access only to marketing and promotional content',
  }
  return descriptions[roleName] || ''
}

/**
 * Get role color for UI
 */
export function getRoleColor(roleName: RoleName): string {
  const colors: Record<RoleName, string> = {
    legend: 'purple',
    phantom: 'red',
    aviator: 'blue',
    gladiator: 'green',
    navigator: 'yellow',
    deviator: 'orange',
    raider: 'gray',
    vendor: 'cyan',
    visitor: 'pink',
    partner: 'indigo',
    ambassador: 'teal',
  }
  return colors[roleName] || 'gray'
}

/**
 * Check if role requires expiration
 */
export function roleRequiresExpiration(roleName: RoleName): boolean {
  return roleName === 'visitor' || roleName === 'partner'
}

/**
 * Get recommended expiration for role
 */
export function getRecommendedExpiration(roleName: RoleName): Date | null {
  const now = new Date()
  switch (roleName) {
    case 'visitor':
      // 30 days for visitors
      return new Date(now.setDate(now.getDate() + 30))
    case 'partner':
      // 90 days for partners
      return new Date(now.setDate(now.getDate() + 90))
    default:
      return null
  }
}
