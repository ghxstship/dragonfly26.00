"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Heart, ShoppingCart, Star, Search, SlidersHorizontal, Grid3x3, List } from "lucide-react"
import { MarketplaceCartDrawer } from "./marketplace-cart-drawer"
import { MarketplaceProductDetailDrawer, type MarketplaceProduct } from "./marketplace-product-detail-drawer"

interface ProductsTabProps {
  data?: any[]
  loading?: boolean
}

export function ProductsTab({ data = [], loading = false }: ProductsTabProps) {
  const t = useTranslations('marketplace.products')
  const tCommon = useTranslations('common')
  const productsData = data
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [cart, setCart] = useState<Map<string, number>>(new Map())
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null)

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(id)) {
      newFavorites.delete(id)
    } else {
      newFavorites.add(id)
    }
    setFavorites(newFavorites)
  }

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

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product as MarketplaceProduct)
    setDetailsDrawerOpen(true)
  }

  const handleCheckout = () => {
    alert(`Proceeding to checkout with ${cart.size} items`)
    setCartDrawerOpen(false)
  }

  // Convert cart Map to array for drawer
  const cartItems = Array.from(cart.entries()).map(([id, quantity]) => {
    const item = productsData.find(i => i.id === id)
    return item ? { ...item, quantity } : null
  }).filter(Boolean) as any[]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">{t('available')}</Badge>
      case "rented":
        return <Badge className="bg-blue-600">{t('rented')}</Badge>
      case "maintenance":
        return <Badge variant="outline" className="bg-orange-500/10 text-orange-600">{t('maintenance')}</Badge>
      case "reserved":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600">{t('reserved')}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('description')}
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <Input placeholder={t('searchProducts')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t('category')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('allCategories')}</SelectItem>
            <SelectItem value="audio">{t('audio')}</SelectItem>
            <SelectItem value="lighting">{t('lighting')}</SelectItem>
            <SelectItem value="video">{t('video')}</SelectItem>
            <SelectItem value="staging">{t('staging')}</SelectItem>
            <SelectItem value="rigging">{t('rigging')}</SelectItem>
            <SelectItem value="accessories">{t('accessories')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all-status">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-status">{t('allStatus')}</SelectItem>
            <SelectItem value="available">{t('available')}</SelectItem>
            <SelectItem value="rented">{t('rented')}</SelectItem>
            <SelectItem value="reserved">{t('reserved')}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <SlidersHorizontal className="h-4 w-4 mr-2" aria-hidden="true" />{t('moreFilters')}</Button>
      </div>

      {/* Products Grid */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
        {productsData.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            {viewMode === "grid" ? (
              <>
                {/* Product Image */}
                <div className="relative aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <Package className="h-20 w-20 text-muted-foreground/30" aria-hidden="true" />
                  
                  {/* Quick Actions */}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.has(product.id) ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                  </Button>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    {getStatusBadge(product.status)}
                  </div>
                </div>

                <CardHeader className="p-4">
                  <div className="space-y-2">
                    <p className="font-semibold line-clamp-2 text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">by {product.assignee_name}</p>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(parseFloat(product.rating || "0"))
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">{product.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <p className="text-xl font-bold">{product.price}</p>
                    {product.rental_rate && (
                      <p className="text-xs text-muted-foreground">
                        Rental: {product.rental_rate}
                      </p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 gap-2">
                  <Button className="flex-1" onClick={() => addToCart(product.id)}>
                    <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />{tCommon('add')}</Button>
                  <Button variant="outline" onClick={() => handleViewDetails(product)}>{tCommon('details')}</Button>
                </CardFooter>
              </>
            ) : (
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded flex items-center justify-center flex-shrink-0">
                      <Package className="h-12 w-12 text-muted-foreground/30" aria-hidden="true" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-xs text-muted-foreground">by {product.assignee_name}</p>
                        </div>
                        {getStatusBadge(product.status)}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(parseFloat(product.rating || "0"))
                                  ? "fill-yellow-500 text-yellow-500"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">{product.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-bold">{product.price}</p>
                        {product.rental_rate && (
                          <p className="text-xs text-muted-foreground">Rental: {product.rental_rate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => addToCart(product.id)}>
                      <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />{tCommon('add')}</Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)}>{tCommon('details')}</Button>
                  </div>
                </div>
              </CardHeader>
            )}
          </Card>
        ))}
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
