// Procurement module tab components registry
import { ProcurementReceivingTab } from '@/components/procurement/procurement-receiving-tab'
import { ProcurementMatchingTab } from '@/components/procurement/procurement-matching-tab'
import type { TabComponentProps } from '@/types'

export const PROCUREMENT_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'receiving': ProcurementReceivingTab,
  'matching': ProcurementMatchingTab,
  // Other Procurement tabs use generic views (table, list, etc.)
}

export function getProcurementTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return PROCUREMENT_TAB_COMPONENTS[tabSlug]
}
