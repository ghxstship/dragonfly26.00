/**
 * =====================================================
 * SUBSCRIPTION PLANS
 * =====================================================
 * Centralized subscription tier definitions
 * =====================================================
 */

import type { RoleSlug } from '@/types/rbac'

export interface SubscriptionPlan {
  id: 'community' | 'pro' | 'team' | 'enterprise'
  dbId: string // Database plan ID (e.g., 'pro-monthly')
  name: string
  description: string
  price: number // in dollars (monthly)
  priceInCents: number
  annualPrice?: number // in dollars (annual, billed monthly equivalent)
  interval: 'month' | 'year'
  stripePriceIdMonthly: string | null
  stripePriceIdAnnual: string | null
  
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
 * Subscription plan definitions - Aligned with marketing pages
 */
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  community: {
    id: 'community',
    dbId: 'community',
    name: 'Community',
    description: 'Perfect for getting started',
    price: 0,
    priceInCents: 0,
    annualPrice: 0,
    interval: 'month',
    stripePriceIdMonthly: null, // No Stripe for free tier
    stripePriceIdAnnual: null,
    
    maxProjects: 'unlimited',
    maxMembers: 1,
    maxStorageGB: 5,
    
    features: {
      analytics: false,
      integrations: false,
      customBranding: false,
      prioritySupport: false,
    },
    
    availableRoles: ['raider'],
    availableModules: ['community', 'marketplace', 'resources'],
    
    badge: 'Free Forever',
  },
  
  pro: {
    id: 'pro',
    dbId: 'pro-monthly',
    name: 'Pro',
    description: 'Independent Contractor',
    price: 12,
    priceInCents: 1200,
    annualPrice: 10, // $120 billed annually = $10/month
    interval: 'month',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY || '',
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_ANNUAL || '',
    
    maxProjects: 'unlimited',
    maxMembers: 1,
    maxStorageGB: 25,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: false,
      prioritySupport: true,
      advancedReporting: true,
    },
    
    availableRoles: ['deviator', 'raider'],
    availableModules: ['dashboard', 'projects', 'events', 'people', 'assets', 'locations', 'files', 'community', 'marketplace', 'resources'],
  },
  
  team: {
    id: 'team',
    dbId: 'team-monthly',
    name: 'Team',
    description: 'Vendor • 2-10 Seats',
    price: 120,
    priceInCents: 12000,
    annualPrice: 100, // $1,200 billed annually = $100/month
    interval: 'month',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_MONTHLY || '',
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_TEAM_ANNUAL || '',
    
    maxProjects: 'unlimited',
    maxMembers: 10,
    maxStorageGB: 100,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: false,
      prioritySupport: true,
      advancedReporting: true,
      apiAccess: true,
    },
    
    availableRoles: ['gladiator', 'navigator', 'deviator', 'raider', 'visitor', 'merchant', 'ambassador'],
    availableModules: 'all',
    
    popular: true,
    badge: 'Most Popular',
    highlight: 'Best for vendors',
  },
  
  enterprise: {
    id: 'enterprise',
    dbId: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'Producer • 2-20 Seats',
    price: 1200,
    priceInCents: 120000,
    annualPrice: 1000, // $12,000 billed annually = $1,000/month
    interval: 'month',
    stripePriceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    stripePriceIdAnnual: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL || '',
    
    maxProjects: 'unlimited',
    maxMembers: 20,
    maxStorageGB: 500,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: true,
      prioritySupport: true,
      advancedReporting: true,
      sso: true,
      dedicatedSupport: true,
      customization: true,
      whiteLabel: false,
      apiAccess: true,
      auditLogs: true,
    },
    
    availableRoles: 'all', // All 11 roles including Phantom, Aviator, Partner
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
