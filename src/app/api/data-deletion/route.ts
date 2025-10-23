import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/data-deletion
 * 
 * GDPR "Right to be Forgotten" - Delete all user data
 * 
 * WARNING: This is irreversible!
 * 
 * @body { confirmEmail: string, confirmPassword: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { confirmEmail, confirmPassword } = body

    // Verify email matches
    if (confirmEmail !== user.email) {
      return NextResponse.json(
        { error: 'Email confirmation does not match' },
        { status: 400 }
      )
    }

    // Re-authenticate with password for extra security
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: confirmEmail,
      password: confirmPassword,
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    // Start deletion process
    // Note: This should be done in a transaction or background job for safety
    
    // 1. Anonymize audit logs (keep for compliance, but remove PII)
    await supabase
      .from('audit_logs')
      .update({
        metadata: { anonymized: true, original_user_id: user.id },
      })
      .eq('user_id', user.id)

    // 2. Delete user-created content
    const tablesToDelete = [
      'comments',
      'files',
      'tasks',
      'workspace_members',
      'organization_members',
      'user_settings',
      'profiles',
    ]

    for (const table of tablesToDelete) {
      await supabase
        .from(table)
        .delete()
        .eq('user_id', user.id)
        .or(`created_by.eq.${user.id}`)
    }

    // 3. Delete auth user (this will cascade delete related data)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    
    if (deleteError) {
      throw deleteError
    }

    // Log deletion request
    console.log(`User data deletion completed for user: ${user.id}`)

    return NextResponse.json({
      success: true,
      message: 'All user data has been permanently deleted',
      deletedAt: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Data deletion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete user data' },
      { status: 500 }
    )
  }
}
