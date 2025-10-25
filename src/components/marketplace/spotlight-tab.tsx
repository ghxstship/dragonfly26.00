"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, TrendingUp, Star, ChevronRight , Plus} from "lucide-react"
import { useMarketplaceData } from "@/hooks/use-marketplace-data"

interface SpotlightItem {
  id: string
  type: string
  title: string
  description?: string
  likes_count?: number
  comments_count?: number
  shares_count?: number
  author?: string
  [key: string]: any
}

interface SpotlightTabProps {
  data?: SpotlightItem[]
  loading?: boolean
}

export function SpotlightTab({ data = [], loading: loadingProp = false }: SpotlightTabProps) {
  const { products, loading: liveLoading } = useMarketplaceData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('marketplace.spotlight')
  const tCommon = useTranslations('common')
  const spotlightItems: SpotlightItem[] = data
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
      case "sponsored": return <Sparkles className="h-3 w-3"  aria-hidden="true" />
      case "trending": return <TrendingUp className="h-3 w-3" aria-hidden="true" />
      case "featured": return <Star className="h-3 w-3" aria-hidden="true" />
      default: return null
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 space-y-4 md:space-y-3 md:space-y-4 lg:space-y-6 lg:space-y-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
        <Button variant="default" size="sm">{t('all')}</Button>
        <Button variant="outline" size="sm">{t('sponsored')}</Button>
        <Button variant="outline" size="sm">{t('featured')}</Button>
        <Button variant="outline" size="sm">{t('trending')}</Button>
        <Button variant="outline" size="sm">{t('curated')}</Button>
      </div>

      {/* Feed */}
      <div className="space-y-3 md:space-y-4 lg:space-y-6">
        {spotlightItems.map((item, index) => (
          <Card key={item.id} className="overflow-hidden md:block">
            {/* Header */}
            <CardHeader className="pb-3">
              <div className="flex flex-wrap flex-col md:flex-row items-start justify-between">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
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
            <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-pink-500/20 flex flex-wrap items-center justify-center">
              <div className="text-center space-y-2">
                <Sparkles className="h-16 w-16 mx-auto text-purple-500/50"  aria-hidden="true" />
                <p className="text-sm text-muted-foreground">Featured Image</p>
              </div>
              {(item as any).status === "sponsored" && (
                <Badge className="absolute sm:relative sm:inset-auto top-2 md:top-4 right-2 md:right-4 bg-purple-600">
                  Sponsored
                </Badge>
              )}
            </div>

            {/* Content */}
            <CardContent className="pt-4 space-y-4">
              {/* Actions */}
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
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
                    <MessageCircle className="h-6 w-6" aria-hidden="true" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Share2 className="h-6 w-6" aria-hidden="true" />
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
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between pt-2 border-t">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                  <p className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{item.price}</p>
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>
                <Button size="sm">
                  View Details
                  <ChevronRight className="ml-1 h-4 w-4"  aria-hidden="true" />
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
              {(item.comments_count || 0) > 0 && (
                <Button variant="link" className="h-auto p-0 text-sm text-muted-foreground">
                  View all {item.comments_count} comments
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Load More */}
        <div className="flex flex-wrap justify-center pt-4">
          <Button variant="outline" size="lg">
            Load More
          </Button>
        </div>
      </div>
    </div>
  )
}
