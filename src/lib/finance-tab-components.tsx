// Finance module tab components registry
import { FinanceOverviewTab } from '@/components/finance/finance-overview-tab'

interface FinanceTabProps {
  data?: any[]
  loading?: boolean
}

export const FINANCE_TAB_COMPONENTS: Record<string, React.ComponentType<FinanceTabProps> | undefined> = {
  'overview': FinanceOverviewTab,
  // Other Finance tabs use generic views
}

export function getFinanceTabComponent(tabSlug: string): React.ComponentType<FinanceTabProps> | undefined {
  return FINANCE_TAB_COMPONENTS[tabSlug]
}
