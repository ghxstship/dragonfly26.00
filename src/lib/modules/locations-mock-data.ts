import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateLocationsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'directory':
      return generateDirectoryData(count)
    case 'site-maps':
      return generateSiteMapsData(count)
    case 'access':
      return generateAccessData(count)
    case 'warehousing':
      return generateWarehousingData(count)
    case 'logistics':
      return generateLogisticsData(count)
    case 'utilities':
      return generateUtilitiesData(count)
    default:
      return generateGenericData(count)
  }
}

function generateDirectoryData(count: number): DataItem[] {
  const locationTypes = ["Venue", "Office", "Warehouse", "Studio", "Theater", "Conference Center", "Workshop", "Storage Facility"]
  const cities = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "Nashville, TN", "Austin, TX", "Seattle, WA", "Boston, MA", "Miami, FL"]
  const statuses = ["active", "inactive", "under_renovation", "seasonal"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `location-${i + 1}`,
    name: `${locationTypes[i % locationTypes.length]} ${String.fromCharCode(65 + (i % 26))}`,
    description: `Production facility located in ${cities[i % cities.length]} with full technical capabilities`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Sarah Chen" : i % 3 === 1 ? "Marcus Johnson" : "Elena Rodriguez",
    assignee_name: i % 3 === 0 ? "Sarah Chen" : i % 3 === 1 ? "Marcus Johnson" : "Elena Rodriguez",
    due_date: getRandomFutureDate(180),
    start_date: getRandomPastDate(365),
    created_at: getRandomPastDate(730),
    updated_at: new Date().toISOString(),
    tags: [locationTypes[i % locationTypes.length].toLowerCase().replace(" ", "-"), "facility"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 20),
    metadata: {
      address: `${100 + i} Main Street, ${cities[i % cities.length]}`,
      capacity: Math.floor(Math.random() * 5000) + 500,
      squareFeet: `${Math.floor(Math.random() * 50000) + 5000} sq ft`,
    }
  }))
}

function generateSiteMapsData(count: number): DataItem[] {
  const mapTypes = [
    "Main Stage Floor Plan",
    "Backstage Layout",
    "Load-In Route Map",
    "Parking & Access Plan",
    "Venue Seating Chart",
    "Production Office Layout",
    "Storage Areas Map",
    "Emergency Exit Plan",
    "Utility Distribution Map",
    "Rigging Plot",
  ]
  const mapStatuses = ["current", "draft", "outdated", "under_review", "approved"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `site-map-${i + 1}`,
    name: `${mapTypes[i % mapTypes.length]} - v${Math.floor(i / mapTypes.length) + 1}.${i % 10}`,
    description: "Detailed facility layout with measurements, access points, and technical infrastructure",
    status: mapStatuses[i % mapStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "David Park" : i % 3 === 1 ? "Lisa Thompson" : "James Wilson",
    assignee_name: i % 3 === 0 ? "David Park" : i % 3 === 1 ? "Lisa Thompson" : "James Wilson",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: ["site-map", "floor-plan", "facility"],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
    metadata: {
      scale: "1:100",
      format: ["PDF", "DWG", "CAD"][i % 3],
      lastUpdated: getRandomPastDate(60),
    }
  }))
}

function generateAccessData(count: number): DataItem[] {
  const accessPoints = [
    "Main Entrance - Front Lobby",
    "Artist Entrance - Stage Door",
    "Load-In Bay - Dock A",
    "Load-In Bay - Dock B",
    "Staff Entrance - North Side",
    "VIP Entrance - West Wing",
    "Emergency Exit - East Side",
    "Service Entrance - Rear",
    "Parking Gate - Main Lot",
    "Parking Gate - VIP Lot",
  ]
  const accessTypes = ["badge", "key", "code", "biometric", "manned"]
  const accessStatuses = ["active", "restricted", "maintenance", "locked", "open"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `access-${i + 1}`,
    name: accessPoints[i % accessPoints.length],
    description: `Access point with ${accessTypes[i % accessTypes.length]} security system and 24/7 monitoring`,
    status: accessStatuses[i % accessStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Michael Torres" : i % 4 === 1 ? "Amanda White" : i % 4 === 2 ? "Robert Lee" : "Jessica Brown",
    assignee_name: i % 4 === 0 ? "Michael Torres" : i % 4 === 1 ? "Amanda White" : i % 4 === 2 ? "Robert Lee" : "Jessica Brown",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["access", "security", accessTypes[i % accessTypes.length]],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
    metadata: {
      accessType: accessTypes[i % accessTypes.length],
      operatingHours: i % 2 === 0 ? "24/7" : "8:00 AM - 10:00 PM",
      authorizedPersonnel: Math.floor(Math.random() * 100) + 10,
    }
  }))
}

