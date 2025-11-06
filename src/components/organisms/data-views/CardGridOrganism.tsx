"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/atoms"
import { SearchBar, FilterButton, ViewSwitcher } from "@/components/molecules"
import { EmptyState } from "@/components/shared/empty-state"
import { SectionHeading } from "@/components/atoms"
import { cn } from "@/lib/utils"

/**
 * CardGridOrganism - Organism Component
 * 
 * Grid layout for card-based data display.
 * Replaces 45+ hardcoded card grid implementations.
 */

export interface CardGridOrganismProps<T = unknown> {
  data: T[]
  title?: string
  loading?: boolean
  searchable?: boolean
  columns?: 1 | 2 | 3 | 4
  renderCard: (item: any) => React.ReactNode
  onCardClick?: (item: any) => void
  emptyMessage?: string
  emptyAction?: () => void
  emptyActionLabel?: string
  className?: string
}

const gridColumns = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export function CardGridOrganism({
  data,
  title,
  loading,
  searchable,
  columns = 3,
  renderCard,
  onCardClick,
  emptyMessage,
  emptyAction,
  emptyActionLabel,
  className,
}: CardGridOrganismProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (loading) return <LoadingSpinner />

  const filteredData = searchQuery
    ? data.filter(item =>
        Object.values(item as Record<string, any>).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  return (
    <Card aria-hidden="true" className={className}>
      {(title || searchable) && (
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between gap-2 md:gap-3 lg:gap-4">
            {title && <SectionHeading level={2}>{title}</SectionHeading>}
            {searchable && (
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="max-w-sm ml-auto"
              />
            )}
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        {filteredData.length === 0 ? (
          <EmptyState
            variant="inline"
            mainMessage={emptyMessage || "No items found"}
            actionLabel={emptyActionLabel}
            onAction={emptyAction}
          />
        ) : (
          <div className={cn("grid gap-4", gridColumns[columns])}>
            {filteredData.map((item: any) => (
              <div
                key={item.id}
                className={cn(
                  "border rounded-lg p-4 transition-colors",
                  onCardClick && "cursor-pointer hover:bg-accent"
                )}
                 role="button" tabIndex={0} onClick={() => onCardClick?.(item)}
              >
                {renderCard(item)}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
