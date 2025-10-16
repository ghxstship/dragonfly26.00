/**
 * Accessibility Utilities
 * Screen reader announcements and ARIA helpers
 */

/**
 * Announces a message to screen readers via a live region
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent messages
 */
export const announceToScreenReader = (
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void => {
  if (typeof document === 'undefined') return

  const announcement = document.createElement('div')
  announcement.setAttribute('role', 'status')
  announcement.setAttribute('aria-live', priority)
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only absolute -left-[10000px] w-[1px] h-[1px] overflow-hidden'
  announcement.textContent = message

  document.body.appendChild(announcement)

  // Remove after screen reader has had time to announce
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement)
    }
  }, 1000)
}

/**
 * Announces a success message to screen readers
 * @param message - Success message
 */
export const announceSuccess = (message: string): void => {
  announceToScreenReader(message, 'polite')
}

/**
 * Announces an error message to screen readers (assertive/urgent)
 * @param message - Error message
 */
export const announceError = (message: string): void => {
  announceToScreenReader(message, 'assertive')
}

/**
 * Gets ARIA label for icon-only buttons
 * @param action - The action being performed
 * @param context - Optional context for the action
 */
export const getIconButtonLabel = (action: string, context?: string): string => {
  return context ? `${action} ${context}` : action
}
