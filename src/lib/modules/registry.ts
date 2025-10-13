import type { Module } from '@/types'
import {
  FolderKanban,
  Users,
  Calendar,
  Package,
  MapPin,
  FileText,
  Store,
  BookOpen,
  DollarSign,
  ShoppingCart,
  Briefcase,
  BarChart3,
  TrendingUp,
  LayoutDashboard,
  Shield,
  Lightbulb,
  Zap,
  Webhook,
  Key,
  Bot,
  Building2,
  UserCircle2,
} from 'lucide-react'
import { MODULE_TABS } from './tabs-registry'

export const MODULES: Module[] = [
  // Production Hub
  {
    id: 'dashboard',
    name: 'Dashboard',
    slug: 'dashboard',
    description: 'Production overview, active shows, crew workload, and performance analytics',
    icon: 'LayoutDashboard',
    category: 'production',
    order: 0,
    enabled: true,
    color: '#8b5cf6',
    has_tabs: true,
  },
  {
    id: 'projects',
    name: 'Projects',
    slug: 'projects',
    description: 'Production lifecycle management from pre-production through strike and wrap',
    icon: 'FolderKanban',
    category: 'production',
    order: 1,
    enabled: true,
    color: '#7c3aed',
    has_tabs: true,
  },
  {
    id: 'events',
    name: 'Events',
    slug: 'events',
    description: 'Show schedules, tour dates, call times, rehearsals, and production deadlines',
    icon: 'Calendar',
    category: 'production',
    order: 2,
    enabled: true,
    color: '#dc2626',
    has_tabs: true,
  },
  {
    id: 'people',
    name: 'People',
    slug: 'people',
    description: 'Crew roster, talent, vendors, contractors, and availability management',
    icon: 'Users',
    category: 'production',
    order: 3,
    enabled: true,
    color: '#2563eb',
    has_tabs: true,
  },
  {
    id: 'assets',
    name: 'Assets',
    slug: 'assets',
    description: 'Audio, lighting, video, staging, rigging, rentals, and equipment maintenance',
    icon: 'Package',
    category: 'production',
    order: 4,
    enabled: true,
    color: '#ea580c',
    has_tabs: true,
  },
  {
    id: 'locations',
    name: 'Locations',
    slug: 'locations',
    description: 'Venues, stages, load-in access, backstage areas, and tour routing',
    icon: 'MapPin',
    category: 'production',
    order: 5,
    enabled: true,
    color: '#16a34a',
    has_tabs: true,
  },
  {
    id: 'files',
    name: 'Files',
    slug: 'files',
    description: 'Contracts, riders, tech specs, call sheets, permits, and production reports',
    icon: 'FileText',
    category: 'production',
    order: 6,
    enabled: true,
    color: '#4f46e5',
    has_tabs: true,
  },

  // Network Hub
  {
    id: 'marketplace',
    name: 'Marketplace',
    slug: 'marketplace',
    description: 'Browse/purchase templates, integrations, services',
    icon: 'Store',
    category: 'network',
    order: 8,
    enabled: true,
    color: '#7c3aed',
    has_tabs: true,
  },
  {
    id: 'companies',
    name: 'Companies',
    slug: 'companies',
    description: 'Client, vendor, partner, and sponsor relationship management',
    icon: 'Building2',
    category: 'network',
    order: 9,
    enabled: true,
    color: '#2563eb',
    has_tabs: true,
  },
  {
    id: 'community',
    name: 'Community',
    slug: 'community',
    description: 'Professional network & community - connect and manage industry relationships',
    icon: 'UserCircle2',
    category: 'network',
    order: 7,
    enabled: true,
    color: '#10b981',
    has_tabs: true,
  },
  {
    id: 'resources',
    name: 'Resources',
    slug: 'resources',
    description: 'Shared resource library, knowledge base',
    icon: 'BookOpen',
    category: 'network',
    order: 10,
    enabled: true,
    color: '#0891b2',
    has_tabs: true,
  },

  // Business Hub
  {
    id: 'finance',
    name: 'Finance',
    slug: 'finance',
    description: 'Budget tracking, expenses, invoicing',
    icon: 'DollarSign',
    category: 'business',
    order: 9,
    enabled: true,
    color: '#059669',
    has_tabs: true,
  },
  {
    id: 'procurement',
    name: 'Procurement',
    slug: 'procurement',
    description: 'Purchase orders, vendor management',
    icon: 'ShoppingCart',
    category: 'business',
    order: 10,
    enabled: true,
    color: '#d97706',
    has_tabs: true,
  },
  {
    id: 'jobs',
    name: 'Jobs',
    slug: 'jobs',
    description: 'Hiring, applicants, job postings',
    icon: 'Briefcase',
    category: 'business',
    order: 11,
    enabled: true,
    color: '#8b5cf6',
    has_tabs: true,
  },

  // Intelligence Hub
  {
    id: 'reports',
    name: 'Reports',
    slug: 'reports',
    description: 'Custom report builder',
    icon: 'BarChart3',
    category: 'intelligence',
    order: 12,
    enabled: true,
    color: '#0284c7',
    has_tabs: true,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    slug: 'analytics',
    description: 'Dashboards, metrics, insights',
    icon: 'TrendingUp',
    category: 'intelligence',
    order: 13,
    enabled: true,
    color: '#7c3aed',
    has_tabs: true,
  },

  // User Management (standalone, accessed via bottom sidebar only)
  {
    id: 'admin',
    name: 'Admin',
    slug: 'admin',
    description: 'Organization settings and management',
    icon: 'Shield',
    category: 'system' as any,
    order: 99,
    enabled: true,
    color: '#64748b',
    has_tabs: true,
  },
  {
    id: 'settings',
    name: 'Settings',
    slug: 'settings',
    description: 'Personal preferences and account settings',
    icon: 'Settings',
    category: 'system' as any,
    order: 100,
    enabled: true,
    color: '#6366f1',
    has_tabs: true,
  },
  {
    id: 'profile',
    name: 'Profile',
    slug: 'profile',
    description: 'User profile and personal information',
    icon: 'UserCircle2',
    category: 'system' as any,
    order: 101,
    enabled: true,
    color: '#3b82f6',
    has_tabs: true,
  },
  {
    id: 'invite',
    name: 'Invite',
    slug: 'invite',
    description: 'Invite team members to workspace',
    icon: 'UserPlus',
    category: 'system' as any,
    order: 102,
    enabled: true,
    color: '#10b981',
    has_tabs: false,
  },

  // Insights Module (Phase 2)
  {
    id: 'insights',
    name: 'Insights',
    slug: 'insights',
    description: 'Strategic intelligence and recommendations',
    icon: 'Lightbulb',
    category: 'intelligence',
    order: 14,
    enabled: true,
    color: '#10b981',
    has_tabs: true,
  },

  // Phase 3: Extensibility & Integrations (Now nested in Admin module as tabs)
  {
    id: 'automations',
    name: 'Automations',
    slug: 'automations',
    description: 'Workflow automation engine',
    icon: 'Bot',
    category: 'intelligence',
    order: 15,
    enabled: false,
    color: '#8b5cf6',
  },
  {
    id: 'plugins',
    name: 'Plugins',
    slug: 'plugins',
    description: 'Plugin marketplace and integrations',
    icon: 'Zap',
    category: 'network',
    order: 16,
    enabled: false,
    color: '#f59e0b',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    slug: 'webhooks',
    description: 'External webhook integrations',
    icon: 'Webhook',
    category: 'intelligence',
    order: 17,
    enabled: false,
    color: '#06b6d4',
  },
  {
    id: 'api-tokens',
    name: 'API Tokens',
    slug: 'api-tokens',
    description: 'API access management',
    icon: 'Key',
    category: 'intelligence',
    order: 18,
    enabled: false,
    color: '#64748b',
  },
]

