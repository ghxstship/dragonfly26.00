"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SpotlightTemplateOrganism, SpotlightFeaturedItem, SpotlightTrendingItem } from '@/components/organisms'
import { ShoppingBag, Package, Star, TrendingUp, Zap, Award } from 'lucide-react'
import { useMarketplaceData } from '@/hooks/use-marketplace-data'

export interface MarketplaceSpotlightTabProps {
  workspaceId?: string
  userId?: string
}

export function MarketplaceSpotlightTab({ workspaceId = '', userId = '' }: MarketplaceSpotlightTabProps): JSX.Element {
  const t = useTranslations('marketplace.spotlight')
  const { products, vendors, loading } = useMarketplaceData()
  
  const featuredItems: SpotlightFeaturedItem[] = [
    {
      id: '1',
      titleKey: 'featured1Title',
      descriptionKey: 'featured1Desc',
      imageUrl: '/screenshots/marketplace-featured-1.png',
      authorName: 'TechSupply Co.',
      authorAvatar: '/avatars/techsupply.jpg',
      categoryKey: 'equipment',
      tags: ['professional', 'certified', 'bestseller'],
      metrics: {
        views: 4560,
        likes: 342,
        rating: 4.9,
      },
      actionLabelKey: 'viewProduct',
      action: () => console.log('View product'),
    },
    {
      id: '2',
      titleKey: 'featured2Title',
      descriptionKey: 'featured2Desc',
      imageUrl: '/screenshots/marketplace-featured-2.png',
      authorName: 'Creative Services Ltd.',
      authorAvatar: '/avatars/creative.jpg',
      categoryKey: 'services',
      tags: ['design', 'premium', 'featured'],
      metrics: {
        views: 3890,
        likes: 287,
        rating: 4.8,
      },
      actionLabelKey: 'viewService',
      action: () => console.log('View service'),
    },
    {
      id: '3',
      titleKey: 'featured3Title',
      descriptionKey: 'featured3Desc',
      imageUrl: '/screenshots/marketplace-featured-3.png',
      authorName: 'Global Vendors Inc.',
      authorAvatar: '/avatars/global.jpg',
      categoryKey: 'vendor',
      tags: ['verified', 'international', 'toprated'],
      metrics: {
        views: 5120,
        likes: 423,
        rating: 4.9,
      },
      actionLabelKey: 'viewVendor',
      action: () => console.log('View vendor'),
    },
  ]
  
  const trendingItems: SpotlightTrendingItem[] = [
    {
      id: 't1',
      titleKey: 'trending1',
      icon: Award,
      trend: 'up',
      change: '+67%',
      action: () => console.log('View trending 1'),
    },
    {
      id: 't2',
      titleKey: 'trending2',
      icon: Package,
      trend: 'up',
      change: '+52%',
      action: () => console.log('View trending 2'),
    },
    {
      id: 't3',
      titleKey: 'trending3',
      icon: ShoppingBag,
      trend: 'up',
      change: '+41%',
      action: () => console.log('View trending 3'),
    },
    {
      id: 't4',
      titleKey: 'trending4',
      icon: Star,
      trend: 'up',
      change: '+28%',
      action: () => console.log('View trending 4'),
    },
    {
      id: 't5',
      titleKey: 'trending5',
      icon: Zap,
      trend: 'up',
      change: '+15%',
      action: () => console.log('View trending 5'),
    },
  ]
  
  return (
    <div role="main" aria-label="Spotlight content">
      <SpotlightTemplateOrganism
      translationNamespace="marketplace.spotlight"
      featuredItems={featuredItems}
      trendingItems={trendingItems}
      loading={loading}
      workspaceId={workspaceId}
      userId={userId}
    />
    </div>
  )
}
