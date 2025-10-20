"use client"

import { Table, ChevronDown, ChevronRight, Plus, Download, type LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { useAnalyticsData } from "@/hooks/use-analytics-data"

interface PivotData {
  regionKey: string
  product: string
  q1: number
  q2: number
  q3: number
  q4: number
  total: number
}

const pivotData: PivotData[] = [
  { regionKey: "north_america", product: "Product A", q1: 450, q2: 520, q3: 580, q4: 620, total: 2170 },
  { regionKey: "north_america", product: "Product B", q1: 380, q2: 420, q3: 460, q4: 500, total: 1760 },
  { regionKey: "europe", product: "Product A", q1: 320, q2: 360, q3: 400, q4: 440, total: 1520 },
  { regionKey: "europe", product: "Product B", q1: 280, q2: 310, q3: 350, q4: 390, total: 1330 },
  { regionKey: "asia_pacific", product: "Product A", q1: 180, q2: 220, q3: 260, q4: 300, total: 960 },
  { regionKey: "asia_pacific", product: "Product B", q1: 150, q2: 180, q3: 210, q4: 250, total: 790 },
]

interface AnalyticsPivotTablesTabProps {
  data?: Record<string, unknown>[]
  loading?: boolean
}

export function AnalyticsPivotTablesTab({ data = [], loading = false }: AnalyticsPivotTablesTabProps) {
  const t = useTranslations('intelligence.analytics.analyticspivottables')
  const tCommon = useTranslations('common')

  const displayData = data || []
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('salesByRegionProduct')}</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Rows: Region, Product</Badge>
              <Badge variant="outline">Columns: Quarters</Badge>
              <Badge variant="outline">Values: Revenue ($K)</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-3 text-left font-semibold">{t('region')}</th>
                  <th className="border p-3 text-left font-semibold">{t('product')}</th>
                  <th className="border p-3 text-right font-semibold">Q1</th>
                  <th className="border p-3 text-right font-semibold">Q2</th>
                  <th className="border p-3 text-right font-semibold">Q3</th>
                  <th className="border p-3 text-right font-semibold">Q4</th>
                  <th className="border p-3 text-right font-semibold bg-accent">{t('total')}</th>
                </tr>
              </thead>
              <tbody>
                {pivotData.map((row: PivotData, index: number) => (
                  <tr key={index} className="hover:bg-accent/50 transition-colors">
                    <td className="border p-3 font-medium">{t(row.regionKey)}</td>
                    <td className="border p-3">{row.product}</td>
                    <td className="border p-3 text-right">${row.q1}K</td>
                    <td className="border p-3 text-right">${row.q2}K</td>
                    <td className="border p-3 text-right">${row.q3}K</td>
                    <td className="border p-3 text-right">${row.q4}K</td>
                    <td className="border p-3 text-right font-bold bg-accent">${row.total}K</td>
                  </tr>
                ))}
                <tr className="bg-muted font-bold">
                  <Table className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                  <td colSpan={2} className="border p-3">{t('grandTotal')}</td>
                  <td className="border p-3 text-right">$1,760K</td>
                  <td className="border p-3 text-right">$2,010K</td>
                  <td className="border p-3 text-right">$2,260K</td>
                  <td className="border p-3 text-right">$2,500K</td>
                  <td className="border p-3 text-right bg-accent">$8,530K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('pivotConfiguration')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">{t('rowFields')}</p>
              <div className="space-y-2">
                <Badge variant="secondary">{t('region')}</Badge>
                <Badge variant="secondary">{t('product')}</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">{t('columnFields')}</p>
              <div className="space-y-2">
                <Badge variant="secondary">{t('quarter')}</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">{t('valueFields')}</p>
              <div className="space-y-2">
                <Badge variant="secondary">Revenue (Sum)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
