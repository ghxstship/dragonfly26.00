"use client"

import { useTranslations } from "next-intl"
import { 
  UserPlus, 
  Clock, 
  Calendar, 
  Repeat, 
  CheckCircle2, 
  FileDown,
  Search,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface ActionButtonBarProps {
  pendingApprovals?: number
  onAddEmployee?: () => void
  onClockInOut?: () => void
  onRequestPTO?: () => void
  onSwapShift?: () => void
  onApprove?: () => void
  onExport?: () => void
  onSearch?: () => void
}

export function ActionButtonBar({
  pendingApprovals = 0,
  onAddEmployee,
  onClockInOut,
  onRequestPTO,
  onSwapShift,
  onApprove,
  onExport,
  onSearch,
}: ActionButtonBarProps) {
  const t = useTranslations()

  return (
    <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between gap-2 p-3 bg-background border-b sticky top-0 z-40">
      <div className="flex flex-col md:flex-row items-center gap-2 flex-wrap">
        {/* Primary Actions */}
        {onAddEmployee && (
          <Button onClick={onAddEmployee} size="sm">
            <UserPlus aria-hidden="true" className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}

        {onClockInOut && (
          <Button onClick={onClockInOut} variant="outline" size="sm">
            <Clock aria-hidden="true" className="h-4 w-4 mr-2" />
            Clock In/Out
          </Button>
        )}

        {onRequestPTO && (
          <Button onClick={onRequestPTO} variant="outline" size="sm">
            <Calendar aria-hidden="true" className="h-4 w-4 mr-2" />
            Request PTO
          </Button>
        )}

        {onSwapShift && (
          <Button onClick={onSwapShift} variant="outline" size="sm">
            <Repeat aria-hidden="true" className="h-4 w-4 mr-2" />
            Swap Shift
          </Button>
        )}

        {onApprove && pendingApprovals > 0 && (
          <Button onClick={onApprove} variant="outline" size="sm" className="relative">
            <CheckCircle2 className="h-4 w-4 mr-2 flex-shrink-0" />
            Approve
            <Badge variant="destructive" className="ml-2 h-5 w-5 flex flex-wrap items-center justify-center p-0 text-xs">
              {pendingApprovals}
            </Badge>
          </Button>
        )}
      </div>

      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onAddEmployee && (
              <DropdownMenuItem onClick={onAddEmployee}>
                <UserPlus aria-hidden="true" className="h-4 w-4 mr-2" />
                Add Employee
              </DropdownMenuItem>
            )}
            {onClockInOut && (
              <DropdownMenuItem onClick={onClockInOut}>
                <Clock aria-hidden="true" className="h-4 w-4 mr-2" />
                Clock In/Out
              </DropdownMenuItem>
            )}
            {onRequestPTO && (
              <DropdownMenuItem onClick={onRequestPTO}>
                <Calendar aria-hidden="true" className="h-4 w-4 mr-2" />
                Request PTO
              </DropdownMenuItem>
            )}
            {onSwapShift && (
              <DropdownMenuItem onClick={onSwapShift}>
                <Repeat aria-hidden="true" className="h-4 w-4 mr-2" />
                Request Shift Swap
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <FileDown aria-hidden="true" className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        {onSearch && (
          <Button onClick={onSearch} variant="outline" size="icon">
            <Search aria-hidden="true" className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
