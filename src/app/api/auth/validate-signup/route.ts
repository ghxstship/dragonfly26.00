/**
 * Signup Validation API Route
 * POST /api/auth/validate-signup
 * 
 * Validates if an email is authorized to signup
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isValidEmail, normalizeEmail, normalizeInviteCode } from '@/lib/validations/waitlist'
import type { ValidateSignupRequest, ValidateSignupResponse } from '@/types/waitlist'

export async function POST(request: NextRequest) {
  try {
    const body: ValidateSignupRequest = await request.json()
    const { email, invite_code } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Method 1: Check for valid pending invitation
    const { data: invitation } = await supabase
      .from('invitations')
      .select('token, status, expires_at')
      .eq('email', normalizedEmail)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .single()

    if (invitation) {
      const response: ValidateSignupResponse = {
        authorized: true,
        invitation_token: invitation.token,
      }
      return NextResponse.json(response)
    }

    // Method 2: Check invite code if provided
    if (invite_code) {
      const normalizedCode = normalizeInviteCode(invite_code)
      
      const { data: validationResult } = await supabase
        .rpc('validate_invite_code', {
          p_code: normalizedCode,
          p_email: normalizedEmail
        })

      if (validationResult?.valid) {
        // Record usage
        await supabase.rpc('record_invite_code_usage', {
          p_code_id: validationResult.code_id,
          p_email: normalizedEmail,
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          p_user_agent: request.headers.get('user-agent')
        })

        const response: ValidateSignupResponse = {
          authorized: true,
          via_invite_code: true,
        }
        return NextResponse.json(response)
      }
    }

    // Not authorized - should join waitlist
    const response: ValidateSignupResponse = {
      authorized: false,
      reason: 'This platform is currently invite-only. Please join our waitlist to request access.',
    }
    return NextResponse.json(response)

  } catch (error) {
    console.error('Signup validation error:', error)
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
