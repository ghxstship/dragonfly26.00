'use client'

import { useState, useEffect } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, X, Loader2, Mail, Users } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { BRANDED_ROLES } from '@/lib/rbac/role-definitions'
import type { RoleSlug } from '@/types/rbac'

interface Invite {
  email: string
  role: RoleSlug
  message: string
}

export default function InviteColleaguesPage() {
  const router = useRouter()
  const locale = useLocale()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [invites, setInvites] = useState<Invite[]>([
    { email: '', role: 'raider', message: '' }
  ])
  const [workspaceId, setWorkspaceId] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')

  useEffect(() => {
    const wId = searchParams.get('workspace')
    if (!wId) {
      router.push('/onboarding/workspace')
      return
    }
    setWorkspaceId(wId)
    loadWorkspaceInfo(wId)
  }, [])

  const loadWorkspaceInfo = async (wId: string) => {
    const { data } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', wId)
      .single()

    if (data) {
      setWorkspaceName(data.name)
    }
  }

  const addInvite = () => {
    setInvites([...invites, { email: '', role: 'raider', message: '' }])
  }

  const removeInvite = (index: number) => {
    if (invites.length > 1) {
      setInvites(invites.filter((_, i) => i !== index))
    }
  }

  const updateInvite = (index: number, field: keyof Invite, value: string) => {
    const newInvites = [...invites]
    newInvites[index] = { ...newInvites[index], [field]: value }
    setInvites(newInvites)
  }

  const handleSendInvites = async () => {
    setLoading(true)

    try {
      const validInvites = invites.filter(inv => inv.email && inv.email.includes('@'))
      
      if (validInvites.length === 0) {
        // No invites to send, just continue
        router.push(`/onboarding/complete?workspace=${workspaceId}`)
        return
      }

      // Send invitations via API
      const response = await fetch('/api/invitations/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspaceId,
          invites: validInvites,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send invitations')
      }

      toast({
        title: 'Invitations sent!',
        description: `${validInvites.length} invitation(s) sent successfully.`,
      })

      router.push(`/onboarding/complete?workspace=${workspaceId}`)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    router.push(`/${locale}/onboarding/complete?workspace=${workspaceId}`)
  }

  // Available roles for invitation (excluding platform-level roles)
  const availableRoles = ['raider', 'deviator', 'navigator', 'gladiator'] as RoleSlug[]

  return (
    <div className="container max-w-3xl min-h-screen py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Invite your team</h1>
          <p className="text-muted-foreground text-lg">
            Collaborate with colleagues in {workspaceName || 'your workspace'}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
        </div>

        {/* Invitation form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Team Invitations</CardTitle>
            </div>
            <CardDescription>
              Invite people via email. They&apos;ll receive an invitation link.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Invites list */}
            <div className="space-y-4">
              {invites.map((invite, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-3">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>
                          Email {index === 0 && <span className="text-muted-foreground">(optional)</span>}
                        </Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          placeholder="colleague@example.com"
                          value={invite.email}
                          onChange={(e) => updateInvite(index, 'email', e.target.value)}
                        />
                      </div>

                      {/* Role */}
                      <div className="space-y-2">
                        <Label htmlFor={`role-${index}`}>Role</Label>
                        <Select
                          value={invite.role}
                          onValueChange={(value) => updateInvite(index, 'role', value)}
                        >
                          <SelectTrigger id={`role-${index}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableRoles.map((roleSlug) => {
                              const role = BRANDED_ROLES[roleSlug]
                              return (
                                <SelectItem key={roleSlug} value={roleSlug}>
                                  <div className="flex items-center gap-2">
                                    <span>{role.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      ({role.badge})
                                    </span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          {BRANDED_ROLES[invite.role].description}
                        </p>
                      </div>

                      {/* Personal message */}
                      {index === 0 && (
                        <div className="space-y-2">
                          <Label htmlFor="message">Personal Message (optional)</Label>
                          <Textarea
                            id="message"
                            placeholder="Add a personal note to your invitations..."
                            value={invite.message}
                            onChange={(e) => updateInvite(index, 'message', e.target.value)}
                            rows={2}
                          />
                        </div>
                      )}
                    </div>

                    {/* Remove button */}
                    {invites.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInvite(index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add more button */}
            <Button
              variant="outline"
              onClick={addInvite}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Person
            </Button>

            {/* Info */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Users className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Team roles explained</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li><strong>Raider</strong> - Team member (task execution)</li>
                    <li><strong>Deviator</strong> - Team lead (crew coordination)</li>
                    <li><strong>Navigator</strong> - Area manager (zone operations)</li>
                    <li><strong>Gladiator</strong> - Project manager (full project control)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1"
              >
                Skip for now
              </Button>
              <Button
                onClick={handleSendInvites}
                disabled={loading}
                className="flex-1"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {invites.some(inv => inv.email) ? 'Send Invitations' : 'Continue'}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              You can always invite more people later from workspace settings
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
