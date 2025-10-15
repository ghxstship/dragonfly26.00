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
  const companyIds = ["company-1", "company-2", "company-3", null]
  const departments = ["Audio", "Lighting", "Video", "Staging", "Production Office", null]
  const assetCategories = [
    "site_infrastructure",
    "site_services", 
    "site_safety",
    "site_vehicles",
    "heavy_equipment",
    "consumables",
    "event_rentals",
    "signage",
    "backline",
    "access",
    "credentials",
    "parking",
    "meals",
    "flights",
    "lodging",
    "rental_cars"
  ]
  const assetItems = [
    "Office Container 20ft",
    "Generator 100kW",
    "Fire Extinguishers (Set of 10)",
    "Golf Cart - Electric",
    "Forklift - Toyota 8FGU25",
    "Gaffer Tape (Case of 24)",
    "Round Tables 60\" (Set of 20)",
    "Standing Signs 24x36 (Set of 50)",
    "Drum Kit - Pearl Export Series",
    "Asana Project Management License",
    "All-Access Badge (3-Day Pass)",
    "VIP Parking Pass (Lot A)",
    "Catering Package - Production Crew (25 people)",
    "Flight Ticket LAX to JFK (Round Trip)",
    "Hotel Room - Hilton Downtown (2 Nights)",
    "Rental Car - SUV Ford Explorer"
  ]
  const locations = ["Stage Left", "Loading Dock", "Production Office", "Back of House", "Stage Right", "Security Office", "Catering Area"]
  const purposes = [
    "Load-in equipment setup and staging",
    "Event day operations and site services",
    "Safety compliance and emergency equipment",
    "Transportation and logistics support",
    "Heavy lifting and rigging operations",
    "General production consumables",
    "Guest services and event furniture",
    "Wayfinding and directional signage",
    "Backline equipment for performances",
    "Team collaboration and project management software",
    "Crew access and security clearances",
    "Staff parking allocation for event days",
    "Production crew meal services",
    "Travel arrangements for touring crew",
    "Lodging for out-of-town personnel",
    "Ground transportation for equipment and crew"
  ]
  const advanceStatuses = ["pending", "approved", "fulfilled", "active", "returned", "partially_returned", "overdue"]
  const requestedBy = ["user-1", "user-2", "user-3", "user-4"]
  const approvedBy = ["user-1", "user-2"]
  
  return Array.from({ length: count }, (_, i) => {
    const requestDate = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
    const approvalDate = i % 3 !== 2 ? new Date(requestDate.getTime() + 24 * 60 * 60 * 1000) : null
    const startDate = approvalDate ? new Date(approvalDate.getTime() + 48 * 60 * 60 * 1000) : new Date(requestDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    const endDate = new Date(startDate.getTime() + (7 + Math.random() * 14) * 24 * 60 * 60 * 1000)
    const fulfilledDate = approvalDate && i % 3 === 0 ? new Date(approvalDate.getTime() + 72 * 60 * 60 * 1000) : null
    
    const categoryIndex = i % assetCategories.length
    const quantity = Math.floor(Math.random() * 20) + 1
    const accessories = i % 3 === 0 ? ["Cables", "Adapters", "Cases"] : i % 3 === 1 ? ["Stands", "Mounts"] : []
    
    return {
      id: `advance-${i + 1}`,
      name: `ADV-${String(i + 1001).padStart(5, '0')}`,
      production_id: productionIds[i % productionIds.length],
      company_id: companyIds[i % companyIds.length],
      department_team: departments[i % departments.length],
      asset_category: assetCategories[categoryIndex],
      asset_id: i % 4 === 0 ? `asset-${i + 1}` : null,
      asset_item: assetItems[categoryIndex],
      accessories: accessories,
      quantity: quantity,
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      site_location_id: i % 3 === 0 ? `location-${(i % 3) + 1}` : null,
      site_location_name: locations[i % locations.length],
      operational_purpose: purposes[categoryIndex],
      special_considerations: i % 2 === 0 ? "Requires forklift access and loading dock clearance" : null,
      additional_information: i % 5 === 0 ? "Contact production office 24hrs in advance for pickup" : null,
      requestor_id: requestedBy[i % requestedBy.length],
      assigned_user_ids: i % 2 === 0 ? [requestedBy[i % requestedBy.length], requestedBy[(i + 1) % requestedBy.length]] : [requestedBy[i % requestedBy.length]],
      approver_id: approvalDate ? approvedBy[i % approvedBy.length] : null,
      status: advanceStatuses[i % advanceStatuses.length],
      approved_at: approvalDate ? approvalDate.toISOString() : null,
      fulfilled_at: fulfilledDate ? fulfilledDate.toISOString() : null,
      checked_out_at: fulfilledDate && i % 2 === 0 ? new Date(fulfilledDate.getTime() + 12 * 60 * 60 * 1000).toISOString() : null,
      returned_at: i % 5 === 0 && fulfilledDate ? new Date(endDate.getTime() + 24 * 60 * 60 * 1000).toISOString() : null,
      notes: `Production advance for ${assetItems[categoryIndex]}. ${purposes[categoryIndex]}.`,
      tags: ["advance", assetCategories[categoryIndex], advanceStatuses[i % advanceStatuses.length]],
      created_at: requestDate.toISOString(),
      updated_at: new Date().toISOString(),
      created_by: requestedBy[i % requestedBy.length],
      comments_count: Math.floor(Math.random() * 12),
      attachments_count: Math.floor(Math.random() * 8),
    }
  })
}

