/**
 * Asset Catalog API
 * Functions for interacting with the global asset catalog
 */

import { createClient } from '@/lib/supabase/client'

// Global catalog workspace ID
export const GLOBAL_CATALOG_WORKSPACE_ID = '00000000-0000-0000-0000-000000000001'

export interface CatalogAsset {
  id: string
  name: string
  description: string
  type: string
  asset_category: string
  category: string
  subcategory?: string
  manufacturer?: string
  model_number?: string
  related_names?: string[]
  tags?: string[]
  industry_tags?: string[]
  specifications?: Record<string, any>
  created_at: string
}

export interface CatalogSearchResult extends CatalogAsset {
  relevance: number
}

/**
 * Search the global asset catalog using fuzzy search
 */
export async function searchAssetCatalog(
  searchQuery: string,
  options?: {
    categoryFilter?: string
    industryFilter?: string
    limit?: number
  }
): Promise<{ data: CatalogSearchResult[] | null; error: any }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.rpc('search_assets', {
      search_query: searchQuery,
      category_filter: options?.categoryFilter || null,
      workspace_filter: GLOBAL_CATALOG_WORKSPACE_ID,
      industry_filter: options?.industryFilter || null
    })

    if (error) throw error

    // Limit results if specified
    const limitedData = options?.limit ? data?.slice(0, options.limit) : data

    return { data: limitedData, error: null }
  } catch (error) {
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
): Promise<{ data: CatalogAsset[] | null; error: any }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.rpc('search_assets_by_category', {
      category_filter: category || null,
      subcategory_filter: subcategory || null,
      workspace_filter: GLOBAL_CATALOG_WORKSPACE_ID
    })

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error browsing catalog:', error)
    return { data: null, error }
  }
}

/**
 * Get all categories from the catalog
 */
export async function getCatalogCategories(): Promise<{
  data: Array<{
    asset_category: string
    category: string
    subcategory: string
    item_count: number
  }> | null
  error: any
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('catalog_by_category')
      .select('*')
      .order('asset_category')
      .order('category')
      .order('subcategory')

    if (error) throw error

    return { data, error: null }
  } catch (error) {
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
    asset_categories: number
    categories: number
    subcategories: number
    manufacturers: number
    total_related_names: number
    avg_related_names_per_item: number
  } | null
  error: any
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('catalog_statistics')
      .select('*')
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching catalog statistics:', error)
    return { data: null, error }
  }
}

/**
 * Get a specific catalog item by ID
 */
export async function getCatalogItem(
  itemId: string
): Promise<{ data: CatalogAsset | null; error: any }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('workspace_id', GLOBAL_CATALOG_WORKSPACE_ID)
      .eq('id', itemId)
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching catalog item:', error)
    return { data: null, error }
  }
}

/**
 * Get all items in a specific asset category
 */
export async function getItemsByAssetCategory(
  assetCategory: string
): Promise<{ data: CatalogAsset[] | null; error: any }> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('workspace_id', GLOBAL_CATALOG_WORKSPACE_ID)
      .eq('asset_category', assetCategory)
      .order('category')
      .order('subcategory')
      .order('name')

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error fetching items by category:', error)
    return { data: null, error }
  }
}

/**
 * Get all unique asset categories
 */
export async function getAssetCategories(): Promise<{
  data: string[] | null
  error: any
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('assets')
      .select('asset_category')
      .eq('workspace_id', GLOBAL_CATALOG_WORKSPACE_ID)
      .order('asset_category')

    if (error) throw error

    // Get unique categories
    const uniqueCategories = [...new Set(data?.map((item) => item.asset_category) || [])]

    return { data: uniqueCategories, error: null }
  } catch (error) {
    console.error('Error fetching asset categories:', error)
    return { data: null, error }
  }
}

/**
 * Get all industry tags
 */
export async function getIndustryTags(): Promise<{
  data: string[] | null
  error: any
}> {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from('assets')
      .select('industry_tags')
      .eq('workspace_id', GLOBAL_CATALOG_WORKSPACE_ID)
      .not('industry_tags', 'is', null)

    if (error) throw error

    // Flatten and get unique tags
    const allTags = data?.flatMap((item) => item.industry_tags || []) || []
    const uniqueTags = [...new Set(allTags)].sort()

    return { data: uniqueTags, error: null }
  } catch (error) {
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
): Promise<{ data: Array<{ id: string; name: string; category: string; manufacturer?: string }> | null; error: any }> {
  if (!searchQuery || searchQuery.length < 2) {
    return { data: [], error: null }
  }

  const { data, error } = await searchAssetCatalog(searchQuery, {
    categoryFilter: assetCategory,
    limit
  })

  if (error) return { data: null, error }

  // Format for autocomplete
  const formatted = data?.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    manufacturer: item.manufacturer
  }))

  return { data: formatted || [], error: null }
}

/**
 * Copy a catalog item to a user's workspace
 * (Creates a new asset based on catalog item)
 */
export async function copyCatalogItemToWorkspace(
  catalogItemId: string,
  workspaceId: string,
  userId: string,
  overrides?: Partial<CatalogAsset>
): Promise<{ data: any | null; error: any }> {
  const supabase = createClient()

  try {
    // Get the catalog item
    const { data: catalogItem, error: fetchError } = await getCatalogItem(catalogItemId)
    if (fetchError || !catalogItem) throw fetchError || new Error('Catalog item not found')

    // Create new asset in user's workspace
    const newAsset = {
      workspace_id: workspaceId,
      name: overrides?.name || catalogItem.name,
      description: overrides?.description || catalogItem.description,
      type: overrides?.type || catalogItem.type,
      asset_category: overrides?.asset_category || catalogItem.asset_category,
      category: overrides?.category || catalogItem.category,
      subcategory: overrides?.subcategory || catalogItem.subcategory,
      manufacturer: overrides?.manufacturer || catalogItem.manufacturer,
      model_number: overrides?.model_number || catalogItem.model_number,
      tags: overrides?.tags || catalogItem.tags,
      specifications: overrides?.specifications || catalogItem.specifications,
      created_by: userId,
      // Don't copy related_names and industry_tags (those are for catalog only)
    }

    const { data, error } = await supabase
      .from('assets')
      .insert(newAsset)
      .select()
      .single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error('Error copying catalog item:', error)
    return { data: null, error }
  }
}
