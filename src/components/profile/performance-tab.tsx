"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Star, Clock, Target, Award, CheckCircle2, Loader2, Plus } from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PerformanceMetric {
  label: string
  value: number
  maxValue: number
  trend: "up" | "down" | "stable"
  icon: React.ReactNode
}

export function PerformanceTab() {
  const t = useTranslations()
  const { profile, loading } = useProfileData()
  const [timePeriod, setTimePeriod] = useState("last-90-days")
  const [profileSkills, setProfileSkills] = useState<string[]>([])

  // Sync with profile skills
  useEffect(() => {
    if (profile?.skills) {
      setProfileSkills(profile.skills)
    }
  }, [profile])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: t('profile.performance.overall'),
      value: 4.7,
      maxValue: 5.0,
      trend: "up",
      icon: <Star className="h-4 w-4" aria-hidden="true" />,
    },
    {
      label: t('profile.performance.on-time'),
      value: 95,
      maxValue: 100,
      trend: "up",
      icon: <Clock className="h-4 w-4" aria-hidden="true" />,
    },
    {
      label: t('profile.performance.quality'),
      value: 4.8,
      maxValue: 5.0,
      trend: "stable",
      icon: <Award className="h-4 w-4" aria-hidden="true" />,
    },
    {
      label: t('profile.performance.client-satisfaction'),
      value: 4.6,
      maxValue: 5.0,
      trend: "up",
      icon: <CheckCircle2 className="h-4 w-4" aria-hidden="true" />,
    },
  ]

  const skills = [
    { nameKey: "production_management", rating: 95 },
    { nameKey: "audio_engineering", rating: 88 },
    { nameKey: "lighting_design", rating: 82 },
    { nameKey: "stage_management", rating: 90 },
    { nameKey: "team_leadership", rating: 92 },
    { nameKey: "problem_solving", rating: 94 },
  ]

  const achievements = [
    {
      id: "1",
      title: t('profile.performance.top-performer'),
      description: t('profile.performance.top-performer-description'),
      date: "2024-09-30",
      icon: "🏆",
    },
    {
      id: "2",
      title: t('profile.performance.perfect-attendance'),
      description: t('profile.performance.perfect-attendance-description'),
      date: "2024-08-15",
      icon: "⭐",
    },
    {
      id: "3",
      title: t('profile.performance.safety-champion'),
      description: t('profile.performance.safety-champion-description'),
      date: "2024-07-01",
      icon: "🛡️",
    },
    {
      id: "4",
      title: t('profile.performance.mentor-of-the-month'),
      description: t('profile.performance.mentor-of-the-month-description'),
      date: "2024-06-20",
      icon: "👥",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" aria-hidden="true" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" aria-hidden="true" />
      default:
        return <span className="text-xs text-muted-foreground">→</span>
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('profile.descriptions.performance')}
        </p>
      </div>

      <div className="flex justify-end">
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('profile.performance.select-period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-30-days">{t('profile.performance.last-30-days')}</SelectItem>
            <SelectItem value="last-90-days">{t('profile.performance.last-90-days')}</SelectItem>
            <SelectItem value="last-6-months">{t('profile.performance.last-6-months')}</SelectItem>
            <SelectItem value="last-year">{t('profile.performance.last-year')}</SelectItem>
            <SelectItem value="all-time">{t('profile.performance.all-time')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={t(metric.labelKey)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t(metric.labelKey)}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl font-bold">
                  {metric.maxValue === 100
                    ? `${metric.value}%`
                    : `${metric.value}/${metric.maxValue}`}
                </div>
                {getTrendIcon(metric.trend)}
              </div>
              <Progress
                value={(metric.value / metric.maxValue) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.performance.skills')}</CardTitle>
          <CardDescription>{t('profile.performance.skills-description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((skill) => (
            <div key={t(skill.nameKey)} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{t(skill.nameKey)}</span>
                <span className="text-muted-foreground">{skill.rating}%</span>
              </div>
              <Progress value={skill.rating} />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('profile.performance.feedback')}</CardTitle>
            <CardDescription>{t('profile.performance.feedback-description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{t('profile.performance.feedback-1')}</p>
                  <p className="text-xs text-muted-foreground">{t('profile.performance.feedback-1-description')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('profile.performance.feedback-1-comment')}
              </p>
              <p className="text-xs text-muted-foreground">- {t('profile.performance.feedback-1-author')}</p>
            </div>

            <div className="space-y-2 border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{t('profile.performance.feedback-2')}</p>
                  <p className="text-xs text-muted-foreground">{t('profile.performance.feedback-2-description')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('profile.performance.feedback-2-comment')}
              </p>
              <p className="text-xs text-muted-foreground">- {t('profile.performance.feedback-2-author')}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">{t('profile.performance.feedback-3')}</p>
                  <p className="text-xs text-muted-foreground">{t('profile.performance.feedback-3-description')}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('profile.performance.feedback-3-comment')}
              </p>
              <p className="text-xs text-muted-foreground">
                - {t('profile.performance.feedback-3-author')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('profile.performance.achievements')}</CardTitle>
            <CardDescription>{t('profile.performance.achievements-description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex gap-3 border-b pb-4 last:border-0">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{t(achievement.titleKey)}</p>
                  <p className="text-sm text-muted-foreground">{t(achievement.descriptionKey)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(achievement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.performance.metrics')}</CardTitle>
          <CardDescription>{t('profile.performance.metrics-description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{t('profile.performance.goal-1')}</span>
              </div>
              <span className="text-muted-foreground">{t('profile.performance.goal-1-progress')}</span>
            </div>
            <Progress value={70} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{t('profile.performance.goal-2')}</span>
              </div>
              <span className="text-green-600 font-medium">{t('profile.performance.achieved')}</span>
            </div>
            <Progress value={100} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium">{t('profile.performance.goal-3')}</span>
              </div>
              <span className="text-muted-foreground">{t('profile.performance.goal-3-progress')}</span>
            </div>
            <Progress value={66} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
