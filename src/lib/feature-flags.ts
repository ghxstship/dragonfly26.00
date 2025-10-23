import { get } from '@vercel/edge-config'

/**
 * Feature Flags System
 * 
 * Uses Vercel Edge Config for ultra-fast, globally distributed feature flags
 * Falls back to environment variables if Edge Config is not configured
 */

export interface FeatureFlags {
  // Core Features
  enableNewDashboard: boolean
  enableAIAssistant: boolean
  enableAdvancedAnalytics: boolean
  enableMarketplace: boolean
  
  // Experimental Features
  enableBetaFeatures: boolean
  enableExperimentalUI: boolean
  enableWebSockets: boolean
  
  // Business Features
  enableStripePayments: boolean
  enableInvoicing: boolean
  enableTimeTracking: boolean
  
  // Regional Features
  enableEUCompliance: boolean
  enableChinaRegion: boolean
  
  // Maintenance
  maintenanceMode: boolean
  readOnlyMode: boolean
  
  // Limits
  maxProjectsPerOrg: number
  maxUsersPerOrg: number
  maxStoragePerOrg: number // in GB
}

/**
 * Default feature flag values
 * Used as fallback when Edge Config is not available
 */
const defaultFlags: FeatureFlags = {
  // Core Features
  enableNewDashboard: true,
  enableAIAssistant: false,
  enableAdvancedAnalytics: true,
  enableMarketplace: true,
  
  // Experimental Features
  enableBetaFeatures: false,
  enableExperimentalUI: false,
  enableWebSockets: false,
  
  // Business Features
  enableStripePayments: false, // Enable when Stripe is configured
  enableInvoicing: true,
  enableTimeTracking: true,
  
  // Regional Features
  enableEUCompliance: true,
  enableChinaRegion: false,
  
  // Maintenance
  maintenanceMode: false,
  readOnlyMode: false,
  
  // Limits
  maxProjectsPerOrg: 100,
  maxUsersPerOrg: 1000,
  maxStoragePerOrg: 100,
}

/**
 * Get all feature flags
 * Fetches from Edge Config with fallback to defaults
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  try {
    // Try to get from Edge Config
    const flags = await get<FeatureFlags>('featureFlags')
    
    if (flags) {
      // Merge with defaults to ensure all flags exist
      return { ...defaultFlags, ...flags }
    }
  } catch (error) {
    console.warn('Edge Config not available, using default feature flags:', error)
  }
  
  // Fallback to defaults
  return defaultFlags
}

/**
 * Get a specific feature flag
 */
export async function getFeatureFlag<K extends keyof FeatureFlags>(
  key: K
): Promise<FeatureFlags[K]> {
  const flags = await getFeatureFlags()
  return flags[key]
}

/**
 * Check if a feature is enabled
 * Convenience function for boolean flags
 */
export async function isFeatureEnabled(feature: keyof FeatureFlags): Promise<boolean> {
  const value = await getFeatureFlag(feature)
  return Boolean(value)
}

/**
 * Client-side feature flag hook
 * Use this in React components
 */
export function useFeatureFlags() {
  // For client-side, we'll use a simpler approach
  // In production, you'd fetch this from an API endpoint
  return defaultFlags
}

/**
 * Middleware helper to check feature flags
 * Use in API routes or middleware
 */
export async function requireFeature(feature: keyof FeatureFlags): Promise<void> {
  const enabled = await isFeatureEnabled(feature)
  
  if (!enabled) {
    throw new Error(`Feature "${feature}" is not enabled`)
  }
}

/**
 * Feature flag presets for different environments
 */
export const FeatureFlagPresets = {
  development: {
    ...defaultFlags,
    enableBetaFeatures: true,
    enableExperimentalUI: true,
    enableAIAssistant: true,
  },
  
  staging: {
    ...defaultFlags,
    enableBetaFeatures: true,
    enableAIAssistant: true,
  },
  
  production: {
    ...defaultFlags,
    enableBetaFeatures: false,
    enableExperimentalUI: false,
  },
}

/**
 * Get feature flags for current environment
 */
export async function getEnvironmentFlags(): Promise<FeatureFlags> {
  const env = process.env.NODE_ENV || 'development'
  
  if (env === 'production') {
    return getFeatureFlags() // Use Edge Config in production
  }
  
  // Use presets for dev/staging
  return FeatureFlagPresets[env as keyof typeof FeatureFlagPresets] || defaultFlags
}
