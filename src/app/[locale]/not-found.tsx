import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'errors' })
  
  return {
    title: t('error404Title'),
    description: t('error404Description'),
  }
}

export default async function LocalizedNotFound({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'errors' })
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl w-full text-center space-y-6">
        {/* Error Icon with Animation */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-primary/10 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <div className="text-sm font-mono text-muted-foreground">
          {t('errorCode')}: 404
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold tracking-tight">
          {t('error404Title')}
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t('error404Description')}
        </p>

        {/* What You Can Do Section */}
        <div className="text-left max-w-md mx-auto pt-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {t('whatYouCanDo')}
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('checkUrl')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('goBack')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('visitHomepage')}</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
          >
            <Home className="w-4 h-4" />
            {t('goBackHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
