"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TabConfigPanel } from "./tab-config-panel"
import { getModuleTabs } from "@/lib/modules/tabs-registry"
import { useUIStore } from "@/store/ui-store"
import type { ModuleTab } from "@/types"

interface TabConfigDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleSlug: string
}

export function TabConfigDrawer({ open, onOpenChange, moduleSlug }: TabConfigDrawerProps) {
  const { getTabConfig, setTabConfig } = useUIStore()
  
  // Get tabs from registry
  const moduleTabs = getModuleTabs(moduleSlug)
  
  // Get saved configuration from store
  const savedConfig = getTabConfig(moduleSlug)
  
  // Use saved configuration if available, otherwise use registry tabs
  const currentTabs = savedConfig || moduleTabs

  const handleTabsChange = (tabs: ModuleTab[]) => {
    setTabConfig(moduleSlug, tabs)
  }

  if (moduleTabs.length === 0) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px] lg:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Tab Configuration</SheetTitle>
          <SheetDescription>
            Customize which tabs are visible and their order for this module.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <TabConfigPanel 
            moduleSlug={moduleSlug}
            tabs={currentTabs}
            onTabsChange={handleTabsChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
