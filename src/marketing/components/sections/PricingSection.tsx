"use client"

import { Link } from "@/i18n/navigation"
import { useGenerationalMarketing } from "@/hooks/use-generational-marketing"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, container, height } from "@/design-tokens"

export function PricingSection(): JSX.Element {
  const { tGen } = useGenerationalMarketing()
    
  return (
    <section className={cn("py-20 bg-white dark:bg-gray-950", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("mb-12", grid.cards4)}>
          {/* Community */}
          <div className={cn("border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800", padding.section)}>
            <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('pricing.community.name')}</h3>
            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-heading uppercase text-gray-900 dark:text-white">{tGen('pricing.community.price')}</span>
              <span className="text-gray-600 dark:text-gray-400"> {tGen('pricing.community.period')}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tGen('pricing.community.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.community.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.community.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.community.feature3')}</span>
              </li>
            </ul>
            <Link href="/signup">
              <Button variant="outline" className="w-full">{tGen('pricing.community.cta')}</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className={cn("border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800", padding.section)}>
            <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('pricing.pro.name')}</h3>
            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-heading uppercase text-gray-900 dark:text-white">{tGen('pricing.pro.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{tGen('pricing.pro.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{tGen('pricing.pro.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tGen('pricing.pro.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.pro.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.pro.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.pro.feature3')}</span>
              </li>
            </ul>
            <Link href="/signup?plan=pro">
              <Button variant="outline" className="w-full">{tGen('pricing.pro.cta')}</Button>
            </Link>
          </div>

          {/* Team */}
          <div className={cn("border-2 border-blue-600 rounded-xl relative bg-white dark:bg-gray-800", padding.section)}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 sm:relative sm:top-0 sm:left-0 sm:translate-x-0 sm:mb-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-heading uppercase w-max mx-auto">
              {tGen('pricing.team.badge')}
            </div>
            <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 mt-8 sm:mt-0 font-heading uppercase">{tGen('pricing.team.name')}</h3>
            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-heading uppercase text-gray-900 dark:text-white">{tGen('pricing.team.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{tGen('pricing.team.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{tGen('pricing.team.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tGen('pricing.team.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.team.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.team.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.team.feature3')}</span>
              </li>
            </ul>
            <Link href="/signup?plan=team">
              <Button variant="default" className="w-full">{tGen('pricing.team.cta')}</Button>
            </Link>
          </div>

          {/* Enterprise */}
          <div className={cn("border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800", padding.section)}>
            <h3 className="text-xl sm:text-2xl text-gray-900 dark:text-white mb-2 font-heading uppercase">{tGen('pricing.enterprise.name')}</h3>
            <div className="mb-4">
              <span className="text-3xl sm:text-4xl font-heading uppercase text-gray-900 dark:text-white">{tGen('pricing.enterprise.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{tGen('pricing.enterprise.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{tGen('pricing.enterprise.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{tGen('pricing.enterprise.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.enterprise.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.enterprise.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{tGen('pricing.enterprise.feature3')}</span>
              </li>
            </ul>
            <Link href="/demo">
              <Button variant="outline" className="w-full">{tGen('pricing.enterprise.cta')}</Button>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/pricing" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            View detailed pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
