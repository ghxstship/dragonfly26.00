'use client'

import dynamic from 'next/dynamic'

/**
 * Dynamically imported animation components
 * Reduces initial bundle by lazy-loading framer-motion
 */

export const DynamicAnimatedIcon = dynamic(
  () => import('@/components/ui/animated-icon').then(mod => ({ default: mod.AnimatedIcon })),
  {
    ssr: false, // Animations don't need SSR
  }
)

export const DynamicPageTransition = dynamic(
  () => import('@/components/ui/page-transition').then(mod => ({ default: mod.PageTransition })),
  {
    ssr: false,
  }
)

export const DynamicLoadingSpinner = dynamic(
  () => import('@/components/ui/loading-spinner').then(mod => ({ default: mod.LoadingSpinner })),
  {
    ssr: false,
  }
)
