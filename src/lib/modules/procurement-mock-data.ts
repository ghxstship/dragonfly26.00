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
    case 'receiving':
      return generateReceivingData(count)
    case 'matching':
      return generateMatchingData(count)
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
  const types = ["work_order", "purchase_order", "change_order", "talent_order"]
  const statuses = ["draft", "pending_approval", "approved", "issued", "fulfilled", "cancelled"]
  const companyIds = ["company-1", "company-2", "company-3", "company-4"]
  const productionIds = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => {
    const subtotal = parseFloat((Math.random() * 50000 + 5000).toFixed(2))
    const tax = parseFloat((subtotal * 0.08).toFixed(2))
    const total = parseFloat((subtotal + tax).toFixed(2))
    
    return {
      id: `po-${i + 1}`,
      po_number: `PO-${String(202400 + i).padStart(8, '0')}`,
      type: types[i % types.length],
      company_id: companyIds[i % companyIds.length],
      production_id: i % 2 === 0 ? productionIds[i % productionIds.length] : null,
      subtotal,
      tax,
      total,
      currency: "USD",
      status: statuses[i % statuses.length],
      issue_date: getRandomPastDate(10).split('T')[0],
      delivery_date: getRandomFutureDate(60).split('T')[0],
      requires_approval: i % 3 !== 0,
      approved_by: i % 3 === 0 ? "person-1" : null,
      approved_date: i % 3 === 0 ? getRandomPastDate(5) : null,
      notes: "Order for production services and equipment",
      created_by: "person-1",
      created_at: getRandomPastDate(30),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 20),
      attachments_count: Math.floor(Math.random() * 12),
    }
  })
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

function generateReceivingData(count: number): DataItem[] {
  const inspectionStatuses = ["pass", "fail", "pending", "not_required"]
  const receiptStatuses = ["received", "partially_received", "inspection", "accepted", "rejected"]
  const vendors = ["Global Supplies Inc", "TechVendor Co", "Equipment Central", "Premium Materials LLC", "FastShip Distributors"]
  
  return Array.from({ length: count }, (_, i) => {
    const quantityOrdered = Math.floor(Math.random() * 100) + 10
    const quantityReceived = i % 5 === 0 ? quantityOrdered - Math.floor(Math.random() * 5) : quantityOrdered
    const hasDiscrepancy = quantityReceived !== quantityOrdered
    const inspectionStatus = inspectionStatuses[i % inspectionStatuses.length]
    
    return {
      id: `receipt-${i + 1}`,
      name: `Receipt #REC-${String(20251015 + i).padStart(8, '0')}`,
      description: `PO-${String(202400 + i).padStart(8, '0')} • ${vendors[i % vendors.length]} • ${quantityReceived} of ${quantityOrdered} units received`,
      status: receiptStatuses[i % receiptStatuses.length],
      priority: hasDiscrepancy ? "high" : inspectionStatus === "fail" ? "urgent" : "normal",
      assignee: i % 4 === 0 ? "Receiving Manager" : i % 4 === 1 ? "Quality Inspector" : i % 4 === 2 ? "Warehouse Lead" : "Logistics Coordinator",
      assignee_name: i % 4 === 0 ? "Receiving Manager" : i % 4 === 1 ? "Quality Inspector" : i % 4 === 2 ? "Warehouse Lead" : "Logistics Coordinator",
      due_date: null,
      start_date: getRandomPastDate(7),
      created_at: getRandomPastDate(10),
      updated_at: new Date().toISOString(),
      tags: [
        "receiving",
        inspectionStatus,
        hasDiscrepancy ? "discrepancy" : "complete",
        vendors[i % vendors.length].toLowerCase().replace(/\s+/g, '-')
      ],
      comments_count: hasDiscrepancy ? Math.floor(Math.random() * 8) + 2 : Math.floor(Math.random() * 3),
      attachments_count: i % 3 === 0 ? Math.floor(Math.random() * 4) + 1 : 0, // Packing slip photos
      // Custom fields for receiving
      inspection_status: inspectionStatus,
      quantity_ordered: quantityOrdered,
      quantity_received: quantityReceived,
      has_discrepancy: hasDiscrepancy,
      po_number: `PO-${String(202400 + i).padStart(8, '0')}`,
      vendor: vendors[i % vendors.length],
    }
  })
}

