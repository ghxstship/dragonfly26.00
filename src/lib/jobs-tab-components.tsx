// Jobs module tab components registry
import { JobsPipelineTab } from '@/components/jobs/jobs-pipeline-tab'
import type { TabComponentProps } from '@/types'

export const JOBS_TAB_COMPONENTS: Record<string, React.ComponentType<TabComponentProps> | undefined> = {
  'pipeline': JobsPipelineTab,
  // Other jobs tabs use generic views (table, board, etc.)
}

export function getJobsTabComponent(tabSlug: string): React.ComponentType<TabComponentProps> | undefined {
  return JOBS_TAB_COMPONENTS[tabSlug]
}
