"use client"

import { useTranslations } from "next-intl"
import { Briefcase, Building2, Network, BarChart3, Settings } from "lucide-react"

export function FeaturesSection(): JSX.Element {
  const t = useTranslations('marketing.features')
  
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6">
            <Briefcase className="mb-4 text-blue-600" size={40} aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('production.title')}</h3>
            <p className="text-gray-600 mb-4">{t('production.description')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <Building2 className="mb-4 text-blue-600" size={40} aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('business.title')}</h3>
            <p className="text-gray-600 mb-4">{t('business.description')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <Network className="mb-4 text-blue-600" size={40} aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('network.title')}</h3>
            <p className="text-gray-600 mb-4">{t('network.description')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <BarChart3 className="mb-4 text-blue-600" size={40} aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('intelligence.title')}</h3>
            <p className="text-gray-600 mb-4">{t('intelligence.description')}</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6">
            <Settings className="mb-4 text-blue-600" size={40} aria-hidden="true" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('system.title')}</h3>
            <p className="text-gray-600 mb-4">{t('system.description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
