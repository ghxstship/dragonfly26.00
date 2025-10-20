/**
 * Design Tokens: Spacing & Layout
 * 
 * Centralized spacing and layout patterns extracted from all 219 custom tab components.
 * Ensures consistent spacing, grid layouts, and responsive behavior.
 * 
 * Usage:
 * import { spacing, grid } from '@/design-tokens/spacing'
 * <div className={spacing.section}>{children}</div>
 */

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // Section spacing
  section: 'space-y-6',
  sectionTight: 'space-y-4',
  sectionLoose: 'space-y-8',
  
  // Card spacing
  card: 'p-4',
  cardTight: 'p-3',
  cardLoose: 'p-6',
  
  // List spacing
  list: 'space-y-3',
  listTight: 'space-y-2',
  listLoose: 'space-y-4',
  
  // Inline spacing
  inline: 'space-x-2',
  inlineTight: 'space-x-1',
  inlineLoose: 'space-x-4',
  
  // Gap spacing
  gap: 'gap-4',
  gapTight: 'gap-2',
  gapLoose: 'gap-6',
} as const

// ============================================================================
// GRID LAYOUTS
// ============================================================================

export const grid = {
  // Stats grids
  stats2: 'grid grid-cols-2 gap-4',
  stats3: 'grid grid-cols-3 gap-4',
  stats4: 'grid grid-cols-2 md:grid-cols-4 gap-4',
  stats5: 'grid grid-cols-2 md:grid-cols-5 gap-4',
  stats6: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
  
  // Card grids
  cards1: 'grid grid-cols-1 gap-4',
  cards2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  cards3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  cards4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  
  // Responsive grids
  responsive2: 'grid grid-cols-1 lg:grid-cols-2 gap-6',
  responsive3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Compact grids
  compact2: 'grid grid-cols-2 gap-2',
  compact3: 'grid grid-cols-3 gap-2',
  compact4: 'grid grid-cols-4 gap-2',
  compact5: 'grid grid-cols-5 gap-2',
} as const

// ============================================================================
// FLEX LAYOUTS
// ============================================================================

export const flex = {
  // Basic flex
  row: 'flex items-center gap-2',
  rowTight: 'flex items-center gap-1',
  rowLoose: 'flex items-center gap-4',
  
  // Flex with justify
  between: 'flex items-center justify-between',
  betweenStart: 'flex items-start justify-between',
  center: 'flex items-center justify-center',
  
  // Flex column
  col: 'flex flex-col gap-2',
  colTight: 'flex flex-col gap-1',
  colLoose: 'flex flex-col gap-4',
  
  // Flex wrap
  wrap: 'flex flex-wrap items-center gap-2',
  wrapTight: 'flex flex-wrap items-center gap-1',
  wrapLoose: 'flex flex-wrap items-center gap-3',
} as const

// ============================================================================
// CONTAINER SIZES
// ============================================================================

export const container = {
  // Full width
  full: 'w-full',
  
  // Max widths
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  
  // Prose (for text content)
  prose: 'max-w-prose',
} as const

// ============================================================================
// PADDING PATTERNS
// ============================================================================

export const padding = {
  // Card padding
  card: 'p-4',
  cardX: 'px-4',
  cardY: 'py-4',
  cardTop: 'pt-4',
  cardBottom: 'pb-4',
  
  // Section padding
  section: 'p-6',
  sectionX: 'px-6',
  sectionY: 'py-6',
  
  // Tight padding
  tight: 'p-2',
  tightX: 'px-2',
  tightY: 'py-2',
  
  // Loose padding
  loose: 'p-8',
  looseX: 'px-8',
  looseY: 'py-8',
} as const

// ============================================================================
// BORDER PATTERNS
// ============================================================================

export const border = {
  // Basic borders
  default: 'border',
  top: 'border-t',
  bottom: 'border-b',
  left: 'border-l',
  right: 'border-r',
  
  // Border radius
  rounded: 'rounded-lg',
  roundedSm: 'rounded',
  roundedMd: 'rounded-md',
  roundedFull: 'rounded-full',
  
  // Border with radius
  card: 'border rounded-lg',
  cardSm: 'border rounded',
} as const

// ============================================================================
// HEIGHT PATTERNS
// ============================================================================

export const height = {
  // Icon sizes
  icon: 'h-4 w-4',
  iconSm: 'h-3 w-3',
  iconMd: 'h-5 w-5',
  iconLg: 'h-6 w-6',
  iconXl: 'h-8 w-8',
  
  // Button sizes
  button: 'h-10',
  buttonSm: 'h-8',
  buttonLg: 'h-12',
  
  // Input sizes
  input: 'h-10',
  inputSm: 'h-8',
  inputLg: 'h-12',
  
  // Full height
  full: 'h-full',
  screen: 'h-screen',
} as const

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type SpacingKey = keyof typeof spacing
export type GridKey = keyof typeof grid
export type FlexKey = keyof typeof flex
export type ContainerKey = keyof typeof container
export type PaddingKey = keyof typeof padding
export type BorderKey = keyof typeof border
export type HeightKey = keyof typeof height
