/**
 * =====================================================
 * SUBSCRIPTION PLANS
 * =====================================================
 * Centralized subscription tier definitions
 * =====================================================
 */

import type { RoleSlug } from '@/types/rbac'

export interface SubscriptionPlan {
  id: 'network' | 'crew' | 'team' | 'pro' | 'core' | 'executive'
  dbId: string // Database plan ID (e.g., 'crew-monthly')
  name: string
  description: string
  price: number // in dollars (monthly)
  priceInCents: number
  annualPrice?: number // in dollars (annual, billed monthly equivalent)
  interval: 'month' | 'year'
  stripePriceId: string | null
  
  // Limits
  maxProjects: number | 'unlimited'
  maxMembers: number | 'unlimited'
  maxStorageGB: number
  
  // Features
  features: {
    analytics: boolean
    integrations: boolean
    customBranding: boolean
    prioritySupport: boolean
    advancedReporting?: boolean
    sso?: boolean
    dedicatedSupport?: boolean
    customization?: boolean
    whiteLabel?: boolean
    apiAccess?: boolean
    auditLogs?: boolean
  }
  
  // Available roles
  availableRoles: RoleSlug[] | 'all'
  
  // Available modules
  availableModules: string[] | 'all'
  
  // UI
  popular?: boolean
  badge?: string
  highlight?: string
}

/**
 * Subscription plan definitions
 */
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  network: {
    id: 'network',
    dbId: 'network',
    name: 'Network',
    description: 'Perfect for trying out the platform',
    price: 0,
    priceInCents: 0,
    annualPrice: 0,
    interval: 'month',
    stripePriceId: null, // No Stripe for free tier
    
    maxProjects: 3,
    maxMembers: 5,
    maxStorageGB: 5,
    
    features: {
      analytics: false,
      integrations: false,
      customBranding: false,
      prioritySupport: false,
    },
    
    availableRoles: ['ambassador', 'passenger'],
    availableModules: ['projects', 'events', 'people'],
    
    badge: 'Free Forever',
  },
  
  crew: {
    id: 'crew',
    dbId: 'crew-monthly',
    name: 'Crew',
    description: 'For small teams getting started',
    price: 10,
    priceInCents: 1000,
    annualPrice: 12,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CREW || '',
    
    maxProjects: 10,
    maxMembers: 15,
    maxStorageGB: 25,
    
    features: {
      analytics: false,
      integrations: true,
      customBranding: false,
      prioritySupport: false,
    },
    
    availableRoles: ['merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
    availableModules: ['projects', 'events', 'people', 'assets', 'files', 'locations'],
  },
  
  team: {
    id: 'team',
    dbId: 'team-monthly',
    name: 'Team',
    description: 'For growing teams with team leads',
    price: 20,
    priceInCents: 2000,
    annualPrice: 24,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM || '',
    
    maxProjects: 25,
    maxMembers: 30,
    maxStorageGB: 50,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: false,
      prioritySupport: true,
      advancedReporting: true,
    },
    
    availableRoles: ['deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
    availableModules: ['projects', 'events', 'people', 'assets', 'files', 'locations', 'companies', 'resources'],
    
    popular: true,
    badge: 'Most Popular',
    highlight: 'Best for growing teams',
  },
  
  pro: {
    id: 'pro',
    dbId: 'pro-monthly',
    name: 'Pro',
    description: 'For departments with advanced needs',
    price: 30,
    priceInCents: 3000,
    annualPrice: 36,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    
    maxProjects: 50,
    maxMembers: 50,
    maxStorageGB: 100,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: false,
      prioritySupport: true,
      advancedReporting: true,
    },
    
    availableRoles: ['navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
    availableModules: 'all',
  },
  
  core: {
    id: 'core',
    dbId: 'core-monthly',
    name: 'Core',
    description: 'For strategic leadership and multi-project oversight',
    price: 50,
    priceInCents: 5000,
    annualPrice: 60,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_CORE || '',
    
    maxProjects: 100,
    maxMembers: 100,
    maxStorageGB: 250,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: true,
      prioritySupport: true,
      advancedReporting: true,
      customization: true,
    },
    
    availableRoles: ['aviator', 'navigator', 'deviator', 'merchant', 'raider', 'visitor', 'ambassador', 'passenger'],
    availableModules: 'all',
  },
  
  executive: {
    id: 'executive',
    dbId: 'executive-monthly',
    name: 'Executive',
    description: 'For large organizations with enterprise needs',
    price: 100,
    priceInCents: 10000,
    annualPrice: 120,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_EXECUTIVE || '',
    
    maxProjects: 'unlimited',
    maxMembers: 'unlimited',
    maxStorageGB: 1000,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: true,
      prioritySupport: true,
      advancedReporting: true,
      sso: true,
      dedicatedSupport: true,
      customization: true,
      whiteLabel: true,
      apiAccess: true,
      auditLogs: true,
    },
    
    availableRoles: 'all',
    availableModules: 'all',
    
    badge: 'Enterprise',
    highlight: 'Everything included',
  },
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): SubscriptionPlan | null {
  return SUBSCRIPTION_PLANS[planId] || null
}

/**
 * Get all plans sorted by price
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(SUBSCRIPTION_PLANS).sort((a: any, b: any) => a.price - b.price)
}

/**
 * Check if role is available in plan
 */
export function isRoleAvailableInPlan(planId: string, roleSlug: RoleSlug): boolean {
  const plan = getPlanById(planId)
  if (!plan) return false
  
  if (plan.availableRoles === 'all') return true
  return plan.availableRoles.includes(roleSlug)
}

/**
 * Check if plan limit is reached
 */
export function isPlanLimitReached(
  planId: string,
  limitType: 'projects' | 'members' | 'storage',
  currentValue: number
): boolean {
  const plan = getPlanById(planId)
  if (!plan) return true
  
  let limit: number | 'unlimited'
  
  switch (limitType) {
    case 'projects':
      limit = plan.maxProjects
      break
    case 'members':
      limit = plan.maxMembers
      break
    case 'storage':
      limit = plan.maxStorageGB
      break
  }
  
  if (limit === 'unlimited') return false
  return currentValue >= limit
}

/**
 * Format plan features for display
 */
export function formatPlanFeatures(plan: SubscriptionPlan): string[] {
  const features: string[] = []
  
  // Limits
  features.push(
    plan.maxProjects === 'unlimited' 
      ? 'Unlimited projects' 
      : `${plan.maxProjects} projects`
  )
  features.push(
    plan.maxMembers === 'unlimited'
      ? 'Unlimited team members'
      : `Up to ${plan.maxMembers} team members`
  )
  features.push(`${plan.maxStorageGB}GB storage`)
  
  // Roles
  const roleCount = plan.availableRoles === 'all' ? 'All' : plan.availableRoles.length
  features.push(`${roleCount} role types available`)
  
  // Features
  if (plan.features.integrations) features.push('Third-party integrations')
  if (plan.features.analytics) features.push('Advanced analytics')
  if (plan.features.advancedReporting) features.push('Custom reports')
  if (plan.features.customBranding) features.push('Custom branding')
  if (plan.features.customization) features.push('Custom workflows')
  if (plan.features.prioritySupport) features.push('Priority support')
  if (plan.features.sso) features.push('SSO authentication')
  if (plan.features.whiteLabel) features.push('White-label options')
  if (plan.features.apiAccess) features.push('API access')
  if (plan.features.dedicatedSupport) features.push('24/7 dedicated support')
  if (plan.features.auditLogs) features.push('Audit logs')
  
  return features
}
