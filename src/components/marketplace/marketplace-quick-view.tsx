"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Package, 
  ShoppingCart, 
  Heart, 
  Star,
  Eye,
  ExternalLink,
  Plus,
  Minus
} from "lucide-react"
import { VariantSelector, type ProductVariant, type ProductOption } from "./marketplace-variant-selector"
import { InventoryBadge } from "./marketplace-inventory-badge"
import { WishlistButton } from "./marketplace-wishlist-button"

interface QuickViewProduct {
  id: string
  name: string
  description?: string
  price: string | number
  rating?: string | number
  status: string
  assignee_name?: string
  category?: string
  stock_quantity?: number
  rental_rate?: string
  tags?: string[]
  images?: string[]
  // New Shopify fields
  compare_at_price?: number
  variants?: ProductVariant[]
  options?: ProductOption[]
}

interface QuickViewProps {
  product: QuickViewProduct | null
  open: boolean
  onClose: () => void
  onAddToCart?: (productId: string, quantity: number, variantId?: string) => void
  onViewFullDetails?: (productId: string) => void
}

export function QuickView({
  product,
  open,
  onClose,
  onAddToCart,
  onViewFullDetails
}: QuickViewProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [imageIndex, setImageIndex] = useState(0)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart?.(product.id, quantity, selectedVariant?.id)
    // Show success feedback or close
  }

  const handleViewFullDetails = () => {
    onViewFullDetails?.(product.id)
    onClose()
  }

  const currentPrice = selectedVariant?.price ?? (typeof product.price === 'number' ? product.price : parseFloat(product.price.replace(/[^0-9.-]+/g, "")))
  const comparePrice = selectedVariant?.compare_at_price ?? product.compare_at_price

  const images = product.images && product.images.length > 0 ? product.images : [null]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: Images */}
          <div className="bg-muted/30 p-6">
            <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              {images[imageIndex] ? (
                <img
                  src={images[imageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="h-32 w-32 text-muted-foreground/30" />
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center ${
                      idx === imageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {img ? (
                      <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    {product.category && (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                    <h2 className="text-2xl font-bold leading-tight">
                      {product.name}
                    </h2>
                  </div>
                  <WishlistButton 
                    productId={product.id}
                    productName={product.name}
                    variant="icon"
                  />
                </div>

                {/* Vendor */}
                {product.assignee_name && (
                  <p className="text-sm text-muted-foreground">
                    by <span className="font-medium">{product.assignee_name}</span>
                  </p>
                )}

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(parseFloat(product.rating?.toString() || "0"))
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} rating
                    </span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold">
                    ${currentPrice.toFixed(2)}
                  </span>
                  {comparePrice && comparePrice > currentPrice && (
                    <>
                      <span className="text-lg text-muted-foreground line-through">
                        ${comparePrice.toFixed(2)}
                      </span>
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        Save ${(comparePrice - currentPrice).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>
                {product.rental_rate && (
                  <p className="text-sm text-muted-foreground">
                    Rental: {product.rental_rate}
                  </p>
                )}
              </div>

              {/* Variants */}
              {product.options && product.options.length > 0 && product.variants && (
                <>
                  <Separator />
                  <VariantSelector
                    productId={product.id}
                    options={product.options}
                    variants={product.variants}
                    onVariantChange={setSelectedVariant}
                  />
                </>
              )}

              {/* Inventory */}
              <InventoryBadge
                inventoryQuantity={selectedVariant?.inventory_quantity ?? product.stock_quantity}
                lowStockThreshold={10}
                showQuantity={true}
              />

              {/* Description */}
              {product.description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold">Description</h3>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {product.description}
                    </p>
                  </div>
                </>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button 
                  className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewFullDetails}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Full Details
                </Button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
