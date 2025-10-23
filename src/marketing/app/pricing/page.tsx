"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"

export const metadata = {
  title: "Pricing - ATLVS",
  description: "Transparent pricing that scales with you. From solo contractors to enterprise producers.",
}

export default function PricingPage(): JSX.Element {
  const t = useTranslations('marketing.pricing')

  const plans = [
    {
      name: t('community.name'),
      price: t('community.price'),
      period: t('community.period'),
      description: t('community.description'),
      features: [
        t('community.feature1'),
        t('community.feature2'),
        t('community.feature3'),
        t('community.feature4'),
      ],
      role: t('community.role'),
      hubAccess: t('community.hubAccess'),
      cta: t('community.cta'),
      ctaLink: "https://app.atlvs.xyz/auth/signup",
      highlighted: false,
    },
    {
      name: t('pro.name'),
      price: t('pro.price'),
      period: t('pro.period'),
      annualPrice: t('pro.annualPrice'),
      description: t('pro.description'),
      features: [
        t('pro.feature1'),
        t('pro.feature2'),
        t('pro.feature3'),
        t('pro.feature4'),
        t('pro.feature5'),
        t('pro.feature6'),
      ],
      roles: t('pro.roles'),
      hubAccess: t('pro.hubAccess'),
      cta: t('pro.cta'),
      ctaLink: "https://app.atlvs.xyz/auth/signup?plan=pro",
      highlighted: false,
    },
    {
      name: t('team.name'),
      price: t('team.price'),
      period: t('team.period'),
      annualPrice: t('team.annualPrice'),
      description: t('team.description'),
      features: [
        t('team.feature1'),
        t('team.feature2'),
        t('team.feature3'),
        t('team.feature4'),
        t('team.feature5'),
        t('team.feature6'),
        t('team.feature7'),
        t('team.feature8'),
      ],
      roles: t('team.roles'),
      hubAccess: t('team.hubAccess'),
      cta: t('team.cta'),
      ctaLink: "https://app.atlvs.xyz/auth/signup?plan=team",
      highlighted: true,
    },
    {
      name: t('enterprise.name'),
      price: t('enterprise.price'),
      period: t('enterprise.period'),
      annualPrice: t('enterprise.annualPrice'),
      description: t('enterprise.description'),
      features: [
        t('enterprise.feature1'),
        t('enterprise.feature2'),
        t('enterprise.feature3'),
        t('enterprise.feature4'),
        t('enterprise.feature5'),
        t('enterprise.feature6'),
        t('enterprise.feature7'),
        t('enterprise.feature8'),
        t('enterprise.feature9'),
        t('enterprise.feature10'),
        t('enterprise.feature11'),
      ],
      roles: t('enterprise.roles'),
      hubAccess: t('enterprise.hubAccess'),
      cta: t('enterprise.cta'),
      ctaLink: "/demo",
      highlighted: false,
    },
  ]

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 p-8 ${
                plan.highlighted
                  ? "border-blue-600 shadow-xl scale-105"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  {t('team.badge')}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period && (
                    <span className="text-gray-600 ml-2">/{plan.period}</span>
                  )}
                </div>
                {plan.annualPrice && (
                  <p className="text-sm text-gray-500 mt-1">{plan.annualPrice}</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 mb-6 text-sm">
                <div>
                  <span className="font-semibold text-gray-900">{t('rolesLabel')} </span>
                  <span className="text-gray-600">{plan.roles || plan.role}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{t('hubAccessLabel')} </span>
                  <span className="text-gray-600">{plan.hubAccess}</span>
                </div>
              </div>

              <Link href={plan.ctaLink} className="block">
                <Button
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Seats */}
        <div className="text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('additionalSeatsTitle')}</h3>
          <p className="text-gray-600">
            {t('additionalSeatsDescription')} <span className="font-semibold">{t('additionalSeatsPrice')}</span> {t('additionalSeatsAnnual')}
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('faqTitle')}
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('faq1Question')}
              </h3>
              <p className="text-gray-600">
                {t('faq1Answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('faq2Question')}
              </h3>
              <p className="text-gray-600">
                {t('faq2Answer')}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('faq3Question')}
              </h3>
              <p className="text-gray-600">
                {t('faq3Answer')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
