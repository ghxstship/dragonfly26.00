/**
 * Waitlist Check API Route
 * GET /api/waitlist/check?email=user@example.com
 * 
 * Check waitlist status for an email address
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidEmail, normalizeEmail } from '@/lib/validations/waitlist'
import type { WaitlistCheckResponse } from '@/types/waitlist'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    const normalizedEmail = normalizeEmail(email)
    const supabase = await createClient()

    // Get waitlist entry
    const { data: entry, error } = await supabase
      .from('waitlist')
      .select('id, status, created_at')
      .eq('email', normalizedEmail)
      .single()

    if (error || !entry) {
      const response: WaitlistCheckResponse = {
        exists: false,
      }
      return NextResponse.json(response)
    }

    // Get position if pending
    let position: number | undefined
    if (entry.status === 'pending') {
      const { data: positionData } = await supabase
        .rpc('get_waitlist_position', { p_email: normalizedEmail })
      position = positionData || undefined
    }

    // Get estimated wait time
    let estimated_wait_hours: number | undefined
    if (entry.status === 'pending') {
      const { data: stats } = await supabase.rpc('get_waitlist_stats')
      if (stats?.avg_wait_hours) {
        estimated_wait_hours = Math.round(stats.avg_wait_hours)
      }
    }

    const response: WaitlistCheckResponse = {
      exists: true,
      status: entry.status,
      position,
      estimated_wait_hours,
      created_at: entry.created_at,
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Waitlist check error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
