"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, MoreHorizontal, TrendingUp, Users, DollarSign, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"

interface DashboardViewProps {
  data: DataItem[]
}

interface Widget {
  id: string
  type: "metric" | "chart" | "table" | "text"
  title: string
  col: number
  row: number
  colSpan: number
  rowSpan: number
  data?: any
}

export function DashboardView({ data }: DashboardViewProps) {
  const t = useTranslations()
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: "1",
      type: "metric",
      title: "Total Tasks",
      col: 0,
      row: 0,
      colSpan: 1,
      rowSpan: 1,
      data: { value: data.length, change: "+12%", icon: CheckCircle2 },
    },
    {
      id: "2",
      type: "metric",
      title: "Team Members",
      col: 1,
      row: 0,
      colSpan: 1,
      rowSpan: 1,
      data: { value: 24, change: "+3", icon: Users },
    },
    {
      id: "3",
      type: "metric",
      title: "Revenue",
      col: 2,
      row: 0,
      colSpan: 1,
      rowSpan: 1,
      data: { value: "$48.2k", change: "+8.3%", icon: DollarSign },
    },
    {
      id: "4",
      type: "metric",
      title: "Growth",
      col: 3,
      row: 0,
      colSpan: 1,
      rowSpan: 1,
      data: { value: "23.5%", change: "+2.1%", icon: TrendingUp },
    },
    {
      id: "5",
      type: "chart",
      title: "Task Completion",
      col: 0,
      row: 1,
      colSpan: 2,
      rowSpan: 2,
      data: {},
    },
    {
      id: "6",
      type: "chart",
      title: "Team Activity",
      col: 2,
      row: 1,
      colSpan: 2,
      rowSpan: 2,
      data: {},
    },
  ])

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "metric":
        const Icon = widget.data.icon
        return (
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {widget.title}
              </span>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-3xl font-bold">{widget.data.value}</div>
              <div className="text-sm text-green-600 mt-1">
                {widget.data.change}
              </div>
            </div>
          </div>
        )
      
      case "chart":
        return (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Chart: {widget.title}
          </div>
        )
      
      default:
        return <div>Widget</div>
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </div>

      {/* Widget Grid */}
      <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={cn(
              "bg-card border rounded-lg p-6 relative group"
            )}
            style={{
              gridColumn: `span ${widget.colSpan}`,
              gridRow: `span ${widget.rowSpan}`,
            }}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {renderWidget(widget)}
          </div>
        ))}
      </div>
    </div>
  )
}
