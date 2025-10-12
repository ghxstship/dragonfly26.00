import { 
  ReportsOverviewTab,
  ReportsTemplatesTab,
  ReportsScheduledTab,
  ReportsExportsTab,
  ReportsCustomBuilderTab,
  ReportsComplianceTab,
  ReportsExecutiveTab,
  ReportsOperationalTab,
  ReportsArchivedTab,
} from '@/components/reports'

// Map tab slugs to components
const reportsTabComponents: Record<string, React.ComponentType> = {
  'overview': ReportsOverviewTab,
  'custom-builder': ReportsCustomBuilderTab,
  'templates': ReportsTemplatesTab,
  'scheduled': ReportsScheduledTab,
  'exports': ReportsExportsTab,
  'compliance': ReportsComplianceTab,
  'executive': ReportsExecutiveTab,
  'operational': ReportsOperationalTab,
  'archived': ReportsArchivedTab,
}

export function getReportsTabComponent(tabSlug: string): React.ComponentType | undefined {
  return reportsTabComponents[tabSlug]
}
