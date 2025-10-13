import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { workspaceId, invites } = body

    if (!workspaceId || !Array.isArray(invites) || invites.length === 0) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Get workspace and organization
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .select('id, name, organization_id')
      .eq('id', workspaceId)
      .single()

    if (workspaceError || !workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      )
    }

    // Get inviter profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    const inviterName = profile?.name || user.email

    // Create invitations
    const invitationRecords = invites.map((invite) => ({
      invited_by: user.id,
      organization_id: workspace.organization_id,
      workspace_id: workspaceId,
      email: invite.email.toLowerCase(),
      role_slug: invite.role,
      message: invite.message || null,
      inviter_name: inviterName,
      token: randomBytes(32).toString('hex'),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      status: 'pending',
    }))

    const { data: createdInvites, error: inviteError } = await supabase
      .from('invitations')
      .insert(invitationRecords)
      .select()

    if (inviteError) {
      console.error('Error creating invitations:', inviteError)
      return NextResponse.json(
        { error: 'Failed to create invitations' },
        { status: 500 }
      )
    }

    // TODO: Send invitation emails
    // For now, we'll just return the invitation tokens
    // In production, integrate with Resend, SendGrid, or similar

    const invitationLinks = createdInvites.map((inv) => ({
      email: inv.email,
      link: `${process.env.NEXT_PUBLIC_APP_URL}/invite/${inv.token}`,
    }))

    return NextResponse.json({
      success: true,
      invitations: invitationLinks,
      count: createdInvites.length,
    })
  } catch (error: any) {
    console.error('Send invitations error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send invitations' },
      { status: 500 }
    )
  }
}
