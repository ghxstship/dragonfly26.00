"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useCommunityData } from "@/hooks/use-community-data"
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
  workspaceId?: string
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

  titleKey?: string
  descriptionKey?: string
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

  nameKey?: string
  titleKey?: string
}

export function CompetitionsTab({ data = [], loading: loadingProp = false, workspaceId }: CompetitionsTabProps) {
  const t = useTranslations('community.competitions')
  const tCommon = useTranslations('common')
  const [searchQuery, setSearchQuery] = useState("")
  const [competitionFilter, setCompetitionFilter] = useState<"all" | "active" | "upcoming" | "completed">("all")

  // Use live data from Supabase
  const { competitions: liveCompetitions, loading: liveLoading } = useCommunityData()
  
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const loading = loadingProp || liveLoading

  // Transform live competitions from Supabase
  useEffect(() => {
    if (liveCompetitions && liveCompetitions.length > 0) {
      const transformed: Competition[] = liveCompetitions.map((comp: any) => {
        const now = new Date()
        const start = new Date(comp.start_date)
        const end = new Date(comp.end_date)
        
        let status: "active" | "upcoming" | "completed" = comp.status || "active"
        
        return {
          id: comp.id,
          title: comp.name || 'Untitled Competition',
          description: comp.description || '',
          category: 'innovation', // Default category
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          status,
          participants: comp.participants_count || 0,
          prize: comp.prize || 'TBA',
          joined: false
        }
      })
      setCompetitions(transformed)
    } else if (data && data.length > 0) {
      // Fallback to prop data if provided
      const transformed: Competition[] = data.map((item: any) => {
        const record = item as any
        const now = new Date()
        const startDate = record.created_at
        const endDate = record.created_at
        
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        let status: "active" | "upcoming" | "completed" = "active"
        if (now < start) status = "upcoming"
        else if (now > end) status = "completed"
        
        return {
          id: record.id,
          title: record.title || 'Untitled Competition',
          description: record.content || '',
          category: 'innovation',
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          status,
          participants: record.comments_count || 0,
          prize: 'TBA',
          image: record.media_urls?.[0],
          joined: false
        }
      })
      setCompetitions(transformed)
    }
  }, [liveCompetitions, data])

  const [leaderboard] = useState<LeaderboardEntry[]>([
    {
      rank: 1,
      previousRank: 1,
      userId: "1",
      name: "Sarah Mitchell",
      nameKey: "sarah_mitchell",
      title: "Production Director",
      titleKey: "production_director",
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
      nameKey: "marcus_chen",
      title: "Lighting Designer",
      titleKey: "lighting_designer",
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
      nameKey: "emily_rodriguez",
      title: "Festival Director",
      titleKey: "festival_director",
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
      nameKey: "david_park",
      title: "Technical Director",
      titleKey: "technical_director",
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
      nameKey: "jessica_martinez",
      title: "Stage Manager",
      titleKey: "stage_manager",
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
      nameKey: "robert_williams",
      title: "Audio Engineer",
      titleKey: "audio_engineer",
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
      nameKey: "lisa_johnson",
      title: "Tour Manager",
      titleKey: "tour_manager",
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
      nameKey: "michael_thompson",
      title: "Lighting Technician",
      titleKey: "lighting_technician",
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
      nameKey: "amanda_garcia",
      title: "Video Engineer",
      titleKey: "video_engineer",
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
      nameKey: "kevin_lee",
      title: "Production Coordinator",
      titleKey: "production_coordinator",
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
    const matchesFilter = competitionFilter === "all" || (comp as any).status === competitionFilter
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
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('active')}</div>
            <Trophy aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {competitions.filter(c => (c as any).status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">{t('competitions')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('participating')}</div>
            <Users aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {competitions.filter(c => c.joined).length}
            </div>
            <p className="text-xs text-muted-foreground">{t('yourEntries')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('yourRank')}</div>
            <TrendingUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">#247</div>
            <p className="text-xs text-muted-foreground">{t('globalRanking')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">{t('totalPoints')}</div>
            <Star aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">{t('competitionPoints')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Trophy aria-hidden="true" className="h-5 w-5 text-yellow-500" />{t('globalLeaderboard')}</CardTitle>
              <CardDescription>{t('topPerformers')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">{t('viewFullRankings')}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((entry: any) => {
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
                  <div className="flex flex-wrap flex-col items-center min-w-[60px]">
                    <RankIcon aria-hidden="true" className={`h-6 w-6 ${rankBadge.color}`} />
                    <span className="text-lg font-bold">#{entry.rank}</span>
                    {rankChange && rankChange.direction !== "same" && (
                      <div className={`flex items-center text-xs ${rankChange.color}`}>
                        <TrendingUp aria-hidden="true" className={`h-3 w-3 ${
                            rankChange.direction === "down" ? "rotate-180" : ""
                          }`}
                        />
                        <span>{rankChange.value}</span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <Avatar aria-hidden="true" className="h-12 w-12">
                    <AvatarImage src={entry.image} />
                    <AvatarFallback>
                      {entry.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{entry.nameKey ? (entry.nameKey ? t(entry.nameKey) : entry.name) : entry.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{entry.titleKey ? (entry.titleKey ? t(entry.titleKey) : entry.title) : entry.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entry.badges.map((badge: any) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Score & Streak */}
                  <div className="text-right">
                    <div className="text-base md:text-lg lg:text-xl font-bold">{entry.score.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{t('points')}</div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center justify-end gap-1 mt-1 text-orange-500">
                      <Zap aria-hidden="true" className="h-3 w-3 fill-current" />
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
        <CardContent aria-hidden="true" className="pt-6">
          <div className="flex flex-wrap flex-col md:flex-row gap-2 md:gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search aria-hidden="true" className="absolute sm:relative sm:inset-auto left-3 top-3 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('searchCompetitions')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Tabs value={competitionFilter as any} onValueChange={(v) => setCompetitionFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">{t('all')}</TabsTrigger>
                <TabsTrigger value="active">{t('active')}</TabsTrigger>
                <TabsTrigger value="upcoming">{t('upcoming')}</TabsTrigger>
                <TabsTrigger value="completed">{t('completed')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Competitions Grid */}
      <div className="grid md:grid-cols-1 md:grid-cols-2 gap-3 md:gap-2 md:gap-3 lg:gap-4 lg:gap-6">
        {filteredCompetitions.length === 0 ? (
          <Card aria-hidden="true" className="col-span-2">
            <CardContent aria-hidden="true" className="p-0">
              <EmptyState
                variant="inline"
                icon={Trophy}
                mainMessage={searchQuery || competitionFilter !== "all" ? t('noCompetitionsFound') : t('nothingToSeeYet')}
                description={searchQuery || competitionFilter !== "all" ? t('tryAdjustingFilters') : t('joinCompetitions')}
              />
            </CardContent>
          </Card>
        ) : (
          filteredCompetitions.map((competition: any) => {
            const categoryIcons = {
              design: Award,
              speed: Zap,
              innovation: Target,
              teamwork: Users
            }
            const CategoryIcon = categoryIcons[competition.category]

            return (
              <Card key={competition.id} className="overflow-hidden md:block hover:shadow-lg transition-shadow">
                <CardContent aria-hidden="true" className="p-0">
                  {/* Competition Image */}
                  {competition.image && (
                    <div className="relative">
                      <div 
                        className="h-48 bg-cover bg-center"
                        style={{ backgroundImage: `url(${competition.image})` }}
                      />
                      <Badge aria-hidden="true" className={`absolute top-3 right-3 ${
                          (competition as any).status === "active" ? "bg-green-500" :
                          (competition as any).status === "upcoming" ? "bg-blue-500" :
                          "bg-gray-500"
                        }`}
                      >
                        {competition.status}
                      </Badge>
                    </div>
                  )}

                  <div className="p-4 sm:p-6">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <CategoryIcon aria-hidden="true" className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{competition.titleKey ? (competition.titleKey ? t(competition.titleKey) : competition.title) : competition.title}</h3>
                        <Badge variant="outline" className="capitalize text-xs">
                          {competition.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {(competition.descriptionKey ? t(competition.descriptionKey) : competition.description)}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <Calendar aria-hidden="true" className="h-4 w-4" />
                        <span>
                          {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-muted-foreground">
                        <Users aria-hidden="true" className="h-4 w-4" />
                        <span>{competition.participants} participants</span>
                      </div>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-primary font-medium">
                        <Trophy aria-hidden="true" className="h-4 w-4" />
                        <span>{competition.prize}</span>
                      </div>
                    </div>

                    {/* Progress Bar for Active Competitions */}
                    {(competition as any).status === "active" && (
                      <div className="mb-4">
                        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-xs text-muted-foreground mb-1">
                          <span>{t('timeRemaining')}</span>
                          <span>
                            {Math.ceil(
                              (new Date(competition.endDate).getTime() - new Date().getTime()) / 
                              (1000 * 60 * 60 * 24)
                            )} days
                          </span>
                        </div>
                        <Progress value={65 as any} className="h-2" />
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {competition.joined ? (
                        <>
                          <Button variant="default" size="sm" className="flex-1" disabled>
                            <Flag aria-hidden="true" className="h-4 w-4 mr-2" />{t('participating')}</Button>
                          <Button variant="outline" size="sm">{tCommon('view')}</Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleJoin(competition.id)}
                            disabled={(competition as any).status === "completed"}
                          >
                            <Play aria-hidden="true" className="h-4 w-4 mr-2" />
                            {(competition as any).status === "upcoming" ? t('register') : t('joinNow')}
                          </Button>
                          <Button variant="outline" size="sm">{tCommon('details')}</Button>
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
