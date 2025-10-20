'use client'

import { useEffect, useRef, useCallback } from 'react'
import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'

interface DebouncedRealtimeOptions {
  debounceMs?: number
  maxWaitMs?: number
  leading?: boolean
  trailing?: boolean
}

/**
 * Creates a debounced realtime subscription to reduce database load
 * 
 * @param supabase - Supabase client instance
 * @param channelName - Unique channel name for the subscription
 * @param callback - Function to call when changes occur (debounced)
 * @param options - Debounce configuration
 * @returns Cleanup function
 * 
 * @example
 * ```ts
 * useDebouncedRealtime(
 *   supabase,
 *   `events:${workspaceId}`,
 *   () => fetchEvents(),
 *   { debounceMs: 1000, maxWaitMs: 5000 }
 * )
 * ```
 */
export function useDebouncedRealtime(
  supabase: SupabaseClient,
  channelName: string,
  callback: () => void | Promise<void>,
  options: DebouncedRealtimeOptions = {}
) {
  const {
    debounceMs = 1000,
    maxWaitMs = 5000,
    leading = false,
    trailing = true
  } = options

  const timeoutRef = useRef<NodeJS.Timeout>()
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout>()
  const lastCallTimeRef = useRef<number>(0)
  const channelRef = useRef<RealtimeChannel>()

  const debouncedCallback = useCallback(() => {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTimeRef.current

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current)
    }

    // Leading edge execution
    if (leading && timeSinceLastCall > debounceMs) {
      lastCallTimeRef.current = now
      callback()
      return
    }

    // Set up trailing edge execution
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        lastCallTimeRef.current = Date.now()
        callback()
      }, debounceMs)
    }

    // Set up max wait execution (prevents indefinite debouncing)
    if (maxWaitMs && timeSinceLastCall === 0) {
      maxWaitTimeoutRef.current = setTimeout(() => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
        lastCallTimeRef.current = Date.now()
        callback()
      }, maxWaitMs)
    }
  }, [callback, debounceMs, maxWaitMs, leading, trailing])

  useEffect(() => {
    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current)
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [supabase])

  return debouncedCallback
}

/**
 * Subscribe to multiple tables with a single debounced callback
 * 
 * @param supabase - Supabase client instance
 * @param channelName - Unique channel name
 * @param tables - Array of table configurations
 * @param callback - Debounced callback function
 * @param options - Debounce configuration
 * @returns Cleanup function
 * 
 * @example
 * ```ts
 * useMultiTableRealtime(
 *   supabase,
 *   `dashboard:${workspaceId}`,
 *   [
 *     { table: 'productions', filter: `workspace_id=eq.${workspaceId}` },
 *     { table: 'events', filter: `workspace_id=eq.${workspaceId}` }
 *   ],
 *   () => fetchDashboardData(),
 *   { debounceMs: 1000 }
 * )
 * ```
 */
export function useMultiTableRealtime(
  supabase: SupabaseClient,
  channelName: string,
  tables: Array<{ table: string; filter?: string; event?: '*' | 'INSERT' | 'UPDATE' | 'DELETE' }>,
  callback: () => void | Promise<void>,
  options: DebouncedRealtimeOptions = {}
) {
  const debouncedCallback = useDebouncedRealtime(supabase, channelName, callback, options)
  const channelRef = useRef<RealtimeChannel>()

  useEffect(() => {
    if (!tables.length) return

    // Create channel with multiple table subscriptions
    let channel = supabase.channel(channelName)

    tables.forEach(({ table, filter, event = '*' }) => {
      channel = channel.on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
          ...(filter && { filter })
        },
        debouncedCallback
      )
    })

    channelRef.current = channel.subscribe()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [supabase, channelName, tables, debouncedCallback])
}

/**
 * Performance metrics for realtime subscriptions
 */
export interface RealtimeMetrics {
  channelName: string
  subscriptionCount: number
  lastUpdateTime: number
  updateCount: number
  averageDebounceDelay: number
}

const metricsMap = new Map<string, RealtimeMetrics>()

/**
 * Track realtime subscription metrics for performance monitoring
 */
export function trackRealtimeMetrics(channelName: string, debounceDelay: number) {
  const existing = metricsMap.get(channelName)
  
  if (existing) {
    existing.updateCount++
    existing.lastUpdateTime = Date.now()
    existing.averageDebounceDelay = 
      (existing.averageDebounceDelay * (existing.updateCount - 1) + debounceDelay) / existing.updateCount
  } else {
    metricsMap.set(channelName, {
      channelName,
      subscriptionCount: 1,
      lastUpdateTime: Date.now(),
      updateCount: 1,
      averageDebounceDelay: debounceDelay
    })
  }
}

/**
 * Get all realtime metrics for debugging
 */
export function getRealtimeMetrics(): RealtimeMetrics[] {
  return Array.from(metricsMap.values())
}

/**
 * Clear realtime metrics
 */
export function clearRealtimeMetrics() {
  metricsMap.clear()
}
