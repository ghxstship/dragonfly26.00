import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateResourcesMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'library':
      return generateLibraryData(count)
    case 'guides':
      return generateGuidesData(count)
    case 'courses':
      return generateCoursesData(count)
    case 'trainings':
      return generateTrainingsData(count)
    case 'grants':
      return generateGrantsData(count)
    case 'publications':
      return generatePublicationsData(count)
    case 'glossary':
      return generateGlossaryData(count)
    case 'troubleshooting':
      return generateTroubleshootingData(count)
    default:
      return generateGenericData(count)
  }
}

function generateLibraryData(count: number): DataItem[] {
  const resourceTypes = [
    "Production Planning Template",
    "Safety Protocol Guide",
    "Equipment Setup Checklist",
    "Budget Management Workbook",
    "Crew Onboarding Manual",
    "Technical Specification Template",
    "Show Schedule Template",
    "Venue Assessment Checklist",
    "Risk Management Guide",
    "Communication Protocol",
    "Contract Template - Vendor",
    "Insurance Requirements Guide",
    "Travel Logistics Planner",
    "Post-Production Checklist",
    "Marketing Kit Template",
  ]
  const categories = ["template", "guide", "checklist", "manual", "workbook"]
  const statuses = ["published", "draft", "under_review", "updated"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `resource-${i + 1}`,
    name: resourceTypes[i % resourceTypes.length],
    description: "Comprehensive resource with downloadable files, examples, and best practice recommendations",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "high" : i % 4 === 1 ? "normal" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Resource Manager - Sarah Mitchell" : i % 4 === 1 ? "Content Lead - Alex Turner" : i % 4 === 2 ? "Documentation - Jordan Lee" : "Training Director - Morgan Blake",
    assignee_name: i % 4 === 0 ? "Sarah Mitchell" : i % 4 === 1 ? "Alex Turner" : i % 4 === 2 ? "Jordan Lee" : "Morgan Blake",
    due_date: getRandomFutureDate(180),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["resource", categories[i % categories.length], "documentation"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8) + 1,
  }))
}

function generateGuidesData(count: number): DataItem[] {
  const guides = [
    "Getting Started with Production Management",
    "Stage Rigging Best Practices",
    "Audio Engineering Fundamentals",
    "Lighting Design Step-by-Step",
    "Tour Logistics Planning Guide",
    "Venue Selection & Booking Guide",
    "Budget Creation & Tracking",
    "Crew Management Essentials",
    "Safety Protocols & Procedures",
    "Equipment Maintenance Guide",
    "Contract Negotiation Tips",
    "Event Marketing Strategy",
    "Technical Rider Creation",
    "Show Scheduling Best Practices",
    "Emergency Response Planning",
  ]
  const difficulty = ["beginner", "intermediate", "advanced", "expert"]
  const statuses = ["published", "updated", "under_review"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `guide-${i + 1}`,
    name: guides[i % guides.length],
    description: `${difficulty[i % difficulty.length].charAt(0).toUpperCase() + difficulty[i % difficulty.length].slice(1)}-level guide with detailed instructions, visuals, and practical examples`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Guide Author - Maya Rodriguez" : i % 3 === 1 ? "Technical Writer - Chris Anderson" : "Industry Expert - Taylor Kim",
    assignee_name: i % 3 === 0 ? "Maya Rodriguez" : i % 3 === 1 ? "Chris Anderson" : "Taylor Kim",
    due_date: getRandomFutureDate(120),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["guide", "tutorial", difficulty[i % difficulty.length]],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 12) + 2,
  }))
}

function generateCoursesData(count: number): DataItem[] {
  const courses = [
    "Production Management Certification Program",
    "Technical Theater Fundamentals",
    "Live Event Audio Engineering",
    "Stage Lighting Design & Programming",
    "Tour Management Professional Course",
    "Concert Rigging & Safety",
    "Event Production Planning",
    "Venue Operations Management",
    "Festival Production Intensive",
    "Music Business Essentials",
    "Stage Management Bootcamp",
    "Video Production for Live Events",
    "Budgeting & Financial Management",
    "Crew Leadership Training",
    "Advanced Show Calling",
  ]
  const courseTypes = ["certification", "bootcamp", "intensive", "professional", "fundamentals"]
  const statuses = ["enrolling", "in_progress", "completed", "upcoming"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `course-${i + 1}`,
    name: `${courses[i % courses.length]} - ${["Spring", "Summer", "Fall", "Winter"][i % 4]} 2024`,
    description: `Multi-week course with lectures, assignments, and certification. Duration: ${Math.floor(Math.random() * 8) + 4} weeks`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Course Director - David Chen" : i % 4 === 1 ? "Instructor - Lisa Morgan" : i % 4 === 2 ? "Program Lead - Kevin Foster" : "Education Manager - Rachel Green",
    assignee_name: i % 4 === 0 ? "David Chen" : i % 4 === 1 ? "Lisa Morgan" : i % 4 === 2 ? "Kevin Foster" : "Rachel Green",
    due_date: getRandomFutureDate(90),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["course", courseTypes[i % courseTypes.length], "education"],
    comments_count: Math.floor(Math.random() * 35),
    attachments_count: Math.floor(Math.random() * 20) + 5,
  }))
}

