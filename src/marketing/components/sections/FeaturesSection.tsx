"use client"

import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { Briefcase, Building2, Network, Zap, BarChart3, Settings } from "lucide-react"

export function FeaturesSection(): JSX.Element {
  const t = useTranslations('marketing.features')
  
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("text-center mb-16 mx-auto", container['2xl'])}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-6">
            {t('title')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>
        
        <div className={cn(grid.cards3, "gap-8")}>
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <Briefcase className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('production.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('production.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <Building2 className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('business.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('business.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <Network className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('network.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('network.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <Zap className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('automations.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('automations.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <BarChart3 className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('intelligence.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('intelligence.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", padding.section)}>
            <Settings className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{t('system.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{t('system.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
