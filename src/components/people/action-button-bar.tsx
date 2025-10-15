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
    <div className="flex items-center justify-between gap-2 p-3 bg-background border-b sticky top-0 z-40">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Primary Actions */}
        {onAddEmployee && (
          <Button onClick={onAddEmployee} size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        )}

        {onClockInOut && (
          <Button onClick={onClockInOut} variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            Clock In/Out
          </Button>
        )}

        {onRequestPTO && (
          <Button onClick={onRequestPTO} variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Request PTO
          </Button>
        )}

        {onSwapShift && (
          <Button onClick={onSwapShift} variant="outline" size="sm">
            <Repeat className="h-4 w-4 mr-2" />
            Swap Shift
          </Button>
        )}

        {onApprove && pendingApprovals > 0 && (
          <Button onClick={onApprove} variant="outline" size="sm" className="relative">
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Approve
            <Badge variant="destructive" className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {pendingApprovals}
            </Badge>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onAddEmployee && (
              <DropdownMenuItem onClick={onAddEmployee}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </DropdownMenuItem>
            )}
            {onClockInOut && (
              <DropdownMenuItem onClick={onClockInOut}>
                <Clock className="h-4 w-4 mr-2" />
                Clock In/Out
              </DropdownMenuItem>
            )}
            {onRequestPTO && (
              <DropdownMenuItem onClick={onRequestPTO}>
                <Calendar className="h-4 w-4 mr-2" />
                Request PTO
              </DropdownMenuItem>
            )}
            {onSwapShift && (
              <DropdownMenuItem onClick={onSwapShift}>
                <Repeat className="h-4 w-4 mr-2" />
                Request Shift Swap
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {onExport && (
              <DropdownMenuItem onClick={onExport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export Data
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Search */}
        {onSearch && (
          <Button onClick={onSearch} variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
