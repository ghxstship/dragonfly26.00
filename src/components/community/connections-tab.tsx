"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  MessageSquare,
  Mail,
  MapPin,
  Briefcase,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Award,
  Calendar
} from "lucide-react"

interface ConnectionsTabProps {
  data?: any[]
  loading?: boolean
}

interface Connection {
  id: string
  name: string
  title: string
  company: string
  location: string
  image?: string
  connectionDate: string
  mutualConnections: number
  skills: string[]
  recentActivity?: string
  status: "connected" | "pending" | "suggested"
  verified?: boolean
}

export function ConnectionsTab({ data = [], loading = false }: ConnectionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "connected" | "pending" | "suggested">("all")

  const [connections, setConnections] = useState<Connection[]>(data.length > 0 ? data : [
    {
      id: "1",
      name: "Sarah Mitchell",
      title: "Production Director",
      company: "Stellar Events",
      location: "Los Angeles, CA",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-03-15",
      mutualConnections: 45,
      skills: ["Production Management", "Stage Design", "Team Leadership"],
      recentActivity: "Posted about Global Music Awards success",
      status: "connected",
      verified: true
    },
    {
      id: "2",
      name: "Marcus Chen",
      title: "Lighting Designer",
      company: "LightCraft Studios",
      location: "New York, NY",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-05-20",
      mutualConnections: 32,
      skills: ["Lighting Design", "Programming", "Creative Direction"],
      recentActivity: "Won Excellence in Lighting Design Award",
      status: "connected",
      verified: true
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      title: "Festival Director",
      company: "Horizon Festivals",
      location: "Austin, TX",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-06-10",
      mutualConnections: 67,
      skills: ["Event Management", "Logistics", "Vendor Relations"],
      recentActivity: "Successfully ran Sunset Festival 2024",
      status: "connected",
      verified: true
    },
    {
      id: "4",
      name: "David Park",
      title: "Technical Director",
      company: "Apex Productions",
      location: "Nashville, TN",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-07-05",
      mutualConnections: 28,
      skills: ["Technical Direction", "Audio Engineering", "Project Management"],
      status: "connected"
    },
    {
      id: "5",
      name: "Jessica Martinez",
      title: "Stage Manager",
      company: "Premier Productions",
      location: "Chicago, IL",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-08-12",
      mutualConnections: 19,
      skills: ["Stage Management", "Coordination", "Problem Solving"],
      status: "pending"
    },
    {
      id: "6",
      name: "Robert Williams",
      title: "Audio Engineer",
      company: "SoundWave Pro",
      location: "Miami, FL",
      image: "/api/placeholder/40/40",
      connectionDate: "",
      mutualConnections: 52,
      skills: ["Audio Engineering", "Mixing", "System Design"],
      status: "suggested"
    },
    {
      id: "7",
      name: "Lisa Johnson",
      title: "Tour Manager",
      company: "Road Warriors Touring",
      location: "Denver, CO",
      image: "/api/placeholder/40/40",
      connectionDate: "",
      mutualConnections: 41,
      skills: ["Tour Management", "Logistics", "Crew Management"],
      status: "suggested"
    },
    {
      id: "8",
      name: "Michael Thompson",
      title: "Lighting Technician",
      company: "Bright Ideas LLC",
      location: "Seattle, WA",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-09-01",
      mutualConnections: 15,
      skills: ["Lighting", "Rigging", "Troubleshooting"],
      recentActivity: "Shared lighting setup tips",
      status: "connected"
    },
    {
      id: "9",
      name: "Amanda Garcia",
      title: "Video Engineer",
      company: "Visual Dynamics",
      location: "San Francisco, CA",
      image: "/api/placeholder/40/40",
      connectionDate: "",
      mutualConnections: 38,
      skills: ["Video Engineering", "LED Walls", "Broadcast"],
      status: "suggested"
    },
    {
      id: "10",
      name: "Kevin Lee",
      title: "Production Coordinator",
      company: "Event Masters",
      location: "Boston, MA",
      image: "/api/placeholder/40/40",
      connectionDate: "2024-04-18",
      mutualConnections: 23,
      skills: ["Coordination", "Scheduling", "Vendor Management"],
      status: "pending"
    }
  ])

  const handleConnect = (connectionId: string) => {
    setConnections(connections.map(conn =>
      conn.id === connectionId
        ? { ...conn, status: conn.status === "suggested" ? "pending" : "connected" }
        : conn
    ))
  }

  const handleWithdraw = (connectionId: string) => {
    setConnections(connections.map(conn =>
      conn.id === connectionId
        ? { ...conn, status: "suggested" }
        : conn
    ))
  }

  const filteredConnections = connections.filter(conn => {
    const matchesSearch = conn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conn.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || conn.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const connectedCount = connections.filter(c => c.status === "connected").length
  const pendingCount = connections.filter(c => c.status === "pending").length
  const suggestedCount = connections.filter(c => c.status === "suggested").length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Connections</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedCount}</div>
            <p className="text-xs text-muted-foreground">Professional network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Pending</div>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Suggestions</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suggestedCount}</div>
            <p className="text-xs text-muted-foreground">People you may know</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Growth</div>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search connections by name, title, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="connected">Connected</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="suggested">Suggested</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Connections Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredConnections.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No connections found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          filteredConnections.map((connection) => (
            <Card key={connection.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={connection.image} />
                    <AvatarFallback>
                      {connection.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{connection.name}</h3>
                          {connection.verified && (
                            <Badge variant="secondary" className="h-5 px-1">
                              <UserCheck className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{connection.title}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">{connection.company}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{connection.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        <span>{connection.mutualConnections} mutual connections</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {connection.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Recent Activity */}
                    {connection.recentActivity && connection.status === "connected" && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {connection.recentActivity}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      {connection.status === "connected" && (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </Button>
                        </>
                      )}
                      {connection.status === "pending" && (
                        <>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleWithdraw(connection.id)}
                          >
                            Withdraw
                          </Button>
                        </>
                      )}
                      {connection.status === "suggested" && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleConnect(connection.id)}
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Connect
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            View Profile
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Connection Date */}
                    {connection.connectionDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Connected on {new Date(connection.connectionDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Network Growth Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Grow Your Network
          </CardTitle>
          <CardDescription>Tips to expand your professional connections</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Connect with colleagues from recent productions and events</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Engage with posts and share your own experiences to increase visibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Endorse connections for their skills to strengthen relationships</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Join industry groups and participate in discussions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
