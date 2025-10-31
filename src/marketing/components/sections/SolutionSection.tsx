"use client"

import { useGenerationalMarketing } from '@/hooks/use-generational-marketing'
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { Layers, Users, DollarSign, Building2 } from "lucide-react"
import { useTranslations } from "next-intl"

export function SolutionSection(): JSX.Element {
  const t = useTranslations('marketing')

  const { tGen } = useGenerationalMarketing()
  
  return (
    <section className={cn("py-20 bg-gray-50 dark:bg-gray-900", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('solution.title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('solution.subtitle')}
          </p>
        </div>
        
        <div className={grid.cards4}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Layers className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('solution.feature1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('solution.feature1Description')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Users className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('solution.feature2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('solution.feature2Description')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <DollarSign className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('solution.feature3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('solution.feature3Description')}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center">
            <Building2 className={cn("mx-auto mb-4 text-blue-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('solution.feature4Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('solution.feature4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
