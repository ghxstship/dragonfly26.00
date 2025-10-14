"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Users, 
  Plus,
  Bell,
  Settings,
  Search,
  TrendingUp,
  MessageSquare,
  Calendar,
  Lock,
  Globe,
  Star,
  MoreHorizontal
} from "lucide-react"

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

  const [studios, setStudios] = useState<Studio[]>([
    {
      id: "1",
      name: "Live Production Professionals",
      type: "group",
      category: "Professional Group",
      description: "The largest community for live event production professionals. Share knowledge, network, find opportunities, and stay updated on industry trends.",
      image: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/800/200",
      members: 45820,
      posts: 2341,
      visibility: "public",
      verified: true,
      role: "member",
      recentActivity: "125 posts this week",
      tags: ["Production", "Networking", "Industry News"],
      joined: true
    },
    {
      id: "2",
      name: "Stellar Events",
      type: "page",
      category: "Production Company",
      description: "Award-winning event production company specializing in concerts, festivals, and corporate events. Follow us for behind-the-scenes content, job opportunities, and industry insights.",
      image: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/800/200",
      members: 12400,
      posts: 567,
      visibility: "public",
      verified: true,
      recentActivity: "Posted 3 hours ago",
      tags: ["Events", "Production", "Jobs"],
      joined: true
    },
    {
      id: "3",
      name: "Audio Engineers United",
      type: "group",
      category: "Technical Community",
      description: "A dedicated space for audio engineers to discuss techniques, troubleshoot issues, share gear reviews, and collaborate on projects.",
      image: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/800/200",
      members: 28500,
      posts: 4567,
      visibility: "public",
      role: "moderator",
      recentActivity: "342 posts this week",
      tags: ["Audio", "Engineering", "Technical"],
      joined: true
    },
    {
      id: "4",
      name: "Festival Production Network",
      type: "group",
      category: "Industry Network",
      description: "Connect with festival production professionals worldwide. Share best practices, discuss logistics, and find crew for upcoming festivals.",
      image: "/api/placeholder/80/80",
      members: 19200,
      posts: 1823,
      visibility: "private",
      role: "admin",
      recentActivity: "89 posts this week",
      tags: ["Festivals", "Production", "Logistics"],
      joined: true
    },
    {
      id: "5",
      name: "LightCraft Studios",
      type: "page",
      category: "Design Studio",
      description: "Innovative lighting design studio creating breathtaking experiences for concerts, theater, and events. Check out our portfolio and career opportunities.",
      image: "/api/placeholder/80/80",
      coverImage: "/api/placeholder/800/200",
      members: 8900,
      posts: 234,
      visibility: "public",
      verified: true,
      recentActivity: "Posted yesterday",
      tags: ["Lighting", "Design", "Creative"],
      joined: false
    },
    {
      id: "6",
      name: "Stage Management Professionals",
      type: "group",
      category: "Professional Group",
      description: "For stage managers to exchange ideas, share resources, discuss challenges, and support each other in this demanding but rewarding role.",
      image: "/api/placeholder/80/80",
      members: 15600,
      posts: 2109,
      visibility: "public",
      recentActivity: "201 posts this week",
      tags: ["Stage Management", "Production", "Resources"],
      joined: false
    },
    {
      id: "7",
      name: "Touring Crew Collective",
      type: "group",
      category: "Community",
      description: "Private group for touring professionals to share experiences, tips for life on the road, and stay connected while traveling.",
      image: "/api/placeholder/80/80",
      members: 9800,
      posts: 3421,
      visibility: "private",
      recentActivity: "156 posts this week",
      tags: ["Touring", "Crew", "Travel"],
      joined: true
    },
    {
      id: "8",
      name: "Rigging & Safety Coalition",
      type: "group",
      category: "Safety Network",
      description: "Dedicated to promoting safe rigging practices, sharing knowledge, and advancing safety standards in the entertainment industry.",
      image: "/api/placeholder/80/80",
      members: 22100,
      posts: 1567,
      visibility: "public",
      verified: true,
      recentActivity: "178 posts this week",
      tags: ["Rigging", "Safety", "Best Practices"],
      joined: false
    },
    {
      id: "9",
      name: "Event Tech Innovators",
      type: "group",
      category: "Technology",
      description: "Explore cutting-edge technology in event production. Discuss new gear, software, techniques, and innovations shaping the future of live events.",
      image: "/api/placeholder/80/80",
      members: 31400,
      posts: 2891,
      visibility: "public",
      recentActivity: "267 posts this week",
      tags: ["Technology", "Innovation", "Gear"],
      joined: false
    },
    {
      id: "10",
      name: "Production Mentorship Network",
      type: "group",
      category: "Education",
      description: "Connecting experienced professionals with those starting their careers. Request advice, find mentors, and give back to the next generation.",
      image: "/api/placeholder/80/80",
      members: 12700,
      posts: 891,
      visibility: "public",
      recentActivity: "94 posts this week",
      tags: ["Mentorship", "Education", "Career"],
      joined: true
    }
  ])

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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Studio
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
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No studios found matching your criteria</p>
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
    </div>
  )
}
