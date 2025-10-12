import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateProcurementMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'fulfillment':
      return generateFulfillmentData(count)
    case 'orders':
      return generateOrdersData(count)
    case 'agreements':
      return generateAgreementsData(count)
    case 'approvals':
      return generateApprovalsData(count)
    case 'requisitions':
      return generateRequisitionsData(count)
    case 'line-items':
      return generateLineItemsData(count)
    case 'audits':
      return generateAuditsData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const metrics = [
    "Total Procurement Value",
    "Active Orders",
    "Pending Approvals",
    "Vendor Performance",
    "Cost Savings",
    "Processing Time",
    "Fulfillment Rate",
    "Budget Compliance"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `overview-${i + 1}`,
    name: metrics[i % metrics.length],
    description: "Key procurement metrics and performance indicators",
    status: i % 2 === 0 ? "on_track" : "needs_attention",
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: "Procurement Team",
    assignee_name: "Procurement Team",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(90),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["metrics", "overview"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateFulfillmentData(count: number): DataItem[] {
  const fulfillmentStatuses = ["pending", "in_transit", "received", "partially_received", "delayed"]
  const orderTypes = ["Purchase Order", "Work Order", "Talent Order", "Equipment Rental"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `fulfillment-${i + 1}`,
    name: `${orderTypes[i % orderTypes.length]} #PO-${10000 + i}`,
    description: "Order fulfillment tracking with delivery status and logistics",
    status: fulfillmentStatuses[i % fulfillmentStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Rachel Green" : i % 4 === 1 ? "Ross Geller" : i % 4 === 2 ? "Monica Bing" : "Chandler Bing",
    assignee_name: i % 4 === 0 ? "Rachel Green" : i % 4 === 1 ? "Ross Geller" : i % 4 === 2 ? "Monica Bing" : "Chandler Bing",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["fulfillment", orderTypes[i % orderTypes.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateOrdersData(count: number): DataItem[] {
  const orderTypes = [
    "Work Order",
    "Purchase Order",
    "Change Order",
    "Talent Order",
    "Equipment Order",
    "Service Order",
    "Rental Order",
    "Repair Order"
  ]
  const statuses = ["draft", "submitted", "approved", "processing", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `order-${i + 1}`,
    name: `${orderTypes[i % orderTypes.length]} #${20000 + i}`,
    description: "Comprehensive order tracking for work orders, purchase orders, change orders, and talent orders",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 5 === 0 ? "Emily Davis" : i % 5 === 1 ? "Michael Chen" : i % 5 === 2 ? "Sarah Johnson" : i % 5 === 3 ? "David Kim" : "Lisa Anderson",
    assignee_name: i % 5 === 0 ? "Emily Davis" : i % 5 === 1 ? "Michael Chen" : i % 5 === 2 ? "Sarah Johnson" : i % 5 === 3 ? "David Kim" : "Lisa Anderson",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: [orderTypes[i % orderTypes.length].toLowerCase().replace(/\s+/g, '-'), "procurement"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateAgreementsData(count: number): DataItem[] {
  const agreementTypes = [
    "Service Agreement",
    "Vendor Contract",
    "Master Service Agreement",
    "Procurement Agreement",
    "Framework Agreement",
    "Supply Agreement",
    "Maintenance Agreement",
    "Licensing Agreement"
  ]
  const statuses = ["draft", "under_review", "active", "expiring_soon", "expired", "terminated"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `agreement-${i + 1}`,
    name: `${agreementTypes[i % agreementTypes.length]} - ${i % 3 === 0 ? "Acme Corp" : i % 3 === 1 ? "Global Supplies Inc" : "Premium Services LLC"}`,
    description: "Service agreements, vendor contracts, and procurement agreements management",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Jennifer Wilson" : i % 3 === 1 ? "Robert Martinez" : "Amanda Thompson",
    assignee_name: i % 3 === 0 ? "Jennifer Wilson" : i % 3 === 1 ? "Robert Martinez" : "Amanda Thompson",
    due_date: getRandomFutureDate(365),
    start_date: getRandomPastDate(180),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["agreement", agreementTypes[i % agreementTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generateApprovalsData(count: number): DataItem[] {
  const approvalTypes = [
    "Purchase Request",
    "Budget Allocation",
    "Vendor Selection",
    "Contract Amendment",
    "Change Order",
    "Expense Reimbursement",
    "Service Extension",
    "Emergency Purchase"
  ]
  const statuses = ["pending", "under_review", "approved", "rejected", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `approval-${i + 1}`,
    name: `${approvalTypes[i % approvalTypes.length]} - ${new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    description: "Approval workflows for procurement requests and pending reviews",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Kevin Brown" : i % 4 === 1 ? "Laura White" : i % 4 === 2 ? "Steven Clark" : "Michelle Lee",
    assignee_name: i % 4 === 0 ? "Kevin Brown" : i % 4 === 1 ? "Laura White" : i % 4 === 2 ? "Steven Clark" : "Michelle Lee",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(3),
    created_at: getRandomPastDate(5),
    updated_at: new Date().toISOString(),
    tags: ["approval", approvalTypes[i % approvalTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateRequisitionsData(count: number): DataItem[] {
  const requisitionTypes = [
    "Equipment Purchase",
    "Office Supplies",
    "Production Materials",
    "Software License",
    "Professional Services",
    "Facility Maintenance",
    "Marketing Materials",
    "IT Hardware"
  ]
  const statuses = ["draft", "submitted", "approved", "rejected", "on_hold"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `requisition-${i + 1}`,
    name: `${requisitionTypes[i % requisitionTypes.length]} - REQ#${30000 + i}`,
    description: "Purchase requisitions and procurement requests from departments",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 5 === 0 ? "Brian Taylor" : i % 5 === 1 ? "Nicole Harris" : i % 5 === 2 ? "Patrick Moore" : i % 5 === 3 ? "Stephanie Young" : "Daniel King",
    assignee_name: i % 5 === 0 ? "Brian Taylor" : i % 5 === 1 ? "Nicole Harris" : i % 5 === 2 ? "Patrick Moore" : i % 5 === 3 ? "Stephanie Young" : "Daniel King",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(10),
    updated_at: new Date().toISOString(),
    tags: ["requisition", requisitionTypes[i % requisitionTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateLineItemsData(count: number): DataItem[] {
  const itemCategories = [
    "Labor - Skilled Technician",
    "Labor - Project Manager",
    "Equipment - Lighting",
    "Equipment - Audio",
    "Materials - Construction",
    "Materials - Consumables",
    "Services - Design",
    "Services - Consulting",
    "Rental - Staging",
    "Rental - Vehicles"
  ]
  const statuses = ["active", "pending_approval", "approved", "inactive"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `line-item-${i + 1}`,
    name: `${itemCategories[i % itemCategories.length]}`,
    description: `Approved rate range: $${50 + (i * 10)}-$${150 + (i * 15)}/unit • Used for budget forecasting and procurement planning`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Finance Team" : i % 3 === 1 ? "Procurement Team" : "Operations Team",
    assignee_name: i % 3 === 0 ? "Finance Team" : i % 3 === 1 ? "Procurement Team" : "Operations Team",
    due_date: getRandomFutureDate(180),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["line-item", "rate-range", "forecasting"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateAuditsData(count: number): DataItem[] {
  const auditTypes = [
    "Vendor Compliance Audit",
    "Contract Review Audit",
    "Procurement Process Audit",
    "Spend Analysis Audit",
    "Supplier Performance Audit",
    "Purchase Order Audit",
    "Invoice Verification Audit",
    "Budget Compliance Audit"
  ]
  const statuses = ["scheduled", "in_progress", "completed", "findings_reported", "action_required"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `audit-${i + 1}`,
    name: `${auditTypes[i % auditTypes.length]} - Q${(i % 4) + 1} ${new Date().getFullYear()}`,
    description: "Procurement audits, compliance reviews, and audit history tracking",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Audit Team Lead" : i % 4 === 1 ? "Compliance Officer" : i % 4 === 2 ? "Risk Manager" : "Internal Auditor",
    assignee_name: i % 4 === 0 ? "Audit Team Lead" : i % 4 === 1 ? "Compliance Officer" : i % 4 === 2 ? "Risk Manager" : "Internal Auditor",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["audit", "compliance", auditTypes[i % auditTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 20),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["todo", "in_progress", "review", "done"]
  const priorities = ["urgent", "high", "normal", "low"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `procurement-${i + 1}`,
    name: `Procurement Item ${i + 1}`,
    description: "General procurement item or task",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Jane Smith" : "Bob Wilson",
    assignee_name: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Jane Smith" : "Bob Wilson",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["procurement"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
