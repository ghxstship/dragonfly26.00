import type { DataItem } from "@/types"

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

export function generateDashboardMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'my-agenda':
      return generateMyAgendaData(count)
    case 'my-jobs':
      return generateMyJobsData(count)
    case 'my-productions':
      return generateMyProductionsData(count)
    default:
      return generateOverviewData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const widgetTypes = ["production_stats", "upcoming_events", "recent_activity", "team_workload", "budget_overview", "asset_status"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `widget-${i + 1}`,
    name: `Dashboard Widget ${i + 1}`,
    description: "Dashboard overview widget showing key metrics and status",
    status: "active",
    priority: "normal",
    assignee: "System",
    assignee_name: "System",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["dashboard", widgetTypes[i % widgetTypes.length]],
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateMyAgendaData(count: number): DataItem[] {
  const eventTypes = ["meeting", "rehearsal", "show", "call_time", "deadline", "task"]
  const eventIds = ["event-1", "event-2", "event-3", "event-4", "event-5"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `agenda-${i + 1}`,
    event_id: eventIds[i % eventIds.length],
    name: `${eventTypes[i % eventTypes.length].charAt(0).toUpperCase() + eventTypes[i % eventTypes.length].slice(1).replace('_', ' ')} - Item ${i + 1}`,
    description: "Calendar event or task on your agenda",
    type: eventTypes[i % eventTypes.length],
    start_time: getRandomFutureDate(14),
    end_time: getRandomFutureDate(14),
    status: i % 3 === 0 ? "upcoming" : i % 3 === 1 ? "in_progress" : "completed",
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: "person-1",
    assignee_name: "Current User",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["agenda", eventTypes[i % eventTypes.length]],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateMyJobsData(count: number): DataItem[] {
  const contractIds = ["job-contract-1", "job-contract-2", "job-contract-3"]
  const statuses = ["active", "proposal", "negotiation", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: contractIds[i % contractIds.length],
    contract_number: `JC-${String(20240001 + i).padStart(8, '0')}`,
    title: `Contract ${i + 1} - Production Services`,
    description: "Job contract assigned to you",
    client_id: `company-${(i % 5) + 1}`,
    contract_value: parseFloat((Math.random() * 100000 + 10000).toFixed(2)),
    currency: "USD",
    start_date: getRandomPastDate(30).split('T')[0],
    end_date: getRandomFutureDate(60).split('T')[0],
    status: statuses[i % statuses.length],
    created_by: "person-1",
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateMyProductionsData(count: number): DataItem[] {
  const productionIds = ["production-1", "production-2", "production-3"]
  const statuses = ["planning", "active", "on_hold", "completed"]
  const types = ["tour", "festival", "concert", "corporate", "theater"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: productionIds[i % productionIds.length],
    name: `Production ${i + 1}`,
    code: `PROD-${String(2024001 + i).padStart(6, '0')}`,
    type: types[i % types.length],
    description: "Production you are assigned to",
    status: statuses[i % statuses.length],
    project_manager_id: "person-1",
    budget: parseFloat((Math.random() * 500000 + 50000).toFixed(2)),
    budget_spent: parseFloat((Math.random() * 300000).toFixed(2)),
    budget_currency: "USD",
    health: i % 3 === 0 ? "on_track" : i % 3 === 1 ? "at_risk" : "behind",
    progress: parseFloat((Math.random() * 0.8 + 0.1).toFixed(2)),
    start_date: getRandomPastDate(30).split('T')[0],
    end_date: getRandomFutureDate(60).split('T')[0],
    created_by: "person-1",
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: [types[i % types.length], "assigned"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}
