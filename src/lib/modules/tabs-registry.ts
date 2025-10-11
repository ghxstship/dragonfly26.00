import type { ModuleTab, ViewType } from '@/types'

const ALL_VIEWS: ViewType[] = [
  'list', 'board', 'table', 'calendar', 'timeline', 'workload', 'map',
  'mind-map', 'form', 'activity', 'box', 'embed', 'chat', 'dashboard',
  'doc', 'financial', 'portfolio', 'pivot',
]

// Helper to create tabs
const createTab = (
  id: string,
  module_id: string,
  name: string,
  slug: string,
  icon: string,
  order: number,
  defaultView: ViewType = 'list',
  description?: string,
  color?: string
): ModuleTab => ({
  id,
  module_id,
  name,
  slug,
  description,
  icon,
  order,
  enabled: true,
  default_view: defaultView,
  available_views: ALL_VIEWS,
  color,
})

export const MODULE_TABS: Record<string, ModuleTab[]> = {
  dashboard: [
    createTab('dashboard-overview', 'dashboard', 'Overview', 'overview', 'LayoutDashboard', 0, 'dashboard', 'Production overview & key metrics', '#8b5cf6'),
    createTab('dashboard-active-productions', 'dashboard', 'Active Productions', 'active-productions', 'Clapperboard', 1, 'board', 'Live and in-progress productions', '#16a34a'),
    createTab('dashboard-crew-workload', 'dashboard', 'Crew Workload', 'crew-workload', 'Users', 2, 'workload', 'Team capacity & assignments', '#2563eb'),
    createTab('dashboard-show-schedule', 'dashboard', 'Show Schedule', 'show-schedule', 'Calendar', 3, 'calendar', 'Upcoming shows & performances', '#dc2626'),
    createTab('dashboard-my-assignments', 'dashboard', 'My Assignments', 'my-assignments', 'UserCheck', 4, 'list', 'Personal task & role assignments', '#7c3aed'),
    createTab('dashboard-production-pipeline', 'dashboard', 'Production Pipeline', 'production-pipeline', 'GitBranch', 5, 'timeline', 'Production lifecycle stages', '#ea580c'),
    createTab('dashboard-budget-overview', 'dashboard', 'Budget Overview', 'budget-overview', 'DollarSign', 6, 'financial', 'Financial performance across productions', '#059669'),
    createTab('dashboard-vendor-status', 'dashboard', 'Vendor Status', 'vendor-status', 'Truck', 7, 'table', 'Vendor deliverables & timelines', '#0891b2'),
    createTab('dashboard-activity-feed', 'dashboard', 'Activity Feed', 'activity-feed', 'Activity', 8, 'activity', 'Recent production updates', '#8b5cf6'),
    createTab('dashboard-analytics', 'dashboard', 'Analytics', 'analytics', 'TrendingUp', 9, 'dashboard', 'Production performance analytics', '#7c3aed'),
  ],
  projects: [
    createTab('projects-all-productions', 'projects', 'All Productions', 'all-productions', 'Clapperboard', 0, 'board', 'All production projects', '#7c3aed'),
    createTab('projects-pre-production', 'projects', 'Pre-Production', 'pre-production', 'FileEdit', 1, 'board', 'Planning & design phase', '#f59e0b'),
    createTab('projects-in-production', 'projects', 'In Production', 'in-production', 'Play', 2, 'board', 'Active build & rehearsal', '#16a34a'),
    createTab('projects-load-in', 'projects', 'Load-In', 'load-in', 'TruckIcon', 3, 'timeline', 'Installation & setup phase', '#2563eb'),
    createTab('projects-live-run', 'projects', 'Live Run', 'live-run', 'Radio', 4, 'calendar', 'Active show dates', '#dc2626'),
    createTab('projects-strike-load-out', 'projects', 'Strike/Load-Out', 'strike-load-out', 'PackageOpen', 5, 'timeline', 'Teardown & removal', '#ea580c'),
    createTab('projects-post-production', 'projects', 'Post-Production', 'post-production', 'FileCheck', 6, 'list', 'Wrap & reconciliation', '#7c3aed'),
    createTab('projects-budget-tracking', 'projects', 'Budget Tracking', 'budget-tracking', 'DollarSign', 7, 'financial', 'Production budgets & actuals', '#059669'),
    createTab('projects-crew-assignments', 'projects', 'Crew Assignments', 'crew-assignments', 'Users', 8, 'workload', 'Crew scheduling & roles', '#8b5cf6'),
    createTab('projects-archive', 'projects', 'Archive', 'archive', 'Archive', 9, 'table', 'Completed productions', '#64748b'),
  ],
  events: [
    createTab('events-show-calendar', 'events', 'Show Calendar', 'show-calendar', 'Calendar', 0, 'calendar', 'All show dates & performances', '#dc2626'),
    createTab('events-upcoming-shows', 'events', 'Upcoming Shows', 'upcoming-shows', 'PlayCircle', 1, 'list', 'Next performances & events', '#16a34a'),
    createTab('events-tour-dates', 'events', 'Tour Dates', 'tour-dates', 'Route', 2, 'timeline', 'Multi-city tour schedules', '#2563eb'),
    createTab('events-call-times', 'events', 'Call Times', 'call-times', 'Clock', 3, 'table', 'Crew & talent call schedules', '#ea580c'),
    createTab('events-rehearsals', 'events', 'Rehearsals', 'rehearsals', 'Repeat', 4, 'calendar', 'Rehearsal schedules', '#7c3aed'),
    createTab('events-production-meetings', 'events', 'Production Meetings', 'production-meetings', 'Users', 5, 'list', 'Meetings & reviews', '#0891b2'),
    createTab('events-deadlines', 'events', 'Deadlines', 'deadlines', 'AlertCircle', 6, 'list', 'Critical production deadlines', '#dc2626'),
    createTab('events-venue-availability', 'events', 'Venue Availability', 'venue-availability', 'MapPin', 7, 'calendar', 'Venue booking & access', '#8b5cf6'),
    createTab('events-tech-schedules', 'events', 'Tech Schedules', 'tech-schedules', 'Wrench', 8, 'timeline', 'Technical rehearsals & cue-to-cue', '#f59e0b'),
    createTab('events-past-shows', 'events', 'Past Shows', 'past-shows', 'Archive', 9, 'table', 'Completed performances', '#64748b'),
  ],
  people: [
    createTab('people-crew-roster', 'people', 'Crew Roster', 'crew-roster', 'Users', 0, 'table', 'All crew members & staff', '#2563eb'),
    createTab('people-talent-artists', 'people', 'Talent & Artists', 'talent-artists', 'Mic', 1, 'table', 'Performers, artists, speakers', '#8b5cf6'),
    createTab('people-vendors', 'people', 'Vendors', 'vendors', 'Store', 2, 'table', 'Suppliers & service providers', '#059669'),
    createTab('people-contractors', 'people', 'Contractors', 'contractors', 'Briefcase', 3, 'table', 'Freelance & contract workers', '#7c3aed'),
    createTab('people-departments', 'people', 'Departments', 'departments', 'Layers', 4, 'mind-map', 'Production departments', '#ea580c'),
    createTab('people-availability', 'people', 'Availability', 'availability', 'Calendar', 5, 'calendar', 'Crew & talent availability', '#dc2626'),
    createTab('people-certifications', 'people', 'Certifications', 'certifications', 'Award', 6, 'table', 'Licenses & certifications', '#f59e0b'),
    createTab('people-payroll', 'people', 'Payroll', 'payroll', 'DollarSign', 7, 'table', 'Rates & payment tracking', '#059669'),
    createTab('people-contacts', 'people', 'Contacts', 'contacts', 'Phone', 8, 'table', 'Emergency & primary contacts', '#0891b2'),
    createTab('people-onboarding', 'people', 'Onboarding', 'onboarding', 'UserPlus', 9, 'list', 'New crew onboarding', '#16a34a'),
  ],
  assets: [
    createTab('assets-inventory', 'assets', 'Inventory', 'inventory', 'Package', 0, 'table', 'Full equipment inventory', '#ea580c'),
    createTab('assets-audio', 'assets', 'Audio', 'audio', 'Music', 1, 'table', 'Sound systems & audio gear', '#7c3aed'),
    createTab('assets-lighting', 'assets', 'Lighting', 'lighting', 'Lightbulb', 2, 'table', 'Lighting fixtures & control', '#f59e0b'),
    createTab('assets-video', 'assets', 'Video', 'video', 'Video', 3, 'table', 'Video & projection equipment', '#2563eb'),
    createTab('assets-staging-rigging', 'assets', 'Staging & Rigging', 'staging-rigging', 'Box', 4, 'table', 'Stages, truss, rigging gear', '#64748b'),
    createTab('assets-rentals', 'assets', 'Rentals', 'rentals', 'ShoppingCart', 5, 'table', 'Rented equipment tracking', '#059669'),
    createTab('assets-check-out-in', 'assets', 'Check-Out/In', 'check-out-in', 'ArrowRightLeft', 6, 'list', 'Equipment assignments', '#8b5cf6'),
    createTab('assets-maintenance', 'assets', 'Maintenance', 'maintenance', 'Wrench', 7, 'calendar', 'Service & repair schedules', '#dc2626'),
    createTab('assets-transportation', 'assets', 'Transportation', 'transportation', 'Truck', 8, 'list', 'Vehicles & trucking', '#0891b2'),
    createTab('assets-depreciation', 'assets', 'Depreciation', 'depreciation', 'TrendingDown', 9, 'financial', 'Asset value tracking', '#dc2626'),
  ],
  locations: [
    createTab('locations-venue-map', 'locations', 'Venue Map', 'venue-map', 'Map', 0, 'map', 'Geographic venue locations', '#16a34a'),
    createTab('locations-venues', 'locations', 'Venues', 'venues', 'Building', 1, 'table', 'Performance venues & facilities', '#2563eb'),
    createTab('locations-stages', 'locations', 'Stages', 'stages', 'Box', 2, 'table', 'Stage configurations & specs', '#7c3aed'),
    createTab('locations-load-in-access', 'locations', 'Load-In Access', 'load-in-access', 'TruckIcon', 3, 'table', 'Loading docks & access points', '#ea580c'),
    createTab('locations-backstage-areas', 'locations', 'Backstage Areas', 'backstage-areas', 'DoorClosed', 4, 'table', 'Dressing rooms, green rooms, storage', '#0891b2'),
    createTab('locations-warehouse-storage', 'locations', 'Warehouse & Storage', 'warehouse-storage', 'Warehouse', 5, 'table', 'Equipment storage facilities', '#64748b'),
    createTab('locations-site-surveys', 'locations', 'Site Surveys', 'site-surveys', 'FileCheck', 6, 'list', 'Venue assessments & tech specs', '#8b5cf6'),
    createTab('locations-power-utilities', 'locations', 'Power & Utilities', 'power-utilities', 'Zap', 7, 'table', 'Power distribution & utilities', '#f59e0b'),
    createTab('locations-permits-access', 'locations', 'Permits & Access', 'permits-access', 'ShieldCheck', 8, 'table', 'Venue permits & access credentials', '#059669'),
    createTab('locations-tour-routing', 'locations', 'Tour Routing', 'tour-routing', 'Route', 9, 'map', 'Multi-city tour logistics', '#dc2626'),
  ],
  files: [
    createTab('files-all-documents', 'files', 'All Documents', 'all-documents', 'FileText', 0, 'table', 'All production documents', '#4f46e5'),
    createTab('files-contracts', 'files', 'Contracts', 'contracts', 'FileSignature', 1, 'table', 'Vendor & talent contracts', '#059669'),
    createTab('files-riders', 'files', 'Riders', 'riders', 'ScrollText', 2, 'table', 'Technical & hospitality riders', '#7c3aed'),
    createTab('files-tech-specs', 'files', 'Tech Specs', 'tech-specs', 'FileCode', 3, 'table', 'Technical specifications & drawings', '#2563eb'),
    createTab('files-call-sheets', 'files', 'Call Sheets', 'call-sheets', 'ClipboardList', 4, 'list', 'Daily call sheets & schedules', '#ea580c'),
    createTab('files-insurance-permits', 'files', 'Insurance & Permits', 'insurance-permits', 'ShieldCheck', 5, 'table', 'Insurance certs & permits', '#16a34a'),
    createTab('files-media-assets', 'files', 'Media Assets', 'media-assets', 'Image', 6, 'box', 'Photos, videos, graphics', '#8b5cf6'),
    createTab('files-production-reports', 'files', 'Production Reports', 'production-reports', 'FileBarChart', 7, 'table', 'Daily reports & documentation', '#0891b2'),
    createTab('files-shared', 'files', 'Shared', 'shared', 'Share2', 8, 'table', 'Shared with external parties', '#f59e0b'),
    createTab('files-archive', 'files', 'Archive', 'archive', 'Archive', 9, 'table', 'Archived production files', '#64748b'),
  ],
  admin: [
    createTab('admin-overview', 'admin', 'Overview', 'overview', 'LayoutDashboard', 0, 'dashboard', 'Organization overview & metrics', '#64748b'),
    createTab('admin-organization', 'admin', 'Organization', 'organization', 'Building', 1, 'table', 'Organization settings & profile', '#2563eb'),
    createTab('admin-members', 'admin', 'Members', 'members', 'Users', 2, 'table', 'Team member management', '#7c3aed'),
    createTab('admin-roles-permissions', 'admin', 'Roles & Permissions', 'roles-permissions', 'Shield', 3, 'table', 'Access control & permissions', '#8b5cf6'),
    createTab('admin-billing', 'admin', 'Billing', 'billing', 'CreditCard', 4, 'table', 'Subscription & billing', '#059669'),
    createTab('admin-security', 'admin', 'Security', 'security', 'Lock', 5, 'table', 'Security settings & logs', '#dc2626'),
    createTab('admin-automations', 'admin', 'Automations', 'automations', 'Bot', 6, 'table', 'Workflow automation rules', '#8b5cf6'),
    createTab('admin-integrations', 'admin', 'Integrations', 'integrations', 'Zap', 7, 'table', 'Third-party integrations', '#f59e0b'),
    createTab('admin-webhooks', 'admin', 'Webhooks', 'webhooks', 'Webhook', 8, 'table', 'Webhook configurations', '#06b6d4'),
    createTab('admin-api-tokens', 'admin', 'API Tokens', 'api-tokens', 'Key', 9, 'table', 'API access tokens', '#64748b'),
  ],
  companies: [
    createTab('companies-all-companies', 'companies', 'All Companies', 'all-companies', 'Building2', 0, 'table', 'Complete company directory', '#2563eb'),
    createTab('companies-clients', 'companies', 'Clients', 'clients', 'BadgeCheck', 1, 'table', 'Client organizations & relationships', '#16a34a'),
    createTab('companies-vendors', 'companies', 'Vendors', 'vendors', 'Store', 2, 'table', 'Vendor & supplier companies', '#059669'),
    createTab('companies-partners', 'companies', 'Partners', 'partners', 'Users2', 3, 'table', 'Strategic partner organizations', '#7c3aed'),
    createTab('companies-sponsors', 'companies', 'Sponsors', 'sponsors', 'Award', 4, 'table', 'Sponsoring companies & brands', '#f59e0b'),
    createTab('companies-agencies', 'companies', 'Agencies', 'agencies', 'Briefcase', 5, 'table', 'Talent, production, & creative agencies', '#8b5cf6'),
    createTab('companies-contacts', 'companies', 'Contacts', 'contacts', 'UserCircle', 6, 'table', 'Key company contacts & decision makers', '#2563eb'),
    createTab('companies-contracts', 'companies', 'Contracts', 'contracts', 'FileSignature', 7, 'table', 'Company contracts & agreements', '#0891b2'),
    createTab('companies-invoicing', 'companies', 'Invoicing', 'invoicing', 'Receipt', 8, 'financial', 'Company invoices & payments', '#059669'),
    createTab('companies-performance', 'companies', 'Performance', 'performance', 'TrendingUp', 9, 'dashboard', 'Company ratings & performance metrics', '#dc2626'),
  ],
  contacts: [
    createTab('contacts-my-network', 'contacts', 'My Network', 'my-network', 'Network', 0, 'table', 'Your professional connections & network overview', '#10b981'),
    createTab('contacts-all-contacts', 'contacts', 'Contacts', 'all-contacts', 'UserCircle2', 1, 'table', 'Complete contact directory', '#2563eb'),
    createTab('contacts-connections', 'contacts', 'Connections', 'connections', 'Users2', 2, 'table', 'Direct connections & relationships', '#7c3aed'),
    createTab('contacts-messages', 'contacts', 'Messages', 'messages', 'MessageSquare', 3, 'chat', 'Contact conversations & communications', '#0891b2'),
    createTab('contacts-activity', 'contacts', 'Activity', 'activity', 'Activity', 4, 'activity', 'Network activity feed & updates', '#8b5cf6'),
    createTab('contacts-recommendations', 'contacts', 'Recommendations', 'recommendations', 'ThumbsUp', 5, 'list', 'Endorsements & recommendations', '#f59e0b'),
    createTab('contacts-groups', 'contacts', 'Groups', 'groups', 'Users', 6, 'table', 'Professional groups & communities', '#16a34a'),
    createTab('contacts-events', 'contacts', 'Events', 'events', 'CalendarDays', 7, 'calendar', 'Networking events & meetups', '#dc2626'),
    createTab('contacts-notes', 'contacts', 'Notes', 'notes', 'FileText', 8, 'list', 'Contact notes & interaction history', '#64748b'),
    createTab('contacts-insights', 'contacts', 'Insights', 'insights', 'LineChart', 9, 'dashboard', 'Network analytics & growth metrics', '#059669'),
  ],
}

export function getModuleTabs(moduleId: string): ModuleTab[] {
  return MODULE_TABS[moduleId] || []
}

export function getTabBySlug(moduleId: string, tabSlug: string): ModuleTab | undefined {
  const tabs = MODULE_TABS[moduleId] || []
  return tabs.find((tab) => tab.slug === tabSlug)
}
