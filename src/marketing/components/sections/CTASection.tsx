"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"

export function CTASection(): JSX.Element {
  const t = useTranslations('marketing.cta')
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t('title')}
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          {t('subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="https://app.atlvs.xyz/auth/signup">
            <Button variant="default" size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100">
              {t('ctaPrimary')}
              <ArrowRight className="ml-2" size={20} aria-hidden="true" />
            </Button>
          </Link>
          <Link href="/demo">
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              {t('ctaSecondary')}
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 text-sm text-blue-100">
          {t('trustIndicators')}
        </div>
      </div>
    </section>
  )
}
