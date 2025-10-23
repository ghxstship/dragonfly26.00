"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

export function MarketingFooter(): JSX.Element {
  const t = useTranslations('marketing.footer')
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('productTitle')}</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-white">{t('features')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white">{t('pricing')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('companyTitle')}</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-white">{t('about')}</Link></li>
              <li><Link href="/blog" className="hover:text-white">{t('blog')}</Link></li>
              <li><Link href="/contact" className="hover:text-white">{t('contact')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('resourcesTitle')}</h3>
            <ul className="space-y-2">
              <li><Link href="/docs" className="hover:text-white">{t('docs')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('legalTitle')}</h3>
            <ul className="space-y-2">
              <li><Link href="/legal/privacy" className="hover:text-white">{t('privacy')}</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white">{t('terms')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  )
}
