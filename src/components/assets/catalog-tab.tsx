"use client"

import { useTranslations } from 'next-intl'
import { useState, useEffect } from "react"
import { BookOpen, Search, Filter, Plus, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card"
import { 
  useCatalogSearch, 
  useCatalogCategories, 
  useCatalogStatistics,
  useAssetCategories 
} from "@/hooks/use-asset-catalog"
import { DataTableOrganism } from "@/components/organisms"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { copyCatalogItemToWorkspace } from "@/lib/api/asset-catalog"
import { useUIStore } from "@/store/ui-store"
import { createClient } from "@/lib/supabase/client"

interface CatalogTabProps {
  data: Record<string, unknown>[]
  loading: boolean
  workspaceId: string
}

export function CatalogTab({ data, loading, workspaceId }: CatalogTabProps) {
  const t = useTranslations('production.assets.catalog')
  const tCommon = useTranslations('common')
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>()
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null)
  
  const { currentWorkspace } = useUIStore()
  const supabase = createClient()
  const [userId, setUserId] = useState<string>('')
  
  // Get user ID
  useEffect(() => {
    async function getCurrentUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setUserId(user.id)
    }
    getCurrentUser()
  }, [])

  // Get catalog statistics
  const { statistics } = useCatalogStatistics()
  
  // Get asset categories for filtering
  const { categories: assetCategories } = useAssetCategories()

  // Use search when query exists, otherwise show all catalog data
  const { 
    query, 
    setQuery, 
    results: searchResults, 
    loading: searchLoading 
  } = useCatalogSearch(searchQuery, {
    categoryFilter,
    debounceMs: 300
  })

  // Determine which data to display
  const displayData = searchQuery.length >= 2 ? searchResults : data
  const isLoading = searchQuery.length >= 2 ? searchLoading : loading

  // Handle copying item to workspace
  const handleCopyToWorkspace = async (catalogItem: any) => {
    if (!currentWorkspace?.id || !userId) return
    
    try {
      const { data: copiedItem, error } = await copyCatalogItemToWorkspace(
        catalogItem.id,
        currentWorkspace.id,
        userId
      )
      
      if (error) throw error
      
      setCopiedItemId(catalogItem.id)
      setTimeout(() => setCopiedItemId(null), 2000)
      
      console.log('Item copied to workspace:', copiedItem)
    } catch (err: any) {
      console.error('Failed to copy item:', err)
      alert('Failed to copy item to workspace')
    }
  }

  // Schema for catalog table view
  const catalogSchema: Record<string, unknown>[] = [
    { 
      id: 'name', 
      name: 'name', 
      label: 'Item Name', 
      type: 'text',
      render: (value: string, item: any) => (
        <div>
          <div className="font-medium">{value as any}</div>
          {item.manufacturer && (
            <div className="text-xs text-muted-foreground">{item.manufacturer}</div>
          )}
        </div>
      )
    },
    { 
      id: 'asset_category', 
      name: 'asset_category', 
      label: 'Asset Category', 
      type: 'text',
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value?.replace(/_/g, ' ')}
        </Badge>
      )
    },
    { 
      id: 'category', 
      name: 'category', 
      label: 'Category', 
      type: 'text' 
    },
    { 
      id: 'subcategory', 
      name: 'subcategory', 
      label: 'Subcategory', 
      type: 'text',
      render: (value: string) => value || '-'
    },
    { 
      id: 'model_number', 
      name: 'model_number', 
      label: 'Model #', 
      type: 'text',
      render: (value: string) => value || '-'
    },
    { 
      id: 'tags', 
      name: 'tags', 
      label: 'Tags', 
      type: 'array',
      render: (value: string[]) => value?.length ? (
        <div className="flex flex-col sm:flex-row gap-1 flex-wrap">
          {value.slice(0, 3).map((tag: any, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{value.length - 3}
            </Badge>
          )}
        </div>
      ) : '-'
    },
    {
      id: 'actions',
      name: 'actions',
      label: 'Actions',
      type: 'custom',
      render: (_: Record<string, unknown>, item: Record<string, unknown>) => (
        <Button
          size="sm"
          variant={copiedItemId === item.id ? "default" : "outline"}
          onClick={() => handleCopyToWorkspace(item)}
          disabled={copiedItemId === item.id}
        >
          <Copy className="h-4 w-4 mr-1" aria-hidden="true" />
          {copiedItemId === item.id ? 'Copied!' : 'Copy to Inventory'}
        </Button>
      )
    }
  ]

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-2 md:gap-3 lg:gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('totalItems')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{statistics?.total_items || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Asset Categories</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{statistics?.asset_categories || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categories</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{statistics?.categories || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Manufacturers</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{statistics?.manufacturers || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('assets.catalog.searchPlaceholder')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter as any} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full max-w-[200px]">
                <SelectValue placeholder={t('assets.catalog.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {assetCategories.map((cat: any) => (
                  <SelectItem key={cat} value={cat as any} className="capitalize">
                    {cat.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchQuery || categoryFilter) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery("")
                  setCategoryFilter(undefined)
                }}
              >
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {searchQuery.length >= 2 
              ? `Found ${displayData.length} items matching "${searchQuery}"`
              : displayData.length === 0
              ? "No items in catalog. Add items to get started."
              : `Showing ${displayData.length} catalog items`
            }
          </p>
        </CardContent>
      </Card>

      {/* Catalog Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                Asset Catalog
              </CardTitle>
              <CardDescription>
                Browse and copy items from the global asset catalog to your inventory
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Request New Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTableOrganism
            data={displayData}
            columns={catalogSchema as any}
            loading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
    </main>
  )
}
