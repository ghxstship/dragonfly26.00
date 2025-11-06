"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Trash2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * MindMapOrganism - Organism Component
 * 
 * Mind map / node graph visualization.
 * Extracted from views/mind-map-view.tsx for atomic design system.
 * 
 * Features:
 * - Node creation and deletion
 * - Node connections
 * - Drag to reposition
 * - Zoom controls
 * - Node editing
 * - Full i18n and accessibility
 */

export interface MindMapNode {
  id: string
  label: string
  x: number
  y: number
  color?: string
  children?: string[]
}

export interface MindMapOrganismProps {
  nodes: MindMapNode[]
  onChange: (nodes: MindMapNode[]) => void
  readOnly?: boolean
}

export function MindMapOrganism({ 
  nodes, 
  onChange,
  readOnly = false
}: MindMapOrganismProps) {
  const t = useTranslations()
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)
  const [editingNode, setEditingNode] = useState<string | null>(null)

  const addNode = () => {
    const newNode: MindMapNode = {
      id: `node-${Date.now()}`,
      label: t('mindMap.newNode'),
      x: 50 + Math.random() * 20,
      y: 50 + Math.random() * 20,
      color: '#3b82f6'
    }
    onChange([...nodes, newNode])
  }

  const removeNode = (id: string) => {
    onChange(nodes.filter(n => (n as any).id !== id))
    if (selectedNode === id) setSelectedNode(null)
  }

  const updateNode = (id: string, updates: Partial<MindMapNode>) => {
    onChange(nodes.map(n => n.id === id ? { ...n, ...updates } : n))
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5))
  }

  return (
    <div className="flex flex-wrap flex-col h-full relative">
      {/* Controls */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between border-b p-2">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          {!readOnly && (
            <Button onClick={addNode} size="sm" className="gap-2">
              <Plus aria-hidden="true" className="h-4 w-4" />
              {t('mindMap.addNode')}
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {nodes.length} {t('mindMap.nodes')}
          </span>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            aria-label={t('mindMap.zoomOut')}
          >
            <ZoomOut aria-hidden="true" className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            aria-label={t('mindMap.zoomIn')}
          >
            <ZoomIn aria-hidden="true" className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('mindMap.fullscreen')}
          >
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden md:block bg-muted/10">
        <div
          className="absolute sm:relative sm:inset-auto inset-0 sm:relative sm:inset-auto"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {/* Connection Lines */}
          <svg className="absolute sm:relative sm:inset-auto inset-0 w-full h-full pointer-events-none max-w-full sm:relative sm:inset-auto">
            {nodes.map((node: any) => 
              node.children?.map((childId: any) => {
                const child = nodes.find(n => n.id === childId)
                if (!child) return null
                
                return (
                  <line
                    key={`${node.id}-${childId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${child.x}%`}
                    y2={`${child.y}%`}
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-muted-foreground"
                  />
                )
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node: any) => (
            <div
              key={node.id}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 cursor-move',
                selectedNode === node.id && 'z-10'
              )}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`
              }}
               role="button" tabIndex={0} onClick={() => setSelectedNode(node.id)}
            >
              <div
                className={cn(
                  'rounded-lg p-3 shadow-lg border-2 transition-all min-w-[120px]',
                  selectedNode === node.id
                    ? 'border-primary scale-110'
                    : 'border-transparent hover:border-primary/50'
                )}
                style={{ backgroundColor: node.color || '#3b82f6' }}
              >
                {editingNode === node.id ? (
                  <Input
                    value={node.label}
                    onChange={(e) => updateNode(node.id, { label: e.target.value })}
                    onBlur={() => setEditingNode(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingNode(null)}
                    className="h-6 text-sm bg-white"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm font-medium text-white text-center"
                    onDoubleClick={() => !readOnly && setEditingNode(node.id)}
                  >
                    {node.label}
                  </p>
                )}
              </div>

              {!readOnly && selectedNode === node.id && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute sm:relative sm:inset-auto -top-2 md:top-2 -right-2 md:right-2 h-6 w-6 p-0 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNode(node.id)
                  }}
                  aria-label={t('mindMap.removeNode')}
                >
                  <Trash2 className="h-3 w-3" aria-hidden="true" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      {!readOnly && nodes.length === 0 && (
        <div className="absolute sm:relative sm:inset-auto inset-0 flex flex-wrap items-center justify-center pointer-events-none sm:relative sm:inset-auto">
          <div className="text-center text-muted-foreground">
            <p className="text-sm">{t('mindMap.empty')}</p>
            <p className="text-xs mt-1">{t('mindMap.clickToAdd')}</p>
          </div>
        </div>
      )}
    </div>
  )
}
