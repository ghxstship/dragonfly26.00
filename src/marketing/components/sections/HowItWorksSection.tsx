"use client"

import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"

export function HowItWorksSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="text-center  mx-auto mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6 font-heading uppercase">
            {tGen('howItWorks.title')}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">
            {tGen('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl mx-auto mb-4" aria-hidden="true">1</div>
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('howItWorks.step1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('howItWorks.step1Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl mx-auto mb-4" aria-hidden="true">2</div>
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('howItWorks.step2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('howItWorks.step2Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl mx-auto mb-4" aria-hidden="true">3</div>
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('howItWorks.step3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('howItWorks.step3Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl mx-auto mb-4" aria-hidden="true">4</div>
            <h3 className="text-lg  text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('howItWorks.step4Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{tGen('howItWorks.step4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
