"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export function PricingSection(): JSX.Element {
  const t = useTranslations('marketing.pricing')
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Community */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('community.name')}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">{t('community.price')}</span>
              <span className="text-gray-600"> {t('community.period')}</span>
            </div>
            <p className="text-gray-600 mb-6">{t('community.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('community.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('community.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('community.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup">
              <Button variant="outline" className="w-full">{t('community.cta')}</Button>
            </Link>
          </div>

          {/* Pro */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('pro.name')}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">{t('pro.price')}</span>
              <span className="text-gray-600">/{t('pro.period')}</span>
              <p className="text-sm text-gray-500">{t('pro.annualPrice')}</p>
            </div>
            <p className="text-gray-600 mb-6">{t('pro.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('pro.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('pro.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('pro.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup?plan=pro">
              <Button variant="outline" className="w-full">{t('pro.cta')}</Button>
            </Link>
          </div>

          {/* Team */}
          <div className="border-2 border-blue-600 rounded-xl p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {t('team.badge')}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('team.name')}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">{t('team.price')}</span>
              <span className="text-gray-600">/{t('team.period')}</span>
              <p className="text-sm text-gray-500">{t('team.annualPrice')}</p>
            </div>
            <p className="text-gray-600 mb-6">{t('team.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('team.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('team.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('team.feature3')}</span>
              </li>
            </ul>
            <Link href="https://app.atlvs.xyz/auth/signup?plan=team">
              <Button variant="default" className="w-full">{t('team.cta')}</Button>
            </Link>
          </div>

          {/* Enterprise */}
          <div className="border-2 border-gray-200 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('enterprise.name')}</h3>
            <div className="mb-4">
              <span className="text-4xl font-bold text-gray-900">{t('enterprise.price')}</span>
              <span className="text-gray-600">/{t('enterprise.period')}</span>
              <p className="text-sm text-gray-500">{t('enterprise.annualPrice')}</p>
            </div>
            <p className="text-gray-600 mb-6">{t('enterprise.description')}</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('enterprise.feature1')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                <span>{t('enterprise.feature2')}</span>
              </li>
              <li className="flex items-start text-sm">
                <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
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
