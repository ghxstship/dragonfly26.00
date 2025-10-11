"use client"

import { useTranslations } from "next-intl"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn, getInitials } from "@/lib/utils"
import type { Presence } from "@/types"

interface PresenceAvatarsProps {
  presences: Presence[]
  max?: number
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
}

const statusColors = {
  active: "bg-green-500",
  idle: "bg-yellow-500",
  away: "bg-gray-400",
  dnd: "bg-red-500",
  offline: "bg-gray-300",
}

export function PresenceAvatars({ presences, max = 5, size = "md" }: PresenceAvatarsProps) {
  const t = useTranslations()
  const displayed = presences.slice(0, max)
  const overflow = presences.length - max

  return (
    <TooltipProvider>
      <div className="flex -space-x-2">
        {displayed.map((presence) => (
          <Tooltip key={presence.id}>
            <TooltipTrigger asChild>
              <div className="relative">
                <Avatar className={cn(sizeClasses[size], "border-2 border-background")}>
                  <AvatarImage src={`/avatars/${presence.user_id}.jpg`} />
                  <AvatarFallback>
                    {getInitials(presence.user_id)}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background",
                    statusColors[presence.status]
                  )}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-medium">{presence.user_id}</p>
              <p className="text-xs text-muted-foreground capitalize">{presence.status}</p>
              {presence.custom_status && (
                <p className="text-xs">{presence.custom_status}</p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}

        {overflow > 0 && (
          <Avatar className={cn(sizeClasses[size], "border-2 border-background bg-muted")}>
            <AvatarFallback>+{overflow}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </TooltipProvider>
  )
}
