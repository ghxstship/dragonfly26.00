'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Hook for Assets
export function useAssets(workspaceId: string) {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAssets() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          location:locations!location_id(name, city, address)
        `)
        .eq('workspace_id', workspaceId)
        .order('name', { ascending: true })

      if (!error && data) {
        setAssets(data)
      }
      setLoading(false)
    }

    fetchAssets()

    const channel = supabase
      .channel(`assets:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assets', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchAssets()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { assets, loading }
}

// Hook for Asset Transactions
export function useAssetTransactions(workspaceId: string, assetId?: string) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTransactions() {
      if (!workspaceId) return
      
      let query = supabase
        .from('asset_transactions')
        .select(`
          *,
          asset:assets!asset_id(name, type),
          checked_out_person:personnel!checked_out_to(first_name, last_name),
          production:productions!production_id(name),
          event:events!event_id(name),
          performed_by_user:profiles!performed_by(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)

      if (assetId) {
        query = query.eq('asset_id', assetId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (!error && data) {
        setTransactions(data)
      }
      setLoading(false)
    }

    fetchTransactions()

    const channel = supabase
      .channel(`asset_transactions:${workspaceId}:${assetId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'asset_transactions', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchTransactions()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, assetId])

  return { transactions, loading }
}

// Hook for Maintenance
export function useMaintenance(workspaceId: string) {
  const [maintenance, setMaintenance] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchMaintenance() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('asset_maintenance')
        .select(`
          *,
          asset:assets!asset_id(name, type, status),
          performed_by_person:personnel!performed_by(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)
        .order('scheduled_date', { ascending: true })

      if (!error && data) {
        setMaintenance(data)
      }
      setLoading(false)
    }

    fetchMaintenance()

    const channel = supabase
      .channel(`maintenance:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'asset_maintenance', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchMaintenance()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { maintenance, loading }
}

// Hook for Advances
export function useAdvances(workspaceId: string) {
  const [advances, setAdvances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAdvances() {
      if (!workspaceId) return
      
      const { data, error } = await supabase
        .from('production_advances')
        .select(`
          *,
          production:productions!production_id(name, status),
          requested_by_user:profiles!requested_by(first_name, last_name),
          approved_by_user:profiles!approved_by(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: false })

      if (!error && data) {
        setAdvances(data)
      }
      setLoading(false)
    }

    fetchAdvances()

    const channel = supabase
      .channel(`advances:${workspaceId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'production_advances', filter: `workspace_id=eq.${workspaceId}` },
        () => fetchAdvances()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId])

  return { advances, loading }
}

// Hook for Asset Availability (uses RPC function)
export function useAssetAvailability(assetId: string, startDate: string, endDate: string) {
  const [availability, setAvailability] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAvailability() {
      const { data, error } = await supabase
        .rpc('get_asset_availability', {
          p_asset_id: assetId,
          p_start_date: startDate,
          p_end_date: endDate
        })

      if (!error && data) {
        setAvailability(data)
      }
      setLoading(false)
    }

    if (assetId && startDate && endDate) {
      fetchAvailability()
    }
  }, [assetId, startDate, endDate])

  return { availability, loading }
}
