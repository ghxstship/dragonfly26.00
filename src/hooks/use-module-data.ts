'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Universal hook for fetching module data
 * Maps tab slugs to database tables and handles real-time subscriptions
 */

// Table mapping for all modules
const TAB_TO_TABLE_MAP: Record<string, { table: string; select?: string; orderBy?: string }> = {
  // Dashboard
  'overview': { table: 'workspaces', select: '*' },
  'my-agenda': { table: 'events', orderBy: 'start_time' },
  'my-tasks': { table: 'project_tasks', orderBy: 'due_date' },
  'my-expenses': { table: 'financial_transactions', orderBy: 'transaction_date' },
  
  // Projects
  'productions': { table: 'productions', select: '*, workspaces!workspace_id(name), project_manager:project_manager_id(first_name, last_name)', orderBy: 'created_at' },
  'tasks': { table: 'project_tasks', select: '*, production:production_id(name), assignee:assignee_id(first_name, last_name)', orderBy: 'due_date' },
  'milestones': { table: 'project_milestones', select: '*, production:production_id(name)', orderBy: 'due_date' },
  'compliance': { table: 'compliance_requirements', select: '*, production:production_id(name)', orderBy: 'expires_at' },
  'safety': { table: 'safety_guidelines', select: '*, production:production_id(name)', orderBy: 'created_at' },
  
  // Events
  'all-events': { table: 'events', select: '*, location:location_id(name, city), production:production_id(name)', orderBy: 'start_time' },
  'run-of-show': { table: 'run_of_show', select: '*, event:event_id(name)', orderBy: 'sequence_number' },
  'bookings': { table: 'bookings', select: '*, event:event_id(name), location:location_id(name)', orderBy: 'check_in' },
  'incidents': { table: 'incidents', select: '*, event:event_id(name)', orderBy: 'incident_date' },
  'tours': { table: 'tours', select: '*, production:production_id(name)', orderBy: 'start_date' },
  'itineraries': { table: 'travel_itineraries', select: '*, traveler:traveler_id(first_name, last_name)', orderBy: 'departure_date' },
  'reservations': { table: 'hospitality_reservations', select: '*, event:event_id(name)', orderBy: 'reservation_date' },
  'shipping-receiving': { table: 'shipments', select: '*, production:production_id(name)', orderBy: 'ship_date' },
  
  // People
  'personnel': { table: 'personnel', select: '*', orderBy: 'last_name' },
  'teams': { table: 'teams', select: '*, lead:team_lead_id(first_name, last_name)', orderBy: 'name' },
  'timekeeping': { table: 'time_entries', select: '*, personnel:personnel_id(first_name, last_name)', orderBy: 'start_time' },
  'training': { table: 'training_sessions', select: '*', orderBy: 'session_date' },
  'openings': { table: 'job_openings', select: '*', orderBy: 'created_at' },
  
  // Assets
  'tracking': { table: 'asset_transactions', select: '*, asset:asset_id(name)', orderBy: 'transaction_date' },
  'inventory': { table: 'assets', select: '*, current_location:current_location_id(name)', orderBy: 'name' },
  'maintenance': { table: 'asset_maintenance', select: '*, asset:asset_id(name)', orderBy: 'scheduled_date' },
  'advances': { table: 'production_advances', select: '*, production:production_id(name)', orderBy: 'requested_date' },
  
  // Locations
  'directory': { table: 'locations', select: '*', orderBy: 'name' },
  'site-maps': { table: 'site_maps', select: '*, location:location_id(name)', orderBy: 'created_at' },
  
  // Files
  'all-documents': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'contracts': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  
  // Companies
  'organizations': { table: 'companies', select: '*', orderBy: 'name' },
  'contacts': { table: 'company_contacts', select: '*, company:company_id(name)', orderBy: 'last_name' },
  'scopes-of-work': { table: 'scopes_of_work', select: '*, company:company_id(name)', orderBy: 'created_at' },
  'bids': { table: 'bids', select: '*, company:company_id(name)', orderBy: 'submitted_date' },
  
  // Finance
  'budgets': { table: 'budgets', select: '*, production:production_id(name)', orderBy: 'created_at' },
  'transactions': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'invoices': { table: 'invoices', select: '*, company:company_id(name)', orderBy: 'invoice_date' },
  'expenses': { table: 'financial_transactions', orderBy: 'transaction_date' },
  'payroll': { table: 'payroll', select: '*, production:production_id(name)', orderBy: 'pay_date' },
  'gl-codes': { table: 'gl_codes', select: '*', orderBy: 'code' },
  
  // Procurement
  'orders': { table: 'purchase_orders', select: '*, company:vendor_id(name)', orderBy: 'order_date' },
  'agreements': { table: 'agreements', select: '*, company:company_id(name)', orderBy: 'start_date' },
  'requisitions': { table: 'purchase_requisitions', select: '*, requested_by_user:requested_by(first_name, last_name)', orderBy: 'requested_date' },
  
  // Community
  'activity': { table: 'community_posts', select: '*, author:author_id(first_name, last_name)', orderBy: 'created_at' },
  'connections': { table: 'connections', select: '*', orderBy: 'created_at' },
  
  // Marketplace
  'shop': { table: 'marketplace_products', select: '*', orderBy: 'created_at' },
  'products': { table: 'marketplace_products', select: '*', orderBy: 'name' },
  'purchases': { table: 'marketplace_orders', select: '*', orderBy: 'order_date' },
  
  // Resources
  'library': { table: 'resources', select: '*', orderBy: 'title' },
  'courses': { table: 'courses', select: '*', orderBy: 'title' },
  'grants': { table: 'grants', select: '*', orderBy: 'deadline' },
  
  // Jobs
  'active': { table: 'job_contracts', select: '*', orderBy: 'start_date' },
  'rfps': { table: 'rfps', select: '*', orderBy: 'submission_deadline' },
  
  // Reports
  'templates': { table: 'report_templates', select: '*', orderBy: 'name' },
  
  // Analytics
  'data-sources': { table: 'data_sources', select: '*', orderBy: 'name' },
  'custom-views': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'benchmarks': { table: 'benchmarks', select: '*', orderBy: 'name' },
  
  // Insights
  'objectives': { table: 'objectives', select: '*, owner:owner_id(first_name, last_name)', orderBy: 'start_date' },
  'key-results': { table: 'key_results', select: '*, objective:objective_id(title)', orderBy: 'created_at' },
  'priorities': { table: 'strategic_priorities', select: '*', orderBy: 'priority_rank' },
  'recommendations': { table: 'ai_recommendations', select: '*', orderBy: 'generated_at' },
}

