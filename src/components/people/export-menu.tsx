"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { 
  FileDown, 
  FileSpreadsheet,
  FileText,
  Mail,
  Calendar,
  Settings
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface ExportMenuProps {
  onExport?: (format: ExportFormat, options?: ExportOptions) => void
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  className?: string
}

export type ExportFormat = "csv" | "excel" | "pdf" | "json"

export interface ExportOptions {
  includeFields?: string[]
  dateRange?: { start: Date; end: Date }
  scheduleExport?: boolean
}

export function ExportMenu({
  onExport,
  variant = "outline",
  size = "default",
  disabled = false,
  className
}: ExportMenuProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: ExportFormat, options?: ExportOptions) => {
    setIsExporting(true)
    
    try {
      await onExport?.(format, options)
      
      toast({
        title: "Export started",
        description: `Exporting to ${format.toUpperCase()}...`,
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: t('people.toast.exportError'),
        variant: "destructive"
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={className}
          disabled={disabled || isExporting}
        >
          <FileDown className="h-4 w-4 mr-2" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="h-4 w-4 mr-2" />
          Export to CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export to Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Export to PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          <FileText className="h-4 w-4 mr-2" />
          Export to JSON
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Mail className="h-4 w-4 mr-2" />
            Email Report
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Send Now</DropdownMenuItem>
            <DropdownMenuItem>Schedule Daily</DropdownMenuItem>
            <DropdownMenuItem>Schedule Weekly</DropdownMenuItem>
            <DropdownMenuItem>Schedule Monthly</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem>
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Export
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2" />
          Configure Fields
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Payroll export specific menu
export function PayrollExportMenu({
  onExportAction,
  providers = ["gusto", "adp", "paychex", "quickbooks"]
}: {
  onExportAction: (provider: string) => void
  providers?: string[]
}) {
  const t = useTranslations()
  const { toast } = useToast()

  const handleExport = (provider: string) => {
    onExportAction(provider)
    toast({
      title: "Payroll export started",
      description: `Exporting timesheet data for ${provider}`,
    })
  }

  const providerLabels: Record<string, string> = {
    gusto: "Gusto",
    adp: "ADP",
    paychex: "Paychex",
    quickbooks: "QuickBooks Payroll",
    rippling: "Rippling",
    custom: "Custom Format"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          Export for Payroll
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {providers.map(provider => (
          <DropdownMenuItem 
            key={provider}
            onClick={() => handleExport(provider)}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            {providerLabels[provider] || provider}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("custom")}>
          <Settings className="h-4 w-4 mr-2" />
          Custom Format
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
