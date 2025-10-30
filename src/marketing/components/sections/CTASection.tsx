"use client"

import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { spacing, padding, container, height } from "@/design-tokens"

export function CTASection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-20 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700", padding.sectionX)}>
      <div className={cn("mx-auto text-center", container['4xl'])}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl text-white mb-6 font-heading uppercase">
          {tGen('title')}
        </h2>
        <p className="text-base md:text-lg lg:text-xl text-blue-100 mb-4 md:mb-6 lg:mb-8">
          {tGen('subtitle')}
        </p>
        
        <div className={cn("flex flex-col sm:flex-row justify-center items-center", spacing.gap)}>
          <Link href="/signup">
            <Button variant="default" size="lg" className="w-full sm:w-auto bg-white dark:bg-gray-800 text-blue-600 hover:bg-gray-100 dark:bg-white dark:text-blue-600 dark:hover:bg-gray-100 dark:hover:bg-gray-800">
              {tGen('ctaPrimary')}
              <ArrowRight className={cn("ml-2", height.icon)} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              {tGen('ctaSecondary')}
            </Button>
          </Link>
        </div>
        
        <div className="mt-4 md:mt-6 lg:mt-8 text-sm text-blue-100">
          {tGen('trustIndicators')}
        </div>
      </div>
    </section>
  )
}
