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
  const companyNames = [
    "Atlas Productions",
    "Zenith Entertainment",
    "Meridian Staging",
    "Vertex Creative",
    "Horizon Events",
    "Pinnacle Production",
    "Catalyst Media",
    "Summit Technical",
    "Nexus Logistics",
    "Vanguard Entertainment",
    "Phoenix Stage Design",
    "Eclipse Sound & Lighting",
    "Nova Productions",
    "Titan Event Services",
    "Spectrum Creative",
  ]
  const legalSuffixes = ["LLC", "Inc.", "Corp.", "Group", "Solutions"]
  const companyTypes = ["vendor", "client", "partner", "supplier", "contractor"]
  const industries = ["Entertainment", "Event Production", "Technical Services", "Logistics", "Creative Services"]
  const statuses = ["active", "inactive", "suspended"]
  const cities = ["New York", "Los Angeles", "Chicago", "Nashville", "Austin"]
  const states = ["NY", "CA", "IL", "TN", "TX"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `company-${i + 1}`,
    name: companyNames[i % companyNames.length],
    legal_name: `${companyNames[i % companyNames.length]} ${legalSuffixes[i % legalSuffixes.length]}`,
    type: companyTypes[i % companyTypes.length],
    industry: industries[i % industries.length],
    email: `contact@${companyNames[i % companyNames.length].toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    website: `https://www.${companyNames[i % companyNames.length].toLowerCase().replace(/\s+/g, '')}.com`,
    address_line1: `${100 + i * 10} Business Parkway`,
    address_line2: i % 3 === 0 ? `Suite ${200 + i}` : null,
    city: cities[i % cities.length],
    state: states[i % states.length],
    postal_code: `${10000 + Math.floor(Math.random() * 90000)}`,
    country: "US",
    tax_id: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
    payment_terms: ["Net 30", "Net 60", "Net 90", "Due on Receipt"][i % 4],
    currency: "USD",
    status: statuses[i % statuses.length],
    rating: Math.floor(Math.random() * 3) + 3,
    tags: [companyTypes[i % companyTypes.length], industries[i % industries.length].toLowerCase().replace(/\s+/g, '-')],
    created_by: "person-1",
    created_at: getRandomPastDate(500),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 15),
  }))
}

function generateContactsData(count: number): DataItem[] {
  const firstNames = ["Sarah", "Michael", "Jennifer", "David", "Emily", "James", "Lisa", "Robert", "Amanda", "Daniel"]
  const lastNames = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Taylor"]
  const titles = [
    "Production Manager",
    "Technical Director",
    "Account Executive",
    "Creative Director",
    "Operations Lead",
    "Project Coordinator",
    "Business Development Manager",
    "Vendor Relations Specialist",
  ]
  const departments = ["Production", "Sales", "Operations", "Finance", "Creative", "Logistics"]
  const companyIds = ["company-1", "company-2", "company-3", "company-4", "company-5"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `contact-${i + 1}`,
    company_id: companyIds[i % companyIds.length],
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[(i + 3) % lastNames.length],
    title: titles[i % titles.length],
    department: departments[i % departments.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i + 3) % lastNames.length].toLowerCase()}@company${(i % 5) + 1}.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    mobile: i % 2 === 0 ? `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}` : null,
    is_primary: i % 5 === 0,
    notes: `${titles[i % titles.length]} at company. Main point of contact for ${departments[i % departments.length].toLowerCase()} matters.`,
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
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
  const scopeStatuses = ["draft", "submitted", "approved", "in_progress", "completed"]
  const companyIds = ["company-1", "company-2", "company-3", "company-4"]
  const productionIds = ["production-1", "production-2", "production-3"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `sow-${i + 1}`,
    company_id: companyIds[i % companyIds.length],
    production_id: i % 2 === 0 ? productionIds[i % productionIds.length] : null,
    title: scopes[i % scopes.length],
    description: `Detailed scope of work outlining tasks, timelines, resources, and specifications for ${scopes[i % scopes.length]}`,
    deliverables: `Technical design, equipment list, crew manifest, production schedule`,
    timeline: `${Math.floor(Math.random() * 12) + 1} weeks`,
    estimated_cost: parseFloat((Math.random() * 500000 + 50000).toFixed(2)),
    currency: "USD",
    status: scopeStatuses[i % scopeStatuses.length],
    created_by: "person-1",
    approved_by: i % 3 !== 2 ? "person-2" : null,
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
  const companyIds = ["company-1", "company-2", "company-3", "company-4", "company-5"]
  const scopeIds = ["sow-1", "sow-2", "sow-3", "sow-4"]
  const bidStatuses = ["draft", "submitted", "under_review", "accepted", "rejected", "withdrawn"]
  
  return Array.from({ length: count }, (_, i) => {
    const submissionDate = new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000)
    const validUntil = new Date(submissionDate.getTime() + 60 * 24 * 60 * 60 * 1000)
    
    return {
      id: `bid-${i + 1}`,
      scope_of_work_id: scopeIds[i % scopeIds.length],
      company_id: companyIds[i % companyIds.length],
      bid_number: `BID-${String(10000 + i).padStart(6, '0')}`,
      bid_amount: parseFloat((Math.random() * 500000 + 50000).toFixed(2)),
      currency: "USD",
      submission_date: submissionDate.toISOString().split('T')[0],
      valid_until: validUntil.toISOString().split('T')[0],
      status: bidStatuses[i % bidStatuses.length],
      notes: `Comprehensive bid proposal including detailed pricing, timeline, and resource allocation`,
      submitted_by: "person-1",
      reviewed_by: i % 3 !== 2 ? "person-2" : null,
      created_at: submissionDate.toISOString(),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 28),
      attachments_count: Math.floor(Math.random() * 15),
    }
  })
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
