"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Table as TableIcon, Settings, Download, RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/shared/empty-state"
import { cn } from "@/lib/utils"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface PivotViewProps {
  data: DataItem[]
  schema?: FieldSchema[]
  createActionLabel?: string
  onCreateAction?: () => void
}

type AggregateFunction = "sum" | "avg" | "count" | "min" | "max"

export function PivotView({ data, schema, createActionLabel, onCreateAction }: PivotViewProps) {
  const t = useTranslations()
  const [rowField, setRowField] = useState<string>("status")
  const [columnField, setColumnField] = useState<string>("priority")
  const [valueField, setValueField] = useState<string>("count")
  const [aggregateFunc, setAggregateFunc] = useState<AggregateFunction>("count")

  // Extract available fields from data
  const fields = data.length > 0 ? Object.keys(data[0]).filter((key: any) => 
    !["id", "created_at", "updated_at"].includes(key)
  ) : []

  // Get unique values for row and column fields
  const rowValues = Array.from(new Set(data.map((item: any) => item[rowField] || "N/A")))
  const columnValues = Array.from(new Set(data.map((item: any) => item[columnField] || "N/A")))

  // Calculate pivot table
  const pivotData: Record<string, Record<string, number>> = {}
  
  rowValues.forEach((row: any) => {
    pivotData[row] = {}
    columnValues.forEach((col: any) => {
      const filteredData = data.filter(
        (item) => (item[rowField] || "N/A") === row && (item[columnField] || "N/A") === col
      )

      let value = 0
      if (aggregateFunc === "count") {
        value = filteredData.length
      } else if (aggregateFunc === "sum") {
        value = filteredData.reduce((sum: number, item) => sum + (Number(item[valueField]) || 0), 0)
      } else if (aggregateFunc === "avg") {
        const sum = filteredData.reduce((sum: number, item) => sum + (Number(item[valueField]) || 0), 0)
        value = filteredData.length > 0 ? sum / filteredData.length : 0
      } else if (aggregateFunc === "min") {
        const values = filteredData.map((item: any) => Number(item[valueField]) || 0)
        value = values.length > 0 ? Math.min(...values) : 0
      } else if (aggregateFunc === "max") {
        const values = filteredData.map((item: any) => Number(item[valueField]) || 0)
        value = values.length > 0 ? Math.max(...values) : 0
      }

      pivotData[row][col] = value
    })
  })

  // Calculate totals
  const rowTotals: Record<string, number> = {}
  const columnTotals: Record<string, number> = {}
  let grandTotal = 0

  rowValues.forEach((row: any) => {
    rowTotals[row] = Object.values(pivotData[row]).reduce((sum: number, val) => sum + val, 0)
    grandTotal += rowTotals[row]
  })

  columnValues.forEach((col: any) => {
    columnTotals[col] = rowValues.reduce((sum: number, row) => sum + pivotData[row][col], 0)
  })

  const formatValue = (value: number) => {
    if (aggregateFunc === "avg") {
      return value.toFixed(2)
    }
    return Math.round(value).toLocaleString()
  }

  return (
    <div className="h-full flex flex-wrap flex-col">
      {/* Header */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between p-4 border-b">
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <TableIcon className="h-5 w-5" />
          <h3 className="font-semibold">Pivot Table</h3>
          <Badge variant="secondary">{data.length} records</Badge>
        </div>
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Configuration */}
      <div className="p-4 border-b bg-muted/30">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Rows</label>
            <Select value={rowField as any} onValueChange={setRowField}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(fields as any[]).map((field: any) => (
                  <SelectItem key={field} value={field as any}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Columns</label>
            <Select value={columnField as any} onValueChange={setColumnField}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(fields as any[]).map((field: any) => (
                  <SelectItem key={field} value={field as any}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Values</label>
            <Select value={valueField as any} onValueChange={setValueField}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(fields as any[]).map((field: any) => (
                  <SelectItem key={field} value={field as any}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Aggregate</label>
            <Select value={aggregateFunc as any} onValueChange={(v) => setAggregateFunc(v as AggregateFunction)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="count">Count</SelectItem>
                <SelectItem value="sum">Sum</SelectItem>
                <SelectItem value="avg">Average</SelectItem>
                <SelectItem value="min">Min</SelectItem>
                <SelectItem value="max">Max</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        {data.length === 0 ? (
          <EmptyState
            mainMessage={t('views.emptyState.nothingToSeeYet')}
            description={t('views.emptyState.pivotViewDescription')}
            actionLabel={createActionLabel || t('views.emptyState.createFirstItem')}
            onAction={onCreateAction}
          />
        ) : (
          <div className="inline-block min-w-full align-middle max-w-full">
            <div className="overflow-hidden md:block border rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-border max-w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                      {rowField} / {columnField}
                    </th>
                    {columnValues.map((col: any) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                      >
                        {String(col)}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider bg-muted">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                {rowValues.map((row, rowIdx) => (
                  <tr key={row} className={cn(rowIdx % 2 === 0 ? "bg-muted/5" : "")}>
                    <td className="sticky left-0 z-10 bg-background px-4 py-3 text-sm font-medium">
                      {String(row)}
                    </td>
                    {columnValues.map((col: any) => (
                      <td
                        key={col}
                        className="px-4 py-3 text-sm text-right hover:bg-accent cursor-pointer transition-colors"
                        onClick={() => {
                          // Could drill down into the data here
                          const filteredData = data.filter(
                            (item) => (item[rowField] || "N/A") === row && (item[columnField] || "N/A") === col
                          )
                          console.log("Drill down:", { row, col, count: filteredData.length })
                        }}
                      >
                        {formatValue(pivotData[row][col])}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-sm text-right font-semibold bg-muted/30">
                      {formatValue(rowTotals[row])}
                    </td>
                  </tr>
                ))}
                <tr className="bg-muted/50 font-semibold">
                  <td className="sticky left-0 z-10 bg-muted/50 px-4 py-3 text-sm">Total</td>
                  {columnValues.map((col: any) => (
                    <td key={col} className="px-4 py-3 text-sm text-right">
                      {formatValue(columnTotals[col])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm text-right bg-muted">
                    {formatValue(grandTotal)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{data.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Dimensions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">
                  {rowValues.length} × {columnValues.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Grand Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-base md:text-lg lg:text-xl lg:text-2xl font-bold">{formatValue(grandTotal)}</div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}
      </div>
    </div>
  )
}
