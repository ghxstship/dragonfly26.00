"use client"

import { useTranslations } from "next-intl"
import { AlertCircle, FileX, DollarSign, MessageSquareX } from "lucide-react"

export function ProblemSection(): JSX.Element {
  const t = useTranslations('marketing.problem')
  
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
            <AlertCircle className="mx-auto mb-4 text-red-500" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pain1Title')}</h3>
            <p className="text-gray-600">{t('pain1Description')}</p>
          </div>
          <div className="text-center">
            <FileX className="mx-auto mb-4 text-red-500" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pain2Title')}</h3>
            <p className="text-gray-600">{t('pain2Description')}</p>
          </div>
          <div className="text-center">
            <DollarSign className="mx-auto mb-4 text-red-500" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pain3Title')}</h3>
            <p className="text-gray-600">{t('pain3Description')}</p>
          </div>
          <div className="text-center">
            <MessageSquareX className="mx-auto mb-4 text-red-500" size={48} aria-hidden="true" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('pain4Title')}</h3>
            <p className="text-gray-600">{t('pain4Description')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
