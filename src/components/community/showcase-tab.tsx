"use client"

import { useState } from "react"
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

export function ShowcaseTab() {
  const [posts, setPosts] = useState<ShowcasePost[]>([
    {
      id: "1",
      author: "Sarah Mitchell",
      authorTitle: "Production Director",
      authorImage: "/api/placeholder/40/40",
      company: "Stellar Events",
      content: "Thrilled to share our work from the Global Music Awards! Our team designed and executed a 360° immersive stage experience with cutting-edge projection mapping. This project pushed the boundaries of what's possible in live event production. Grateful to work with such talented professionals who made this vision a reality. 🎭✨",
      images: ["/api/placeholder/600/400", "/api/placeholder/600/400", "/api/placeholder/600/400"],
      category: "featured",
      likes: 2847,
      comments: 156,
      shares: 89,
      views: 15420,
      timestamp: "2024-10-10T14:30:00Z",
      tags: ["Stage Design", "Projection Mapping", "Awards Show"],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: "2",
      author: "ProGear Solutions",
      authorTitle: "Industry Leader",
      authorImage: "/api/placeholder/40/40",
      company: "ProGear Solutions",
      content: "🚀 Introducing the ProGear FlexRig System - revolutionizing stage rigging with AI-powered load calculations and real-time safety monitoring. Trusted by 200+ production companies worldwide. Early bird pricing available for a limited time. Transform your rigging workflow today! 💪",
      images: ["/api/placeholder/600/400"],
      video: "/api/video/demo.mp4",
      category: "sponsored",
      likes: 1243,
      comments: 78,
      shares: 234,
      views: 8900,
      timestamp: "2024-10-09T10:00:00Z",
      tags: ["Rigging", "Technology", "Safety"],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: "3",
      author: "Marcus Chen",
      authorTitle: "Lighting Designer",
      authorImage: "/api/placeholder/40/40",
      company: "LightCraft Studios",
      content: "Incredibly honored to receive the Excellence in Lighting Design Award at this year's Live Design Summit! This recognition is a testament to our entire crew's dedication. Special thanks to my team who worked tirelessly on the 'Neon Dreams' tour. Here's to pushing creative boundaries and inspiring the next generation of designers! 🏆✨",
      images: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
      category: "achievement",
      likes: 3456,
      comments: 234,
      shares: 145,
      views: 21300,
      timestamp: "2024-10-08T16:45:00Z",
      tags: ["Award", "Lighting Design", "Achievement"],
      isLiked: true,
      isBookmarked: true
    },
    {
      id: "4",
      author: "Emily Rodriguez",
      authorTitle: "Festival Director",
      authorImage: "/api/placeholder/40/40",
      company: "Horizon Festivals",
      content: "Sunset Festival 2024 was our biggest success yet! 50,000 attendees, 5 stages, 100+ artists, and zero incidents. Behind the scenes: 300 crew members, 6 months of planning, and countless hours of coordination. Proud of every single person who made this happen. The production industry is full of unsung heroes. Thank you all! 🎪🎵",
      images: ["/api/placeholder/600/400", "/api/placeholder/600/400", "/api/placeholder/600/400", "/api/placeholder/600/400"],
      category: "featured",
      likes: 5678,
      comments: 389,
      shares: 267,
      views: 34200,
      timestamp: "2024-10-07T09:15:00Z",
      tags: ["Festival", "Production", "Success Story"],
      isLiked: true,
      isBookmarked: false
    },
    {
      id: "5",
      author: "TechStage Innovations",
      authorTitle: "Equipment Manufacturer",
      authorImage: "/api/placeholder/40/40",
      company: "TechStage",
      content: "Meet the future of audio: Our new wireless IEM system with 24-hour battery life, zero latency, and crystal-clear sound. Used by headliners at Coachella, Glastonbury, and more. Special launch offer: 30% off for first 100 orders. Don't miss out on this game-changing technology! 🎧🔊",
      images: ["/api/placeholder/600/400", "/api/placeholder/600/400"],
      category: "sponsored",
      likes: 892,
      comments: 67,
      shares: 134,
      views: 6700,
      timestamp: "2024-10-06T13:20:00Z",
      tags: ["Audio", "Technology", "IEM"],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: "6",
      author: "David Park",
      authorTitle: "Technical Director",
      authorImage: "/api/placeholder/40/40",
      company: "Apex Productions",
      content: "Milestone achievement: Just wrapped my 100th major production! From small theater shows to arena tours, each project taught me something new. Grateful for the mentors, colleagues, and crews who've been part of this journey. Here's to the next 100! 🎭💯",
      images: ["/api/placeholder/600/400"],
      category: "achievement",
      likes: 2134,
      comments: 178,
      shares: 89,
      views: 12400,
      timestamp: "2024-10-05T11:00:00Z",
      tags: ["Milestone", "Career", "Production"],
      isLiked: false,
      isBookmarked: true
    }
  ])

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
      featured: { icon: Sparkles, label: "Featured", color: "text-purple-500" },
      sponsored: { icon: TrendingUp, label: "Sponsored", color: "text-blue-500" },
      achievement: { icon: Award, label: "Achievement", color: "text-yellow-500" }
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
            <div className="text-sm font-medium">Engagement</div>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.reduce((acc, p) => acc + p.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total likes</p>
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
                      <MoreHorizontal className="h-4 w-4" />
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
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
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
