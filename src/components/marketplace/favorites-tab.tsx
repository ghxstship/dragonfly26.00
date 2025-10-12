"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Star, Eye, X, Package } from "lucide-react"
import { generateMarketplaceMockData } from "@/lib/modules/marketplace-mock-data"

export function FavoritesTab() {
  const [favorites, setFavorites] = useState(generateMarketplaceMockData('favorites', 16))

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter(item => item.id !== id))
  }

  const getAvailabilityBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">Available</Badge>
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
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline">
            Create List from Favorites
          </Button>
          <Button>
            Add All to Cart
          </Button>
        </div>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <Card key={item.id} className="group overflow-hidden relative">
              {/* Remove Button */}
              <Button
                size="icon"
                variant="destructive"
                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => removeFavorite(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-pink-500/10 to-red-500/10 flex items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/30" />
                
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
                          i < Math.floor(parseFloat(item.rating || "0"))
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
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30" />
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
