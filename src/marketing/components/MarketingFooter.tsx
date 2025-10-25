"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { spacing, grid, padding, border, container, height } from "@/design-tokens"

export function MarketingFooter(): JSX.Element {
  const t = useTranslations('marketing.footer')
  
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 px-4 sm:px-4 md:px-6 lg:px-8">
      <div className={cn("mx-auto", container['6xl'])}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 mb-4 md:mb-6 lg:mb-8">
          {/* Product Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('productTitle')}</h3>
            <ul className={spacing.listTight}>
              <li><Link href="/features" className="hover:text-white transition-colors">{t('features')}</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t('pricing')}</Link></li>
              <li><Link href="/demo" className="hover:text-white transition-colors">{t('demo')}</Link></li>
              <li><Link href="/integrations" className="hover:text-white transition-colors">{t('integrations')}</Link></li>
              <li><Link href="/roi-calculator" className="hover:text-white transition-colors">{t('roiCalculator')}</Link></li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('companyTitle')}</h3>
            <ul className={spacing.listTight}>
              <li><Link href="/company" className="hover:text-white transition-colors">{t('aboutUs')}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">{t('blog')}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition-colors">{t('careers')}</Link></li>
              <li><Link href="/press" className="hover:text-white transition-colors">{t('press')}</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">{t('partners')}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">{t('contact')}</Link></li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('resourcesTitle')}</h3>
            <ul className={spacing.listTight}>
              <li><Link href="/docs" className="hover:text-white transition-colors">{t('docs')}</Link></li>
              <li><Link href="/docs/api" className="hover:text-white transition-colors">{t('apiReference')}</Link></li>
              <li><Link href="/changelog" className="hover:text-white transition-colors">{t('changelog')}</Link></li>
              <li><Link href="/case-studies" className="hover:text-white transition-colors">{t('caseStudies')}</Link></li>
              <li><Link href="/templates" className="hover:text-white transition-colors">{t('templates')}</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">{t('events')}</Link></li>
            </ul>
          </div>
          
          {/* Support Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('support')}</h3>
            <ul className={spacing.listTight}>
              <li><Link href="/help" className="hover:text-white transition-colors">{t('helpCenter')}</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">{t('community')}</Link></li>
              <li><Link href="/status" className="hover:text-white transition-colors">{t('status')}</Link></li>
              <li><Link href="/customers" className="hover:text-white transition-colors">{t('customers')}</Link></li>
            </ul>
          </div>
          
          {/* Legal Column */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">{t('legalTitle')}</h3>
            <ul className={spacing.listTight}>
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">{t('terms')}</Link></li>
              <li><Link href="/security" className="hover:text-white transition-colors">{t('security')}</Link></li>
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
