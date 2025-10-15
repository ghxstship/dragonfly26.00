"use client"

import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle, CheckCircle2, XCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InventoryLevel {
  available: number
  committed: number
  incoming: number
  location_name?: string
}

interface InventoryBadgeProps {
  variantId?: string
  inventoryQuantity?: number
  inventoryLevels?: InventoryLevel[]
  lowStockThreshold?: number
  showQuantity?: boolean
  showLocations?: boolean
  inventoryPolicy?: 'continue' | 'deny'
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function InventoryBadge({
  variantId,
  inventoryQuantity = 0,
  inventoryLevels,
  lowStockThreshold = 10,
  showQuantity = true,
  showLocations = false,
  inventoryPolicy = 'deny',
  className,
  size = 'md'
}: InventoryBadgeProps) {
  // Calculate total available across all locations
  const totalAvailable = inventoryLevels
    ? inventoryLevels.reduce((sum, level) => sum + level.available, 0)
    : inventoryQuantity

  const totalIncoming = inventoryLevels
    ? inventoryLevels.reduce((sum, level) => sum + level.incoming, 0)
    : 0

  const getStockStatus = () => {
    if (totalAvailable === 0) {
      if (totalIncoming > 0) {
        return {
          status: 'preorder',
          label: 'Pre-order',
          description: `${totalIncoming} incoming`,
          variant: 'outline' as const,
          className: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
          icon: Clock
        }
      }
      if (inventoryPolicy === 'continue') {
        return {
          status: 'backorder',
          label: 'Backorder',
          description: 'Available for backorder',
          variant: 'outline' as const,
          className: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
          icon: Package
        }
      }
      return {
        status: 'out_of_stock',
        label: 'Out of Stock',
        description: 'Currently unavailable',
        variant: 'outline' as const,
        className: 'bg-red-500/10 text-red-600 border-red-500/20',
        icon: XCircle
      }
    }

    if (totalAvailable <= lowStockThreshold) {
      return {
        status: 'low_stock',
        label: 'Low Stock',
        description: `Only ${totalAvailable} left`,
        variant: 'outline' as const,
        className: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        icon: AlertTriangle
      }
    }

    return {
      status: 'in_stock',
      label: 'In Stock',
      description: `${totalAvailable} available`,
      variant: 'outline' as const,
      className: 'bg-green-500/10 text-green-600 border-green-500/20',
      icon: CheckCircle2
    }
  }

  const stockInfo = getStockStatus()
  const Icon = stockInfo.icon

  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6',
    lg: 'text-base h-7'
  }

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-3.5 w-3.5',
    lg: 'h-4 w-4'
  }

  if (showLocations && inventoryLevels && inventoryLevels.length > 0) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center gap-1.5">
          <Icon className={iconSizeClasses[size]} />
          <span className="text-sm font-medium">
            {stockInfo.label}
            {showQuantity && ` (${totalAvailable})`}
          </span>
        </div>
        <div className="space-y-1">
          {inventoryLevels.map((level, index) => (
            <div key={index} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{level.location_name || `Location ${index + 1}`}</span>
              <span className="font-medium">
                {level.available > 0 ? (
                  <span className="text-green-600">{level.available} available</span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Badge
      variant={stockInfo.variant}
      className={cn(
        stockInfo.className,
        sizeClasses[size],
        "font-medium gap-1",
        className
      )}
    >
      <Icon className={iconSizeClasses[size]} />
      {stockInfo.label}
      {showQuantity && totalAvailable > 0 && totalAvailable <= lowStockThreshold && (
        <span className="ml-1">({totalAvailable})</span>
      )}
    </Badge>
  )
}

// Compact version for product cards
export function InventoryDot({ 
  inventoryQuantity = 0, 
  lowStockThreshold = 10,
  className 
}: { 
  inventoryQuantity?: number
  lowStockThreshold?: number
  className?: string 
}) {
  const getColorClass = () => {
    if (inventoryQuantity === 0) return 'bg-red-500'
    if (inventoryQuantity <= lowStockThreshold) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <span 
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        getColorClass(),
        className
      )}
      title={
        inventoryQuantity === 0
          ? 'Out of stock'
          : inventoryQuantity <= lowStockThreshold
          ? `Low stock (${inventoryQuantity} left)`
          : `In stock (${inventoryQuantity} available)`
      }
    />
  )
}
