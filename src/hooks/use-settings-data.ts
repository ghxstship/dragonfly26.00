'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface UserPreferences {
  id: string
  user_id: string
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  date_format: string
  time_format: string
  currency: string
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  notification_frequency: 'realtime' | 'hourly' | 'daily' | 'weekly'
  dashboard_layout: Record<string, any>
  sidebar_collapsed: boolean
  created_at: string
  updated_at: string
}

export interface UserIntegration {
  id: string
  user_id: string
  integration_type: string
  integration_name: string
  config: Record<string, unknown>
  credentials: Record<string, unknown>
  is_active: boolean
  last_synced_at: string | null
  sync_frequency: string | null
  created_at: string
  updated_at: string
}

export interface UserAutomation {
  id: string
  user_id: string
  name: string
  description: string | null
  trigger_type: string
  trigger_config: Record<string, unknown>
  actions: Array<Record<string, unknown>>
  conditions: Array<Record<string, any>>
  is_active: boolean
  last_run_at: string | null
  run_count: number
  created_at: string
  updated_at: string
}

export interface NotificationSettings {
  id: string
  user_id: string
  email_digest: boolean
  email_mentions: boolean
  email_assignments: boolean
  email_updates: boolean
  push_mentions: boolean
  push_assignments: boolean
  push_updates: boolean
  sms_critical: boolean
  quiet_hours_enabled: boolean
  quiet_hours_start: string | null
  quiet_hours_end: string | null
  created_at: string
  updated_at: string
}

export interface AppearanceSettings {
  id: string
  user_id: string
  theme: string
  accent_color: string
  font_size: 'small' | 'medium' | 'large'
  density: 'comfortable' | 'compact'
  animations_enabled: boolean
  high_contrast: boolean
  reduce_motion: boolean
  created_at: string
  updated_at: string
}

export interface BillingInfo {
  id: string
  user_id: string
  plan: 'free' | 'pro' | 'enterprise'
  billing_cycle: 'monthly' | 'yearly'
  payment_method: string | null
  card_last_four: string | null
  card_brand: string | null
  next_billing_date: string | null
  amount: number
  currency: string
  created_at: string
  updated_at: string
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for managing user settings and preferences
 * Covers: Preferences, Integrations, Automations, Notifications, Appearance, Billing
 */
export function useSettingsData() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [integrations, setIntegrations] = useState<UserIntegration[]>([])
  const [automations, setAutomations] = useState<UserAutomation[]>([])
  const [notifications, setNotifications] = useState<NotificationSettings | null>(null)
  const [appearance, setAppearance] = useState<AppearanceSettings | null>(null)
  const [billing, setBilling] = useState<BillingInfo | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllSettings()
    
