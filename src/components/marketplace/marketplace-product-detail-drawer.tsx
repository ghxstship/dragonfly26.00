"use client"

import { useState } from "react"
import { X, ShoppingCart, Heart, Share2, Star, Package, MapPin, Award, MessageCircle, Plus, Minus } from "lucide-react"
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { VariantSelector, type ProductVariant, type ProductOption } from "./marketplace-variant-selector"
import { InventoryBadge } from "./marketplace-inventory-badge"
import { WishlistButton } from "./marketplace-wishlist-button"
import { ReviewForm } from "./marketplace-review-form"

export interface MarketplaceProduct {
  id: string
  name: string
  description?: string
  price: string
  rating?: string
  comments_count?: number
  status: string
  assignee_name?: string
  category?: string
  stock?: string
  stock_quantity?: number
  rental_rate?: string
  tags?: string[]
  priority?: string
  specifications?: Record<string, string>
  features?: string[]
  reviews?: Array<{
    id: string
    author: string
    rating: number
    comment: string
    date: string
  }>
  // New Shopify fields
  variants?: ProductVariant[]
  options?: ProductOption[]
  compare_at_price?: number
  orderId?: string
}

interface MarketplaceProductDetailDrawerProps {
  product: MarketplaceProduct | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddToCart?: (productId: string, quantity: number) => void
  onToggleFavorite?: (productId: string) => void
  isFavorite?: boolean
}

export function MarketplaceProductDetailDrawer({
  product,
  open,
  onOpenChange,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: MarketplaceProductDetailDrawerProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [reviewFormOpen, setReviewFormOpen] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart?.(product.id, quantity)
  }

  const handleReviewSubmit = async (review: any) => {
    // In real implementation, submit to product_reviews table
    console.log('Review submitted:', review)
  }

  const getStockBadge = (status: string) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">In Stock</Badge>
      case "low-stock":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Low Stock</Badge>
      case "pre-order":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">Pre-order</Badge>
      case "available":
        return <Badge className="bg-green-600">Available</Badge>
      case "rented":
        return <Badge className="bg-blue-600">Rented</Badge>
      case "reserved":
        return <Badge variant="outline" className="bg-purple-500/10 text-purple-600">Reserved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] max-w-full p-0 flex flex-wrap flex-col max-w-full">
        {/* Header */}
        <SheetHeader className="border-b px-4 md:px-6 py-4">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Package className="h-5 w-5" />
              <h2 className="text-base md:text-lg lg:text-xl font-semibold">Product Details</h2>
            </div>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <WishlistButton
                productId={product.id}
                productName={product.name}
                variant="icon"
              />
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 sm:p-6 space-y-3 md:space-y-4 lg:space-y-6">
            {/* Product Image */}
            <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex flex-wrap items-center justify-center relative">
              <Package className="h-32 w-32 text-muted-foreground/30" />
              {product.priority === "featured" && (
                <Badge className="absolute sm:relative sm:inset-auto top-4 left-4 bg-purple-600 sm:relative sm:inset-auto">
                  Featured
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4">
                  <h1 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{product.name}</h1>
                  {getStockBadge(product.status)}
                </div>
                {product.category && (
                  <Badge variant="secondary">{product.category}</Badge>
                )}
              </div>

              {/* Vendor Info */}
              {product.assignee_name && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {product.assignee_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{product.assignee_name}</p>
                    <p className="text-xs text-muted-foreground">Seller</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              )}

              {/* Rating */}
              {product.rating && (
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(parseFloat(product.rating || "0"))
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.comments_count || 0} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xl md:text-2xl lg:text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-4xl font-bold">{product.price}</span>
                  {product.rental_rate && (
                    <span className="text-muted-foreground">/ purchase</span>
                  )}
                </div>
                {product.rental_rate && (
                  <p className="text-sm text-muted-foreground">
                    Rental: {product.rental_rate} per day
                  </p>
                )}
              </div>

              {/* Product Variants */}
              {product.options && product.options.length > 0 && product.variants && (
                <VariantSelector
                  productId={product.id}
                  options={product.options}
                  variants={product.variants}
                  onVariantChange={setSelectedVariant}
                />
              )}

              {/* Inventory Status */}
              <InventoryBadge
                inventoryQuantity={selectedVariant?.inventory_quantity ?? product.stock_quantity}
                lowStockThreshold={10}
                showQuantity={true}
              />

              {/* Quantity and Add to Cart */}
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="flex-1" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full max-w-full">
              <TabsList className="w-full max-w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="specs" className="flex-1">Specifications</TabsTrigger>
                <TabsTrigger value="reviews" className="flex-1">
                  Reviews ({product.comments_count || 0})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {product.description || "No description available for this product."}
                  </p>

                  {product.features && product.features.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Key Features:</h3>
                      <ul className="space-y-2">
                        {product.features.map((feature: any, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <Award className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.tags && product.tags.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Tags:</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag: any, idx: number) => (
                          <Badge key={idx} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="specs" className="space-y-4 mt-4">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-start justify-between py-2 border-b last:border-0">
                        <span className="text-sm font-medium text-muted-foreground">{key}</span>
                        <span className="text-sm text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No specifications available.</p>
                )}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setReviewFormOpen(true)}
                  className="w-full max-w-full"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>

                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review: any) => (
                      <div key={review.id} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {review.author.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-sm">{review.author}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-500 text-yellow-500"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 md:py-6 lg:py-8 space-y-2">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">No reviews yet</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>

      {/* Review Form Modal */}
      <ReviewForm
        productId={product.id}
        productName={product.name}
        orderId={product.orderId}
        open={reviewFormOpen}
        onClose={() => setReviewFormOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </Sheet>
  )
}
