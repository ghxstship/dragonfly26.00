"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
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
import { useCommunityData } from "@/hooks/use-community-data"

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

export function DiscussionsTab({ data = [], loading: loadingProp = false }: DiscussionsTabProps) {
  const { posts, loading: liveLoading } = useCommunityData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('community.discussions')
  const tCommon = useTranslations('common')
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<"all" | Discussion["category"]>("all")
  const [sortBy, setSortBy] = useState<"hot" | "new" | "top">("hot")

  const [discussions, setDiscussions] = useState<Discussion[]>([])

  // Transform and update discussions when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: Discussion[] = data.map((item: any) => {
        const record = item as any
        return {
          id: record.id,
          title: record.title || 'Untitled Discussion',
          content: record.content || '',
          author: record.author ? `${record.author.first_name}_${record.author.last_name}`.toLowerCase() : 'anonymous',
          authorImage: record.author?.avatar_url,
          authorFlair: record.author?.job_title,
          category: record.tags?.[0] || 'General',
          timestamp: record.created_at,
          upvotes: record.likes_count || 0,
          downvotes: 0, // Not tracked yet
          comments: record.comments_count || 0,
          views: 0, // Not tracked yet
          pinned: record.is_featured || false,
          locked: false,
          awarded: (record.likes_count || 0) > 100,
          userVote: null,
          tags: record.tags || []
        }
      })
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
    .sort((a: any, b: any) => {
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
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('discussions')}</div>
            <MessageSquare className="h-4 w-4 text-muted-foreground"  aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{discussions.length}</div>
            <p className="text-xs text-muted-foreground">Active threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('comments')}</div>
            <MessageCircle className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {discussions.reduce((acc: number, d: Discussion) => acc + d.comments, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total replies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Hot Topics</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {discussions.filter(d => d.upvotes > 200).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('trending')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Your Posts</div>
            <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">{t('contributions')}</p>
          </CardContent>
        </Card>
      </div>


      {/* Search and Sort */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute sm:relative sm:inset-auto left-3 top-3 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" aria-hidden="true" />
              <Input
                placeholder={t('searchDiscussions')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={sortBy as any} onValueChange={(v) => setSortBy(v as any)}>
              <TabsList>
                <TabsTrigger value="hot">
                  <TrendingUp className="h-4 w-4 mr-2" aria-hidden="true" />
                  Hot
                </TabsTrigger>
                <TabsTrigger value="new">
                  <Clock className="h-4 w-4 mr-2" aria-hidden="true" />
                  New
                </TabsTrigger>
                <TabsTrigger value="top">
                  <ArrowUp className="h-4 w-4 mr-2"  aria-hidden="true" />
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
            <CardContent className="p-0">
              <EmptyState
                variant="inline"
                icon={MessageSquare}
                mainMessage={searchQuery ? t('noDiscussionsFound') : t('nothingToSeeYet')}
                description={searchQuery ? t('tryAdjustingSearch') : t('engageWithCommunity')}
                actionLabel={!searchQuery ? t('startDiscussion') : undefined}
                onAction={!searchQuery ? () => {} : undefined}
              />
            </CardContent>
          </Card>
        ) : (
          filteredDiscussions.map((discussion: any) => (
            <Card key={discussion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                  {/* Vote Column */}
                  <div className="flex flex-wrap flex-col md:flex-row flex-col items-center gap-1 min-w-[48px]">
                    <Button 
                      variant={discussion.userVote === "up" ? "default" : "ghost"} 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleVote(discussion.id, "up")}
                    >
                      <ArrowUp className="h-4 w-4"  aria-hidden="true" />
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
                      <ArrowDown className="h-4 w-4"  aria-hidden="true" />
                    </Button>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 mb-2">
                      {discussion.pinned && (
                        <Pin className="h-4 w-4 text-primary flex-shrink-0 mt-1"  aria-hidden="true" />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer">
                          {discussion.title}
                        </h3>
                        <div className="flex flex-col md:flex-row flex-wrap items-center gap-2 text-xs text-muted-foreground">
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
                              <Award className="h-3 w-3 text-yellow-500 fill-current" aria-hidden="true" />
                            </>
                          )}
                          {discussion.locked && (
                            <>
                              <span>•</span>
                              <Lock className="h-3 w-3"  aria-hidden="true" />
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
                      {discussion.tags.map((tag: any) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                        {discussion.comments} Comments
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Bookmark className="h-4 w-4 mr-2"  aria-hidden="true" />
                        Save
                      </Button>
                      <div className="ml-auto flex flex-wrap flex-col md:flex-row items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3"  aria-hidden="true" />
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
