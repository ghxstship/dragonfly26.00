/**
 * Admin Waitlist List API Route
 * GET /api/admin/waitlist/list
 * 
 * Get paginated list of waitlist entries (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { WaitlistListParams, WaitlistListResponse } from '@/types/waitlist'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check Legend permissions (level 1 only)
    const { data: roles } = await supabase
      .from('user_role_assignments')
      .select('role:roles(level)')
      .eq('user_id', user.id)

    const isLegend = roles?.some((r: any) => r.role?.level === 1)
    if (!isLegend) {
      return NextResponse.json(
        { error: 'Forbidden - Legend access required' },
        { status: 403 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const params: WaitlistListParams = {
      status: searchParams.get('status') as any || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '50'), 100),
      sort: searchParams.get('sort') as any || 'created_at',
      order: searchParams.get('order') as any || 'desc',
      search: searchParams.get('search') || undefined,
    }

    // Build query
    let query = supabase
      .from('waitlist')
      .select('*', { count: 'exact' })

    // Apply filters
    if (params.status) {
      query = query.eq('status', params.status)
    }

    if (params.search) {
      query = query.or(`email.ilike.%${params.search}%,full_name.ilike.%${params.search}%,company.ilike.%${params.search}%`)
    }

    // Apply sorting
    const sortColumn = params.sort || 'created_at'
    const sortOrder = params.order === 'asc' ? { ascending: true } : { ascending: false }
    query = query.order(sortColumn, sortOrder)

    // Apply pagination
    const from = ((params.page || 1) - 1) * (params.limit || 50)
    const to = from + (params.limit || 50) - 1
    query = query.range(from, to)

    // Execute query
    const { data: entries, error, count } = await query

    if (error) {
      console.error('Waitlist list error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch waitlist entries' },
        { status: 500 }
      )
    }

    const response: WaitlistListResponse = {
      entries: entries || [],
      total: count || 0,
      page: params.page || 1,
      pages: Math.ceil((count || 0) / (params.limit || 50)),
      limit: params.limit || 50,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Waitlist list error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
