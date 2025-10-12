'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Building2, Users, Loader2, Plus, Check } from 'lucide-react'
import { useToast } from '@/lib/hooks/use-toast'
import { permissionService } from '@/lib/rbac/permission-service'

export default function WorkspacePage() {
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [existingWorkspaces, setExistingWorkspaces] = useState<any[]>([])
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    slug: '',
    description: '',
  })

  useEffect(() => {
    loadExistingWorkspaces()
  }, [])

  const loadExistingWorkspaces = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Check if user has existing workspace memberships
    const { data } = await supabase
      .from('workspace_members')
      .select(`
        *,
        workspace:workspaces(*)
      `)
      .eq('user_id', user.id)

    if (data) {
      setExistingWorkspaces(data.map(m => m.workspace).filter(Boolean))
    }
  }

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: newWorkspace.name,
          slug: newWorkspace.slug || newWorkspace.name.toLowerCase().replace(/\s+/g, '-'),
        })
        .select()
        .single()

      if (orgError) throw orgError

      // Create workspace
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: newWorkspace.name,
          slug: newWorkspace.slug || newWorkspace.name.toLowerCase().replace(/\s+/g, '-'),
          description: newWorkspace.description,
          organization_id: org.id,
        })
        .select()
        .single()

      if (workspaceError) throw workspaceError

      // Add user as workspace member
      await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspace.id,
          organization_id: org.id,
          user_id: user.id,
          role: 'owner',
        })

      // Assign Phantom role (Organization admin) as creator
      await permissionService.assignRole(
        user.id,
        'phantom', // Organization super admin
        'system',
        {
          workspaceId: workspace.id,
          organizationId: org.id,
          notes: 'Organization creator - assigned during onboarding',
        }
      )

      // Create free subscription
      await supabase
        .from('subscriptions')
        .insert({
          organization_id: org.id,
          workspace_id: workspace.id,
          plan_id: 'free',
          status: 'active',
        })

      toast({
        title: 'Workspace created!',
        description: `${newWorkspace.name} is ready to go.`,
      })

      // Move to plan selection
      router.push(`/onboarding/plan?workspace=${workspace.id}`)
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

  const handleJoinWorkspace = async (workspaceId: string) => {
    router.push(`/onboarding/plan?workspace=${workspaceId}`)
  }

  return (
    <div className="container max-w-4xl min-h-screen flex items-center justify-center py-12">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Set up your workspace</h1>
          <p className="text-muted-foreground text-lg">
            Create a new workspace or join an existing one
          </p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-primary rounded-full" />
          <div className="h-2 w-12 bg-muted rounded-full" />
          <div className="h-2 w-12 bg-muted rounded-full" />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New</TabsTrigger>
            <TabsTrigger value="join">Join Existing</TabsTrigger>
          </TabsList>

          {/* Create workspace */}
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <CardTitle>Create Workspace</CardTitle>
                </div>
                <CardDescription>
                  Set up a new workspace for your team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateWorkspace} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Workspace Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="ACME Productions"
                      value={newWorkspace.name}
                      onChange={(e) => {
                        const name = e.target.value
                        setNewWorkspace({
                          ...newWorkspace,
                          name,
                          slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                        })
                      }}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">
                      Workspace URL
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">app.com/</span>
                      <Input
                        id="slug"
                        placeholder="acme-productions"
                        value={newWorkspace.slug}
                        onChange={(e) => setNewWorkspace({
                          ...newWorkspace,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                        })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description
                    </Label>
                    <Input
                      id="description"
                      placeholder="Brief description of your workspace"
                      value={newWorkspace.description}
                      onChange={(e) => setNewWorkspace({
                        ...newWorkspace,
                        description: e.target.value,
                      })}
                    />
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm font-medium">You&apos;ll receive:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Organization Admin (Phantom) role
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Full access to workspace settings
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Ability to invite team members
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !newWorkspace.name}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Workspace
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Join workspace */}
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Join Workspace</CardTitle>
                </div>
                <CardDescription>
                  Join an existing workspace you&apos;ve been invited to
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {existingWorkspaces.length > 0 ? (
                  <div className="space-y-3">
                    {existingWorkspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{workspace.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {workspace.description || 'No description'}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleJoinWorkspace(workspace.id)}
                        >
                          Continue
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      No existing workspaces found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Create a new workspace or ask a team member to invite you
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
