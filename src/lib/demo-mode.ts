/**
 * Demo Mode Configuration
 * 
 * Enable demo mode by:
 * 1. Setting NEXT_PUBLIC_DEMO_MODE=true in .env (global)
 * 2. Toggling demo mode in the profile menu (user preference)
 * 
 * This will use mock data instead of live Supabase queries.
 */

export const isDemoMode = () => {
  // Check environment variable first
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    return true
  }
  
  // Check localStorage for user preference (client-side only)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('DEMO_MODE') === 'true'
  }
  
  return false
}

/**
 * Check if we should use mock data for a specific feature
 * Can be extended to enable demo mode per-feature
 */
export const shouldUseMockData = (feature?: string) => {
  const demoMode = isDemoMode()
  
  // Could add feature-specific overrides here
  // e.g., if feature === 'billing' and NEXT_PUBLIC_DEMO_BILLING === 'true'
  
  return demoMode
}

/**
 * Demo mode indicator for UI
 */
export const getDemoModeLabel = () => {
  return isDemoMode() ? 'Demo Mode' : null
}
