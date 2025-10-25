"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useLocale } from "next-intl"
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
  const locale = useLocale()
  const { currentWorkspace } = useUIStore()
  const [showHelp, setShowHelp] = useState(false)
  return (
    <TooltipProvider delayDuration={300}>
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
        <DropdownMenuContent align="end" className="w-full sm:w-64">
          <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/admin/integrations`)}>
            <LayoutGrid className="mr-2 h-4 w-4" />
            Integrations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/admin/automations`)}>
            <Zap className="mr-2 h-4 w-4" />
            Automations
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/workspace/${currentWorkspace?.id}/admin/templates`)}>
            <FileText className="mr-2 h-4 w-4" />
            Templates
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
