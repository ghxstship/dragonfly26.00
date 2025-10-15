import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface MemberLevel {
  points: number
  level: number
  rank_position: number | null
  posts_count: number
  comments_count: number
  likes_given: number
  likes_received: number
  badges: any[]
  last_active_at: string
}

export function useMemberLevel(workspaceId: string, userId: string) {
  const [level, setLevel] = useState<MemberLevel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClient()
  
  useEffect(() => {
    if (!workspaceId || !userId) {
      setLoading(false)
      return
    }
    
    async function fetchLevel() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .from('community_member_levels')
          .select('*')
          .eq('workspace_id', workspaceId)
          .eq('user_id', userId)
          .single()
        
        if (fetchError) {
          // If user doesn't have a level record yet, return default
          if (fetchError.code === 'PGRST116') {
            setLevel({
              points: 0,
              level: 1,
              rank_position: null,
              posts_count: 0,
              comments_count: 0,
              likes_given: 0,
              likes_received: 0,
              badges: [],
              last_active_at: new Date().toISOString()
            })
          } else {
            throw fetchError
          }
        } else {
          setLevel(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch member level'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchLevel()
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`member-level:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'community_member_levels',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            setLevel(payload.new as MemberLevel)
          }
        }
      )
      .subscribe()
    
    return () => {
      channel.unsubscribe()
    }
  }, [workspaceId, userId])
  
  return { level, loading, error }
}

// Hook to fetch member stats using the database function
export function useMemberStats(workspaceId: string, userId: string) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClient()
  
  useEffect(() => {
    if (!workspaceId || !userId) {
      setLoading(false)
      return
    }
    
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error: fetchError } = await supabase
          .rpc('get_member_stats', {
            p_workspace_id: workspaceId,
            p_user_id: userId
          })
        
        if (fetchError) throw fetchError
        
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch member stats'))
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [workspaceId, userId])
  
  return { stats, loading, error }
}
