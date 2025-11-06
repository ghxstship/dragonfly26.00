"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Table, ChevronDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

/**
 * PivotTableOrganism - Organism Component
 * 
 * Pivot table with aggregations and grouping.
 * Extracted from views/pivot-view.tsx for atomic design system.
 * 
 * Features:
 * - Row/column grouping
 * - Aggregation functions (sum, avg, count, min, max)
 * - Expand/collapse groups
 * - Sortable columns
 * - Full i18n and accessibility
 */

export interface PivotTableOrganismProps<T extends DataItem = DataItem> {
  data: T[]
  schema?: FieldSchema[]
  rowField?: string
  columnField?: string
  valueField?: string
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
}

export function PivotTableOrganism({ 
  data, 
  schema,
  rowField = 'category',
  columnField = 'status',
  valueField = 'amount',
  aggregation = 'sum'
}: PivotTableOrganismProps) {
  const t = useTranslations()
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  // Get unique values for rows and columns
  const rowValues = Array.from(new Set(data.map((item: any) => item[rowField] || 'Unknown')))
  const columnValues = Array.from(new Set(data.map((item: any) => item[columnField] || 'Unknown')))

  // Calculate aggregated values
  const calculateValue = (rowVal: string, colVal: string) => {
    const filtered = data.filter((item: any) => 
      (item[rowField] || 'Unknown') === rowVal && 
      (item[columnField] || 'Unknown') === colVal
    )

    if (filtered.length === 0) return 0

    const values = filtered.map((item: any) => Number(item[valueField]) || 0)

    switch (aggregation) {
      case 'sum':
        return values.reduce((a: any, b: any) => a + b, 0)
      case 'avg':
        return values.reduce((a: any, b: any) => a + b, 0) / values.length
      case 'count':
        return values.length
      case 'min':
        return Math.min(...values)
      case 'max':
        return Math.max(...values)
      default:
        return 0
    }
  }

  // Calculate row totals
  const calculateRowTotal = (rowVal: string) => {
    return columnValues.reduce((sum: any, colVal: any) => sum + calculateValue(rowVal, colVal), 0)
  }

  // Calculate column totals
  const calculateColumnTotal = (colVal: string) => {
    return rowValues.reduce((sum: any, rowVal: any) => sum + calculateValue(rowVal, colVal), 0)
  }

  // Calculate grand total
  const grandTotal = rowValues.reduce((sum: any, rowVal: any) => sum + calculateRowTotal(rowVal), 0)

  const toggleRow = (row: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev)
      if (newSet.has(row)) {
        newSet.delete(row)
      } else {
        newSet.add(row)
      }
      return newSet
    })
  }

  const formatValue = (value: number) => {
    if (aggregation === 'count') return value.toString()
    if (valueField === 'amount' || valueField.includes('price')) {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  return (
    <div className="flex flex-wrap flex-col h-full">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between border-b p-4">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Table aria-hidden="true" className="h-5 w-5" />
          <h3 className="font-semibold">{t('pivot.table')}</h3>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
          <span>{t('pivot.rows')}: {rowField}</span>
          <span>•</span>
          <span>{t('pivot.columns')}: {columnField}</span>
          <span>•</span>
          <span>{t('pivot.aggregation')}: {aggregation}</span>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="border rounded-lg overflow-hidden md:block overflow-x-auto">
        <table className="w-full max-w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-semibold border-r">
                  {rowField}
                </th>
                {columnValues.map((col: any) => (
                  <th key={col} className="text-center p-3 font-semibold border-r">
                    <Badge variant="secondary">{col}</Badge>
                  </th>
                ))}
                <th className="text-center p-3 font-semibold bg-muted/50">
                  {t('pivot.total')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rowValues.map((row, rowIndex) => {
                const isExpanded = expandedRows.has(row)
                const rowTotal = calculateRowTotal(row)

                return (
                  <tr
                    key={row}
                    className={cn(
                      'border-t hover:bg-accent/50 transition-colors',
                      rowIndex % 2 === 0 && 'bg-muted/20'
                    )}
                  >
                    <td className="p-3 border-r">
                      <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0"
                          onClick={() => toggleRow(row)}
                          aria-label={isExpanded ? t('pivot.collapse') : t('pivot.expand')}
                        >
                          {isExpanded ? (
                            <ChevronDown aria-hidden="true" className="h-4 w-4" />
                          ) : (
                            <ChevronRight aria-hidden="true" className="h-4 w-4" />
                          )}
                        </Button>
                        <span className="font-medium">{row}</span>
                      </div>
                    </td>
                    {columnValues.map((col: any) => {
                      const value = calculateValue(row, col)
                      return (
                        <td key={col} className="text-center p-3 border-r tabular-nums">
                          {value > 0 ? formatValue(value) : '-'}
                        </td>
                      )
                    })}
                    <td className="text-center p-3 font-semibold bg-muted/50 tabular-nums">
                      {formatValue(rowTotal)}
                    </td>
                  </tr>
                )
              })}
              {/* Totals Row */}
              <tr className="border-t-2 bg-muted font-semibold">
                <td className="p-3 border-r">{t('pivot.total')}</td>
                {columnValues.map((col: any) => {
                  const colTotal = calculateColumnTotal(col)
                  return (
                    <td key={col} className="text-center p-3 border-r tabular-nums">
                      {formatValue(colTotal)}
                    </td>
                  )
                })}
                <td className="text-center p-3 bg-muted/50 tabular-nums">
                  {formatValue(grandTotal)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
