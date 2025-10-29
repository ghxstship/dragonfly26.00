/**
 * Card Design Tokens
 * 
 * Centralized card alignment and layout patterns for consistent responsive behavior.
 * 
 * Usage:
 * - Marketing cards: Use `cards.marketing` for center-aligned mobile cards
 * - Dashboard cards: Use `cards.dashboard` for full-width data cards
 * - Grid patterns: Use `cards.grid*` for responsive grid layouts
 */

export const cards = {
  // Marketing cards - center on mobile, full width on desktop
  marketing: "mx-auto w-full max-w-sm md:max-w-none",
  
  // Dashboard cards - full width, left-aligned (no centering)
  dashboard: "w-full",
  
  // Responsive grid patterns
  grid1to2: "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8",
  grid1to3: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8",
  grid1to4: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8",
  
  // Responsive padding for cards
  paddingSm: "p-4 md:p-6",
  paddingMd: "p-4 md:p-6 lg:p-8",
  paddingLg: "p-6 md:p-8 lg:p-10",
  
  // Responsive gaps for grids
  gapSm: "gap-3 md:gap-4",
  gapMd: "gap-4 md:gap-6 lg:gap-8",
  gapLg: "gap-6 md:gap-8 lg:gap-10",
} as const

export type CardTokens = typeof cards
