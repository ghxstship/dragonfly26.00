"use client"

import { useTranslations } from "next-intl"
import { Shield, Lock, Globe, Zap } from "lucide-react"

export function SecuritySection(): JSX.Element {
  const t = useTranslations('marketing.security')
  
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Lock className="mx-auto mb-4 text-green-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature1Title')}</h3>
            <p className="text-gray-600">{t('feature1Description')}</p>
          </div>
          <div className="text-center">
            <Shield className="mx-auto mb-4 text-green-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature2Title')}</h3>
            <p className="text-gray-600">{t('feature2Description')}</p>
          </div>
          <div className="text-center">
            <Globe className="mx-auto mb-4 text-green-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature3Title')}</h3>
            <p className="text-gray-600">{t('feature3Description')}</p>
          </div>
          <div className="text-center">
            <Zap className="mx-auto mb-4 text-green-600" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('feature4Title')}</h3>
            <p className="text-gray-600">{t('feature4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
