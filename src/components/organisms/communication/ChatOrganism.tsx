"use client"

import { useState, useRef, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Send, Paperclip, Smile } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { UserAvatar } from "@/components/atoms"
import { cn } from "@/lib/utils"

/**
 * ChatOrganism - Organism Component
 * 
 * Real-time chat interface with messages and input.
 * Extracted from views/chat-view.tsx for atomic design system.
 * 
 * Features:
 * - Message display with avatars
 * - Message input with send
 * - Auto-scroll to latest
 * - Typing indicators
 * - File attachment support
 * - Full i18n and accessibility
 */

export interface ChatMessage {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  message: string
  timestamp: Date
  isCurrentUser?: boolean
}

export interface ChatOrganismProps {
  messages: ChatMessage[]
  currentUserId: string
  onSendMessage: (message: string) => void
  onAttachFile?: () => void
  placeholder?: string
  isTyping?: boolean
  typingUser?: string
}

export function ChatOrganism({ 
  messages, 
  currentUserId,
  onSendMessage,
  onAttachFile,
  placeholder,
  isTyping,
  typingUser
}: ChatOrganismProps) {
  const t = useTranslations()
  const [inputValue, setInputValue] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Messages Area */}
      <ScrollArea aria-hidden="true" className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((msg: any) => {
            const isOwn = msg.userId === currentUserId || msg.isCurrentUser

            return (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  isOwn && 'flex-row-reverse'
                )}
              >
                <UserAvatar
                  name={msg.userName}
                  src={msg.userAvatar}
                  size="sm"
                />
                <div
                  className={cn(
                    'flex flex-col gap-1 max-w-[70%]',
                    isOwn && 'items-end'
                  )}
                >
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{msg.userName}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div
                    className={cn(
                      'rounded-lg px-4 py-2',
                      isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {msg.message}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {isTyping && typingUser && (
            <div className="flex flex-wrap flex-col md:flex-row gap-3 items-center">
              <UserAvatar name={typingUser} size="sm" />
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex flex-wrap gap-1">
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex flex-wrap items-end gap-2">
          {onAttachFile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onAttachFile}
              aria-label={t('chat.attachFile')}
            >
              <Paperclip aria-hidden="true" className="h-5 w-5" />
            </Button>
          )}
          <div className="flex-1">
            <Input
              value={inputValue as any}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder || t('chat.typeMessage')}
              className="resize-none"
              aria-label={t('chat.messageInput')}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t('chat.emoji')}
          >
            <Smile aria-hidden="true" className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            aria-label={t('chat.send')}
          >
            <Send aria-hidden="true" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
