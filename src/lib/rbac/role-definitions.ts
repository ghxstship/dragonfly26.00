/**
 * =====================================================
 * BRANDED ROLE DEFINITIONS
 * =====================================================
 * Complete definitions for all 11 branded roles
 * =====================================================
 */

import type { RoleMetadata, RoleSlug } from '@/types/rbac'

/**
 * Complete branded role definitions with metadata
 */
export const BRANDED_ROLES: Record<RoleSlug, RoleMetadata> = {
  legend: {
    slug: 'legend',
    name: 'Legend',
    description: 'Platform super admin with ultimate authority across all organizations',
    level: 1,
    scope: 'platform',
    color: '#8B5CF6',
    icon: 'crown',
    badge: 'Platform Admin',
    capabilities: [
      'Full platform access',
      'Cross-organization control',
      'System configuration',
      'Global analytics',
      'Emergency interventions',
    ],
  },
  
  phantom: {
    slug: 'phantom',
    name: 'Phantom',
    description: 'Organization super admin with full control within their organization',
    level: 2,
    scope: 'organization',
    color: '#7C3AED',
    icon: 'shield',
    badge: 'Org Admin',
    capabilities: [
      'Full organization access',
      'Billing management',
      'User administration',
      'Organization deletion',
      'Strategic oversight',
    ],
  },
  
  aviator: {
    slug: 'aviator',
    name: 'Aviator',
    description: 'Strategic leader with multi-project oversight and organization admin rights',
    level: 3,
    scope: 'organization',
    color: '#6D28D9',
    icon: 'plane',
    badge: 'Strategic Lead',
    capabilities: [
      'Multi-project management',
      'Resource allocation',
      'Cross-project reporting',
      'Strategic planning',
      'Executive dashboards',
    ],
  },
  
  gladiator: {
    slug: 'gladiator',
    name: 'Gladiator',
    description: 'Project manager with full authority over assigned projects',
    level: 4,
    scope: 'project',
    color: '#5B21B6',
    icon: 'sword',
    badge: 'Project Manager',
    capabilities: [
      'Full project control',
      'Team assignment',
      'Budget approval',
      'Deliverable oversight',
      'Project creation',
    ],
  },
  
  navigator: {
    slug: 'navigator',
    name: 'Navigator',
    description: 'Department/area manager responsible for zone operations',
    level: 5,
    scope: 'project',
    color: '#4C1D95',
    icon: 'compass',
    badge: 'Area Manager',
    capabilities: [
      'Department management',
      'Zone operations',
      'Resource booking',
      'Team scheduling',
      'Performance tracking',
    ],
  },
  
  deviator: {
    slug: 'deviator',
    name: 'Deviator',
    description: 'Team lead responsible for crew coordination and task management',
    level: 6,
    scope: 'team',
    color: '#3B0764',
    icon: 'users',
    badge: 'Team Lead',
    capabilities: [
      'Team coordination',
      'Task assignment',
      'Daily scheduling',
      'Performance tracking',
      'Crew leadership',
    ],
  },
  
  raider: {
    slug: 'raider',
    name: 'Raider',
    description: 'Team member focused on task execution and deliverables',
    level: 7,
    scope: 'team',
    color: '#2E1065',
    icon: 'user',
    badge: 'Team Member',
    capabilities: [
      'Task execution',
      'Status updates',
      'Time tracking',
      'Document access',
      'Team collaboration',
    ],
  },
  
  merchant: {
    slug: 'merchant',
    name: 'Merchant',
    description: 'External contractor providing specialized services',
    level: 8,
    scope: 'custom',
    color: '#059669',
    icon: 'briefcase',
    badge: 'Contractor',
    capabilities: [
      'Deliverable submission',
      'Invoice management',
      'Contract viewing',
      'Service delivery',
      'Limited project access',
    ],
  },
  
  visitor: {
    slug: 'visitor',
    name: 'Visitor',
    description: 'Temporary access with custom configurable permissions',
    level: 9,
    scope: 'custom',
    color: '#0891B2',
    icon: 'user-plus',
    badge: 'Visitor',
    capabilities: [
      'Custom permissions',
      'Time-limited access',
      'Configurable scope',
      'Consultant access',
      'Temporary collaboration',
    ],
  },
  
  passenger: {
    slug: 'passenger',
    name: 'Passenger',
    description: 'Read-only stakeholder with temporary visibility',
    level: 10,
    scope: 'custom',
    color: '#6366F1',
    icon: 'eye',
    badge: 'Observer',
    capabilities: [
      'Read-only access',
      'Report viewing',
      'Dashboard visibility',
      'Document download',
      'Stakeholder updates',
    ],
  },
  
  ambassador: {
    slug: 'ambassador',
    name: 'Ambassador',
    description: 'Marketing affiliate with access to promotional materials only',
    level: 11,
    scope: 'custom',
    color: '#EC4899',
    icon: 'megaphone',
    badge: 'Marketing',
    capabilities: [
      'Brand asset access',
      'Marketing materials',
      'Social media content',
      'Promotional tracking',
      'Affiliate marketing',
    ],
  },
}

/**
 * Get role by slug
 */
export function getRoleBySlug(slug: RoleSlug): RoleMetadata {
  return BRANDED_ROLES[slug]
}

/**
 * Get all roles sorted by level
 */
export function getAllRolesSorted(): RoleMetadata[] {
  return Object.values(BRANDED_ROLES).sort((a, b) => a.level - b.level)
}

/**
 * Get roles by scope
 */
export function getRolesByScope(scope: string): RoleMetadata[] {
  return Object.values(BRANDED_ROLES).filter(role => role.scope === scope)
}

/**
 * Check if role can have time limits
 */
export function canRoleBeTimeLimited(slug: RoleSlug): boolean {
  return ['visitor', 'passenger'].includes(slug)
}

/**
 * Check if role supports custom permissions
 */
export function canRoleHaveCustomPermissions(slug: RoleSlug): boolean {
  return slug === 'visitor'
}

/**
 * Get role level
 */
export function getRoleLevel(slug: RoleSlug): number {
  return BRANDED_ROLES[slug].level
}

/**
 * Compare two roles by level
 */
export function compareRoleLevels(role1: RoleSlug, role2: RoleSlug): number {
  return getRoleLevel(role1) - getRoleLevel(role2)
}

/**
 * Check if role1 is higher than role2
 */
export function isRoleHigher(role1: RoleSlug, role2: RoleSlug): boolean {
  return getRoleLevel(role1) < getRoleLevel(role2)
}

/**
 * Get role scope requirements
 */
export function getRoleScopeRequirements(slug: RoleSlug): string[] {
  const requirements: Record<RoleSlug, string[]> = {
    legend: [],
    phantom: ['organization'],
    aviator: ['organization'],
    gladiator: ['project'],
    navigator: ['project', 'department'],
    deviator: ['team'],
    raider: ['team'],
    merchant: ['project'],
    visitor: [],
    passenger: [],
    ambassador: [],
  }
  return requirements[slug] || []
}
