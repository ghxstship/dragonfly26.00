'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

// Fetch function for assets
async function fetchAssets(workspaceId: string) {
  if (!workspaceId) return []
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('assets')
    .select(`
      id,
      name,
      type,
      status,
      quantity,
      location_id,
      created_at,
      updated_at,
      location:locations!location_id(id, name, city, address)
    `)
    .eq('workspace_id', workspaceId)
    .order('name', { ascending: true })
    .limit(500) // Pagination will be added later

  if (error) throw error
  return data || []
}

/**
 * Hook for fetching assets with React Query caching
 * 
 * Benefits:
 * - Automatic caching (data persists across navigation)
 * - No refetch on component remount
 * - Background refetch after 60s staleTime
 * - Reduced database load
 * 
 * Note: Real-time updates temporarily removed for performance
 * Will be re-added via consolidated workspace subscription
 */
export function useAssets(workspaceId: string) {
  const query = useQuery({
    queryKey: ['assets', workspaceId],
    queryFn: () => fetchAssets(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000, // 1 minute
  })

  return {
    assets: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Fetch function for asset transactions
async function fetchAssetTransactions(workspaceId: string, assetId?: string) {
  if (!workspaceId) return []
  
  const supabase = createClient()
  
  let query = supabase
    .from('asset_transactions')
    .select(`
      id,
      transaction_type,
      quantity,
      checked_out_to,
      checked_in_by,
      notes,
      created_at,
      asset_id,
      production_id,
      event_id,
      performed_by,
      asset:assets!asset_id(id, name, type),
      checked_out_person:personnel!checked_out_to(id, first_name, last_name),
      production:productions!production_id(id, name),
      event:events!event_id(id, name),
      performed_by_user:profiles!performed_by(id, first_name, last_name)
    `)
    .eq('workspace_id', workspaceId)

  if (assetId) {
    query = query.eq('asset_id', assetId)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return data || []
}

/**
 * Hook for fetching asset transactions with React Query caching
 */
export function useAssetTransactions(workspaceId: string, assetId?: string) {
  const query = useQuery({
    queryKey: ['asset_transactions', workspaceId, assetId],
    queryFn: () => fetchAssetTransactions(workspaceId, assetId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
  })

  return {
    transactions: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Fetch function for asset maintenance
async function fetchMaintenance(workspaceId: string) {
  if (!workspaceId) return []
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('asset_maintenance')
    .select(`
      id,
      maintenance_type,
      scheduled_date,
      completed_date,
      status,
      notes,
      cost,
      asset_id,
      performed_by,
      created_at,
      asset:assets!asset_id(id, name, type, status),
      performed_by_person:personnel!performed_by(id, first_name, last_name)
    `)
    .eq('workspace_id', workspaceId)
    .order('scheduled_date', { ascending: true })
    .limit(200)

  if (error) throw error
  return data || []
}

/**
 * Hook for fetching asset maintenance records with React Query caching
 */
export function useMaintenance(workspaceId: string) {
  const query = useQuery({
    queryKey: ['maintenance', workspaceId],
    queryFn: () => fetchMaintenance(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
  })

  return {
    maintenance: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Fetch function for production advances
async function fetchAdvances(workspaceId: string) {
  if (!workspaceId) return []
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('production_advances')
    .select(`
      id,
      amount,
      purpose,
      status,
      requested_date,
      approved_date,
      production_id,
      requested_by,
      approved_by,
      created_at,
      production:productions!production_id(id, name, status),
      requested_by_user:profiles!requested_by(id, first_name, last_name),
      approved_by_user:profiles!approved_by(id, first_name, last_name)
    `)
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(200)

  if (error) throw error
  return data || []
}

/**
 * Hook for fetching production advances with React Query caching
 */
export function useAdvances(workspaceId: string) {
  const query = useQuery({
    queryKey: ['advances', workspaceId],
    queryFn: () => fetchAdvances(workspaceId),
    enabled: !!workspaceId,
    staleTime: 60 * 1000,
  })

  return {
    advances: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}

// Fetch function for asset availability
async function fetchAssetAvailability(assetId: string, startDate: string, endDate: string) {
  if (!assetId || !startDate || !endDate) return null
  
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_asset_availability', {
      p_asset_id: assetId,
      p_start_date: startDate,
      p_end_date: endDate
    })

  if (error) throw error
  return data
}

/**
 * Hook for fetching asset availability with React Query caching
 * Uses RPC function for complex availability calculation
 */
export function useAssetAvailability(assetId: string, startDate: string, endDate: string) {
  const query = useQuery({
    queryKey: ['asset_availability', assetId, startDate, endDate],
    queryFn: () => fetchAssetAvailability(assetId, startDate, endDate),
    enabled: !!(assetId && startDate && endDate),
    staleTime: 30 * 1000, // 30 seconds for availability checks
  })

  return {
    availability: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  }
}
