/**
 * =====================================================
 * SUBSCRIPTION PLANS
 * =====================================================
 * Centralized subscription tier definitions
 * =====================================================
 */

import type { RoleSlug } from '@/types/rbac'

export interface SubscriptionPlan {
  id: 'free' | 'pro' | 'enterprise'
  name: string
  description: string
  price: number // in dollars
  priceInCents: number
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
  free: {
    id: 'free',
    name: 'Starter',
    description: 'Perfect for trying out the platform',
    price: 0,
    priceInCents: 0,
    interval: 'month',
    stripePriceId: null, // No Stripe for free tier
    
    maxProjects: 3,
    maxMembers: 10,
    maxStorageGB: 5,
    
    features: {
      analytics: false,
      integrations: false,
      customBranding: false,
      prioritySupport: false,
    },
    
    availableRoles: ['raider', 'deviator'],
    availableModules: ['projects', 'events', 'people'],
    
    badge: 'Free Forever',
  },
  
  pro: {
    id: 'pro',
    name: 'Professional',
    description: 'For growing teams and production companies',
    price: 49,
    priceInCents: 4900,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || '',
    
    maxProjects: 25,
    maxMembers: 50,
    maxStorageGB: 100,
    
    features: {
      analytics: true,
      integrations: true,
      customBranding: false,
      prioritySupport: false,
      advancedReporting: true,
    },
    
    availableRoles: ['raider', 'deviator', 'navigator', 'gladiator'],
    availableModules: 'all',
    
    popular: true,
    badge: 'Most Popular',
    highlight: 'Best for growing teams',
  },
  
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with advanced needs',
    price: 149,
    priceInCents: 14900,
    interval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || '',
    
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
    },
    
    availableRoles: 'all',
    availableModules: 'all',
    
    badge: 'Premium',
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
  return Object.values(SUBSCRIPTION_PLANS).sort((a, b) => a.price - b.price)
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
  
  // Features
  if (plan.features.analytics) features.push('Advanced analytics')
  if (plan.features.integrations) features.push('Third-party integrations')
  if (plan.features.advancedReporting) features.push('Custom reports')
  if (plan.features.customBranding) features.push('Custom branding')
  if (plan.features.sso) features.push('SSO authentication')
  if (plan.features.prioritySupport) features.push('Priority support')
  if (plan.features.dedicatedSupport) features.push('Dedicated support')
  if (plan.features.customization) features.push('Platform customization')
  
  // Roles
  const roleCount = plan.availableRoles === 'all' ? 11 : plan.availableRoles.length
  features.push(`${roleCount} role types available`)
  
  return features
}
