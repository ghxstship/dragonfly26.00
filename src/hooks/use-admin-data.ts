'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
  industry: string | null
  size: string | null
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface Role {
  id: string
  organization_id: string
  name: string
  description: string | null
  is_system_role: boolean
  permissions: string[]
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: string
  created_at: string
}

export interface APIToken {
  id: string
  organization_id: string
  user_id: string
  name: string
  token_hash: string
  last_used_at: string | null
  expires_at: string | null
  scopes: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AuditLog {
  id: string
  organization_id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string | null
  changes: Record<string, unknown>
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export interface Webhook {
  id: string
  organization_id: string
  name: string
  url: string
  events: string[]
  secret: string
  is_active: boolean
  last_triggered_at: string | null
  created_at: string
  updated_at: string
}

export interface Integration {
  id: string
  organization_id: string
  name: string
  type: string
  config: Record<string, unknown>
  credentials: Record<string, unknown>
  is_active: boolean
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export interface Automation {
  id: string
  organization_id: string
  name: string
  description: string | null
  trigger_type: string
  trigger_config: Record<string, unknown>
  actions: Array<Record<string, unknown>>
  is_active: boolean
  last_run_at: string | null
  created_at: string
  updated_at: string
}

export interface Template {
  id: string
  organization_id: string
  name: string
  type: string
  content: Record<string, unknown>
  is_default: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface CustomStatus {
  id: string
  organization_id: string
  name: string
  color: string
  icon: string | null
  category: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Plugin {
  id: string
  organization_id: string
  name: string
  version: string
  config: Record<string, unknown>
  is_enabled: boolean
  installed_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role_id: string
  status: 'active' | 'inactive' | 'pending'
  invited_by: string | null
  joined_at: string | null
  created_at: string
  updated_at: string
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for managing admin-level organization data
 * Covers: Organizations, Roles, Permissions, API Tokens, Audit Logs,
 * Webhooks, Integrations, Automations, Templates, Custom Statuses, Plugins, Members
 */
export function useAdminData() {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [apiTokens, setApiTokens] = useState<APIToken[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [automations, setAutomations] = useState<Automation[]>([])
  const [templates, setTemplates] = useState<Template[]>([])
  const [customStatuses, setCustomStatuses] = useState<CustomStatus[]>([])
  const [plugins, setPlugins] = useState<Plugin[]>([])
  const [members, setMembers] = useState<OrganizationMember[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllAdminData()
    
    // Set up real-time subscriptions for critical tables
    const orgChannel = supabase
      .channel('admin-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organizations' }, fetchOrganization)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'roles' }, fetchRoles)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'organization_members' }, fetchMembers)
      .subscribe()

    return () => {
      supabase.removeChannel(orgChannel)
    }
  }, [])

  // ============================================================================
  // FETCH FUNCTIONS
  // ============================================================================

  async function fetchAllAdminData() {
    setLoading(true)
    try {
      await Promise.all([
        fetchOrganization(),
        fetchRoles(),
        fetchPermissions(),
        fetchAPITokens(),
        fetchAuditLogs(),
        fetchWebhooks(),
        fetchIntegrations(),
        fetchAutomations(),
        fetchTemplates(),
        fetchCustomStatuses(),
        fetchPlugins(),
        fetchMembers(),
      ])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching admin data:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrganization() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .single()
    
    if (error) throw error
    setOrganization(data)
  }

  async function fetchRoles() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('name')
    
    if (error) throw error
    setRoles(data || [])
  }

  async function fetchPermissions() {
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .order('resource, action')
    
    if (error) throw error
    setPermissions(data || [])
  }

  async function fetchAPITokens() {
    const { data, error } = await supabase
      .from('api_tokens')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) setApiTokens(data)
  }

