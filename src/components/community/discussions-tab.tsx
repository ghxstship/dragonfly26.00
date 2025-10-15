"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  ArrowUp, 
  ArrowDown,
  MessageCircle,
  Share2,
  Bookmark,
  TrendingUp,
  Clock,
  Search,
  Plus,
  Award,
  Pin,
  Lock,
  Eye
} from "lucide-react"

interface DiscussionsTabProps {
  data?: any[]
  loading?: boolean
}

interface Discussion {
  id: string
  title: string
  content: string
  author: string
  authorImage?: string
  authorFlair?: string
  category: string
  timestamp: string
  upvotes: number
  downvotes: number
  comments: number
  views: number
  pinned?: boolean
  locked?: boolean
  awarded?: boolean
  userVote?: "up" | "down" | null
  tags: string[]
}

export function DiscussionsTab({ data = [], loading = false }: DiscussionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | Discussion["category"]>("all")
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")

  const [discussions, setDiscussions] = useState<Discussion[]>([])

  // Transform and update discussions when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: Discussion[] = data.map((item: any) => ({
        id: item.id,
        title: item.title || 'Untitled Discussion',
        content: item.content || '',
        author: item.author ? `${item.author.first_name}_${item.author.last_name}`.toLowerCase() : 'anonymous',
        authorImage: item.author?.avatar_url,
        authorFlair: item.author?.job_title,
        category: item.tags?.[0] || 'General',
        timestamp: item.created_at,
        upvotes: item.likes_count || 0,
        downvotes: 0, // Not tracked yet
        comments: item.comments_count || 0,
        views: 0, // Not tracked yet
        pinned: item.is_featured || false,
        locked: false,
        awarded: (item.likes_count || 0) > 100,
        userVote: null,
        tags: item.tags || []
      }))
      setDiscussions(transformed)
    }
  }, [data])

  const handleVote = (discussionId: string, voteType: "up" | "down") => {
    setDiscussions(discussions.map(discussion => {
      if (discussion.id === discussionId) {
        let newUpvotes = discussion.upvotes
        let newDownvotes = discussion.downvotes
        let newUserVote: "up" | "down" | null = voteType

        if (discussion.userVote === voteType) {
          // Remove vote
          if (voteType === "up") newUpvotes--
          else newDownvotes--
          newUserVote = null
        } else if (discussion.userVote === null) {
          // Add vote
          if (voteType === "up") newUpvotes++
          else newDownvotes++
        } else {
          // Change vote
          if (voteType === "up") {
            newUpvotes++
            newDownvotes--
          } else {
            newDownvotes++
            newUpvotes--
          }
        }

        return {
          ...discussion,
          upvotes: newUpvotes,
          downvotes: newDownvotes,
          userVote: newUserVote
        }
      }
      return discussion
    }))
  }

  const filteredDiscussions = discussions
    .filter(discussion => 
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "hot") {
        const scoreA = a.upvotes - a.downvotes + (a.comments * 2)
        const scoreB = b.upvotes - b.downvotes + (b.comments * 2)
        return scoreB - scoreA
      } else if (sortBy === "new") {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      } else { // top
        return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
      }
    })

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
            <div className="text-sm font-medium">Discussions</div>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{discussions.length}</div>
            <p className="text-xs text-muted-foreground">Active threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Comments</div>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discussions.reduce((acc, d) => acc + d.comments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total replies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Hot Topics</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {discussions.filter(d => d.upvotes > 200).length}
            </div>
            <p className="text-xs text-muted-foreground">Trending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Your Posts</div>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Contributions</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Post Button */}
      <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20">
        <CardContent className="p-4">
          <Button 
            className="w-full" 
            size="lg"
            onClick={() => setShowNewPost(!showNewPost)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Start a New Discussion
          </Button>
        </CardContent>
      </Card>

      {/* New Post Form */}
      {showNewPost && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Discussion title..."
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Share your thoughts, ask a question, or start a conversation..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                Cancel
              </Button>
              <Button>Post Discussion</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Sort */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <TabsList>
                <TabsTrigger value="hot">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Hot
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Clock className="h-4 w-4 mr-2" />
                  New
                </TabsTrigger>
                <TabsTrigger value="top">
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Top
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Discussions List */}
      <div className="space-y-4">
        {filteredDiscussions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No discussions found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          filteredDiscussions.map((discussion) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-col items-center gap-1 min-w-[48px]">
                    <Button 
                      variant={discussion.userVote === "up" ? "default" : "ghost"} 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote(discussion.id, "up")}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className="font-bold text-sm">
                      {discussion.upvotes - discussion.downvotes}
                    </span>
                    <Button 
                      variant={discussion.userVote === "down" ? "default" : "ghost"} 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote(discussion.id, "down")}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start gap-2 mb-2">
                      {discussion.pinned && (
                        <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="secondary">{discussion.category}</Badge>
                          <span>Posted by {discussion.author}</span>
                          {discussion.authorFlair && (
                            <Badge variant="outline" className="text-xs">
                              {discussion.authorFlair}
                            </Badge>
                          )}
                          <span>•</span>
                          <span>{timeAgo(discussion.timestamp)}</span>
                          {discussion.awarded && (
                            <>
                              <span>•</span>
                              <Award className="h-3 w-3 text-yellow-500 fill-current" />
                            </>
                          )}
                          {discussion.locked && (
                            <>
                              <span>•</span>
                              <Lock className="h-3 w-3" />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Content Preview */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {discussion.content}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {discussion.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        {discussion.comments} Comments
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {discussion.views.toLocaleString()} views
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