function generateTrainingsData(count: number): DataItem[] {
  const trainings = [
    "Safety & Rigging Certification Workshop",
    "Emergency Response Protocol Training",
    "Equipment Operation Bootcamp",
    "Software Platform Training - Production Management",
    "Conflict Resolution & Communication",
    "Diversity & Inclusion in Production",
    "Mental Health First Aid",
    "Fire Safety & Prevention",
    "Electrical Safety Certification",
    "Fall Protection & Harness Training",
    "Hazmat Handling & Disposal",
    "First Aid & CPR Certification",
    "Forklift & Heavy Equipment Operation",
    "Cybersecurity Awareness",
    "Leadership Development Workshop",
  ]
  const trainingTypes = ["certification", "workshop", "bootcamp", "refresher", "compliance"]
  const statuses = ["scheduled", "in_progress", "completed", "registration_open", "waitlist"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `training-${i + 1}`,
    name: `${trainings[i % trainings.length]} - ${new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    description: `${trainingTypes[i % trainingTypes.length].charAt(0).toUpperCase() + trainingTypes[i % trainingTypes.length].slice(1)} training session - ${Math.floor(Math.random() * 16) + 4} hours | Max ${Math.floor(Math.random() * 20) + 10} attendees`,
    status: statuses[i % statuses.length],
    priority: i % 2 === 0 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Training Coordinator - Marcus Williams" : i % 4 === 1 ? "Safety Officer - Emily Carter" : i % 4 === 2 ? "HR Lead - Nina Patel" : "Compliance Manager - Oscar Martinez",
    assignee_name: i % 4 === 0 ? "Marcus Williams" : i % 4 === 1 ? "Emily Carter" : i % 4 === 2 ? "Nina Patel" : "Oscar Martinez",
    due_date: getRandomFutureDate(60),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["training", trainingTypes[i % trainingTypes.length], "professional-development"],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateGrantsData(count: number): DataItem[] {
  const grants = [
    "National Endowment for the Arts - Production Grant",
    "State Arts Council - Festival Support",
    "Creative Industries Fund - Innovation Grant",
    "Community Arts Development Grant",
    "Technical Equipment Upgrade Grant",
    "Diversity & Inclusion Initiative Funding",
    "Emerging Artists Support Program",
    "Regional Theater Development Grant",
    "Youth Education & Outreach Funding",
    "Cultural Heritage Preservation Grant",
    "Environmental Sustainability Grant",
    "Digital Innovation in Arts Grant",
    "Accessibility Enhancement Funding",
    "International Touring Support Grant",
    "Small Business Arts Grant",
  ]
  const grantTypes = ["federal", "state", "local", "private", "foundation"]
  const statuses = ["open", "deadline_approaching", "closed", "awarded", "pending_review"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `grant-${i + 1}`,
    name: `${grants[i % grants.length]} - $${(Math.floor(Math.random() * 50) + 5) * 1000}`,
    description: `${grantTypes[i % grantTypes.length].charAt(0).toUpperCase() + grantTypes[i % grantTypes.length].slice(1)} grant opportunity with application requirements, eligibility criteria, and submission guidelines`,
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Grants Manager - Sophie Zhang" : i % 3 === 1 ? "Development Director - Tom Anderson" : "Program Officer - Rebecca Lee",
    assignee_name: i % 3 === 0 ? "Sophie Zhang" : i % 3 === 1 ? "Tom Anderson" : "Rebecca Lee",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["grant", "funding", grantTypes[i % grantTypes.length]],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 10) + 3,
  }))
}

function generatePublicationsData(count: number): DataItem[] {
  const publications = [
    "Production Management Quarterly - Spring 2024",
    "Technical Theater Journal - Latest Issue",
    "Live Events Industry Report - Annual",
    "Stage Safety Standards & Guidelines",
    "Audio Engineering Best Practices Whitepaper",
    "Lighting Design Trends & Innovations",
    "Festival Production Case Study Collection",
    "Tour Management Research Paper",
    "Venue Operations Handbook",
    "Event Technology Survey Results",
    "Sustainability in Live Events Report",
    "Crew Wellbeing & Mental Health Study",
    "Industry Salary & Compensation Guide",
    "Production Budget Benchmarking Report",
    "Emerging Technologies in Live Entertainment",
  ]
  const publicationTypes = ["journal", "magazine", "whitepaper", "report", "study", "handbook"]
  const statuses = ["published", "peer_review", "draft", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `publication-${i + 1}`,
    name: publications[i % publications.length],
    description: `${publicationTypes[i % publicationTypes.length].charAt(0).toUpperCase() + publicationTypes[i % publicationTypes.length].slice(1)} with research findings, industry insights, and expert analysis - ${Math.floor(Math.random() * 80) + 20} pages`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Editor - James Wilson" : i % 4 === 1 ? "Research Lead - Victoria Santos" : i % 4 === 2 ? "Content Manager - Daniel Kim" : "Publications Director - Ashley Cooper",
    assignee_name: i % 4 === 0 ? "James Wilson" : i % 4 === 1 ? "Victoria Santos" : i % 4 === 2 ? "Daniel Kim" : "Ashley Cooper",
    due_date: getRandomFutureDate(120),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: ["publication", publicationTypes[i % publicationTypes.length], "research"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 6) + 1,
  }))
}

function generateGlossaryData(count: number): DataItem[] {
  const terms = [
    "Load-In",
    "Load-Out",
    "Call Time",
    "Strike",
    "Green Room",
    "Rider",
    "Tech Rider",
    "Hospitality Rider",
    "Run of Show (ROS)",
    "Cue Sheet",
    "FOH (Front of House)",
    "Backline",
    "Patch",
    "Truss",
    "Upstage/Downstage",
    "Stage Left/Stage Right",
    "Hot Patch",
    "DMX",
    "Dimmer",
    "Gaffer",
    "Grip",
    "PA System",
    "Monitor Mix",
    "Sound Check",
    "Line Check",
    "Per Diem",
    "Settlement",
    "Box Office",
    "Comp Tickets",
    "Kill Fee",
    "Force Majeure",
    "Advance",
    "Walk-Through",
    "Site Survey",
    "Production Hold",
  ]
  const categories = ["production", "technical", "audio", "lighting", "stage", "business", "general"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `term-${i + 1}`,
    name: terms[i % terms.length],
    description: `Industry terminology definition with usage examples, context, and related terms. Category: ${categories[i % categories.length].charAt(0).toUpperCase() + categories[i % categories.length].slice(1)}`,
    status: i % 5 === 0 ? "verified" : i % 5 === 1 ? "published" : i % 5 === 2 ? "under_review" : i % 5 === 3 ? "needs_update" : "verified",
    priority: i % 3 === 0 ? "normal" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Glossary Editor - Megan Brown" : i % 3 === 1 ? "Technical Reviewer - Lucas Martinez" : "Content Curator - Olivia Taylor",
    assignee_name: i % 3 === 0 ? "Megan Brown" : i % 3 === 1 ? "Lucas Martinez" : "Olivia Taylor",
    due_date: getRandomFutureDate(365),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: ["glossary", "terminology", categories[i % categories.length]],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateTroubleshootingData(count: number): DataItem[] {
  const issues = [
    "Audio Feedback During Performance",
    "Lighting Console Not Responding",
    "Video Projection Flickering",
    "Wireless Microphone Dropouts",
    "Stage Automation Malfunction",
    "Power Distribution Issues",
    "Network Connectivity Problems",
    "Rigging Motor Failure",
    "Fog Machine Not Working",
    "DMX Signal Loss",
    "Monitor Mix Imbalance",
    "LED Wall Color Calibration",
    "Timecode Sync Issues",
    "Intercom System Failure",
    "Truss Alignment Problems",
    "Cable Management Best Practices",
    "Speaker Protection Mode Triggered",
    "Lighting Fixture Overheating",
    "Backup Generator Won't Start",
    "HVAC System Interference",
  ]
  const severities = ["critical", "high", "medium", "low"]
  const statuses = ["active", "resolved", "verified", "needs_update"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `troubleshoot-${i + 1}`,
    name: `${issues[i % issues.length]} - ${severities[i % severities.length].toUpperCase()}`,
    description: "Common issue with step-by-step troubleshooting guide, root causes, solutions, and prevention tips",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Technical Support - Hannah Lee" : i % 4 === 1 ? "Systems Engineer - Ryan Clark" : i % 4 === 2 ? "Field Technician - Isabella White" : "Support Lead - Carlos Rodriguez",
    assignee_name: i % 4 === 0 ? "Hannah Lee" : i % 4 === 1 ? "Ryan Clark" : i % 4 === 2 ? "Isabella White" : "Carlos Rodriguez",
    due_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["troubleshooting", severities[i % severities.length], "technical"],
    comments_count: Math.floor(Math.random() * 25),
    attachments_count: Math.floor(Math.random() * 10) + 2,
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["published", "draft", "under_review", "archived"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Production Resource",
    "Training Material",
    "Reference Document",
    "Educational Content",
    "Industry Guide",
    "Technical Manual",
    "Best Practice Document",
    "Knowledge Base Article",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `resource-item-${i + 1}`,
    name: `${names[i % names.length]} ${i + 1}`,
    description: "Resource item with helpful information and guidance for production professionals",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Resource Team" : i % 3 === 1 ? "Content Manager" : "Documentation Lead",
    assignee_name: i % 3 === 0 ? "Resource Team" : i % 3 === 1 ? "Content Manager" : "Documentation Lead",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["resource"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