export function useModuleData(
  moduleSlug: string,
  tabSlug: string,
  workspaceId: string,
  filters: Record<string, any> = {}
) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Don't query if workspaceId is not yet available
        if (!workspaceId) {
          setLoading(false)
          return
        }
        
        const config = TAB_TO_TABLE_MAP[tabSlug]
        if (!config) {
          console.warn(`No table mapping for tab: ${tabSlug}`)
          setData([])
          setLoading(false)
          return
        }

        let query = supabase
          .from(config.table)
          .select(config.select || '*')
          .eq('workspace_id', workspaceId)

        // Apply additional filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })

        // Apply ordering
        if (config.orderBy) {
          const isDescending = config.orderBy === 'created_at' || config.orderBy === 'updated_at'
          query = query.order(config.orderBy, { ascending: !isDescending })
        }

        const { data: result, error: queryError } = await query

        if (queryError) throw queryError

        setData(result || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching module data:', err)
        setError(err as Error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId && tabSlug) {
      fetchData()
    }

    // Real-time subscription
    if (!workspaceId) return
    
    const config = TAB_TO_TABLE_MAP[tabSlug]
    if (!config) return

    const channel = supabase
      .channel(`${moduleSlug}:${tabSlug}:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: config.table,
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [moduleSlug, tabSlug, workspaceId, JSON.stringify(filters)])

  return { data, loading, error }
}

// Hook for creating items
export function useCreateItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createItem = async (data: any) => {
    try {
      setLoading(true)
      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      if (insertError) throw insertError

      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createItem, loading, error }
}

// Hook for updating items
export function useUpdateItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateItem = async (id: string, updates: any) => {
    try {
      setLoading(true)
      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateItem, loading, error }
}

// Hook for deleting items
export function useDeleteItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteItem = async (id: string) => {
    try {
      setLoading(true)
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteItem, loading, error }
}

// Hook for global search
export function useGlobalSearch(workspaceId: string, query: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function search() {
      if (!query || query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .rpc('global_search', {
          p_workspace_id: workspaceId,
          p_query: query,
          p_limit: 50
        })

      if (!error && data) {
        setResults(data)
      }
      setLoading(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [workspaceId, query])

  return { results, loading }
}
