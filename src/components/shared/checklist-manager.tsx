"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Check, MoreHorizontal, GripVertical, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { Checklist, ChecklistItem } from "@/types"

interface ChecklistManagerProps {
  checklist: Checklist
  onUpdate: (checklist: Checklist) => void
}

export function ChecklistManager({ checklist, onUpdate }: ChecklistManagerProps) {
  const t = useTranslations()
  const [items, setItems] = useState<ChecklistItem[]>(checklist.items || [])
  const [newItemContent, setNewItemContent] = useState("")
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const progress = items.length > 0
    ? Math.round((items.filter((i: any) => i.completed).length / items.length) * 100)
    : 0

  const addItem = (parentId?: string) => {
    if (!newItemContent.trim()) return

    const newItem: ChecklistItem = {
      id: `item-${Date.now()}`,
      checklist_id: checklist.id,
      parent_id: parentId,
      content: newItemContent,
      completed: false,
      order: items.filter((i: any) => i.parent_id === parentId).length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setNewItemContent("")
    onUpdate({ ...checklist, items: updatedItems })
  }

  const toggleItem = (itemId: string) => {
    const updatedItems = items.map((item) =>
      item.id === itemId
        ? {
            ...item,
            completed: !item.completed,
            completed_at: !item.completed ? new Date().toISOString() : undefined,
            updated_at: new Date().toISOString(),
          }
        : item
    )
    setItems(updatedItems)
    onUpdate({ ...checklist, items: updatedItems })
  }

  const deleteItem = (itemId: string) => {
    // Also delete children
    const toDelete = new Set([itemId])
    const findChildren = (parentId: string) => {
      items.forEach((item) => {
        if (item.parent_id === parentId) {
          toDelete.add(item.id)
          findChildren(item.id)
        }
      })
    }
    findChildren(itemId)

    const updatedItems = items.filter((item) => !toDelete.has(item.id))
    setItems(updatedItems)
    onUpdate({ ...checklist, items: updatedItems })
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(itemId)) {
        newSet.delete(itemId)
      } else {
        newSet.add(itemId)
      }
      return newSet
    })
  }

  const renderItem = (item: ChecklistItem, level: number = 0) => {
    const children = items.filter((i: any) => i.parent_id === item.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id}>
        <div
          className={cn(
            "group flex items-start gap-2 p-2 rounded hover:bg-accent",
            level > 0 && "ml-6"
          )}
        >
          {hasChildren && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => toggleExpanded(item.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab mt-1" />
          
          <Checkbox
            checked={item.completed}
            onCheckedChange={() => toggleItem(item.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "text-sm",
                item.completed && "line-through text-muted-foreground"
              )}
            >
              {item.content}
            </div>
            {item.due_date && (
              <div className="text-xs text-muted-foreground mt-1">
                Due {new Date(item.due_date).toLocaleDateString()}
              </div>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {/* Add sub-item */}}>
                Add sub-item
              </DropdownMenuItem>
              <DropdownMenuItem>Convert to task</DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteItem(item.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderItem(child, level + 1))}</div>
        )}
      </div>
    )
  }

  const topLevelItems = items.filter((item) => !item.parent_id)

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
          <span className="font-medium">{checklist.name}</span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-1">
        {topLevelItems.map((item) => renderItem(item))}
      </div>

      {/* Add Item */}
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Add checklist item..."
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addItem()
            }
          }}
        />
        <Button onClick={() => addItem()} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
