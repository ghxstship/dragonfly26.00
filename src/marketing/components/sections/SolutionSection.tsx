"use client"

import { useTranslations } from "next-intl"
import { Layers, Users, DollarSign, Building2 } from "lucide-react"

export function SolutionSection(): JSX.Element {
  const t = useTranslations('marketing.solution')
  
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <Layers className="mx-auto mb-4 text-blue-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature1Title')}</h3>
            <p className="text-gray-600">{t('feature1Description')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <Users className="mx-auto mb-4 text-blue-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature2Title')}</h3>
            <p className="text-gray-600">{t('feature2Description')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <DollarSign className="mx-auto mb-4 text-blue-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature3Title')}</h3>
            <p className="text-gray-600">{t('feature3Description')}</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <Building2 className="mx-auto mb-4 text-blue-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature4Title')}</h3>
            <p className="text-gray-600">{t('feature4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
