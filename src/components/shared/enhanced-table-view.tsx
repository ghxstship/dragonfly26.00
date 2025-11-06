"use client"

import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { ArrowUpDown, Plus, Grid3x3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { RecordActionsMenu } from "./record-actions-menu"
import { BulkActionsToolbar } from "./bulk-actions-toolbar"
import { CrudDrawer } from "./crud-drawer"
import { MobileTableCard } from "./mobile-table-card"
import { EmptyState } from "./empty-state"
import { CreateItemDialogEnhanced } from "./create-item-dialog-enhanced"
import { getFormConfig } from "@/lib/modules/form-fields-registry"
import { useIsMobile } from "@/hooks/use-is-mobile"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface EnhancedTableViewProps {
  data: DataItem[]
  schema: FieldSchema[]
  moduleId: string
  tabSlug: string
  workspaceId: string
  onRefresh?: () => void
  onCreate?: (data: Record<string, any>) => Promise<void>
  onUpdate?: (id: string, updates: Record<string, any>) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onBulkDelete?: (ids: string[]) => Promise<void>
  loading?: boolean
}

export function EnhancedTableView({
  data,
  schema,
  moduleId,
  tabSlug,
  workspaceId,
  onRefresh,
  onCreate,
  onUpdate,
  onDelete,
  onBulkDelete,
  loading = false,
}: EnhancedTableViewProps) {
  const isMobile = useIsMobile()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit' | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table')
  
  // Get contextualized button text from form config
  const formConfig = getFormConfig(moduleId, tabSlug)
  const createButtonText = formConfig?.title?.replace('Create ', '').replace('Add ', '')  || 'New'

  // Get list fields from schema
  const listFields = schema.filter(f => f.showInList !== false).sort((a, b) => (a.order || 99) - (b.order || 99))

  // Build dynamic columns
  const columns: ColumnDef<DataItem>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    ...listFields.map((field) => ({
      accessorKey: field.id,
      header: ({ column }: any) => {
        if (!field.sortable) return field.label
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2"
          >
            {field.label}
            <ArrowUpDown aria-hidden="true" className="ml-2 h-3 w-3" />
          </Button>
        )
      },
      cell: ({ row }: any) => {
        const value = row.getValue(field.id)
        return renderCellValue(value, field)
      },
    })),
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        return (
          <RecordActionsMenu
            onViewDetails={() => {
              setSelectedItem(item)
              setDrawerMode('view')
            }}
            onEdit={() => {
              setSelectedItem(item)
              setDrawerMode('edit')
            }}
            onDuplicate={() => handleDuplicate(item)}
            onDelete={() => handleDeleteSingle(item.id)}
          />
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map(row => row.original.id)

  const handleDeleteSingle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    await onDelete?.(id)
    onRefresh?.()
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) return
    await onBulkDelete?.(selectedIds)
    setRowSelection({})
    onRefresh?.()
  }

  const handleDuplicate = async (item: DataItem) => {
    const { id, created_at, updated_at, ...rest } = item
    await onCreate?.({ ...rest, name: `${item.name || item.title} (Copy)` })
    onRefresh?.()
  }

  const handleRowClick = (item: DataItem) => {
    setSelectedItem(item)
    setDrawerMode('view')
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header Actions */}
        <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {data.length} {data.length === 1 ? 'item' : 'items'}
          </div>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            {/* View Toggle - Desktop Only */}
            {!isMobile && (
              <div className="hidden md:flex items-center border rounded-md">
                <Button
                  variant={viewMode === 'table' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('table')}
                >
                  <List aria-hidden="true" className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'card' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setViewMode('card')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
              </div>
            )}
            <Button onClick={() => setCreateDialogOpen(true)} size="sm" className="h-9">
              <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
              <span className="hidden md:block sm:inline">{createButtonText}</span>
              <span className="sm:hidden md:block">{createButtonText}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Card View */}
        {(isMobile || viewMode === 'card') && (
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
                Loading...
              </div>
            ) : data.length > 0 ? (
              data.map((item) => (
                <MobileTableCard
                  key={item.id}
                  item={item}
                  schema={schema}
                  onViewDetails={() => {
                    setSelectedItem(item)
                    setDrawerMode('view')
                  }}
                  onEdit={() => {
                    setSelectedItem(item)
                    setDrawerMode('edit')
                  }}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDeleteSingle}
                />
              ))
            ) : (
              <EmptyState
                variant="compact"
                mainMessage="No data found"
                description="Add your first item to get started"
                actionLabel="Add Item"
                onAction={onCreate ? () => setCreateDialogOpen(true) : undefined}
              />
            )}
          </div>
        )}

        {/* Desktop Table View */}
        {!isMobile && viewMode === 'table' && (
          <div className="rounded-md border overflow-x-auto">
            <div className="min-w-[640px] max-w-full overflow-x-auto">
        <table className="w-full max-w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="h-10 px-4 text-left align-middle font-medium text-muted-foreground text-sm"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="h-24 text-center">
                    Loading...
                  </td>
                </tr>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="p-4 align-middle text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-0">
                    <EmptyState
                      variant="compact"
                      mainMessage="No data found"
                      description="Add your first item to get started"
                      actionLabel="Add Item"
                      onAction={onCreate ? () => setCreateDialogOpen(true) : undefined}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
            </div>
          </div>
        )}

        {/* Selection Info */}
        {selectedRows.length > 0 && !isMobile && (
          <div className="text-sm text-muted-foreground">
            {selectedRows.length} of {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedIds.length}
        onClearSelection={() => setRowSelection({})}
        onDelete={handleBulkDelete}
        onDuplicate={() => {/* Bulk duplicate */}}
        onArchive={() => {/* Bulk archive */}}
      />

      {/* CRUD Drawer - for View/Edit only */}
      <CrudDrawer
        mode={drawerMode || 'view'}
        item={selectedItem}
        schema={schema}
        open={drawerMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerMode(null)
            setSelectedItem(null)
          }
        }}
        onCreate={async (data) => {
          await onCreate?.(data)
          onRefresh?.()
        }}
        onUpdate={async (id, updates) => {
          await onUpdate?.(id, updates)
          onRefresh?.()
        }}
        onDelete={async (id) => {
          await onDelete?.(id)
          onRefresh?.()
        }}
        onDuplicate={handleDuplicate}
        loading={loading}
      />

      {/* Create Item Dialog - Dialog not Drawer */}
      <CreateItemDialogEnhanced
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        moduleId={moduleId}
        tabSlug={tabSlug}
        workspaceId={workspaceId}
        onSuccess={async (item) => {
          await onCreate?.(item)
          onRefresh?.()
        }}
      />
    </>
  )
}

