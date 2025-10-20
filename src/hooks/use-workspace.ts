'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Hook to resolve workspace ID from slug or UUID
 * Handles special cases like "personal" to fetch the user's default workspace
 */
export function useWorkspace(workspaceIdOrSlug: string) {
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [workspace, setWorkspace] = useState<unknown>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function resolveWorkspace() {
      try {
        setLoading(true)
        setError(null)

        // Check if it's already a valid UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        const isUUID = uuidRegex.test(workspaceIdOrSlug)

        if (isUUID) {
          // It's already a UUID, fetch the workspace
          const { data, error: fetchError } = await supabase
            .from('workspaces')
            .select('*')
            .eq('id', workspaceIdOrSlug)
            .single()

          if (fetchError) throw fetchError
          
          setWorkspace(data)
          setWorkspaceId(data.id)
        } else {
          // It's a slug, need to resolve it
          // Special case: "personal" means the user's default workspace
          if (workspaceIdOrSlug === 'personal') {
            // Get the current user
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
              throw new Error('User not authenticated')
            }

            // Get user's organizations
            const { data: memberships, error: memberError } = await supabase
              .from('organization_members')
              .select('organization_id')
              .eq('user_id', user.id)
              .limit(1)

            if (memberError) throw memberError

            if (!memberships || memberships.length === 0) {
              throw new Error('User is not a member of any organization')
            }

            const membership = memberships[0]

            // Get the default workspace for this organization
            const { data: defaultWorkspace, error: workspaceError } = await supabase
              .from('workspaces')
              .select('*')
              .eq('organization_id', membership.organization_id)
              .eq('is_default', true)
              .single()

            if (workspaceError) {
              // If no default workspace, get the first workspace
              const { data: firstWorkspaces, error: firstError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('organization_id', membership.organization_id)
                .order('created_at', { ascending: true })
                .limit(1)

              if (firstError) throw firstError
              
              if (!firstWorkspaces || firstWorkspaces.length === 0) {
                throw new Error('No workspaces found for this organization')
              }
              
              const firstWorkspace = firstWorkspaces[0]
              setWorkspace(firstWorkspace)
              setWorkspaceId(firstWorkspace.id)
            } else {
              setWorkspace(defaultWorkspace)
              setWorkspaceId(defaultWorkspace.id)
            }
          } else {
            // Try to find workspace by name (treating slug as name)
            const { data: { user } } = await supabase.auth.getUser()
            
            if (!user) {
              throw new Error('User not authenticated')
            }

            // Get user's organization IDs
            const { data: memberships, error: memberError } = await supabase
              .from('organization_members')
              .select('organization_id')
              .eq('user_id', user.id)

            if (memberError) throw memberError

            if (!memberships || memberships.length === 0) {
              throw new Error('User is not a member of any organization')
            }

            const orgIds = memberships.map((m: any) => m.organization_id)

            // Find workspace by name in user's organizations
            const { data: workspacesByName, error: nameError } = await supabase
              .from('workspaces')
              .select('*')
              .in('organization_id', orgIds)
              .ilike('name', workspaceIdOrSlug)
              .limit(1)

            if (nameError) {
              throw new Error(`Workspace "${workspaceIdOrSlug}" not found`)
            }

            if (!workspacesByName || workspacesByName.length === 0) {
              throw new Error(`Workspace "${workspaceIdOrSlug}" not found`)
            }

            const workspaceByName = workspacesByName[0]
            setWorkspace(workspaceByName)
            setWorkspaceId(workspaceByName.id)
          }
        }
      } catch (err: any) {
        console.error('Error resolving workspace:', err)
        setError(err as Error)
        setWorkspaceId(null)
        setWorkspace(null)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceIdOrSlug) {
      resolveWorkspace()
    }
  }, [workspaceIdOrSlug])

  return { workspaceId, workspace, loading, error }
}
