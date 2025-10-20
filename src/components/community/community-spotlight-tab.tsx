"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SpotlightTemplateOrganism, SpotlightFeaturedItem, SpotlightTrendingItem } from '@/components/organisms'
import { Trophy, Users, MessageSquare, Star, TrendingUp, Zap } from 'lucide-react'
import { useCommunityData } from '@/hooks/use-community-data'

/**
 * Community Spotlight Tab
 * 
 * First tab in Community module - featured content and trending activity
 * Uses SpotlightTemplateOrganism for engaging social media feed layout
 */

export interface CommunitySpotlightTabProps {
  workspaceId?: string
  userId?: string
}

export function CommunitySpotlightTab({ workspaceId = '', userId = '' }: CommunitySpotlightTabProps): JSX.Element {
  const t = useTranslations('community.spotlight')
  const { posts, showcases, competitions, loading } = useCommunityData()
  
  // Featured items configuration
  const featuredItems: SpotlightFeaturedItem[] = [
    {
      id: '1',
      titleKey: 'featured1Title',
      descriptionKey: 'featured1Desc',
      imageUrl: '/screenshots/community-featured-1.png',
      authorName: 'Sarah Chen',
      authorAvatar: '/avatars/sarah.jpg',
      categoryKey: 'showcase',
      tags: ['innovation', 'design', 'featured'],
      metrics: {
        views: 2340,
        likes: 187,
        rating: 4.8,
      },
      actionLabelKey: 'viewShowcase',
      action: () => console.log('View showcase'),
    },
    {
      id: '2',
      titleKey: 'featured2Title',
      descriptionKey: 'featured2Desc',
      imageUrl: '/screenshots/community-featured-2.png',
      authorName: 'Marcus Johnson',
      authorAvatar: '/avatars/marcus.jpg',
      categoryKey: 'competition',
      tags: ['challenge', 'community', 'winner'],
      metrics: {
        views: 1890,
        likes: 234,
        rating: 4.9,
      },
      actionLabelKey: 'viewCompetition',
      action: () => console.log('View competition'),
    },
    {
      id: '3',
      titleKey: 'featured3Title',
      descriptionKey: 'featured3Desc',
      imageUrl: '/screenshots/community-featured-3.png',
      authorName: 'Elena Rodriguez',
      authorAvatar: '/avatars/elena.jpg',
      categoryKey: 'discussion',
      tags: ['collaboration', 'insights', 'trending'],
      metrics: {
        views: 3120,
        likes: 456,
        rating: 4.7,
      },
      actionLabelKey: 'joinDiscussion',
      action: () => console.log('Join discussion'),
    },
  ]
  
  // Trending items configuration
  const trendingItems: SpotlightTrendingItem[] = [
    {
      id: 't1',
      titleKey: 'trending1',
      icon: Trophy,
      trend: 'up',
      change: '+45%',
      action: () => console.log('View trending 1'),
    },
    {
      id: 't2',
      titleKey: 'trending2',
      icon: MessageSquare,
      trend: 'up',
      change: '+32%',
      action: () => console.log('View trending 2'),
    },
    {
      id: 't3',
      titleKey: 'trending3',
      icon: Users,
      trend: 'up',
      change: '+28%',
      action: () => console.log('View trending 3'),
    },
    {
      id: 't4',
      titleKey: 'trending4',
      icon: Star,
      trend: 'up',
      change: '+19%',
      action: () => console.log('View trending 4'),
    },
    {
      id: 't5',
      titleKey: 'trending5',
      icon: Zap,
      trend: 'neutral',
      change: '+5%',
      action: () => console.log('View trending 5'),
    },
  ]
  
  return (
    <div role="main" aria-label="Spotlight content">
      <SpotlightTemplateOrganism
      translationNamespace="community.spotlight"
      featuredItems={featuredItems}
      trendingItems={trendingItems}
      loading={loading}
      workspaceId={workspaceId}
      userId={userId}
    />
    </div>
  )
}
