"use client"

import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  MapPin,
  Plus,
  ChevronRight,
  Clock
} from "lucide-react"
import { useMyJobs } from "@/hooks/use-dashboard-data"
import { useRouter } from "@/i18n/navigation"
import type { DashboardTabProps } from "@/lib/dashboard-tab-components"

export function DashboardMyJobsTab({ workspaceId = '', userId = '' }: DashboardTabProps) {
  const router = useRouter()
  const t = useTranslations('dashboard.jobs')
  const tCommon = useTranslations('common')
  const { jobs, loading } = useMyJobs(workspaceId, userId)
  
  // Transform real jobs data
  const jobsList = jobs.map((job: any) => ({
    id: job.id,
    title: job.role || job.title || 'Untitled',
    client: job.company?.name || 'Client',
    type: job.type || 'Contract',
    status: job.status || 'active',
    startDate: job.start_date ? new Date(job.start_date).toLocaleDateString() : 'TBD',
    endDate: job.end_date ? new Date(job.end_date).toLocaleDateString() : 'TBD',
    location: job.location || 'Remote',
    rate: job.rate || 'TBD',
    progress: job.progress || 50,
    daysRemaining: job.end_date ? Math.ceil((new Date(job.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 0,
  }))
  
  // Calculate stats from real data
  const activeJobs = jobsList.filter(j => (j as any).status === 'active').length
  const pendingJobs = jobsList.filter(j => (j as any).status === 'pending').length
  const completedJobs = jobsList.filter(j => (j as any).status === 'completed').length
  
  if (loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" aria-hidden="true"></div>
          <p className="text-muted-foreground">{t('loadingMessage')}</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-400"
      case "completed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Contract" ? "text-blue-600" : "text-purple-600"
  }

  return (
    <main role="main" aria-label={t('title')}>
      <div className="space-y-6">
      {/* Summary Stats */}
      <section role="region" aria-labelledby="jobs-stats">
        <h2 id="jobs-stats" className="sr-only">Job Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{activeJobs}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('activeJobs')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">{pendingJobs}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('pendingJobs')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{completedJobs}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('completedJobs')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{jobsList.length}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('totalJobs')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      </section>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobsList.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
              <p className="text-muted-foreground mb-4">You don&apos;t have any jobs or contracts yet.</p>
              <Button 
                size="sm"
                onClick={() => router.push(`/workspace/${workspaceId}/people/personnel`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Contract
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobsList.map((job: any, index: number) => (
              <div
                key={job.id || index}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                onClick={() => job.id && router.push(`/workspace/${workspaceId}/people/personnel?id=${job.id}`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{job.client}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {job.startDate} - {job.endDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5" />
                        {job.rate}
                      </div>
                      {job.daysRemaining > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {job.daysRemaining} days remaining
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className={getTypeColor(job.type)}>
                        {job.type}
                      </Badge>
                      <Badge variant="secondary" className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      {job.status === "active" && (
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{job.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all"
                              style={{ width: `${job.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="icon" aria-label="View job details">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="View documents">
                      <FileText className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </main>
  )
}
