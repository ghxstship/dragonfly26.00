"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

export default function ContactPage(): JSX.Element {
  const t = useTranslations('marketing.contact')
  
  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
        <p className="text-xl text-gray-600 mb-8">{t('subtitle')}</p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              {t('nameLabel')}
            </label>
            <input
              type="text"
              id="name"
              placeholder={t('namePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('nameLabel')}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('emailLabel')}
            </label>
            <input
              type="email"
              id="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('emailLabel')}
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              {t('companyLabel')}
            </label>
            <input
              type="text"
              id="company"
              placeholder={t('companyPlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('companyLabel')}
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              {t('messageLabel')}
            </label>
            <textarea
              id="message"
              rows={6}
              placeholder={t('messagePlaceholder')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              aria-label={t('messageLabel')}
            />
          </div>
          
          <Button type="submit" className="w-full">
            {t('submitButton')}
          </Button>
        </form>
      </div>
    </div>
  )
}
