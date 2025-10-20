"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { ExternalLink, Maximize2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * EmbedContainerOrganism - Organism Component
 * 
 * Iframe/embed container with controls.
 * Extracted from views/embed-view.tsx for atomic design system.
 * 
 * Features:
 * - Iframe embedding
 * - Refresh control
 * - Fullscreen toggle
 * - External link
 * - Loading state
 * - Full i18n and accessibility
 */

export interface EmbedContainerOrganismProps {
  url: string
  title?: string
  allowFullscreen?: boolean
  onRefresh?: () => void
  onOpenExternal?: () => void
  className?: string
}

export function EmbedContainerOrganism({ 
  url, 
  title,
  allowFullscreen = true,
  onRefresh,
  onOpenExternal,
  className
}: EmbedContainerOrganismProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleRefresh = () => {
    setIsLoading(true)
    onRefresh?.()
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className={cn(
      'flex flex-col h-full border rounded-lg overflow-hidden',
      isFullscreen && 'fixed inset-0 z-50 rounded-none',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-2 bg-muted/30">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium truncate">
            {title || url}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
              aria-label={t('embed.refresh')}
            >
              <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} aria-hidden="true" />
            </Button>
          )}
          {allowFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? t('embed.exitFullscreen') : t('embed.fullscreen')}
            >
              <Maximize2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          {onOpenExternal && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenExternal}
              aria-label={t('embed.openExternal')}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </div>

      {/* Embed Content */}
      <div className="flex-1 relative bg-background">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center gap-2">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">{t('embed.loading')}</span>
            </div>
          </div>
        )}
        <iframe
          src={url}
          title={title || t('embed.embeddedContent')}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
        />
      </div>
    </div>
  )
}
