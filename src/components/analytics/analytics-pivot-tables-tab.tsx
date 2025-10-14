"use client"

import { Table, Filter, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const pivotData = [
  { region: "North America", product: "Product A", q1: 450, q2: 520, q3: 580, q4: 620, total: 2170 },
  { region: "North America", product: "Product B", q1: 380, q2: 420, q3: 460, q4: 500, total: 1760 },
  { region: "Europe", product: "Product A", q1: 320, q2: 360, q3: 400, q4: 440, total: 1520 },
  { region: "Europe", product: "Product B", q1: 280, q2: 310, q3: 350, q4: 390, total: 1330 },
  { region: "Asia Pacific", product: "Product A", q1: 180, q2: 220, q3: 260, q4: 300, total: 960 },
  { region: "Asia Pacific", product: "Product B", q1: 150, q2: 180, q3: 210, q4: 250, total: 790 },
]

interface AnalyticsPivotTablesTabProps {
  data?: any[]
  loading?: boolean
}

export function AnalyticsPivotTablesTab({ data = [], loading = false }: AnalyticsPivotTablesTabProps) {
  const displayData = data || []
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales by Region & Product</CardTitle>
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
                  <th className="border p-3 text-left font-semibold">Region</th>
                  <th className="border p-3 text-left font-semibold">Product</th>
                  <th className="border p-3 text-right font-semibold">Q1</th>
                  <th className="border p-3 text-right font-semibold">Q2</th>
                  <th className="border p-3 text-right font-semibold">Q3</th>
                  <th className="border p-3 text-right font-semibold">Q4</th>
                  <th className="border p-3 text-right font-semibold bg-accent">Total</th>
                </tr>
              </thead>
              <tbody>
                {pivotData.map((row, index) => (
                  <tr key={index} className="hover:bg-accent/50 transition-colors">
                    <td className="border p-3 font-medium">{row.region}</td>
                    <td className="border p-3">{row.product}</td>
                    <td className="border p-3 text-right">${row.q1}K</td>
                    <td className="border p-3 text-right">${row.q2}K</td>
                    <td className="border p-3 text-right">${row.q3}K</td>
                    <td className="border p-3 text-right">${row.q4}K</td>
                    <td className="border p-3 text-right font-bold bg-accent">${row.total}K</td>
                  </tr>
                ))}
                <tr className="bg-muted font-bold">
                  <td colSpan={2} className="border p-3">Grand Total</td>
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
          <CardTitle className="text-lg">Pivot Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">Row Fields</p>
              <div className="space-y-2">
                <Badge variant="secondary">Region</Badge>
                <Badge variant="secondary">Product</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">Column Fields</p>
              <div className="space-y-2">
                <Badge variant="secondary">Quarter</Badge>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="font-medium mb-3">Value Fields</p>
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
