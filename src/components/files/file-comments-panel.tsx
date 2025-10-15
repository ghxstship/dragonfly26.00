"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Send, Check, MoreHorizontal, Reply } from "lucide-react"
import { useFileComments, addFileComment } from "@/hooks/use-file-collaboration"
import { formatDistanceToNow } from "date-fns"

interface FileCommentsPanelProps {
  fileId: string
  className?: string
}

export function FileCommentsPanel({ fileId, className }: FileCommentsPanelProps) {
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const { comments, loading } = useFileComments(fileId)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    
    setSubmitting(true)
    try {
      await addFileComment(fileId, newComment, {
        parentCommentId: replyTo || undefined
      })
      setNewComment("")
      setReplyTo(null)
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    } catch {
      return "recently"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* New comment input */}
        <div className="space-y-2">
          {replyTo && (
            <div className="text-sm text-muted-foreground flex items-center justify-between bg-muted p-2 rounded">
              <span>Replying to comment...</span>
              <Button variant="ghost" size="sm" onClick={() => setReplyTo(null)}>
                Cancel
              </Button>
            </div>
          )}
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment} 
              disabled={!newComment.trim() || submitting}
              size="sm"
            >
              <Send className="h-4 w-4 mr-2" />
              {replyTo ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>

        {/* Comments list */}
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading comments...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet</p>
            <p className="text-sm">Be the first to comment!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem 
                key={comment.id} 
                comment={comment}
                onReply={() => setReplyTo(comment.id)}
                formatTime={formatTime}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface CommentItemProps {
  comment: any
  onReply: () => void
  formatTime: (timestamp: string) => string
}

function CommentItem({ comment, onReply, formatTime }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false)

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.user?.avatar_url} />
          <AvatarFallback>
            {comment.user?.first_name?.[0]}{comment.user?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {comment.user?.first_name} {comment.user?.last_name}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(comment.created_at)}
              </span>
              {comment.is_resolved && (
                <Badge variant="outline" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {comment.content}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onReply}>
              <Reply className="h-3 w-3 mr-1" />
              Reply
            </Button>
            {!comment.is_resolved && (
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Resolve
              </Button>
            )}
          </div>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="pt-2">
              {!showReplies ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => setShowReplies(true)}
                >
                  Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                </Button>
              ) : (
                <div className="space-y-3 pl-4 border-l-2">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.id} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={reply.user?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {reply.user?.first_name?.[0]}{reply.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {reply.user?.first_name} {reply.user?.last_name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(reply.created_at)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => setShowReplies(false)}
                  >
                    Hide replies
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
