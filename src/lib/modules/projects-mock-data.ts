import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateProjectsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'productions':
      return generateProductionsData(count)
    case 'activations':
      return generateActivationsData(count)
    case 'schedule':
      return generateScheduleData(count)
    case 'tasks':
      return generateTasksData(count)
    case 'milestones':
      return generateMilestonesData(count)
    case 'compliance':
      return generateComplianceData(count)
    case 'safety':
      return generateSafetyData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const projectTypes = ["Concert", "Festival", "Corporate Event", "Theater Production", "Tour"]
  const statuses = ["planning", "in_progress", "active", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `project-${i + 1}`,
    name: `${projectTypes[i % projectTypes.length]} ${2024 + Math.floor(i / projectTypes.length)}`,
    description: "Production overview and key metrics",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Sarah Johnson" : i % 3 === 1 ? "Mike Chen" : "Emily Rodriguez",
    assignee_name: i % 3 === 0 ? "Sarah Johnson" : i % 3 === 1 ? "Mike Chen" : "Emily Rodriguez",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["production", "overview"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateProductionsData(count: number): DataItem[] {
  const productions = [
    "Summer Music Festival 2024",
    "Corporate Launch Event",
    "Broadway Revival Tour",
    "Arena Concert Series",
    "Fashion Week Runway Show",
    "Tech Conference 2024",
    "Award Show Production",
    "Stadium Tour",
  ]
  const productionTypes = ["concert", "festival", "tour", "corporate", "theater", "broadcast"]
  const phases = ["pre-production", "in_production", "load-in", "live", "post-production"]
  const clients = ["Live Nation", "AEG Presents", "Madison Square Garden", "Coachella", "Corporate Client Inc", "Broadway Productions"]
  const venues = ["Madison Square Garden", "Staples Center", "Red Rocks", "Central Park", "Convention Center", "Downtown Arena"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `production-${i + 1}`,
    name: productions[i % productions.length],
    production_type: productionTypes[i % productionTypes.length],
    description: "Full-scale production project with complete crew and technical requirements",
    client: clients[i % clients.length],
    production_manager: i % 3 === 0 ? "David Williams" : i % 3 === 1 ? "Lisa Park" : "James Taylor",
    phase: phases[i % phases.length],
    status: phases[i % phases.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "David Williams" : i % 3 === 1 ? "Lisa Park" : "James Taylor",
    assignee_name: i % 3 === 0 ? "David Williams" : i % 3 === 1 ? "Lisa Park" : "James Taylor",
    venue: venues[i % venues.length],
    budget: (Math.random() * 500000 + 50000).toFixed(2),
    crew_size: Math.floor(Math.random() * 50) + 10,
    start_date: getRandomPastDate(45),
    end_date: getRandomFutureDate(120),
    due_date: getRandomFutureDate(120),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["production", "live-event", productionTypes[i % productionTypes.length]],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateActivationsData(count: number): DataItem[] {
  const activations = [
    "VIP Lounge Experience",
    "Interactive Art Installation",
    "Brand Activation Booth",
    "Pop-up Stage Setup",
    "Guest Amenity Station",
    "Immersive Photo Experience",
    "Sponsor Showcase Area",
    "Festival Main Stage",
  ]
  const types = ["stage", "installation", "activation", "amenity", "experience"]
  const statuses = ["concept", "design", "approved", "build", "ready", "active", "strike"]
  const designers = ["Alex Martinez", "Sophia Chen", "Marcus Johnson", "Emma Rodriguez"]
  const projectManagers = ["David Kim", "Lisa Park", "James Taylor"]
  const productions = ["Summer Festival 2024", "Corporate Event", "Arena Concert", "Theater Show"]
  const dimensions = ["20x30x12", "15x15x10", "40x50x20", "10x10x8", "25x35x15"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `activation-${i + 1}`,
    name: activations[i % activations.length],
    activation_type: types[i % types.length],
    description: "Experiential activation including design, build, and staffing",
    production: productions[i % productions.length],
    designer: designers[i % designers.length],
    project_manager: projectManagers[i % projectManagers.length],
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: designers[i % designers.length],
    assignee_name: designers[i % designers.length],
    dimensions: dimensions[i % dimensions.length],
    location: i % 2 === 0 ? "Main Venue Floor" : "Outdoor Plaza",
    install_date: getRandomPastDate(20),
    strike_date: getRandomFutureDate(60),
    budget: (Math.random() * 100000 + 10000).toFixed(2),
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(20),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: [types[i % types.length], "experiential"],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generateScheduleData(count: number): DataItem[] {
  const scheduleItems = [
    "Load-In Day 1",
    "Technical Rehearsal",
    "Sound Check",
    "Lighting Programming",
    "Stage Build",
    "Video System Setup",
    "Crew Call",
    "Doors Open",
    "Show Time",
    "Strike/Load-Out",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `schedule-${i + 1}`,
    name: scheduleItems[i % scheduleItems.length],
    description: "Scheduled production activity with crew assignments and timeline",
    status: i % 4 === 0 ? "scheduled" : i % 4 === 1 ? "in_progress" : i % 4 === 2 ? "completed" : "delayed",
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Chris Anderson" : i % 3 === 1 ? "Maya Patel" : "Kevin Lee",
    assignee_name: i % 3 === 0 ? "Chris Anderson" : i % 3 === 1 ? "Maya Patel" : "Kevin Lee",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(5),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["schedule", "timeline"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateTasksData(count: number): DataItem[] {
  const tasks = [
    "Order staging materials",
    "Confirm crew availability",
    "Submit site plan to venue",
    "Schedule tech rehearsal",
    "Finalize lighting plot",
    "Create call sheets",
    "Order catering for crew",
    "Book hotel accommodations",
    "Prepare load-in schedule",
    "Review insurance certificates",
  ]
  const statuses = ["todo", "in_progress", "review", "done"]
  const priorities = ["urgent", "high", "normal", "low"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `task-${i + 1}`,
    name: tasks[i % tasks.length],
    description: "Production task requiring completion and sign-off",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 4 === 0 ? "Rachel Kim" : i % 4 === 1 ? "Tom Wilson" : i % 4 === 2 ? "Nina Gupta" : "Sean O'Brien",
    assignee_name: i % 4 === 0 ? "Rachel Kim" : i % 4 === 1 ? "Tom Wilson" : i % 4 === 2 ? "Nina Gupta" : "Sean O'Brien",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(3),
    created_at: getRandomPastDate(21),
    updated_at: new Date().toISOString(),
    tags: ["task", "action-item"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateMilestonesData(count: number): DataItem[] {
  const milestones = [
    "Design Approval",
    "Venue Contract Signed",
    "Crew Fully Staffed",
    "Load-In Complete",
    "Technical Rehearsal Done",
    "Opening Night",
    "Final Show",
    "Load-Out Complete",
    "Final Reconciliation",
    "Project Closeout",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `milestone-${i + 1}`,
    name: milestones[i % milestones.length],
    description: "Critical project milestone marking key deliverable or phase completion",
    status: i % 3 === 0 ? "pending" : i % 3 === 1 ? "achieved" : "at_risk",
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Jennifer Lee" : i % 3 === 1 ? "Carlos Rodriguez" : "Amanda White",
    assignee_name: i % 3 === 0 ? "Jennifer Lee" : i % 3 === 1 ? "Carlos Rodriguez" : "Amanda White",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["milestone", "critical-path"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateComplianceData(count: number): DataItem[] {
  const complianceItems = [
    "Event Permit Application",
    "Fire Safety Inspection",
    "Electrical Permit",
    "Liquor License",
    "Music Performance License",
    "Building Permit",
    "Health Department Inspection",
    "Noise Ordinance Compliance",
    "Structural Engineering Review",
    "ADA Accessibility Compliance",
  ]
  const types = ["permit", "license", "inspection", "certification", "insurance"]
  const statuses = ["not_started", "pending", "submitted", "approved", "rejected", "expired"]
  const authorities = ["City Planning Dept", "Fire Marshal", "Health Department", "Building Authority", "State Licensing Board"]
  const projects = ["Summer Festival 2024", "Corporate Event", "Arena Concert", "Theater Production"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `compliance-${i + 1}`,
    name: complianceItems[i % complianceItems.length],
    compliance_type: types[i % types.length],
    description: "Required licensing, permitting, or inspection for legal compliance",
    project: projects[i % projects.length],
    issuing_authority: authorities[i % authorities.length],
    status: statuses[i % statuses.length],
    responsible_party: i % 3 === 0 ? "Patricia Moore" : i % 3 === 1 ? "Robert Chen" : "Diana Foster",
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Patricia Moore" : i % 3 === 1 ? "Robert Chen" : "Diana Foster",
    assignee_name: i % 3 === 0 ? "Patricia Moore" : i % 3 === 1 ? "Robert Chen" : "Diana Foster",
    application_date: getRandomPastDate(30),
    due_date: getRandomFutureDate(45),
    expiration_date: getRandomFutureDate(365),
    fee: (Math.random() * 2000 + 100).toFixed(2),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(50),
    updated_at: new Date().toISOString(),
    tags: ["compliance", "legal", types[i % types.length]],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateSafetyData(count: number): DataItem[] {
  const safetyItems = [
    "Rigging Safety Inspection",
    "Emergency Evacuation Plan",
    "First Aid Station Setup",
    "Fire Extinguisher Placement",
    "Electrical Hazard Assessment",
    "Crowd Management Plan",
    "Weather Emergency Procedures",
    "Load-In Safety Briefing",
    "Fall Protection Protocol",
    "Hazardous Materials Handling",
  ]
  const types = ["risk_assessment", "safety_plan", "emergency_procedure", "inspection", "protocol", "training"]
  const riskLevels = ["low", "medium", "high", "critical"]
  const statuses = ["draft", "review", "approved", "implemented"]
  const safetyOfficers = ["Michael Stone", "Linda Martinez", "Eric Thompson", "Sarah Johnson"]
  const projects = ["Summer Festival 2024", "Corporate Event", "Arena Concert", "Theater Production"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `safety-${i + 1}`,
    name: safetyItems[i % safetyItems.length],
    safety_type: types[i % types.length],
    description: "Safety assessment, guideline, or emergency procedure documentation",
    project: projects[i % projects.length],
    risk_level: riskLevels[i % riskLevels.length],
    status: statuses[i % statuses.length],
    safety_officer: safetyOfficers[i % safetyOfficers.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: safetyOfficers[i % safetyOfficers.length],
    assignee_name: safetyOfficers[i % safetyOfficers.length],
    due_date: getRandomFutureDate(20),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["safety", "risk-management", types[i % types.length]],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["todo", "in_progress", "review", "done"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Production Planning",
    "Technical Setup",
    "Crew Coordination",
    "Equipment Logistics",
    "Venue Preparation",
    "Documentation Review",
    "Budget Reconciliation",
    "Final Delivery",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Project item requiring attention and completion",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Team Lead" : i % 3 === 1 ? "Project Manager" : "Production Coordinator",
    assignee_name: i % 3 === 0 ? "Team Lead" : i % 3 === 1 ? "Project Manager" : "Production Coordinator",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["project"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
