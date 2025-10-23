"use client"

import { useTranslations } from "next-intl"

export function TrustBar(): JSX.Element {
  const t = useTranslations('marketing.trustBar')
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600">{t('trustedBy')}</p>
      </div>
    </section>
  )
}
