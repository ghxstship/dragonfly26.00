// Reports module tab components registry
import { ReportsOverviewTab } from '@/components/reports/reports-overview-tab'
import { ReportsCustomBuilderTab } from '@/components/reports/reports-custom-builder-tab'
import { ReportsTemplatesTab } from '@/components/reports/reports-templates-tab'
import { ReportsScheduledTab } from '@/components/reports/reports-scheduled-tab'
import { ReportsExportsTab } from '@/components/reports/reports-exports-tab'
import { ReportsComplianceTab } from '@/components/reports/reports-compliance-tab'
import { ReportsExecutiveTab } from '@/components/reports/reports-executive-tab'
import { ReportsOperationalTab } from '@/components/reports/reports-operational-tab'
import { ReportsArchivedTab } from '@/components/reports/reports-archived-tab'
import type { TabComponentProps } from '@/types'

export const REPORTS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'overview': ReportsOverviewTab as any,
  'custom-builder': ReportsCustomBuilderTab as any,
  'templates': ReportsTemplatesTab as any,
  'scheduled': ReportsScheduledTab as any,
  'exports': ReportsExportsTab as any,
  'compliance': ReportsComplianceTab as any,
  'executive': ReportsExecutiveTab as any,
  'operational': ReportsOperationalTab as any,
  'archived': ReportsArchivedTab as any,
}

export function getReportsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return REPORTS_TAB_COMPONENTS[tabSlug]
}
