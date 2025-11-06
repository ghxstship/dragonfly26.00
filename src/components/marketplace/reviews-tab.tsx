"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, ThumbsUp, Flag, Search, Filter, Plus } from "lucide-react"
import { useProductReviews } from "@/hooks/use-marketplace-reviews"
import { useTranslations } from 'next-intl'

interface Review {
  id: string
  rating: number
  status?: string
  reviewer_name?: string
  date?: string
  comment?: string
  helpful_count?: number
  [key: string]: any
}

interface ReviewsTabProps {
  data?: Review[]
  loading?: boolean
}

export function ReviewsTab({ data = [], loading: loadingProp = false }: ReviewsTabProps) {
  // TODO: Implement all-reviews hook or use useProductReviews with specific productId
  // const { reviews, loading: liveLoading } = useProductReviews(productId)
  const loading = loadingProp
  const t = useTranslations('marketplace.reviews')
  const tCommon = useTranslations('common')
  const reviewsData: Review[] = data
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge aria-hidden="true" className="bg-green-600">Verified Purchase</Badge>
      case "published":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600">{t('published')}</Badge>
      case "pending":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600">Pending Review</Badge>
      case "flagged":
        return <Badge variant="destructive">{t('flagged')}</Badge>
      default:
        return null
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    )
  }

  const averageRating = (
    reviewsData.reduce((sum: any, r: any) => sum + (r.rating || 0), 0) / reviewsData.length
  ).toFixed(1)

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviewsData.filter(r => (r.rating || 0) === rating).length,
    percentage: (reviewsData.filter(r => (r.rating || 0) === rating).length / reviewsData.length) * 100
  }))

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4 md:gap-3 md:gap-4 lg:gap-6 lg:gap-8">
            {/* Average Rating */}
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
              <div className="text-center">
                <p className="text-3xl md:text-2xl md:text-3xl lg:text-4xl lg:text-3xl md:text-4xl lg:text-5xl font-bold">{averageRating}</p>
                {renderStars(Math.round(parseFloat(averageRating)))}
                <p className="text-sm text-muted-foreground mt-2">
                  Based on {reviewsData.length} reviews
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <Star aria-hidden="true" className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden md:block">
                    <div
                      className="h-full bg-yellow-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap flex-col sm:flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
        <div className="flex-1 relative">
          <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
          <Input placeholder={t('searchReviews')} className="pl-9" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('itemType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="equipment">{t('equipment')}</SelectItem>
            <SelectItem value="service">{t('services')}</SelectItem>
            <SelectItem value="vendor">{t('vendors')}</SelectItem>
            <SelectItem value="product">{t('products')}</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="recent">
          <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
            <SelectValue placeholder={t('sortBy')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="helpful">Most Helpful</SelectItem>
            <SelectItem value="highest">Highest Rating</SelectItem>
            <SelectItem value="lowest">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter aria-hidden="true" className="h-4 w-4 mr-2" />{t('moreFilters')}</Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="5star">5 Star</TabsTrigger>
          <TabsTrigger value="4star">4 Star</TabsTrigger>
          <TabsTrigger value="3star">3 Star</TabsTrigger>
          <TabsTrigger value="verified">Verified Only</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {reviewsData.map((review: any) => (
            <Card key={review.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {review.assignee_name?.split(' ').map((n: string) => n[0]).join('') || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <CardTitle aria-hidden="true" className="text-base">{review.assignee_name}</CardTitle>
                        {review.status === "verified" && getStatusBadge(review.status || 'published')}
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                        {renderStars(review.rating || 0)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label={t('flag')}>
                    <Flag aria-hidden="true" className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent aria-hidden="true" className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">{review.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {review.description}
                  </p>
                </div>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 pt-2 border-t">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ThumbsUp aria-hidden="true" className="h-4 w-4" />
                    Helpful ({review.helpful_count})
                  </Button>
                  {review.comments_count > 0 && (
                    <Button variant="ghost" size="sm">
                      {review.comments_count} {review.comments_count === 1 ? 'Reply' : 'Replies'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="5star" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for 5-star reviews
          </div>
        </TabsContent>

        <TabsContent value="4star" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for 4-star reviews
          </div>
        </TabsContent>

        <TabsContent value="3star" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for 3-star reviews
          </div>
        </TabsContent>

        <TabsContent value="verified" className="mt-4">
          <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
            Filter for verified reviews only
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
