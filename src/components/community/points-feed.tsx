"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ThumbsUp, MessageCircle, Gift, Award, TrendingUp, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface PointTransaction {
  id: string
  action_type: string
  points_delta: number
  points_after: number
  description: string | null
  created_at: string
  reference_type: string | null
  reference_id: string | null
}

interface PointsFeedProps {
  userId: string
  workspaceId?: string
  limit?: number
  compact?: boolean
  className?: string
}

const ACTION_ICONS: Record<string, { icon: any; color: string; label: string }> = {
  post_liked: { icon: ThumbsUp, color: "text-blue-500", label: "Post liked" },
  comment_liked: { icon: ThumbsUp, color: "text-blue-500", label: "Comment liked" },
  reply_liked: { icon: ThumbsUp, color: "text-blue-500", label: "Reply liked" },
  post_created: { icon: MessageCircle, color: "text-green-500", label: "Post created" },
  comment_created: { icon: MessageCircle, color: "text-green-500", label: "Comment created" },
  daily_bonus: { icon: Gift, color: "text-purple-500", label: "Daily bonus" },
  achievement_unlocked: { icon: Award, color: "text-amber-500", label: "Achievement" },
  manual_adjustment: { icon: Zap, color: "text-orange-500", label: "Bonus points" },
  level_bonus: { icon: TrendingUp, color: "text-pink-500", label: "Level bonus" }
}

export function PointsFeed({
  userId,
  workspaceId,
  limit = 10,
  compact = false,
  className
}: PointsFeedProps) {
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      try {
        setLoading(true)

        let query = supabase
          .from('community_point_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (workspaceId) {
          query = query.eq('workspace_id', workspaceId)
        }

        const { data, error } = await query

        if (error) throw error

        setTransactions(data || [])
      } catch (error: any) {
        console.error('Error fetching point transactions:', error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchTransactions()

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`points-feed:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'community_point_transactions',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            setTransactions(prev => [payload.new as PointTransaction, ...prev].slice(0, limit))
          }
        )
        .subscribe()

      return () => {
        channel.unsubscribe()
      }
    }
  }, [userId, workspaceId, limit])

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const getActionInfo = (actionType: string) => {
    return ACTION_ICONS[actionType] || { 
      icon: Zap, 
      color: "text-gray-500", 
      label: actionType.replace(/_/g, ' ') 
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader className={compact ? "pb-3" : ""}>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className={compact ? "pt-0" : ""}>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-2 bg-muted rounded w-20" />
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
        <CardTitle className="text-lg flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Zap className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? "pt-0" : ""}>
        <ScrollArea className={compact ? "h-64" : "h-96"}>
          <div className="space-y-3 pr-4">
            {transactions.map((transaction: any) => {
              const actionInfo = getActionInfo(transaction.action_type)
              const Icon = actionInfo.icon
              const isPositive = transaction.points_delta > 0

              return (
                <div
                  key={transaction.id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors items-start"
                >
                  {/* Icon */}
                  <div className={cn(
                    "p-2 rounded-full",
                    isPositive ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
                  )}>
                    <Icon className={cn("h-4 w-4", actionInfo.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">
                        {transaction.description || actionInfo.label}
                      </p>
                      <span className={cn(
                        "font-bold text-sm whitespace-nowrap",
                        isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                      )}>
                        {isPositive ? '+' : ''}{transaction.points_delta}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {timeAgo(transaction.created_at)} • {transaction.points_after.toLocaleString()} total points
                    </p>
                  </div>
                </div>
              )
            })}

            {transactions.length === 0 && (
              <div className="text-center py-4 md:py-6 lg:py-8 text-muted-foreground">
                <Zap className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No activity yet</p>
                <p className="text-xs">Start engaging to earn points!</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
