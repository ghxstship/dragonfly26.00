"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Image as ImageIcon,
  Send,
  TrendingUp,
  Users,
  Activity as ActivityIcon,
  MoreHorizontal
} from "lucide-react"

interface ActivityTabProps {
  data?: any[]
  loading?: boolean
}

interface ActivityPost {
  id: string
  author: string
  authorTitle: string
  authorImage?: string
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
  tags?: string[]
}

export function ActivityTab({ data = [], loading = false }: ActivityTabProps) {
  const [newPost, setNewPost] = useState("")
  
  const [posts, setPosts] = useState<ActivityPost[]>([])
  
  // Update posts when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed = data.map((item: any) => ({
        id: item.id,
        author: item.author ? `${item.author.first_name} ${item.author.last_name}` : 'Unknown',
        authorTitle: item.author?.job_title || 'Community Member',
        authorImage: item.author?.avatar_url,
        content: item.content || '',
        image: item.media_urls?.[0],
        timestamp: item.created_at,
        likes: item.likes_count || 0,
        comments: item.comments_count || 0,
        shares: item.shares_count || 0,
        isLiked: false,
        tags: item.tags || []
      }))
      setPosts(transformed)
    }
  }, [data])

  const characterLimit = 500
  const charactersRemaining = characterLimit - newPost.length

  const handlePostSubmit = () => {
    if (newPost.trim() && newPost.length <= characterLimit) {
      const newActivityPost: ActivityPost = {
        id: Date.now().toString(),
        author: "You",
        authorTitle: "Your Title",
        content: newPost,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: 0,
        shares: 0,
        isLiked: false
      }
      setPosts([newActivityPost, ...posts])
      setNewPost("")
    }
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ))
  }

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Activity Feed</div>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">Recent posts</p>
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
            <div className="text-sm font-medium">Trending</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {posts.filter(p => p.likes > 500).length}
            </div>
            <p className="text-xs text-muted-foreground">Popular posts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active Users</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">Online now</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>Share an Update</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's happening in your production world? Share your thoughts, wins, or lessons learned..."
              value={newPost}
              onChange={(e) => {
                if (e.target.value.length <= characterLimit) {
                  setNewPost(e.target.value)
                }
              }}
              className="min-h-[120px] resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <ImageIcon className="h-4 w-4 mr-2" aria-hidden="true" />
                  Add Image
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${
                  charactersRemaining < 50 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {charactersRemaining}/{characterLimit}
                </span>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || newPost.length > characterLimit}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorImage} />
                    <AvatarFallback>{post.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(post.timestamp)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              <p className="mb-3 text-sm leading-relaxed">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden">
                  <div 
                    className="h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex items-center justify-between py-2 border-t text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                  <span>{post.shares} shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 pt-2 border-t">
                <Button 
                  variant={post.isLiked ? "default" : "ghost"} 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLike(post.id)}
                >
                  <Heart className={`h-4 w-4 mr-2 ${post.isLiked ? 'fill-current' : ''}`} />
                  Like
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">Load More Activity</Button>
      </div>
    </div>
  )
}
