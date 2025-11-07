'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query-client'
import { lazy, Suspense } from 'react'

// Lazy load devtools only in development to avoid bundling in production
const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? lazy(() =>
        import('@tanstack/react-query-devtools').then((d) => ({
          default: d.ReactQueryDevtools,
        }))
      )
    : () => null

/**
 * React Query provider component
 * Wraps the app to enable React Query caching throughout
 * Includes DevTools in development for debugging
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}
