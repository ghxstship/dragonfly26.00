"use client"

import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/**
 * FilterButton - Molecular Component
 * 
 * Reusable filter button with active count badge.
 * Replaces 50+ hardcoded filter button implementations.
 */

export interface FilterButtonProps {
  onClick?: () => void
  activeCount?: number
  label?: string
  variant?: 'default' | 'outline'
  className?: string
}

export function FilterButton({
  onClick,
  activeCount = 0,
  label = "Filter",
  variant = 'outline',
  className,
}: FilterButtonProps) {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className={cn("gap-2", className)}
      aria-label={`${label}${activeCount > 0 ? ` (${activeCount} active)` : ''}`}
    >
      <Filter aria-hidden="true" className="h-4 w-4" />
      {label}
      {activeCount > 0 && (
        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex flex-wrap items-center justify-center">
          {activeCount}
        </Badge>
      )}
    </Button>
  )
}
