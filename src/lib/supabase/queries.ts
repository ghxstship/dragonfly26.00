import { createClient } from './client'
import type {
  Organization,
  Workspace,
  OrganizationMember,
  Module,
  View,
  DataItem,
  CustomField,
  Activity,
  Comment,
  Template,
} from '@/types'

export class SupabaseQueries {
  private supabase = createClient()

  // Organizations
  async getOrganizations() {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Organization[]
  }

  async getOrganization(id: string) {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Organization
  }

  async createOrganization(org: Partial<Organization>) {
    const { data, error } = await this.supabase
      .from('organizations')
      .insert(org)
      .select()
      .single()

    if (error) throw error
    return data as Organization
  }

  async updateOrganization(id: string, updates: Partial<Organization>) {
    const { data, error } = await this.supabase
      .from('organizations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Organization
  }

  // Workspaces
  async getWorkspaces(organizationId: string) {
    const { data, error } = await this.supabase
      .from('workspaces')
      .select('*')
      .eq('organization_id', organizationId)
      .order('is_default', { ascending: false })
      .order('name')

    if (error) throw error
    return data as Workspace[]
  }

  async getWorkspace(id: string) {
    const { data, error } = await this.supabase
      .from('workspaces')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Workspace
  }

  async createWorkspace(workspace: Partial<Workspace>) {
    const { data, error } = await this.supabase
      .from('workspaces')
      .insert(workspace)
      .select()
      .single()

    if (error) throw error
    return data as Workspace
  }

  // Members
  async getOrganizationMembers(organizationId: string) {
    const { data, error } = await this.supabase
      .from('organization_members')
      .select(`
        *,
        user:users(*)
      `)
      .eq('organization_id', organizationId)
      .order('joined_at', { ascending: false })

    if (error) throw error
    return data as OrganizationMember[]
  }

  async inviteMember(organizationId: string, email: string, role: string) {
    // Implementation would send invitation email
    // and create pending member record
    const { data, error } = await this.supabase
      .from('organization_members')
      .insert({
        organization_id: organizationId,
        email,
        role,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Generic Data Operations
  async getItems(tableName: string, workspaceId: string) {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as DataItem[]
  }

  async getItem(tableName: string, id: string) {
    const { data, error } = await this.supabase
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as DataItem
  }

  async createItem(tableName: string, item: Partial<DataItem>) {
    const { data, error } = await this.supabase
      .from(tableName)
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data as DataItem
  }

  async updateItem(tableName: string, id: string, updates: Partial<DataItem>) {
    const { data, error } = await this.supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as DataItem
  }

  async deleteItem(tableName: string, id: string) {
    const { error } = await this.supabase
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async bulkUpdateItems(tableName: string, ids: string[], updates: Partial<DataItem>) {
    const { data, error } = await this.supabase
      .from(tableName)
      .update(updates)
      .in('id', ids)
      .select()

    if (error) throw error
    return data as DataItem[]
  }

  // Views
  async getViews(workspaceId: string, moduleId?: string) {
    let query = this.supabase
      .from('views')
      .select('*')
      .eq('workspace_id', workspaceId)

    if (moduleId) {
      query = query.eq('module_id', moduleId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error
    return data as View[]
  }

  async createView(view: Partial<View>) {
    const { data, error } = await this.supabase
      .from('views')
      .insert(view)
      .select()
      .single()

    if (error) throw error
    return data as View
  }

  async updateView(id: string, updates: Partial<View>) {
    const { data, error } = await this.supabase
      .from('views')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as View
  }

  // Custom Fields
  async getCustomFields(workspaceId: string) {
    const { data, error } = await this.supabase
      .from('custom_fields')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('order')

    if (error) throw error
    return data as CustomField[]
  }

  async createCustomField(field: Partial<CustomField>) {
    const { data, error } = await this.supabase
      .from('custom_fields')
      .insert(field)
      .select()
      .single()

    if (error) throw error
    return data as CustomField
  }

  // Activity Feed
  async getActivity(workspaceId: string, limit = 50) {
    const { data, error } = await this.supabase
      .from('activities')
      .select(`
        *,
        user:users(*)
      `)
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Activity[]
  }

  // Comments
  async getComments(entityType: string, entityId: string) {
    const { data, error } = await this.supabase
      .from('comments')
      .select(`
        *,
        user:users(*)
      `)
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .is('parent_id', null)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as Comment[]
  }

  async createComment(comment: Partial<Comment>) {
    const { data, error } = await this.supabase
      .from('comments')
      .insert(comment)
      .select()
      .single()

    if (error) throw error
    return data as Comment
  }

  // Real-time Subscriptions
  subscribeToWorkspace(workspaceId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`workspace:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          filter: `workspace_id=eq.${workspaceId}`,
        },
        callback
      )
      .subscribe()
  }

  subscribeToTable(tableName: string, workspaceId: string, callback: (payload: any) => void) {
    return this.supabase
      .channel(`${tableName}:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName,
          filter: `workspace_id=eq.${workspaceId}`,
        },
        callback
      )
      .subscribe()
  }

  // Templates
  async getTemplates(category?: string) {
    let query = this.supabase
      .from('templates')
      .select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('downloads', { ascending: false })

    if (error) throw error
    return data as Template[]
  }

  // Schema Introspection
  async getTableSchema(tableName: string) {
    const { data, error } = await this.supabase.rpc('get_table_schema', {
      table_name: tableName,
    })

    if (error) throw error
    return data
  }

  async getAllTables() {
    const { data, error } = await this.supabase.rpc('get_all_tables')

    if (error) throw error
    return data
  }
}

export const queries = new SupabaseQueries()
