"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { border, padding } from "@/design-tokens"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
  iconBgColor?: string
  className?: string
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  iconColor = "text-blue-600",
  iconBgColor = "bg-blue-100",
  className 
}: FeatureCardProps): JSX.Element {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800",
      border.card,
      "p-6",
      "hover:border-blue-300 hover:shadow-lg transition-all",
      className
    )}>
      <div className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
        iconBgColor
      )}>
        <Icon className={iconColor} size={24} />
      </div>
      <h3 className="text-lg font-heading uppercase text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </div>
  )
}