function generateCatalogData(count: number): DataItem[] {
  const assetCategories = [
    "site_infrastructure",
    "site_services", 
    "site_safety",
    "site_vehicles",
    "heavy_equipment",
    "consumables",
    "event_rentals",
    "signage",
    "backline",
    "access",
    "credentials",
    "parking",
    "meals",
    "flights",
    "lodging",
    "rental_cars"
  ]
  const categoryLabels = [
    "Site Infrastructure",
    "Site Services",
    "Site Safety",
    "Site Vehicles",
    "Heavy Equipment",
    "Consumables",
    "Event Rentals",
    "Signage",
    "Backline",
    "Access",
    "Credentials",
    "Parking",
    "Meals",
    "Flights",
    "Lodging",
    "Rental Cars"
  ]
  const items = [
    "Office Container 20ft",
    "Generator 100kW Diesel",
    "Fire Extinguisher Kit",
    "Golf Cart Electric 4-Seater",
    "Forklift - Toyota 8FGU25",
    "Gaffer Tape Roll 2\" x 60yd",
    "Round Table 60\" with Linen",
    "Standing Sign 24x36 with Holder",
    "Drum Kit - Pearl Export Series",
    "Asana Team License (Annual)",
    "All-Access Crew Badge",
    "VIP Parking Pass - Lot A",
    "Catering Package - 25 People",
    "Flight LAX to JFK Round Trip",
    "Hotel Room Hilton (2 Nights)",
    "Rental Car SUV Ford Explorer",
    "Storage Container 40ft",
    "Lighting Tower Diesel",
    "First Aid Kit Complete",
    "Utility Cart Gas-Powered",
    "Scissor Lift - Genie GS-3246",
    "Zip Ties Assorted Pack",
    "Chair Chiavari Gold",
    "Directional Sign 18x24",
    "Guitar Amp - Fender Twin"
  ]
  const manufacturers = [
    "ULine",
    "Generac",
    "Amerex",
    "Club Car",
    "Toyota",
    "ProTapes",
    "Lifetime",
    "ULine",
    "Pearl",
    "Conex",
    "Atlas Copco",
    "MediTac",
    "Yamaha",
    "Genie",
    "Gardner Bender",
    "Chiavari",
    "Brady",
    "Fender"
  ]
  const catalogStatuses = ["in_stock", "limited", "out_of_stock", "discontinued"]
  const availability = ["Available", "Limited Stock", "Order Required", "Seasonal"]
  
  return Array.from({ length: count }, (_, i) => {
    const categoryIndex = i % assetCategories.length
    const dailyRate = parseFloat((Math.random() * 500 + 50).toFixed(2))
    const unitCost = parseFloat((Math.random() * 5000 + 100).toFixed(2))
    
    return {
      id: `catalog-${i + 1}`,
      name: items[i % items.length],
      description: `${categoryLabels[categoryIndex]} item | Model: ${Math.random().toString(36).substring(2, 8).toUpperCase()} | Stock: ${Math.floor(Math.random() * 100) + 1} units`,
      asset_category: assetCategories[categoryIndex],
      category: categoryLabels[categoryIndex],
      manufacturer: manufacturers[i % manufacturers.length],
      model_number: `${manufacturers[i % manufacturers.length]}-${Math.floor(Math.random() * 9000) + 1000}`,
      unit_cost: unitCost,
      rental_rate_daily: dailyRate,
      availability: availability[i % availability.length],
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
        assetCategories[categoryIndex],
        catalogStatuses[i % catalogStatuses.length]
      ],
      comments_count: Math.floor(Math.random() * 10),
      attachments_count: Math.floor(Math.random() * 8),
    }
  })
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
