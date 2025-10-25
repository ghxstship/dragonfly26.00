"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { LevelBadge } from "./level-badge"
import { cn } from "@/lib/utils"

interface LeaderboardEntry {
  user_id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  points: number
  level: number
  posts_count: number
  comments_count: number
  current_rank: number
}

interface LeaderboardProps {
  workspaceId: string
  limit?: number
  compact?: boolean
  showCurrentUser?: boolean
  currentUserId?: string
  className?: string
}

export function Leaderboard({
  workspaceId,
  limit = 10,
  compact = false,
  showCurrentUser = true,
  currentUserId,
  className
}: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalMembers, setTotalMembers] = useState(0)

  const supabase = createClient()

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        setLoading(true)

        // Fetch top entries from leaderboard view
        const { data: topData, error: topError } = await supabase
          .from('community_leaderboard')
          .select('*')
          .eq('workspace_id', workspaceId)
          .order('current_rank', { ascending: true })
          .limit(limit)

        if (topError) throw topError

        setEntries(topData || [])

        // Get total member count
        const { count } = await supabase
          .from('community_member_levels')
          .select('*', { count: 'exact', head: true })
          .eq('workspace_id', workspaceId)
          .gt('points', 0)

        setTotalMembers(count || 0)

        // If current user is not in top N, fetch their rank separately
        if (showCurrentUser && currentUserId) {
          const isInTop = topData?.some(entry => entry.user_id === currentUserId)
          
          if (!isInTop) {
            const { data: userData } = await supabase
              .from('community_leaderboard')
              .select('*')
              .eq('workspace_id', workspaceId)
              .eq('user_id', currentUserId)
              .single()

            if (userData) {
              setCurrentUserRank(userData)
            }
          }
        }
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId) {
      fetchLeaderboard()

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`leaderboard:${workspaceId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'community_member_levels',
            filter: `workspace_id=eq.${workspaceId}`
          },
          () => {
            fetchLeaderboard()
          }
        )
        .subscribe()

      return () => {
        channel.unsubscribe()
      }
    }
  }, [workspaceId, limit, showCurrentUser, currentUserId])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-amber-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-amber-700" />
    return null
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-wrap flex-col md:flex-row items-center gap-3 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className={compact ? "pb-3" : ""}>
        <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Leaderboard
        </CardTitle>
        {!compact && totalMembers > 0 && (
          <p className="text-sm text-muted-foreground">
            Top {Math.min(limit, totalMembers)} of {totalMembers} members
          </p>
        )}
      </CardHeader>
      <CardContent className={compact ? "pt-0" : ""}>
        <div className="space-y-3">
          {entries.map((entry: LeaderboardEntry, index: number) => (
            <div
              key={entry.user_id}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-muted/50",
                currentUserId === entry.user_id && "bg-primary/5 border border-primary/20"
              )}
            >
              {/* Rank */}
              <div className="flex flex-wrap items-center justify-center w-8 h-8 font-bold text-sm">
                {getRankIcon(entry.current_rank) || (
                  <span className="text-muted-foreground">#{entry.current_rank}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar_url || undefined} />
                <AvatarFallback>
                  {entry.first_name?.[0]}{entry.last_name?.[0]}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <p className="font-medium text-sm truncate">
                    {entry.first_name} {entry.last_name}
                  </p>
                  {currentUserId === entry.user_id && (
                    <Badge variant="secondary" className="text-xs">You</Badge>
                  )}
                </div>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
                  <LevelBadge level={entry.level} points={entry.points} size="sm" showTooltip={false} />
                  {!compact && (
                    <span className="text-xs text-muted-foreground">
                      {entry.posts_count} posts • {entry.comments_count} comments
                    </span>
                  )}
                </div>
              </div>

              {/* Points */}
              <div className="text-right">
                <p className="font-bold text-sm text-primary">
                  {entry.points.toLocaleString()}
                </p>
                {!compact && (
                  <p className="text-xs text-muted-foreground">points</p>
                )}
              </div>
            </div>
          ))}

          {/* Current user if not in top N */}
          {currentUserRank && currentUserId && (
            <>
              <div className="border-t pt-3 mt-3">
                <p className="text-xs text-muted-foreground mb-2">Your rank</p>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex flex-wrap items-center justify-center w-8 h-8 font-bold text-sm text-muted-foreground">
                    #{currentUserRank.current_rank}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUserRank.avatar_url || undefined} />
                    <AvatarFallback>
                      {currentUserRank.first_name?.[0]}{currentUserRank.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {currentUserRank.first_name} {currentUserRank.last_name}
                    </p>
                    <LevelBadge level={currentUserRank.level} points={currentUserRank.points} size="sm" showTooltip={false} />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-primary">
                      {currentUserRank.points.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {entries.length === 0 && (
            <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p className="text-sm">No leaderboard data yet</p>
              <p className="text-xs">Be the first to earn points!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
