import { QueryClient } from '@tanstack/react-query'

/**
 * React Query client configuration for optimal caching and performance
 * 
 * Key settings:
 * - staleTime: Data is considered fresh for 60 seconds
 * - cacheTime: Cache persists for 5 minutes after last use
 * - refetchOnWindowFocus: Disabled to prevent unnecessary refetching
 * - refetchOnMount: Disabled to use cached data when available
 * - retry: Only retry failed requests once
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,           // 1 minute - data is fresh
      gcTime: 5 * 60 * 1000,          // 5 minutes - cache garbage collection (formerly cacheTime)
      refetchOnWindowFocus: false,    // Don't refetch when window regains focus
      refetchOnMount: false,          // Don't refetch when component mounts if data exists
      refetchOnReconnect: true,       // Refetch when internet reconnects
      retry: 1,                       // Only retry failed requests once
    },
    mutations: {
      retry: 1,                       // Retry failed mutations once
    },
  },
})
