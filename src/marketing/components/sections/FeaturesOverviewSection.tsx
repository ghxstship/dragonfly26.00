"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height, cards } from "@/design-tokens"
import { Briefcase, Building2, Network, Zap, BarChart3, Settings } from "lucide-react"

export function FeaturesOverviewSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
  
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("text-center mb-16 mx-auto", container['2xl'])}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading uppercase text-gray-900 dark:text-white mb-6">
            {tGen('title')}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('subtitle')}
          </p>
        </div>
        
        <div className={cn(cards.grid1to3)}>
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Briefcase className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('production.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('production.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Building2 className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('business.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('business.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Network className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('network.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('network.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Zap className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('automations.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('automations.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <BarChart3 className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('intelligence.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('intelligence.description')}</p>
          </div>
          
          <div className={cn("bg-gray-50 dark:bg-gray-800 rounded-xl", cards.marketing, cards.paddingSm)}>
            <Settings className={cn("mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-900 dark:text-white mb-2">{tGen('system.title')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{tGen('system.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
