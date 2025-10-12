"use client"

import { useState } from "react"
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

export function DiscussionsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot")
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostContent, setNewPostContent] = useState("")

  const [discussions, setDiscussions] = useState<Discussion[]>([
    {
      id: "1",
      title: "Best practices for setting up outdoor festivals in unpredictable weather?",
      content: "Looking for advice from experienced festival production managers. We're planning a 3-day outdoor festival and weather forecasts are showing possible rain. What contingency plans and equipment do you recommend? Budget is flexible for safety.",
      author: "sarah_production",
      authorImage: "/api/placeholder/40/40",
      authorFlair: "Production Manager",
      category: "Production",
      timestamp: "2024-10-10T14:30:00Z",
      upvotes: 234,
      downvotes: 3,
      comments: 67,
      views: 2341,
      pinned: true,
      awarded: true,
      userVote: "up",
      tags: ["festivals", "outdoor", "weather", "planning"]
    },
    {
      id: "2",
      title: "Recommended wireless IEM systems for large venues?",
      content: "I'm upgrading our IEM setup for arena tours. Currently looking at Shure PSM1000 vs Sennheiser EW IEM G4. Anyone have real-world experience with either at scale? Main concerns are battery life, range, and interference management.",
      author: "audio_mike",
      authorImage: "/api/placeholder/40/40",
      authorFlair: "Audio Engineer",
      category: "Audio",
      timestamp: "2024-10-10T12:15:00Z",
      upvotes: 189,
      downvotes: 8,
      comments: 45,
      views: 1823,
      userVote: null,
      tags: ["audio", "IEM", "wireless", "equipment"]
    },
    {
      id: "3",
      title: "How do you handle difficult clients who constantly change production requirements?",
      content: "Dealing with a client who keeps making major changes to staging, lighting, and audio requirements just weeks before the event. Contract covers some change orders but this is excessive. How do you navigate this professionally while protecting your crew and budget?",
      author: "production_pro",
      authorImage: "/api/placeholder/40/40",
      authorFlair: "Technical Director",
      category: "Business",
      timestamp: "2024-10-10T10:45:00Z",
      upvotes: 456,
      downvotes: 12,
      comments: 123,
      views: 4567,
      awarded: true,
      userVote: "up",
      tags: ["client management", "business", "contracts"]
    },
    {
      id: "4",
      title: "LED wall pricing - am I getting ripped off?",
      content: "Got a quote for LED wall rental: 20x10ft ROE CB5 for $12,000/week including tech. Is this reasonable for 2024 pricing? Nashville market. Thanks!",
      author: "lighting_tech",
      category: "Equipment",
      timestamp: "2024-10-10T09:20:00Z",
      upvotes: 92,
      downvotes: 15,
      comments: 34,
      views: 892,
      userVote: null,
      tags: ["LED", "pricing", "rental"]
    },
    {
      id: "5",
      title: "Career advice: Should I specialize or stay generalist?",
      content: "I'm 5 years into production work and doing a bit of everything - audio, lighting, video, stage management. Some people say specialize to make more money, others say being versatile is more valuable. What's been your experience? I enjoy variety but wondering if I'm limiting my growth.",
      author: "crew_member",
      authorImage: "/api/placeholder/40/40",
      category: "Career",
      timestamp: "2024-10-10T08:00:00Z",
      upvotes: 678,
      downvotes: 21,
      comments: 156,
      views: 5234,
      awarded: true,
      userVote: null,
      tags: ["career", "advice", "professional development"]
    },
    {
      id: "6",
      title: "Safety tip: Always check rigging points before load-in",
      content: "PSA after today's close call. Always personally verify rigging points even if venue says they're rated. Found undersized shackles that would have failed under load. Speak up even if it delays schedule. No show is worth someone getting hurt.",
      author: "rigger_safety",
      authorImage: "/api/placeholder/40/40",
      authorFlair: "Certified Rigger",
      category: "Safety",
      timestamp: "2024-10-09T20:15:00Z",
      upvotes: 1234,
      downvotes: 5,
      comments: 89,
      views: 8976,
      pinned: true,
      awarded: true,
      userVote: "up",
      tags: ["safety", "rigging", "best practices"]
    },
    {
      id: "7",
      title: "What's everyone using for show control software these days?",
      content: "Curious what the community recommends for integrated show control. Need to sync lighting (MA3), video (Resolume), and audio cues. Looking at Bitfocus Companion vs Show Cue Systems. Budget around $5k for hardware/software.",
      author: "tech_director",
      category: "Technology",
      timestamp: "2024-10-09T18:30:00Z",
      upvotes: 134,
      downvotes: 7,
      comments: 52,
      views: 1456,
      userVote: null,
      tags: ["show control", "software", "integration"]
    },
    {
      id: "8",
      title: "Burned out after summer festival season - how do you recover?",
      content: "Just finished back-to-back festivals June through September. Physically and mentally exhausted. How do you all handle the intense festival season and recover afterward? Considering taking time off but worried about missing opportunities.",
      author: "festival_crew",
      authorImage: "/api/placeholder/40/40",
      category: "Lifestyle",
      timestamp: "2024-10-09T16:00:00Z",
      upvotes: 423,
      downvotes: 18,
      comments: 97,
      views: 3421,
      userVote: null,
      tags: ["burnout", "mental health", "work-life balance"]
    }
  ])

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
