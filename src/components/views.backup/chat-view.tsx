"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { MessageSquare, Send, Paperclip, Smile, MoreHorizontal, CheckCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface ChatViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: string
  parentId?: string
  read?: boolean
  replies?: Message[]
}

export function ChatView({ data, schema, onItemClick }: ChatViewProps) {
  const t = useTranslations()
  const [message, setMessage] = useState("")
  const [activeThread, setActiveThread] = useState<string | null>(null)

  // Convert data to messages
  const messages: Message[] = data.map((item: any) => ({
    id: item.id,
    userId: item.user_id || "unknown",
    userName: item.user_name || "Anonymous",
    content: item.content || item.message || t('views.noContent'),
    timestamp: item.created_at || new Date().toISOString(),
    parentId: item.parent_id,
    read: item.read !== false,
    replies: [],
  }))

  // Build thread structure
  const threaded = messages.filter((m: any) => !m.parentId)
  threaded.forEach((thread: any) => {
    thread.replies = messages.filter((m: any) => m.parentId === thread.id)
  })

  const handleSendMessage = async () => {
    if (!message.trim()) return
    console.log("Sending message:", message)
    setMessage("")
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return t('date.justNow')
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const renderMessage = (msg: Message, isReply = false) => (
    <div
      key={msg.id}
      className={cn(
        "group hover:bg-accent transition-colors cursor-pointer",
        isReply ? "pl-12 py-2" : "p-3",
        !msg.read && "bg-primary/5"
      )}
      onClick={() => {
        onItemClick?.(data.find((d: any) => d.id === msg.id)!)
        setActiveThread(isReply ? msg.parentId! : msg.id)
      }}
    >
      <div className="flex flex-wrap gap-3">
        <Avatar className={cn("flex-shrink-0", isReply ? "h-6 w-6" : "h-8 w-8")}>
          <AvatarFallback className={isReply ? "text-xs" : ""}>
            {msg.userName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
            <span className={cn("font-medium", isReply ? "text-sm" : "text-sm")}>{msg.userName}</span>
            <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
            {msg.read && <CheckCheck className="h-3 w-3 text-primary" />}
          </div>
          <div className={cn("whitespace-pre-wrap", isReply ? "text-sm" : "")}>
            {msg.content}
          </div>
          {!isReply && msg.replies && msg.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                setActiveThread(activeThread === msg.id ? null : msg.id)
              }}
            >
              {msg.replies.length} {msg.replies.length === 1 ? "reply" : "replies"}
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Reply</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Copy</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* Replies */}
      {!isReply && activeThread === msg.id && msg.replies && msg.replies.length > 0 && (
        <div className="mt-2 border-l-2 border-primary/20 ml-4">
          {msg.replies.map((reply: any) => renderMessage(reply, true))}
        </div>
      )}
    </div>
  )

  const unreadCount = messages.filter((m: any) => !m.read).length

  return (
    <div className="h-full flex flex-wrap flex-col">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          <h3 className="font-semibold">Chat</h3>
          <Badge variant="secondary">{messages.length} messages</Badge>
          {unreadCount > 0 && (
            <Badge variant="destructive">{unreadCount} unread</Badge>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="divide-y">
          {threaded.map((msg: any) => renderMessage(msg))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex-1 flex flex-wrap flex-col gap-2">
            <Input
              placeholder="Type a message..."
              value={message as any}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
              className="min-h-[40px]"
            />
          </div>
          <TooltipProvider delayDuration={300}>
            <div className="flex flex-wrap gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Smile className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add emoji</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                  <kbd className="ml-2 inline-flex flex-col md:flex-row items-center gap-0.5 font-mono text-[11px] opacity-70">Enter</kbd>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
