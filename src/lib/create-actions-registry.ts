import type { LucideIcon } from 'lucide-react'
import {
  FolderKanban,
  Briefcase,
  CheckSquare,
  Package,
  MapPin,
  FileText,
  BarChart3,
  Target,
  Key,
  Webhook,
  Bot,
  ListChecks,
  Palette,
  LayoutList,
  Users,
  Building2,
  Calendar,
  UserPlus,
  Globe,
} from 'lucide-react'

export interface CreateAction {
  id: string
  name: string
  description: string
  icon: string // Icon name as string for dynamic lookup
  category: 'core' | 'advanced' | 'admin' | 'system'
  keyboard_shortcut?: string
  itemType?: string // For CreateItemDialog compatibility
  dialogType?: 'item' | 'objective' | 'token' | 'webhook' | 'automation' | 'template' | 'status' | 'custom'
  moduleContext?: string // Which module this belongs to
  requiresAdmin?: boolean
}

export const CREATE_ACTIONS: CreateAction[] = [
  // Core Production Items (Default Favorites)
  {
    id: 'create-project',
    name: 'Project',
    description: 'Create a new production project',
    icon: 'FolderKanban',
    category: 'core',
    keyboard_shortcut: '⌘⇧P',
    itemType: 'project',
    dialogType: 'item',
    moduleContext: 'projects',
  },
  {
    id: 'create-job',
    name: 'Job',
    description: 'Create a new job posting',
    icon: 'Briefcase',
    category: 'core',
    keyboard_shortcut: '⌘⇧J',
    itemType: 'job',
    dialogType: 'item',
    moduleContext: 'jobs',
  },
  {
    id: 'create-task',
    name: 'Task',
    description: 'Add a new task to track work',
    icon: 'CheckSquare',
    category: 'core',
    keyboard_shortcut: '⌘⇧T',
    itemType: 'task',
    dialogType: 'item',
  },
  {
    id: 'create-asset',
    name: 'Asset',
    description: 'Register a new equipment or asset',
    icon: 'Package',
    category: 'core',
    keyboard_shortcut: '⌘⇧A',
    itemType: 'asset',
    dialogType: 'item',
    moduleContext: 'assets',
  },
  {
    id: 'create-location',
    name: 'Location',
    description: 'Add a new venue or location',
    icon: 'MapPin',
    category: 'core',
    keyboard_shortcut: '⌘⇧L',
    itemType: 'location',
    dialogType: 'item',
    moduleContext: 'locations',
  },
  {
    id: 'create-file',
    name: 'File',
    description: 'Upload a new file or document',
    icon: 'FileText',
    category: 'core',
    keyboard_shortcut: '⌘⇧F',
    itemType: 'file',
    dialogType: 'item',
    moduleContext: 'files',
  },
  {
    id: 'create-report',
    name: 'Report',
    description: 'Create a custom report',
    icon: 'BarChart3',
    category: 'core',
    keyboard_shortcut: '⌘⇧R',
    itemType: 'report',
    dialogType: 'item',
    moduleContext: 'reports',
  },

  // Advanced Items
  {
    id: 'create-event',
    name: 'Event',
    description: 'Schedule a new event or show',
    icon: 'Calendar',
    category: 'advanced',
    itemType: 'event',
    dialogType: 'item',
    moduleContext: 'events',
  },
  {
    id: 'create-person',
    name: 'Person',
    description: 'Add a new crew member or contact',
    icon: 'UserPlus',
    category: 'advanced',
    itemType: 'person',
    dialogType: 'item',
    moduleContext: 'people',
  },
  {
    id: 'create-company',
    name: 'Company',
    description: 'Add a new client, vendor, or partner',
    icon: 'Building2',
    category: 'advanced',
    itemType: 'company',
    dialogType: 'item',
    moduleContext: 'companies',
  },
  {
    id: 'create-objective',
    name: 'Objective',
    description: 'Set a strategic objective or key result',
    icon: 'Target',
    category: 'advanced',
    dialogType: 'objective',
    moduleContext: 'insights',
  },
  {
    id: 'create-list-view',
    name: 'List View',
    description: 'Create a custom list view',
    icon: 'LayoutList',
    category: 'advanced',
    itemType: 'list',
    dialogType: 'item',
  },
  {
    id: 'create-workspace',
    name: 'Workspace',
    description: 'Create a new workspace for your team',
    icon: 'Globe',
    category: 'advanced',
    itemType: 'workspace',
    dialogType: 'item',
  },

  // Admin & Configuration
  {
    id: 'create-automation',
    name: 'Automation',
    description: 'Create a workflow automation',
    icon: 'Bot',
    category: 'admin',
    dialogType: 'automation',
    moduleContext: 'automations',
    requiresAdmin: true,
  },
  {
    id: 'create-webhook',
    name: 'Webhook',
    description: 'Set up a new webhook integration',
    icon: 'Webhook',
    category: 'admin',
    dialogType: 'webhook',
    moduleContext: 'webhooks',
    requiresAdmin: true,
  },
  {
    id: 'create-api-token',
    name: 'API Token',
    description: 'Generate a new API access token',
    icon: 'Key',
    category: 'admin',
    dialogType: 'token',
    moduleContext: 'api-tokens',
    requiresAdmin: true,
  },
  {
    id: 'create-checklist-template',
    name: 'Checklist Template',
    description: 'Create a reusable checklist template',
    icon: 'ListChecks',
    category: 'admin',
    dialogType: 'template',
    requiresAdmin: true,
  },
  {
    id: 'create-custom-status',
    name: 'Custom Status',
    description: 'Define a custom workflow status',
    icon: 'Palette',
    category: 'admin',
    dialogType: 'status',
    requiresAdmin: true,
  },
]

// Default favorites (the current items in the menu)
export const DEFAULT_FAVORITE_ACTIONS = [
  'create-project',
  'create-job',
  'create-task',
  'create-asset',
  'create-location',
  'create-file',
  'create-report',
]

export function getCreateActionById(id: string): CreateAction | undefined {
  return CREATE_ACTIONS.find((action) => action.id === id)
}

export function getCreateActionsByCategory(category: CreateAction['category']): CreateAction[] {
  return CREATE_ACTIONS.filter((action) => action.category === category)
}

export function searchCreateActions(query: string): CreateAction[] {
  const lowerQuery = query.toLowerCase()
  return CREATE_ACTIONS.filter(
    (action) =>
      action.name.toLowerCase().includes(lowerQuery) ||
      action.description.toLowerCase().includes(lowerQuery)
  )
}
