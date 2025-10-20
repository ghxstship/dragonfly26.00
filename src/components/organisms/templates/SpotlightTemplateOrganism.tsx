"use client"

import { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LucideIcon, Star, TrendingUp, Heart, Eye } from "lucide-react"

/**
 * Spotlight Template Organism
 * 
 * Templatized spotlight/featured page following atomic design system
 * Designed like an engaging social media feed/featured page
 * Used as first tab in Community, Marketplace, Opportunities, Resources modules
 * 
 * Features:
 * - Featured content cards with rich media
 * - Trending/popular items
 * - Social engagement metrics
 * - Fully internationalized
 * - WCAG 2.1 AA compliant
 */

export interface SpotlightFeaturedItem {
  id: string
  titleKey?: string
  title?: string
  descriptionKey?: string
  description?: string
  imageUrl?: string
  authorName?: string
  authorAvatar?: string
  categoryKey?: string
  category?: string
  tags?: string[]
  metrics?: {
    views?: number
    likes?: number
    rating?: number
  }
  action?: () => void
  actionLabelKey?: string
}

export interface SpotlightTrendingItem {
  id: string
  titleKey?: string
  title?: string
  icon?: LucideIcon
  trend: 'up' | 'down' | 'neutral'
  change: string
  action?: () => void
}

export interface SpotlightTemplateProps {
  /** Translation namespace for the module (e.g., 'community', 'marketplace') */
  translationNamespace: string
  
  /** Array of featured items to display */
  featuredItems: SpotlightFeaturedItem[]
  
  /** Array of trending items */
  trendingItems?: SpotlightTrendingItem[]
  
  /** Optional hero section content */
  heroContent?: ReactNode
  
  /** Optional custom content to render below spotlight */
  customContent?: ReactNode
  
  /** Loading state */
  loading?: boolean
  
  /** Optional workspace ID */
  workspaceId?: string
  
  /** Optional user ID */
  userId?: string
}

export function SpotlightTemplateOrganism({
  translationNamespace,
  featuredItems,
  trendingItems = [],
  heroContent,
  customContent,
  loading = false,
}: SpotlightTemplateProps): JSX.Element {
  const t = useTranslations(`${translationNamespace}.spotlight`)
  const tCommon = useTranslations('common')
  
  // Loading state
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full min-h-[400px]"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground">{tCommon('loading')}</p>
        </div>
      </div>
    )
  }
  
  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
        {/* Hero Section (if provided) */}
        {heroContent && (
          <section role="region" aria-labelledby="hero-heading">
            <h2 id="hero-heading" className="sr-only">{t('heroHeading')}</h2>
            {heroContent}
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Featured Content - Main Column */}
          <section role="region" aria-labelledby="featured-heading" className="lg:col-span-2">
            <div className="mb-4">
              <h2 id="featured-heading" className="text-lg font-semibold">{t('featuredTitle')}</h2>
              <p className="text-sm text-muted-foreground">{t('featuredDescription')}</p>
            </div>
            
            <div className="space-y-4">
              {featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    {/* Image */}
                    {item.imageUrl && (
                      <div className="relative h-48 md:h-auto bg-muted">
                        <Image 
                          src={item.imageUrl} 
                          alt=""
                          fill
                          className="object-cover"
                          aria-hidden="true"
                        />
                        {item.categoryKey && (
                          <Badge className="absolute top-2 left-2 z-10">
                            {t(item.categoryKey)}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {/* Content */}
                    <CardContent className={`p-6 ${item.imageUrl ? 'md:col-span-2' : 'md:col-span-3'}`}>
                      <div className="space-y-3">
                        {/* Author Info */}
                        {item.authorName && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.authorAvatar} alt="" />
                              <AvatarFallback>{item.authorName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{item.authorName}</span>
                          </div>
                        )}
                        
                        {/* Title & Description */}
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {item.titleKey ? t(item.titleKey) : item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.descriptionKey ? t(item.descriptionKey) : item.description}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Metrics */}
                        {item.metrics && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {item.metrics.views !== undefined && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-4 w-4" aria-hidden="true" />
                                <span>{item.metrics.views.toLocaleString()}</span>
                              </div>
                            )}
                            {item.metrics.likes !== undefined && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-4 w-4" aria-hidden="true" />
                                <span>{item.metrics.likes.toLocaleString()}</span>
                              </div>
                            )}
                            {item.metrics.rating !== undefined && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                                <span>{item.metrics.rating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Action Button */}
                        {item.action && (
                          <Button 
                            onClick={item.action}
                            aria-label={item.actionLabelKey ? t(item.actionLabelKey) : tCommon('viewDetails')}
                          >
                            {item.actionLabelKey ? t(item.actionLabelKey) : tCommon('viewDetails')}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Trending Sidebar */}
          {trendingItems.length > 0 && (
            <section role="region" aria-labelledby="trending-heading" className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle id="trending-heading" className="text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" aria-hidden="true" />
                    {t('trendingTitle')}
                  </CardTitle>
                  <CardDescription>{t('trendingDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingItems.map((item, index) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                          onClick={item.action}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              item.action?.()
                            }
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-lg font-bold text-muted-foreground">
                              #{index + 1}
                            </span>
                            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                            <span className="text-sm font-medium">
                              {item.titleKey ? t(item.titleKey) : item.title}
                            </span>
                          </div>
                          <div className={`text-xs font-medium ${
                            item.trend === 'up' ? 'text-green-600' : 
                            item.trend === 'down' ? 'text-red-600' : 
                            'text-muted-foreground'
                          }`}>
                            {item.change}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </section>
          )}
        </div>

        {/* Custom Content */}
        {customContent}
      </div>
    </main>
  )
}
