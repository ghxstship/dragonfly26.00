"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Upload, FileSpreadsheet, FileJson, File, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ImportPanelProps {
  onImport?: (file: File, format: string) => void
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const t = useTranslations()
  const [selectedFormat, setSelectedFormat] = useState("csv")
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setStatus("idle")
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setProgress(0)

    // Simulate import progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setImporting(false)
          setStatus("success")
          if (onImport) {
            onImport(file, selectedFormat)
          }
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-4">
      {/* Format Selection */}
      <div className="space-y-3">
        <Label>File Format</Label>
        <RadioGroup value={selectedFormat} onValueChange={setSelectedFormat}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="csv" id="csv" />
            <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer font-normal">
              <FileSpreadsheet className="h-4 w-4" />
              CSV (Comma Separated Values)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="excel" id="excel" />
            <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer font-normal">
              <FileSpreadsheet className="h-4 w-4" />
              Excel (.xlsx)
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="json" id="json" />
            <Label htmlFor="json" className="flex items-center gap-2 cursor-pointer font-normal">
              <FileJson className="h-4 w-4" />
              JSON
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* File Upload */}
      <div className="space-y-3">
        <Label>Upload File</Label>
        <div className="border-2 border-dashed rounded-lg p-10 text-center hover:border-primary/50 transition-colors">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept={
              selectedFormat === "csv"
                ? ".csv"
                : selectedFormat === "excel"
                ? ".xlsx,.xls"
                : ".json"
            }
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              {file ? file.name : t('import.uploadPrompt')}
            </p>
            <p className="text-xs text-muted-foreground">
              {selectedFormat === "csv"
                ? "CSV files only"
                : selectedFormat === "excel"
                ? "Excel files (.xlsx, .xls)"
                : "JSON files only"}
            </p>
          </label>
        </div>
      </div>

      {/* Import Progress */}
      {importing && (
        <div className="space-y-2">
          <Label>Importing...</Label>
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground">{progress}% complete</p>
        </div>
      )}

      {/* Status Messages */}
      {status === "success" && (
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Successfully imported {file?.name}. Your data has been added to the module.
          </AlertDescription>
        </Alert>
      )}

      {status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to import file. Please check the format and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Import Options */}
      <div className="space-y-3 pt-4 border-t">
        <Label>Import Options</Label>
        <div className="space-y-2 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>Update existing items</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" defaultChecked />
            <span>Skip duplicates</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            <span>Create new fields automatically</span>
          </label>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={handleImport} disabled={!file || importing} className="flex-1">
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
      </div>
    </div>
  )
}
