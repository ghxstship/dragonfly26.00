"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Network, Plus, Maximize2, Minimize2, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface MindMapViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  onItemClick?: (item: DataItem) => void
}

interface TreeNode {
  id: string
  data: DataItem
  children: TreeNode[]
  collapsed: boolean
}

export function MindMapView({ data, schema, onItemClick }: MindMapViewProps) {
  const t = useTranslations()
  const [zoom, setZoom] = useState(100)
  const [layout, setLayout] = useState<"radial" | "tree">("radial")
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set())

  // Build tree structure from data
  const buildTree = (): TreeNode[] => {
    const nodeMap = new Map<string, TreeNode>()
    const roots: TreeNode[] = []

    // Create nodes
    data.forEach((item: any) => {
      nodeMap.set(item.id, {
        id: item.id,
        data: item,
        children: [],
        collapsed: collapsedNodes.has(item.id),
      })
    })

    // Build parent-child relationships
    data.forEach((item: any) => {
      const node = nodeMap.get(item.id)
      if (node) {
        if (item.parent_id) {
          const parent = nodeMap.get(item.parent_id)
          if (parent) {
            parent.children.push(node)
          }
        } else {
          roots.push(node)
        }
      }
    })

    return roots
  }

  const toggleNode = (nodeId: string) => {
    setCollapsedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const renderNode = (node: TreeNode, level: number = 0) => {
    const hasChildren = node.children.length > 0

    return (
      <div key={node.id} className="flex flex-wrap flex-col md:flex-row items-start gap-2">
        <div className="flex flex-wrap flex-col items-center">
          {/* Node */}
          <div
            className={cn(
              "relative group",
              level === 0 ? "p-4" : level === 1 ? "p-3" : "p-2"
            )}
          >
            <div
              className={cn(
                "relative rounded-lg border-2 bg-background cursor-pointer hover:shadow-md transition-all",
                level === 0 && "border-primary bg-primary/5",
                level === 1 && "border-blue-500",
                level > 1 && "border-muted-foreground/30"
              )}
              onClick={() => onItemClick?.(node.data)}
            >
              <div className={cn("p-3", level === 0 ? "min-w-[200px]" : "min-w-[150px]")}>
                <div className="font-medium text-sm">
                  {node.data.name || node.data.title || "Untitled"}
                </div>
                {node.data.description && level === 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {node.data.description}
                  </div>
                )}
                {hasChildren && (
                  <Badge variant="secondary" className="mt-2">
                    {node.children.length} {node.children.length === 1 ? "child" : "children"}
                  </Badge>
                )}
              </div>
            </div>

            {/* Expand/Collapse Button */}
            {hasChildren && (
              <Button
                variant="outline"
                size="icon"
                className="absolute sm:relative sm:inset-auto -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 sm:relative sm:inset-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleNode(node.id)
                }}
              >
                {node.collapsed ? <Plus className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
            )}
          </div>

          {/* Children */}
          {hasChildren && !node.collapsed && (
            <div className="ml-8 mt-4 space-y-4 border-l-2 border-dashed pl-4">
              {node.children.map((child: any) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const tree = buildTree()

  return (
    <div className="relative h-full flex flex-wrap flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Network className="h-5 w-5" />
          <h3 className="font-semibold">Mind Map</h3>
          <Badge variant="secondary">{data.length} nodes</Badge>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Button
            variant={layout === "radial" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setLayout("radial")}
          >
            Radial
          </Button>
          <Button
            variant={layout === "tree" ? "secondary" : "outline"}
            size="sm"
            onClick={() => setLayout("tree")}
          >
            Tree
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <TooltipProvider delayDuration={300}>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.max(50, zoom - 10))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom out</p>
                </TooltipContent>
              </Tooltip>
              <span className="text-sm text-muted-foreground min-w-[4ch] text-center">
                {zoom}%
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Zoom in</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setZoom(100)}>
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset zoom</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <div
          className="p-8 min-w-max"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}
        >
          {tree.length > 0 ? (
            <div className="space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
              {tree.map((root: any) => renderNode(root))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-6 md:py-4 md:py-6 lg:py-8 lg:py-12">
              No data to visualize
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
