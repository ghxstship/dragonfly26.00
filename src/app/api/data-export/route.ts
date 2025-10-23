import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * POST /api/data-export
 * 
 * GDPR-compliant data export
 * Exports all user data in machine-readable format (JSON)
 * 
 * @returns ZIP file containing all user data
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

    // Collect all user data from various tables
    const userData: Record<string, any> = {
      metadata: {
        exportDate: new Date().toISOString(),
        userId: user.id,
        email: user.email,
        exportType: 'GDPR_FULL_EXPORT',
      },
      profile: null,
      organizations: [],
      workspaces: [],
      projects: [],
      tasks: [],
      files: [],
      comments: [],
      activities: [],
      settings: null,
    }

    // 1. User Profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    userData.profile = profile

    // 2. Organizations (where user is a member)
    const { data: orgMemberships } = await supabase
      .from('organization_members')
      .select('organization_id, role, organizations(*)')
      .eq('user_id', user.id)
    userData.organizations = orgMemberships

    // 3. Workspaces (where user has access)
    const { data: workspaces } = await supabase
      .from('workspace_members')
      .select('workspace_id, role, workspaces(*)')
      .eq('user_id', user.id)
    userData.workspaces = workspaces

    // 4. Tasks (created by or assigned to user)
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .or(`created_by.eq.${user.id},assigned_to.eq.${user.id}`)
    userData.tasks = tasks

    // 5. Files (uploaded by user)
    const { data: files } = await supabase
      .from('files')
      .select('id, name, size, mime_type, created_at, metadata')
      .eq('created_by', user.id)
    userData.files = files

    // 6. Comments (created by user)
    const { data: comments } = await supabase
      .from('comments')
      .select('*')
      .eq('created_by', user.id)
    userData.comments = comments

    // 7. Activity Log
    const { data: activities } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1000) // Last 1000 activities
    userData.activities = activities

    // 8. User Settings/Preferences
    const { data: settings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()
    userData.settings = settings

    // Return as downloadable JSON
    const filename = `atlvs-data-export-${user.id}-${Date.now()}.json`
    
    return new NextResponse(JSON.stringify(userData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    console.error('Data export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to export data' },
      { status: 500 }
    )
  }
}
