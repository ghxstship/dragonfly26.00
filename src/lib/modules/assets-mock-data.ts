import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateAssetsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'tracking':
      return generateTrackingData(count)
    case 'inventory':
      return generateInventoryData(count)
    case 'maintenance':
      return generateMaintenanceData(count)
    case 'approvals':
      return generateApprovalsData(count)
    case 'advances':
      return generateAdvancesData(count)
    case 'catalog':
      return generateCatalogData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const metrics = [
    "Total Assets Value",
    "Assets in Use",
    "Available Assets",
    "Under Maintenance",
    "Pending Approvals",
    "Active Advances",
    "Assets Checked Out",
    "Overdue Returns",
    "Maintenance Due Soon",
    "Depreciation This Month",
  ]
  const statuses = ["healthy", "warning", "critical", "info"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `overview-${i + 1}`,
    name: metrics[i % metrics.length],
    description: `${Math.floor(Math.random() * 500) + 50} items | ${Math.floor(Math.random() * 30)}% change from last period`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Asset Manager" : i % 3 === 1 ? "Operations Lead" : "Finance Team",
    assignee_name: i % 3 === 0 ? "Asset Manager" : i % 3 === 1 ? "Operations Lead" : "Finance Team",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["overview", "metrics", "dashboard"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateTrackingData(count: number): DataItem[] {
  const assetNames = [
    "Sony FX6 Camera Body",
    "Arri SkyPanel S60-C",
    "Shure ULXD Wireless System",
    "Truss Section 12ft",
    "LED Video Wall Panel",
    "Ford Transit Van",
    "Genie AWP-30S Lift",
    "MacBook Pro 16\" M2",
    "Midas M32 Console",
    "DJI Ronin 4D Gimbal",
  ]
  const assetTypes = ["infrastructure", "equipment", "vehicle", "tool", "credential", "consumable"]
  const categories = ["Video", "Lighting", "Audio", "Rigging", "Vehicles", "Lifts", "Computers", "Consoles"]
  const assetStatuses = ["available", "in_use", "maintenance", "retired", "lost", "damaged"]
  const conditions = ["excellent", "good", "fair", "poor"]
  const ownerships = ["owned", "rented", "leased"]
  const locations = ["location-1", "location-2", "location-3", "location-4"]
  const manufacturers = ["Sony", "Arri", "Shure", "Prolyte", "Absen", "Ford", "Genie", "Apple", "Midas", "DJI"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `asset-${i + 1}`,
    name: `${assetNames[i % assetNames.length]} - ${String.fromCharCode(65 + (i % 5))}${(i % 100) + 1}`,
    description: `Professional ${categories[i % categories.length].toLowerCase()} equipment with full specifications`,
    type: assetTypes[i % assetTypes.length],
    category: categories[i % categories.length],
    subcategory: null,
    asset_tag: `AST-${String(i + 1001).padStart(5, '0')}`,
    serial_number: `SN${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}`,
    model_number: `${assetNames[i % assetNames.length].split(' ')[0]}-${Math.floor(Math.random() * 9000) + 1000}`,
    manufacturer: manufacturers[i % manufacturers.length],
    purchase_price: parseFloat((Math.random() * 50000 + 1000).toFixed(2)),
    purchase_date: getRandomPastDate(365 * 3),
    current_value: parseFloat((Math.random() * 40000 + 800).toFixed(2)),
    depreciation_rate: parseFloat((Math.random() * 15 + 5).toFixed(2)),
    status: assetStatuses[i % assetStatuses.length],
    condition: conditions[i % conditions.length],
    location_id: locations[i % locations.length],
    current_location: null,
    ownership: ownerships[i % ownerships.length],
    vendor_id: i % 3 === 0 ? `company-${(i % 5) + 1}` : null,
    specifications: null,
    tags: [categories[i % categories.length].toLowerCase(), assetTypes[i % assetTypes.length]],
    created_by: "person-1",
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateInventoryData(count: number): DataItem[] {
  const categories = [
    "Audio Equipment",
    "Lighting Fixtures",
    "Video & Projection",
    "Staging & Rigging",
    "Power Distribution",
    "Vehicles",
    "Tools & Hardware",
    "Computers & Tech",
    "Cables & Accessories",
    "Safety Equipment",
  ]
  const inventoryStatuses = ["in_stock", "low_stock", "out_of_stock", "on_order", "surplus"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `inventory-${i + 1}`,
    name: `${categories[i % categories.length]} - ${['SKU', 'CAT', 'INV'][i % 3]}-${(1000 + i).toString()}`,
    description: `Stock: ${Math.floor(Math.random() * 50)} units | Min: ${Math.floor(Math.random() * 5) + 2} | Value: $${(Math.random() * 50000 + 1000).toFixed(2)}`,
    status: inventoryStatuses[i % inventoryStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Inventory Controller" : i % 3 === 1 ? "Warehouse Manager" : "Asset Coordinator",
    assignee_name: i % 3 === 0 ? "Inventory Controller" : i % 3 === 1 ? "Warehouse Manager" : "Asset Coordinator",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(90),
    created_at: getRandomPastDate(400),
    updated_at: new Date().toISOString(),
    tags: ["inventory", categories[i % categories.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateMaintenanceData(count: number): DataItem[] {
  const maintenanceTypes = ["preventive", "corrective", "inspection", "calibration", "upgrade"]
  const assetIds = ["asset-1", "asset-2", "asset-3", "asset-4", "asset-5", "asset-6", "asset-7", "asset-8"]
  const maintenanceStatuses = ["scheduled", "in_progress", "completed", "cancelled"]
  const technicians = ["person-1", "person-2", "person-3", "person-4"]
  const vendors = ["company-1", "company-2", "company-3"]
  
  return Array.from({ length: count }, (_, i) => {
    const scheduledDate = new Date(Date.now() + (i - 10) * 7 * 24 * 60 * 60 * 1000)
    const completedDate = i % 3 === 0 ? new Date(scheduledDate.getTime() + 2 * 24 * 60 * 60 * 1000) : null
    
    return {
      id: `maintenance-${i + 1}`,
      asset_id: assetIds[i % assetIds.length],
      type: maintenanceTypes[i % maintenanceTypes.length],
      description: `${maintenanceTypes[i % maintenanceTypes.length].charAt(0).toUpperCase() + maintenanceTypes[i % maintenanceTypes.length].slice(1)} maintenance service`,
      scheduled_date: scheduledDate.toISOString().split('T')[0],
      completed_date: completedDate ? completedDate.toISOString().split('T')[0] : null,
      performed_by: i % 2 === 0 ? technicians[i % technicians.length] : null,
      vendor_id: i % 2 !== 0 ? vendors[i % vendors.length] : null,
      cost: parseFloat((Math.random() * 2000 + 100).toFixed(2)),
      labor_hours: parseFloat((Math.random() * 8 + 1).toFixed(1)),
      parts_replaced: i % 3 === 0 ? `Part ${i + 1}, Component ${i + 2}` : null,
      notes: `Maintenance work completed successfully. Equipment tested and operational.`,
      next_service_date: new Date(scheduledDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: maintenanceStatuses[i % maintenanceStatuses.length],
      created_at: getRandomPastDate(60),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 12),
      attachments_count: Math.floor(Math.random() * 10),
    }
  })
}

function generateApprovalsData(count: number): DataItem[] {
  const approvalTypes = [
    "Equipment Advance Request",
    "Vehicle Advance Approval",
    "Tool Kit Advance",
    "Technology Package Advance",
    "Production Materials Advance",
    "Safety Gear Advance",
    "Specialty Equipment Request",
    "Bulk Materials Advance",
    "Consumables Advance",
    "Emergency Equipment Request",
  ]
  const requesters = [
    "Production Manager",
    "Technical Director",
    "Stage Manager",
    "Lighting Designer",
    "Audio Engineer",
    "Video Director",
    "Set Designer",
    "Props Master",
  ]
  const approvalStatuses = ["pending", "under_review", "approved", "rejected", "revision_requested"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `approval-${i + 1}`,
    name: `${approvalTypes[i % approvalTypes.length]} - REQ-${(2000 + i).toString()}`,
    description: `Requested by: ${requesters[i % requesters.length]} | Items: ${Math.floor(Math.random() * 15) + 1} | Est. duration: ${Math.floor(Math.random() * 60) + 1} days`,
    status: approvalStatuses[i % approvalStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Operations Director" : i % 3 === 1 ? "Finance Approver" : "Asset Manager",
    assignee_name: i % 3 === 0 ? "Operations Director" : i % 3 === 1 ? "Finance Approver" : "Asset Manager",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(3),
    created_at: getRandomPastDate(5),
    updated_at: new Date().toISOString(),
    tags: ["approval", "advance-request", approvalStatuses[i % approvalStatuses.length]],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateAdvancesData(count: number): DataItem[] {
  const productionIds = ["production-1", "production-2", "production-3"]
  const purposes = ["Equipment advance for load-in", "Pre-production setup", "Tour advance", "Festival prep", "Special event advance"]
  const advanceStatuses = ["pending", "approved", "issued", "returned", "closed"]
  const requestedBy = ["person-1", "person-2", "person-3", "person-4"]
  const approvedBy = ["person-1", "person-2"]
  
  return Array.from({ length: count }, (_, i) => {
    const requestDate = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
    const approvalDate = i % 3 !== 2 ? new Date(requestDate.getTime() + 24 * 60 * 60 * 1000) : null
    const issueDate = approvalDate ? new Date(approvalDate.getTime() + 48 * 60 * 60 * 1000) : null
    const expectedReturn = issueDate ? new Date(issueDate.getTime() + (14 + Math.random() * 30) * 24 * 60 * 60 * 1000) : null
    const actualReturn = i % 4 === 0 && issueDate ? new Date(issueDate.getTime() + (15 + Math.random() * 25) * 24 * 60 * 60 * 1000) : null
    
    return {
      id: `advance-${i + 1}`,
      production_id: productionIds[i % productionIds.length],
      requested_by: requestedBy[i % requestedBy.length],
      approved_by: approvalDate ? approvedBy[i % approvedBy.length] : null,
      amount: parseFloat((Math.random() * 50000 + 5000).toFixed(2)),
      currency: "USD",
      purpose: purposes[i % purposes.length],
      request_date: requestDate.toISOString().split('T')[0],
      approval_date: approvalDate ? approvalDate.toISOString().split('T')[0] : null,
      issue_date: issueDate ? issueDate.toISOString().split('T')[0] : null,
      expected_return_date: expectedReturn ? expectedReturn.toISOString().split('T')[0] : null,
      actual_return_date: actualReturn ? actualReturn.toISOString().split('T')[0] : null,
      status: advanceStatuses[i % advanceStatuses.length],
      notes: `Production advance for ${purposes[i % purposes.length]}. All items accounted for.`,
      created_at: requestDate.toISOString(),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 20),
      attachments_count: Math.floor(Math.random() * 15),
    }
  })
}

function generateCatalogData(count: number): DataItem[] {
  const assetTypes = [
    "Infrastructure",
    "Production Equipment",
    "Audio Equipment",
    "Video Equipment",
    "Lighting Equipment",
    "Staging Equipment",
    "Rigging Hardware",
    "Tools",
    "Vehicles",
    "Heavy Machinery",
    "Credentials",
    "Furnishings",
    "Safety Equipment",
    "IT Equipment",
    "Communication Systems",
  ]
  const items = [
    "Truss System - 12\" Box Truss",
    "Moving Head Light - Clay Paky Sharpy",
    "Digital Audio Console - Yamaha CL5",
    "LED Video Wall - ROE Black Pearl",
    "Camera - ARRI Alexa Mini LF",
    "Forklift - Toyota 8FGU25",
    "Generator - 100kW Diesel",
    "Scissor Lift - Genie GS-3246",
    "Wireless Intercom - Clear-Com FreeSpeak",
    "Staging Deck - 4x8 ft",
    "Rigging Motor - Chain Hoist 1 Ton",
    "Production Desk - Mobile Workstation",
    "Safety Harness - Full Body",
    "Laptop - MacBook Pro 16\"",
    "Walkie Talkie - Motorola CP200d",
  ]
  const catalogStatuses = ["active", "discontinued", "seasonal", "restricted", "archived"]
  const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Global"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `catalog-${i + 1}`,
    name: `${items[i % items.length]} - ${assetTypes[i % assetTypes.length]}`,
    description: `Region: ${regions[i % regions.length]} | Model: ${Math.random().toString(36).substring(2, 8).toUpperCase()} | Available units: ${Math.floor(Math.random() * 100) + 1} | Includes: ${['accessories', 'upgrades', 'add-ons', 'warranty', 'support'][i % 5]}`,
    status: catalogStatuses[i % catalogStatuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Catalog Manager" : i % 3 === 1 ? "Asset Specialist" : "Inventory Lead",
    assignee_name: i % 3 === 0 ? "Catalog Manager" : i % 3 === 1 ? "Asset Specialist" : "Inventory Lead",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(365),
    created_at: getRandomPastDate(730),
    updated_at: new Date().toISOString(),
    tags: [
      "catalog",
      assetTypes[i % assetTypes.length].toLowerCase().replace(/\s+/g, '-'),
      regions[i % regions.length].toLowerCase().replace(/\s+/g, '-')
    ],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "completed", "archived"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Asset Item",
    "Equipment Record",
    "Material Entry",
    "Resource Allocation",
    "Equipment Assignment",
    "Asset Documentation",
    "Inventory Item",
    "Catalog Entry",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Asset management item requiring attention",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Asset Manager" : i % 3 === 1 ? "Operations Lead" : "Coordinator",
    assignee_name: i % 3 === 0 ? "Asset Manager" : i % 3 === 1 ? "Operations Lead" : "Coordinator",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["asset", "generic"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
