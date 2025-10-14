"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Star, Clock, Target, Award, CheckCircle2, Loader2 } from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { Progress } from "@/components/ui/progress"
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: "Overall Performance",
      value: 4.7,
      maxValue: 5.0,
      trend: "up",
      icon: <Star className="h-4 w-4" />,
    },
    {
      label: "On-Time Completion",
      value: 95,
      maxValue: 100,
      trend: "up",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      label: "Quality Rating",
      value: 4.8,
      maxValue: 5.0,
      trend: "stable",
      icon: <Award className="h-4 w-4" />,
    },
    {
      label: "Client Satisfaction",
      value: 4.6,
      maxValue: 5.0,
      trend: "up",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
  ]

  const skills = [
    { name: "Production Management", rating: 95 },
    { name: "Audio Engineering", rating: 88 },
    { name: "Lighting Design", rating: 82 },
    { name: "Stage Management", rating: 90 },
    { name: "Team Leadership", rating: 92 },
    { name: "Problem Solving", rating: 94 },
  ]

  const achievements = [
    {
      id: "1",
      title: "Top Performer Q3 2024",
      description: "Highest rated production manager for the quarter",
      date: "2024-09-30",
      icon: "🏆",
    },
    {
      id: "2",
      title: "Perfect Attendance",
      description: "No missed shifts or late arrivals for 6 months",
      date: "2024-08-15",
      icon: "⭐",
    },
    {
      id: "3",
      title: "Safety Champion",
      description: "Zero safety incidents across all projects",
      date: "2024-07-01",
      icon: "🛡️",
    },
    {
      id: "4",
      title: "Mentor of the Month",
      description: "Outstanding contribution to team training",
      date: "2024-06-20",
      icon: "👥",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
      default:
        return <span className="text-xs text-muted-foreground">→</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-30-days">Last 30 Days</SelectItem>
            <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            <SelectItem value="last-6-months">Last 6 Months</SelectItem>
            <SelectItem value="last-year">Last Year</SelectItem>
            <SelectItem value="all-time">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
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
          <CardTitle>Skills Assessment</CardTitle>
          <CardDescription>Your proficiency levels across key skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{skill.name}</span>
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
            <CardTitle>Recent Feedback</CardTitle>
            <CardDescription>Latest reviews from project managers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">Excellent work on the festival setup</p>
                  <p className="text-xs text-muted-foreground">Summer Music Festival</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">5.0</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                &ldquo;Outstanding leadership and problem-solving skills. Kept the team motivated and
                on schedule throughout the entire event.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">- Sarah Johnson, Production Director</p>
            </div>

            <div className="space-y-2 border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">Great attention to detail</p>
                  <p className="text-xs text-muted-foreground">Corporate Conference</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.8</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                &ldquo;Professional, punctual, and extremely thorough. Audio quality was perfect
                throughout the conference.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">- Michael Chen, Event Coordinator</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-sm">Reliable and skilled technician</p>
                  <p className="text-xs text-muted-foreground">Broadway Production</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">4.5</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                &ldquo;Solid technical skills and good team player. Would work with again.&rdquo;
              </p>
              <p className="text-xs text-muted-foreground">
                - Robert Williams, Technical Director
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Achievements & Awards</CardTitle>
            <CardDescription>Recognition and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex gap-3 border-b pb-4 last:border-0">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
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
          <CardTitle>Performance Goals</CardTitle>
          <CardDescription>Track progress towards your performance objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Complete 10 projects this quarter</span>
              </div>
              <span className="text-muted-foreground">7/10</span>
            </div>
            <Progress value={70} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Maintain 4.5+ average rating</span>
              </div>
              <span className="text-green-600 font-medium">✓ Achieved</span>
            </div>
            <Progress value={100} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="font-medium">Earn 3 new certifications</span>
              </div>
              <span className="text-muted-foreground">2/3</span>
            </div>
            <Progress value={66} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
