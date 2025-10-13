import type { DataItem } from "@/types"

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateReportsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'custom-builder':
      return generateCustomBuilderData(count)
    case 'templates':
      return generateTemplatesData(count)
    case 'production':
      return generateProductionReportsData(count)
    case 'financial':
      return generateFinancialReportsData(count)
    case 'crew':
      return generateCrewReportsData(count)
    case 'asset':
      return generateAssetReportsData(count)
    case 'operational':
      return generateOperationalReportsData(count)
    case 'archived':
      return generateArchivedReportsData(count)
    default:
      return generateTemplatesData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `report-overview-${i + 1}`,
    name: `Recent Report ${i + 1}`,
    description: "Recently generated report",
    status: "generated",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "Current User",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["report", "recent"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: 1,
  }))
}

function generateCustomBuilderData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `custom-report-${i + 1}`,
    name: `Custom Report ${i + 1}`,
    description: "User-created custom report with specific filters and groupings",
    status: "draft",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "Current User",
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["custom", "builder"],
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateTemplatesData(count: number): DataItem[] {
  const templateNames = [
    "Production Summary Report",
    "Budget vs Actual Report",
    "Crew Hours Report",
    "Asset Utilization Report",
    "Expense Report Summary",
    "Project Timeline Report",
    "Vendor Performance Report",
    "Safety Incident Report"
  ]
  const categories = ["production", "financial", "crew", "asset", "operational"]
  const chartTypes = ["table", "bar", "line", "pie"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `template-${i + 1}`,
    name: templateNames[i % templateNames.length],
    description: `Pre-built report template for ${templateNames[i % templateNames.length].toLowerCase()}`,
    category: categories[i % categories.length],
    data_sources: { tables: ["productions", "budgets", "expenses"], joins: [] },
    filters: {},
    grouping: {},
    aggregations: {},
    chart_type: chartTypes[i % chartTypes.length],
    chart_config: {},
    is_public: i % 3 === 0,
    created_by: "person-1",
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: 0,
  }))
}

function generateProductionReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `prod-report-${i + 1}`,
    name: `Production Report ${i + 1}`,
    description: "Production performance and status report",
    status: "completed",
    priority: "high",
    assignee: "person-1",
    assignee_name: "Production Manager",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["production", "report"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: 1,
  }))
}

function generateFinancialReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `fin-report-${i + 1}`,
    name: `Financial Report Q${(i % 4) + 1} 2024`,
    description: "Quarterly financial summary and analysis",
    status: "completed",
    priority: "high",
    assignee: "person-1",
    assignee_name: "Finance Director",
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["financial", "quarterly"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: 1,
  }))
}

function generateCrewReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `crew-report-${i + 1}`,
    name: `Crew Hours Report - Week ${i + 1}`,
    description: "Weekly crew hours and payroll report",
    status: "completed",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "HR Manager",
    created_at: getRandomPastDate(7 * (i + 1)),
    updated_at: new Date().toISOString(),
    tags: ["crew", "hours", "payroll"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: 1,
  }))
}

function generateAssetReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `asset-report-${i + 1}`,
    name: `Asset Report ${i + 1}`,
    description: "Asset inventory and utilization report",
    status: "completed",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "Asset Manager",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["assets", "inventory"],
    comments_count: Math.floor(Math.random() * 6),
    attachments_count: 1,
  }))
}

function generateOperationalReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ops-report-${i + 1}`,
    name: `Daily Operations Report ${i + 1}`,
    description: "Daily operational status and metrics",
    status: "completed",
    priority: "normal",
    assignee: "person-1",
    assignee_name: "Operations Manager",
    created_at: getRandomPastDate(i + 1),
    updated_at: new Date().toISOString(),
    tags: ["operations", "daily"],
    comments_count: Math.floor(Math.random() * 3),
    attachments_count: 1,
  }))
}

function generateArchivedReportsData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `archived-report-${i + 1}`,
    name: `Archived Report ${i + 1}`,
    description: "Historical archived report",
    status: "archived",
    priority: "low",
    assignee: "person-1",
    assignee_name: "System",
    created_at: getRandomPastDate(365),
    updated_at: getRandomPastDate(180),
    tags: ["archived", "historical"],
    comments_count: 0,
    attachments_count: 1,
  }))
}
