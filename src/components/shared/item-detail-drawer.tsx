"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { X, MoreHorizontal, Trash2, Copy, Calendar, User, Tag, Paperclip } from "lucide-react"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentsSection } from "./comments-section"
import { ActivityFeed } from "./activity-feed"
import type { DataItem } from "@/types"

interface ItemDetailDrawerProps {
  item: DataItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate?: (updates: Partial<DataItem>) => void
  onDelete?: () => void
}

export function ItemDetailDrawer({
  item,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: ItemDetailDrawerProps) {
  const t = useTranslations()
  const [editedItem, setEditedItem] = useState<DataItem | null>(item)

  if (!item || !editedItem) return null

  const handleUpdate = (field: keyof DataItem, value: any) => {
    const updates = { ...editedItem, [field]: value }
    setEditedItem(updates)
    onUpdate?.(updates)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-[600px] p-0 flex flex-wrap flex-col">
        {/* Header */}
        <SheetHeader className="border-b px-4 md:px-6 py-4">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Input
                value={editedItem.name || editedItem.title || ""}
                onChange={(e) => handleUpdate("name", e.target.value)}
                className="text-lg font-semibold border-0 px-0 focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-wrap overflow-hidden md:block">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-3 md:space-y-4 lg:space-y-6">
              {/* Properties */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Status</Label>
                    <Select
                      value={editedItem.status}
                      onValueChange={(value) => handleUpdate("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase">Priority</Label>
                    <Select
                      value={editedItem.priority}
                      onValueChange={(value) => handleUpdate("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Assignee */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <User className="h-3 w-3" />
                      Assignee
                    </Label>
                    <Select
                      value={editedItem.assignee}
                      onValueChange={(value) => handleUpdate("assignee", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unassigned" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user1">John Doe</SelectItem>
                        <SelectItem value="user2">Jane Smith</SelectItem>
                        <SelectItem value="user3">Bob Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Due Date */}
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase flex flex-wrap flex-col md:flex-row items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due Date
                    </Label>
                    <Input
                      type="date"
                      value={editedItem.due_date?.split("T")[0] || ""}
                      onChange={(e) => handleUpdate("due_date", e.target.value)}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground uppercase flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Tags
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {editedItem.tags?.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    <Button variant="outline" size="sm">
                      + Add tag
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase">Description</Label>
                <Textarea
                  value={editedItem.description || ""}
                  onChange={(e) => handleUpdate("description", e.target.value)}
                  placeholder="Add a description..."
                  rows={6}
                />
              </div>

              {/* Attachments */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground uppercase flex flex-wrap flex-col md:flex-row items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  Attachments
                </Label>
                <Button variant="outline" size="sm" className="w-full max-w-full">
                  Upload files
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Activity & Comments */}
          <div className="w-full sm:w-80 border-l flex flex-wrap flex-col">
            <Tabs defaultValue="comments" className="flex-1 flex flex-wrap flex-col">
              <TabsList className="w-full justify-start rounded-none border-b px-4 max-w-full">
                <TabsTrigger value="comments">Comments</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>
              <ScrollArea className="flex-1">
                <TabsContent value="comments" className="p-4 m-0">
                  <CommentsSection entityType="task" entityId={item.id} />
                </TabsContent>
                <TabsContent value="activity" className="p-4 m-0">
                  <ActivityFeed />
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
