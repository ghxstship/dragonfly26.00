"use client"

import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReportDialog({ open, onOpenChange }: CreateReportDialogProps) {
  const t = useTranslations()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-hidden="true" className="max-w-2xl px-4 sm:px-6 lg:px-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Report Name</Label>
            <Input id="name" placeholder={t('reports.taskCompletionRate')} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder={t('placeholders.whatDoesReportShow')} rows={2} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div>
              <Label htmlFor="type">Report Type</Label>
              <Select defaultValue="chart">
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table</SelectItem>
                  <SelectItem value="chart">Chart</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="timeline">Timeline</SelectItem>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="chartType">Chart Type</Label>
              <Select defaultValue="line">
                <SelectTrigger id="chartType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="scatter">Scatter Plot</SelectItem>
                  <SelectItem value="funnel">Funnel Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="dataSource">Data Source</Label>
            <Select defaultValue="tasks">
              <SelectTrigger id="dataSource">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tasks">Tasks</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="sprints">Sprints</SelectItem>
                <SelectItem value="goals">Goals</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="time_tracking">Time Tracking</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Create Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
