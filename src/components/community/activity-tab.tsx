"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  Image,
  Send,
  TrendingUp,
  Users,
  Activity as ActivityIcon,
  MoreHorizontal
} from "lucide-react"

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

export function ActivityTab() {
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<ActivityPost[]>([
    {
      id: "1",
      author: "Jessica Martinez",
      authorTitle: "Stage Manager",
      authorImage: "/api/placeholder/40/40",
      content: "Just wrapped the most incredible 3-day festival setup! Our crew worked around the clock to build 5 stages from the ground up. The energy, teamwork, and dedication everyone brought was unmatched. Massive shoutout to the rigging team for pulling off some seriously impressive work. Now time for some well-deserved rest! 🎪✨",
      timestamp: "2024-10-10T18:45:00Z",
      likes: 234,
      comments: 18,
      shares: 5,
      isLiked: false,
      tags: ["festival", "teamwork"]
    },
    {
      id: "2",
      author: "Mike Thompson",
      authorTitle: "Lighting Technician",
      authorImage: "/api/placeholder/40/40",
      content: "That moment when the artist walks on stage and your lighting cues hit PERFECTLY. Three weeks of programming, countless rehearsals, and it all comes together in those magical moments. This is why we do what we do! 💡🎭",
      timestamp: "2024-10-10T16:30:00Z",
      likes: 456,
      comments: 32,
      shares: 12,
      isLiked: true,
      tags: ["lighting", "showtime"]
    },
    {
      id: "3",
      author: "Sarah Chen",
      authorTitle: "Audio Engineer",
      authorImage: "/api/placeholder/40/40",
      content: "Pro tip for new audio engineers: Always, ALWAYS check your phantom power before connecting ribbon mics. Just saved a vintage U47 from potential damage because I double-checked. The small habits make all the difference in protecting expensive gear and maintaining your reputation.",
      image: "/api/placeholder/400/300",
      timestamp: "2024-10-10T14:15:00Z",
      likes: 892,
      comments: 67,
      shares: 143,
      isLiked: true,
      tags: ["audio", "protip"]
    },
    {
      id: "4",
      author: "David Rodriguez",
      authorTitle: "Production Coordinator",
      authorImage: "/api/placeholder/40/40",
      content: "Load-in starts in 6 hours and half the equipment is stuck in traffic. This is fine. Everything is fine. This is why we plan for contingencies. Time to pull out the backup plan and make some magic happen! 😅🚚",
      timestamp: "2024-10-10T12:00:00Z",
      likes: 567,
      comments: 45,
      shares: 8,
      isLiked: false,
      tags: ["production", "logistics"]
    },
    {
      id: "5",
      author: "Emily Park",
      authorTitle: "Rigger",
      authorImage: "/api/placeholder/40/40",
      content: "Huge thanks to my mentor John for teaching me proper rigging safety protocols. 10 years in the industry and I still reference the lessons he taught me. Good mentorship creates safer, better crews. Pay it forward whenever you can! 🙏",
      timestamp: "2024-10-10T10:30:00Z",
      likes: 723,
      comments: 54,
      shares: 23,
      isLiked: false,
      tags: ["safety", "mentorship"]
    },
    {
      id: "6",
      author: "Marcus Williams",
      authorTitle: "Video Engineer",
      authorImage: "/api/placeholder/40/40",
      content: "Finally got my hands on the new LED wall panels everyone's been talking about. The color accuracy and brightness are absolutely incredible. Game changer for outdoor daylight events. Already planning how to incorporate these into our summer festival lineup!",
      image: "/api/placeholder/400/300",
      timestamp: "2024-10-10T09:15:00Z",
      likes: 445,
      comments: 38,
      shares: 17,
      isLiked: true,
      tags: ["video", "technology"]
    },
    {
      id: "7",
      author: "Lisa Johnson",
      authorTitle: "Tour Manager",
      authorImage: "/api/placeholder/40/40",
      content: "Week 8 of this tour and the crew is still crushing it every single night. The dedication and professionalism from everyone on this team is inspiring. From load-in to load-out, everyone brings their A-game. Grateful to work with such talented humans! 🚌🎸",
      timestamp: "2024-10-10T08:00:00Z",
      likes: 334,
      comments: 28,
      shares: 6,
      isLiked: false,
      tags: ["tour", "crew"]
    },
    {
      id: "8",
      author: "Robert Kim",
      authorTitle: "Production Designer",
      authorImage: "/api/placeholder/40/40",
      content: "When the client says 'we want something nobody's ever seen before' and actually gives you the budget to make it happen 🤯 Spent the last 6 months designing this stage concept and we finally get to build it next week. Can't wait to share photos!",
      timestamp: "2024-10-09T20:45:00Z",
      likes: 678,
      comments: 56,
      shares: 19,
      isLiked: false,
      tags: ["design", "creative"]
    }
  ])

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
                  <Image className="h-4 w-4 mr-2" />
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
