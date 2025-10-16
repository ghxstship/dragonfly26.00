'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Mail, UserCheck, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { BRANDED_ROLES } from '@/lib/rbac/role-definitions'

interface InvitationData {
  workspace: { name: string }
  organization: { name: string }
  role_slug: string
  inviter_name: string
  message: string
  email: string
  expires_at: string
}

interface AcceptInvitationPageProps {
  params: Promise<{
    locale: string
    token: string
  }>
}

export default function AcceptInvitationPage({ params }: AcceptInvitationPageProps) {
  const { token } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthAndLoadInvitation()
  }, [])

  const checkAuthAndLoadInvitation = async () => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)

      // Load invitation details
      const { data, error: inviteError } = await supabase
        .from('invitations')
        .select('*, workspace:workspaces(name), organization:organizations(name)')
        .eq('token', token)
        .eq('status', 'pending')
        .single()

      if (inviteError || !data) {
        setError('This invitation is invalid or has expired')
      } else if (new Date(data.expires_at) < new Date()) {
        setError('This invitation has expired')
      } else {
        setInvitation(data as any)
      }
    } catch (err: any) {
      setError('Failed to load invitation')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    setAccepting(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        // Redirect to signup with invitation context
        router.push(`/signup?invite=${token}`)
        return
      }

      // Accept invitation
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to accept invitation')
      }

      const result = await response.json()

      toast({
        title: 'Invitation accepted!',
        description: `Welcome to ${result.workspaceName}`,
      })

      // Redirect to workspace
      router.push(`/workspace/${result.workspaceId}`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-2xl min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="container max-w-2xl min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const role = BRANDED_ROLES[invitation.role_slug as keyof typeof BRANDED_ROLES]

  return (
    <div className="container max-w-2xl min-h-screen flex items-center justify-center py-12">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold">You&apos;ve been invited!</h1>
          <p className="text-muted-foreground text-lg">
            {invitation.inviter_name} invited you to join their team
          </p>
        </div>

        {/* Invitation details */}
        <Card>
          <CardHeader>
            <CardTitle>Invitation Details</CardTitle>
            <CardDescription>
              Review the details below before accepting
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Organization */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Organization</p>
                <p className="text-sm text-muted-foreground">
                  {invitation.organization.name}
                </p>
              </div>
            </div>

            {/* Workspace */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Workspace</p>
                <p className="text-sm text-muted-foreground">
                  {invitation.workspace.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <Mail className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Invited Email</p>
                <p className="text-sm text-muted-foreground">
                  {invitation.email}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <UserCheck className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Your Role</p>
                <p className="text-sm">
                  <strong>{role.name}</strong> ({role.badge})
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {role.description}
                </p>
              </div>
            </div>

            {/* Personal message */}
            {invitation.message && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">Personal Message</p>
                <p className="text-sm text-muted-foreground italic">
                  &ldquo;{invitation.message}&rdquo;
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 space-y-3">
              <Button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full"
                size="lg"
              >
                {accepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAuthenticated ? 'Accept Invitation' : 'Sign Up & Accept'}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-center text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href={`/login?invite=${token}`}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              This invitation expires on{' '}
              {new Date(invitation.expires_at).toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
