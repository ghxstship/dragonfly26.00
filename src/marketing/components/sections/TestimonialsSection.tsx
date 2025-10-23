"use client"

import { useTranslations } from "next-intl"
import { Quote } from "lucide-react"

export function TestimonialsSection(): JSX.Element {
  const t = useTranslations('marketing.testimonials')
  
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h2>
          <p className="text-xl text-gray-600">
            {t('subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6">
            <Quote className="mb-4 text-blue-600" size={32} aria-hidden="true" />
            <p className="text-gray-700 mb-4 italic">{t('testimonial1Quote')}</p>
            <div>
              <p className="font-semibold text-gray-900">{t('testimonial1Author')}</p>
              <p className="text-sm text-gray-600">{t('testimonial1Role')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <Quote className="mb-4 text-blue-600" size={32} aria-hidden="true" />
            <p className="text-gray-700 mb-4 italic">{t('testimonial2Quote')}</p>
            <div>
              <p className="font-semibold text-gray-900">{t('testimonial2Author')}</p>
              <p className="text-sm text-gray-600">{t('testimonial2Role')}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6">
            <Quote className="mb-4 text-blue-600" size={32} aria-hidden="true" />
            <p className="text-gray-700 mb-4 italic">{t('testimonial3Quote')}</p>
            <div>
              <p className="font-semibold text-gray-900">{t('testimonial3Author')}</p>
              <p className="text-sm text-gray-600">{t('testimonial3Role')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