function generateMatchingData(count: number): DataItem[] {
  const matchStatuses = ["pending", "matched", "partial_match", "no_match", "approved", "rejected"]
  const vendors = ["Global Supplies Inc", "TechVendor Co", "Equipment Central", "Premium Materials LLC", "FastShip Distributors"]
  
  return Array.from({ length: count }, (_, i) => {
    const poAmount = parseFloat((Math.random() * 50000 + 5000).toFixed(2))
    const variance = i % 4 === 0 ? parseFloat((Math.random() * 1000).toFixed(2)) : 0
    const invoiceAmount = poAmount + (i % 3 === 0 ? variance : -variance)
    const variancePercent = variance > 0 ? parseFloat(((variance / poAmount) * 100).toFixed(2)) : 0
    const matchStatus = matchStatuses[i % matchStatuses.length]
    
    const hasQuantityDiscrepancy = i % 5 === 0
    const hasPriceDiscrepancy = variance > 0
    
    return {
      id: `match-${i + 1}`,
      name: `Invoice #INV-${String(50000 + i).padStart(6, '0')} • PO-${String(202400 + i).padStart(8, '0')}`,
      description: `${vendors[i % vendors.length]} • PO: $${poAmount.toLocaleString()} • Invoice: $${invoiceAmount.toLocaleString()} • Variance: ${variance > 0 ? '+' : ''}$${variance.toLocaleString()} (${variancePercent}%)`,
      status: matchStatus,
      priority: matchStatus === 'no_match' ? "urgent" : variancePercent > 5 ? "high" : variancePercent > 2 ? "normal" : "low",
      assignee: i % 4 === 0 ? "AP Manager" : i % 4 === 1 ? "Procurement Lead" : i % 4 === 2 ? "Finance Controller" : "Accounts Payable",
      assignee_name: i % 4 === 0 ? "AP Manager" : i % 4 === 1 ? "Procurement Lead" : i % 4 === 2 ? "Finance Controller" : "Accounts Payable",
      due_date: matchStatus === 'pending' || matchStatus === 'partial_match' ? getRandomFutureDate(14) : null,
      start_date: getRandomPastDate(30),
      created_at: getRandomPastDate(45),
      updated_at: new Date().toISOString(),
      tags: [
        "three-way-match",
        matchStatus,
        variancePercent > 5 ? "high-variance" : variancePercent > 0 ? "variance" : "exact-match",
        hasQuantityDiscrepancy ? "qty-discrepancy" : "",
        hasPriceDiscrepancy ? "price-discrepancy" : ""
      ].filter(Boolean),
      comments_count: variance > 0 ? Math.floor(Math.random() * 12) + 3 : Math.floor(Math.random() * 4),
      attachments_count: Math.floor(Math.random() * 6) + 1, // PO, Receipt, Invoice docs
      // Custom fields for matching
      match_status: matchStatus,
      po_amount: poAmount,
      invoice_amount: invoiceAmount,
      receipt_amount: poAmount, // Assume receipt matches PO for simplicity
      total_variance: variance,
      variance_percentage: variancePercent,
      quantity_discrepancy: hasQuantityDiscrepancy,
      price_discrepancy: hasPriceDiscrepancy,
      approved_for_payment: matchStatus === 'approved' || matchStatus === 'matched',
      po_number: `PO-${String(202400 + i).padStart(8, '0')}`,
      invoice_number: `INV-${String(50000 + i).padStart(6, '0')}`,
      receipt_number: `REC-${String(20251015 + i).padStart(8, '0')}`,
      vendor: vendors[i % vendors.length],
    }
  })
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
