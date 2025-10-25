"use client"

import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "operational" | "degraded" | "outage" | "maintenance"
  label: string
  className?: string
}

const statusStyles = {
  operational: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  degraded: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  outage: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  maintenance: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

export function StatusBadge({ status, label, className }: StatusBadgeProps): JSX.Element {
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      statusStyles[status],
      className
    )}>
      <span className={cn(
        "w-2 h-2 rounded-full mr-2",
        status === "operational" && "bg-green-500",
        status === "degraded" && "bg-yellow-500",
        status === "outage" && "bg-red-500",
        status === "maintenance" && "bg-blue-500"
      )} />
      {label}
    </span>
  )
}
