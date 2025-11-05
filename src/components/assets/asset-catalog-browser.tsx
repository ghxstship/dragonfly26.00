'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Search, Plus, Filter, Grid, List } from 'lucide-react'
import { useCatalogSearch, useCatalogCategories } from '@/hooks/use-asset-catalog'
import { useCatalogAssets } from '@/hooks/use-catalog-assets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AssetCatalogBrowserProps {
  workspaceId: string
  userId: string
  onAssetAdded?: (assetId: string) => void
}

export function AssetCatalogBrowser({
  workspaceId,
  userId,
  onAssetAdded
}: AssetCatalogBrowserProps): JSX.Element {
  const t = useTranslations('assets.catalog')
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>()
  
  const { query, setQuery, results, loading } = useCatalogSearch('', {
    categoryFilter,
    debounceMs: 300
  })
  
  const { categories } = useCatalogCategories()
  const { createFromCatalog, isCreatingFromCatalog } = useCatalogAssets(workspaceId)

  const handleAddToCatalog = async (catalogItemId: string) => {
    try {
      const asset = await createFromCatalog({
        catalogItemId,
        userId
      })
      
      if (onAssetAdded && asset?.id) {
        onAssetAdded(asset.id)
      }
      
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding asset from catalog:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" aria-hidden="true" />
          {t('addFromCatalog')}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('browseCatalog')}</DialogTitle>
          <DialogDescription>
            {t('browseCatalogDescription')}
          </DialogDescription>
        </DialogHeader>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
                aria-label={t('searchLabel')}
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                <SelectValue placeholder={t('allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat.item_count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
                aria-label={t('gridView')}
              >
                <Grid className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
                aria-label={t('listView')}
              >
                <List className="w-4 h-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              {t('loading')}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {query ? t('noResults') : t('startSearching')}
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'space-y-4'
            }>
              {results.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                >
                  {/* Image */}
                  {item.thumbnail_url && (
                    <Image
                      src={item.thumbnail_url}
                      alt={item.name}
                      width={400}
                      height={128}
                      className="w-full h-32 object-cover rounded-md mb-3"
                    />
                  )}

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h3>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                      {item.category && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {item.category}
                        </span>
                      )}
                      {item.manufacturer && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {item.manufacturer}
                        </span>
                      )}
                    </div>

                    {/* Pricing */}
                    {item.estimated_rental_daily && (
                      <div className="text-sm text-gray-700 dark:text-gray-300">
                        ${item.estimated_rental_daily}/{t('day')}
                      </div>
                    )}

                    {/* Add Button */}
                    <Button
                      onClick={() => handleAddToCatalog(item.id)}
                      disabled={isCreatingFromCatalog}
                      className="w-full mt-2"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
                      {t('addToInventory')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
