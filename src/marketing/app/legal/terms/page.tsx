"use client"

import { useTranslations } from "next-intl"

export default function TermsPage(): JSX.Element {
  const t = useTranslations('marketing.legal.terms')
  
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-gray-600 mb-8">{t('lastUpdated')}</p>
        <div className="prose prose-lg max-w-none">
          <p>Terms of service content will be added here.</p>
        </div>
      </div>
    </div>
  )
}
