"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { useTranslations } from "next-intl"

export function TrustBar(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-12 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800", padding.sectionX)}>
      <div className="mx-auto text-center">
        <p className="text-gray-600 dark:text-gray-400">{tGen('trustBar.trustedBy')}</p>
      </div>
    </section>
  )
}
