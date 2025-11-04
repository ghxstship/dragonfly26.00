/**
 * Admin Waitlist Reject API Route
 * POST /api/admin/waitlist/reject
 * 
 * Reject waitlist entry (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { WaitlistRejectRequest, WaitlistRejectResponse } from '@/types/waitlist'

export async function POST(request: NextRequest) {
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

    const body: WaitlistRejectRequest = await request.json()
    const { waitlist_id, reason } = body

    if (!waitlist_id) {
      return NextResponse.json(
        { error: 'Waitlist ID is required' },
        { status: 400 }
      )
    }

    // Get waitlist entry
    const { data: waitlistEntry, error: fetchError } = await supabase
      .from('waitlist')
      .select('*')
      .eq('id', waitlist_id)
      .single()

    if (fetchError || !waitlistEntry) {
      return NextResponse.json(
        { error: 'Waitlist entry not found' },
        { status: 404 }
      )
    }

    if (waitlistEntry.status === 'rejected') {
      return NextResponse.json(
        { error: 'Waitlist entry is already rejected' },
        { status: 400 }
      )
    }

    // Update waitlist entry
    const { error: updateError } = await supabase
      .from('waitlist')
      .update({
        status: 'rejected',
        admin_notes: reason || null,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', waitlist_id)

    if (updateError) {
      console.error('Waitlist reject error:', updateError)
      return NextResponse.json(
        { error: 'Failed to reject waitlist entry' },
        { status: 500 }
      )
    }

    // TODO: Optionally send rejection email
    // if (reason) {
    //   await sendRejectionEmail(waitlistEntry.email, waitlistEntry.full_name, reason)
    // }

    const response: WaitlistRejectResponse = {
      success: true,
      message: 'Waitlist entry rejected',
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Waitlist reject error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
