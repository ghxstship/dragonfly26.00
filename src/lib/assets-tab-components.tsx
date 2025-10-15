import React from "react"
import { InventoryTab } from "@/components/assets/inventory-tab"
import { CountsTab } from "@/components/assets/counts-tab"
import { CatalogTab } from "@/components/assets/catalog-tab"
import { AssetsMaintenanceTab } from "@/components/assets/assets-maintenance-tab"
import AssetsApprovalsTab from "@/components/assets/assets-approvals-tab"
import AssetsAdvancesTab from "@/components/assets/assets-advances-tab"

interface AssetsTabProps {
  data: any[]
  loading: boolean
  workspaceId: string
}

export const ASSETS_TAB_COMPONENTS: Record<string, React.ComponentType<AssetsTabProps>> = {
  'inventory': InventoryTab,
  'counts': CountsTab,
  'catalog': CatalogTab,
  'maintenance': AssetsMaintenanceTab as any,
  'approvals': AssetsApprovalsTab as any,
  'advances': AssetsAdvancesTab as any,
}

export function getAssetsTabComponent(tabSlug: string): React.ComponentType<AssetsTabProps> | undefined {
  return ASSETS_TAB_COMPONENTS[tabSlug]
}
