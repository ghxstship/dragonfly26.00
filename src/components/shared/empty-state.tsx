"use client"

import { LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  mainMessage: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  mainMessage,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center min-h-[400px]",
        className
      )}
    >
      {Icon && (
        <div className="mb-6 rounded-full bg-muted/50 p-8">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h2 className="mb-3 text-2xl font-bold tracking-tight">{mainMessage}</h2>
      {description && (
        <p className="mb-8 max-w-md text-muted-foreground">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
