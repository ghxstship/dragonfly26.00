'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import { copyCatalogItemToWorkspace } from '@/lib/api/asset-catalog'

/**
 * Hook for managing catalog-based assets in a workspace
 * 
 * BESPOKE DESIGN:
 * - Queries assets table with catalog_item_id relationship
 * - Distinguishes between catalog-based and custom assets
 * - Provides methods to create assets from catalog
 */

export interface CatalogBasedAsset {
  id: string
  workspace_id: string
  catalog_item_id: string | null
  is_catalog_item: boolean
  name: string
  description: string | null
  type: string
  asset_category: string | null
  category: string
  subcategory: string | null
  manufacturer: string | null
  model_number: string | null
  tags: string[] | null
  specifications: Record<string, any>
  status: string | null
  quantity: number | null
  serial_number: string | null
  created_at: string
  updated_at: string
  created_by: string | null
}

export function useCatalogAssets(workspaceId: string) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  // Query all assets (catalog-based and custom)
  const { data: allAssets, isLoading: loadingAll, error: errorAll } = useQuery({
    queryKey: ['catalog-assets', workspaceId, 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as CatalogBasedAsset[]
    },
    enabled: !!workspaceId
  })

  // Query only catalog-based assets
  const { data: catalogAssets, isLoading: loadingCatalog, error: errorCatalog } = useQuery({
    queryKey: ['catalog-assets', workspaceId, 'catalog-only'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_catalog_item', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as CatalogBasedAsset[]
    },
    enabled: !!workspaceId
  })

  // Query only custom assets (not from catalog)
  const { data: customAssets, isLoading: loadingCustom, error: errorCustom } = useQuery({
    queryKey: ['catalog-assets', workspaceId, 'custom-only'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .eq('is_catalog_item', false)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as CatalogBasedAsset[]
    },
    enabled: !!workspaceId
  })

  // Real-time subscription
  useEffect(() => {
    if (!workspaceId) return

    const channel = supabase
      .channel(`catalog-assets:${workspaceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'assets',
          filter: `workspace_id=eq.${workspaceId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['catalog-assets', workspaceId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [workspaceId, queryClient, supabase])

  // Create asset from catalog
  const createFromCatalog = useMutation({
    mutationFn: async ({
      catalogItemId,
      userId,
      overrides
    }: {
      catalogItemId: string
      userId: string
      overrides?: Partial<Pick<CatalogBasedAsset, 'name' | 'description' | 'specifications'>>
    }) => {
      const { data, error } = await copyCatalogItemToWorkspace(
        catalogItemId,
        workspaceId,
        userId,
        overrides
      )
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-assets', workspaceId] })
    }
  })

  // Create custom asset (not from catalog)
  const createCustomAsset = useMutation({
    mutationFn: async (asset: Partial<CatalogBasedAsset>) => {
      const { data, error } = await supabase
        .from('assets')
        .insert([{
          ...asset,
          workspace_id: workspaceId,
          is_catalog_item: false,
          catalog_item_id: null
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-assets', workspaceId] })
    }
  })

  // Update asset
  const updateAsset = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CatalogBasedAsset> & { id: string }) => {
      const { data, error } = await supabase
        .from('assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-assets', workspaceId] })
    }
  })

  // Delete asset (soft delete)
  const deleteAsset = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assets')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog-assets', workspaceId] })
    }
  })

  // Get asset with catalog details (if catalog-based)
  const getAssetWithCatalogDetails = async (assetId: string) => {
    const { data, error } = await supabase
      .from('assets')
      .select(`
        *,
        catalog_item:catalog_item_id (
          id,
          name,
          description,
          category,
          subcategory,
          manufacturer,
          model_number,
          specifications,
          msrp,
          estimated_rental_daily,
          estimated_rental_weekly,
          estimated_rental_monthly,
          image_url,
          thumbnail_url
        )
      `)
      .eq('id', assetId)
      .single()

    if (error) throw error
    return data
  }

  return {
    // Data
    allAssets: allAssets || [],
    catalogAssets: catalogAssets || [],
    customAssets: customAssets || [],
    
    // Loading states
    loading: loadingAll || loadingCatalog || loadingCustom,
    loadingAll,
    loadingCatalog,
    loadingCustom,
    
    // Errors
    error: errorAll || errorCatalog || errorCustom,
    
    // Mutations
    createFromCatalog: createFromCatalog.mutateAsync,
    createCustomAsset: createCustomAsset.mutateAsync,
    updateAsset: updateAsset.mutateAsync,
    deleteAsset: deleteAsset.mutateAsync,
    getAssetWithCatalogDetails,
    
    // Mutation states
    isCreatingFromCatalog: createFromCatalog.isPending,
    isCreatingCustom: createCustomAsset.isPending,
    isUpdating: updateAsset.isPending,
    isDeleting: deleteAsset.isPending
  }
}

/**
 * Hook for getting a single asset with catalog details
 */
export function useAssetWithCatalog(assetId: string) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['asset-with-catalog', assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          catalog_item:catalog_item_id (
            id,
            name,
            description,
            category,
            subcategory,
            manufacturer,
            model_number,
            sku,
            specifications,
            dimensions,
            msrp,
            estimated_rental_daily,
            estimated_rental_weekly,
            estimated_rental_monthly,
            tags,
            keywords,
            image_url,
            thumbnail_url,
            documentation_url
          )
        `)
        .eq('id', assetId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!assetId
  })
}
