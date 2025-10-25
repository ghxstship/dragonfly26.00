"use client"

import { cn } from "@/lib/utils"
import { spacing } from "@/design-tokens"

interface SectionHeadingProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeading({ title, subtitle, centered = true, className }: SectionHeadingProps): JSX.Element {
  return (
    <div className={cn(
      centered ? "text-center" : "text-left",
      "max-w-3xl mb-8 md:mb-12 lg:mb-16",
      centered ? "mx-auto" : "",
      className
    )}>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
          {subtitle}
        </p>
      )}
    </div>
  )
}
