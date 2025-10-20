"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

/**
 * EmptyState - Molecule Component
 * 
 * Standardized empty state component for all views.
 * Single source of truth for empty state styling and messaging.
 * NO CTA buttons - actions should be in the main UI, not empty states.
 * 
 * Features:
 * - Consistent "NOTHING TO SEE HERE... (YET)" messaging
 * - Optional description for context
 * - Three size variants for different contexts
 * - Fully internationalized
 * - Accessible with proper ARIA labels
 * 
 * Usage:
 * <EmptyState variant="default" />
 * <EmptyState variant="compact" description="Add items to get started" />
 */

export interface EmptyStateProps {
  /** Optional context-specific description */
  description?: string
  /** Size variant based on container */
  variant?: 'default' | 'compact' | 'inline'
  /** Additional CSS classes */
  className?: string
}

export function EmptyState({
  description,
  variant = 'default',
  className,
}: EmptyStateProps) {
  const t = useTranslations('common')

  // Compact variant for table rows and small spaces
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 px-4 text-center",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-muted-foreground mb-1">
          {t('emptyState.nothingToSeeYet')}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
    )
  }

  // Inline variant for sidebars and medium containers
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <h3 className="text-lg font-semibold mb-2">
          {t('emptyState.nothingToSeeYet')}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm">
            {description}
          </p>
        )}
      </div>
    )
  }

  // Default variant for main content areas
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center min-h-[400px]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <h2 className="mb-3 text-2xl font-bold tracking-tight">
        {t('emptyState.nothingToSeeYet')}
      </h2>
      {description && (
        <p className="mb-4 max-w-md text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}
