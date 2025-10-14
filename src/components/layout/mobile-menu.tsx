"use client"

import {
  MessageSquare,
  Activity,
  Clock,
  HelpCircle,
  Menu,
  Filter,
  ArrowUpDown,
  Columns3,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUIStore } from "@/store/ui-store"

export function MobileMenu() {
  const { setRightSidebarOpen } = useUIStore()

  const menuItems = [
    {
      label: "Comments",
      icon: MessageSquare,
      action: () => setRightSidebarOpen(true, 'comments'),
    },
    {
      label: "Activity",
      icon: Activity,
      action: () => setRightSidebarOpen(true, 'activity'),
    },
    {
      label: "Time Tracking",
      icon: Clock,
      action: () => setRightSidebarOpen(true, 'time'),
    },
    {
      label: "Filters",
      icon: Filter,
      action: () => setRightSidebarOpen(true, 'filter'),
    },
    {
      label: "Sort",
      icon: ArrowUpDown,
      action: () => setRightSidebarOpen(true, 'sort'),
    },
    {
      label: "Fields",
      icon: Columns3,
      action: () => setRightSidebarOpen(true, 'fields'),
    },
    {
      label: "Help",
      icon: HelpCircle,
      action: () => setRightSidebarOpen(true, 'help'),
    },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px]">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.label}
                variant="ghost"
                className="w-full justify-start gap-3 h-11"
                onClick={item.action}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
