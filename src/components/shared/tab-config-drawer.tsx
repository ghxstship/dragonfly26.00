"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { TabConfigPanel } from "./tab-config-panel"
import { getModuleTabs } from "@/lib/modules/tabs-registry"

interface TabConfigDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  moduleSlug: string
}

export function TabConfigDrawer({ open, onOpenChange, moduleSlug }: TabConfigDrawerProps) {
  // Get tabs from registry to check if module has tabs
  const moduleTabs = getModuleTabs(moduleSlug)

  if (moduleTabs.length === 0) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px] lg:w-[540px] overflow-y-auto max-w-full">
        <SheetHeader>
          <SheetTitle>Tab Configuration</SheetTitle>
          <SheetDescription>
            Customize which tabs are visible for this module.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <TabConfigPanel moduleSlug={moduleSlug} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
