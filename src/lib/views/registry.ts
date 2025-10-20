import type { ViewType } from '@/types'

export interface ViewDefinition {
  type: ViewType
  name: string
  description: string
  icon: string
  category: 'core' | 'advanced' | 'specialized'
  features: string[]
  compatibleModules?: string[] // If undefined, compatible with all
}

export const VIEW_DEFINITIONS: ViewDefinition[] = [
  // Core Views
  {
    type: 'list',
    name: 'List',
    description: 'Grouped rows with inline editing and subtasks',
    icon: 'List',
    category: 'core',
    features: ['Grouping', 'Inline editing', 'Subtasks', 'Bulk actions'],
  },
  {
    type: 'board',
    name: 'Board',
    description: 'Kanban-style columns with drag-and-drop',
    icon: 'Columns',
    category: 'core',
    features: ['Swimlanes', 'Drag-and-drop', 'WIP limits', 'Column customization'],
  },
  {
    type: 'table',
    name: 'Table',
    description: 'Spreadsheet-style data grid',
    icon: 'Table',
    category: 'core',
    features: ['Sortable columns', 'Filtering', 'Formulas', 'Conditional formatting'],
  },
  {
    type: 'calendar',
    name: 'Calendar',
    description: 'Month, week, day, and agenda views',
    icon: 'Calendar',
    category: 'core',
    features: ['Multiple views', 'Drag-to-reschedule', 'Color coding', 'Time blocking'],
  },
  {
    type: 'timeline',
    name: 'Timeline',
    description: 'Gantt chart with dependencies',
    icon: 'GanttChart',
    category: 'core',
    features: ['Dependencies', 'Critical path', 'Milestones', 'Baseline comparison'],
  },
  {
    type: 'workload',
    name: 'Workload',
    description: 'Team capacity planning',
    icon: 'Users',
    category: 'core',
    features: ['Capacity planning', 'User columns', 'Overallocation warnings', 'Time estimates'],
  },

  // Advanced Views
  {
    type: 'map',
    name: 'Map',
    description: 'Geographic visualization',
    icon: 'Map',
    category: 'advanced',
    features: ['Clustering', 'Radius filtering', 'Custom markers', 'Route planning'],
    compatibleModules: ['locations', 'assets', 'events'],
  },
  {
    type: 'mind-map',
    name: 'Mind Map',
    description: 'Hierarchical node diagram',
    icon: 'Network',
    category: 'advanced',
    features: ['Radial layout', 'Tree layout', 'Expand/collapse', 'Export as image'],
  },
  {
    type: 'form',
    name: 'Form',
    description: 'Public-facing data collection',
    icon: 'FileInput',
    category: 'advanced',
    features: ['Conditional logic', 'Custom branding', 'Embed codes', 'Notifications'],
  },
  {
    type: 'activity',
    name: 'Activity',
    description: 'Chronological activity stream',
    icon: 'Activity',
    category: 'advanced',
    features: ['Filter by user', 'Comment threads', '@mentions', 'Real-time updates'],
  },
  {
    type: 'box',
    name: 'Box',
    description: 'Card-based grid layout',
    icon: 'LayoutGrid',
    category: 'advanced',
    features: ['Masonry grid', 'Card preview', 'Cover images', 'Quick actions'],
  },
  {
    type: 'embed',
    name: 'Embed',
    description: 'Embed external content',
    icon: 'Frame',
    category: 'advanced',
    features: ['iFrame support', 'Full-screen mode', 'Refresh button', 'Multiple embeds'],
  },
  {
    type: 'chat',
    name: 'Chat',
    description: 'Threaded conversations',
    icon: 'MessageSquare',
    category: 'advanced',
    features: ['Threaded messages', 'File attachments', 'Task creation', 'Unread indicators'],
  },
  {
    type: 'dashboard',
    name: 'Dashboard',
    description: 'Customizable widget grid',
    icon: 'LayoutDashboard',
    category: 'advanced',
    features: ['Chart widgets', 'Metric cards', 'Drag-to-reorder', 'Widget resize'],
  },
  {
    type: 'doc',
    name: 'Doc',
    description: 'Collaborative rich text editor',
    icon: 'FileText',
    category: 'advanced',
    features: ['Real-time editing', 'Inline comments', 'Linked databases', 'Export'],
  },

  // Specialized Views
  {
    type: 'financial',
    name: 'Financial Dashboard',
    description: 'Budget and expense tracking',
    icon: 'DollarSign',
    category: 'specialized',
    features: ['Budget vs actual', 'Expense breakdown', 'Revenue tracking', 'Cash flow'],
    compatibleModules: ['finance'],
  },
  {
    type: 'portfolio',
    name: 'Portfolio',
    description: 'Multi-project overview',
    icon: 'Briefcase',
    category: 'specialized',
    features: ['Project cards', 'Health indicators', 'Progress rollup', 'Resource allocation'],
    compatibleModules: ['projects'],
  },
  {
    type: 'pivot',
    name: 'Pivot Table',
    description: 'Multi-dimensional data analysis',
    icon: 'PivotTable',
    category: 'specialized',
    features: ['Drag-and-drop config', 'Aggregation functions', 'Drill-down', 'Export'],
  },
]

export function getViewDefinition(type: ViewType): ViewDefinition | undefined {
  return VIEW_DEFINITIONS.find((v: any) => v.type === type)
}

export function getViewsByCategory(category: string): ViewDefinition[] {
  return VIEW_DEFINITIONS.filter((v: any) => v.category === category)
}

export function getCompatibleViews(moduleSlug: string): ViewDefinition[] {
  return VIEW_DEFINITIONS.filter(
    (v) => !v.compatibleModules || v.compatibleModules.includes(moduleSlug)
  )
}

export function isViewCompatible(viewType: ViewType, moduleSlug: string): boolean {
  const viewDef = getViewDefinition(viewType)
  return !viewDef?.compatibleModules || viewDef.compatibleModules.includes(moduleSlug)
}
