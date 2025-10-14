"use client"

import { FileStack, Star, Download, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const templates = [
  { 
    id: "1", 
    name: "Executive Summary Template", 
    description: "High-level overview for stakeholders",
    category: "Executive",
    uses: 234,
    rating: 4.8,
    tags: ["Performance", "KPIs", "Summary"]
  },
  { 
    id: "2", 
    name: "Operational Daily Report", 
    description: "Day-to-day operations tracking",
    category: "Operational",
    uses: 567,
    rating: 4.9,
    tags: ["Daily", "Operations", "Metrics"]
  },
  { 
    id: "3", 
    name: "Compliance Audit Report", 
    description: "Regulatory compliance documentation",
    category: "Compliance",
    uses: 89,
    rating: 4.7,
    tags: ["Audit", "Compliance", "Legal"]
  },
  { 
    id: "4", 
    name: "Financial Performance", 
    description: "Revenue, expenses, and profitability",
    category: "Executive",
    uses: 445,
    rating: 4.9,
    tags: ["Finance", "Revenue", "P&L"]
  },
  { 
    id: "5", 
    name: "Customer Insights Report", 
    description: "Customer behavior and satisfaction",
    category: "Custom",
    uses: 178,
    rating: 4.6,
    tags: ["Customer", "Analytics", "Insights"]
  },
  { 
    id: "6", 
    name: "Project Status Update", 
    description: "Project progress and milestones",
    category: "Operational",
    uses: 312,
    rating: 4.8,
    tags: ["Projects", "Status", "Timeline"]
  },
]

interface ReportsTemplatesTabProps {
  data?: any[]
  loading?: boolean
}

export function ReportsTemplatesTab({ data = [], loading = false }: ReportsTemplatesTabProps) {
  const displayTemplates = data || []
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <FileStack className="h-8 w-8 text-blue-600" />
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <CardTitle className="mt-4">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{template.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    <span>{template.uses} uses</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    Use Template
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
