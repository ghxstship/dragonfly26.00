"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/shared/empty-state"
import { 
  Trophy, 
  Medal,
  Award,
  TrendingUp,
  Users,
  Clock,
  Target,
  Star,
  Crown,
  Zap,
  Calendar,
  Flag,
  Search,
  Play
} from "lucide-react"

interface CompetitionsTabProps {
  data?: any[]
  loading?: boolean
}

interface Competition {
  id: string
  title: string
  description: string
  category: "design" | "speed" | "innovation" | "teamwork"
  startDate: string
  endDate: string
  status: "active" | "upcoming" | "completed"
  participants: number
  prize: string
  image?: string
  joined?: boolean
}

interface LeaderboardEntry {
  rank: number
  previousRank?: number
  userId: string
  name: string
  title: string
  image?: string
  score: number
  badges: string[]
  streak: number
}

export function CompetitionsTab({ data = [], loading = false }: CompetitionsTabProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [competitionFilter, setCompetitionFilter] = useState<"all" | "active" | "upcoming" | "completed">("all")

  const [competitions, setCompetitions] = useState<Competition[]>([])

  // Transform and update competitions when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      const transformed: Competition[] = data.map((item: any) => {
        // Try to extract dates and prize info from content
        const now = new Date()
        const startDate = item.created_at
        const endDate = item.created_at // Placeholder
        
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        let status: "active" | "upcoming" | "completed" = "active"
        if (now < start) status = "upcoming"
        else if (now > end) status = "completed"
        
        return {
          id: item.id,
          title: item.title || 'Untitled Competition',
          description: item.content || '',
          category: 'innovation', // Default category
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          status,
          participants: item.comments_count || 0,
          prize: 'TBA',
          image: item.media_urls?.[0],
          joined: false
        }
      })
      setCompetitions(transformed)
    }
  }, [data])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      previousRank: 1,
      userId: "1",
      name: "Sarah Mitchell",
      title: "Production Director",
      image: "/api/placeholder/40/40",
      score: 9845,
      badges: ["Champion", "Innovator", "Team Player"],
      streak: 12
    },
    {
      rank: 2,
      previousRank: 3,
      userId: "2",
      name: "Marcus Chen",
      title: "Lighting Designer",
      image: "/api/placeholder/40/40",
      score: 9234,
      badges: ["Design Master", "Speed Demon"],
      streak: 8
    },
    {
      rank: 3,
      previousRank: 2,
      userId: "3",
      name: "Emily Rodriguez",
      title: "Festival Director",
      image: "/api/placeholder/40/40",
      score: 8976,
      badges: ["Team Leader", "Organizer"],
      streak: 15
    },
    {
      rank: 4,
      previousRank: 5,
      userId: "4",
      name: "David Park",
      title: "Technical Director",
      image: "/api/placeholder/40/40",
      score: 8543,
      badges: ["Tech Wizard", "Problem Solver"],
      streak: 6
    },
    {
      rank: 5,
      previousRank: 4,
      userId: "5",
      name: "Jessica Martinez",
      title: "Stage Manager",
      image: "/api/placeholder/40/40",
      score: 8321,
      badges: ["Coordinator", "Speed Demon"],
      streak: 9
    },
    {
      rank: 6,
      previousRank: 7,
      userId: "6",
      name: "Robert Williams",
      title: "Audio Engineer",
      image: "/api/placeholder/40/40",
      score: 7894,
      badges: ["Audio Expert"],
      streak: 4
    },
    {
      rank: 7,
      previousRank: 6,
      userId: "7",
      name: "Lisa Johnson",
      title: "Tour Manager",
      image: "/api/placeholder/40/40",
      score: 7654,
      badges: ["Tour Pro", "Organizer"],
      streak: 11
    },
    {
      rank: 8,
      previousRank: 9,
      userId: "8",
      name: "Michael Thompson",
      title: "Lighting Technician",
      image: "/api/placeholder/40/40",
      score: 7432,
      badges: ["Team Player"],
      streak: 3
    },
    {
      rank: 9,
      previousRank: 8,
      userId: "9",
      name: "Amanda Garcia",
      title: "Video Engineer",
      image: "/api/placeholder/40/40",
      score: 7123,
      badges: ["Visual Expert", "Innovator"],
      streak: 7
    },
    {
      rank: 10,
      previousRank: 11,
      userId: "10",
      name: "Kevin Lee",
      title: "Production Coordinator",
      image: "/api/placeholder/40/40",
      score: 6945,
      badges: ["Coordinator"],
      streak: 5
    }
  ])

  const handleJoin = (competitionId: string) => {
    setCompetitions(competitions.map(comp =>
      comp.id === competitionId
        ? { ...comp, joined: true, participants: comp.participants + 1 }
        : comp
    ))
  }

  const filteredCompetitions = competitions.filter(comp => {
    const matchesSearch = comp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comp.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = competitionFilter === "all" || comp.status === competitionFilter
    return matchesSearch && matchesFilter
  })

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10" }
    if (rank === 2) return { icon: Medal, color: "text-gray-400", bg: "bg-gray-400/10" }
    if (rank === 3) return { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10" }
    return { icon: Trophy, color: "text-muted-foreground", bg: "bg-muted" }
  }

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return null
    const change = previous - current
    if (change > 0) return { direction: "up", value: change, color: "text-green-500" }
    if (change < 0) return { direction: "down", value: Math.abs(change), color: "text-red-500" }
    return { direction: "same", value: 0, color: "text-muted-foreground" }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active</div>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitions.filter(c => c.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Competitions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Participating</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {competitions.filter(c => c.joined).length}
            </div>
            <p className="text-xs text-muted-foreground">Your entries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Your Rank</div>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#247</div>
            <p className="text-xs text-muted-foreground">Global ranking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Points</div>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">Competition points</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top performers across all competitions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View Full Rankings
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry) => {
              const rankBadge = getRankBadge(entry.rank)
              const rankChange = getRankChange(entry.rank, entry.previousRank)
              const RankIcon = rankBadge.icon

              return (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    entry.rank <= 3 ? rankBadge.bg : "bg-muted/30"
                  }`}
                >
                  {/* Rank */}
                  <div className="flex flex-col items-center min-w-[60px]">
                    <RankIcon className={`h-6 w-6 ${rankBadge.color}`} />
                    <span className="text-lg font-bold">#{entry.rank}</span>
                    {rankChange && rankChange.direction !== "same" && (
                      <div className={`flex items-center text-xs ${rankChange.color}`}>
                        <TrendingUp 
                          className={`h-3 w-3 ${
                            rankChange.direction === "down" ? "rotate-180" : ""
                          }`}
                        />
                        <span>{rankChange.value}</span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={entry.image} />
                    <AvatarFallback>
                      {entry.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{entry.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{entry.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Score & Streak */}
                  <div className="text-right">
                    <div className="text-xl font-bold">{entry.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">points</div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-orange-500">
                      <Zap className="h-3 w-3 fill-current" />
                      <span className="text-xs font-semibold">{entry.streak} day streak</span>
                    </div>
                  </div>
                </div>
              )
            })}
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
                placeholder="Search competitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={competitionFilter} onValueChange={(v) => setCompetitionFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Competitions Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredCompetitions.length === 0 ? (
          <Card className="col-span-2">
            <CardContent className="p-0">
              <EmptyState
                variant="inline"
                icon={Trophy}
                mainMessage={searchQuery || competitionFilter !== "all" ? "No competitions found" : "NOTHING TO SEE HERE... (YET)"}
                description={searchQuery || competitionFilter !== "all" ? "Try adjusting your filters" : "Join competitions to showcase your talent"}
              />
            </CardContent>
          </Card>
        ) : (
          filteredCompetitions.map((competition) => {
            const categoryIcons = {
              design: Award,
              speed: Zap,
              innovation: Target,
              teamwork: Users
            }
            const CategoryIcon = categoryIcons[competition.category]

            return (
              <Card key={competition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Competition Image */}
                  {competition.image && (
                    <div className="relative">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${competition.image})` }}
                      />
                      <Badge 
                        className={`absolute top-3 right-3 ${
                          competition.status === "active" ? "bg-green-500" :
                          competition.status === "upcoming" ? "bg-blue-500" :
                          "bg-gray-500"
                        }`}
                      >
                        {competition.status}
                      </Badge>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{competition.title}</h3>
                        <Badge variant="outline" className="capitalize text-xs">
                          {competition.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {competition.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{competition.participants} participants</span>
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Trophy className="h-4 w-4" />
                        <span>{competition.prize}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Active Competitions */}
                    {competition.status === "active" && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>Time Remaining</span>
                          <span>
                            {Math.ceil(
                              (new Date(competition.endDate).getTime() - new Date().getTime()) / 
                              (1000 * 60 * 60 * 24)
                            )} days
                          </span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {competition.joined ? (
                        <>
                          <Button variant="default" size="sm" className="flex-1" disabled>
                            <Flag className="h-4 w-4 mr-2" />
                            Participating
                          </Button>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleJoin(competition.id)}
                            disabled={competition.status === "completed"}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {competition.status === "upcoming" ? "Register" : "Join Now"}
                          </Button>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
