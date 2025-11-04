"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Download, FileSpreadsheet, FileJson, File, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExportPanelProps {
  onExport?: (format: string, options: ExportOptions) => void
}

interface ExportOptions {
  includeFields: string[]
  includeFilters: boolean
  includeSort: boolean
}

export function ExportPanel({ onExport }: ExportPanelProps) {
  const t = useTranslations()
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [exporting, setExporting] = useState(false)
  const [exported, setExported] = useState(false)
  const [includeFilters, setIncludeFilters] = useState(true)
  const [includeSort, setIncludeSort] = useState(true)

  const handleExport = async () => {
    setExporting(true)
    
    // Simulate export
    setTimeout(() => {
      setExporting(false)
      setExported(true)
      
      if (onExport) {
        onExport(selectedFormat, {
          includeFields: [],
          includeFilters,
          includeSort,
        })
      }

      // Reset after showing success
      setTimeout(() => setExported(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label>Export Format</Label>
        <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="csv" id="export-csv" />
            <Label htmlFor="export-csv" className="flex flex-wrap flex-col md:flex-row items-center gap-2 cursor-pointer font-normal">
              <FileSpreadsheet className="h-4 w-4" />
              CSV (Comma Separated Values)
            </Label>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="excel" id="export-excel" />
            <Label htmlFor="export-excel" className="flex flex-wrap flex-col md:flex-row items-center gap-2 cursor-pointer font-normal">
              <FileSpreadsheet className="h-4 w-4" />
              Excel (.xlsx)
            </Label>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="json" id="export-json" />
            <Label htmlFor="export-json" className="flex flex-wrap flex-col md:flex-row items-center gap-2 cursor-pointer font-normal">
              <FileJson className="h-4 w-4" />
              JSON
            </Label>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="pdf" id="export-pdf" />
            <Label htmlFor="export-pdf" className="flex flex-wrap flex-col md:flex-row items-center gap-2 cursor-pointer font-normal">
              <File className="h-4 w-4" />
              PDF Document
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Export Options */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Export Options</Label>
        <div className="space-y-2 text-sm">
          <label className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>Include all visible fields</span>
          </label>
          <label className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <input 
              type="checkbox" 
              className="rounded" 
              checked={includeFilters}
              onChange={(e) => setIncludeFilters(e.target.checked)}
            />
            <span>Apply current filters</span>
          </label>
          <label className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <input 
              type="checkbox" 
              className="rounded"
              checked={includeSort}
              onChange={(e) => setIncludeSort(e.target.checked)}
            />
            <span>Apply current sorting</span>
          </label>
          <label className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span>Include attachments (ZIP)</span>
          </label>
        </div>
      </div>

      {/* Data Range */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Data Range</Label>
        <RadioGroup defaultValue="all">
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="all" id="export-all" />
            <Label htmlFor="export-all" className="cursor-pointer font-normal">
              All items
            </Label>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="current" id="export-current" />
            <Label htmlFor="export-current" className="cursor-pointer font-normal">
              Current page only
            </Label>
          </div>
          <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
            <RadioGroupItem value="selected" id="export-selected" />
            <Label htmlFor="export-selected" className="cursor-pointer font-normal">
              Selected items
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Success Message */}
      {exported && (
        <Alert>
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <AlertDescription>
            Export successful! Your file is downloading now.
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleExport} disabled={exporting} className="flex-1">
          <Download className="h-4 w-4 mr-2" />
          {exporting ? "Exporting..." : t('common.export')}
        </Button>
      </div>
    </div>
  )
}