  async function fetchAuditLogs(limit = 100) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (!error && data) setAuditLogs(data)
  }

  async function fetchWebhooks() {
    const { data, error } = await supabase
      .from('webhooks')
      .select('*')
      .order('name')
    
    if (!error && data) setWebhooks(data)
  }

  async function fetchIntegrations() {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .order('name')
    
    if (!error && data) setIntegrations(data)
  }

  async function fetchAutomations() {
    const { data, error } = await supabase
      .from('automations')
      .select('*')
      .order('name')
    
    if (!error && data) setAutomations(data)
  }

  async function fetchTemplates() {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('name')
    
    if (!error && data) setTemplates(data)
  }

  async function fetchCustomStatuses() {
    const { data, error } = await supabase
      .from('custom_statuses')
      .select('*')
      .order('category, name')
    
    if (!error && data) setCustomStatuses(data)
  }

  async function fetchPlugins() {
    const { data, error } = await supabase
      .from('plugins')
      .select('*')
      .order('name')
    
    if (!error && data) setPlugins(data)
  }

  async function fetchMembers() {
    const { data, error } = await supabase
      .from('organization_members')
      .select('*, profiles(full_name, email, avatar_url)')
      .order('created_at', { ascending: false })
    
    if (!error && data) setMembers(data)
  }

  // ============================================================================
  // CREATE FUNCTIONS
  // ============================================================================

  async function createRole(roleData: Omit<Role, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('roles')
      .insert(roleData)
      .select()
      .single()
    
    if (error) throw error
    await fetchRoles()
    return data
  }

  async function createAPIToken(tokenData: Omit<APIToken, 'id' | 'token_hash' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('api_tokens')
      .insert(tokenData)
      .select()
      .single()
    
    if (error) throw error
    await fetchAPITokens()
    return data
  }

  async function createWebhook(webhookData: Omit<Webhook, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('webhooks')
      .insert(webhookData)
      .select()
      .single()
    
    if (error) throw error
    await fetchWebhooks()
    return data
  }

  async function createIntegration(integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('integrations')
      .insert(integrationData)
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  async function createAutomation(automationData: Omit<Automation, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('automations')
      .insert(automationData)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  async function createTemplate(templateData: Omit<Template, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('templates')
      .insert(templateData)
      .select()
      .single()
    
    if (error) throw error
    await fetchTemplates()
    return data
  }

  async function createCustomStatus(statusData: Omit<CustomStatus, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('custom_statuses')
      .insert(statusData)
      .select()
      .single()
    
    if (error) throw error
    await fetchCustomStatuses()
    return data
  }

  async function inviteMember(email: string, roleId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: organization?.id,
        user_id: email, // Will be updated when user accepts
        role_id: roleId,
        status: 'pending',
        invited_by: user.id,
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchMembers()
    return data
  }

  // ============================================================================
  // UPDATE FUNCTIONS
  // ============================================================================

  async function updateOrganization(updates: Partial<Organization>) {
    const { id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('organizations')
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq('id', organization?.id)
      .select()
      .single()
    
    if (error) throw error
    await fetchOrganization()
    return data
  }

  async function updateRole(roleId: string, updates: Partial<Role>) {
    const { id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('roles')
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq('id', roleId)
      .select()
      .single()
    
    if (error) throw error
    await fetchRoles()
    return data
  }

  async function updateWebhook(webhookId: string, updates: Partial<Webhook>) {
    const { id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('webhooks')
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq('id', webhookId)
      .select()
      .single()
    
    if (error) throw error
    await fetchWebhooks()
    return data
  }

  async function updateIntegration(integrationId: string, updates: Partial<Integration>) {
    const { id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('integrations')
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq('id', integrationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  async function updateAutomation(automationId: string, updates: Partial<Automation>) {
    const { id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('automations')
      .update({ ...validUpdates, updated_at: new Date().toISOString() })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  async function updateMemberRole(memberId: string, roleId: string) {
    const { data, error } = await supabase
      .from('organization_members')
      .update({ role_id: roleId, updated_at: new Date().toISOString() })
      .eq('id', memberId)
      .select()
      .single()
    
    if (error) throw error
    await fetchMembers()
    return data
  }

  // ============================================================================
  // DELETE FUNCTIONS
  // ============================================================================

  async function deleteRole(roleId: string) {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', roleId)
    
    if (error) throw error
    await fetchRoles()
  }

  async function deleteAPIToken(tokenId: string) {
    const { error } = await supabase
      .from('api_tokens')
      .delete()
      .eq('id', tokenId)
    
    if (error) throw error
    await fetchAPITokens()
  }

  async function deleteWebhook(webhookId: string) {
    const { error } = await supabase
      .from('webhooks')
      .delete()
      .eq('id', webhookId)
    
    if (error) throw error
    await fetchWebhooks()
  }

  async function deleteIntegration(integrationId: string) {
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', integrationId)
    
    if (error) throw error
    await fetchIntegrations()
  }

  async function deleteAutomation(automationId: string) {
    const { error } = await supabase
      .from('automations')
      .delete()
      .eq('id', automationId)
    
    if (error) throw error
    await fetchAutomations()
  }

  async function deleteTemplate(templateId: string) {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', templateId)
    
    if (error) throw error
    await fetchTemplates()
  }

  async function removeMember(memberId: string) {
    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId)
    
    if (error) throw error
    await fetchMembers()
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  async function logAuditEvent(action: string, resourceType: string, resourceId: string | null, changes: Record<string, unknown>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('audit_logs').insert({
      organization_id: organization?.id,
      user_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      changes,
    })

    await fetchAuditLogs()
  }

  async function testWebhook(webhookId: string) {
    const webhook = webhooks.find(w => w.id === webhookId)
    if (!webhook) throw new Error('Webhook not found')

    // Trigger a test webhook event
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': webhook.secret,
      },
      body: JSON.stringify({
        event: 'test',
        timestamp: new Date().toISOString(),
        data: { message: 'Test webhook event' },
      }),
    })

    return response.ok
  }

  async function syncIntegration(integrationId: string) {
    const { data, error } = await supabase
      .from('integrations')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', integrationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  async function triggerAutomation(automationId: string) {
    const { data, error } = await supabase
      .from('automations')
      .update({ last_run_at: new Date().toISOString() })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    organization,
    roles,
    permissions,
    apiTokens,
    auditLogs,
    webhooks,
    integrations,
    automations,
    templates,
    customStatuses,
    plugins,
    members,
    loading,
    error,
    
    // Organization
    updateOrganization,
    
    // Roles & Permissions
    createRole,
    updateRole,
    deleteRole,
    
    // API Tokens
    createAPIToken,
    deleteAPIToken,
    
    // Audit Logs
    logAuditEvent,
    
    // Webhooks
    createWebhook,
    updateWebhook,
    deleteWebhook,
    testWebhook,
    
    // Integrations
    createIntegration,
    updateIntegration,
    deleteIntegration,
    syncIntegration,
    
    // Automations
    createAutomation,
    updateAutomation,
    deleteAutomation,
    triggerAutomation,
    
    // Templates
    createTemplate,
    deleteTemplate,
    
    // Custom Statuses
    createCustomStatus,
    
    // Members
    inviteMember,
    updateMemberRole,
    removeMember,
    
    // Refresh
    refresh: fetchAllAdminData,
  }
}
