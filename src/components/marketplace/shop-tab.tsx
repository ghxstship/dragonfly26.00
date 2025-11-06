"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Package, Filter, Search } from "lucide-react"
import { MarketplaceCartDrawer } from "./marketplace-cart-drawer"
import { MarketplaceProductDetailDrawer, type MarketplaceProduct } from "./marketplace-product-detail-drawer"

interface ShopProduct {
  id: string
  name: string
  price?: string
  rating?: number
  status?: string
  [key: string]: any
}

interface ShopTabProps {
  data?: ShopProduct[]
  loading?: boolean
}

export function ShopTab({ data = [], loading: loadingProp = false }: ShopTabProps) {
  const { products, loading: liveLoading } = useMarketplaceData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.shop')
  const tCommon = useTranslations('common')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const productsData: ShopProduct[] = data
  const [cart, setCart] = useState<Map<string, number>>(new Map())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [view, setView] = useState<"grid" | "list">("grid")
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null)

  const addToCart = (id: string, quantity: number = 1) => {
    const newCart = new Map(cart)
    const currentQuantity = newCart.get(id) || 0
    newCart.set(id, currentQuantity + quantity)
    setCart(newCart)
    setCartDrawerOpen(true)
  }

  const updateCartQuantity = (id: string, quantity: number) => {
    const newCart = new Map(cart)
    if (quantity <= 0) {
      newCart.delete(id)
    } else {
      newCart.set(id, quantity)
    }
    setCart(newCart)
  }

  const removeFromCart = (id: string) => {
    const newCart = new Map(cart)
    newCart.delete(id)
    setCart(newCart)
  }

  const handleViewDetails = (item: Record<string, any>) => {
    setSelectedProduct(item as MarketplaceProduct)
    setDetailsDrawerOpen(true)
  }

  const handleCheckout = () => {
    alert(`Proceeding to checkout with ${cart.size} items`)
    setCartDrawerOpen(false)
  }

  // Convert cart Map to array for drawer
  const cartItems = Array.from(cart.entries()).map(([id, quantity]) => {
    const item = productsData.find((i: any) => i.id === id)
    return item ? { ...item, quantity } : null
  }).filter(Boolean) as any[]

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

  const getStockBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">In Stock</Badge>
      case "low-stock":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Low Stock</Badge>
      case "pre-order":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Pre-order</Badge>
      default:
        return <Badge variant="outline">{t('available')}</Badge>
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-wrap flex-col sm:flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
        <div className="flex-1 relative">
          <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
          <Input placeholder={t('searchProducts')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            <SelectItem value="audio">Audio Equipment</SelectItem>
            <SelectItem value="lighting">{t('lighting')}</SelectItem>
            <SelectItem value="video">{t('video')}</SelectItem>
            <SelectItem value="staging">{t('staging')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="featured">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{t('featured')}</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">{t('newest')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter aria-hidden="true" className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {productsData.map((item: any) => (
          <Card key={item.id} className="group overflow-hidden md:block hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex flex-wrap items-center justify-center">
              <Package aria-hidden="true" className="h-20 w-20 text-muted-foreground/30" />
              
              {/* Quick Actions */}
              <div className="absolute sm:relative sm:inset-auto top-2 md:top-2 right-2 md:right-2 flex flex-wrap flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart aria-hidden="true" className={`h-4 w-4 ${
                      favorites.has(item.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Status Badge */}
              {item.priority === "featured" && (
                <Badge aria-hidden="true" className="absolute sm:relative sm:inset-auto top-2 left-2 bg-purple-600 sm:relative sm:inset-auto">
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader aria-hidden="true" className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold line-clamp-2 text-sm">{item.name}</p>
                  {getStockBadge(item.status || 'available')}
                </div>
                <p className="text-xs text-muted-foreground">by {item.assignee_name}</p>
              </div>
            </CardHeader>

            <CardContent aria-hidden="true" className="p-4 pt-0 space-y-3">
              {/* Rating */}
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <div className="flex flex-wrap items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(item.rating || 0)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.rating} ({item.comments_count})
                </span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{item.price}</p>
                {item.stock && (
                  <p className="text-xs text-muted-foreground">
                    {item.stock} units available
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter aria-hidden="true" className="p-4 pt-0 gap-2">
              <Button aria-hidden="true" className="flex-1"
                onClick={() => addToCart(item.id)}
              >
                <ShoppingCart aria-hidden="true" className="h-4 w-4 mr-2" />{tCommon('add')}</Button>
              <Button variant="outline" onClick={() => handleViewDetails(item)}>{tCommon('details')}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center gap-2 pt-4">
        <Button variant="outline">{t('previous')}</Button>
        <Button variant="outline">1</Button>
        <Button variant="default">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">{t('next')}</Button>
      </div>

      {/* Cart Drawer */}
      <MarketplaceCartDrawer
        open={cartDrawerOpen}
        onOpenChange={setCartDrawerOpen}
        cartItems={cartItems}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
      />

      {/* Product Details Drawer */}
      <MarketplaceProductDetailDrawer
        product={selectedProduct}
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        onAddToCart={addToCart}
        onToggleFavorite={toggleFavorite}
        isFavorite={selectedProduct ? favorites.has(selectedProduct.id) : false}
      />
    </div>
  )
}
