"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"
import { Shield, Lock, Globe, Zap } from "lucide-react"

export function SecuritySection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('subtitle')}
          </p>
        </div>
        
        <div className={grid.cards4}>
          <div className="text-center">
            <Lock className={cn("mx-auto mb-4 text-green-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('feature1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('feature1Description')}</p>
          </div>
          <div className="text-center">
            <Shield className={cn("mx-auto mb-4 text-green-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('feature2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('feature2Description')}</p>
          </div>
          <div className="text-center">
            <Globe className={cn("mx-auto mb-4 text-green-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('feature3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('feature3Description')}</p>
          </div>
          <div className="text-center">
            <Zap className={cn("mx-auto mb-4 text-green-600", height.iconXl)} aria-hidden="true" />
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('feature4Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('feature4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
