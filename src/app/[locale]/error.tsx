'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-wrap items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-2xl px-4 sm:px-6 lg:px-8 w-full text-center space-y-3 md:space-y-4 lg:space-y-6 max-w-full">
        {/* Error Icon with Animation */}
        <div className="flex flex-wrap justify-center">
          <div className="relative">
            <div className="absolute sm:relative sm:inset-auto inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse sm:relative sm:inset-auto" />
            <div className="relative bg-destructive/10 p-6 rounded-full">
              <AlertTriangle className="w-16 h-16 text-destructive" />
            </div>
          </div>
        </div>

        {/* Error Digest */}
        {error.digest && (
          <div className="text-sm font-mono text-muted-foreground">
            {t('errorCode')}: {error.digest}
          </div>
        )}

        {/* Title */}
        <h1 className="text-lg md:text-xl lg:text-2xl md:text-xl md:text-2xl lg:text-3xl lg:text-4xl font-bold tracking-tight">
          {t('errorGenericTitle')}
        </h1>

        {/* Description */}
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          {t('errorGenericDescription')}
        </p>

        {/* What You Can Do Section */}
        <div className="text-left max-w-md mx-auto pt-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {t('whatYouCanDo')}
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex flex-wrap flex-col md:flex-row items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('tryAgain')}</span>
            </li>
            <li className="flex flex-wrap flex-col md:flex-row items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('goBack')}</span>
            </li>
            <li className="flex flex-wrap flex-col md:flex-row items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{t('reportProblem')}</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <button
            onClick={reset}
            className="inline-flex flex-col md:flex-row items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 md:px-4 md:px-6 lg:px-8"
          >
            <RefreshCw className="w-4 h-4" />
            {t('tryAgain')}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex flex-col md:flex-row items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-11 px-4 md:px-4 md:px-6 lg:px-8"
          >
            <Home className="w-4 h-4" />
            {t('goBackHome')}
          </Link>
        </div>

        {/* Technical Details */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 md:mt-6 lg:mt-8 text-left">
            <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              {t('technicalDetails')}
            </summary>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words font-mono">
                {(error as any).message}
                {'\n\n'}
                {error.stack}
              </pre>
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
