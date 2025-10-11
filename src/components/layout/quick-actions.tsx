"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Calendar,
  ClipboardList,
  FileText,
  HelpCircle,
  LayoutGrid,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUIStore } from "@/store/ui-store"

export function QuickActions() {
  const router = useRouter()
  const { currentWorkspace } = useUIStore()
  const [showHelp, setShowHelp] = useState(false)
  return (
    <TooltipProvider delayDuration={300}>
      <div className="hidden md:flex items-center gap-1">
        {/* Quick Calendar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => router.push(`/workspace/${currentWorkspace?.id}/events/show-calendar`)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Calendar</p>
            <kbd className="ml-2 text-xs">C</kbd>
          </TooltipContent>
        </Tooltip>

        {/* Tasks */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => router.push(`/workspace/${currentWorkspace?.id}/projects/my-tasks`)}
            >
              <ClipboardList className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>My Tasks</p>
            <kbd className="ml-2 text-xs">T</kbd>
          </TooltipContent>
        </Tooltip>

        {/* Docs */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => router.push(`/workspace/${currentWorkspace?.id}/files/all-documents`)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Docs</p>
            <kbd className="ml-2 text-xs">D</kbd>
          </TooltipContent>
        </Tooltip>

        {/* Apps */}
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Apps</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/admin/automations`)}>
              <Zap className="mr-2 h-4 w-4" />
              Automations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/files/templates`)}>
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/admin/plugins`)}>
              <LayoutGrid className="mr-2 h-4 w-4" />
              Integrations
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9"
              onClick={() => setShowHelp(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Help & Shortcuts</p>
            <kbd className="ml-2 text-xs">?</kbd>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
