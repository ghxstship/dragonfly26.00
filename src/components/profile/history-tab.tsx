"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Briefcase, FolderKanban } from "lucide-react"
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
}

export function HistoryTab() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projectHistory] = useState<ProjectHistory[]>([
    {
      id: "1",
      name: "Summer Music Festival 2024",
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
      role: "Stage Manager",
      projectType: "Concert",
      startDate: "2024-10-01",
      endDate: "",
      status: "ongoing",
      hoursWorked: 120,
    },
  ])

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

  const filteredProjects = projectHistory.filter(
    (project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.projectType.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalHoursWorked = projectHistory.reduce((sum, p) => sum + p.hoursWorked, 0)
  const completedProjects = projectHistory.filter((p) => p.status === "completed").length
  const averageRating =
    projectHistory
      .filter((p) => p.rating)
      .reduce((sum, p) => sum + (p.rating || 0), 0) /
    projectHistory.filter((p) => p.rating).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectHistory.length}</div>
            <p className="text-xs text-muted-foreground">{completedProjects} completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Worked</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursWorked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 5.0</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>
            All jobs and projects you&apos;ve worked on in this application
          </CardDescription>
          <div className="pt-4">
            <Input
              placeholder="Search projects, roles, or types..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredProjects.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No projects found matching your search
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow key={project.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.role}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.projectType}</Badge>
                    </TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString()
                        : "Ongoing"}
                    </TableCell>
                    <TableCell>{project.hoursWorked}</TableCell>
                    <TableCell>
                      {project.rating ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{project.rating.toFixed(1)}</span>
                          <span className="text-xs text-muted-foreground">/ 5.0</span>
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
          <CardTitle>Role Distribution</CardTitle>
          <CardDescription>Breakdown of your work by role type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from(new Set(projectHistory.map((p) => p.role))).map((role) => {
              const roleProjects = projectHistory.filter((p) => p.role === role)
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
          <strong>Note:</strong> This history only includes jobs and projects managed within this
          application. For a complete work history, see the Professional tab.
        </p>
      </div>
    </div>
  )
}
