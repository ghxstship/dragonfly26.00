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
  const trackingStatuses = ["checked_out", "checked_in", "in_transit", "on_location", "returned"]
  const locations = [
    "Main Warehouse",
    "Studio A",
    "On Tour - Boston",
    "Client Site - NYC",
    "Production Office",
    "Service Center",
    "Venue - LA Forum",
    "In Vehicle 205",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tracking-${i + 1}`,
    name: `${assetNames[i % assetNames.length]} - ${String.fromCharCode(65 + (i % 5))}${(i % 100) + 1}`,
    description: `Location: ${locations[i % locations.length]} | Days in use: ${Math.floor(Math.random() * 180)} | Last check: ${new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    status: trackingStatuses[i % trackingStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Mike Torres" : i % 4 === 1 ? "Jessica Chen" : i % 4 === 2 ? "David Park" : "Emily Rivers",
    assignee_name: i % 4 === 0 ? "Mike Torres" : i % 4 === 1 ? "Jessica Chen" : i % 4 === 2 ? "David Park" : "Emily Rivers",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["tracking", "location", locations[i % locations.length].toLowerCase().replace(/\s+/g, '-')],
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
  const maintenanceTypes = [
    "Preventive Maintenance - Quarterly",
    "Annual Inspection Required",
    "Repair - Component Failure",
    "Calibration Service",
    "Firmware Update",
    "Battery Replacement",
    "Cleaning & Lubrication",
    "Safety Inspection",
    "Performance Test",
    "Warranty Service",
  ]
  const equipmentItems = [
    "Camera Package A",
    "Lighting Console",
    "Audio Rack System",
    "Forklift Unit 3",
    "Generator 15kW",
    "Scissor Lift",
    "Follow Spot",
    "Moving Head Lights",
    "Wireless Mic Set",
    "Video Switcher",
  ]
  const maintenanceStatuses = ["scheduled", "in_service", "completed", "overdue", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `maintenance-${i + 1}`,
    name: `${equipmentItems[i % equipmentItems.length]} - ${maintenanceTypes[i % maintenanceTypes.length]}`,
    description: `Service provider: ${['TechCare Pro', 'Asset Services Inc', 'Authorized Dealer', 'In-House Team'][i % 4]} | Last service: ${new Date(Date.now() - (Math.random() * 180 + 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    status: maintenanceStatuses[i % maintenanceStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Tom Bradley" : i % 4 === 1 ? "Sarah Connor" : i % 4 === 2 ? "James Mitchell" : "Lisa Anderson",
    assignee_name: i % 4 === 0 ? "Tom Bradley" : i % 4 === 1 ? "Sarah Connor" : i % 4 === 2 ? "James Mitchell" : "Lisa Anderson",
    due_date: getRandomFutureDate(45),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["maintenance", "service", maintenanceTypes[i % maintenanceTypes.length].toLowerCase().split(' ')[0]],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 10),
  }))
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
  const advanceTypes = [
    "Lighting Package Advance",
    "Camera & Lens Kit Advance",
    "Audio System Advance",
    "Staging Materials Advance",
    "Rigging Equipment Advance",
    "Video Production Gear",
    "Power & Distribution Advance",
    "Specialty Tools Package",
    "Safety Equipment Advance",
    "Transportation Fleet Advance",
  ]
  const productions = [
    "Winter Tour 2024",
    "Corporate Event - Tech Summit",
    "Festival Main Stage",
    "TV Production - Season 5",
    "Brand Activation NYC",
    "Concert Series",
    "Theater Production",
    "Award Show Special",
  ]
  const advanceStatuses = ["active", "pending_return", "partially_returned", "completed", "extended"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `advance-${i + 1}`,
    name: `${advanceTypes[i % advanceTypes.length]} - ${productions[i % productions.length]}`,
    description: `Items: ${Math.floor(Math.random() * 20) + 5} | Value: $${(Math.random() * 100000 + 5000).toFixed(2)} | Days out: ${Math.floor(Math.random() * 90) + 1}`,
    status: advanceStatuses[i % advanceStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Alex Martinez" : i % 4 === 1 ? "Jordan Blake" : i % 4 === 2 ? "Taylor Swift" : "Morgan Freeman",
    assignee_name: i % 4 === 0 ? "Alex Martinez" : i % 4 === 1 ? "Jordan Blake" : i % 4 === 2 ? "Taylor Swift" : "Morgan Freeman",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["advance", "production", productions[i % productions.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 15),
  }))
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
