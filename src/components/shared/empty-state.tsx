"use client"

import { LucideIcon } from "lucide-react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  mainMessage: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  variant?: 'default' | 'inline' | 'compact'
  showIcon?: boolean
}

export function EmptyState({
  icon: Icon,
  mainMessage,
  description,
  actionLabel,
  onAction,
  className,
  variant = 'default',
  showIcon = true,
}: EmptyStateProps) {
  // Compact variant for table rows and small spaces
  if (variant === 'compact') {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-8 px-4 text-center",
          className
        )}
      >
        {Icon && showIcon && (
          <Icon className="h-8 w-8 text-muted-foreground mb-3" />
        )}
        <p className="text-sm font-medium text-muted-foreground mb-1">{mainMessage}</p>
        {description && (
          <p className="text-xs text-muted-foreground mb-4 max-w-sm">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    )
  }

  // Inline variant for sidebars and smaller containers
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 px-6 text-center",
          className
        )}
      >
        {Icon && showIcon && (
          <Icon className="h-10 w-10 text-muted-foreground mb-4" />
        )}
        <h3 className="text-lg font-semibold mb-2">{mainMessage}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            {description}
          </p>
        )}
        {actionLabel && onAction && (
          <Button onClick={onAction} size="default">
            <Plus className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
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
    >
      {Icon && showIcon && (
        <div className="mb-6 rounded-full bg-muted/50 p-4 md:p-4 sm:p-6 md:p-8">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h2 className="mb-3 text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold tracking-tight">{mainMessage}</h2>
      {description && (
        <p className="mb-4 md:mb-6 lg:mb-8 max-w-md text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
