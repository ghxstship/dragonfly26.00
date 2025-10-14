'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { getModuleTabs } from '@/lib/modules/tabs-registry'

export default function TabError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('errors')
  const params = useParams()
  const router = useRouter()
  const workspaceId = params.workspaceId as string
  const moduleSlug = params.module as string
  
  const moduleTabs = getModuleTabs(moduleSlug)
  const firstTabSlug = moduleTabs.length > 0 ? moduleTabs[0].slug : 'overview'

  useEffect(() => {
    console.error('Tab error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl animate-pulse" />
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
          
          <CardTitle className="text-3xl">
            {t('errorGenericTitle')}
          </CardTitle>
          <CardDescription className="text-base">
            {t('errorGenericDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              {t('tryAgain')}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push(`/workspace/${workspaceId}/${moduleSlug}/${firstTabSlug}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Module
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
                  {error.message}
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
