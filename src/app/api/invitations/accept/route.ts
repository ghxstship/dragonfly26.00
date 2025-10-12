import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { permissionService } from '@/lib/rbac/permission-service'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Missing invitation token' },
        { status: 400 }
      )
    }

    // Find invitation
    const { data: invitation, error: inviteError } = await supabase
      .from('invitations')
      .select('*, workspace:workspaces(id, name), organization:organizations(id, name)')
      .eq('token', token)
      .eq('status', 'pending')
      .single()

    if (inviteError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 404 }
      )
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      await supabase
        .from('invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id)

      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 410 }
      )
    }

    // Check if user's email matches invitation
    if (user.email?.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email mismatch. Please sign in with the invited email.' },
        { status: 403 }
      )
    }

    // Add user to workspace
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: invitation.workspace_id,
        organization_id: invitation.organization_id,
        user_id: user.id,
        role: 'member',
      })

    if (memberError) {
      // Check if already a member
      if (memberError.code === '23505') { // Unique violation
        // Update invitation status anyway
        await supabase
          .from('invitations')
          .update({
            status: 'accepted',
            accepted_at: new Date().toISOString(),
            accepted_by: user.id,
          })
          .eq('id', invitation.id)

        return NextResponse.json({
          success: true,
          workspaceId: invitation.workspace_id,
          message: 'You are already a member of this workspace',
        })
      }

      console.error('Error adding workspace member:', memberError)
      return NextResponse.json(
        { error: 'Failed to join workspace' },
        { status: 500 }
      )
    }

    // Assign role to user
    await permissionService.assignRole(
      user.id,
      invitation.role_slug as any,
      invitation.invited_by,
      {
        workspaceId: invitation.workspace_id,
        organizationId: invitation.organization_id,
        projectId: invitation.project_id || undefined,
        teamId: invitation.team_id || undefined,
        departmentId: invitation.department_id || undefined,
        notes: `Accepted invitation from ${invitation.inviter_name || 'team member'}`,
      }
    )

    // Mark invitation as accepted
    await supabase
      .from('invitations')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        accepted_by: user.id,
      })
      .eq('id', invitation.id)

    return NextResponse.json({
      success: true,
      workspaceId: invitation.workspace_id,
      workspaceName: invitation.workspace.name,
      organizationName: invitation.organization.name,
    })
  } catch (error: any) {
    console.error('Accept invitation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to accept invitation' },
      { status: 500 }
    )
  }
}