    // Set up real-time subscriptions
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_preferences' }, fetchPreferences)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_integrations' }, fetchIntegrations)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_automations' }, fetchAutomations)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notification_settings' }, fetchNotifications)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'appearance_settings' }, fetchAppearance)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // ============================================================================
  // FETCH FUNCTIONS
  // ============================================================================

  async function fetchAllSettings() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await Promise.all([
        fetchPreferences(),
        fetchIntegrations(),
        fetchAutomations(),
        fetchNotifications(),
        fetchAppearance(),
        fetchBilling(),
      ])
      setError(null)
    } catch (err: any) {
      console.error('Error fetching settings:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPreferences() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    setPreferences(data || null)
  }

  async function fetchIntegrations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', user.id)
      .order('integration_name')
    
    if (error) throw error
    setIntegrations(data || [])
  }

  async function fetchAutomations() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('user_automations')
      .select('*')
      .eq('user_id', user.id)
      .order('name')
    
    if (error) throw error
    setAutomations(data || [])
  }

  async function fetchNotifications() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    setNotifications(data || null)
  }

  async function fetchAppearance() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('appearance_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    setAppearance(data || null)
  }

  async function fetchBilling() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('billing_info')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    setBilling(data || null)
  }

  // ============================================================================
  // UPDATE FUNCTIONS
  // ============================================================================

  async function updatePreferences(updates: Partial<UserPreferences>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { id, user_id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: user.id,
        ...validUpdates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchPreferences()
    return data
  }

  async function updateNotifications(updates: Partial<NotificationSettings>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { id, user_id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('notification_settings')
      .upsert({
        user_id: user.id,
        ...validUpdates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchNotifications()
    return data
  }

  async function updateAppearance(updates: Partial<AppearanceSettings>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { id, user_id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('appearance_settings')
      .upsert({
        user_id: user.id,
        ...validUpdates,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchAppearance()
    return data
  }

  // ============================================================================
  // INTEGRATION FUNCTIONS
  // ============================================================================

  async function addIntegration(integrationData: Omit<UserIntegration, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_integrations')
      .insert({
        user_id: user.id,
        ...integrationData,
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  async function updateIntegration(integrationId: string, updates: Partial<UserIntegration>) {
    const { id, user_id, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('user_integrations')
      .update({
        ...validUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', integrationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  async function deleteIntegration(integrationId: string) {
    const { error } = await supabase
      .from('user_integrations')
      .delete()
      .eq('id', integrationId)
    
    if (error) throw error
    await fetchIntegrations()
  }

  async function syncIntegration(integrationId: string) {
    const { data, error } = await supabase
      .from('user_integrations')
      .update({
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', integrationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchIntegrations()
    return data
  }

  // ============================================================================
  // AUTOMATION FUNCTIONS
  // ============================================================================

  async function createAutomation(automationData: Omit<UserAutomation, 'id' | 'user_id' | 'run_count' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('user_automations')
      .insert({
        user_id: user.id,
        run_count: 0,
        ...automationData,
      })
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  async function updateAutomation(automationId: string, updates: Partial<UserAutomation>) {
    const { id, user_id, run_count, created_at, ...validUpdates } = updates as any
    
    const { data, error } = await supabase
      .from('user_automations')
      .update({
        ...validUpdates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  async function deleteAutomation(automationId: string) {
    const { error } = await supabase
      .from('user_automations')
      .delete()
      .eq('id', automationId)
    
    if (error) throw error
    await fetchAutomations()
  }

  async function toggleAutomation(automationId: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('user_automations')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  async function runAutomation(automationId: string) {
    const automation = automations.find(a => a.id === automationId)
    if (!automation) throw new Error('Automation not found')

    const { data, error } = await supabase
      .from('user_automations')
      .update({
        last_run_at: new Date().toISOString(),
        run_count: automation.run_count + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', automationId)
      .select()
      .single()
    
    if (error) throw error
    await fetchAutomations()
    return data
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  async function resetToDefaults() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    // Reset preferences to defaults
    await updatePreferences({
      theme: 'system',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      date_format: 'MM/DD/YYYY',
      time_format: '12h',
      currency: 'USD',
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      notification_frequency: 'realtime',
      sidebar_collapsed: false,
    })

    // Reset appearance to defaults
    await updateAppearance({
      theme: 'system',
      accent_color: '#3b82f6',
      font_size: 'medium',
      density: 'comfortable',
      animations_enabled: true,
      high_contrast: false,
      reduce_motion: false,
    })

    await fetchAllSettings()
  }

  async function exportSettings() {
    return {
      preferences,
      integrations: integrations.map(i => ({ ...i, credentials: undefined })), // Don't export credentials
      automations,
      notifications,
      appearance,
    }
  }

  async function importSettings(settings: any) {
    if (settings.preferences) await updatePreferences(settings.preferences)
    if (settings.notifications) await updateNotifications(settings.notifications)
    if (settings.appearance) await updateAppearance(settings.appearance)
    
    await fetchAllSettings()
  }

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    preferences,
    integrations,
    automations,
    notifications,
    appearance,
    billing,
    loading,
    error,
    
    // Preferences
    updatePreferences,
    
    // Notifications
    updateNotifications,
    
    // Appearance
    updateAppearance,
    
    // Integrations
    addIntegration,
    updateIntegration,
    deleteIntegration,
    syncIntegration,
    
    // Automations
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,
    runAutomation,
    
    // Utilities
    resetToDefaults,
    exportSettings,
    importSettings,
    
    // Refresh
    refresh: fetchAllSettings,
  }
}
