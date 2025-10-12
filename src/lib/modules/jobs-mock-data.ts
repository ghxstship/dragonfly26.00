import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateJobsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'active':
      return generateActiveData(count)
    case 'pipeline':
      return generatePipelineData(count)
    case 'offers':
      return generateOffersData(count)
    case 'shortlists':
      return generateShortlistsData(count)
    case 'rfps':
      return generateRFPsData(count)
    case 'completed':
      return generateCompletedData(count)
    case 'archived':
      return generateArchivedData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const scopeTypes = ["Lighting Design", "Audio Services", "Stage Rental", "Rigging Services", "Video Production", "Waste Management"]
  const statuses = ["active", "pipeline", "offered", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-overview-${i + 1}`,
    name: `${scopeTypes[i % scopeTypes.length]} - Overview Metric ${i + 1}`,
    description: "Scope of work overview dashboard metric and summary",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: "Production Manager",
    assignee_name: "Production Manager",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["overview", scopeTypes[i % scopeTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateActiveData(count: number): DataItem[] {
  const activeScopes = [
    "Lighting Design & Installation - Broadway Revival",
    "Full Audio Package & Engineering - Arena Tour 2024",
    "Stage Rigging & Truss System - Music Festival",
    "Video Wall Rental & Operation - Corporate Conference",
    "Waste Management & Sustainability - Festival Season",
    "LED Screen Package & Tech Support - Concert Series",
    "Scenic Fabrication & Installation - Theater Production",
    "Power Distribution & Generator Services - Stadium Show",
    "Catering Services - Multi-Week Residency",
    "Transportation & Logistics - Touring Production",
  ]
  const clients = ["Live Nation", "AEG Presents", "Madison Square Garden", "Coachella Music Festival", "SXSW", "Art Basel Miami", "Bonnaroo", "Electric Daisy Carnival"]
  const statuses = ["in_progress", "installation", "operational", "active"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-active-${i + 1}`,
    name: activeScopes[i % activeScopes.length],
    description: `Active contract with ${clients[i % clients.length]} - Scope currently in execution`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: "Project Lead",
    assignee_name: "Project Lead",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["active", "contracted", clients[i % clients.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generatePipelineData(count: number): DataItem[] {
  const pipelineScopes = [
    "Lighting Package Rental - Summer Festival Circuit",
    "Event Production Services - Corporate Event Series",
    "Automated Rigging System - Theme Park Installation",
    "Console & Dimmer Package - Theatrical Tour",
    "Audio System Design & Installation - Museum Exhibit",
    "Broadcast Video Services - Live Event Coverage",
    "Rigging Engineering & Installation - Arena Concert",
    "Followspot Package Rental - Opera Season",
    "AV System Integration - Convention Center Upgrade",
    "Production Management Services - Film Premiere",
  ]
  const pipelineStages = ["proposal_submitted", "under_review", "negotiating", "pending_contract", "awaiting_start"]
  const clients = ["Spectrum Productions", "Blackout Design", "Solotech", "VER", "PSAV", "Freeman", "Encore", "ShowPro"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-pipeline-${i + 1}`,
    name: pipelineScopes[i % pipelineScopes.length],
    description: `Scope proposal for ${clients[i % clients.length]} - In ${pipelineStages[i % pipelineStages.length].replace(/_/g, ' ')} stage`,
    status: pipelineStages[i % pipelineStages.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: "Business Development",
    assignee_name: "Business Development",
    due_date: getRandomFutureDate(120),
    start_date: getRandomFutureDate(60),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["pipeline", "negotiation", clients[i % clients.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateOffersData(count: number): DataItem[] {
  const offerScopes = [
    "Touring Lighting Package - National Headliner Tour",
    "Full Production Audio - Vegas Residency Show",
    "Lighting & Rigging Services - Cruise Ship Contract",
    "Set Design & Fabrication - Fashion Week NYC",
    "Video Production & Graphics - Sports Broadcast Season",
    "Lighting Design Services - Awards Ceremony",
    "AV System Engineering - Convention Center Install",
    "Technical Production Management - Broadway Show",
    "Electrical Distribution & Power - Theme Park Expansion",
    "FOH Audio Mix Services - Festival Season Package",
  ]
  const offerStatuses = ["offer_received", "reviewing_terms", "counter_offered", "pending_acceptance", "awaiting_signature"]
  const contractValues = ["$45K", "$125K", "$65K", "$95K", "$180K", "$85K", "$210K", "$150K"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-offer-${i + 1}`,
    name: offerScopes[i % offerScopes.length],
    description: `Contract offer valued at ${contractValues[i % contractValues.length]} - ${offerStatuses[i % offerStatuses.length].replace(/_/g, ' ')}`,
    status: offerStatuses[i % offerStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: "Contracts Team",
    assignee_name: "Contracts Team",
    due_date: getRandomFutureDate(14),
    start_date: getRandomFutureDate(45),
    created_at: getRandomPastDate(7),
    updated_at: new Date().toISOString(),
    tags: ["offer", "contract", contractValues[i % contractValues.length].includes('K') ? 'high-value' : 'standard'],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateShortlistsData(count: number): DataItem[] {
  const shortlistScopes = [
    "Lighting Services Package - Music Festival 2024",
    "Audio Engineering & Mix - Theater Production Run",
    "Video Projection Equipment - Art Installation Project",
    "Staging & Truss Rental - Convention Setup",
    "Cable & Power Distribution - Corporate Event",
    "Spotlight Package Rental - Ballet Season",
    "Audio System Installation - House of Worship",
    "Dimming & Control Systems - Trade Show Package",
    "LED Wall Rental & Support - Concert Tour",
    "Stage Electrical Services - Touring Show Support",
  ]
  const shortlistStatuses = ["shortlisted", "pitch_scheduled", "site_visit", "final_vendor", "awaiting_decision"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-shortlist-${i + 1}`,
    name: shortlistScopes[i % shortlistScopes.length],
    description: `Shortlisted bid opportunity - ${shortlistStatuses[i % shortlistStatuses.length].replace(/_/g, ' ')} phase`,
    status: shortlistStatuses[i % shortlistStatuses.length],
    priority: i % 4 === 0 ? "high" : i % 4 === 1 ? "normal" : i % 4 === 2 ? "low" : "normal",
    assignee: "Sales Team",
    assignee_name: "Sales Team",
    due_date: getRandomFutureDate(30),
    start_date: getRandomFutureDate(60),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: ["shortlist", "finalist", shortlistStatuses[i % shortlistStatuses.length]],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateRFPsData(count: number): DataItem[] {
  const rfpScopes = [
    "RFP: Lighting Design & Installation - Annual Conference",
    "RFP: Full Audio Production Services - Multi-Day Festival",
    "RFP: Technical Production Management - Theater Season",
    "RFP: Complete Production Services - Product Launch Event",
    "RFP: Video Production & LED Walls - Concert Series",
    "RFP: Rigging Engineering & Truss - Exhibition Setup",
    "RFP: Sound System Design & Installation - Permanent Install",
    "RFP: Touring Lighting Package - National Tour Support",
    "RFP: AV System Integration - Corporate Campus Upgrade",
    "RFP: Production Management & Staffing - Event Series",
  ]
  const rfpStatuses = ["open", "preparing_bid", "submitted", "under_review", "finalist", "declined"]
  const budgetRanges = ["$15K-25K", "$30K-50K", "$50K-75K", "$75K-100K", "$100K-150K", "$200K-300K", "$20K-35K"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-rfp-${i + 1}`,
    name: rfpScopes[i % rfpScopes.length],
    description: `Budget range: ${budgetRanges[i % budgetRanges.length]} - Proposal deadline: ${new Date(Date.now() + (7 + i % 14) * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    status: rfpStatuses[i % rfpStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: "Bid Team",
    assignee_name: "Bid Team",
    due_date: getRandomFutureDate(21),
    start_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["rfp", "bidding", budgetRanges[i % budgetRanges.length].includes('100K') || budgetRanges[i % budgetRanges.length].includes('200K') ? 'high-value' : 'standard'],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateCompletedData(count: number): DataItem[] {
  const completedScopes = [
    "Lighting Package & Services - Corporate Gala 2023",
    "Audio Production Services - Concert Series Fall",
    "Video Engineering & Graphics - Awards Show",
    "Rigging Services - Festival Load-In/Out",
    "Production Staffing & Management - Theater Run",
    "AV Equipment & Tech Support - Conference Week",
    "Staging & Labor Services - Trade Show Install",
    "Audio Engineering Services - Symphony Season",
    "LED Wall Rental & Operation - New Year's Eve Special",
    "Lighting Design & Programming - Fashion Show",
  ]
  const completionStatuses = ["completed", "invoiced", "payment_received", "reviewed", "closed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-completed-${i + 1}`,
    name: completedScopes[i % completedScopes.length],
    description: `Successfully completed scope - ${completionStatuses[i % completionStatuses.length].replace(/_/g, ' ')}`,
    status: completionStatuses[i % completionStatuses.length],
    priority: "normal",
    assignee: "Project Manager",
    assignee_name: "Project Manager",
    due_date: getRandomPastDate(90),
    start_date: getRandomPastDate(120),
    created_at: getRandomPastDate(150),
    updated_at: new Date().toISOString(),
    tags: ["completed", "paid", "finished"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateArchivedData(count: number): DataItem[] {
  const archivedScopes = [
    "Cancelled: Lighting Services - Summer Tour Package",
    "Terminated: AV Technical Support - Venue Contract",
    "Reconciled: Production Services - Festival 2023",
    "Declined: Audio Production - Corporate Event Series",
    "Withdrawn: Rigging Services - Theme Park Installation",
    "Completed & Settled: Full Production - Broadway Show",
    "Cancelled by Client: Event Services - Product Launch",
    "Contract Not Renewed: Stage Rental - Theater Season",
    "Completed: Production Management - Multi-Week Residency",
    "Terminated Early: Touring Support - National Tour",
  ]
  const archiveReasons = ["cancelled", "terminated", "declined", "withdrawn", "not_renewed", "fully_reconciled", "client_cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-archived-${i + 1}`,
    name: archivedScopes[i % archivedScopes.length],
    description: `Archived scope - Reason: ${archiveReasons[i % archiveReasons.length].replace(/_/g, ' ')} - All reconciliations and payments settled`,
    status: archiveReasons[i % archiveReasons.length],
    priority: "low",
    assignee: "Archive Admin",
    assignee_name: "Archive Admin",
    due_date: getRandomPastDate(180),
    start_date: getRandomPastDate(240),
    created_at: getRandomPastDate(300),
    updated_at: new Date().toISOString(),
    tags: ["archived", archiveReasons[i % archiveReasons.length], "historical"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "review", "completed"]
  const priorities = ["urgent", "high", "normal", "low"]
  const scopeNames = [
    "Lighting Services Package",
    "Audio Equipment Rental",
    "Production Services Contract",
    "Stage Rigging & Installation",
    "Video Production Services",
    "Transportation & Logistics",
    "Event Staffing Services",
    "Technical Support Package",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `job-generic-${i + 1}`,
    name: scopeNames[i % scopeNames.length],
    description: "Scope of work opportunity for production services",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: "Operations Team",
    assignee_name: "Operations Team",
    due_date: getRandomFutureDate(60),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["scope", "contractor-services"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
