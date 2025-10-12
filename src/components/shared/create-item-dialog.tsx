"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export type ItemType = "task" | "project" | "job" | "asset" | "location" | "file" | "report" | "list" | "workspace" | "event" | "person" | "company"

interface CreateItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: ItemType
  onSuccess?: (item: any) => void
}

const typeConfig = {
  task: {
    title: "Create Task",
    description: "Add a new task to track work",
    fields: ["name", "description", "assignee", "priority", "dueDate"],
  },
  project: {
    title: "Create Project",
    description: "Start a new project",
    fields: ["name", "description", "status", "startDate"],
  },
  job: {
    title: "Create Job",
    description: "Create a new job",
    fields: ["name", "description", "status", "startDate"],
  },
  asset: {
    title: "Create Asset",
    description: "Create a new asset",
    fields: ["name", "description"],
  },
  location: {
    title: "Create Location",
    description: "Create a new location",
    fields: ["name", "description"],
  },
  file: {
    title: "Create File",
    description: "Create a new file",
    fields: ["name", "description"],
  },
  report: {
    title: "Create Report",
    description: "Create a new report",
    fields: ["name", "description"],
  },
  list: {
    title: "Create List View",
    description: "Create a new list view",
    fields: ["name", "description"],
  },
  workspace: {
    title: "Create Workspace",
    description: "Create a new workspace for your team",
    fields: ["name", "description", "icon"],
  },
}

export function CreateItemDialog({
  open,
  onOpenChange,
  type,
  onSuccess,
}: CreateItemDialogProps) {
  const t = useTranslations()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [assignee, setAssignee] = useState("")
  const [priority, setPriority] = useState("medium")
  const [status, setStatus] = useState("active")
  const [dueDate, setDueDate] = useState<Date | undefined>()
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [icon, setIcon] = useState("")

  // Dynamic config based on translations
  const getConfig = () => ({
    task: {
      title: t('create.createTask'),
      description: t('create.addNewTask'),
      fields: ["name", "description", "assignee", "priority", "dueDate"],
    },
    project: {
      title: t('create.createProject'),
      description: t('create.startNewProject'),
      fields: ["name", "description", "status", "startDate"],
    },
    job: {
      title: t('create.createJob'),
      description: t('create.createNewJob'),
      fields: ["name", "description", "status", "startDate"],
    },
    asset: {
      title: t('create.createAsset'),
      description: t('create.createNewAsset'),
      fields: ["name", "description"],
    },
    location: {
      title: t('create.createLocation'),
      description: t('create.createNewLocation'),
      fields: ["name", "description"],
    },
    file: {
      title: t('create.createFile'),
      description: t('create.createNewFile'),
      fields: ["name", "description"],
    },
    report: {
      title: t('create.createReport'),
      description: t('create.createNewReport'),
      fields: ["name", "description"],
    },
    list: {
      title: t('create.createListView'),
      description: t('create.createNewListView'),
      fields: ["name", "description"],
    },
    workspace: {
      title: t('create.createWorkspace'),
      description: t('create.createNewWorkspace'),
      fields: ["name", "description", "icon"],
    },
    event: {
      title: t('create.createEvent'),
      description: t('create.createNewEvent'),
      fields: ["name", "description", "startDate"],
    },
    person: {
      title: t('create.createPerson'),
      description: t('create.createNewPerson'),
      fields: ["name", "description"],
    },
    company: {
      title: t('create.createCompany'),
      description: t('create.createNewCompany'),
      fields: ["name", "description"],
    },
  }[type])
  
  const config = getConfig()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description,
      ...(config.fields.includes("assignee") && { assignee }),
      ...(config.fields.includes("priority") && { priority }),
      ...(config.fields.includes("status") && { status }),
      ...(config.fields.includes("dueDate") && { dueDate }),
      ...(config.fields.includes("startDate") && { startDate }),
      ...(config.fields.includes("icon") && { icon }),
      created_at: new Date().toISOString(),
    }

    onSuccess?.(newItem)
    setIsLoading(false)
    onOpenChange(false)
    
    // Reset form
    setName("")
    setDescription("")
    setAssignee("")
    setPriority("medium")
    setStatus("active")
    setDueDate(undefined)
    setStartDate(undefined)
    setIcon("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{config.title}</DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name field (always shown) */}
            <div className="grid gap-2">
              <Label htmlFor="name">{t('fields.name')} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={`${t('common.name')}...`}
                required
              />
            </div>

            {/* Description field */}
            {config.fields.includes("description") && (
              <div className="grid gap-2">
                <Label htmlFor="description">{t('fields.description')}</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={`${t('fields.description')}...`}
                  rows={3}
                />
              </div>
            )}

            {/* Icon field (for workspace) */}
            {config.fields.includes("icon") && (
              <div className="grid gap-2">
                <Label htmlFor="icon">{t('fields.icon')}</Label>
                <Input
                  id="icon"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="🎬"
                  maxLength={2}
                />
              </div>
            )}

            {/* Assignee field */}
            {config.fields.includes("assignee") && (
              <div className="grid gap-2">
                <Label htmlFor="assignee">{t('fields.assignee')}</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('fields.assignee')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="user1">John Doe</SelectItem>
                    <SelectItem value="user2">Jane Smith</SelectItem>
                    <SelectItem value="user3">Bob Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Priority field */}
            {config.fields.includes("priority") && (
              <div className="grid gap-2">
                <Label htmlFor="priority">{t('fields.priority')}</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('priority.low')}</SelectItem>
                    <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                    <SelectItem value="high">{t('priority.high')}</SelectItem>
                    <SelectItem value="urgent">{t('priority.urgent')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Status field */}
            {config.fields.includes("status") && (
              <div className="grid gap-2">
                <Label htmlFor="status">{t('fields.status')}</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('statuses.active')}</SelectItem>
                    <SelectItem value="on-hold">{t('statuses.blocked')}</SelectItem>
                    <SelectItem value="completed">{t('statuses.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Due Date field */}
            {config.fields.includes("dueDate") && (
              <div className="grid gap-2">
                <Label>{t('fields.dueDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : t('date.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Start Date field */}
            {config.fields.includes("startDate") && (
              <div className="grid gap-2">
                <Label>{t('fields.startDate')}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : t('date.pickDate')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading || !name}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.create')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
