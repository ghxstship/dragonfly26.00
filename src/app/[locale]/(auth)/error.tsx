'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function AuthError({
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
    console.error('Auth error:', error)
  }, [error])

  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="max-w-md w-full max-w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-wrap justify-center">
            <div className="relative">
              <div className="absolute sm:relative sm:inset-auto inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse sm:relative sm:inset-auto" />
              <div className="relative bg-destructive/10 p-6 rounded-full">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
            </div>
          </div>
          
          {error.digest && (
            <div className="text-sm font-mono text-muted-foreground">
              {t('errorCode')}: {error.digest}
            </div>
          )}
          
          <CardTitle className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl">
            {t('errorGenericTitle')}
          </CardTitle>
          <CardDescription>
            {t('errorGenericDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 md:space-y-4 lg:space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap flex-col gap-3">
            <Button onClick={reset} className="w-full gap-2 max-w-full">
              <RefreshCw className="w-4 h-4" />
              {t('tryAgain')}
            </Button>
            <Button variant="outline" asChild className="w-full gap-2 max-w-full">
              <Link href={`/${locale}`}>
                <Home className="w-4 h-4" />
                {t('goBackHome')}
              </Link>
            </Button>
          </div>

          {/* Technical Details */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left">
              <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                {t('technicalDetails')}
              </summary>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border text-xs">
                <pre className="text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words font-mono">
                  {(error as any).message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
