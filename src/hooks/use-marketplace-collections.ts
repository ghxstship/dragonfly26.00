import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ProductCollection {
  id: string
  workspace_id: string
  title: string
  description: string | null
  handle: string
  collection_type: 'manual' | 'smart'
  conditions: any | null
  image_url: string | null
  sort_order: string
  seo_title: string | null
  seo_description: string | null
  published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  product_count?: number
}

export function useCollections(workspaceId?: string) {
  const [collections, setCollections] = useState<ProductCollection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  const fetchCollections = async () => {
    try {
      setLoading(true)

      let query = supabase
        .from('product_collections')
        .select(`
          *,
          collection_products (count)
        `)
        .eq('published', true)
        .order('title', { ascending: true })

      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      // Map the count to product_count
      const collectionsWithCounts = data?.map(collection => ({
        ...collection,
        product_count: collection.collection_products?.[0]?.count || 0
      })) || []

      setCollections(collectionsWithCounts)
      return collectionsWithCounts
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getCollectionProducts = async (collectionId: string) => {
    try {
      setLoading(true)

      const { data, error: fetchError } = await supabase
        .from('collection_products')
        .select(`
          position,
          featured,
          product:marketplace_products (*)
        `)
        .eq('collection_id', collectionId)
        .order('position', { ascending: true })

      if (fetchError) throw fetchError

      return data?.map(item => ({
        ...item.product,
        featured: item.featured,
        position: item.position
      })) || []
    } catch (err: any) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getProductCollections = async (productId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('collection_products')
        .select(`
          collection:product_collections (*)
        `)
        .eq('product_id', productId)

      if (fetchError) throw fetchError

      return data?.map(item => item.collection).filter(Boolean) || []
    } catch (err: any) {
      setError(err as Error)
      return []
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [workspaceId])

  return {
    collections,
    loading,
    error,
    fetchCollections,
    getCollectionProducts,
    getProductCollections
  }
}
