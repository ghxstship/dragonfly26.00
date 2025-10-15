"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen, AlertCircle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface FolderNode {
  id: string
  name: string
  parent_folder_id: string | null
  folder_path: string
  item_count: number
  total_value: number
  color?: string
  icon?: string
  children?: FolderNode[]
}

interface InventoryFolderTreeProps {
  workspaceId: string
  onFolderSelect: (folderId: string | null) => void
  selectedFolderId?: string | null
}

export function InventoryFolderTree({ workspaceId, onFolderSelect, selectedFolderId }: InventoryFolderTreeProps) {
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadFolders()
  }, [workspaceId])

  const loadFolders = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('inventory_folders')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('folder_path')

    if (!error && data) {
      const tree = buildTree(data)
      setFolders(tree)
    }
    setLoading(false)
  }

  const buildTree = (flatFolders: any[]): FolderNode[] => {
    const map = new Map<string, FolderNode>()
    const roots: FolderNode[] = []

    // Create map of all folders
    flatFolders.forEach(folder => {
      map.set(folder.id, { ...folder, children: [] })
    })

    // Build tree structure
    flatFolders.forEach(folder => {
      const node = map.get(folder.id)!
      if (folder.parent_folder_id && map.has(folder.parent_folder_id)) {
        map.get(folder.parent_folder_id)!.children!.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const renderFolder = (folder: FolderNode, level: number = 0) => {
    const isExpanded = expandedIds.has(folder.id)
    const isSelected = selectedFolderId === folder.id
    const hasChildren = folder.children && folder.children.length > 0
    const hasLowStock = folder.item_count > 0 // Could add actual low stock check

    return (
      <div key={folder.id}>
        <div
          className={cn(
            "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors",
            isSelected && "bg-accent",
            level > 0 && "ml-4"
          )}
          onClick={() => onFolderSelect(folder.id)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(folder.id)
              }}
              className="p-0.5 hover:bg-muted rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          
          {isExpanded ? (
            <FolderOpen className="h-4 w-4 text-blue-500" style={{ color: folder.color }} />
          ) : (
            <Folder className="h-4 w-4 text-blue-500" style={{ color: folder.color }} />
          )}
          
          <span className="flex-1 text-sm font-medium truncate">{folder.name}</span>
          
          <div className="flex items-center gap-1">
            {hasLowStock && <AlertCircle className="h-3 w-3 text-orange-500" />}
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {folder.item_count}
            </Badge>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {folder.children!.map(child => renderFolder(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-muted rounded" />
          <div className="h-8 bg-muted rounded ml-4" />
          <div className="h-8 bg-muted rounded ml-4" />
          <div className="h-8 bg-muted rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Folders</h3>
        <Button size="sm" variant="ghost" onClick={() => {}}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* All Items option */}
          <div
            className={cn(
              "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer hover:bg-accent transition-colors mb-2",
              !selectedFolderId && "bg-accent"
            )}
            onClick={() => onFolderSelect(null)}
          >
            <div className="w-5" />
            <Folder className="h-4 w-4 text-gray-500" />
            <span className="flex-1 text-sm font-medium">All Items</span>
          </div>
          
          {folders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              <Folder className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No folders yet</p>
              <p className="text-xs mt-1">Create folders to organize inventory</p>
            </div>
          ) : (
            folders.map(folder => renderFolder(folder))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
