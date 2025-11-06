"use client"

import { useState } from "react"
import Image from "next/image"
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
      <DialogContent aria-hidden="true" className="max-w-4xl px-4 sm:px-6 lg:px-8 max-h-[90vh] p-0">
        <div className="grid md:grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: Images */}
          <div className="bg-muted/30 p-4 sm:p-6">
            <div className="aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg flex flex-wrap items-center justify-center relative overflow-hidden md:block">
              {images[imageIndex] ? (
                <Image
                  src={images[imageIndex]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Package aria-hidden="true" className="h-32 w-32 text-muted-foreground/30" />
              )}
            </div>

            {/* Image thumbnails */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {images.map((img: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center ${
                      idx === imageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {img ? (
                      <div className="relative w-full h-full max-w-full">
                        <Image src={img} alt="" fill className="object-cover rounded-lg" sizes="64px" />
                      </div>
                    ) : (
                      <Package aria-hidden="true" className="h-8 w-8 text-muted-foreground/30" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <ScrollArea aria-hidden="true" className="max-h-[90vh]">
            <div className="p-4 sm:p-6 space-y-3 md:space-y-4 lg:space-y-6">
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    {product.category && (
                      <Badge variant="secondary">{product.category}</Badge>
                    )}
                    <h2 className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold leading-tight">
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
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                    <div className="flex flex-wrap items-center">
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
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl font-bold">
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
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus aria-hidden="true" className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus aria-hidden="true" className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button aria-hidden="true" className="flex-1"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart aria-hidden="true" className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleViewFullDetails}
                >
                  <Eye aria-hidden="true" className="h-4 w-4 mr-2" />
                  Full Details
                </Button>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <>
                  <Separator />
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag: any) => (
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
