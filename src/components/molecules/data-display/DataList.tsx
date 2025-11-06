"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/atoms/indicators/LoadingSpinner"
import { EmptyState } from "@/components/shared/empty-state"
import { StatusBadge } from "@/components/atoms/badges/StatusBadge"
import { PriorityBadge } from "@/components/atoms/badges/PriorityBadge"
import { TypeBadge } from "@/components/atoms/badges/TypeBadge"
import { CategoryBadge } from "@/components/atoms/badges/CategoryBadge"
import { cn } from "@/lib/utils"

/**
 * DataList - Molecular Component
 * 
 * Reusable list display for any data type.
 * Replaces 100+ hardcoded list implementations.
 * 
 * Features:
 * - Automatic grouping by field
 * - Badge rendering for status/priority/type/category
 * - Loading and empty states
 * - Click handlers
 * - Consistent styling
 */

export interface DataListItem {
  id: string
  [key: string]: any
}

export interface DataListProps {
  data: DataListItem[]
  title?: string
  groupBy?: string
  onItemClick?: (item: DataListItem) => void
  loading?: boolean
  emptyMessage?: string
  emptyAction?: () => void
  emptyActionLabel?: string
  renderItem?: (item: DataListItem) => React.ReactNode
  className?: string
}

export function DataList({
  data,
  title,
  groupBy,
  onItemClick,
  loading,
  emptyMessage,
  emptyAction,
  emptyActionLabel,
  renderItem,
  className,
}: DataListProps) {
  if (loading) {
    return <LoadingSpinner />
  }

  if (data.length === 0) {
    return (
      <Card aria-hidden="true" className={className}>
        {title && (
          <CardHeader>
            <CardTitle aria-hidden="true" className="text-base">{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <EmptyState
            variant="inline"
            mainMessage={emptyMessage || "No items found"}
            actionLabel={emptyActionLabel}
            onAction={emptyAction}
          />
        </CardContent>
      </Card>
    )
  }

  // Group data if groupBy is specified
  const grouped = groupBy
    ? data.reduce((acc: any, item: any) => {
        const groupValue = item[groupBy] || 'ungrouped'
        if (!acc[groupValue]) acc[groupValue] = []
        acc[groupValue].push(item)
        return acc
      }, {} as Record<string, DataListItem[]>)
    : { all: data }

  return (
    <Card aria-hidden="true" className={className}>
      {title && (
        <CardHeader>
          <CardTitle aria-hidden="true" className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group}>
              {groupBy && group !== 'all' && (
                <h3 className="font-semibold text-sm mb-2 capitalize">
                  {group.replace(/_/g, ' ')}
                </h3>
              )}
              {(items as any[]).map((item: any) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 border rounded-lg transition-colors",
                    onItemClick && "hover:bg-accent cursor-pointer"
                  )}
                  role={onItemClick ? "button" : undefined}
                  tabIndex={onItemClick ? 0 : undefined}
                  onClick={() => onItemClick?.(item)}
                >
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <DefaultListItem item={item} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function DefaultListItem({ item }: { item: DataListItem }) {
  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{item.name || item.title || 'Untitled'}</h3>
          {item.description && (
            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
          )}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row flex-wrap items-center gap-2">
        {item.status && <StatusBadge status={item.status} />}
        {item.priority && <PriorityBadge priority={item.priority} />}
        {item.type && <TypeBadge type={item.type} />}
        {item.category && <CategoryBadge category={item.category} />}
      </div>
    </div>
  )
}
