// Companies module tab components registry
import { CompaniesOrganizationsTab } from '@/components/companies/companies-organizations-tab'
import { CompaniesContactsTab } from '@/components/companies/companies-contacts-tab'
import type { TabComponentProps } from '@/types'

export const COMPANIES_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'organizations': CompaniesOrganizationsTab,
  'contacts': CompaniesContactsTab,
  // Other companies tabs use generic views (table, list, etc.)
}

export function getCompaniesTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return COMPANIES_TAB_COMPONENTS[tabSlug]
}
