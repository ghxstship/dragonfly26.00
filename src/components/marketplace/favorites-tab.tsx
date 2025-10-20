"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Eye, X, Package } from "lucide-react"
import { useWishlists } from "@/hooks/use-marketplace-wishlists"

interface FavoriteItem {
  id: string
  name: string
  price: number
  image?: string
  rating?: number
  availability?: string
  [key: string]: any
}

interface FavoritesTabProps {
  data?: FavoriteItem[]
  loading?: boolean
}

export function FavoritesTab({ data = [], loading: loadingProp = false }: FavoritesTabProps) {
  const { wishlists, loading: liveLoading } = useWishlists()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.favorites')
  const tCommon = useTranslations('common')
  const [favorites, setFavorites] = useState<FavoriteItem[]>(data)

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id))
  }

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">{t('available')}</Badge>
      case "low-stock":
        return <Badge className="bg-yellow-600">Low Stock</Badge>
      case "watchlist":
        return <Badge variant="outline">On Watchlist</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item: any) => (
            <Card key={item.id} className="group overflow-hidden relative">
              {/* Remove Button */}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeFavorite(item.id)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-pink-500/10 to-red-500/10 flex items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/30" aria-hidden="true" />
                
                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  {getAvailabilityBadge(item.status)}
                </div>
              </div>

              <CardHeader className="p-4">
                <div className="space-y-2">
                  <p className="font-semibold line-clamp-2">{item.name}</p>
                  <p className="text-xs text-muted-foreground">by {item.assignee_name}</p>
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
                          i < Math.floor(item.rating || 0)
                            ? "fill-yellow-500 text-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.rating}</span>
                </div>

                {/* Price */}
                <p className="text-2xl font-bold">{item.price}</p>

                {/* Saved Date */}
                <p className="text-xs text-muted-foreground">
                  Saved {new Date(item.created_at).toLocaleDateString()}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 gap-2">
                <Button className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" aria-label={t('view')}>
                  <Eye className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30" aria-hidden="true" />
            <div>
              <h3 className="text-xl font-semibold">No favorites yet</h3>
              <p className="text-muted-foreground mt-2">
                Start browsing and save items you love to see them here
              </p>
            </div>
            <Button>
              Browse Marketplace
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
