"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
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
  MoreHorizontal,
  Paperclip,
  File,
  Plus
} from "lucide-react"
import { FileAttachmentButton } from "@/components/files/file-attachment-button"
import { LevelBadge } from "./level-badge"
import { Poll } from "./poll"
import { useMemberLevel } from "@/hooks/use-member-level"

interface ActivityPost {
  id: string
  author: string
  author_id?: string
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
  poll_options?: string[]
  poll_votes?: Record<string, string[]>
  poll_expires_at?: string | null
  poll_allow_multiple?: boolean
}

interface ActivityTabProps {
  data?: any[]
  loading?: boolean
  workspaceId?: string
}

export function ActivityTab({ data = [], loading = false, workspaceId }: ActivityTabProps) {
  const t = useTranslations('community.activity')
  const tCommon = useTranslations('common')
  const [newPost, setNewPost] = useState("")
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  
  const [posts, setPosts] = useState<ActivityPost[]>([])
  
  // Update posts when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed = data.map((item: any) => {
        const record = item as any
        return {
          id: record.id,
          author: record.author ? `${record.author.first_name} ${record.author.last_name}` : 'Unknown',
          author_id: record.author_id,
          authorTitle: record.author?.job_title || 'Community Member',
          authorImage: record.author?.avatar_url,
          content: record.content || '',
          image: record.media_urls?.[0],
          timestamp: record.created_at,
          likes: record.likes_count || 0,
          comments: record.comments_count || 0,
          shares: record.shares_count || 0,
          isLiked: false,
          tags: record.tags || [],
          poll_options: record.poll_options || null,
          poll_votes: record.poll_votes || {},
          poll_expires_at: record.poll_expires_at || null,
          poll_allow_multiple: record.poll_allow_multiple || false
        }
      })
      setPosts(transformed)
    }
  }, [data])

  const characterLimit = 500
  const charactersRemaining = characterLimit - newPost.length

  const handlePostSubmit = async () => {
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
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
{/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('activityFeed')}</div>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{posts.length}</div>
            <p className="text-xs text-muted-foreground">{t('recentPosts')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('engagement')}</div>
            <Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {posts.reduce((acc: number, p: ActivityPost) => acc + p.likes, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('totalLikes')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('trending')}</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {posts.filter(p => p.likes > 500).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('popularPosts')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('activeUsers')}</div>
            <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">1.2K</div>
            <p className="text-xs text-muted-foreground">{t('onlineNow')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle>{t('shareUpdate')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder={t('placeholder')}
              value={newPost as any}
              onChange={(e) => {
                if (e.target.value.length <= characterLimit) {
                  setNewPost(e.target.value)
                }
              }}
              className="min-h-[120px] resize-none"
            />
            <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <FileAttachmentButton 
                  onFilesSelected={setAttachedFiles}
                  maxFiles={3}
                  acceptedTypes="image/*,.pdf,.doc,.docx"
                />
              </div>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4">
                <span className={`text-sm ${
                  charactersRemaining < 50 ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {charactersRemaining}/{characterLimit}
                </span>
                <Button 
                  onClick={handlePostSubmit}
                  disabled={!newPost.trim() || newPost.length > characterLimit}
                >
                  <Send className="h-4 w-4 mr-2" aria-hidden="true" />
                  {t('post')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="space-y-4">
        {posts.map((post: any) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.authorImage} />
                    <AvatarFallback>{post.author.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                      <p className="font-semibold text-sm">{post.author}</p>
                      {post.author_id && <PostAuthorLevel authorId={post.author_id} workspaceId={workspaceId} />}
                    </div>
                    <p className="text-xs text-muted-foreground">{post.authorTitle}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo(post.timestamp)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              {/* Post Content */}
              <p className="mb-3 text-sm leading-relaxed">{post.content}</p>

              {/* Post Image */}
              {post.image && (
                <div className="mb-3 rounded-lg overflow-hidden md:block">
                  <div 
                    className="h-48 md:h-56 lg:h-64 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                </div>
              )}

              {/* Poll */}
              {post.poll_options && post.poll_options.length > 0 && (
                <div className="mb-3">
                  <Poll 
                    options={post.poll_options}
                    votes={post.poll_votes}
                    expiresAt={post.poll_expires_at}
                    allowMultiple={post.poll_allow_multiple}
                    onVote={(optionIndex) => {
                      console.log('Voted for option:', optionIndex)
                      // TODO: Implement vote submission to Supabase
                    }}
                  />
                </div>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag: any) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Engagement Stats */}
              <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between py-2 border-t text-xs text-muted-foreground">
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                  <span>{post.likes} {t('likes')}</span>
                  <span>{post.comments} {t('comments')}</span>
                  <span>{post.shares} {t('shares')}</span>
                </div>
              </div>

            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline">{t('loadMore')}</Button>
      </div>
    </div>
  )
}

// Helper component to fetch and display author level
function PostAuthorLevel({ authorId, workspaceId }: { authorId: string; workspaceId?: string }) {
  const { level } = useMemberLevel(workspaceId || '', authorId)
  
  if (!level) return null
  
  return <LevelBadge level={level.level} points={level.points} size="sm" />
}
