// Finance module tab components registry
import { FinanceOverviewTab } from '@/components/finance/finance-overview-tab'
import { FinanceApprovalsTab } from '@/components/finance/finance-approvals-tab'
import { FinanceScenariosTab } from '@/components/finance/finance-scenarios-tab'
import { FinanceVarianceTab } from '@/components/finance/finance-variance-tab'
import { FinanceCashFlowTab } from '@/components/finance/finance-cash-flow-tab'
import { FinancePoliciesTab } from '@/components/finance/finance-policies-tab'
import type { TabComponentProps } from '@/types'

export const FINANCE_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'overview': FinanceOverviewTab,
  'approvals': FinanceApprovalsTab,
  'scenarios': FinanceScenariosTab,
  'variance': FinanceVarianceTab,
  'cash-flow': FinanceCashFlowTab,
  'policies': FinancePoliciesTab,
  // Other Finance tabs use generic views (table, list, etc.)
}

export function getFinanceTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return FINANCE_TAB_COMPONENTS[tabSlug]
}
