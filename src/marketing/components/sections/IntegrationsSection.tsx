"use client"

import { useTranslations } from "next-intl"

export function IntegrationsSection(): JSX.Element {
  const t = useTranslations('marketing.integrations')
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Integrations
        </h2>
        <p className="text-gray-600">
          Connect with your favorite tools
        </p>
      </div>
    </section>
  )
}
