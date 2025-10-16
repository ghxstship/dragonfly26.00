"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, SlidersHorizontal, X, Users, UserPlus, Calendar, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface SmartFiltersBarProps {
  onFilterChange?: (filters: FilterState) => void
  onSearch?: (query: string) => void
  departments?: FilterOption[]
  employmentStatuses?: FilterOption[]
  employmentTypes?: FilterOption[]
}

export interface FilterState {
  department: string
  status: string
  type: string
  quickFilter?: string
  searchQuery?: string
}

const defaultStatuses: FilterOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "on_leave", label: "On Leave" },
  { value: "inactive", label: "Inactive" },
]

const defaultTypes: FilterOption[] = [
  { value: "all", label: "All Types" },
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contractor", label: "Contractor" },
  { value: "freelance", label: "Freelance" },
]

export function SmartFiltersBar({
  onFilterChange,
  onSearch,
  departments = [{ value: "all", label: "All Departments" }],
  employmentStatuses = defaultStatuses,
  employmentTypes = defaultTypes,
}: SmartFiltersBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    department: "all",
    status: "active",
    type: "all",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [quickFilter, setQuickFilter] = useState<string | null>(null)

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
    
    // Clear quick filter if changing main filters
    if (quickFilter) {
      setQuickFilter(null)
    }
  }

  const handleQuickFilter = (filter: string) => {
    const newFilter = quickFilter === filter ? null : filter
    setQuickFilter(newFilter)
    
    const updatedFilters = { 
      ...filters, 
      quickFilter: newFilter || undefined 
    }
    onFilterChange?.(updatedFilters)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const updatedFilters = { ...filters, searchQuery: query }
    onFilterChange?.(updatedFilters)
    onSearch?.(query)
  }

  const clearFilters = () => {
    const resetFilters: FilterState = {
      department: "all",
      status: "active",
      type: "all",
    }
    setFilters(resetFilters)
    setSearchQuery("")
    setQuickFilter(null)
    onFilterChange?.(resetFilters)
  }

  const hasActiveFilters = 
    filters.department !== "all" || 
    filters.status !== "active" || 
    filters.type !== "all" || 
    quickFilter !== null ||
    searchQuery !== ""

  return (
    <div className="space-y-3 p-4 bg-muted/30 border-b">
      {/* Main Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Filters:</span>
        
        {/* Employees Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              All Employees
              <span className="ml-1 text-muted-foreground">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Employees</DropdownMenuItem>
            <DropdownMenuItem>My Direct Reports</DropdownMenuItem>
            <DropdownMenuItem>My Team</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Department Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Department: {departments.find(d => d.value === filters.department)?.label}
              <span className="ml-1 text-muted-foreground">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {departments.map((dept) => (
              <DropdownMenuItem 
                key={dept.value}
                onClick={() => handleFilterChange("department", dept.value)}
              >
                {dept.label}
                {dept.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {dept.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Status: {employmentStatuses.find(s => s.value === filters.status)?.label}
              <span className="ml-1 text-muted-foreground">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {employmentStatuses.map((status) => (
              <DropdownMenuItem 
                key={status.value}
                onClick={() => handleFilterChange("status", status.value)}
              >
                {status.label}
                {status.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {status.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Type: {employmentTypes.find(t => t.value === filters.type)?.label}
              <span className="ml-1 text-muted-foreground">▾</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {employmentTypes.map((type) => (
              <DropdownMenuItem 
                key={type.value}
                onClick={() => handleFilterChange("type", type.value)}
              >
                {type.label}
                {type.count !== undefined && (
                  <Badge variant="outline" className="ml-auto">
                    {type.count}
                  </Badge>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={clearFilters}
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground">Quick:</span>
        
        <Button
          variant={quickFilter === "my_team" ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={() => handleQuickFilter("my_team")}
        >
          <Users className="h-3 w-3 mr-1" />
          My Team
        </Button>

        <Button
          variant={quickFilter === "new_hires" ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={() => handleQuickFilter("new_hires")}
        >
          <UserPlus className="h-3 w-3 mr-1" />
          New Hires
        </Button>

        <Button
          variant={quickFilter === "on_leave" ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={() => handleQuickFilter("on_leave")}
        >
          <Calendar className="h-3 w-3 mr-1" />
          On Leave
        </Button>

        <Button
          variant={quickFilter === "pending_review" ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={() => handleQuickFilter("pending_review")}
        >
          <SlidersHorizontal className="h-3 w-3 mr-1" />
          Pending Review
        </Button>

        <Button
          variant={quickFilter === "expiring_certs" ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={() => handleQuickFilter("expiring_certs")}
        >
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expiring Certs
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('people.search.placeholder')}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-9 pr-20 h-9"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
            onClick={() => handleSearch("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-9 top-1/2 -translate-y-1/2 h-7 text-xs"
        >
          Advanced
        </Button>
      </div>
    </div>
  )
}

// Summary bar that shows filter results
export function FilterSummaryBar({ 
  totalCount, 
  filteredCount,
  activeFilters 
}: { 
  totalCount: number
  filteredCount: number
  activeFilters?: string[]
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/20 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">
          Showing <strong>{filteredCount}</strong> of <strong>{totalCount}</strong> employees
        </span>
        {activeFilters && activeFilters.length > 0 && (
          <div className="flex items-center gap-1">
            {activeFilters.map((filter, i) => (
              <Badge key={i} variant="secondary" className="h-5">
                {filter}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
