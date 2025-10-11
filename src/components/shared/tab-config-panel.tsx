"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { GripVertical, Eye, EyeOff, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { ModuleTab } from "@/types"
import { iconMap } from "@/lib/modules/icon-map"

interface TabConfigPanelProps {
  moduleSlug: string
  tabs: ModuleTab[]
  onTabsChange?: (tabs: ModuleTab[]) => void
}

export function TabConfigPanel({ moduleSlug, tabs: initialTabs, onTabsChange }: TabConfigPanelProps) {
  const t = useTranslations()
  const [tabs, setTabs] = useState<ModuleTab[]>(initialTabs)
  const [searchQuery, setSearchQuery] = useState("")
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  // Update tabs when initialTabs changes
  useEffect(() => {
    setTabs(initialTabs)
  }, [initialTabs])

  const toggleTabVisibility = (id: string) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === id ? { ...tab, enabled: !tab.enabled } : tab
    )
    setTabs(updatedTabs)
    if (onTabsChange) {
      onTabsChange(updatedTabs)
    }
  }

  const showAllTabs = () => {
    const updatedTabs = tabs.map((tab) => ({ ...tab, enabled: true }))
    setTabs(updatedTabs)
    if (onTabsChange) {
      onTabsChange(updatedTabs)
    }
  }

  const hideAllTabs = () => {
    const updatedTabs = tabs.map((tab, index) =>
      index === 0 ? tab : { ...tab, enabled: false }
    )
    setTabs(updatedTabs)
    if (onTabsChange) {
      onTabsChange(updatedTabs)
    }
  }

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault()
    if (draggedItem && draggedItem !== id) {
      const draggedIndex = tabs.findIndex((t) => t.id === draggedItem)
      const targetIndex = tabs.findIndex((t) => t.id === id)

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTabs = [...tabs]
        const [removed] = newTabs.splice(draggedIndex, 1)
        newTabs.splice(targetIndex, 0, removed)
        
        // Update order property
        const reorderedTabs = newTabs.map((tab, index) => ({
          ...tab,
          order: index,
        }))
        
        setTabs(reorderedTabs)
      }
    }
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    if (onTabsChange) {
      onTabsChange(tabs)
    }
  }

  const filteredTabs = tabs.filter((tab) =>
    tab.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleCount = tabs.filter((t) => t.enabled).length
  const totalCount = tabs.length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
        <div className="text-sm">
          <span className="font-medium">{visibleCount}</span> of{" "}
          <span className="font-medium">{totalCount}</span> pages visible
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="sm" onClick={showAllTabs}>
            Show All
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAllTabs}>
            Hide All
          </Button>
        </div>
      </div>

      {/* Search */}
      <div>
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10"
        />
      </div>

      {/* Pages List */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Pages</Label>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
          {filteredTabs.map((tab, index) => {
            const Icon = iconMap[tab.icon]
            const isFirst = index === 0
            
            return (
              <div
                key={tab.id}
                draggable={!isFirst}
                onDragStart={() => handleDragStart(tab.id)}
                onDragOver={(e) => handleDragOver(e, tab.id)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors ${
                  draggedItem === tab.id ? "opacity-50" : ""
                } ${isFirst ? "cursor-default" : "cursor-grab active:cursor-grabbing"}`}
              >
                {!isFirst && (
                  <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                {isFirst && <div className="w-4" />}

                <div className="flex-1 min-w-0 flex items-center gap-2">
                  {Icon && (
                    <Icon 
                      className="h-4 w-4 flex-shrink-0" 
                      style={{ color: tab.color }} 
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{tab.name}</div>
                    {tab.description && (
                      <div className="text-xs text-muted-foreground truncate">
                        {tab.description}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => toggleTabVisibility(tab.id)}
                  disabled={isFirst}
                >
                  {tab.enabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Page Presets</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Essential
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Full
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Minimal
          </Button>
          <Button variant="outline" size="sm">
            <Settings2 className="h-3 w-3 mr-2" />
            Custom
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full">
          Save Current as Preset
        </Button>
      </div>
    </div>
  )
}
