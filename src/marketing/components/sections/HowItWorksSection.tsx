"use client"

import { useTranslations } from "next-intl"

export function HowItWorksSection(): JSX.Element {
  const t = useTranslations('marketing.howItWorks')
  
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
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">1</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step1Title')}</h3>
            <p className="text-gray-600">{t('step1Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">2</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step2Title')}</h3>
            <p className="text-gray-600">{t('step2Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">3</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step3Title')}</h3>
            <p className="text-gray-600">{t('step3Description')}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" aria-hidden="true">4</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('step4Title')}</h3>
            <p className="text-gray-600">{t('step4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
