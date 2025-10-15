/**
 * Centralized Mock Data Export
 * All mock data for demo mode is exported from here
 */

// Dashboard
export * from './dashboard-mocks'

// Community
export * from './community-mocks'

// Admin
export * from './admin-mocks'

// Projects
export * from './projects-mocks'

// People
export * from './people-mocks'

// Assets
export * from './assets-mocks'

// Events
export * from './events-mocks'

// Analytics
export * from './analytics-mocks'

// Marketplace
export * from './marketplace-mocks'

// Resources
export * from './resources-mocks'

// Locations
export * from './locations-mocks'

/**
 * Helper function to simulate API delay in demo mode
 * Makes the demo feel more realistic
 */
export const simulateDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
