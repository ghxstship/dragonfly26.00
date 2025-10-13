"use client"

import { useState } from "react"
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

  const newsArticles: NewsArticle[] = data.length > 0 ? data : [
    {
      id: "1",
      title: "Broadway Shows Return with Record-Breaking Attendance",
      summary: "Broadway theaters report 98% capacity as live entertainment industry sees unprecedented recovery. Major productions announce extended runs through 2025.",
      source: "Production Weekly",
      category: "industry",
      author: "Sarah Mitchell",
      publishedAt: "2024-10-10T14:30:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 234,
      comments: 45,
      trending: true,
      tags: ["Broadway", "Theater", "Entertainment"]
    },
    {
      id: "2",
      title: "New LED Technology Revolutionizes Stage Lighting",
      summary: "EcoLight Systems launches breakthrough LED fixtures that reduce energy consumption by 60% while providing superior color rendering for live events.",
      source: "EcoLight Systems",
      sourceImage: "/api/placeholder/40/40",
      category: "sponsored",
      author: "Tech Innovations Dept",
      publishedAt: "2024-10-09T10:00:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 189,
      comments: 32,
      tags: ["Technology", "Lighting", "Sustainability"]
    },
    {
      id: "3",
      title: "Essential Guide: Safety Protocols for Large-Scale Events",
      summary: "Industry experts share comprehensive safety guidelines and best practices for managing crew safety at festivals, tours, and major productions.",
      source: "Event Safety Coalition",
      category: "curated",
      author: "Dr. James Rodriguez",
      publishedAt: "2024-10-08T16:45:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 456,
      comments: 78,
      trending: true,
      tags: ["Safety", "Best Practices", "Events"]
    },
    {
      id: "4",
      title: "Top 10 Music Festivals Announce 2025 Lineups",
      summary: "Major festivals including Coachella, Glastonbury, and Bonnaroo reveal artist lineups. Production crews gear up for busiest season in recent history.",
      source: "Festival News Network",
      category: "industry",
      author: "Marcus Chen",
      publishedAt: "2024-10-07T09:15:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 892,
      comments: 156,
      trending: true,
      tags: ["Festivals", "Music", "Production"]
    },
    {
      id: "5",
      title: "Virtual Production Stages: The Future of Film & Events",
      summary: "Behind the scenes of how virtual production is transforming both film sets and live events, with case studies from recent major productions.",
      source: "Production Tech Today",
      category: "curated",
      author: "Emily Park",
      publishedAt: "2024-10-06T13:20:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 567,
      comments: 89,
      tags: ["Virtual Production", "Technology", "Innovation"]
    },
    {
      id: "6",
      title: "Hiring Surge: Production Industry Sees 40% Job Growth",
      summary: "Industry report shows significant increase in production jobs across all sectors. Companies struggle to find qualified technical crew.",
      source: "Workforce Analytics",
      category: "industry",
      author: "Lisa Thompson",
      publishedAt: "2024-10-05T11:00:00Z",
      url: "#",
      likes: 345,
      comments: 67,
      tags: ["Jobs", "Industry Trends", "Workforce"]
    },
    {
      id: "7",
      title: "ProGear Launches Revolutionary Cable Management System",
      summary: "New modular cable management solution promises to cut setup time by 50%. Early adopters from major tours report significant efficiency gains.",
      source: "ProGear Solutions",
      sourceImage: "/api/placeholder/40/40",
      category: "sponsored",
      author: "ProGear Team",
      publishedAt: "2024-10-04T08:30:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 123,
      comments: 28,
      tags: ["Equipment", "Efficiency", "Innovation"]
    },
    {
      id: "8",
      title: "Sustainable Production: Green Initiatives Gain Momentum",
      summary: "Major production companies commit to carbon-neutral events. Industry leaders share strategies for sustainable event management.",
      source: "Green Events Alliance",
      category: "curated",
      author: "David Green",
      publishedAt: "2024-10-03T15:10:00Z",
      image: "/api/placeholder/400/250",
      url: "#",
      likes: 678,
      comments: 112,
      tags: ["Sustainability", "Environment", "Best Practices"]
    }
  ]

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
