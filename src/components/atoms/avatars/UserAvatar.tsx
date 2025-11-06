"use client"

import { User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

/**
 * UserAvatar - Atomic Component
 * 
 * User avatar with fallback initials or icon.
 * 
 * Features:
 * - Image with fallback
 * - Initials generation
 * - Size variants
 * - Status indicator
 * - Accessibility
 * 
 * Usage:
 * <UserAvatar name="John Doe" src="/avatar.jpg" />
 * <UserAvatar name="Jane Smith" size="lg" status="online" />
 */

export interface UserAvatarProps {
  /** User name for fallback initials */
  name?: string
  
  /** Avatar image URL */
  src?: string
  
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  
  /** Status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy'
  
  /** Additional CSS classes */
  className?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
}

function getInitials(name?: string): string {
  if (!name) return ''
  
  const parts = name.trim().split(' ')
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function UserAvatar({ name, src, size = 'md', status, className }: UserAvatarProps) {
  const initials = getInitials(name)
  
  return (
    <div className="relative inline-block">
      <Avatar aria-hidden="true" className={cn(sizeClasses[size], className)}>
        <AvatarImage src={src} alt={name || 'User avatar'} />
        <AvatarFallback>
          {initials || <User aria-hidden="true" className="h-1/2 w-full md:w-1/2" />}
        </AvatarFallback>
      </Avatar>
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
            statusColors[status],
            size === 'xs' && 'h-1.5 w-1.5',
            size === 'sm' && 'h-2 w-2',
            size === 'md' && 'h-2.5 w-2.5',
            size === 'lg' && 'h-3 w-3',
            size === 'xl' && 'h-4 w-4'
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  )
}
