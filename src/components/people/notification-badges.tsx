"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface NotificationBadgeProps {
  count: number
  max?: number
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary"
  size?: "sm" | "md" | "lg"
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "inline"
}

export function NotificationBadge({
  count,
  max = 99,
  className,
  variant = "destructive",
  size = "md",
  position = "top-right"
}: NotificationBadgeProps) {
  if (count === 0) return null

  const displayCount = count > max ? `${max}+` : count.toString()

  const sizeClasses = {
    sm: "h-4 w-4 text-[10px] min-w-[16px]",
    md: "h-5 w-5 text-xs min-w-[20px]",
    lg: "h-6 w-6 text-sm min-w-[24px]"
  }

  const positionClasses = {
    "top-right": "absolute -top-1 -right-1",
    "top-left": "absolute -top-1 -left-1",
    "bottom-right": "absolute -bottom-1 -right-1",
    "bottom-left": "absolute -bottom-1 -left-1",
    "inline": "relative"
  }

  return (
    <Badge
      variant={variant}
      className={cn(
        "flex items-center justify-center rounded-full p-0 font-bold animate-in fade-in zoom-in",
        sizeClasses[size],
        positionClasses[position],
        className
      )}
    >
      {displayCount}
    </Badge>
  )
}

// Pulsing dot for live updates
export function NotificationDot({
  variant = "error",
  size = "sm",
  pulse = true,
  className
}: {
  variant?: "success" | "warning" | "error" | "info"
  size?: "sm" | "md" | "lg"
  pulse?: boolean
  className?: string
}) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const colorClasses = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500"
  }

  return (
    <span className="relative inline-flex">
      <span
        className={cn(
          "inline-flex rounded-full",
          sizeClasses[size],
          colorClasses[variant],
          className
        )}
      />
      {pulse && (
        <span
          className={cn(
            "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
            colorClasses[variant]
          )}
        />
      )}
    </span>
  )
}

// Badge with icon for navigation items
export function NavBadge({
  label,
  count,
  icon,
  active = false
}: {
  label: string
  count?: number
  icon?: React.ReactNode
  active?: boolean
}) {
  return (
    <div className={cn(
      "flex items-center gap-2 relative",
      active && "font-medium"
    )}>
      {icon}
      <span>{label}</span>
      {count !== undefined && count > 0 && (
        <NotificationBadge count={count} size="sm" position="inline" />
      )}
    </div>
  )
}

// Inline notification counter
export function InlineNotificationCount({
  label,
  count,
  variant = "secondary"
}: {
  label: string
  count: number
  variant?: "default" | "destructive" | "outline" | "secondary"
}) {
  if (count === 0) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <Badge variant={variant} className="h-5">
        {count}
      </Badge>
    </div>
  )
}
