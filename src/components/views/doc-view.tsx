"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  FileText,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  MoreHorizontal,
  Users,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface DocViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

interface Collaborator {
  id: string
  name: string
  color: string
  cursor?: { x: number; y: number }
}

export function DocView({ data, schema, onItemClick }: DocViewProps) {
  const t = useTranslations()
  const [content, setContent] = useState(
    data[0]?.content ||
      "# Welcome to the collaborative editor\n\nStart typing to create your document..."
  )
  const [showComments, setShowComments] = useState(false)

  const collaborators: Collaborator[] = [
    { id: "1", name: "John Doe", color: "#3b82f6" },
    { id: "2", name: "Jane Smith", color: "#8b5cf6" },
    { id: "3", name: "Mike Johnson", color: "#10b981" },
  ]

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: "bold" },
    { icon: Italic, label: "Italic", action: "italic" },
    { icon: Underline, label: "Underline", action: "underline" },
    { icon: List, label: "Bullet List", action: "bullet" },
    { icon: ListOrdered, label: "Numbered List", action: "numbered" },
    { icon: Link, label: "Insert Link", action: "link" },
    { icon: Image, label: "Insert Image", action: "image" },
    { icon: Code, label: "Code Block", action: "code" },
    { icon: Quote, label: "Quote", action: "quote" },
  ]

  const handleFormat = (action: string) => {
    console.log("Format action:", action)
    // Implement formatting logic
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          <input
            type="text"
            className="font-semibold text-lg bg-transparent border-none outline-none focus:ring-0"
            placeholder={t('views.untitledDocument')}
            defaultValue="Document"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* Collaborators */}
          <div className="flex items-center gap-1 mr-2">
            <TooltipProvider>
              {collaborators.map((collab) => (
                <Tooltip key={collab.id}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className="h-7 w-7 border-2 -ml-2 first:ml-0 cursor-pointer hover:z-10"
                      style={{ borderColor: collab.color }}
                    >
                      <AvatarFallback style={{ backgroundColor: collab.color }}>
                        {collab.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{collab.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
            <Button variant="outline" size="icon" className="h-7 w-7 ml-1">
              <Users className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant={showComments ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comments
          </Button>
          <Button variant="outline" size="sm">
            Share
          </Button>
          <Button size="sm">Export</Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
        <TooltipProvider>
          {toolbarButtons.map((button) => {
            const Icon = button.icon
            return (
              <Tooltip key={button.action}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleFormat(button.action)}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{button.label}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-8 px-12">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[600px] border-none focus-visible:ring-0 text-base leading-relaxed resize-none"
              placeholder="Start typing..."
            />
          </div>
        </div>

        {/* Comments Sidebar */}
        {showComments && (
          <div className="w-80 border-l bg-muted/30 overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-background">
              <h3 className="font-semibold">Comments</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Example comments */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">John Doe</span>
                      <span className="text-muted-foreground ml-2 text-xs">2h ago</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Great point! Let&apos;s expand on this section.
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>JS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="text-sm">
                      <span className="font-medium">Jane Smith</span>
                      <span className="text-muted-foreground ml-2 text-xs">5h ago</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Should we add more examples here?
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-background">
              <Textarea placeholder="Add a comment..." rows={3} />
              <Button size="sm" className="mt-2 w-full">
                Comment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
