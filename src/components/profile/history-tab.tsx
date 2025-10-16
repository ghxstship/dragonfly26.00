"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Briefcase, FolderKanban, Loader2 } from "lucide-react"
import { useProfileData } from "@/hooks/use-profile-data"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface ProjectHistory {
  id: string
  name: string
  role: string
  projectType: string
  startDate: string
  endDate: string
  status: "completed" | "ongoing" | "cancelled"
  hoursWorked: number
  rating?: number

  nameKey?: string
}

export function HistoryTab() {
  const t = useTranslations()
  const { profile, loading } = useProfileData()
  const [searchQuery, setSearchQuery] = useState("")
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([])

  // Sync with profile work experience
  useEffect(() => {
    if (profile?.work_experience) {
      // Convert work experience to project history format
      const history: ProjectHistory[] = profile.work_experience.map((exp: any, index: number) => ({
        id: exp.id || `exp-${index}`,
        name: `${t(exp.titleKey)} at ${exp.company}`,
        role: exp.title || 'N/A',
        projectType: 'Professional Experience',
        startDate: exp.startDate || '',
        endDate: exp.current ? '' : (exp.endDate || ''),
        status: (exp.current ? 'ongoing' : 'completed') as 'completed' | 'ongoing' | 'cancelled',
        hoursWorked: 0, // Can be calculated or added later
      }))
      setProjectHistory(history)
    }
  }, [profile])

  // Mock project history for display (will show alongside real data)
  const mockHistory: ProjectHistory[] = [
    {
      id: "1",
      name: "Summer Music Festival 2024",
      nameKey: "summer_music_festival_2024",
      role: "Production Manager",
      projectType: "Event",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "completed",
      hoursWorked: 520,
      rating: 4.8,
    },
    {
      id: "2",
      name: "Corporate Conference - Tech Summit",
      nameKey: "corporate_conference__tech_summit",
      role: "Audio Engineer",
      projectType: "Conference",
      startDate: "2024-03-15",
      endDate: "2024-03-18",
      status: "completed",
      hoursWorked: 42,
      rating: 5.0,
    },
    {
      id: "3",
      name: "Broadway Production Setup",
      nameKey: "broadway_production_setup",
      role: "Lighting Technician",
      projectType: "Theater",
      startDate: "2024-01-10",
      endDate: "2024-02-28",
      status: "completed",
      hoursWorked: 280,
      rating: 4.5,
    },
    {
      id: "4",
      name: "Holiday Concert Series",
      nameKey: "holiday_concert_series",
      role: "Stage Manager",
      projectType: "Concert",
      startDate: "2024-10-01",
      endDate: "",
      status: "ongoing",
      hoursWorked: 120,
    },
  ]

  // Display combined history (profile data + mock data for demo)
  const displayHistory = projectHistory.length > 0 ? projectHistory : mockHistory

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-hidden="true" />
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      completed: "default",
      ongoing: "secondary",
      cancelled: "destructive",
    }
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredProjects = displayHistory.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalHoursWorked = displayHistory.reduce((sum: number, p) => sum + p.hoursWorked, 0)
  const completedProjects = displayHistory.filter((p: any) => p.status === "completed").length
  const averageRating =
    displayHistory.filter((p: any) => p.rating).length > 0
      ? displayHistory
          .filter((p: any) => p.rating)
          .reduce((sum: number, p) => sum + (p.rating || 0), 0) /
        displayHistory.filter((p: any) => p.rating).length
      : 0

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('profile.history.totalProjects')}</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{displayHistory.length}</div>
            <p className="text-xs text-muted-foreground">{completedProjects} {t('profile.history.completedLowercase')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('profile.history.hoursWorked')}</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursWorked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{t('profile.history.acrossAllProjects')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('profile.history.averageRating')}</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">{t('profile.history.outOf5')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.history.projectHistory')}</CardTitle>
          <CardDescription>
            {t('profile.history.allJobsAndProjects')}
          </CardDescription>
          <div className="pt-4">
            <Input
              placeholder={t('profile.history.searchProjectsRolesOrTypes')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t('profile.history.noProjectsFound')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('profile.history.projectName')}</TableHead>
                  <TableHead>{t('profile.history.role')}</TableHead>
                  <TableHead>{t('profile.history.type')}</TableHead>
                  <TableHead>{t('profile.history.startDate')}</TableHead>
                  <TableHead>{t('profile.history.endDate')}</TableHead>
                  <TableHead>{t('profile.history.hours')}</TableHead>
                  <TableHead>{t('profile.history.rating')}</TableHead>
                  <TableHead>{t('profile.history.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{(project.nameKey ? t(project.nameKey) : project.name)}</TableCell>
                    <TableCell>{project.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.projectType}</Badge>
                    </TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : t('profile.history.ongoing')}
                    </TableCell>
                    <TableCell>{project.hoursWorked}</TableCell>
                    <TableCell>
                      {project.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{project.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">{t('profile.history.outOf5')}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(project.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.history.roleDistribution')}</CardTitle>
          <CardDescription>{t('profile.history.breakdownOfWorkByRole')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(projectHistory.map((p) => p.role))).map((role) => {
              const roleProjects = projectHistory.filter((p: any) => p.role === role)
              const percentage = (roleProjects.length / projectHistory.length) * 100
              return (
                <div key={role} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{role}</span>
                    <span className="text-muted-foreground">
                      {roleProjects.length} project{roleProjects.length !== 1 ? "s" : ""} (
                      {percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>{t('profile.history.note')}</strong> {t('profile.history.noteDescription')}
        </p>
      </div>
    </div>
  )
}
