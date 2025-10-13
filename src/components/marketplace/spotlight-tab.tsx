"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, TrendingUp, Star, ChevronRight } from "lucide-react"

interface SpotlightTabProps {
  data?: any[]
  loading?: boolean
}

export function SpotlightTab({ data = [], loading = false }: SpotlightTabProps) {
  const spotlightItems = data
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set())
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set())

  const toggleLike = (id: string) => {
    const newLiked = new Set(likedItems)
    if (newLiked.has(id)) {
      newLiked.delete(id)
    } else {
      newLiked.add(id)
    }
    setLikedItems(newLiked)
  }

  const toggleSave = (id: string) => {
    const newSaved = new Set(savedItems)
    if (newSaved.has(id)) {
      newSaved.delete(id)
    } else {
      newSaved.add(id)
    }
    setSavedItems(newSaved)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sponsored": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "featured": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "curated": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "trending": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sponsored": return <Sparkles className="h-3 w-3" />
      case "trending": return <TrendingUp className="h-3 w-3" />
      case "featured": return <Star className="h-3 w-3" />
      default: return null
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button variant="default" size="sm">All</Button>
        <Button variant="outline" size="sm">Sponsored</Button>
        <Button variant="outline" size="sm">Featured</Button>
        <Button variant="outline" size="sm">Trending</Button>
        <Button variant="outline" size="sm">Curated</Button>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {spotlightItems.map((item, index) => (
          <Card key={item.id} className="overflow-hidden">
            {/* Header */}
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {item.assignee_name?.charAt(0) || "V"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{item.assignee_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={getStatusBadgeColor(item.status)}>
                  {getStatusIcon(item.status)}
                  <span className="ml-1 capitalize">{item.status}</span>
                </Badge>
              </div>
            </CardHeader>

            {/* Image Placeholder */}
            <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Sparkles className="h-16 w-16 mx-auto text-purple-500/50" />
                <p className="text-sm text-muted-foreground">Featured Image</p>
              </div>
              {item.status === "sponsored" && (
                <Badge className="absolute top-4 right-4 bg-purple-600">
                  Sponsored
                </Badge>
              )}
            </div>

            {/* Content */}
            <CardContent className="pt-4 space-y-4">
              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={() => toggleLike(item.id)}
                  >
                    <Heart
                      className={`h-6 w-6 ${
                        likedItems.has(item.id)
                          ? "fill-red-500 text-red-500"
                          : "text-foreground"
                      }`}
                    />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Share2 className="h-6 w-6" />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0"
                  onClick={() => toggleSave(item.id)}
                >
                  <Bookmark
                    className={`h-6 w-6 ${
                      savedItems.has(item.id)
                        ? "fill-current text-foreground"
                        : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Likes and Info */}
              <div className="space-y-2">
                <p className="font-semibold text-sm">
                  {Math.floor(Math.random() * 1000) + 100} likes
                </p>
                <div>
                  <span className="font-semibold mr-2">{item.assignee_name}</span>
                  <span className="text-sm">{item.name}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Price and Rating */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4">
                  <p className="text-2xl font-bold">{item.price}</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>
                <Button size="sm">
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {item.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              {/* Comments Preview */}
              {item.comments_count > 0 && (
                <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground">
                  View all {item.comments_count} comments
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-4">
        <Button variant="outline" size="lg">
          Load More
        </Button>
      </div>
    </div>
  )
}
