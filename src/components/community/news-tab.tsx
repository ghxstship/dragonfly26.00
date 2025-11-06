"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useCommunityData } from "@/hooks/use-community-data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
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

  titleKey?: string
}

export function NewsTab({ data = [], loading: loadingProp = false }: NewsTabProps) {
  const { posts, loading: liveLoading } = useCommunityData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('community.news')
  const tCommon = useTranslations('common')
  const [selectedCategory, setSelectedCategory] = useState<"all" | "industry" | "sponsored" | "curated">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])

  // Transform and update articles when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: NewsArticle[] = data.map((item: any) => {
        const record = item as any
        return {
          id: record.id,
          title: record.title || 'Untitled',
          summary: record.content || '',
          source: record.author?.company || 'Community',
          sourceImage: record.author?.avatar_url,
          category: record.is_sponsored ? 'sponsored' : (record.is_featured ? 'curated' : 'industry'),
          author: record.author ? `${record.author.first_name} ${record.author.last_name}` : 'Anonymous',
          authorTitle: record.author?.job_title || 'Community Member',
          publishedAt: record.created_at,
          image: record.media_urls?.[0],
          url: '#',
          likes: record.likes_count || 0,
          comments: record.comments_count || 0,
          trending: record.is_featured || false,
          tags: record.tags || []
        }
      })
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
      industry: { label: "All", variant: "default" as const },
      sponsored: { label: t('sponsored'), variant: "secondary" },
      curated: { label: t('industry'), variant: "outline" as const }
    }
    return variants[category]
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Today&apos;s News</div>
            <Newspaper aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{newsArticles.length}</div>
            <p className="text-xs text-muted-foreground">Latest updates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('trending')}</div>
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {newsArticles.filter(a => a.trending).length}
            </div>
            <p className="text-xs text-muted-foreground">Hot topics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('bookmarked')}</div>
            <Bookmark aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Saved articles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('thisWeek')}</div>
            <Star aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">New articles</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent aria-hidden="true" className="pt-6">
          <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-3 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('searchNews')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={selectedCategory as any} onValueChange={(v) => setSelectedCategory(v as any)}>
              <TabsList>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="industry">{t('industry')}</TabsTrigger>
                <TabsTrigger value="sponsored">{t('sponsored')}</TabsTrigger>
                <TabsTrigger value="curated">{t('curated')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <Card>
            <CardContent aria-hidden="true" className="p-0">
              <EmptyState
                variant="inline"
                icon={Newspaper}
                mainMessage={searchQuery || selectedCategory !== "all" ? t('noArticlesFound') : t('nothingToSeeYet')}
                description={searchQuery || selectedCategory !== "all" ? t('tryAdjustingFilters') : t('stayUpdated')}
              />
            </CardContent>
          </Card>
        ) : (
          filteredArticles.map((article: any) => (
            <Card key={article.id} className="overflow-hidden md:block hover:shadow-md transition-shadow">
              <CardContent aria-hidden="true" className="p-0">
                <div className="md:flex">
                  {/* Image */}
                  {article.image && (
                    <div className="md:w-full sm:w-64 h-48 md:h-auto relative flex-shrink-0">
                      <div 
                        className="absolute sm:relative sm:inset-auto inset-0 bg-cover bg-center sm:relative sm:inset-auto"
                        style={{ backgroundImage: `url(${article.image})` }}
                      />
                      {article.trending && (
                        <Badge aria-hidden="true" className="absolute sm:relative sm:inset-auto top-3 left-3 bg-orange-500 sm:relative sm:inset-auto">
                          <TrendingUp aria-hidden="true" className="h-3 w-3 mr-1" />{t('trending')}</Badge>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 sm:p-6 flex-1">
                    <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4 mb-3">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        {article.sourceImage && (
                          <Avatar aria-hidden="true" className="h-8 w-8">
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

                    <h3 className="text-base md:text-lg lg:text-xl font-semibold mb-2">{article.titleKey ? (article.titleKey ? t(article.titleKey) : article.title) : article.title}</h3>
                    <p className="text-muted-foreground mb-4">We&apos;re excited to announce {article.summary}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag: any) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm text-muted-foreground">
                        <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                        <Button variant="ghost" size="sm" className="h-8">
                          <ThumbsUp aria-hidden="true" className="h-4 w-4 mr-1" />
                          {article.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <MessageCircle aria-hidden="true" className="h-4 w-4 mr-1" />
                          {article.comments}
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button variant="ghost" size="sm" aria-label={t('bookmark')}>
                          <Bookmark aria-hidden="true" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink aria-hidden="true" className="h-4 w-4 mr-2" />
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
