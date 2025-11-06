"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  MinusCircle,
  User,
  Calendar,
  AlertTriangle
} from "lucide-react"

export type EmploymentStatus = "active" | "inactive" | "on_leave" | "terminated"
export type ApprovalStatus = "pending" | "approved" | "denied" | "cancelled"
export type ComplianceStatus = "compliant" | "warning" | "violation"

interface StatusBadgeProps {
  type: "employment" | "approval" | "compliance" | "custom"
  status: string
  label?: string
  showIcon?: boolean
  className?: string
}

export function StatusBadge({ 
  type, 
  status, 
  label, 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  const config = getStatusConfig(type, status)
  
  return (
    <Badge 
      variant={config.variant as any}
      className={cn(
        "inline-flex items-center gap-1",
        config.className,
        className
      )}
    >
      {showIcon && config.icon}
      <span>{label || config.label}</span>
    </Badge>
  )
}

function getStatusConfig(type: string, status: string) {
  // Employment Status
  if (type === "employment") {
    switch (status) {
      case "active":
        return {
          variant: "default",
          className: "bg-green-500 hover:bg-green-600 text-white",
          icon: <CheckCircle2 className="h-3 w-3 flex-shrink-0" />,
          label: "Active"
        }
      case "on_leave":
        return {
          variant: "secondary",
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
          icon: <Calendar aria-hidden="true" className="h-3 w-3" />,
          label: "On Leave"
        }
      case "inactive":
        return {
          variant: "secondary",
          className: "bg-gray-400 hover:bg-gray-500 text-white",
          icon: <MinusCircle aria-hidden="true" className="h-3 w-3" />,
          label: "Inactive"
        }
      case "terminated":
        return {
          variant: "destructive",
          className: "",
          icon: <XCircle aria-hidden="true" className="h-3 w-3" />,
          label: "Terminated"
        }
      default:
        return {
          variant: "outline",
          className: "",
          icon: <User aria-hidden="true" className="h-3 w-3" />,
          label: status
        }
    }
  }

  // Approval Status
  if (type === "approval") {
    switch (status) {
      case "pending":
        return {
          variant: "secondary",
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
          icon: <Clock aria-hidden="true" className="h-3 w-3" />,
          label: "Pending"
        }
      case "approved":
        return {
          variant: "default",
          className: "bg-green-500 hover:bg-green-600 text-white",
          icon: <CheckCircle2 className="h-3 w-3 flex-shrink-0" />,
          label: "Approved"
        }
      case "denied":
        return {
          variant: "destructive",
          className: "",
          icon: <XCircle aria-hidden="true" className="h-3 w-3" />,
          label: "Denied"
        }
      case "cancelled":
        return {
          variant: "outline",
          className: "",
          icon: <MinusCircle aria-hidden="true" className="h-3 w-3" />,
          label: "Cancelled"
        }
      default:
        return {
          variant: "outline",
          className: "",
          icon: <Clock aria-hidden="true" className="h-3 w-3" />,
          label: status
        }
    }
  }

  // Compliance Status
  if (type === "compliance") {
    switch (status) {
      case "compliant":
        return {
          variant: "default",
          className: "bg-green-500 hover:bg-green-600 text-white",
          icon: <CheckCircle2 className="h-3 w-3 flex-shrink-0" />,
          label: "Compliant"
        }
      case "warning":
        return {
          variant: "secondary",
          className: "bg-yellow-500 hover:bg-yellow-600 text-white",
          icon: <AlertTriangle aria-hidden="true" className="h-3 w-3" />,
          label: "Warning"
        }
      case "violation":
        return {
          variant: "destructive",
          className: "",
          icon: <AlertCircle aria-hidden="true" className="h-3 w-3" />,
          label: "Violation"
        }
      default:
        return {
          variant: "outline",
          className: "",
          icon: <AlertTriangle aria-hidden="true" className="h-3 w-3" />,
          label: status
        }
    }
  }

  // Custom
  return {
    variant: "outline",
    className: "",
    icon: null,
    label: status
  }
}

// Employment Type Badge
export function EmploymentTypeBadge({ type }: { type: string }) {
  const typeConfig: Record<string, { label: string; className: string }> = {
    full_time: { label: "FT", className: "bg-blue-500 text-white" },
    part_time: { label: "PT", className: "bg-purple-500 text-white" },
    contractor: { label: "CTR", className: "bg-orange-500 text-white" },
    freelance: { label: "FL", className: "bg-pink-500 text-white" },
    volunteer: { label: "VOL", className: "bg-green-500 text-white" },
  }

  const config = typeConfig[type] || { label: type, className: "" }

  return (
    <Badge aria-hidden="true" className={cn("text-xs px-2 py-0", config.className)}>
      {config.label}
    </Badge>
  )
}

// Status Indicator Dot (for compact display)
export function StatusDot({ 
  status, 
  size = "sm",
  className 
}: { 
  status: "success" | "warning" | "error" | "info" | "default"
  size?: "sm" | "md" | "lg"
  className?: string 
}) {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4"
  }

  const colorClasses = {
    success: "bg-green-500",
    warning: "bg-yellow-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-gray-400"
  }

  return (
    <div 
      className={cn(
        "rounded-full inline-block",
        sizeClasses[size],
        colorClasses[status],
        className
      )}
    />
  )
}
