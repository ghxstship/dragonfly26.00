"use client"

import { useTranslations } from "next-intl"

export default function AboutPage(): JSX.Element {
  const t = useTranslations('marketing.about')
  
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600">{t('subtitle')}</p>
      </div>
    </div>
  )
}
