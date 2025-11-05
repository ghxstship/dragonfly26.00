/**
 * Asset Catalog API
 * Functions for interacting with the global asset catalog
 * 
 * BESPOKE DESIGN:
 * - asset_catalog table = Global reference catalog (read-only for most users)
 * - assets table = Workspace-specific inventory instances
 * - Relationship: assets.catalog_item_id → asset_catalog.id
 */

import { createClient } from '@/lib/supabase/client'

export interface CatalogAsset {
  id: string
  name: string
  description: string | null
  category: string
  subcategory: string | null
  sku: string | null
  asset_type: 'infrastructure' | 'equipment' | 'consumable' | 'vehicle' | 'technology' | null
  asset_category: string | null // Legacy field
  industry: string[] | null
  specifications: Record<string, any>
  dimensions: Record<string, any>
  manufacturer: string | null
  model_number: string | null
  year: number | null
  msrp: number | null
  estimated_rental_daily: number | null
  estimated_rental_weekly: number | null
  estimated_rental_monthly: number | null
  tags: string[] | null
  keywords: string[] | null
  is_active: boolean
  is_featured: boolean
  popularity_score: number
  image_url: string | null
  thumbnail_url: string | null
  documentation_url: string | null
  created_at: string
  updated_at: string
}

export interface CatalogSearchResult extends CatalogAsset {
  relevance: number
}

/**
 * Search the global asset catalog using text search
 */
