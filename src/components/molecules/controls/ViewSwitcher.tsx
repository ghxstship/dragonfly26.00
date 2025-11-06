"use client"

import { 
  LayoutGrid, 
  List, 
  Calendar, 
  BarChart3, 
  Table,
  Kanban,
  Clock,
  DollarSign,
  Grid3x3,
  MessageSquare,
  FileText,
  Globe,
  Network,
  FormInput,
  Monitor
} from "lucide-react"
import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * ViewSwitcher - Molecular Component
 * 
 * Reusable view mode switcher.
 * Replaces 30+ hardcoded view switcher implementations.
 */

export type ViewMode = 
  // Most Common Views
  | 'table'      // DataTableOrganism - Most frequently used
  | 'list'       // ListViewOrganism - Very common
  | 'grid'       // CardGridOrganism - Common for visual content
  | 'board'      // BoardViewOrganism - Common for kanban/projects
  | 'calendar'   // CalendarOrganism - Common for scheduling
  // Intermediate Views
  | 'timeline'   // TimelineOrganism - Project timelines
  | 'chart'      // Legacy/Dashboard charts - Analytics
  | 'form'       // FormBuilderOrganism - Data entry
  | 'document'   // DocumentEditorOrganism - Content editing
  // Specialty/Advanced Views
  | 'financial'  // FinancialDashboardOrganism - Finance-specific
  | 'pivot'      // PivotTableOrganism - Advanced analytics
  | 'chat'       // ChatOrganism - Communication
  | 'map'        // MapOrganism - Location-based
  | 'mindmap'    // MindMapOrganism - Brainstorming
  | 'embed'      // EmbedContainerOrganism - External content

export interface ViewSwitcherProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  modes: ViewMode[]
  className?: string
}

const viewIcons: Record<ViewMode, LucideIcon> = {
  // Most Common Views
  table: Table,
  list: List,
  grid: LayoutGrid,
  board: Kanban,
  calendar: Calendar,
  // Intermediate Views
  timeline: Clock,
  chart: BarChart3,
  form: FormInput,
  document: FileText,
  // Specialty/Advanced Views
  financial: DollarSign,
  pivot: Grid3x3,
  chat: MessageSquare,
  map: Globe,
  mindmap: Network,
  embed: Monitor,
}

const viewLabels: Record<ViewMode, string> = {
  // Most Common Views
  table: 'Table view',
  list: 'List view',
  grid: 'Grid view',
  board: 'Board view',
  calendar: 'Calendar view',
  // Intermediate Views
  timeline: 'Timeline view',
  chart: 'Chart view',
  form: 'Form view',
  document: 'Document view',
  // Specialty/Advanced Views
  financial: 'Financial view',
  pivot: 'Pivot view',
  chat: 'Chat view',
  map: 'Map view',
  mindmap: 'Mind map view',
  embed: 'Embed view',
}

export function ViewSwitcher({
  value,
  onChange,
  modes,
  className,
}: ViewSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-1 border rounded-lg p-1", className)} role="group" aria-label="View switcher">
      {modes.map((mode: any) => {
        const Icon = viewIcons[mode]
        const isActive = value === mode
        
        return (
          <Button
            key={mode}
            variant={isActive ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onChange(mode)}
            className={cn("h-8 w-8 p-0", isActive && "bg-secondary")}
            aria-label={viewLabels[mode]}
            aria-pressed={isActive}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </Button>
        )
      })}
    </div>
  )
}
