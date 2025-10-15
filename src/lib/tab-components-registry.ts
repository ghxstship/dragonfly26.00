// Central registry for all module tab components
// This file consolidates imports from individual module tab component files

import { ADMIN_TAB_COMPONENTS, getAdminTabComponent } from './admin-tab-components'
import { ANALYTICS_TAB_COMPONENTS, getAnalyticsTabComponent } from './analytics-tab-components'
import { ASSETS_TAB_COMPONENTS, getAssetsTabComponent } from './assets-tab-components'
import { COMMUNITY_TAB_COMPONENTS, getCommunityTabComponent } from './community-tab-components'
import { COMPANIES_TAB_COMPONENTS, getCompaniesTabComponent } from './companies-tab-components'
import { DASHBOARD_TAB_COMPONENTS, getDashboardTabComponent } from './dashboard-tab-components'
import { EVENTS_TAB_COMPONENTS, getEventsTabComponent } from './events-tab-components'
import { FILES_TAB_COMPONENTS, getFilesTabComponent } from './files-tab-components'
import { FINANCE_TAB_COMPONENTS, getFinanceTabComponent } from './finance-tab-components'
import { INSIGHTS_TAB_COMPONENTS, getInsightsTabComponent } from './insights-tab-components'
import { JOBS_TAB_COMPONENTS, getJobsTabComponent } from './jobs-tab-components'
import { LOCATIONS_TAB_COMPONENTS, getLocationsTabComponent } from './locations-tab-components'
import { MARKETPLACE_TAB_COMPONENTS, getMarketplaceTabComponent } from './marketplace-tab-components'
import { PEOPLE_TAB_COMPONENTS, getPeopleTabComponent } from './people-tab-components'
import { PROCUREMENT_TAB_COMPONENTS, getProcurementTabComponent } from './procurement-tab-components'
import { PROFILE_TAB_COMPONENTS, getProfileTabComponent } from './profile-tab-components'
import { PROJECTS_TAB_COMPONENTS, getProjectsTabComponent } from './projects-tab-components'
import { REPORTS_TAB_COMPONENTS, getReportsTabComponent } from './reports-tab-components'
import { RESOURCES_TAB_COMPONENTS, getResourcesTabComponent } from './resources-tab-components'
import { SETTINGS_TAB_COMPONENTS, getSettingsTabComponent } from './settings-tab-components'

// Re-export constants that are exported from their modules
export { ADMIN_TAB_COMPONENTS } from './admin-tab-components'
export { ANALYTICS_TAB_COMPONENTS } from './analytics-tab-components'
export { ASSETS_TAB_COMPONENTS } from './assets-tab-components'
export { COMMUNITY_TAB_COMPONENTS } from './community-tab-components'
export { COMPANIES_TAB_COMPONENTS } from './companies-tab-components'
export { DASHBOARD_TAB_COMPONENTS } from './dashboard-tab-components'
export { EVENTS_TAB_COMPONENTS } from './events-tab-components'
export { FILES_TAB_COMPONENTS } from './files-tab-components'
export { FINANCE_TAB_COMPONENTS } from './finance-tab-components'
export { INSIGHTS_TAB_COMPONENTS } from './insights-tab-components'
export { JOBS_TAB_COMPONENTS } from './jobs-tab-components'
export { LOCATIONS_TAB_COMPONENTS } from './locations-tab-components'
export { MARKETPLACE_TAB_COMPONENTS } from './marketplace-tab-components'
export { PEOPLE_TAB_COMPONENTS } from './people-tab-components'
export { PROCUREMENT_TAB_COMPONENTS } from './procurement-tab-components'
export { PROFILE_TAB_COMPONENTS } from './profile-tab-components'
export { PROJECTS_TAB_COMPONENTS } from './projects-tab-components'
export { REPORTS_TAB_COMPONENTS } from './reports-tab-components'
export { RESOURCES_TAB_COMPONENTS } from './resources-tab-components'
export { SETTINGS_TAB_COMPONENTS } from './settings-tab-components'

// Helper function to get tab component for any module
export function getModuleTabComponent(moduleId: string, tabSlug: string) {
  const getters: Record<string, (slug: string) => React.ComponentType<any> | undefined> = {
    admin: getAdminTabComponent,
    analytics: getAnalyticsTabComponent,
    assets: getAssetsTabComponent,
    community: getCommunityTabComponent,
    companies: getCompaniesTabComponent,
    dashboard: getDashboardTabComponent,
    events: getEventsTabComponent,
    files: getFilesTabComponent,
    finance: getFinanceTabComponent,
    insights: getInsightsTabComponent,
    jobs: getJobsTabComponent,
    locations: getLocationsTabComponent,
    marketplace: getMarketplaceTabComponent,
    people: getPeopleTabComponent,
    procurement: getProcurementTabComponent,
    profile: getProfileTabComponent,
    projects: getProjectsTabComponent,
    reports: getReportsTabComponent,
    resources: getResourcesTabComponent,
    settings: getSettingsTabComponent,
  }

  const getter = getters[moduleId]
  return getter ? getter(tabSlug) : undefined
}
