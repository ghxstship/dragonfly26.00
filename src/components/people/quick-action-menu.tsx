"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  MoreVertical,
  Eye,
  Edit,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Upload,
  UserCog,
  CheckCircle2,
  FileText
} from "lucide-react"

interface QuickActionMenuProps {
  personnelId: string
  personnelName: string
  onViewProfile?: () => void
  onEditDetails?: () => void
  onSendMessage?: () => void
  onRequestPTO?: () => void
  onViewTimesheet?: () => void
  onViewPerformance?: () => void
  onReassignManager?: () => void
  onUploadDocument?: () => void
  onApprovePending?: (count: number) => void
  pendingApprovalsCount?: number
}

export function QuickActionMenu({
  personnelId,
  personnelName,
  onViewProfile,
  onEditDetails,
  onSendMessage,
  onRequestPTO,
  onViewTimesheet,
  onViewPerformance,
  onReassignManager,
  onUploadDocument,
  onApprovePending,
  pendingApprovalsCount = 0
}: QuickActionMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {onViewProfile && (
          <DropdownMenuItem onClick={onViewProfile}>
            <Eye className="h-4 w-4 mr-2" />
            View Profile
          </DropdownMenuItem>
        )}
        {onEditDetails && (
          <DropdownMenuItem onClick={onEditDetails}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {onSendMessage && (
          <DropdownMenuItem onClick={onSendMessage}>
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </DropdownMenuItem>
        )}
        {onRequestPTO && (
          <DropdownMenuItem onClick={onRequestPTO}>
            <Calendar className="h-4 w-4 mr-2" />
            Request PTO
          </DropdownMenuItem>
        )}
        {onViewTimesheet && (
          <DropdownMenuItem onClick={onViewTimesheet}>
            <Clock className="h-4 w-4 mr-2" />
            View Timesheet
          </DropdownMenuItem>
        )}
        {onViewPerformance && (
          <DropdownMenuItem onClick={onViewPerformance}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Performance
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {onReassignManager && (
          <DropdownMenuItem onClick={onReassignManager}>
            <UserCog className="h-4 w-4 mr-2" />
            Reassign Manager
          </DropdownMenuItem>
        )}
        {onUploadDocument && (
          <DropdownMenuItem onClick={onUploadDocument}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </DropdownMenuItem>
        )}
        {onApprovePending && pendingApprovalsCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onApprovePending(pendingApprovalsCount)}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Approve Pending ({pendingApprovalsCount})
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Hover card version for employee cards
export function EmployeeQuickActions({
  personnelId,
  className
}: {
  personnelId: string
  className?: string
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap flex-col md:flex-row items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-7">
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7">
          <Edit className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7">
          <Mail className="h-3 w-3" />
        </Button>
        <QuickActionMenu personnelId={personnelId} personnelName="" />
      </div>
    </div>
  )
}
