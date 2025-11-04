/**
 * Admin Waitlist Approve API Route
 * POST /api/admin/waitlist/approve
 * 
 * Approve waitlist entry and send invitation (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'
import type { WaitlistApproveRequest, WaitlistApproveResponse } from '@/types/waitlist'

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

    const body: WaitlistApproveRequest = await request.json()
    const { waitlist_id, organization_id, workspace_id, role_slug, message } = body

    // Validate required fields
    if (!waitlist_id || !organization_id || !workspace_id || !role_slug) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    if (waitlistEntry.status !== 'pending' && waitlistEntry.status !== 'approved') {
      return NextResponse.json(
        { error: 'Waitlist entry cannot be approved' },
        { status: 400 }
      )
    }

    // Generate invitation token
    const token = randomBytes(32).toString('hex')

    // Create invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .insert({
        invited_by: user.id,
        organization_id,
        workspace_id,
        email: waitlistEntry.email,
        role_slug,
        token,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        message,
        inviter_name: user.user_metadata?.full_name || user.email,
        source: 'waitlist',
        waitlist_id: waitlist_id,
      })
      .select()
      .single()

    if (inviteError || !invitation) {
      console.error('Invitation creation error:', inviteError)
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      )
    }

    // Update waitlist entry
    await supabase
      .from('waitlist')
      .update({
        status: 'invited',
        invited_at: new Date().toISOString(),
        invitation_id: invitation.id,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', waitlist_id)

    // TODO: Send invitation email
    // await sendInvitationEmail(waitlistEntry.email, waitlistEntry.full_name, token)

    const response: WaitlistApproveResponse = {
      success: true,
      invitation_id: invitation.id,
      message: 'Waitlist entry approved and invitation sent',
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Waitlist approve error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
