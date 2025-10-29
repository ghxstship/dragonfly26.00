"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Wishlist {
  id: string
  name: string
  description: string | null
  item_count: number
  is_public: boolean
}

interface WishlistButtonProps {
  productId: string
  productName?: string
  wishlists?: Wishlist[]
  productWishlistIds?: string[] // IDs of wishlists this product is in
  variant?: 'icon' | 'button'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onWishlistUpdate?: (wishlistIds: string[]) => void
}

export function WishlistButton({
  productId,
  productName,
  wishlists = [],
  productWishlistIds = [],
  variant = 'icon',
  size = 'md',
  className,
  onWishlistUpdate
}: WishlistButtonProps) {
  const t = useTranslations()
  const [isInWishlists, setIsInWishlists] = useState<Set<string>>(
    new Set(productWishlistIds)
  )
  const [showNewWishlistDialog, setShowNewWishlistDialog] = useState(false)
  const [newWishlistName, setNewWishlistName] = useState('')
  const [newWishlistDescription, setNewWishlistDescription] = useState('')

  // Mock wishlists if none provided
  const mockWishlists: Wishlist[] = wishlists.length > 0 ? wishlists : [
    { id: '1', name: 'My Wishlist', description: null, item_count: 5, is_public: false },
    { id: '2', name: 'Production Gear', description: 'Equipment for upcoming shows', item_count: 12, is_public: false },
    { id: '3', name: 'Gift Ideas', description: null, item_count: 3, is_public: true },
  ]

  const isInAnyWishlist = isInWishlists.size > 0

  const toggleWishlist = (wishlistId: string) => {
    const newSet = new Set(isInWishlists)
    if (newSet.has(wishlistId)) {
      newSet.delete(wishlistId)
    } else {
      newSet.add(wishlistId)
    }
    setIsInWishlists(newSet)
    onWishlistUpdate?.(Array.from(newSet))
  }

  const handleCreateWishlist = () => {
    if (!newWishlistName.trim()) return

    // In real implementation, create wishlist in database
    const newWishlist: Wishlist = {
      id: `new-${Date.now()}`,
      name: newWishlistName,
      description: newWishlistDescription || null,
      item_count: 1,
      is_public: false
    }

    // Add to this wishlist
    const newSet = new Set(isInWishlists)
    newSet.add(newWishlist.id)
    setIsInWishlists(newSet)
    onWishlistUpdate?.(Array.from(newSet))

    // Reset and close
    setNewWishlistName('')
    setNewWishlistDescription('')
    setShowNewWishlistDialog(false)
  }

  if (variant === 'icon') {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'icon'}
              className={cn("relative", className)}
            >
              <Heart
                className={cn(
                  size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
                  isInAnyWishlist && "fill-red-500 text-red-500"
                )}
              />
              {isInWishlists.size > 1 && (
                <Badge
                  variant="secondary"
                  className="absolute sm:relative sm:inset-auto -top-2 md:top-1 -right-2 md:right-1 h-4 w-4 p-0 flex items-center justify-center text-xs"
                >
                  {isInWishlists.size}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {productName ? `Add "${productName}" to` : 'Add to wishlist'}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockWishlists.map((wishlist: any) => (
              <DropdownMenuItem
                key={wishlist.id}
                onClick={() => toggleWishlist(wishlist.id)}
                className="flex flex-col sm:flex-row flex-col md:flex-row items-center justify-between cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{wishlist.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {wishlist.item_count} {wishlist.item_count === 1 ? 'item' : 'items'}
                  </p>
                </div>
                {isInWishlists.has(wishlist.id) && (
                  <Check className="h-4 w-4 ml-2 flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowNewWishlistDialog(true)}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Wishlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={showNewWishlistDialog} onOpenChange={setShowNewWishlistDialog}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Wishlist</DialogTitle>
              <DialogDescription>
                Create a new wishlist to organize your favorite products
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="wishlist-name">Wishlist Name *</Label>
                <Input
                  id="wishlist-name"
                  placeholder="e.g., Summer Tour Equipment"
                  value={newWishlistName as any}
                  onChange={(e) => setNewWishlistName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wishlist-description">Description (Optional)</Label>
                <Input
                  id="wishlist-description"
                  placeholder={t('marketplace.wishlist.descriptionPlaceholder')}
                  value={newWishlistDescription as any}
                  onChange={(e) => setNewWishlistDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewWishlistDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleCreateWishlist}
                disabled={!newWishlistName.trim()}
              >
                Create & Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Button variant
  const buttonSize = size === 'md' ? 'default' : size as 'sm' | 'lg'
  return (
    <Button
      variant={isInAnyWishlist ? "secondary" : "outline"}
      size={buttonSize}
      className={className}
      onClick={() => {
        // Quick toggle for first wishlist or default
        const defaultWishlistId = mockWishlists[0]?.id
        if (defaultWishlistId) {
          toggleWishlist(defaultWishlistId)
        }
      }}
    >
      <Heart
        className={cn(
          "mr-2",
          size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
          isInAnyWishlist && "fill-red-500 text-red-500"
        )}
      />
      {isInAnyWishlist ? 'Saved' : 'Save to Wishlist'}
    </Button>
  )
}