function generateWarehousingData(count: number): DataItem[] {
  const warehouseTypes = [
    "Main Equipment Storage",
    "Prop Warehouse - Section A",
    "Prop Warehouse - Section B",
    "Costume Storage Facility",
    "Scenic Elements Storage",
    "Audio Equipment Warehouse",
    "Lighting Gear Storage",
    "Video Equipment Storage",
    "Rigging Hardware Warehouse",
    "Climate-Controlled Storage",
  ]
  const warehouseStatuses = ["available", "at_capacity", "reserved", "maintenance", "inactive"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `warehouse-${i + 1}`,
    name: `${warehouseTypes[i % warehouseTypes.length]} - Bay ${i + 1}`,
    description: "Storage facility with inventory tracking, climate control, and security systems",
    status: warehouseStatuses[i % warehouseStatuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Kevin Martinez" : i % 3 === 1 ? "Rachel Green" : "Brandon Davis",
    assignee_name: i % 3 === 0 ? "Kevin Martinez" : i % 3 === 1 ? "Rachel Green" : "Brandon Davis",
    due_date: getRandomFutureDate(120),
    start_date: getRandomPastDate(90),
    created_at: getRandomPastDate(730),
    updated_at: new Date().toISOString(),
    tags: ["warehouse", "storage", "inventory"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 12),
    metadata: {
      capacity: `${Math.floor(Math.random() * 50000) + 10000} cubic ft`,
      utilization: `${Math.floor(Math.random() * 100)}%`,
      climateControlled: i % 3 === 0,
    }
  }))
}

function generateLogisticsData(count: number): DataItem[] {
  const logisticsTypes = [
    "Equipment Transport - NYC to Boston",
    "Scenic Load-In - Morning Crew",
    "Prop Delivery - Express Service",
    "Audio Gear Pickup - Local",
    "Lighting Truck - Interstate",
    "Costume Transport - Overnight",
    "Video Equipment Shuttle",
    "Rigging Delivery - Scheduled",
    "Multi-Stop Equipment Run",
    "Emergency Equipment Rush",
  ]
  const carriers = ["Company Truck", "FedEx Freight", "Local Courier", "Specialty Transport", "Air Freight"]
  const logisticsStatuses = ["scheduled", "in_transit", "delivered", "delayed", "pending"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `logistics-${i + 1}`,
    name: `${logisticsTypes[i % logisticsTypes.length]} - ${carriers[i % carriers.length]}`,
    description: `Logistics coordination with tracking, route optimization, and delivery confirmation`,
    status: logisticsStatuses[i % logisticsStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Tyler Anderson" : i % 4 === 1 ? "Nicole Carter" : i % 4 === 2 ? "Daniel Kim" : "Sophia Martinez",
    assignee_name: i % 4 === 0 ? "Tyler Anderson" : i % 4 === 1 ? "Nicole Carter" : i % 4 === 2 ? "Daniel Kim" : "Sophia Martinez",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(2),
    created_at: getRandomPastDate(21),
    updated_at: new Date().toISOString(),
    tags: ["logistics", "transport", "delivery"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 5),
    metadata: {
      carrier: carriers[i % carriers.length],
      trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      estimatedDelivery: getRandomFutureDate(7),
    }
  }))
}

function generateUtilitiesData(count: number): DataItem[] {
  const utilityTypes = [
    "Main Power Distribution - 400A",
    "Backup Generator - 250kW",
    "Internet - Fiber 1Gbps",
    "Water Supply - Main Line",
    "HVAC System - Central",
    "Emergency Lighting",
    "Fire Suppression System",
    "Stage Power - 200A",
    "House Power - 100A",
    "Network Infrastructure",
  ]
  const utilityStatuses = ["operational", "maintenance", "offline", "reduced_capacity", "testing"]
  const serviceProviders = ["Municipal Utilities", "Private Provider", "Backup System", "On-Site Generation", "Cloud Service"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `utility-${i + 1}`,
    name: `${utilityTypes[i % utilityTypes.length]} - Zone ${Math.floor(i / 3) + 1}`,
    description: `Utility infrastructure with monitoring, maintenance schedule, and emergency protocols`,
    status: utilityStatuses[i % utilityStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Christopher Lee" : i % 3 === 1 ? "Victoria Santos" : "Matthew Taylor",
    assignee_name: i % 3 === 0 ? "Christopher Lee" : i % 3 === 1 ? "Victoria Santos" : "Matthew Taylor",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(1825),
    updated_at: new Date().toISOString(),
    tags: ["utility", "infrastructure", "facility"],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 10),
    metadata: {
      provider: serviceProviders[i % serviceProviders.length],
      capacity: ["100A", "200A", "400A", "1Gbps", "250kW"][i % 5],
      lastMaintenance: getRandomPastDate(90),
      nextMaintenance: getRandomFutureDate(30),
    }
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "inactive", "maintenance", "pending"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Location Management",
    "Facility Coordination",
    "Site Planning",
    "Infrastructure Review",
    "Access Control",
    "Logistics Planning",
    "Utility Management",
    "Maintenance Task",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Location item requiring attention and management",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Location Manager" : i % 3 === 1 ? "Facilities Director" : "Operations Lead",
    assignee_name: i % 3 === 0 ? "Location Manager" : i % 3 === 1 ? "Facilities Director" : "Operations Lead",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["location"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
