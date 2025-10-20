/**
 * Opportunities Module Tab Components Registry
 * 
 * Central registry for all Opportunities module tabs
 * Follows established pattern from other modules
 */

import { LucideIcon, Sparkles, Briefcase, Users, Award, DollarSign } from 'lucide-react'

export interface OpportunitiesTabProps {
  workspaceId?: string
  userId?: string
}

export interface OpportunitiesTabDefinition {
  id: string
  labelKey: string
  icon: LucideIcon
  component: string
  path: string
  order: number
}

/**
 * Opportunities Module Tab Registry
 * 
 * Tab Order:
 * 1. Spotlight (featured opportunities feed)
 * 2. Jobs (contractor/subcontractor)
 * 3. Careers (staffing/permanent)
 * 4. Sponsorship (brand partnerships)
 * 5. Grants (global opportunities)
 */
export const OPPORTUNITIES_TABS: OpportunitiesTabDefinition[] = [
  {
    id: 'spotlight',
    labelKey: 'opportunities.tabs.spotlight',
    icon: Sparkles,
    component: 'OpportunitiesSpotlightTab',
    path: '/opportunities/spotlight',
    order: 1,
  },
  {
    id: 'jobs',
    labelKey: 'opportunities.tabs.jobs',
    icon: Briefcase,
    component: 'OpportunitiesJobsTab',
    path: '/opportunities/jobs',
    order: 2,
  },
  {
    id: 'careers',
    labelKey: 'opportunities.tabs.careers',
    icon: Users,
    component: 'OpportunitiesCareersTab',
    path: '/opportunities/careers',
    order: 3,
  },
  {
    id: 'sponsorship',
    labelKey: 'opportunities.tabs.sponsorship',
    icon: Award,
    component: 'OpportunitiesSponsorshipTab',
    path: '/opportunities/sponsorship',
    order: 4,
  },
  {
    id: 'grants',
    labelKey: 'opportunities.tabs.grants',
    icon: DollarSign,
    component: 'OpportunitiesGrantsTab',
    path: '/opportunities/grants',
    order: 5,
  },
]

/**
 * Get tab by ID
 */
export function getOpportunitiesTab(id: string): OpportunitiesTabDefinition | undefined {
  return OPPORTUNITIES_TABS.find(tab => tab.id === id)
}

/**
 * Get all tabs sorted by order
 */
export function getAllOpportunitiesTabs(): OpportunitiesTabDefinition[] {
  return [...OPPORTUNITIES_TABS].sort((a, b) => a.order - b.order)
}

/**
 * Get default tab (first tab)
 */
export function getDefaultOpportunitiesTab(): OpportunitiesTabDefinition {
  return OPPORTUNITIES_TABS[0] // Spotlight
}
