"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"

export function IntegrationsSection(): JSX.Element {
  const t = useTranslations('marketing.integrations')
  
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-800", padding.sectionX)}>
      <div className={cn("mx-auto text-center", container['6xl'])}>
        <h2 className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl text-gray-900 dark:text-white mb-4 md:mb-6 lg:mb-8 font-heading uppercase">
          {t('title')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t('subtitle')}
        </p>
      </div>
    </section>
  )
}
