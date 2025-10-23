"use client"

import { useTranslations } from "next-intl"

export function RolesSection(): JSX.Element {
  const t = useTranslations('marketing.roles')
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Role cards will use translation keys */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
            <div className="text-4xl mb-4" aria-hidden="true">👻</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('phantom.name')}</h3>
            <p className="text-sm text-blue-600 mb-3">{t('phantom.level')}</p>
            <p className="text-gray-600">{t('phantom.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
