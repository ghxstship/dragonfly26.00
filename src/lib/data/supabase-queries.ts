/**
 * Supabase Data Queries
 * 
 * Centralized query layer for fetching live data from Supabase.
 * All field names match the database schema exactly (aligned with mock data).
 * 
 * Usage:
 *   const { data, error } = await fetchProductions(supabase, { status: 'active' })
 */

import { SupabaseClient } from '@supabase/supabase-js'

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: 'asc' | 'desc'
  filters?: Record<string, unknown>
}

export interface QueryResult<T> {
  data: T[] | null
  error: Error | null
  count?: number
}

// ==================== PROJECTS MODULE ====================

export async function fetchProductions(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('productions')
      .select(`
        id, name, code, type, description, status, priority,
        start_date, end_date, venue_id, project_manager_id,
        budget, budget_spent, budget_currency, health, progress,
        tags, team_members, created_by, created_at, updated_at
      `, { count: 'exact' })

    // Apply filters
    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply ordering
    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc' 
      })
    }

    // Apply pagination
    if (options.limit) {
      query = query.limit(options.limit)
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error, count } = await query

    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

export async function fetchProjectTasks(
  supabase: SupabaseClient,
  productionId?: string,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('project_tasks')
      .select(`
        id, production_id, name, description, status, priority,
        assignee_id, due_date, completed_date, estimated_hours,
        actual_hours, tags, created_at, updated_at
      `, { count: 'exact' })

    if (productionId) {
      query = query.eq('production_id', productionId)
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== PEOPLE MODULE ====================

export async function fetchPersonnel(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('personnel')
      .select(`
        id, first_name, last_name, email, phone, employee_id,
        employment_type, employment_status, department, title,
        hire_date, termination_date, hourly_rate, salary,
        tags, created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

export async function fetchTimeEntries(
  supabase: SupabaseClient,
  personId?: string,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('time_entries')
      .select(`
        id, person_id, production_id, date, start_time, end_time,
        hours, break_minutes, overtime_hours, billable, rate,
        description, status, created_at, updated_at
      `, { count: 'exact' })

    if (personId) {
      query = query.eq('person_id', personId)
    }

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== EVENTS MODULE ====================

export async function fetchEvents(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('events')
      .select(`
        id, name, description, type, status, start_time, end_time,
        all_day, timezone, venue_id, production_id, capacity,
        registered_count, is_recurring, recurrence_rule,
        created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== ASSETS MODULE ====================

export async function fetchAssets(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('assets')
      .select(`
        id, name, description, type, category, asset_tag,
        serial_number, manufacturer, purchase_price, current_value,
        status, condition, location_id, ownership,
        created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== FINANCE MODULE ====================

export async function fetchBudgets(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('budgets')
      .select(`
        id, production_id, name, description, total_amount,
        allocated_amount, spent_amount, currency, start_date,
        end_date, status, created_by, created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

export async function fetchInvoices(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('invoices')
      .select(`
        id, invoice_number, company_id, production_id, subtotal,
        tax, total, currency, issue_date, due_date, paid_date,
        status, notes, terms, created_by, created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== COMPANIES MODULE ====================

export async function fetchCompanies(
  supabase: SupabaseClient,
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from('companies')
      .select(`
        id, legal_name, display_name, type, industry, website,
        email, phone, address, city, state, postal_code, country,
        tax_id, payment_terms, rating, status, tags,
        created_by, created_at, updated_at
      `, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}

// ==================== GENERIC QUERY BUILDER ====================

export async function fetchModuleData(
  supabase: SupabaseClient,
  tableName: string,
  fields: string = '*',
  options: QueryOptions = {}
): Promise<QueryResult<unknown>> {
  try {
    let query = supabase
      .from(tableName)
      .select(fields, { count: 'exact' })

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          query = query.in(key, value)
        } else {
          query = query.eq(key, value)
        }
      })
    }

    if (options.orderBy) {
      query = query.order(options.orderBy, { 
        ascending: options.orderDirection === 'asc' 
      })
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error, count } = await query
    return { data, error, count: count || undefined }
  } catch (err: any) {
    return { data: null, error: err as Error }
  }
}
