"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, UserPlus, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/lib/hooks/use-toast"

interface Endorsement {
  id: string
  endorserName: string
  endorserTitle: string
  endorserImage?: string
  skill: string
  message: string
  date: string
  projectName?: string
}

interface SkillEndorsement {
  skill: string
  count: number
  endorsers: string[]
}

export function EndorsementsTab() {
  const t = useTranslations()
  const { profile, loading } = useProfileData()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [endorsements, setEndorsements] = useState<Endorsement[]>([])

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setEndorsements(profile.endorsements || [])
    }
  }, [profile])

  // Mock endorsements for display (will be replaced with real data)
  const mockEndorsements: Endorsement[] = [
    {
      id: "1",
      endorserName: t('profile.endorsements.mock1-name'),
      endorserTitle: t('profile.endorsements.mock1-title'),
      skill: t('profile.endorsements.mock1-skill'),
      message: t('profile.endorsements.mock1-message'),
      date: "2024-09-15",
      projectName: t('profile.endorsements.mock1-project'),
    },
    {
      id: "2",
      endorserName: t('profile.endorsements.mock2-name'),
      endorserTitle: t('profile.endorsements.mock2-title'),
      skill: t('profile.endorsements.mock2-skill'),
      message: t('profile.endorsements.mock2-message'),
      date: "2024-08-22",
      projectName: t('profile.endorsements.mock2-project'),
    },
    {
      id: "3",
      endorserName: t('profile.endorsements.mock3-name'),
      endorserTitle: t('profile.endorsements.mock3-title'),
      skill: t('profile.endorsements.mock3-skill'),
      message: t('profile.endorsements.mock3-message'),
      date: "2024-07-10",
      projectName: t('profile.endorsements.mock3-project'),
    },
    {
      id: "4",
      endorserName: t('profile.endorsements.mock4-name'),
      endorserTitle: t('profile.endorsements.mock4-title'),
      skill: t('profile.endorsements.mock4-skill'),
      message: t('profile.endorsements.mock4-message'),
      date: "2024-06-05",
    },
    {
      id: "5",
      endorserName: t('profile.endorsements.mock5-name'),
      endorserTitle: t('profile.endorsements.mock5-title'),
      skill: t('profile.endorsements.mock5-skill'),
      message: t('profile.endorsements.mock5-message'),
      date: "2024-05-18",
    },
  ]

  // Display endorsements (use profile data if available, otherwise mock)
  const displayEndorsements = endorsements.length > 0 ? endorsements : mockEndorsements

  const skillEndorsements: SkillEndorsement[] = [
    {
      skill: t('profile.endorsements.skill1-name'),
      count: 12,
      endorsers: t('profile.endorsements.skill1-endorsers') as any,
    },
    {
      skill: t('profile.endorsements.skill2-name'),
      count: 10,
      endorsers: t('profile.endorsements.skill2-endorsers') as any,
    },
    {
      skill: t('profile.endorsements.skill3-name'),
      count: 8,
      endorsers: t('profile.endorsements.skill3-endorsers') as any,
    },
    {
      skill: t('profile.endorsements.skill4-name'),
      count: 15,
      endorsers: t('profile.endorsements.skill4-endorsers') as any,
    },
    {
      skill: t('profile.endorsements.skill5-name'),
      count: 6,
      endorsers: t('profile.endorsements.skill5-endorsers') as any,
    },
    {
      skill: t('profile.endorsements.skill6-name'),
      count: 9,
      endorsers: t('profile.endorsements.skill6-endorsers') as any,
    },
  ]

  const filteredEndorsements = displayEndorsements.filter(
    (endorsement) =>
      endorsement.endorserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endorsement.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endorsement.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Stats */}
      <div className="grid md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('profile.endorsements.totalEndorsements')}</CardTitle>
            <ThumbsUp aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{displayEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">{t('profile.endorsements.total')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('profile.endorsements.skillsEndorsed')}</CardTitle>
            <Badge aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{skillEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">{t('profile.endorsements.skillsEndorsed')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader aria-hidden="true" className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row flex-col md:flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle aria-hidden="true" className="text-sm font-medium">{t('profile.endorsements.topSkill')}</CardTitle>
            <MessageSquare aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
              {skillEndorsements.sort((a: any, b: any) => b.count - a.count)[0]?.skill.split(" ")[0]}
            </div>
            <p className="text-xs text-muted-foreground">
              {skillEndorsements.sort((a: any, b: any) => b.count - a.count)[0]?.count} endorsements
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.endorsements.skillsAndEndorsements')}</CardTitle>
          <CardDescription>{t('profile.endorsements.skillsEndorsed')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            {skillEndorsements.map((skillEndorsement: any) => (
              <div
                key={skillEndorsement.skill}
                className="flex justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors items-start"
              >
                <div className="space-y-1">
                  <p className="font-medium">{skillEndorsement.skill}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.endorsements.endorsedBy')} {skillEndorsement.endorsers.join(", ")}
                  </p>
                </div>
                <Badge variant="secondary">{skillEndorsement.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>{t('profile.endorsements.recommendations')}</CardTitle>
              <CardDescription>{t('profile.endorsements.detailedRecommendations')}</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <UserPlus aria-hidden="true" className="h-4 w-4 mr-2" />
              {t('profile.endorsements.requestEndorsement')}
            </Button>
          </div>
          <div className="pt-4">
            <Input
              placeholder={t('profile.endorsements.searchPlaceholder')}
              value={searchQuery as any}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-3 md:space-y-4 lg:space-y-6">
          {filteredEndorsements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 md:py-6 lg:py-8">
              {t('profile.endorsements.noEndorsements')}
            </p>
          ) : (
            filteredEndorsements.map((endorsement: any) => (
              <div key={endorsement.id} className="border-b pb-6 last:border-0">
                <div className="flex flex-wrap gap-2 md:gap-3 lg:gap-4">
                  <Avatar aria-hidden="true" className="h-12 w-12">
                    <AvatarImage src={endorsement.endorserImage} />
                    <AvatarFallback>
                      {endorsement.endorserName
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{endorsement.endorserName}</p>
                        <p className="text-sm text-muted-foreground">
                          {endorsement.endorserTitle}
                        </p>
                      </div>
                      <Badge variant="outline">{endorsement.skill}</Badge>
                    </div>

                    <p className="text-sm leading-relaxed">{endorsement.message}</p>

                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 text-xs text-muted-foreground">
                      <span>{new Date(endorsement.date).toLocaleDateString()}</span>
                      {endorsement.projectName && (
                        <>
                          <span>•</span>
                          <span>{endorsement.projectName}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp aria-hidden="true" className="h-3 w-3 mr-1" />
                        {t('profile.endorsements.thank')}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare aria-hidden="true" className="h-3 w-3 mr-1" />
                        {t('profile.endorsements.reply')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.endorsements.giveEndorsements')}</CardTitle>
          <CardDescription>
            {t('profile.endorsements.giveDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 md:py-6 lg:py-8">
            <UserPlus aria-hidden="true" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {t('profile.endorsements.helpColleagues')}
            </p>
            <Button>
              <UserPlus aria-hidden="true" className="h-4 w-4 mr-2" />
              {t('profile.endorsements.endorseColleague')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{t('profile.endorsements.tip')}</strong> {t('profile.endorsements.tipDescription')}
        </p>
      </div>
    </div>
  )
}
