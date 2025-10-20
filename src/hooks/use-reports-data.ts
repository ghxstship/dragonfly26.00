import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface Report {
  id: string
  name: string
  type: string
  generated: string
  size: string
  downloads: number
  created_at?: string
  updated_at?: string
}

export function useReportsData() {
  const [data, setData] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true)
        const { data: reports, error: fetchError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setData(reports || [])
      } catch (err: any) {
        setError(err as Error)
        console.error('Error fetching reports:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  return { data, loading, error }
}