export async function searchAssetCatalog(
  searchQuery: string,
  options?: {
    categoryFilter?: string
    industryFilter?: string
    assetTypeFilter?: string
    limit?: number
  }
): Promise<{ data: CatalogSearchResult[] | null; error: Error | unknown }> {
  const supabase = createClient()

  try {
    let query = supabase
      .from('asset_catalog')
      .select('*')
      .eq('is_active', true)

    // Text search across name, description, tags, keywords
    if (searchQuery && searchQuery.length >= 2) {
      query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tags.cs.{${searchQuery}},keywords.cs.{${searchQuery}}`)
    }

    // Apply filters
    if (options?.categoryFilter) {
      query = query.eq('category', options.categoryFilter)
    }
    if (options?.assetTypeFilter) {
      query = query.eq('asset_type', options.assetTypeFilter)
    }
    if (options?.industryFilter) {
      query = query.contains('industry', [options.industryFilter])
    }

    // Order by popularity and limit
    query = query.order('popularity_score', { ascending: false })
    
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) throw error

    // Add relevance score (simplified - could be enhanced with full-text search)
    const results = data?.map(item => ({
      ...item,
      relevance: 1.0
    })) || []

    return { data: results, error: null }
  } catch (error: any) {
    console.error('Error searching asset catalog:', error)
    return { data: null, error }
  }
}

/**
 * Browse assets by category and subcategory
 */
export async function browseCatalogByCategory(
  category?: string,
  subcategory?: string
): Promise<{ data: CatalogAsset[] | null; error: Error | unknown }> {
  const supabase = createClient()

  try {
    let query = supabase
      .from('asset_catalog')
      .select('*')
      .eq('is_active', true)

    if (category) {
      query = query.eq('category', category)
    }
    if (subcategory) {
      query = query.eq('subcategory', subcategory)
    }

    query = query.order('name')

    const { data, error } = await query

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error browsing catalog:', error)
    return { data: null, error }
  }
}

/**
 * Get all categories from the catalog
 */
export async function getCatalogCategories(): Promise<{
  data: Array<{
    category: string
    subcategory: string | null
    item_count: number
  }> | null
  error: Error | unknown
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('category, subcategory')
      .eq('is_active', true)

    if (error) throw error

    // Group by category and subcategory
    const grouped = data?.reduce((acc: any[], item) => {
      const key = `${item.category}|${item.subcategory || ''}`
      const existing = acc.find(g => `${g.category}|${g.subcategory || ''}` === key)
      if (existing) {
        existing.item_count++
      } else {
        acc.push({ category: item.category, subcategory: item.subcategory, item_count: 1 })
      }
      return acc
    }, []) || []

    return { data: grouped, error: null }
  } catch (error: any) {
    console.error('Error fetching catalog categories:', error)
    return { data: null, error }
  }
}

/**
 * Get catalog statistics
 */
export async function getCatalogStatistics(): Promise<{
  data: {
    total_items: number
    categories: number
    subcategories: number
    manufacturers: number
    asset_types: number
  } | null
  error: Error | unknown
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('category, subcategory, manufacturer, asset_type')
      .eq('is_active', true)

    if (error) throw error

    const stats = {
      total_items: data?.length || 0,
      categories: new Set(data?.map(i => i.category)).size,
      subcategories: new Set(data?.filter(i => i.subcategory).map(i => i.subcategory)).size,
      manufacturers: new Set(data?.filter(i => i.manufacturer).map(i => i.manufacturer)).size,
      asset_types: new Set(data?.filter(i => i.asset_type).map(i => i.asset_type)).size
    }

    return { data: stats, error: null }
  } catch (error: any) {
    console.error('Error fetching catalog statistics:', error)
    return { data: null, error }
  }
}

/**
 * Get a specific catalog item by ID
 */
export async function getCatalogItem(
  itemId: string
): Promise<{ data: CatalogAsset | null; error: Error | unknown }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('*')
      .eq('id', itemId)
      .eq('is_active', true)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching catalog item:', error)
    return { data: null, error }
  }
}

/**
 * Get all items in a specific asset category
 */
export async function getItemsByAssetCategory(
  assetCategory: string
): Promise<{ data: CatalogAsset[] | null; error: Error | unknown }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('*')
      .eq('asset_category', assetCategory)
      .eq('is_active', true)
      .order('category')
      .order('subcategory')
      .order('name')

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error fetching items by category:', error)
    return { data: null, error }
  }
}

/**
 * Get all unique asset categories
 */
export async function getAssetCategories(): Promise<{
  data: string[] | null
  error: Error | unknown
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('category')
      .eq('is_active', true)
      .order('category')

    if (error) throw error

    // Get unique categories
    const uniqueCategories = [...new Set(data?.map((item: any) => item.category) || [])]

    return { data: uniqueCategories, error: null }
  } catch (error: any) {
    console.error('Error fetching asset categories:', error)
    return { data: null, error }
  }
}

/**
 * Get all industry tags
 */
export async function getIndustryTags(): Promise<{
  data: string[] | null
  error: Error | unknown
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('asset_catalog')
      .select('industry')
      .eq('is_active', true)
      .not('industry', 'is', null)

    if (error) throw error

    // Flatten and get unique tags
    const allTags = data?.flatMap((item) => item.industry || []) || []
    const uniqueTags = [...new Set(allTags)].sort()

    return { data: uniqueTags, error: null }
  } catch (error: any) {
    console.error('Error fetching industry tags:', error)
    return { data: null, error }
  }
}

/**
 * Autocomplete search for asset names (for use in forms)
 */
export async function autocompleteAssetSearch(
  searchQuery: string,
  assetCategory?: string,
  limit: number = 10
): Promise<{ data: Array<{ id: string; name: string; category: string; manufacturer?: string }> | null; error: Error | unknown }> {
  if (!searchQuery || searchQuery.length < 2) {
    return { data: [], error: null }
  }

  const { data, error } = await searchAssetCatalog(searchQuery, {
    categoryFilter: assetCategory,
    limit
  })

  if (error) return { data: null, error }

  // Format for autocomplete
  const formatted = data?.map((item: any) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer
  }))

  return { data: formatted || [], error: null }
}

/**
 * Copy a catalog item to a user's workspace
 * (Creates a new asset instance based on catalog item)
 * 
 * BESPOKE DESIGN:
 * - Catalog item = Template/SKU in asset_catalog table
 * - Asset = Actual inventory instance in assets table
 * - Relationship: assets.catalog_item_id → asset_catalog.id
 */
export async function copyCatalogItemToWorkspace(
  catalogItemId: string,
  workspaceId: string,
  userId: string,
  overrides?: Partial<Pick<CatalogAsset, 'name' | 'description' | 'specifications'>>
): Promise<{ data: any | null; error: Error | unknown }> {
  const supabase = createClient()

  try {
    // Get the catalog item
    const { data: catalogItem, error: fetchError } = await getCatalogItem(catalogItemId)
    if (fetchError || !catalogItem) throw fetchError || new Error('Catalog item not found')

    // Create new asset instance in user's workspace
    const newAsset = {
      workspace_id: workspaceId,
      catalog_item_id: catalogItemId, // Link to catalog
      is_catalog_item: true, // Mark as catalog-based
      name: overrides?.name || catalogItem.name,
      description: overrides?.description || catalogItem.description,
      type: catalogItem.asset_type, // Use asset_type from catalog
      asset_category: catalogItem.asset_category,
      category: catalogItem.category,
      subcategory: catalogItem.subcategory,
      manufacturer: catalogItem.manufacturer,
      model_number: catalogItem.model_number,
      tags: catalogItem.tags,
      specifications: overrides?.specifications || catalogItem.specifications,
      created_by: userId
    }

    const { data, error } = await supabase
      .from('assets')
      .insert(newAsset)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error: any) {
    console.error('Error copying catalog item:', error)
    return { data: null, error }
  }
}
