/**
 * Clean up old localStorage keys from previous versions
 * This ensures users don't see cached data from old implementations
 */
export function cleanupOldStorage() {
  if (typeof window === 'undefined') return

  try {
    // Remove old ui-storage key that had cached dashboard tabs
    localStorage.removeItem('ui-storage')
    
    // You can add more cleanup items here as needed
    // localStorage.removeItem('other-old-key')
  } catch (error) {
    console.warn('Failed to cleanup old storage:', error)
  }
}
