/**
 * React hooks for the global asset catalog
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  searchAssetCatalog,
  browseCatalogByCategory,
  getCatalogCategories,
  getCatalogStatistics,
  getItemsByAssetCategory,
  getAssetCategories,
  getIndustryTags,
  autocompleteAssetSearch,
  type CatalogAsset,
  type CatalogSearchResult
} from '@/lib/api/asset-catalog'

/**
 * Hook for searching the asset catalog with debouncing
 */
export function useCatalogSearch(
  initialQuery: string = '',
  options?: {
    categoryFilter?: string
    industryFilter?: string
    debounceMs?: number
  }
) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<CatalogSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  // Debounced search
  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const { data, error } = await searchAssetCatalog(query, {
        categoryFilter: options?.categoryFilter,
        industryFilter: options?.industryFilter
      })

      if (error) {
        setError(error)
      } else {
        setResults(data || [])
      }
      setLoading(false)
    }, options?.debounceMs || 300)

    return () => clearTimeout(timer)
  }, [query, options?.categoryFilter, options?.industryFilter, options?.debounceMs])

  return {
    query,
    setQuery,
    results,
    loading,
    error
  }
}

/**
 * Hook for autocomplete in forms
 */
export function useCatalogAutocomplete(
  assetCategory?: string,
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Array<{
    id: string
    name: string
    category: string
    manufacturer?: string
  }>>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    const timer = setTimeout(async () => {
      const { data } = await autocompleteAssetSearch(query, assetCategory)
      setSuggestions(data || [])
      setLoading(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, assetCategory, debounceMs])

  return {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions: () => setSuggestions([])
  }
}

/**
 * Hook for browsing catalog by category
 */
export function useCatalogBrowse(category?: string, subcategory?: string) {
  const [items, setItems] = useState<CatalogAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchItems() {
      setLoading(true)
      const { data, error } = await browseCatalogByCategory(category, subcategory)

      if (error) {
        setError(error)
      } else {
        setItems(data || [])
      }
      setLoading(false)
    }

    fetchItems()
  }, [category, subcategory])

  return { items, loading, error }
}

/**
 * Hook for getting catalog categories
 */
export function useCatalogCategories() {
  const [categories, setCategories] = useState<Array<{
    asset_category: string
    category: string
    subcategory: string
    item_count: number
  }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await getCatalogCategories()

      if (error) {
        setError(error)
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

/**
 * Hook for getting catalog statistics
 */
export function useCatalogStatistics() {
  const [statistics, setStatistics] = useState<{
    total_items: number
    asset_categories: number
    categories: number
    subcategories: number
    manufacturers: number
    total_related_names: number
    avg_related_names_per_item: number
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchStatistics() {
      const { data, error } = await getCatalogStatistics()

      if (error) {
        setError(error)
      } else {
        setStatistics(data)
      }
      setLoading(false)
    }

    fetchStatistics()
  }, [])

  return { statistics, loading, error }
}

/**
 * Hook for getting items by asset category
 */
export function useCatalogItemsByCategory(assetCategory: string) {
  const [items, setItems] = useState<CatalogAsset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchItems() {
      if (!assetCategory) return

      setLoading(true)
      const { data, error } = await getItemsByAssetCategory(assetCategory)

      if (error) {
        setError(error)
      } else {
        setItems(data || [])
      }
      setLoading(false)
    }

    fetchItems()
  }, [assetCategory])

  return { items, loading, error }
}

/**
 * Hook for getting all asset categories
 */
export function useAssetCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await getAssetCategories()

      if (error) {
        setError(error)
      } else {
        setCategories(data || [])
      }
      setLoading(false)
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

/**
 * Hook for getting industry tags
 */
export function useIndustryTags() {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    async function fetchTags() {
      const { data, error } = await getIndustryTags()

      if (error) {
        setError(error)
      } else {
        setTags(data || [])
      }
      setLoading(false)
    }

    fetchTags()
  }, [])

  return { tags, loading, error }
}

/**
 * Hook for catalog search with filters
 */
export function useCatalogFilters() {
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  const [industryFilter, setIndustryFilter] = useState<string | undefined>()
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | undefined>()

  const clearFilters = useCallback(() => {
    setCategoryFilter(undefined)
    setIndustryFilter(undefined)
    setSubcategoryFilter(undefined)
  }, [])

  return {
    categoryFilter,
    setCategoryFilter,
    industryFilter,
    setIndustryFilter,
    subcategoryFilter,
    setSubcategoryFilter,
    clearFilters
  }
}
