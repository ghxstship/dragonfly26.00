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
  'my-jobs': { table: 'job_contracts', select: '*', orderBy: 'start_date' },
  'my-tasks': { table: 'project_tasks', orderBy: 'due_date' },
  'my-assets': { table: 'assets', select: '*, current_location:current_location_id(name)', orderBy: 'name' },
  'my-orders': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'my-advances': { table: 'production_advances', select: '*, production:production_id(name)', orderBy: 'requested_date' },
  'my-travel': { table: 'travel_itineraries', select: '*, traveler:personnel!traveler_id(first_name, last_name)', orderBy: 'departure_date' },
  'my-expenses': { table: 'financial_transactions', orderBy: 'transaction_date' },
  'my-reports': { table: 'report_templates', select: '*', orderBy: 'name' },
  'my-files': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  
  // Projects
  'productions': { table: 'productions', select: '*, workspaces!workspace_id(name), project_manager:profiles!project_manager_id(first_name, last_name)', orderBy: 'created_at' },
  'activations': { table: 'productions', select: '*, workspaces!workspace_id(name), project_manager:profiles!project_manager_id(first_name, last_name)', orderBy: 'created_at' },
  'schedule': { table: 'project_milestones', select: '*, production:production_id(name)', orderBy: 'due_date' },
  'tasks': { table: 'project_tasks', select: '*, production:production_id(name), assignee:profiles!assignee_id(first_name, last_name)', orderBy: 'due_date' },
  'milestones': { table: 'project_milestones', select: '*, production:production_id(name)', orderBy: 'due_date' },
  'compliance': { table: 'compliance_requirements', select: '*, production:production_id(name)', orderBy: 'expires_at' },
  'safety': { table: 'safety_guidelines', select: '*, production:production_id(name)', orderBy: 'created_at' },
  
  // Events
  'all-events': { table: 'events', select: '*, location:location_id(name, city), production:production_id(name)', orderBy: 'start_time' },
  'activities': { table: 'events', select: '*, location:location_id(name, city), production:production_id(name)', orderBy: 'start_time' },
  'run-of-show': { table: 'run_of_show', select: '*, event:event_id(name)', orderBy: 'sequence_number' },
  'rehearsals': { table: 'events', select: '*, location:location_id(name, city), production:production_id(name)', orderBy: 'start_time' },
  'blocks': { table: 'bookings', select: '*, event:event_id(name), location:location_id(name)', orderBy: 'check_in' },
  'bookings': { table: 'bookings', select: '*, event:event_id(name), location:location_id(name)', orderBy: 'check_in' },
  'tours': { table: 'tours', select: '*, production:production_id(name)', orderBy: 'start_date' },
  'itineraries': { table: 'travel_itineraries', select: '*, traveler:personnel!traveler_id(first_name, last_name)', orderBy: 'departure_date' },
  'reservations': { table: 'hospitality_reservations', select: '*, event:event_id(name)', orderBy: 'reservation_date' },
  'equipment': { table: 'assets', select: '*, current_location:current_location_id(name)', orderBy: 'name' },
  'shipping-receiving': { table: 'shipments', select: '*, production:production_id(name)', orderBy: 'ship_date' },
  'incidents': { table: 'incidents', select: '*, event:event_id(name)', orderBy: 'incident_date' },
  'internal': { table: 'events', select: '*, location:location_id(name, city), production:production_id(name)', orderBy: 'start_time' },
  
  // People
  'personnel': { table: 'personnel', select: '*', orderBy: 'last_name' },
  'teams': { table: 'teams', select: '*, lead:personnel!leader_id(first_name, last_name)', orderBy: 'name' },
  'assignments': { table: 'project_tasks', select: '*, assignee:profiles!assignee_id(first_name, last_name)', orderBy: 'due_date' },
  'timekeeping': { table: 'time_entries', select: '*, personnel:personnel!personnel_id(first_name, last_name)', orderBy: 'start_time' },
  'scheduling': { table: 'events', select: '*', orderBy: 'start_time' },
  'training': { table: 'training_sessions', select: '*', orderBy: 'session_date' },
  'onboarding': { table: 'personnel', select: '*', orderBy: 'created_at' },
  'openings': { table: 'job_openings', select: '*', orderBy: 'created_at' },
  'applicants': { table: 'job_openings', select: '*', orderBy: 'created_at' },
  
  // Assets
  'tracking': { table: 'asset_transactions', select: '*, asset:asset_id(name)', orderBy: 'transaction_date' },
  'inventory': { table: 'assets', select: '*, current_location:current_location_id(name)', orderBy: 'name' },
  'maintenance': { table: 'asset_maintenance', select: '*, asset:asset_id(name)', orderBy: 'scheduled_date' },
  'approvals': { table: 'production_advances', select: '*, production:production_id(name)', orderBy: 'requested_date' },
  'advances': { table: 'production_advances', select: '*, production:production_id(name)', orderBy: 'requested_date' },
  'catalog': { table: 'assets', select: '*, current_location:current_location_id(name)', orderBy: 'name' },
  
  // Locations
  'directory': { table: 'locations', select: '*', orderBy: 'name' },
  'site-maps': { table: 'site_maps', select: '*, location:location_id(name)', orderBy: 'created_at' },
  'access': { table: 'locations', select: '*', orderBy: 'name' },
  'warehousing': { table: 'locations', select: '*', orderBy: 'name' },
  'logistics': { table: 'shipments', select: '*, production:production_id(name)', orderBy: 'ship_date' },
  'utilities': { table: 'locations', select: '*', orderBy: 'name' },
  
  // Files
  'all-documents': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'contracts': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'riders': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'tech-specs': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'call-sheets': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'insurance-permits': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'media-assets': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'production-reports': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'shared': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'archive': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  
  // Companies
  'organizations': { table: 'companies', select: '*', orderBy: 'name' },
  'contacts': { table: 'company_contacts', select: '*, company:company_id(name)', orderBy: 'last_name' },
  'deliverables': { table: 'deliverables', select: '*, company:company_id(name)', orderBy: 'due_date' },
  'scopes-of-work': { table: 'scopes_of_work', select: '*, company:company_id(name)', orderBy: 'created_at' },
  'documents': { table: 'files', select: '*, category:category_id(name)', orderBy: 'created_at' },
  'bids': { table: 'bids', select: '*, company:company_id(name)', orderBy: 'submitted_date' },
  
  // Finance
  'budgets': { table: 'budgets', select: '*, production:production_id(name)', orderBy: 'created_at' },
  'forecasting': { table: 'budgets', select: '*, production:production_id(name)', orderBy: 'created_at' },
  'transactions': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'revenue': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'expenses': { table: 'financial_transactions', orderBy: 'transaction_date' },
  'payroll': { table: 'payroll', select: '*, production:production_id(name)', orderBy: 'pay_date' },
  'reconciliation': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'payments': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'invoices': { table: 'invoices', select: '*, company:company_id(name)', orderBy: 'invoice_date' },
  'taxes': { table: 'financial_transactions', select: '*, budget:budget_id(name)', orderBy: 'transaction_date' },
  'accounts': { table: 'gl_codes', select: '*', orderBy: 'code' },
  'gl-codes': { table: 'gl_codes', select: '*', orderBy: 'code' },
  
  // Procurement
  'fulfillment': { table: 'purchase_orders', select: '*, company:company_id(name)', orderBy: 'issue_date' },
  'orders': { table: 'purchase_orders', select: '*, company:company_id(name)', orderBy: 'issue_date' },
  'agreements': { table: 'agreements', select: '*, company:company_id(name)', orderBy: 'start_date' },
  'requisitions': { table: 'purchase_requisitions', select: '*, requested_by_user:profiles!requested_by(first_name, last_name)', orderBy: 'requested_date' },
  'line-items': { table: 'purchase_orders', select: '*, company:company_id(name)', orderBy: 'issue_date' },
  'audits': { table: 'purchase_orders', select: '*, company:company_id(name)', orderBy: 'created_at' },
  
  // Community
  'news': { table: 'community_posts', select: '*, author:profiles!author_id(first_name, last_name)', orderBy: 'created_at' },
  'showcase': { table: 'community_posts', select: '*, author:profiles!author_id(first_name, last_name)', orderBy: 'created_at' },
  'activity': { table: 'community_posts', select: '*, author:profiles!author_id(first_name, last_name)', orderBy: 'created_at' },
  'connections': { table: 'connections', select: '*', orderBy: 'created_at' },
  'studios': { table: 'companies', select: '*', orderBy: 'name' },
  'discussions': { table: 'community_posts', select: '*, author:profiles!author_id(first_name, last_name)', orderBy: 'created_at' },
  'competitions': { table: 'community_posts', select: '*, author:profiles!author_id(first_name, last_name)', orderBy: 'created_at' },
  
  // Marketplace
  'spotlight': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'shop': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'favorites': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'sales': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'purchases': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'lists': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'products': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'name' },
  'services': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'name' },
  'vendors': { table: 'companies', select: '*', orderBy: 'name' },
  'reviews': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  
  // Resources
  'library': { table: 'resources', select: '*', orderBy: 'title' },
  'guides': { table: 'resources', select: '*', orderBy: 'title' },
  'courses': { table: 'courses', select: '*', orderBy: 'title' },
  'trainings': { table: 'training_sessions', select: '*', orderBy: 'session_date' },
  'grants': { table: 'grants', select: '*', orderBy: 'application_deadline' },
  'publications': { table: 'resources', select: '*', orderBy: 'title' },
  'glossary': { table: 'resources', select: '*', orderBy: 'title' },
  'troubleshooting': { table: 'resources', select: '*', orderBy: 'title' },
  
  // Jobs
  'active': { table: 'job_contracts', select: '*', orderBy: 'start_date' },
  'pipeline': { table: 'job_contracts', select: '*', orderBy: 'created_at' },
  'offers': { table: 'job_contracts', select: '*', orderBy: 'created_at' },
  'shortlists': { table: 'job_contracts', select: '*', orderBy: 'created_at' },
  'rfps': { table: 'rfps', select: '*', orderBy: 'submission_deadline' },
  'completed': { table: 'job_contracts', select: '*', orderBy: 'end_date' },
  'archived': { table: 'job_contracts', select: '*', orderBy: 'end_date' },
  
  // Reports
  'templates': { table: 'report_templates', select: '*', orderBy: 'name' },
  'custom-builder': { table: 'report_templates', select: '*', orderBy: 'name' },
  'scheduled': { table: 'report_templates', select: '*', orderBy: 'name' },
  'exports': { table: 'report_templates', select: '*', orderBy: 'created_at' },
  'executive': { table: 'report_templates', select: '*', orderBy: 'name' },
  'operational': { table: 'report_templates', select: '*', orderBy: 'name' },
  
  // Analytics
  'performance': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'trends': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'comparisons': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'realtime': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'data-sources': { table: 'data_sources', select: '*', orderBy: 'name' },
  'custom-views': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'pivot-tables': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'metrics-library': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'benchmarks': { table: 'benchmarks', select: '*', orderBy: 'name' },
  
  // Insights
  'objectives': { table: 'objectives', select: '*, owner:profiles!owner_id(first_name, last_name)', orderBy: 'start_date' },
  'key-results': { table: 'key_results', select: '*, objective:objective_id(title)', orderBy: 'created_at' },
  'priorities': { table: 'strategic_priorities', select: '*', orderBy: 'priority_rank' },
  'recommendations': { table: 'ai_recommendations', select: '*', orderBy: 'generated_at' },
  'progress-tracking': { table: 'objectives', select: '*, owner:profiles!owner_id(first_name, last_name)', orderBy: 'start_date' },
  'intelligence-feed': { table: 'ai_recommendations', select: '*', orderBy: 'generated_at' },
  'success-metrics': { table: 'key_results', select: '*, objective:objective_id(title)', orderBy: 'created_at' },
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
