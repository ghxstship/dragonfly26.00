"use client"

import { useState, useEffect } from "react"
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
import { CreateItemDialogEnhanced } from "@/components/shared/create-item-dialog-enhanced"

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

export function StudiosTab({ data = [], loading = false }: StudiosTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "my-studios" | "suggested">("all")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const [studios, setStudios] = useState<Studio[]>([])

  // Transform and update studios when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: Studio[] = data.map((item: any) => ({
        id: item.id,
        name: item.name || 'Unnamed Studio',
        type: 'page', // Companies are treated as pages
        category: item.industry || 'Professional',
        description: item.description || 'No description available',
        image: item.logo_url,
        coverImage: undefined,
        members: 0, // Not tracked yet
        posts: 0, // Not tracked yet
        visibility: 'public',
        verified: false,
        role: undefined,
        recentActivity: item.updated_at ? `Updated ${new Date(item.updated_at).toLocaleDateString()}` : 'No recent activity',
        tags: item.industry ? [item.industry] : [],
        joined: false
      }))
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
  const totalMembers = studios.filter(s => s.joined).reduce((acc, s) => acc + s.members, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">My Studios</div>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStudiosCount}</div>
            <p className="text-xs text-muted-foreground">Pages & groups</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Reach</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalMembers / 1000).toFixed(1)}K</div>
            <p className="text-xs text-muted-foreground">Combined members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Suggestions</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studios.filter(s => !s.joined).length}
            </div>
            <p className="text-xs text-muted-foreground">Recommended for you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Activity</div>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">Posts this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Studio Button */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Create Your Own Studio</h3>
              <p className="text-sm text-muted-foreground">
                Start a page for your company or a group for your community
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Studio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search studios, pages, and groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="my-studios">My Studios</TabsTrigger>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Studios List */}
      <div className="space-y-4">
        {filteredStudios.length === 0 ? (
          <Card>
            <CardContent className="p-0">
              <EmptyState
                variant="inline"
                icon={Building2}
                mainMessage={searchQuery || filter !== "all" ? "No studios found" : "NOTHING TO SEE HERE... (YET)"}
                description={searchQuery || filter !== "all" ? "Try adjusting your search criteria" : "Discover and connect with production studios"}
              />
            </CardContent>
          </Card>
        ) : (
          filteredStudios.map((studio) => (
            <Card key={studio.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                {/* Cover Image */}
                {studio.coverImage && (
                  <div 
                    className="h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${studio.coverImage})` }}
                  />
                )}

                <div className="p-6">
                  <div className="flex gap-4">
                    {/* Studio Avatar */}
                    <Avatar className="h-20 w-20 border-4 border-background -mt-12">
                      <AvatarImage src={studio.image} />
                      <AvatarFallback>
                        {studio.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Studio Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold truncate">{studio.name}</h3>
                            {studio.verified && (
                              <Badge variant="secondary" className="h-5">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                            <Badge variant="outline">
                              {studio.type === "page" ? "Page" : "Group"}
                            </Badge>
                            <span className="flex items-center gap-1">
                              {studio.visibility === "public" ? (
                                <Globe className="h-3 w-3" />
                              ) : (
                                <Lock className="h-3 w-3" />
                              )}
                              {studio.visibility === "public" ? "Public" : "Private"}
                            </span>
                            <span>{studio.category}</span>
                          </div>
                        </div>
                        {studio.joined && (
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {studio.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{studio.members.toLocaleString()}</span>
                          <span className="text-muted-foreground">members</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
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
                        {studio.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Activity */}
                      <p className="text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3 inline mr-1" />
                        {studio.recentActivity}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {studio.joined ? (
                          <>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-2" />
                              View Posts
                            </Button>
                            <Button variant="outline" size="sm">
                              <Bell className="h-4 w-4 mr-2" />
                              Notifications
                            </Button>
                            {studio.role === "owner" || studio.role === "admin" ? (
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
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
                              <Plus className="h-4 w-4 mr-2" />
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

      {/* Create Studio Dialog */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId="community"
        tabSlug="studios"
        onSuccess={(item) => {
          console.log("Created studio:", item)
        }}
      />
    </div>
  )
}
