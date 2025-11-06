"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  MapPin,
  Users, 
  Star,
  Search,
  Filter,
  Plus,
  Bell,
  Settings,
  TrendingUp,
  MessageSquare,
  Calendar,
  Lock,
  Globe,
  MoreHorizontal
} from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCommunityData } from "@/hooks/use-community-data"

interface StudiosTabProps {
  data?: any[]
  loading?: boolean
}

interface Studio {
  id: string
  name: string
  type: "page" | "group"
  category: string
  description: string
  image?: string
  coverImage?: string
  members: number
  posts: number
  visibility: "public" | "private"
  verified?: boolean
  role?: "owner" | "admin" | "moderator" | "member"
  recentActivity: string
  tags: string[]
  joined?: boolean
}

export function StudiosTab({ data = [], loading: loadingProp = false }: StudiosTabProps) {
  const { posts, loading: liveLoading } = useCommunityData()
  const loading = loadingProp || liveLoading
  const t = useTranslations('community.studios')
  const tCommon = useTranslations('common')
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "my-studios" | "suggested">("all")

  const [studios, setStudios] = useState<Studio[]>([])

  // Transform and update studios when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: Studio[] = data.map((item: any) => {
        const record = item as any
        return {
          id: record.id,
          name: record.name || 'Unnamed Studio',
          type: 'page', // Companies are treated as pages
          category: record.industry || 'Professional',
          description: record.description || 'No description available',
          image: record.logo_url,
          coverImage: undefined,
          members: 0, // Not tracked yet
          posts: 0, // Not tracked yet
          visibility: 'public',
          verified: false,
          role: undefined,
          recentActivity: record.updated_at ? `Updated ${new Date(record.updated_at).toLocaleDateString()}` : 'No recent activity',
          tags: record.industry ? [record.industry] : [],
          joined: false
        }
      })
      setStudios(transformed)
    }
  }, [data])

  const handleJoin = (studioId: string) => {
    setStudios(studios.map(studio =>
      studio.id === studioId ? { ...studio, joined: true, members: studio.members + 1 } : studio
    ))
  }

  const handleLeave = (studioId: string) => {
    setStudios(studios.map(studio =>
      studio.id === studioId ? { ...studio, joined: false, members: studio.members - 1 } : studio
    ))
  }

  const filteredStudios = studios.filter(studio => {
    const matchesSearch = studio.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         studio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         studio.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesFilter = filter === "all" || 
                         (filter === "my-studios" && studio.joined) ||
                         (filter === "suggested" && !studio.joined)
    
    return matchesSearch && matchesFilter
  })

  const myStudiosCount = studios.filter(s => s.joined).length
  const totalMembers = studios.filter(s => s.joined).reduce((acc: number, s: Studio) => acc + s.members, 0)

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('myStudios')}</div>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{myStudiosCount as any}</div>
            <p className="text-xs text-muted-foreground">Pages & groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Reach</div>
            <Users aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{(totalMembers / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Combined members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('suggestions')}</div>
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {studios.filter(s => !s.joined).length}
            </div>
            <p className="text-xs text-muted-foreground">Recommended for you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('activity')}</div>
            <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Posts this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Studio Button */}
      <Card aria-hidden="true" className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
        <CardContent aria-hidden="true" className="p-4 sm:p-6">
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Create Your Own Studio</h3>
              <p className="text-sm text-muted-foreground">
                Start a page for your company or a group for your community
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent aria-hidden="true" className="pt-6">
          <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-3 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('searchStudios')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={filter as any} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="my-studios">{t('myStudios')}</TabsTrigger>
                <TabsTrigger value="suggested">{t('suggested')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Studios List */}
      <div className="space-y-4">
        {filteredStudios.length === 0 ? (
          <Card>
            <CardContent aria-hidden="true" className="p-0">
              <EmptyState
                variant="inline"
                icon={Building2}
                mainMessage={searchQuery || filter !== "all" ? t('noStudiosFound') : t('nothingToSeeYet')}
                description={searchQuery || filter !== "all" ? t('tryAdjustingSearch') : t('discoverStudios')}
              />
            </CardContent>
          </Card>
        ) : (
          filteredStudios.map((studio: any) => (
            <Card key={studio.id} className="overflow-hidden md:block hover:shadow-md transition-shadow">
              <CardContent aria-hidden="true" className="p-0">
                {/* Cover Image */}
                {studio.coverImage && (
                  <div 
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${studio.coverImage})` }}
                  />
                )}

                <div className="p-4 sm:p-6">
                  <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                    {/* Studio Avatar */}
                    <Avatar aria-hidden="true" className="h-20 w-20 border-4 border-background -mt-12">
                      <AvatarImage src={studio.image} />
                      <AvatarFallback>
                        {studio.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Studio Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 md:gap-3 lg:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
                            <h3 className="text-base md:text-lg lg:text-xl font-semibold truncate">{studio.name}</h3>
                            {studio.verified && (
                              <Badge variant="secondary" className="h-5">
                                <Star aria-hidden="true" className="h-3 w-3 mr-1 fill-current" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap flex-col md:flex-row items-center gap-3 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline">
                              {studio.type === "page" ? "Page" : "Group"}
                            </Badge>
                            <span className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                              {studio.visibility === "public" ? (
                                <Globe aria-hidden="true" className="h-3 w-3" />
                              ) : (
                                <Lock aria-hidden="true" className="h-3 w-3" />
                              )}
                              {studio.visibility === "public" ? t('public') : t('private')}
                            </span>
                            <span>{studio.category}</span>
                          </div>
                        </div>
                        {studio.joined && (
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {studio.description}
                      </p>

                      {/* Stats */}
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-sm mb-3">
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          <Users aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{studio.members.toLocaleString()}</span>
                          <span className="text-muted-foreground">members</span>
                        </div>
                        <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                          <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{studio.posts.toLocaleString()}</span>
                          <span className="text-muted-foreground">posts</span>
                        </div>
                        {studio.role && (
                          <Badge variant="secondary" className="capitalize">
                            {studio.role}
                          </Badge>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {studio.tags.map((tag: any) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Activity */}
                      <p className="text-xs text-muted-foreground mb-4">
                        <Calendar aria-hidden="true" className="h-3 w-3 inline mr-1" />
                        {studio.recentActivity}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        {studio.joined ? (
                          <>
                            <Button variant="outline" size="sm">
                              <MessageSquare aria-hidden="true" className="h-4 w-4 mr-2" />
                              View Posts
                            </Button>
                            <Button variant="outline" size="sm">
                              <Bell aria-hidden="true" className="h-4 w-4 mr-2" />
                              Notifications
                            </Button>
                            {studio.role === "owner" || studio.role === "admin" ? (
                              <Button variant="outline" size="sm">
                                <Settings aria-hidden="true" className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLeave(studio.id)}
                              >
                                Leave
                              </Button>
                            )}
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleJoin(studio.id)}
                            >
                              <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </>
                        )}
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
