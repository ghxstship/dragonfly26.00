"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, getInitials } from "@/lib/utils"
import { Send, Smile, Loader2, MessageSquare } from "lucide-react"
import { getSupabaseClient } from "@/lib/supabase/hooks-client"
import { useUIStore } from "@/store/ui-store"
import { useCollaborationStore, type CommentData } from "@/store/collaboration-store"
import { useToast } from "@/lib/hooks/use-toast"

interface CommentsSectionProps {
  entityType: string
  entityId: string
}

export function CommentsSection({ entityType, entityId }: CommentsSectionProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const supabase = getSupabaseClient()
  const { currentWorkspace } = useUIStore()
  const { comments, setComments, addComment } = useCollaborationStore()
  
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  
  const entityComments = comments[entityId] || []

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    fetchUser()
  }, [supabase])

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!currentWorkspace?.id || !entityId || entityId === 'no-workspace') {
        setIsFetching(false)
        return
      }
      
      try {
        const { data, error } = await supabase
          .from('comments')
          .select(`
            id,
            content,
            created_at,
            updated_at,
            user_id
          `)
          .eq('workspace_id', currentWorkspace.id)
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .is('parent_id', null)
          .order('created_at', { ascending: true })

        if (error) throw error
        
        // Transform comments and cache current user info
        const transformedComments: CommentData[] = (data || []).map((comment: any) => {
          // Use cached user info if it's the current user
          const isCurrentUser = currentUser && comment.user_id === currentUser.id
          
          return {
            id: comment.id,
            workspace_id: currentWorkspace.id,
            entity_type: entityType,
            entity_id: entityId,
            user_id: comment.user_id,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            user: isCurrentUser ? {
              id: currentUser.id,
              email: currentUser.email || 'Unknown',
              name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User',
              avatar_url: currentUser.user_metadata?.avatar_url,
            } : {
              id: comment.user_id,
              email: 'User',
              name: `User ${comment.user_id.slice(0, 8)}`,
              avatar_url: undefined,
            }
          }
        })
        
        setComments(entityId, transformedComments)
      } catch (error: any) {
        console.error('Error fetching comments:', error)
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchComments()
  }, [supabase, currentWorkspace?.id, entityType, entityId, setComments, toast])

  // Subscribe to real-time changes
  useEffect(() => {
    if (!currentWorkspace?.id) return

    const channel = supabase
      .channel(`comments:${entityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `entity_id=eq.${entityId}`,
        },
        async (payload) => {
          // Fetch the full comment with user data
          const { data, error } = await supabase
            .from('comments')
            .select(`
              id,
              content,
              created_at,
              updated_at,
              user_id
            `)
            .eq('id', payload.new.id)
            .single()

          if (!error && data) {
            // Use cached user info if it's the current user
            const isCurrentUser = currentUser && data.user_id === currentUser.id
            
            const transformedComment: CommentData = {
              id: data.id,
              workspace_id: currentWorkspace.id,
              entity_type: entityType,
              entity_id: entityId,
              user_id: data.user_id,
              content: data.content,
              created_at: data.created_at,
              updated_at: data.updated_at,
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

            addComment(entityId, transformedComment)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, currentWorkspace?.id, entityType, entityId, addComment])

  const handleSubmit = async () => {
    if (!newComment.trim() || !currentUser || !currentWorkspace?.id || !entityId || entityId === 'no-workspace') return
    
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          workspace_id: currentWorkspace.id,
          entity_type: entityType,
          entity_id: entityId,
          user_id: currentUser.id,
          content: newComment.trim(),
        })

      if (error) throw error

      setNewComment("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error: any) {
      console.error('Error creating comment:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Show message if no valid workspace context
  if (!currentWorkspace?.id || !entityId || entityId === 'no-workspace') {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-sm font-medium mb-1">No workspace selected</p>
        <p className="text-xs text-muted-foreground">
          Please select a workspace to view and add comments
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment... (Cmd/Ctrl + Enter to send)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          className="resize-none"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" disabled>
            <Smile className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit} 
            disabled={!newComment.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Send
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {entityComments.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          entityComments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={comment.user?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">
                  {getInitials(comment.user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{comment.user?.name || 'Unknown User'}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
