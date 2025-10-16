"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Heart, 
  MessageCircle, 
  Share2,
  Award,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Bookmark
} from "lucide-react"

interface ShowcaseTabProps {
  data?: any[]
  loading?: boolean
}

interface ShowcasePost {
  id: string
  author: string
  authorTitle: string
  authorImage?: string
  company: string
  content: string
  images?: string[]
  video?: string
  category: "featured" | "sponsored" | "achievement"
  likes: number
  comments: number
  shares: number
  views: number
  timestamp: string
  tags: string[]
  isLiked?: boolean
  isBookmarked?: boolean
}

export function ShowcaseTab({ data = [], loading = false }: ShowcaseTabProps) {
  const t = useTranslations('community.showcase')
  const tCommon = useTranslations('common')
  const [posts, setPosts] = useState<ShowcasePost[]>([])

  // Transform and update posts when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: ShowcasePost[] = data.map((item: any) => ({
        id: item.id,
        author: item.author ? `${item.author.first_name} ${item.author.last_name}` : 'Anonymous',
        authorTitle: item.author?.job_title || 'Community Member',
        authorImage: item.author?.avatar_url,
        company: item.author?.company || 'Company',
        content: item.content || '',
        images: item.media_urls || [],
        category: item.is_featured ? 'featured' : (item.is_sponsored ? 'sponsored' : 'achievement'),
        likes: item.likes_count || 0,
        comments: item.comments_count || 0,
        shares: item.shares_count || 0,
        views: 0, // Not tracked yet
        timestamp: item.created_at,
        tags: item.tags || [],
        isLiked: false,
        isBookmarked: false
      }))
      setPosts(transformed)
    }
  }, [data])

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  const getCategoryBadge = (category: ShowcasePost["category"]) => {
    const configs = {
      featured: { icon: Sparkles, label: t('featured'), color: "text-purple-500" },
      sponsored: { icon: TrendingUp, label: t('sponsored'), color: "text-blue-500" },
      achievement: { icon: Award, label: t('achievement'), color: "text-yellow-500" }
    }
    return configs[category]
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Showcase Posts</div>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Featured content</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Reach</div>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(posts.reduce((acc, p) => acc + p.views, 0) / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('engagement')}</div>
            <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, p) => acc + p.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('totalLikes')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Bookmarked</div>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.isBookmarked).length}
            </div>
            <p className="text-xs text-muted-foreground">Saved posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Showcase Feed */}
      <div className="space-y-6">
        {posts.map((post) => {
          const categoryConfig = getCategoryBadge(post.category)
          const CategoryIcon = categoryConfig.icon

          return (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-6">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={post.authorImage} />
                      <AvatarFallback>{post.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{post.author}</p>
                      <p className="text-sm text-muted-foreground">{post.authorTitle} at {post.company}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={categoryConfig.color}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {categoryConfig.label}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="mb-4 text-sm leading-relaxed whitespace-pre-line">{post.content}</p>

                {/* Post Images */}
                {post.images && post.images.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${
                    post.images?.length === 1 ? 'grid-cols-1' :
                    post.images?.length === 2 ? 'grid-cols-2' :
                    post.images?.length === 3 ? 'grid-cols-3' :
                    'grid-cols-2'
                  }`}>
                    {post.images?.slice(0, 4).map((image, idx) => (
                      <div 
                        key={idx}
                        className={`relative rounded-lg overflow-hidden ${
                          post.images?.length === 1 ? 'h-96' : 'h-48'
                        } bg-muted`}
                      >
                        <div 
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${image})` }}
                        />
                        {idx === 3 && post.images && post.images.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              +{post.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between py-3 border-y text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>{post.likes.toLocaleString()} likes</span>
                    <span>{post.comments} comments</span>
                    <span>{post.shares} shares</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-3">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={post.isLiked ? "default" : "ghost"} 
                      size="sm"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                      Like
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                      Share
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleBookmark(post.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Showcase Posts</Button>
      </div>
    </div>
  )
}
