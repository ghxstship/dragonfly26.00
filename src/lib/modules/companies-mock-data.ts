import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateCompaniesMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'organizations':
      return generateOrganizationsData(count)
    case 'contacts':
      return generateContactsData(count)
    case 'deliverables':
      return generateDeliverablesData(count)
    case 'service-agreements':
      return generateServiceAgreementsData(count)
    case 'scopes-of-work':
      return generateScopesOfWorkData(count)
    case 'documents':
      return generateDocumentsData(count)
    case 'bids':
      return generateBidsData(count)
    case 'rfps':
      return generateRFPsData(count)
    default:
      return generateGenericData(count)
  }
}

function generateOrganizationsData(count: number): DataItem[] {
  const companies = [
    "Atlas Productions LLC",
    "Zenith Entertainment Group",
    "Meridian Staging Solutions",
    "Vertex Creative Services",
    "Horizon Events Corporation",
    "Pinnacle Production Partners",
    "Catalyst Media Group",
    "Summit Technical Services",
    "Nexus Logistics Co.",
    "Vanguard Entertainment",
    "Phoenix Stage Design",
    "Eclipse Sound & Lighting",
    "Nova Productions Inc.",
    "Titan Event Services",
    "Spectrum Creative Agency",
  ]
  const companyTypes = ["client", "vendor", "partner", "agency", "supplier"]
  const statuses = ["active", "pending", "on_hold", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `org-${i + 1}`,
    name: companies[i % companies.length],
    description: `${companyTypes[i % companyTypes.length].charAt(0).toUpperCase() + companyTypes[i % companyTypes.length].slice(1)} organization with multiple projects and agreements`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Rachel Green" : i % 4 === 1 ? "Marcus Williams" : i % 4 === 2 ? "Emily Carter" : "David Chen",
    assignee_name: i % 4 === 0 ? "Rachel Green" : i % 4 === 1 ? "Marcus Williams" : i % 4 === 2 ? "Emily Carter" : "David Chen",
    due_date: getRandomFutureDate(180),
    start_date: getRandomPastDate(365),
    created_at: getRandomPastDate(500),
    updated_at: new Date().toISOString(),
    tags: [companyTypes[i % companyTypes.length], "organization"],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generateContactsData(count: number): DataItem[] {
  const roles = [
    "Production Manager",
    "Technical Director",
    "Account Executive",
    "Creative Director",
    "Operations Lead",
    "Project Coordinator",
    "Business Development",
    "Vendor Relations",
    "Contract Manager",
    "Logistics Coordinator",
    "Quality Assurance Lead",
    "Compliance Officer",
  ]
  const companies = [
    "Atlas Productions",
    "Zenith Entertainment",
    "Meridian Staging",
    "Vertex Creative",
    "Horizon Events",
  ]
  const statuses = ["active", "on_leave", "reassigned", "vacant", "filled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    name: `${roles[i % roles.length]} @ ${companies[i % companies.length]}`,
    description: `Role-based contact position that can be filled by different personnel. Currently ${statuses[i % statuses.length]}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 5 === 0 ? "Sarah Mitchell" : i % 5 === 1 ? "Alex Turner" : i % 5 === 2 ? "Jordan Lee" : i % 5 === 3 ? "Maya Rodriguez" : "Chris Anderson",
    assignee_name: i % 5 === 0 ? "Sarah Mitchell" : i % 5 === 1 ? "Alex Turner" : i % 5 === 2 ? "Jordan Lee" : i % 5 === 3 ? "Maya Rodriguez" : "Chris Anderson",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(180),
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["contact", "role", companies[i % companies.length].toLowerCase().split(' ')[0]],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateDeliverablesData(count: number): DataItem[] {
  const deliverables = [
    "Stage Design Renderings",
    "Technical Specifications Package",
    "Lighting Plot & Schedule",
    "Audio System Design",
    "Video Content Production",
    "Marketing Assets Package",
    "Event Logistics Plan",
    "Safety & Compliance Documentation",
    "Post-Production Report",
    "Final As-Built Drawings",
    "Equipment Manifest",
    "Crew Training Materials",
    "Client Presentation Deck",
    "Budget Reconciliation",
    "Show Archive Package",
  ]
  const deliverableStatuses = ["not_started", "in_progress", "review", "approved", "delivered", "revision_needed"]
  const companies = ["Atlas Productions", "Zenith Entertainment", "Meridian Staging", "Vertex Creative"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `deliverable-${i + 1}`,
    name: `${deliverables[i % deliverables.length]} - ${companies[i % companies.length]}`,
    description: `Project deliverable with specific milestones, review cycles, and acceptance criteria`,
    status: deliverableStatuses[i % deliverableStatuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Victoria Santos" : i % 3 === 1 ? "Daniel Kim" : "Ashley Cooper",
    assignee_name: i % 3 === 0 ? "Victoria Santos" : i % 3 === 1 ? "Daniel Kim" : "Ashley Cooper",
    due_date: getRandomFutureDate(60),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["deliverable", "milestone", deliverableStatuses[i % deliverableStatuses.length]],
    comments_count: Math.floor(Math.random() * 22),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateServiceAgreementsData(count: number): DataItem[] {
  const agreements = [
    "Master Service Agreement - Production Services",
    "SLA - Technical Support & Maintenance",
    "Equipment Rental Agreement",
    "Creative Services Contract",
    "Venue Services Agreement",
    "Talent Management Agreement",
    "Logistics & Transportation SLA",
    "Post-Production Services Contract",
    "Marketing & Promotion Agreement",
    "Insurance & Risk Management SLA",
  ]
  const agreementStatuses = ["draft", "negotiation", "legal_review", "active", "renewal_pending", "expired"]
  const companies = [
    "Atlas Productions LLC",
    "Zenith Entertainment Group",
    "Meridian Staging Solutions",
    "Vertex Creative Services",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sla-${i + 1}`,
    name: `${agreements[i % agreements.length]} - ${companies[i % companies.length]}`,
    description: `Service level agreement defining scope, terms, performance metrics, and obligations`,
    status: agreementStatuses[i % agreementStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Tom Anderson" : i % 3 === 1 ? "Rebecca Lee" : "James Wilson",
    assignee_name: i % 3 === 0 ? "Tom Anderson" : i % 3 === 1 ? "Rebecca Lee" : "James Wilson",
    due_date: getRandomFutureDate(365),
    start_date: getRandomPastDate(180),
    created_at: getRandomPastDate(270),
    updated_at: new Date().toISOString(),
    tags: ["sla", "contract", "agreement"],
    comments_count: Math.floor(Math.random() * 30),
    attachments_count: Math.floor(Math.random() * 18),
  }))
}

function generateScopesOfWorkData(count: number): DataItem[] {
  const scopes = [
    "Arena Concert Production - Full Technical Package",
    "Corporate Event Staging & AV",
    "Festival Main Stage Build & Operation",
    "Theatre Renovation & Upgrade",
    "Brand Activation Installation",
    "Touring Production Technical Services",
    "Studio Build-Out & Equipment",
    "Outdoor Event Infrastructure",
    "Awards Show Production",
    "Conference & Trade Show Services",
    "Museum Exhibition Design & Installation",
    "Sports Venue LED Installation",
  ]
  const scopeStatuses = ["planning", "approved", "in_progress", "on_hold", "completed", "change_order"]
  const companies = ["Atlas Productions", "Zenith Entertainment", "Meridian Staging", "Vertex Creative"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sow-${i + 1}`,
    name: `${scopes[i % scopes.length]} - ${companies[i % companies.length]}`,
    description: `Detailed scope of work outlining tasks, timelines, resources, and specifications`,
    status: scopeStatuses[i % scopeStatuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 4 === 0 ? "Megan Brown" : i % 4 === 1 ? "Lucas Martinez" : i % 4 === 2 ? "Olivia Taylor" : "Nina Patel",
    assignee_name: i % 4 === 0 ? "Megan Brown" : i % 4 === 1 ? "Lucas Martinez" : i % 4 === 2 ? "Olivia Taylor" : "Nina Patel",
    due_date: getRandomFutureDate(180),
    start_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["sow", "project", scopeStatuses[i % scopeStatuses.length]],
    comments_count: Math.floor(Math.random() * 35),
    attachments_count: Math.floor(Math.random() * 25),
  }))
}

function generateDocumentsData(count: number): DataItem[] {
  const documents = [
    "Certificate of Insurance - General Liability",
    "Certificate of Insurance - Workers Comp",
    "Business License & Registration",
    "Safety Certification - OSHA",
    "Equipment Certifications",
    "Project Proposal - Summer Festival",
    "Project Proposal - Corporate Launch Event",
    "W-9 Tax Form",
    "NDA - Confidentiality Agreement",
    "Vendor Application & References",
    "Insurance Declaration Page",
    "Bonding Certificate",
    "Professional Liability Insurance",
    "Technical Credentials - ETCP",
  ]
  const docTypes = ["insurance", "certification", "proposal", "compliance", "tax_document"]
  const docStatuses = ["current", "pending", "expired", "renewal_needed", "under_review"]
  const companies = [
    "Atlas Productions",
    "Zenith Entertainment",
    "Meridian Staging",
    "Vertex Creative",
    "Horizon Events",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `doc-${i + 1}`,
    name: `${documents[i % documents.length]} - ${companies[i % companies.length]}`,
    description: `Company document: ${docTypes[i % docTypes.length].replace('_', ' ')} with expiration tracking and compliance monitoring`,
    status: docStatuses[i % docStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Hannah Lee" : i % 3 === 1 ? "Ryan Clark" : "Isabella White",
    assignee_name: i % 3 === 0 ? "Hannah Lee" : i % 3 === 1 ? "Ryan Clark" : "Isabella White",
    due_date: getRandomFutureDate(365),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: [docTypes[i % docTypes.length], "document", docStatuses[i % docStatuses.length]],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateBidsData(count: number): DataItem[] {
  const projects = [
    "Summer Music Festival 2024",
    "Corporate Annual Gala",
    "Stadium Concert Series",
    "Trade Show Booth Design",
    "Product Launch Event",
    "Awards Show Production",
    "Conference Technical Services",
    "Theatre Season Rental Package",
    "Outdoor Festival Infrastructure",
    "Brand Activation Tour",
  ]
  const bidStatuses = ["draft", "submitted", "under_review", "shortlisted", "awarded", "declined", "withdrawn"]
  const companies = [
    "Atlas Productions LLC",
    "Zenith Entertainment Group",
    "Meridian Staging Solutions",
    "Vertex Creative Services",
    "Horizon Events Corporation",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `bid-${i + 1}`,
    name: `Bid #${(10000 + i).toString()} - ${projects[i % projects.length]}`,
    description: `Company bid from ${companies[i % companies.length]} with pricing, timeline, and proposed solution`,
    status: bidStatuses[i % bidStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Carlos Rodriguez" : i % 4 === 1 ? "Emma Johnson" : i % 4 === 2 ? "Nathan Gray" : "Patrick O'Brien",
    assignee_name: i % 4 === 0 ? "Carlos Rodriguez" : i % 4 === 1 ? "Emma Johnson" : i % 4 === 2 ? "Nathan Gray" : "Patrick O'Brien",
    due_date: getRandomFutureDate(45),
    start_date: getRandomPastDate(14),
    created_at: getRandomPastDate(21),
    updated_at: new Date().toISOString(),
    tags: ["bid", "quote", companies[i % companies.length].toLowerCase().split(' ')[0]],
    comments_count: Math.floor(Math.random() * 28),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generateRFPsData(count: number): DataItem[] {
  const rfps = [
    "RFP - Annual Festival Production Services",
    "RFP - Touring Production Equipment & Crew",
    "RFP - Venue Technical Upgrade",
    "RFP - Corporate Events Calendar 2024",
    "RFP - Stadium LED Screen Installation",
    "RFP - Multi-City Brand Activation Tour",
    "RFP - Theatre Season Technical Support",
    "RFP - Conference & Trade Show Services",
    "RFP - Video Production & Post Services",
    "RFP - Permanent Installation Design & Build",
    "RFP - Awards Show Production Package",
    "RFP - Festival Logistics & Infrastructure",
  ]
  const rfpStatuses = ["planning", "published", "accepting_bids", "evaluation", "finalist_selection", "awarded", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `rfp-${i + 1}`,
    name: `${rfps[i % rfps.length]} - ${new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).getFullYear()}`,
    description: `Request for proposal with requirements, evaluation criteria, and submission deadline. ${Math.floor(Math.random() * 12) + 3} vendors invited`,
    status: rfpStatuses[i % rfpStatuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 4 === 0 ? "Jennifer White" : i % 4 === 1 ? "Michael Chen" : i % 4 === 2 ? "Laura Martinez" : "Brian Foster",
    assignee_name: i % 4 === 0 ? "Jennifer White" : i % 4 === 1 ? "Michael Chen" : i % 4 === 2 ? "Laura Martinez" : "Brian Foster",
    due_date: getRandomFutureDate(90),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["rfp", "procurement", rfpStatuses[i % rfpStatuses.length]],
    comments_count: Math.floor(Math.random() * 40),
    attachments_count: Math.floor(Math.random() * 20),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "review", "completed"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Company Review",
    "Vendor Evaluation",
    "Contract Renewal",
    "Partnership Discussion",
    "Compliance Check",
    "Performance Review",
    "Document Update",
    "Relationship Management",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Company-related item requiring attention and follow-up",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Account Manager" : i % 3 === 1 ? "Vendor Relations" : "Contract Manager",
    assignee_name: i % 3 === 0 ? "Account Manager" : i % 3 === 1 ? "Vendor Relations" : "Contract Manager",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(15),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["company"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}
