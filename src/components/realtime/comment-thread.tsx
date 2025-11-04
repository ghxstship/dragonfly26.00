"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Send, MoreHorizontal, Heart, ThumbsUp, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn, getInitials } from "@/lib/utils"
import type { Comment } from "@/types"

interface CommentThreadProps {
  itemId: string
  itemType: string
  comments?: Comment[]
}

const mockComments: Comment[] = [
  {
    id: "1",
    organization_id: "org-1",
    item_id: "task-1",
    item_type: "task",
    content: "This looks great! Can we add more details to the spec?",
    mentions: [],
    reactions: { "👍": ["user-2", "user-3"], "❤️": ["user-4"] },
    is_edited: false,
    is_deleted: false,
    is_resolved: false,
    created_by: "user-1",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-15T10:30:00Z",
  },
  {
    id: "2",
    organization_id: "org-1",
    item_id: "task-1",
    item_type: "task",
    parent_comment_id: "1",
    thread_id: "1",
    content: "Sure! I'll add them today. @john can you review?",
    mentions: ["user-john"],
    reactions: {},
    is_edited: false,
    is_deleted: false,
    is_resolved: false,
    created_by: "user-2",
    created_at: "2025-01-15T11:00:00Z",
    updated_at: "2025-01-15T11:00:00Z",
  },
]

export function CommentThread({ itemId, itemType, comments = mockComments }: CommentThreadProps) {
  const t = useTranslations()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const handleSubmit = async () => {
    console.log("Posting comment:", newComment, "reply to:", replyTo)
    setNewComment("")
    setReplyTo(null)
  }

  const rootComments = comments.filter((c: any) => !c.parent_comment_id)

  return (
    <div className="space-y-4">
      {/* Comments list */}
      <div className="space-y-4">
        {rootComments.map((comment: any) => {
          const replies = comments.filter((c: any) => c.parent_comment_id === comment.id)

          return (
            <div key={comment.id} className="space-y-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/avatars/${comment.created_by}.jpg`} />
                      <AvatarFallback>{getInitials(comment.created_by)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{comment.created_by}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReplyTo(comment.id)}>
                              Reply
                            </DropdownMenuItem>
                            <DropdownMenuItem>Resolve</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm">{comment.content}</p>

                      {/* Reactions */}
                      {Object.keys(comment.reactions || {}).length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(comment.reactions || {}).map(([emoji, users]) => (
                            <Button
                              key={emoji}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              {emoji} {(users as any[]).length}
                            </Button>
                          ))}
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Smile className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Replies */}
              {replies.length > 0 && (
                <div className="ml-8 space-y-3">
                  {replies.map((reply: any) => (
                    <Card key={reply.id}>
                      <CardContent className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`/avatars/${reply.created_by}.jpg`} />
                            <AvatarFallback className="text-xs">
                              {getInitials(reply.created_by)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                              <p className="font-medium text-xs">{reply.created_by}</p>
                              <span className="text-xs text-muted-foreground">
                                {new Date(reply.created_at).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{reply.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* New comment input */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>You</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              {replyTo && (
                <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs bg-muted p-2 rounded">
                  <span>Replying to comment</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5"
                    onClick={() => setReplyTo(null)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              <Textarea
                placeholder="Write a comment..."
                value={newComment as any}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
              <div className="flex flex-wrap justify-between">
                <div className="flex flex-wrap gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Smile className="h-4 w-4" />
                  </Button>
                </div>
                <Button onClick={handleSubmit} disabled={!newComment.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
