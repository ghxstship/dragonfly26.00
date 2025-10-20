/**
 * Organizational Hierarchy Hook
 * 
 * Provides access to the 5-level organizational hierarchy:
 * Organization → Projects → Productions → Activations → Workspace
 * 
 * Example: Insomniac → Festivals → EDC → EDC Las Vegas 2025 → Kinetic Field → Site Operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// =============================================
// TYPES
// =============================================

export interface Project {
  id: string
  organization_id: string
  name: string
  code: string | null
  description: string | null
  type: 'festivals' | 'tours' | 'concerts' | 'activations' | 'campaigns' | 'film_tv' | 'theater' | 'corporate' | 'community' | 'other'
  status: 'draft' | 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled' | 'archived'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  start_date: string | null
  end_date: string | null
  project_lead_id: string | null
  executive_sponsor_id: string | null
  total_budget: number | null
  budget_currency: string
  tags: string[]
  metadata: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface Activation {
  id: string
  production_id: string
  name: string
  code: string | null
  description: string | null
  type: 'event' | 'campaign' | 'experience' | 'installation' | 'popup' | 'tour_stop' | 'festival_edition' | 'show' | 'activation' | 'other'
  status: 'draft' | 'planning' | 'active' | 'in_progress' | 'completed' | 'cancelled' | 'archived'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  start_date: string | null
  end_date: string | null
  venue_id: string | null
  location_details: Record<string, unknown>
  activation_manager_id: string | null
  budget: number | null
  budget_spent: number
  budget_currency: string
  expected_attendance: number | null
  actual_attendance: number | null
  capacity: number | null
  tags: string[]
  metadata: Record<string, unknown>
  created_by: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface HierarchyPath {
  organization_id: string
  organization_name: string
  project_id: string | null
  project_name: string | null
  production_id: string | null
  production_name: string | null
  activation_id: string | null
  activation_name: string | null
  workspace_id: string
  workspace_name: string
}

export interface ProjectSummary {
  id: string
  organization_id: string
  name: string
  status: string
  priority: string
  production_count: number
  activation_count: number
  workspace_count: number
  total_budget: number
  total_spent: number
  team_member_count: number
}

export interface BudgetRollup {
  total_budget: number
  total_spent: number
  remaining: number
  percent_spent: number
}

export interface TeamMember {
  user_id: string
  role: string
  level: string
}

// =============================================
// HIERARCHY NAVIGATION
// =============================================

/**
 * Get complete hierarchy path for a workspace
 */
export function useHierarchyPath(workspaceId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['hierarchy-path', workspaceId],
    queryFn: async () => {
      if (!workspaceId) return null

      const { data, error } = await supabase
        .rpc('get_workspace_hierarchy', { workspace_uuid: workspaceId })
        .single()

      if (error) throw error
      return data as HierarchyPath
    },
    enabled: !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Get all workspaces under a given entity
 */
export function useHierarchyWorkspaces(entityType: 'organization' | 'project' | 'production' | 'activation', entityId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['hierarchy-workspaces', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_hierarchy_workspaces', { 
          entity_type: entityType,
          entity_uuid: entityId 
        })

      if (error) throw error
      return data as { workspace_id: string }[]
    },
    enabled: !!entityId,
    staleTime: 5 * 60 * 1000,
  })
}

// =============================================
// PROJECTS (Level 2)
// =============================================

/**
 * Get all projects for an organization
 */
export function useProjects(organizationId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['projects', organizationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('organization_id', organizationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Project[]
    },
    enabled: !!organizationId,
  })
}

/**
 * Get project summary with rollup metrics
 */
export function useProjectSummary(projectId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['project-summary', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_summary')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data as ProjectSummary
    },
    enabled: !!projectId,
  })
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (project: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert(project)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.organization_id] })
    },
  })
}

/**
 * Update a project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Project
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects', data.organization_id] })
      queryClient.invalidateQueries({ queryKey: ['project-summary', data.id] })
    },
  })
}

// =============================================
// ACTIVATIONS (Level 4)
// =============================================

/**
 * Get all activations for a production
 */
export function useActivations(productionId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['activations', productionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activations')
        .select('*')
        .eq('production_id', productionId)
        .is('deleted_at', null)
        .order('start_date', { ascending: false })

      if (error) throw error
      return data as Activation[]
    },
    enabled: !!productionId,
  })
}

/**
 * Create a new activation
 */
export function useCreateActivation() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async (activation: Partial<Activation>) => {
      const { data, error } = await supabase
        .from('activations')
        .insert(activation)
        .select()
        .single()

      if (error) throw error
      return data as Activation
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activations', data.production_id] })
    },
  })
}

/**
 * Update an activation
 */
export function useUpdateActivation() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Activation> & { id: string }) => {
      const { data, error } = await supabase
        .from('activations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Activation
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['activations', data.production_id] })
    },
  })
}

// =============================================
// BUDGET ROLLUP
// =============================================

/**
 * Get budget rollup for any entity in hierarchy
 */
export function useBudgetRollup(entityType: 'project' | 'production' | 'activation', entityId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['budget-rollup', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_budget_rollup', { 
          entity_type: entityType,
          entity_uuid: entityId 
        })
        .single()

      if (error) throw error
      return data as BudgetRollup
    },
    enabled: !!entityId,
  })
}

// =============================================
// TEAM MANAGEMENT
// =============================================

/**
 * Get all team members in hierarchy
 */
export function useHierarchyTeam(entityType: 'project' | 'production' | 'activation', entityId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['hierarchy-team', entityType, entityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_hierarchy_team_members', { 
          entity_type: entityType,
          entity_uuid: entityId 
        })

      if (error) throw error
      return data as TeamMember[]
    },
    enabled: !!entityId,
  })
}

/**
 * Add team member to project
 */
export function useAddProjectTeamMember() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('project_team_members')
        .insert({ project_id: projectId, user_id: userId, role })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hierarchy-team', 'project', variables.projectId] })
    },
  })
}

/**
 * Add team member to production
 */
export function useAddProductionTeamMember() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ productionId, userId, role }: { productionId: string; userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('production_team_members')
        .insert({ production_id: productionId, user_id: userId, role })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hierarchy-team', 'production', variables.productionId] })
    },
  })
}

/**
 * Add team member to activation
 */
export function useAddActivationTeamMember() {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useMutation({
    mutationFn: async ({ activationId, userId, role }: { activationId: string; userId: string; role: string }) => {
      const { data, error } = await supabase
        .from('activation_team_members')
        .insert({ activation_id: activationId, user_id: userId, role })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['hierarchy-team', 'activation', variables.activationId] })
    },
  })
}

// =============================================
// REALTIME SUBSCRIPTIONS
// =============================================

/**
 * Subscribe to project changes
 */
export function useProjectsRealtime(organizationId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useQuery({
    queryKey: ['projects-realtime', organizationId],
    queryFn: async () => {
      const channel = supabase
        .channel(`projects:${organizationId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects',
            filter: `organization_id=eq.${organizationId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['projects', organizationId] })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    },
    enabled: !!organizationId,
  })
}

/**
 * Subscribe to activation changes
 */
export function useActivationsRealtime(productionId: string) {
  const queryClient = useQueryClient()
  const supabase = createClient()

  return useQuery({
    queryKey: ['activations-realtime', productionId],
    queryFn: async () => {
      const channel = supabase
        .channel(`activations:${productionId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'activations',
            filter: `production_id=eq.${productionId}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['activations', productionId] })
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    },
    enabled: !!productionId,
  })
}
