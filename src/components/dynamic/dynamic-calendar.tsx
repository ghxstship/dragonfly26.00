'use client'

import dynamic from 'next/dynamic'

/**
 * Dynamically imported Calendar component
 * Reduces initial bundle size by lazy-loading the calendar and date-picker library
 */
export const DynamicCalendar = dynamic(
  () => import('@/components/ui/calendar').then(mod => ({ default: mod.Calendar })),
  {
    loading: () => (
      <div className="p-3">
        <div className="h-[300px] w-full animate-pulse bg-muted rounded-md" />
      </div>
    ),
    ssr: false, // Calendar doesn't need SSR
  }
)
