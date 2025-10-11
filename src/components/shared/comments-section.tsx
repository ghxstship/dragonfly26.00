"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { formatDate, getInitials } from "@/lib/utils"
import { Send, Smile } from "lucide-react"

interface CommentsSectionProps {
  entityType: string
  entityId: string
}

const mockComments = [
  {
    id: "1",
    user: { name: "John Doe", avatar_url: null },
    content: "This looks great! Let's move forward with this approach.",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    user: { name: "Jane Smith", avatar_url: null },
    content: "I agree. Should we schedule a follow-up meeting?",
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
]

export function CommentsSection({ entityType, entityId }: CommentsSectionProps) {
  const t = useTranslations()
  const [newComment, setNewComment] = useState("")

  const handleSubmit = () => {
    if (!newComment.trim()) return
    // Handle comment submission
    setNewComment("")
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="space-y-2">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="resize-none"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!newComment.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={comment.user.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {getInitials(comment.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{comment.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
              </div>
              <div className="text-sm mt-1">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
