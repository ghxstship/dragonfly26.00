"use client"

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

interface DashboardMyJobsTabProps {
  data?: any[]
  loading?: boolean
}

export function DashboardMyJobsTab({ data = [], loading = false }: DashboardMyJobsTabProps) {
  // User's contracts and scopes of work
  const jobs = data.length > 0 ? data : [
    {
      title: "Technical Director - Summer Music Festival",
      client: "Festival Productions Inc.",
      type: "Contract",
      status: "active",
      startDate: "Sep 15, 2024",
      endDate: "Oct 30, 2024",
      location: "Central Park, NY",
      rate: "$8,500/week",
      progress: 65,
      daysRemaining: 18,
    },
    {
      title: "Lighting Designer - Corporate Gala",
      client: "TechCorp Events",
      type: "Freelance",
      status: "active",
      startDate: "Oct 5, 2024",
      endDate: "Oct 20, 2024",
      location: "Convention Center",
      rate: "$5,000 flat",
      progress: 40,
      daysRemaining: 9,
    },
    {
      title: "Production Manager - Theater Revival",
      client: "Broadway Theater Group",
      type: "Contract",
      status: "pending",
      startDate: "Nov 1, 2024",
      endDate: "Dec 31, 2024",
      location: "Broadway District",
      rate: "$12,000/month",
      progress: 0,
      daysRemaining: 21,
    },
    {
      title: "Audio Engineer - Concert Series",
      client: "Live Nation",
      type: "Freelance",
      status: "completed",
      startDate: "Aug 1, 2024",
      endDate: "Sep 30, 2024",
      location: "Various Venues",
      rate: "$6,500/show",
      progress: 100,
      daysRemaining: 0,
    },
    {
      title: "Stage Manager - Fashion Week",
      client: "Fashion Events Ltd",
      type: "Contract",
      status: "active",
      startDate: "Oct 10, 2024",
      endDate: "Oct 25, 2024",
      location: "Multiple Locations, NY",
      rate: "$4,200/week",
      progress: 55,
      daysRemaining: 14,
    },
  ]

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
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">3</p>
              <p className="text-xs text-muted-foreground mt-1">Active Jobs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">1</p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">$31.7k</p>
              <p className="text-xs text-muted-foreground mt-1">Active Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-muted-foreground mt-1">This Year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobs.map((job, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
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
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue This Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$142.5k</p>
              <p className="text-xs text-muted-foreground mt-1">Total Earned</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$31.7k</p>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-2xl font-bold">$24.0k</p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
