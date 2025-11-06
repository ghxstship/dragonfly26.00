"use client"

/**
 * Example Data View Page
 * 
 * Demonstrates how to build a complete data view page using the atomic design system.
 * This serves as a reference implementation for custom data views.
 * 
 * Features:
 * - Multiple view types (table, board, list)
 * - Search and filtering
 * - Bulk actions
 * - Create functionality
 * - Full accessibility and i18n
 */

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Table, Kanban, List, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DataViewTemplate } from '@/components/templates'
import { ListViewOrganism, BoardViewOrganism, FilterPanelOrganism } from '@/components/organisms'
import type { DataItem } from '@/types'
import type { FieldSchema } from '@/lib/data-schemas'

// Example schema definition
const exampleSchema: FieldSchema[] = [
  { id: 'name', label: 'Name', type: 'text', showInList: true, order: 1 },
  { id: 'status', label: 'Status', type: 'select', showInList: true, order: 2 },
  { id: 'assignee', label: 'Assignee', type: 'text', showInList: true, order: 3 },
  { id: 'due_date', label: 'Due Date', type: 'date', showInList: true, order: 4 },
  { id: 'description', label: 'Description', type: 'textarea', showInList: false },
]

// Example data
const exampleData: DataItem[] = [
  {
    id: '1',
    name: 'Project Alpha',
    status: 'in_progress',
    assignee: 'John Doe',
    due_date: '2025-11-01',
    description: 'Important project',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Project Beta',
    status: 'todo',
    assignee: 'Jane Smith',
    due_date: '2025-11-15',
    description: 'New initiative',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Project Gamma',
    status: 'done',
    assignee: 'Bob Johnson',
    due_date: '2025-10-20',
    description: 'Completed work',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
]

// Example filter configuration
const filterGroups = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { id: 'todo', label: 'To Do', count: 5 },
      { id: 'in_progress', label: 'In Progress', count: 3 },
      { id: 'done', label: 'Done', count: 8 },
    ]
  },
  {
    id: 'assignee',
    label: 'Assignee',
    options: [
      { id: 'john', label: 'John Doe', count: 4 },
      { id: 'jane', label: 'Jane Smith', count: 6 },
      { id: 'bob', label: 'Bob Johnson', count: 6 },
    ]
  }
]

export function ExampleDataViewPage() {
  const t = useTranslations()
  
  // State management
  const [data, setData] = useState<DataItem[]>(exampleData)
  const [search, setSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})

  // Filter data based on search and active filters
  const filteredData = data.filter(item => {
    // Search filter
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) {
      return false
    }
    
    // Active filters
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length > 0 && !values.includes(item[key] as string)) {
        return false
      }
    }
    
    return true
  })

  // Get active filter labels for display
  const activeFilterLabels = Object.entries(activeFilters)
    .flatMap(([key, values]) => 
      values.map(value => {
        const group = filterGroups.find(g => g.id === key)
        const option = group?.options.find(o => o.id === value)
        return `${group?.label}: ${option?.label}`
      })
    )

  // Handlers
  const handleItemClick = (item: DataItem) => {
    console.log('Item clicked:', item)
    // Open detail drawer or navigate to detail page
  }

  const handleCreate = () => {
    console.log('Create new item')
    // Open create dialog or navigate to create page
  }

  const handleRemoveFilter = (filterLabel: string) => {
    // Parse filter label and remove from activeFilters
    const [groupLabel, optionLabel] = filterLabel.split(': ')
    const group = filterGroups.find(g => g.label === groupLabel)
    if (group) {
      setActiveFilters(prev => ({
        ...prev,
        [group.id]: prev[group.id]?.filter(v => {
          const option = group.options.find(o => o.id === v)
          return option?.label !== optionLabel
        }) || []
      }))
    }
  }

  const handleClearFilters = () => {
    setActiveFilters({})
  }

  const handleBulkExport = () => {
    console.log('Export selected items:', selectedItems)
  }

  const handleBulkDelete = () => {
    console.log('Delete selected items:', selectedItems)
    setData(prev => prev.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
  }

  return (
    <>
      <DataViewTemplate
        title="Example Data View"
        subtitle="Demonstrates atomic design system usage"
        views={[
          {
            id: 'table',
            label: 'Table',
            icon: <Table aria-hidden="true" className="h-4 w-4" />,
            content: (
              <div className="text-center py-6 md:py-4 md:py-6 lg:py-8 lg:py-12 text-muted-foreground">
                Table view would use EnhancedTableView component here
              </div>
            )
          },
          {
            id: 'board',
            label: 'Board',
            icon: <Kanban aria-hidden="true" className="h-4 w-4" />,
            content: (
              <BoardViewOrganism
                data={filteredData}
                schema={exampleSchema}
                onItemClick={handleItemClick}
                onCreateAction={handleCreate}
              />
            )
          },
          {
            id: 'list',
            label: 'List',
            icon: <List aria-hidden="true" className="h-4 w-4" />,
            content: (
              <ListViewOrganism
                data={filteredData}
                schema={exampleSchema}
                onItemClick={handleItemClick}
                onCreateAction={handleCreate}
              />
            )
          }
        ]}
        defaultView="list"
        createLabel="New Item"
        onCreateClick={handleCreate}
        searchValue={search}
        onSearchChange={setSearch}
        onFilterClick={() => setShowFilters(true)}
        activeFilters={activeFilterLabels}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleClearFilters}
        selectedCount={selectedItems.length}
        bulkActions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkExport}
              className="gap-2"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />

      {/* Filter Panel */}
      <FilterPanelOrganism
        mode="sheet"
        filters={filterGroups}
        values={activeFilters}
        onChange={setActiveFilters}
        onClear={handleClearFilters}
      />
    </>
  )
}
