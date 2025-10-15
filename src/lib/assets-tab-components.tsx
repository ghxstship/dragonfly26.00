import React from "react"
import { InventoryTab } from "@/components/assets/inventory-tab"
import { CountsTab } from "@/components/assets/counts-tab"

interface AssetsTabProps {
  data: any[]
  loading: boolean
  workspaceId: string
}

const ASSETS_TAB_COMPONENTS: Record<string, React.ComponentType<AssetsTabProps>> = {
  'inventory': InventoryTab,
  'counts': CountsTab,
}

export function getAssetsTabComponent(tabSlug: string): React.ComponentType<AssetsTabProps> | undefined {
  return ASSETS_TAB_COMPONENTS[tabSlug]
}
