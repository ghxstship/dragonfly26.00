/**
 * Dynamic import wrappers for heavy components
 * Use these instead of direct imports to enable code splitting
 * 
 * Benefits:
 * - Smaller initial bundle
 * - Faster initial page load
 * - Better caching (component loaded once, cached)
 * - Components loaded only when needed
 */

export { DynamicCalendar } from './dynamic-calendar'
export {
  DynamicAnimatedIcon,
  DynamicPageTransition,
  DynamicLoadingSpinner,
} from './dynamic-animations'