export const MODULE_CATEGORIES = {
  production: {
    label: 'Production Hub',
    description: 'Experiential production management - from concept to completion',
    color: '#7c3aed',
  },
  network: {
    label: 'Network Hub',
    description: 'Company relationships, marketplace, and resources',
    color: '#2563eb',
  },
  business: {
    label: 'Business Hub',
    description: 'Business management',
    color: '#059669',
  },
  intelligence: {
    label: 'Intelligence Hub',
    description: 'Analytics and reporting',
    color: '#0284c7',
  },
  system: {
    label: 'System',
    description: 'System administration and configuration',
    color: '#64748b',
  },
}

export function getModuleBySlug(slug: string): Module | undefined {
  const foundModule = MODULES.find((m) => m.slug === slug)
  if (foundModule && foundModule.has_tabs) {
    return { ...foundModule, tabs: MODULE_TABS[foundModule.id] || [] }
  }
  return foundModule
}

export function getModulesByCategory(category: string): Module[] {
  return MODULES.filter((m) => m.category === category).map((mod) => {
    if (mod.has_tabs) {
      return { ...mod, tabs: MODULE_TABS[mod.id] || [] }
    }
    return mod
  })
}

export function getEnabledModules(): Module[] {
  return MODULES.filter((m) => m.enabled).map((mod) => {
    if (mod.has_tabs) {
      return { ...mod, tabs: MODULE_TABS[mod.id] || [] }
    }
    return mod
  })
}

export function getModuleWithTabs(moduleId: string): Module | undefined {
  const foundModule = MODULES.find((m) => m.id === moduleId)
  if (foundModule && foundModule.has_tabs) {
    return { ...foundModule, tabs: MODULE_TABS[foundModule.id] || [] }
  }
  return foundModule
}
