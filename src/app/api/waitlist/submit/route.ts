/**
 * Waitlist Submission API Route
 * POST /api/waitlist/submit
 * 
 * Allows unauthenticated users to submit waitlist applications
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  validateWaitlistSubmission, 
  hasWaitlistErrors,
  sanitizeWaitlistInput 
} from '@/lib/validations/waitlist'
import type { WaitlistSubmitRequest, WaitlistSubmitResponse } from '@/types/waitlist'

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistSubmitRequest = await request.json()
    
    // Validate input
    const errors = validateWaitlistSubmission(body)
    if (hasWaitlistErrors(errors)) {
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
    const sanitized = sanitizeWaitlistInput(body)
    
    const supabase = await createClient()

    // Check if email already exists in waitlist
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id, status')
      .eq('email', sanitized.email)
      .single()

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'This email is already on the waitlist',
          status: existing.status,
        },
        { status: 409 }
      )
    }

    // Check if email already has a user account
    // Note: This requires service_role client for admin.listUsers()
    // For now, we'll skip this check and let signup handle it
    // TODO: Implement proper email existence check with service role client

    // If invite code provided, validate it
    let inviteCodeValid = false
    let autoApprove = false
    
    if (sanitized.invite_code) {
      const { data: validationResult } = await supabase
        .rpc('validate_invite_code', {
          p_code: sanitized.invite_code,
          p_email: sanitized.email
        })

      if (validationResult?.valid) {
        inviteCodeValid = true
        autoApprove = validationResult.auto_approve || false
        
        // Record invite code usage
        await supabase.rpc('record_invite_code_usage', {
          p_code_id: validationResult.code_id,
          p_email: sanitized.email,
          p_ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          p_user_agent: request.headers.get('user-agent')
        })
      }
    }

    // Create waitlist entry
    const { data: waitlistEntry, error: insertError } = await supabase
      .from('waitlist')
      .insert({
        email: sanitized.email,
        full_name: sanitized.full_name,
        company: sanitized.company,
        role: sanitized.role,
        use_case: sanitized.use_case,
        referral_source: sanitized.referral_source,
        status: autoApprove ? 'approved' : 'pending',
        metadata: {
          invite_code_used: inviteCodeValid,
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent'),
        }
      })
      .select()
      .single()

    if (insertError) {
      console.error('Waitlist insert error:', insertError)
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to submit waitlist application',
        },
        { status: 500 }
      )
    }

    // Get waitlist position
    const { data: position } = await supabase
      .rpc('get_waitlist_position', { p_email: sanitized.email })

    // TODO: Send confirmation email
    // await sendWaitlistConfirmationEmail(sanitized.email, sanitized.full_name, position)

    const response: WaitlistSubmitResponse = {
      success: true,
      message: autoApprove 
        ? 'Application approved! You will receive an invitation shortly.'
        : 'Successfully joined the waitlist! We\'ll notify you when a spot opens up.',
      status: waitlistEntry.status,
      position: position || undefined,
      waitlist_id: waitlistEntry.id,
    }

    return NextResponse.json(response, { status: 201 })

  } catch (error) {
    console.error('Waitlist submission error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred',
      },
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
