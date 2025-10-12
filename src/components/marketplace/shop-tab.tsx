"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Heart, Star, Package, Filter, Search } from "lucide-react"
import { generateMarketplaceMockData } from "@/lib/modules/marketplace-mock-data"

export function ShopTab() {
  const shopItems = generateMarketplaceMockData('shop', 24)
  const [cart, setCart] = useState<Set<string>>(new Set())
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [view, setView] = useState<"grid" | "list">("grid")

  const addToCart = (id: string) => {
    const newCart = new Set(cart)
    newCart.add(id)
    setCart(newCart)
  }

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
        return <Badge variant="outline">Available</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <ShoppingCart className="h-3 w-3 mr-1" />
            {cart.size} items
          </Badge>
          <Button>
            View Cart
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="audio">Audio Equipment</SelectItem>
            <SelectItem value="lighting">Lighting</SelectItem>
            <SelectItem value="video">Video</SelectItem>
            <SelectItem value="staging">Staging</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="featured">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {shopItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
              <Package className="h-20 w-20 text-muted-foreground/30" />
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => toggleFavorite(item.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      favorites.has(item.id) ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Status Badge */}
              {item.priority === "featured" && (
                <Badge className="absolute top-2 left-2 bg-purple-600">
                  Featured
                </Badge>
              )}
            </div>

            <CardHeader className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold line-clamp-2 text-sm">{item.name}</p>
                  {getStockBadge(item.status)}
                </div>
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
                <span className="text-xs text-muted-foreground">
                  {item.rating} ({item.comments_count})
                </span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <p className="text-2xl font-bold">{item.price}</p>
                {item.stock && (
                  <p className="text-xs text-muted-foreground">
                    {item.stock} units available
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 gap-2">
              <Button
                className="flex-1"
                onClick={() => addToCart(item.id)}
                disabled={cart.has(item.id)}
              >
                {cart.has(item.id) ? "Added" : "Add to Cart"}
              </Button>
              <Button variant="outline" size="icon">
                <Package className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 pt-4">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">1</Button>
        <Button variant="default">2</Button>
        <Button variant="outline">3</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}
