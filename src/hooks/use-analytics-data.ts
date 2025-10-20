import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface AnalyticsMetric {
  id: string
  name: string
  value: string | number
  change: string
  trend: 'up' | 'down'
  created_at?: string
  updated_at?: string
}

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data: metrics, error: fetchError } = await supabase
        .from('analytics_metrics')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setData(metrics || [])
    } catch (err: any) {
      setError(err as Error)
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('analytics_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'analytics_metrics' }, () => {
        fetchAnalytics()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { data, loading, error, refresh: fetchAnalytics }
}
