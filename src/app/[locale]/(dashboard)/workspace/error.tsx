'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw, Home, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function WorkspaceError({
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
    console.error('Workspace error:', error)
  }, [error])

  return (
    <div className="flex flex-wrap items-center justify-center min-h-screen p-4">
      <Card className="max-w-2xl px-4 sm:px-6 lg:px-8 w-full max-w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex flex-wrap justify-center">
            <div className="relative">
              <div className="absolute sm:relative sm:inset-auto inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse sm:relative sm:inset-auto" />
              <div className="relative bg-destructive/10 p-6 rounded-full">
                <AlertTriangle className="w-16 h-16 text-destructive" />
              </div>
            </div>
          </div>
          
          {error.digest && (
            <div className="text-sm font-mono text-muted-foreground">
              {t('errorCode')}: {error.digest}
            </div>
          )}
          
          <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
            {t('errorGenericTitle')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('errorGenericDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 md:space-y-4 lg:space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {t('tryAgain')}
            </Button>
            <Button variant="outline" asChild className="gap-2">
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
              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap break-words font-mono">
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
