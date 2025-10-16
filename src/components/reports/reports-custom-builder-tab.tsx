"use client"

import { Plus, Trash2, GripVertical, BarChart, Table, PieChart, LineChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"

const dataSourceOptions = [
  { value: "tasks", labelKey: "tasks" },
  { value: "projects", labelKey: "projects" },
  { value: "events", labelKey: "events" },
  { value: "people", labelKey: "people" },
  { value: "finance", labelKey: "financial_data" },
  { value: "resources", labelKey: "resources" },
]

const chartTypes = [
  { value: "bar", labelKey: "bar_chart", icon: BarChart },
  { value: "line", labelKey: "line_chart", icon: LineChart },
  { value: "pie", labelKey: "pie_chart", icon: PieChart },
  { value: "table", labelKey: "table", icon: Table },
]

const sampleFields = [
  { id: "1", nameKey: "status", type: "category" },
  { id: "2", nameKey: "priority", type: "category" },
  { id: "3", nameKey: "assignee", type: "person" },
  { id: "4", nameKey: "due_date", type: "date" },
  { id: "5", nameKey: "created_at", type: "date" },
  { id: "6", nameKey: "budget", type: "number" },
]

interface ReportsCustomBuilderTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsCustomBuilderTab({ data = [], loading = false }: ReportsCustomBuilderTabProps) {
  const t = useTranslations('intelligence.reports.customBuilder')
  const tCommon = useTranslations('common')
  const displayData = data.length > 0 ? data : []
  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground" role="doc-subtitle">
          {t('description')}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" aria-label={t('saveAsTemplate')}>{t('saveAsTemplate')}</Button>
          <Button aria-label={t('generateReport')}>{t('generateReport')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="col-span-1 space-y-4">
          <Card role="region" aria-labelledby="config-title">
            <CardHeader>
              <CardTitle className="text-lg" id="config-title">{t('reportConfiguration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">{t('reportName')}</Label>
                <Input id="report-name" placeholder={t('reportNamePlaceholder')} aria-label={t('reportName')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">{t('dataSource')}</Label>
                <Select defaultValue="tasks">
                  <SelectTrigger id="data-source" aria-label={t('dataSource')}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {t(option.labelKey)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('visualizationType')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {chartTypes.map((chart) => {
                    const Icon = chart.icon
                    return (
                      <Button key={chart.value} variant="outline" className="h-20 flex flex-col gap-2">
                        <Icon className="h-6 w-6" />
                        <span className="text-xs">{t(chart.labelKey)}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card role="region" aria-labelledby="fields-title">
            <CardHeader>
              <CardTitle className="text-sm" id="fields-title">{t('availableFields')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sampleFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center gap-2 p-2 border rounded hover:bg-accent cursor-move"
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{t(field.nameKey)}</p>
                      <Badge variant="outline" className="text-xs">{field.type}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="col-span-2">
          <Card className="h-full" role="region" aria-labelledby="preview-title">
            <CardHeader>
              <CardTitle className="text-lg" id="preview-title">{t('reportPreview')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center min-h-[500px] flex items-center justify-center" role="status" aria-label={t('dragFieldsPrompt')}>
                <div className="text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
                  <p className="text-lg font-medium mb-2">{t('dragFieldsPrompt')}</p>
                  <p className="text-sm">{t('getStartedPrompt')}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">{t('filters')}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" aria-label={t('addFilter')}>
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                    {t('addFilter')}
                  </Button>
                  <Badge variant="secondary">{t('noFiltersApplied')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
