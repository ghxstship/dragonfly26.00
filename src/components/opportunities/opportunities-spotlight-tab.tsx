"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SpotlightTemplateOrganism, SpotlightFeaturedItem, SpotlightTrendingItem } from '@/components/organisms'
import { Briefcase, Users, Award, DollarSign, TrendingUp, Zap, Target } from 'lucide-react'
import { useOpportunitiesData } from '@/hooks/use-opportunities-data'

/**
 * Opportunities Spotlight Tab
 * 
 * First tab in NEW Opportunities module
 * Features: Jobs (contractors/subcontractors), Careers (staffing), 
 * Sponsorship, Grants (moved from Resources)
 * Uses SpotlightTemplateOrganism for engaging featured opportunities
 */

export interface OpportunitiesSpotlightTabProps {
  workspaceId?: string
  userId?: string
}

export function OpportunitiesSpotlightTab({ workspaceId = '', userId = '' }: OpportunitiesSpotlightTabProps): JSX.Element {
  const t = useTranslations('opportunities.spotlight')
  const { featuredOpportunities, loading } = useOpportunitiesData(workspaceId)
  
  const featuredItems: SpotlightFeaturedItem[] = [
    {
      id: '1',
      titleKey: 'featured1Title',
      descriptionKey: 'featured1Desc',
      imageUrl: '/screenshots/opportunities-featured-1.png',
      authorName: 'Global Construction Corp',
      authorAvatar: '/avatars/gcc.jpg',
      categoryKey: 'contractor',
      tags: ['urgent', 'high-value', 'featured'],
      metrics: {
        views: 3450,
        likes: 234,
        rating: 4.8,
      },
      actionLabelKey: 'applyNow',
      action: () => console.log('Apply for opportunity'),
    },
    {
      id: '2',
      titleKey: 'featured2Title',
      descriptionKey: 'featured2Desc',
      imageUrl: '/screenshots/opportunities-featured-2.png',
      authorName: 'Innovation Foundation',
      authorAvatar: '/avatars/innovation.jpg',
      categoryKey: 'grant',
      tags: ['$500K', 'research', 'deadline-soon'],
      metrics: {
        views: 5670,
        likes: 445,
        rating: 4.9,
      },
      actionLabelKey: 'viewGrant',
      action: () => console.log('View grant details'),
    },
    {
      id: '3',
      titleKey: 'featured3Title',
      descriptionKey: 'featured3Desc',
      imageUrl: '/screenshots/opportunities-featured-3.png',
      authorName: 'Tech Brands Alliance',
      authorAvatar: '/avatars/techbrands.jpg',
      categoryKey: 'sponsorship',
      tags: ['brand-visibility', 'partnership', 'exclusive'],
      metrics: {
        views: 4230,
        likes: 312,
        rating: 4.7,
      },
      actionLabelKey: 'learnMore',
      action: () => console.log('Learn about sponsorship'),
    },
  ]
  
  const trendingItems: SpotlightTrendingItem[] = [
    {
      id: 't1',
      titleKey: 'trending1',
      icon: Briefcase,
      trend: 'up',
      change: '+125%',
      action: () => console.log('View trending jobs'),
    },
    {
      id: 't2',
      titleKey: 'trending2',
      icon: DollarSign,
      trend: 'up',
      change: '+98%',
      action: () => console.log('View trending grants'),
    },
    {
      id: 't3',
      titleKey: 'trending3',
      icon: Users,
      trend: 'up',
      change: '+76%',
      action: () => console.log('View trending careers'),
    },
    {
      id: 't4',
      titleKey: 'trending4',
      icon: Award,
      trend: 'up',
      change: '+54%',
      action: () => console.log('View trending sponsorships'),
    },
    {
      id: 't5',
      titleKey: 'trending5',
      icon: Target,
      trend: 'up',
      change: '+32%',
      action: () => console.log('View trending opportunities'),
    },
  ]
  
  return (
    <div role="main" aria-label="Spotlight content">
      <SpotlightTemplateOrganism
      translationNamespace="opportunities.spotlight"
      featuredItems={featuredItems}
      trendingItems={trendingItems}
      loading={loading}
      workspaceId={workspaceId}
      userId={userId}
    />
    </div>
  )
}
