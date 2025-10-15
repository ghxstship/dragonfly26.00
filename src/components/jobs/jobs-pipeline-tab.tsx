"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
  Plus,
  MoreVertical,
  TrendingUp,
  Clock
} from "lucide-react"
import { useModuleData } from "@/hooks/use-module-data"
import type { TabComponentProps } from "@/types"

export function JobsPipelineTab({ workspaceId, moduleId, tabSlug }: TabComponentProps) {
  const { data: jobs, loading } = useModuleData(workspaceId, 'jobs', 'pipeline')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pipeline...</p>
        </div>
      </div>
    )
  }

  const stages = [
    { id: 'lead', name: 'Lead', color: 'text-gray-600' },
    { id: 'qualification', name: 'Qualification', color: 'text-blue-600' },
    { id: 'proposal', name: 'Proposal', color: 'text-purple-600' },
    { id: 'negotiation', name: 'Negotiation', color: 'text-orange-600' },
    { id: 'closed_won', name: 'Closed Won', color: 'text-green-600' },
  ]

  const getJobsByStage = (stage: string) => {
    return jobs.filter((job: any) => job.stage === stage)
  }

  const getTotalValue = (stage: string) => {
    return getJobsByStage(stage).reduce((sum: number, job: any) => sum + (job.estimated_value || 0), 0)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400'
      case 'normal': return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400'
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const totalPipelineValue = jobs.reduce((sum: number, job: any) => sum + (job.estimated_value || 0), 0)

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Track opportunities through the sales pipeline
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Opportunity
        </Button>
      </div>

      {/* Pipeline Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">{jobs.length} opportunities</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Negotiation</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalValue('negotiation'))}
            </div>
            <p className="text-xs text-muted-foreground">
              {getJobsByStage('negotiation').length} deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {jobs.length > 0 
                ? Math.round((getJobsByStage('closed_won').length / jobs.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Overall conversion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(jobs.length > 0 ? totalPipelineValue / jobs.length : 0)}
            </div>
            <p className="text-xs text-muted-foreground">Per opportunity</p>
          </CardContent>
        </Card>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageJobs = getJobsByStage(stage.id)
          const stageValue = getTotalValue(stage.id)

          return (
            <div key={stage.id} className="flex-shrink-0 w-80">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className={`text-base ${stage.color}`}>
                        {stage.name}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {stageJobs.length} • {formatCurrency(stageValue)}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto">
                  {stageJobs.map((job: any) => (
                    <Card 
                      key={job.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardHeader className="p-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-sm font-medium line-clamp-2">
                            {job.name}
                          </CardTitle>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 pt-0 space-y-2">
                        {/* Company */}
                        {job.company_name && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            <span className="truncate">{job.company_name}</span>
                          </div>
                        )}

                        {/* Value */}
                        {job.estimated_value && (
                          <div className="flex items-center gap-2 text-xs font-medium">
                            <DollarSign className="h-3 w-3" />
                            <span>{formatCurrency(job.estimated_value)}</span>
                          </div>
                        )}

                        {/* Due Date */}
                        {job.close_date && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>Close: {formatDate(job.close_date)}</span>
                          </div>
                        )}

                        {/* Priority */}
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                          {job.probability && (
                            <Badge variant="outline" className="text-xs">
                              {job.probability}% win
                            </Badge>
                          )}
                        </div>

                        {/* Tags */}
                        {job.tags && job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 2).map((tag: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {job.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {stageJobs.length === 0 && (
                    <div className="text-center py-8 text-sm text-muted-foreground">
                      No opportunities in this stage
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
