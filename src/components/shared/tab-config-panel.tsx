"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { iconMap } from "@/lib/modules/icon-map"
import type { ModuleTab } from "@/types"

interface TabConfigPanelProps {
  moduleSlug: string
}

export function TabConfigPanel({ moduleSlug }: TabConfigPanelProps) {
  const t = useTranslations()
  const allTabs = getModuleTabs(moduleSlug)
  const [tabs, setTabs] = useState<ModuleTab[]>(allTabs)
  const [searchQuery, setSearchQuery] = useState("")

  const toggleTabVisibility = (id: string) => {
    setTabs((prev) =>
      prev.map((tab) =>
        tab.id === id ? { ...tab, enabled: !tab.enabled } : tab
      )
    )
  }

  const showAllTabs = () => {
    setTabs((prev) => prev.map((tab) => ({ ...tab, enabled: true })))
  }

  const hideAllTabs = () => {
    setTabs((prev) =>
      prev.map((tab: any, index: number) =>
        index === 0 ? tab : { ...tab, enabled: false }
      )
    )
  }

  const filteredTabs = tabs.filter((tab: any) => tab.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const visibleCount = tabs.filter((t: any) => t.enabled).length
  const totalCount = tabs.length

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search pages..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-9"
      />

      {/* Stats & Actions */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {visibleCount} of {totalCount} visible
        </span>
        <div className="flex flex-wrap gap-1">
          <Button variant="ghost" size="sm" onClick={showAllTabs} className="h-7 text-xs">
            Show All
          </Button>
          <Button variant="ghost" size="sm" onClick={hideAllTabs} className="h-7 text-xs">
            Hide All
          </Button>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-2 max-h-[252px] md:h-[420px] overflow-y-auto pr-2">
        {filteredTabs.map((tab: any, index: number) => {
          const Icon = iconMap[tab.icon]
          const isFirst = index === 0

          return (
            <div
              key={tab.id}
              className="flex flex-col md:flex-row items-center gap-3 p-3 rounded-md hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col md:flex-row-1 min-w-0 flex flex-wrap items-center gap-2">
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

      {/* Quick Presets */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Quick Presets</Label>
        <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2">
          <Button variant="outline" size="sm">
            Essential
          </Button>
          <Button variant="outline" size="sm">
            All Pages
          </Button>
          <Button variant="outline" size="sm">
            Minimal
          </Button>
          <Button variant="outline" size="sm">
            Custom
          </Button>
        </div>
      </div>
    </div>
  )
}
