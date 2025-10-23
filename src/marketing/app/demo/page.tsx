"use client"

import { useTranslations } from "next-intl"

export default function DemoPage(): JSX.Element {
  const t = useTranslations('marketing.demo')
  
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
        <p className="text-gray-600">{t('description')}</p>
      </div>
    </div>
  )
}
