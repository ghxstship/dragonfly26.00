"use client"

import { UserAvatar } from "@/components/atoms"
import { cn } from "@/lib/utils"

/**
 * UserInfo - Molecular Component
 * 
 * Displays user avatar with name and optional subtitle.
 * Common in lists, cards, and headers.
 * 
 * Features:
 * - Avatar with fallback
 * - Name display
 * - Optional subtitle (role, email, etc.)
 * - Size variants
 * - Clickable variant
 * 
 * Usage:
 * <UserInfo name="John Doe" email="john@example.com" />
 * <UserInfo name="Jane Smith" subtitle="Project Manager" avatarSrc="/avatar.jpg" size="lg" />
 */

export interface UserInfoProps {
  /** User name */
  name: string
  
  /** Avatar image URL */
  avatarSrc?: string
  
  /** Subtitle (role, email, etc.) */
  subtitle?: string
  
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy'
  
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  
  /** Click handler */
  onClick?: () => void
  
  /** Additional CSS classes */
  className?: string
}

const avatarSizes = {
  sm: 'xs' as const,
  md: 'sm' as const,
  lg: 'md' as const,
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

const subtitleSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function UserInfo({
  name,
  avatarSrc,
  subtitle,
  status,
  size = 'md',
  onClick,
  className,
}: UserInfoProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <UserAvatar
        name={name}
        src={avatarSrc}
        size={avatarSizes[size]}
        status={status}
      />
      <div className="flex flex-wrap flex-col min-w-0">
        <span className={cn('font-medium truncate', textSizes[size])}>
          {name}
        </span>
        {subtitle && (
          <span className={cn('text-muted-foreground truncate', subtitleSizes[size])}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
