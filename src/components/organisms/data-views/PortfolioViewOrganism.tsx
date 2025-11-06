"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Briefcase, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * PortfolioViewOrganism - Organism Component
 * 
 * Portfolio overview showing project health and metrics.
 * Displays overview cards, budget utilization, and project cards.
 * 
 * Features:
 * - Overview metrics (total, on-track, at-risk, delayed, completed)
 * - Budget utilization tracking
 * - Project health indicators
 * - Progress bars
 * - Team member avatars
 * - Filterable by status
 * 
 * Usage:
 * <PortfolioViewOrganism 
 *   data={projects} 
 *   columns={schema}
 *   onItemClick={handleClick}
 * />
 */

interface Project {
  id: string
  name: string
  status: string
  progress: number
  health: string
  budget: number
  spent: number
  team: any[]
  startDate: string
  endDate: string
}

export interface PortfolioViewOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  onItemClick?: (item: T) => void
  createActionLabel?: string
  onCreateAction?: () => void
}

export function PortfolioViewOrganism({ 
  data, 
  schema, 
  onItemClick, 
  createActionLabel, 
  onCreateAction 
}: PortfolioViewOrganismProps) {
  const t = useTranslations()
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  // Convert data to projects
  const projects: Project[] = data.map((item: any) => ({
    id: item.id,
    name: item.name || item.title || "Untitled Project",
    status: (item.status as string) || "on-track",
    progress: item.progress || Math.random() * 100,
    health: (item.health as string) || (item.progress > 80 ? "healthy" : item.progress > 50 ? "warning" : "critical"),
    budget: item.budget || 100000,
    spent: item.spent || Math.random() * 100000,
    team: item.team || [],
    startDate: item.start_date || new Date().toISOString(),
    endDate: item.end_date || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  const filteredProjects = filterStatus
    ? projects.filter((p: any) => (p as any).status === filterStatus)
    : projects

  // Calculate overview metrics
  const totalProjects = projects.length
  const onTrack = projects.filter((p: any) => (p as any).status === "on-track").length
  const atRisk = projects.filter((p: any) => (p as any).status === "at-risk").length
  const delayed = projects.filter((p: any) => (p as any).status === "delayed").length
  const completed = projects.filter((p: any) => (p as any).status === "completed").length

  const totalBudget = projects.reduce((sum: any, p: any) => sum + p.budget, 0)
  const totalSpent = projects.reduce((sum: any, p: any) => sum + p.spent, 0)
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-500"
      case "at-risk":
        return "text-orange-500"
      case "delayed":
        return "text-red-500"
      case "completed":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      case "at-risk":
        return <AlertCircle aria-hidden="true" className="h-4 w-4" />
      case "delayed":
        return <AlertCircle aria-hidden="true" className="h-4 w-4" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      default:
        return <Clock aria-hidden="true" className="h-4 w-4" />
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "healthy":
        return "bg-green-500"
      case "warning":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="h-full flex flex-wrap flex-col">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Briefcase aria-hidden="true" className="h-5 w-5" />
          <h3 className="font-semibold">Portfolio Overview</h3>
          <Badge variant="secondary">{totalProjects} projects</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto space-y-3 md:space-y-4 lg:space-y-6 px-4 md:px-6 lg:px-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2 md:gap-3 lg:gap-4">
            <Card>
              <CardHeader aria-hidden="true" className="pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{totalProjects as any}</div>
              </CardContent>
            </Card>

            <Card aria-hidden="true" className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setFilterStatus(filterStatus === "on-track" ? null : "on-track")}
            >
              <CardHeader aria-hidden="true" className="pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <span className="text-green-500" aria-hidden="true">●</span> On Track
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{onTrack as any}</div>
              </CardContent>
            </Card>

            <Card aria-hidden="true" className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setFilterStatus(filterStatus === "at-risk" ? null : "at-risk")}
            >
              <CardHeader aria-hidden="true" className="pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <span className="text-orange-500" aria-hidden="true">●</span> At Risk
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{atRisk as any}</div>
              </CardContent>
            </Card>

            <Card aria-hidden="true" className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setFilterStatus(filterStatus === "delayed" ? null : "delayed")}
            >
              <CardHeader aria-hidden="true" className="pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <span className="text-red-500" aria-hidden="true">●</span> Delayed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{delayed as any}</div>
              </CardContent>
            </Card>

            <Card aria-hidden="true" className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => setFilterStatus(filterStatus === "completed" ? null : "completed")}
            >
              <CardHeader aria-hidden="true" className="pb-2">
                <CardTitle aria-hidden="true" className="text-sm font-medium flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <span className="text-blue-500" aria-hidden="true">●</span> Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{completed as any}</div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex flex-wrap justify-between text-sm">
                  <span>Total Budget</span>
                  <span className="font-semibold">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap justify-between text-sm">
                  <span>Total Spent</span>
                  <span className="font-semibold">${totalSpent.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
                  <div
                    className={cn(
                      "h-full transition-all",
                      budgetUtilization > 90 ? "bg-red-500" : budgetUtilization > 70 ? "bg-orange-500" : "bg-green-500"
                    )}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">
                  {budgetUtilization.toFixed(1)}% utilized
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Cards */}
          {data.length === 0 ? (
            <EmptyState
              variant="inline"
              mainMessage={t('views.emptyState.nothingToSeeYet')}
              description={t('views.emptyState.portfolioViewDescription')}
              actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
              onAction={onCreateAction}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
              {filteredProjects.map((project: any) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onItemClick?.(data.find((d: any) => d.id === project.id)!)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle aria-hidden="true" className="text-base line-clamp-1">{project.name}</CardTitle>
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mt-2">
                        <div className={cn("flex items-center gap-1 text-sm", getStatusColor(project.status))}>
                          {getStatusIcon(project.status)}
                          <span className="capitalize">{project.status.replace("-", " ")}</span>
                        </div>
                      </div>
                    </div>
                    <div className={cn("w-3 h-3 rounded-full", getHealthColor(project.health))} aria-label={`Health: ${project.health}`} />
                  </div>
                </CardHeader>
                <CardContent aria-hidden="true" className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex flex-wrap justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{Math.round(project.progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${project.progress}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Budget */}
                  <div>
                    <div className="flex flex-wrap justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Budget</span>
                      <span className="font-medium">
                        ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden md:block">
                      <div
                        className={cn(
                          "h-full transition-all",
                          project.spent / project.budget > 0.9 ? "bg-red-500" : "bg-green-500"
                        )}
                        style={{ width: `${Math.min((project.spent / project.budget) * 100, 100)}%` }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="text-xs text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </div>

                  {/* Team */}
                  {project.team.length > 0 && (
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-1">
                      {project.team.slice(0, 3).map((member: any, idx: number) => (
                        <Avatar key={idx} className="h-6 w-6 border">
                          <AvatarFallback aria-hidden="true" className="text-xs">
                            {member.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {project.team.length > 3 && (
                        <Badge variant="secondary" className="text-xs h-6">
                          +{project.team.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
