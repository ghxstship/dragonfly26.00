"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useCollaborationStore, type ActivityData } from "@/store/collaboration-store"
import { useToast } from "@/lib/hooks/use-toast"

export function ActivityFeed() {
  const t = useTranslations()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const { currentWorkspace } = useUIStore()
  const { activities, setActivities, addActivity } = useCollaborationStore()
  
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!currentWorkspace?.id) return
      
      try {
        const { data, error } = await supabase
          .from('activities')
          .select(`
            id,
            user_id,
            action,
            entity_type,
            entity_id,
            metadata,
            created_at
          `)
          .eq('workspace_id', currentWorkspace.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) throw error
        
        // Transform activities
        const transformedActivities: ActivityData[] = (data || []).map((activity: any) => {
          const isCurrentUser = currentUser && activity.user_id === currentUser.id
          
          return {
            id: activity.id,
            workspace_id: currentWorkspace.id,
            user_id: activity.user_id,
            action: activity.action,
            entity_type: activity.entity_type,
            entity_id: activity.entity_id,
            metadata: activity.metadata,
            created_at: activity.created_at,
            user: isCurrentUser ? {
              id: currentUser.id,
              email: currentUser.email || 'Unknown',
              name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
              avatar_url: currentUser.user_metadata?.avatar_url,
            } : {
              id: activity.user_id,
              email: 'User',
              name: `User ${activity.user_id.slice(0, 8)}`,
              avatar_url: undefined,
            }
          }
        })
        
        setActivities(transformedActivities)
      } catch (error: any) {
        console.error('Error fetching activities:', error)
        toast({
          title: "Error",
          description: "Failed to load activity feed",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [supabase, currentWorkspace?.id, currentUser, setActivities, toast])

  // Subscribe to real-time changes
  useEffect(() => {
    if (!currentWorkspace?.id) return

    const channel = supabase
      .channel(`activities:${currentWorkspace.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'activities',
          filter: `workspace_id=eq.${currentWorkspace.id}`,
        },
        async (payload) => {
          const data = payload.new as any
          const isCurrentUser = currentUser && data.user_id === currentUser.id
          
          const transformedActivity: ActivityData = {
            id: data.id,
            workspace_id: currentWorkspace.id,
            user_id: data.user_id,
            action: data.action,
            entity_type: data.entity_type,
            entity_id: data.entity_id,
            metadata: data.metadata,
            created_at: data.created_at,
            user: isCurrentUser ? {
              id: currentUser.id,
              email: currentUser.email || 'Unknown',
              name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
              avatar_url: currentUser.user_metadata?.avatar_url,
            } : {
              id: data.user_id,
              email: 'User',
              name: `User ${data.user_id.slice(0, 8)}`,
              avatar_url: undefined,
            }
          }

          addActivity(transformedActivity)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentWorkspace?.id, currentUser, addActivity])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }
  
  return (
    <div className="space-y-4 [&>*:first-child]:mt-0">
      {activities.length === 0 ? (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No activity yet
        </div>
      ) : (
        activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={activity.user?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(activity.user?.name || 'U')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm">
                <span className="font-medium">{activity.user?.name || 'User'}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>
                {activity.metadata?.status && (
                  <span className="font-medium"> {activity.metadata.status}</span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatDate(activity.created_at)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
