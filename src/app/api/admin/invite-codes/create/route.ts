/**
 * Admin Invite Code Create API Route
 * POST /api/admin/invite-codes/create
 * 
 * Create new invite code (admin only)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  validateInviteCode, 
  hasInviteCodeErrors,
  sanitizeInviteCodeInput 
} from '@/lib/validations/waitlist'
import type { InviteCodeCreate } from '@/types/waitlist'

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

    const body: InviteCodeCreate = await request.json()

    // Validate input
    const errors = validateInviteCode(body)
    if (hasInviteCodeErrors(errors)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors 
        },
        { status: 400 }
      )
    }

    // Sanitize input
    const sanitized = sanitizeInviteCodeInput(body)

    // Check if code already exists
    const { data: existing } = await supabase
      .from('invite_codes')
      .select('id')
      .eq('code', sanitized.code)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Invite code already exists' },
        { status: 409 }
      )
    }

    // Create invite code
    const { data: inviteCode, error: insertError } = await supabase
      .from('invite_codes')
      .insert({
        code: sanitized.code,
        description: sanitized.description,
        max_uses: sanitized.max_uses,
        valid_from: body.valid_from || new Date().toISOString(),
        valid_until: sanitized.valid_until,
        allowed_domains: sanitized.allowed_domains,
        auto_approve: body.auto_approve || false,
        default_role_slug: sanitized.default_role_slug,
        is_active: true,
        created_by: user.id,
      })
      .select()
      .single()

    if (insertError || !inviteCode) {
      console.error('Invite code creation error:', insertError)
      return NextResponse.json(
        { error: 'Failed to create invite code' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        invite_code: inviteCode,
        message: 'Invite code created successfully',
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Invite code creation error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
