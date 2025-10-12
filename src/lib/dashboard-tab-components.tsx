import { DashboardOverviewTab } from "@/components/dashboard/dashboard-overview-tab"
import { DashboardMyAgendaTab } from "@/components/dashboard/dashboard-my-agenda-tab"
import { DashboardMyJobsTab } from "@/components/dashboard/dashboard-my-jobs-tab"
import { DashboardMyTasksTab } from "@/components/dashboard/dashboard-my-tasks-tab"
import { DashboardMyAssetsTab } from "@/components/dashboard/dashboard-my-assets-tab"
import { DashboardMyOrdersTab } from "@/components/dashboard/dashboard-my-orders-tab"
import { DashboardMyAdvancesTab } from "@/components/dashboard/dashboard-my-advances-tab"
import { DashboardMyTravelTab } from "@/components/dashboard/dashboard-my-travel-tab"
import { DashboardMyExpensesTab } from "@/components/dashboard/dashboard-my-expenses-tab"
import { DashboardMyReportsTab } from "@/components/dashboard/dashboard-my-reports-tab"
import { DashboardMyFilesTab } from "@/components/dashboard/dashboard-my-files-tab"

export const DASHBOARD_TAB_COMPONENTS: Record<string, React.ComponentType> = {
  "overview": DashboardOverviewTab,
  "my-agenda": DashboardMyAgendaTab,
  "my-jobs": DashboardMyJobsTab,
  "my-tasks": DashboardMyTasksTab,
  "my-assets": DashboardMyAssetsTab,
  "my-orders": DashboardMyOrdersTab,
  "my-advances": DashboardMyAdvancesTab,
  "my-travel": DashboardMyTravelTab,
  "my-expenses": DashboardMyExpensesTab,
  "my-reports": DashboardMyReportsTab,
  "my-files": DashboardMyFilesTab,
}

export function getDashboardTabComponent(tabSlug: string) {
  return DASHBOARD_TAB_COMPONENTS[tabSlug]
}
