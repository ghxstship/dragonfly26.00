"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Layers, ChevronRight, Sparkles } from "lucide-react"

export interface ProductCollection {
  id: string
  title: string
  description: string | null
  handle: string
  image_url: string | null
  product_count: number
  collection_type: 'manual' | 'smart'
  published: boolean
  seo_title: string | null
  seo_description: string | null
}

interface CollectionBrowserProps {
  collections?: ProductCollection[]
  selectedCollectionId?: string | null
  onCollectionSelect?: (collection: ProductCollection | null) => void
  variant?: 'cards' | 'list' | 'chips'
  showAllOption?: boolean
  className?: string
}

export function CollectionBrowser({
  collections = [],
  selectedCollectionId,
  onCollectionSelect,
  variant = 'cards',
  showAllOption = true,
  className
}: CollectionBrowserProps) {
  const [selected, setSelected] = useState<string | null>(selectedCollectionId || null)

  // Mock collections if none provided
  const mockCollections: ProductCollection[] = collections.length > 0 ? collections : [
    {
      id: '1',
      title: 'Audio Equipment',
      description: 'Professional microphones, speakers, and audio gear',
      handle: 'audio-equipment',
      image_url: null,
      product_count: 45,
      collection_type: 'manual',
      published: true,
      seo_title: null,
      seo_description: null
    },
    {
      id: '2',
      title: 'Lighting Solutions',
      description: 'LED fixtures, moving heads, and lighting control',
      handle: 'lighting-solutions',
      image_url: null,
      product_count: 38,
      collection_type: 'manual',
      published: true,
      seo_title: null,
      seo_description: null
    },
    {
      id: '3',
      title: 'Best Sellers',
      description: 'Most popular products this month',
      handle: 'best-sellers',
      image_url: null,
      product_count: 24,
      collection_type: 'smart',
      published: true,
      seo_title: null,
      seo_description: null
    },
    {
      id: '4',
      title: 'Video Production',
      description: 'Cameras, projectors, and video equipment',
      handle: 'video-production',
      image_url: null,
      product_count: 31,
      collection_type: 'manual',
      published: true,
      seo_title: null,
      seo_description: null
    },
    {
      id: '5',
      title: 'Staging & Rigging',
      description: 'Truss, staging, and rigging hardware',
      handle: 'staging-rigging',
      image_url: null,
      product_count: 27,
      collection_type: 'manual',
      published: true,
      seo_title: null,
      seo_description: null
    },
    {
      id: '6',
      title: 'New Arrivals',
      description: 'Recently added products',
      handle: 'new-arrivals',
      image_url: null,
      product_count: 15,
      collection_type: 'smart',
      published: true,
      seo_title: null,
      seo_description: null
    }
  ]

  const handleSelect = (collection: ProductCollection | null) => {
    const collectionId = collection?.id || null
    setSelected(collectionId)
    onCollectionSelect?.(collection)
  }

  if (variant === 'chips') {
    return (
      <ScrollArea className={className}>
        <div className="flex flex-wrap gap-2 pb-2">
          {showAllOption && (
            <Button
              variant={selected === null ? "default" : "outline"}
              size="sm"
              onClick={() => handleSelect(null)}
              className="flex-shrink-0"
            >
              All Products
            </Button>
          )}
          {mockCollections.map((collection: any) => (
            <Button
              key={collection.id}
              variant={selected === collection.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleSelect(collection)}
              className="flex-shrink-0"
            >
              {collection.collection_type === 'smart' && (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              {collection.title}
              <Badge variant="secondary" className="ml-2">
                {collection.product_count}
              </Badge>
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    )
  }

  if (variant === 'list') {
    return (
      <div className={className}>
        {showAllOption && (
          <Button
            variant={selected === null ? "secondary" : "ghost"}
            className="w-full justify-between mb-1 max-w-full"
            onClick={() => handleSelect(null)}
          >
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>All Collections</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        {mockCollections.map((collection: any) => (
          <Button
            key={collection.id}
            variant={selected === collection.id ? "secondary" : "ghost"}
            className="w-full justify-between mb-1 max-w-full"
            onClick={() => handleSelect(collection)}
          >
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 flex-1 min-w-0">
              {collection.collection_type === 'smart' && (
                <Sparkles className="h-4 w-4 flex-shrink-0 text-purple-500" />
              )}
              <span className="truncate">{collection.title}</span>
            </div>
            <Badge variant="secondary" className="flex-shrink-0">
              {collection.product_count}
            </Badge>
          </Button>
        ))}
      </div>
    )
  }

  // Cards variant
  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {showAllOption && (
          <Card
            className={`cursor-pointer transition-all hover:shadow-md ${
              selected === null ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(null)}
          >
            <CardHeader className="pb-3">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <Layers className="h-5 w-5 text-muted-foreground" />
                <Badge variant="secondary">All</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-base mb-1">All Products</CardTitle>
              <CardDescription className="text-xs">
                Browse all available products
              </CardDescription>
            </CardContent>
          </Card>
        )}
        
        {mockCollections.map((collection: any) => (
          <Card
            key={collection.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selected === collection.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => handleSelect(collection)}
          >
            {collection.image_url && (
              <div className="h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex flex-wrap items-center justify-center">
                <Layers className="h-12 w-12 text-muted-foreground/20" />
              </div>
            )}
            <CardHeader className="pb-3">
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  {collection.collection_type === 'smart' && (
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  )}
                  <CardTitle className="text-base line-clamp-1">
                    {collection.title}
                  </CardTitle>
                </div>
                <Badge variant="secondary">
                  {collection.product_count}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs line-clamp-2">
                {collection.description || 'Curated product collection'}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
