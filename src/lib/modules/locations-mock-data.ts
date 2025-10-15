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
    case 'bim-models':
      return generateBimModelsData(count)
    case 'coordination':
      return generateCoordinationData(count)
    case 'spatial-features':
      return generateSpatialFeaturesData(count)
    default:
      return generateGenericData(count)
  }
}

function generateDirectoryData(count: number): DataItem[] {
  const locationTypes = ["venue", "office", "warehouse", "studio", "stage", "room", "facility", "site"]
  const locationNames = ["Madison Square Garden", "Studio A", "Main Warehouse", "Creative Space", "Theater One", "Conference Room", "Production Facility", "Outdoor Site"]
  const cities = ["New York", "Los Angeles", "Chicago", "Nashville", "Austin", "Seattle", "Boston", "Miami"]
  const states = ["NY", "CA", "IL", "TN", "TX", "WA", "MA", "FL"]
  const statuses = ["active", "inactive", "under_construction"]
  const contactNames = ["John Smith", "Sarah Chen", "Marcus Johnson", "Elena Rodriguez"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `location-${i + 1}`,
    name: `${locationNames[i % locationNames.length]} ${String.fromCharCode(65 + (i % 5))}`,
    type: locationTypes[i % locationTypes.length],
    description: `Production facility with full technical capabilities and modern amenities`,
    address_line1: `${100 + i * 10} Main Street`,
    address_line2: i % 3 === 0 ? `Suite ${100 + i}` : null,
    city: cities[i % cities.length],
    state: states[i % states.length],
    postal_code: `${10000 + Math.floor(Math.random() * 90000)}`,
    country: "US",
    latitude: parseFloat((40 + Math.random() * 8).toFixed(6)),
    longitude: parseFloat((-74 - Math.random() * 50).toFixed(6)),
    timezone: "America/New_York",
    capacity: Math.floor(Math.random() * 5000) + 500,
    size_sqft: Math.floor(Math.random() * 50000) + 5000,
    contact_name: contactNames[i % contactNames.length],
    contact_phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    contact_email: `contact@${locationNames[i % locationNames.length].toLowerCase().replace(/\s+/g, '')}.com`,
    parent_location_id: i > 10 && i % 5 === 0 ? `location-${Math.floor(i / 5)}` : null,
    status: statuses[i % statuses.length],
    amenities: ["parking", "wifi", "catering", "loading_dock"].slice(0, Math.floor(Math.random() * 4) + 1),
    restrictions: i % 4 === 0 ? ["no_smoking", "restricted_hours"] : [],
    tags: [locationTypes[i % locationTypes.length], cities[i % cities.length].toLowerCase()],
    created_by: "person-1",
    created_at: getRandomPastDate(730),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 20),
  }))
}

