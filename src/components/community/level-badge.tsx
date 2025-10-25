"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Trophy, Star, Zap, Crown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelBadgeProps {
  level: number
  points?: number
  customName?: string
  customIcon?: string
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
  className?: string
}

// Skool-compatible level thresholds
const LEVEL_THRESHOLDS: Record<number, { name: string; points: number; icon: any; color: string }> = {
  1: { name: "Newcomer", points: 0, icon: Sparkles, color: "text-gray-500" },
  2: { name: "Member", points: 5, icon: Star, color: "text-gray-600" },
  3: { name: "Active", points: 20, icon: Star, color: "text-blue-500" },
  4: { name: "Contributor", points: 65, icon: Trophy, color: "text-blue-600" },
  5: { name: "Expert", points: 155, icon: Trophy, color: "text-purple-500" },
  6: { name: "Leader", points: 500, icon: Crown, color: "text-purple-600" },
  7: { name: "Champion", points: 2015, icon: Crown, color: "text-amber-500" },
  8: { name: "Master", points: 8015, icon: Zap, color: "text-amber-600" },
  9: { name: "Legend", points: 33015, icon: Zap, color: "text-amber-700" },
}

function getNextLevelInfo(currentLevel: number, currentPoints: number) {
  if (currentLevel >= 9) return null
  
  const nextLevel = currentLevel + 1
  const nextThreshold = LEVEL_THRESHOLDS[nextLevel]
  const currentThreshold = LEVEL_THRESHOLDS[currentLevel]
  
  const pointsNeeded = nextThreshold.points - currentPoints
  const pointsInLevel = nextThreshold.points - currentThreshold.points
  const progressPercent = Math.round(((currentPoints - currentThreshold.points) / pointsInLevel) * 100)
  
  return {
    nextLevel,
    pointsNeeded,
    progressPercent,
    nextLevelName: nextThreshold.name
  }
}

export function LevelBadge({
  level,
  points,
  customName,
  customIcon,
  size = "sm",
  showTooltip = true,
  className
}: LevelBadgeProps) {
  const levelInfo = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[1]
  const Icon = customIcon ? null : levelInfo.icon
  
  const sizeClasses = {
    sm: "h-5 text-xs px-2",
    md: "h-6 text-sm px-3",
    lg: "h-8 text-base px-4"
  }
  
  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }
  
  const badgeContent = (
    <Badge 
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1 font-semibold border-2",
        sizeClasses[size],
        levelInfo.color,
        className
      )}
    >
      {customIcon ? (
        <span className="text-xs">{customIcon}</span>
      ) : Icon ? (
        <Icon size={iconSizes[size]} className="flex-shrink-0" />
      ) : null}
      <span>
        Level {level}
      </span>
    </Badge>
  )
  
  if (!showTooltip || points === undefined) {
    return badgeContent
  }
  
  const nextLevelInfo = getNextLevelInfo(level, points)
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold text-sm">
              {customName || levelInfo.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {points.toLocaleString()} points
            </div>
            {nextLevelInfo && (
              <>
                <div className="w-full bg-secondary rounded-full h-1.5 max-w-full">
                  <div 
                    className={cn("h-1.5 rounded-full transition-all", levelInfo.color.replace('text-', 'bg-'))}
                    style={{ width: `${nextLevelInfo.progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {nextLevelInfo.pointsNeeded.toLocaleString()} points to Level {nextLevelInfo.nextLevel}
                </div>
              </>
            )}
            {level === 9 && (
              <div className="text-xs font-semibold text-amber-600">
                🎉 Max Level Reached!
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Utility component for showing just the level number
export function LevelIndicator({ level, size = "sm" }: { level: number; size?: "sm" | "md" | "lg" }) {
  const levelInfo = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[1]
  
  const sizeClasses = {
    sm: "w-5 h-5 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base"
  }
  
  return (
    <div 
      className={cn(
        "rounded-full inline-flex items-center justify-center font-bold border-2",
        sizeClasses[size],
        levelInfo.color,
        "bg-background"
      )}
    >
      {level}
    </div>
  )
}
