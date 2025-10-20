"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { LoadingSpinner } from "@/components/atoms"
import { SearchBar, SortControl, FilterButton, ActionMenu } from "@/components/molecules"
import { StatusBadge, PriorityBadge, TypeBadge } from "@/components/atoms"
import { EmptyState } from "@/components/shared/empty-state"
import { SectionHeading } from "@/components/atoms"
import { cn } from "@/lib/utils"

/**
 * DataTableOrganism - Organism Component
 * 
 * Full-featured data table with sorting, filtering, search, and selection.
 * Replaces 120+ hardcoded table implementations.
 * 
 * Features:
 * - Column configuration
 * - Sorting
 * - Filtering
 * - Search
 * - Row selection
 * - Action menus
 * - Loading/empty states
 * - Responsive
 */

export interface DataTableOrganismColumn {
  key: string
  label: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  width?: string
}

export interface DataTableOrganismProps<T = unknown> {
  data: T[]
  columns: DataTableOrganismColumn[]
  title?: string
  loading?: boolean
  searchable?: boolean
  searchPlaceholder?: string
  sortable?: boolean
  selectable?: boolean
  onRowClick?: (row: any) => void
  onSelectionChange?: (selectedIds: string[]) => void
  emptyMessage?: string
  emptyAction?: () => void
  emptyActionLabel?: string
  className?: string
}

export function DataTableOrganism({
  data,
  columns,
  title,
  loading,
  searchable,
  searchPlaceholder,
  sortable,
  selectable,
  onRowClick,
  onSelectionChange,
  emptyMessage,
  emptyAction,
  emptyActionLabel,
  className,
}: DataTableOrganismProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string>()
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  if (loading) {
    return <LoadingSpinner />
  }

  // Filter data by search
  const filteredData = searchQuery
    ? data.filter(row =>
        Object.values(row as Record<string, any>).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : data

  // Sort data
  const sortedData = sortColumn
    ? [...filteredData].sort((a: any, b: any) => {
        const aVal = a[sortColumn]
        const bVal = b[sortColumn]
        const modifier = sortDirection === 'asc' ? 1 : -1
        return aVal > bVal ? modifier : -modifier
      })
    : filteredData

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(sortedData.map((row: any) => row.id)))
    } else {
      setSelectedIds(new Set())
    }
    onSelectionChange?.(checked ? sortedData.map((row: any) => row.id) : [])
  }

  const handleSelectRow = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
    onSelectionChange?.(Array.from(newSelected))
  }

  const sortOptions = columns
    .filter(col => col.sortable)
    .map(col => ({ value: col.key, label: col.label }))

  return (
    <Card className={className}>
      {(title || searchable || sortable) && (
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            {title && <SectionHeading level={2}>{title}</SectionHeading>}
            <div className="flex items-center gap-2 ml-auto">
              {searchable && (
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder={searchPlaceholder}
                />
              )}
              {sortable && sortOptions.length > 0 && (
                <SortControl
                  options={sortOptions}
                  value={sortColumn}
                  direction={sortDirection}
                  onChange={(col, dir) => {
                    setSortColumn(col)
                    setSortDirection(dir)
                  }}
                />
              )}
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        {sortedData.length === 0 ? (
          <EmptyState
            variant="inline"
            mainMessage={emptyMessage || "No data found"}
            actionLabel={emptyActionLabel}
            onAction={emptyAction}
          />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {selectable && (
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedIds.size === sortedData.length}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                  )}
                  {columns.map(column => (
                    <TableHead key={column.key} style={{ width: column.width }}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((row: any) => (
                  <TableRow
                    key={row.id}
                    className={cn(onRowClick && "cursor-pointer")}
                    onClick={() => onRowClick?.(row)}
                  >
                    {selectable && (
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={(checked) => handleSelectRow(row.id, !!checked)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${row.id}`}
                        />
                      </TableCell>
                    )}
                    {columns.map(column => (
                      <TableCell key={column.key}>
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