function generateSiteMapsData(count: number): DataItem[] {
  const mapTypes = ["floor_plan", "site_plan", "rigging_plot", "electrical_plan", "emergency_exits"]
  const mapNames = [
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
  const formats = ["pdf", "dwg", "image", "cad"]
  const locationIds = ["location-1", "location-2", "location-3", "location-4"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `site-map-${i + 1}`,
    location_id: locationIds[i % locationIds.length],
    name: mapNames[i % mapNames.length],
    type: mapTypes[i % mapTypes.length],
    file_url: `https://storage.example.com/maps/map-${i + 1}.${formats[i % formats.length]}`,
    version: `${Math.floor(i / 10) + 1}.${i % 10}`,
    scale: ["1:50", "1:100", "1:200", "1:500"][i % 4],
    format: formats[i % formats.length],
    notes: "Detailed facility layout with measurements, access points, and technical infrastructure",
    uploaded_by: "person-1",
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateAccessData(count: number): DataItem[] {
  const accessPoints = [
    "Main Entrance",
    "Artist Entrance",
    "Load-In Bay A",
    "Load-In Bay B",
    "Staff Entrance",
    "VIP Entrance",
    "Emergency Exit East",
    "Service Entrance",
    "Parking Gate Main",
    "Parking Gate VIP",
  ]
  const accessTypes = ["badge", "key_card", "pin_code", "biometric", "manual"]
  const locationIds = ["location-1", "location-2", "location-3", "location-4"]
  const personnelIds = ["person-1", "person-2", "person-3", "person-4", "person-5"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `access-${i + 1}`,
    location_id: locationIds[i % locationIds.length],
    access_point_name: accessPoints[i % accessPoints.length],
    access_type: accessTypes[i % accessTypes.length],
    access_code: i % 3 === 0 ? `CODE-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}` : null,
    authorized_personnel: Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, j) => personnelIds[j % personnelIds.length]),
    operating_hours: i % 2 === 0 ? "24/7" : "06:00-22:00",
    requires_escort: i % 4 === 0,
    notes: `Access control point with ${accessTypes[i % accessTypes.length]} security`,
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
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
  const utilityTypes = ["power", "water", "gas", "hvac", "internet", "compressed_air"]
  const utilityNames = [
    "Main Power Distribution 400A",
    "Backup Generator 250kW",
    "HVAC System Zone A",
    "Water Supply Main",
    "Gas Line Stage Area",
    "Internet Fiber 1Gbps",
    "Compressed Air Main",
    "Fire Suppression Wet",
    "Elevator System Main",
    "Emergency Lighting Backup",
  ]
  const statuses = ["active", "inactive", "maintenance"]
  const locationIds = ["location-1", "location-2", "location-3", "location-4"]
  const providers = ["Con Edison", "National Grid", "Local Water Authority", "Verizon", "Internal"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `utility-${i + 1}`,
    location_id: locationIds[i % locationIds.length],
    utility_type: utilityTypes[i % utilityTypes.length],
    name: utilityNames[i % utilityNames.length],
    provider: providers[i % providers.length],
    account_number: `ACC-${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}`,
    capacity: `${Math.floor(Math.random() * 500) + 100} ${['kW', 'GPM', 'CFM', 'A', 'Mbps'][i % 5]}`,
    monthly_cost: parseFloat((Math.random() * 5000 + 500).toFixed(2)),
    status: statuses[i % statuses.length],
    notes: "Critical building utility with regular maintenance schedule",
    last_service_date: getRandomPastDate(90),
    next_service_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(730),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateBimModelsData(count: number): DataItem[] {
  const modelTypes = ["ifc", "revit", "archicad", "sketchup", "rhino"]
  const modelNames = [
    "Building A - Architecture",
    "Building A - Structure",
    "Building A - MEP",
    "Building B - Architecture",
    "Building B - Structure",
    "Site Master Plan",
    "Parking Structure",
    "Mechanical Room Detail",
    "Electrical Distribution",
    "Plumbing Risers",
  ]
  const disciplines = ["architecture", "structure", "mep", "civil"]
  const lodLevels = ["LOD100", "LOD200", "LOD300", "LOD350", "LOD400", "LOD500"]
  const ifcSchemas = ["IFC2x3", "IFC4", "IFC4x3"]
  const locationIds = ["location-1", "location-2", "location-3", "location-4"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `bim-model-${i + 1}`,
    name: modelNames[i % modelNames.length],
    model_type: modelTypes[i % modelTypes.length],
    location_id: locationIds[i % locationIds.length],
    discipline: disciplines[i % disciplines.length],
    lod: lodLevels[i % lodLevels.length],
    ifc_schema: ifcSchemas[i % ifcSchemas.length],
    version: `${Math.floor(i / 10) + 1}.${i % 10}`,
    is_current: i % 10 === 0,
    file_url: `https://storage.example.com/models/model-${i + 1}.ifc`,
    file_size_mb: Math.floor(Math.random() * 500) + 10,
    software_name: i % 2 === 0 ? "Revit 2024" : "ArchiCAD 27",
    units: i % 3 === 0 ? "meters" : "feet",
    uploaded_by: "person-1",
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 5),
    metadata: {
      element_count: Math.floor(Math.random() * 10000) + 1000,
      level_count: Math.floor(Math.random() * 20) + 1,
      space_count: Math.floor(Math.random() * 200) + 10,
    }
  }))
}

function generateCoordinationData(count: number): DataItem[] {
  const clashTypes = ["hard", "soft", "clearance", "workflow", "duplicate"]
  const severities = ["critical", "high", "medium", "low", "info"]
  const statuses = ["active", "reviewed", "approved", "resolved", "ignored"]
  const clashNames = [
    "Duct vs Beam - Level 2",
    "Pipe vs Structural Column",
    "Cable Tray vs HVAC",
    "Door Clearance Issue",
    "Window vs MEP Riser",
    "Sprinkler Head vs Ceiling",
    "Electrical Panel vs Wall",
    "Plumbing Fixture Conflict",
    "Structural Brace vs Duct",
    "Fire Alarm vs Lighting",
  ]
  const elements = [
    "Wall-001", "Beam-B12", "Column-C3", "Duct-HVAC-01",
    "Pipe-P-2A", "Cable Tray-CT-5", "Door-D101", "Window-W203",
    "Sprinkler-SP-44", "Panel-EP-12"
  ]
  const locationIds = ["location-1", "location-2", "location-3"]
  const assignees = ["person-1", "person-2", "person-3", "person-4"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `clash-${i + 1}`,
    name: clashNames[i % clashNames.length],
    clash_type: clashTypes[i % clashTypes.length],
    severity: severities[i % severities.length],
    status: statuses[i % statuses.length],
    location_id: locationIds[i % locationIds.length],
    element_a: elements[i % elements.length],
    element_b: elements[(i + 3) % elements.length],
    element_a_type: i % 2 === 0 ? "architectural" : "mep",
    element_b_type: i % 2 === 0 ? "structural" : "mep",
    clash_distance_m: parseFloat((Math.random() * 0.5).toFixed(3)),
    detected_at: getRandomPastDate(30),
    detected_by: "Clash Detection Tool v3.2",
    assigned_to: assignees[i % assignees.length],
    assignee_name: `Team Member ${(i % assignees.length) + 1}`,
    resolution_notes: i % 3 === 0 ? "Reroute duct to avoid beam" : null,
    resolved_at: i % 4 === 0 ? getRandomPastDate(5) : null,
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateSpatialFeaturesData(count: number): DataItem[] {
  const featureTypes = [
    "point", "marker", "line", "polyline", "polygon", 
    "circle", "rectangle", "annotation"
  ]
  const featureNames = [
    "Equipment Location A",
    "Cable Run - Stage to Tech",
    "Safety Zone - Stage Front",
    "Loading Path - Main Entrance",
    "Restricted Area - Backstage",
    "Emergency Assembly Point",
    "Lighting Position 1",
    "Camera Position Main",
    "Speaker Coverage Zone",
    "Access Route - VIP",
  ]
  const layerNames = ["Equipment", "Infrastructure", "Safety", "Access", "Annotations"]
  const locationIds = ["location-1", "location-2", "location-3", "location-4"]
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `feature-${i + 1}`,
    name: featureNames[i % featureNames.length],
    feature_type: featureTypes[i % featureTypes.length],
    layer_name: layerNames[i % layerNames.length],
    location_id: locationIds[i % locationIds.length],
    stroke_color: colors[i % colors.length],
    stroke_width: Math.floor(Math.random() * 5) + 1,
    fill_color: colors[(i + 2) % colors.length],
    fill_opacity: parseFloat((Math.random() * 0.7 + 0.3).toFixed(2)),
    description: "Spatial feature with geometry and styling properties",
    length_m: featureTypes[i % featureTypes.length].includes('line') ? 
      parseFloat((Math.random() * 100 + 10).toFixed(2)) : null,
    area_sqm: featureTypes[i % featureTypes.length].includes('polygon') || 
               featureTypes[i % featureTypes.length].includes('circle') ?
      parseFloat((Math.random() * 500 + 50).toFixed(2)) : null,
    tags: ["gis", layerNames[i % layerNames.length].toLowerCase()],
    created_by: "person-1",
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
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
