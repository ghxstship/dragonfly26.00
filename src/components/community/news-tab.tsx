"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Newspaper, 
  Bookmark, 
  Share2, 
  ThumbsUp, 
  MessageCircle,
  ExternalLink,
  TrendingUp,
  Star,
  Search,
  Filter
} from "lucide-react"

interface NewsTabProps {
  data?: any[]
  loading?: boolean
}

interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  sourceImage?: string
  category: "industry" | "sponsored" | "curated"
  author: string
  publishedAt: string
  image?: string
  url: string
  likes: number
  comments: number
  trending?: boolean
  tags: string[]
}

export function NewsTab({ data = [], loading = false }: NewsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "industry" | "sponsored" | "curated">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])

  // Transform and update articles when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: NewsArticle[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled',
        summary: item.content || '',
        source: item.author?.company || 'Community',
        sourceImage: item.author?.avatar_url,
        category: item.is_sponsored ? 'sponsored' : (item.is_featured ? 'curated' : 'industry'),
        author: item.author ? `${item.author.first_name} ${item.author.last_name}` : 'Anonymous',
        authorTitle: item.author?.job_title || 'Community Member',
        publishedAt: item.created_at,
        image: item.media_urls?.[0],
        url: '#',
        likes: item.likes_count || 0,
        comments: item.comments_count || 0,
        trending: item.is_featured || false,
        tags: item.tags || []
      }))
      setNewsArticles(transformed)
    }
  }, [data])

  const filteredArticles = newsArticles.filter(article => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const getCategoryBadge = (category: NewsArticle["category"]) => {
    const variants: Record<NewsArticle["category"], { label: string, variant: "default" | "secondary" | "outline" }> = {
      industry: { label: "Industry News", variant: "default" },
      sponsored: { label: "Sponsored", variant: "secondary" },
      curated: { label: "Curated", variant: "outline" }
    }
    return variants[category]
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Today&apos;s News</div>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{newsArticles.length}</div>
            <p className="text-xs text-muted-foreground">Latest updates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Trending</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {newsArticles.filter(a => a.trending).length}
            </div>
            <p className="text-xs text-muted-foreground">Hot topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Bookmarked</div>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Saved articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">This Week</div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">New articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="industry">Industry</TabsTrigger>
                <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
                <TabsTrigger value="curated">Curated</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No articles found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="md:flex">
                  {/* Image */}
                  {article.image && (
                    <div className="md:w-64 h-48 md:h-auto relative flex-shrink-0">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${article.image})` }}
                      />
                      {article.trending && (
                        <Badge className="absolute top-3 left-3 bg-orange-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        {article.sourceImage && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={article.sourceImage} />
                            <AvatarFallback>{article.source[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div>
                          <p className="text-sm font-medium">{article.source}</p>
                          <p className="text-xs text-muted-foreground">{article.author}</p>
                        </div>
                      </div>
                      <Badge {...getCategoryBadge(article.category)}>
                        {getCategoryBadge(article.category).label}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                    <p className="text-muted-foreground mb-4">We&apos;re excited to announce {article.summary}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" className="h-8">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {article.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {article.comments}
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
