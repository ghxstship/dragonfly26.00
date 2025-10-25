"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, container, height } from "@/design-tokens"

export function PricingSection(): JSX.Element {
  const t = useTranslations('marketing.pricing')
  
  return (
    <section className={cn("py-20 bg-white", padding.sectionX)}>
      <div className={cn("mx-auto", container['6xl'])}>
        <div className={cn("mb-12", grid.cards4)}>
          {/* Community */}
          <div className={cn("border-2 border-gray-200 rounded-xl", padding.section)}>
            <h3 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('community.name')}</h3>
            <div className="mb-4">
              <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('community.price')}</span>
              <span className="text-gray-600 dark:text-gray-400"> {t('community.period')}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('community.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('community.feature1')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('community.feature2')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('community.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.one/en/signup">
              <Button variant="outline" className="w-full">{t('community.cta')}</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className={cn("border-2 border-gray-200 rounded-xl", padding.section)}>
            <h3 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('pro.name')}</h3>
            <div className="mb-4">
              <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('pro.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{t('pro.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{t('pro.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('pro.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('pro.feature1')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('pro.feature2')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('pro.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.one/en/signup?plan=pro">
              <Button variant="outline" className="w-full">{t('pro.cta')}</Button>
            </Link>
          </div>

          {/* Team */}
          <div className={cn("border-2 border-blue-600 rounded-xl relative", padding.section)}>
            <div className="absolute sm:relative sm:inset-auto -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold sm:relative sm:inset-auto">
              {t('team.badge')}
            </div>
            <h3 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('team.name')}</h3>
            <div className="mb-4">
              <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('team.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{t('team.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{t('team.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('team.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('team.feature1')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('team.feature2')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('team.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.one/en/signup?plan=team">
              <Button variant="default" className="w-full">{t('team.cta')}</Button>
            </Link>
          </div>

          {/* Enterprise */}
          <div className={cn("border-2 border-gray-200 rounded-xl", padding.section)}>
            <h3 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('enterprise.name')}</h3>
            <div className="mb-4">
              <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('enterprise.price')}</span>
              <span className="text-gray-600 dark:text-gray-400">/{t('enterprise.period')}</span>
              <p className="text-sm text-gray-500 dark:text-gray-500">{t('enterprise.annualPrice')}</p>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('enterprise.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('enterprise.feature1')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('enterprise.feature2')}</span>
              </li>
              <li className="flex flex-wrap flex-col md:flex-row items-start text-sm">
                <Check className={cn("text-green-500 mr-2 flex-shrink-0 mt-0.5", height.iconSm)} aria-hidden="true" />
                <span>{t('enterprise.feature3')}</span>
              </li>
            </ul>
            <Link href="/demo">
              <Button variant="outline" className="w-full">{t('enterprise.cta')}</Button>
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/pricing" className="text-blue-600 hover:text-blue-700 font-semibold">
            View detailed pricing →
          </Link>
        </div>
      </div>
    </section>
  )
}
