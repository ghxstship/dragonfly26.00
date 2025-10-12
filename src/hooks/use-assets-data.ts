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
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          current_location:current_location_id(name),
          transactions:asset_transactions(count)
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
      let query = supabase
        .from('asset_transactions')
        .select(`
          *,
          asset:asset_id(name, asset_type),
          from_location:from_location_id(name),
          to_location:to_location_id(name),
          checked_out_by_user:checked_out_by(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)

      if (assetId) {
        query = query.eq('asset_id', assetId)
      }

      const { data, error } = await query.order('transaction_date', { ascending: false })

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
      const { data, error } = await supabase
        .from('asset_maintenance')
        .select(`
          *,
          asset:asset_id(name, asset_type)
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
      const { data, error } = await supabase
        .from('production_advances')
        .select(`
          *,
          production:production_id(name),
          requested_by_user:requested_by(first_name, last_name)
        `)
        .eq('workspace_id', workspaceId)
        .order('requested_date', { ascending: false })

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
