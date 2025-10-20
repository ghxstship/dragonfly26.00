"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { SpotlightTemplateOrganism, SpotlightFeaturedItem, SpotlightTrendingItem } from '@/components/organisms'
import { BookOpen, GraduationCap, FileText, TrendingUp, Lightbulb, Award } from 'lucide-react'
import { useResourcesData } from '@/hooks/use-resources-data'

export interface ResourcesSpotlightTabProps {
  workspaceId?: string
  userId?: string
}

export function ResourcesSpotlightTab({ workspaceId = '', userId = '' }: ResourcesSpotlightTabProps): JSX.Element {
  const t = useTranslations('resources.spotlight')
  const { resources, courses, grants, publications, loading } = useResourcesData()
  
  const featuredItems: SpotlightFeaturedItem[] = [
    {
      id: '1',
      titleKey: 'featured1Title',
      descriptionKey: 'featured1Desc',
      imageUrl: '/screenshots/resources-featured-1.png',
      authorName: 'Dr. James Wilson',
      authorAvatar: '/avatars/james.jpg',
      categoryKey: 'course',
      tags: ['advanced', 'certification', 'popular'],
      metrics: {
        views: 8920,
        likes: 567,
        rating: 4.9,
      },
      actionLabelKey: 'enrollNow',
      action: () => console.log('Enroll in course'),
    },
    {
      id: '2',
      titleKey: 'featured2Title',
      descriptionKey: 'featured2Desc',
      imageUrl: '/screenshots/resources-featured-2.png',
      authorName: 'Industry Standards Board',
      authorAvatar: '/avatars/standards.jpg',
      categoryKey: 'guide',
      tags: ['essential', 'reference', 'updated'],
      metrics: {
        views: 12340,
        likes: 892,
        rating: 4.8,
      },
      actionLabelKey: 'downloadGuide',
      action: () => console.log('Download guide'),
    },
    {
      id: '3',
      titleKey: 'featured3Title',
      descriptionKey: 'featured3Desc',
      imageUrl: '/screenshots/resources-featured-3.png',
      authorName: 'Research Institute',
      authorAvatar: '/avatars/research.jpg',
      categoryKey: 'publication',
      tags: ['research', 'insights', 'trending'],
      metrics: {
        views: 6780,
        likes: 445,
        rating: 4.7,
      },
      actionLabelKey: 'readPublication',
      action: () => console.log('Read publication'),
    },
  ]
  
  const trendingItems: SpotlightTrendingItem[] = [
    {
      id: 't1',
      titleKey: 'trending1',
      icon: GraduationCap,
      trend: 'up',
      change: '+89%',
      action: () => console.log('View trending 1'),
    },
    {
      id: 't2',
      titleKey: 'trending2',
      icon: BookOpen,
      trend: 'up',
      change: '+72%',
      action: () => console.log('View trending 2'),
    },
    {
      id: 't3',
      titleKey: 'trending3',
      icon: FileText,
      trend: 'up',
      change: '+58%',
      action: () => console.log('View trending 3'),
    },
    {
      id: 't4',
      titleKey: 'trending4',
      icon: Lightbulb,
      trend: 'up',
      change: '+34%',
      action: () => console.log('View trending 4'),
    },
    {
      id: 't5',
      titleKey: 'trending5',
      icon: Award,
      trend: 'up',
      change: '+21%',
      action: () => console.log('View trending 5'),
    },
  ]
  
  return (
    <div role="main" aria-label="Spotlight content">
      <SpotlightTemplateOrganism
      translationNamespace="resources.spotlight"
      featuredItems={featuredItems}
      trendingItems={trendingItems}
      loading={loading}
      workspaceId={workspaceId}
      userId={userId}
    />
    </div>
  )
}
