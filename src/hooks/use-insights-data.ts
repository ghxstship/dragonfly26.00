import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Insight {
  id: string
  type: 'opportunity' | 'risk' | 'achievement'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  impact: string
  confidence: number
  recommendation: string
  created_at?: string
  updated_at?: string
}

export function useInsightsData() {
  const [data, setData] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true)
        const { data: insights, error: fetchError } = await supabase
          .from('insights_objectives')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setData(insights || [])
      } catch (err: any) {
        setError(err as Error)
        console.error('Error fetching insights:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  return { data, loading, error }
}