// Render cell values based on field type
function renderCellValue(value: any, field: FieldSchema) {
  if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>

  switch (field.type) {
    // Status types
    case 'status':
    case 'label':
      const statusOption = field.options?.find(opt => opt.value === value)
      return (
        <Badge 
          variant="secondary" 
          style={{ backgroundColor: statusOption?.color + '20', color: statusOption?.color }}
        >
          {statusOption?.label || value}
        </Badge>
      )

    case 'priority':
      const priorityColors: Record<string, string> = {
        'urgent': '#dc2626',
        'high': '#ea580c',
        'normal': '#2563eb',
        'low': '#64748b'
      }
      return (
        <Badge 
          variant="secondary"
          style={{ backgroundColor: priorityColors[value] + '20', color: priorityColors[value] }}
        >
          {value}
        </Badge>
      )

    // Date/Time types
    case 'date':
      return new Date(value).toLocaleDateString()

    case 'datetime':
    case 'createdby':
    case 'modifiedby':
      return new Date(value).toLocaleString()

    case 'time':
      return value

    case 'daterange':
      if (!value?.start && !value?.end) return <span className="text-muted-foreground">—</span>
      return `${new Date(value.start).toLocaleDateString()} - ${new Date(value.end).toLocaleDateString()}`

    // Number types
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)

    case 'percent':
      return `${value}%`

    case 'decimal':
      return parseFloat(value).toFixed(2)

    case 'duration':
      const hours = Math.floor(value / 60)
      const minutes = value % 60
      return `${hours}h ${minutes}m`

    case 'progress':
      return (
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 min-w-[100px]">
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden md:block">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{value}%</span>
        </div>
      )

    // Selection types
    case 'multiselect':
    case 'tags':
    case 'badge':
      if (!Array.isArray(value)) return null
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 3}
            </Badge>
          )}
        </div>
      )

    case 'toggle':
    case 'checkbox':
      return value ? '✓' : '—'

    // User types
    case 'user':
      return <Badge variant="outline" className="text-xs">User {value}</Badge>

    case 'users':
      if (!Array.isArray(value)) return null
      return (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 2).map((userId, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              User {userId}
            </Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      )

    // Visual types
    case 'color':
      return (
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <div
            className="w-6 h-6 rounded border"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs text-muted-foreground">{value}</span>
        </div>
      )

    case 'rating':
      return (
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm">
              {i < value ? '★' : '☆'}
            </span>
          ))}
        </div>
      )

    case 'avatar':
    case 'icon':
      return (
        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden md:block">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Avatar" className="w-full h-full object-cover max-w-full" />
          ) : (
            <div className="w-full h-full flex flex-wrap items-center justify-center text-muted-foreground max-w-full">
              ?
            </div>
          )}
        </div>
      )

    // Media types  
    case 'file':
    case 'image':
    case 'signature':
      return <Badge variant="outline" className="text-xs">📎 File</Badge>

    case 'files':
    case 'images':
      if (!Array.isArray(value)) return null
      return <Badge variant="outline" className="text-xs">📎 {value.length} files</Badge>

    // Advanced types
    case 'relation':
    case 'lookup':
      return <Badge variant="outline" className="text-xs">→ {value}</Badge>

    case 'formula':
    case 'rollup':
    case 'count':
    case 'autonumber':
      return <span className="text-xs text-muted-foreground">{value}</span>

    // Specialized types
    case 'barcode':
    case 'qrcode':
      return <Badge variant="outline" className="text-xs font-mono">{value}</Badge>

    case 'json':
      return <span className="text-xs font-mono text-muted-foreground">&#123;...&#125;</span>

    case 'coordinates':
      if (!value?.lat || !value?.lng) return <span className="text-muted-foreground">—</span>
      return <span className="text-xs">{value.lat.toFixed(4)}, {value.lng.toFixed(4)}</span>

    // Link types
    case 'email':
      return <a href={`mailto:${value}`} className="text-primary hover:underline text-sm">{value}</a>

    case 'phone':
      return <a href={`tel:${value}`} className="text-primary hover:underline text-sm">{value}</a>

    case 'url':
      return <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">🔗 Link</a>

    default:
      return <span className="text-sm">{String(value)}</span>
  }
}
