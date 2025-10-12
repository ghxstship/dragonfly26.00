"use client"

import { Database, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const dataSources = [
  {
    id: "1",
    name: "Primary Database",
    type: "PostgreSQL",
    status: "connected",
    lastSync: "2 minutes ago",
    records: "2.4M",
    tables: 45
  },
  {
    id: "2",
    name: "CRM System",
    type: "Salesforce",
    status: "connected",
    lastSync: "5 minutes ago",
    records: "156K",
    tables: 12
  },
  {
    id: "3",
    name: "Analytics Warehouse",
    type: "BigQuery",
    status: "connected",
    lastSync: "1 hour ago",
    records: "8.7M",
    tables: 23
  },
  {
    id: "4",
    name: "Marketing Platform",
    type: "HubSpot",
    status: "warning",
    lastSync: "3 hours ago",
    records: "89K",
    tables: 8
  },
  {
    id: "5",
    name: "Payment Gateway",
    type: "Stripe",
    status: "connected",
    lastSync: "15 minutes ago",
    records: "234K",
    tables: 6
  },
]

export function AnalyticsDataSourcesTab() {
  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Sources</p>
            <p className="text-2xl font-bold mt-1">{dataSources.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="text-2xl font-bold mt-1 text-green-600">
              {dataSources.filter(d => d.status === "connected").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold mt-1">11.6M</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Tables</p>
            <p className="text-2xl font-bold mt-1">94</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources List */}
      <div className="grid gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{source.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{source.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={source.status === "connected" ? "default" : "secondary"}
                    className={source.status === "connected" ? "bg-green-600" : "bg-yellow-600"}
                  >
                    {source.status === "connected" ? (
                      <><CheckCircle className="h-3 w-3 mr-1" /> Connected</>
                    ) : (
                      <><AlertCircle className="h-3 w-3 mr-1" /> Warning</>
                    )}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Last Sync</p>
                  <p className="font-medium mt-1">{source.lastSync}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Records</p>
                  <p className="font-medium mt-1">{source.records}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tables</p>
                  <p className="font-medium mt-1">{source.tables}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
