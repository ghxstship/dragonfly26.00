import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateFilesMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'all-files':
      return generateAllFilesData(count)
    case 'contracts':
      return generateContractsData(count)
    case 'certificates':
      return generateCertificatesData(count)
    case 'drawings':
      return generateDrawingsData(count)
    case 'call-sheets':
      return generateCallSheetsData(count)
    case 'riders':
      return generateRidersData(count)
    case 'brand-assets':
      return generateBrandAssetsData(count)
    case 'media':
      return generateMediaData(count)
    case 'templates':
      return generateTemplatesData(count)
    case 'reports':
      return generateReportsData(count)
    case 'archived':
      return generateArchivedData(count)
    default:
      return generateGenericFilesData(count)
  }
}

function generateAllFilesData(count: number): DataItem[] {
  const fileTypes = ["Contract", "Certificate", "Drawing", "Call Sheet", "Rider", "Brand Asset", "Media", "Template", "Report"]
  const statuses = ["active", "pending_review", "approved", "archived"]
  const fileExtensions = [".pdf", ".docx", ".xlsx", ".png", ".jpg", ".dwg"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `file-${i + 1}`,
    name: `${fileTypes[i % fileTypes.length]}_${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}${fileExtensions[i % fileExtensions.length]}`,
    description: `Production file - ${(Math.random() * 5 + 0.5).toFixed(2)} MB`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Sarah Mitchell" : i % 3 === 1 ? "Alex Turner" : "Jordan Lee",
    assignee_name: i % 3 === 0 ? "Sarah Mitchell" : i % 3 === 1 ? "Alex Turner" : "Jordan Lee",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(60),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: [fileTypes[i % fileTypes.length].toLowerCase().replace(' ', '-'), "production"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: 1,
  }))
}

function generateContractsData(count: number): DataItem[] {
  const contractTypes = [
    "Talent Agreement",
    "Vendor Services Contract",
    "Venue Rental Agreement",
    "Equipment Lease Contract",
    "Crew Employment Agreement",
    "Sponsorship Agreement",
    "Production Services Contract",
    "Licensing Agreement",
    "Non-Disclosure Agreement",
    "Master Services Agreement",
  ]
  const statuses = ["draft", "pending_signature", "executed", "expired", "terminated"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `contract-${i + 1}`,
    name: `${contractTypes[i % contractTypes.length]} - ${new Date(Date.now() + (i * 7) * 24 * 60 * 60 * 1000).getFullYear()}.pdf`,
    description: `Contract value: $${(Math.random() * 50000 + 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - ${Math.floor(Math.random() * 12) + 1} months term`,
    status: statuses[i % statuses.length],
    priority: i % 2 === 0 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Legal Team" : i % 4 === 1 ? "Production Manager" : i % 4 === 2 ? "Finance Director" : "Operations Lead",
    assignee_name: i % 4 === 0 ? "Legal Team" : i % 4 === 1 ? "Production Manager" : i % 4 === 2 ? "Finance Director" : "Operations Lead",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["contract", contractTypes[i % contractTypes.length].toLowerCase().replace(/\s+/g, '-'), "legal"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 5) + 1,
  }))
}

function generateCertificatesData(count: number): DataItem[] {
  const certTypes = [
    "Certificate of Insurance (COI)",
    "Business License",
    "Liquor License",
    "Fire Safety Permit",
    "Building Permit",
    "Occupancy Certificate",
    "Professional Certification",
    "Safety Training Certificate",
    "Vendor Liability Insurance",
    "Workers Compensation Certificate",
  ]
  const statuses = ["active", "pending_renewal", "expired", "submitted", "approved"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `cert-${i + 1}`,
    name: `${certTypes[i % certTypes.length]} - ${Math.floor(Math.random() * 900000) + 100000}.pdf`,
    description: `Expiration: ${new Date(Date.now() + (180 + i * 30) * 24 * 60 * 60 * 1000).toLocaleDateString()} - Issuer: ${i % 2 === 0 ? 'State Authority' : 'Licensed Provider'}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Compliance Officer" : i % 3 === 1 ? "Safety Manager" : "HR Director",
    assignee_name: i % 3 === 0 ? "Compliance Officer" : i % 3 === 1 ? "Safety Manager" : "HR Director",
    due_date: getRandomFutureDate(180),
    start_date: getRandomPastDate(90),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["certificate", "compliance", i % 2 === 0 ? "insurance" : "license"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 3) + 1,
  }))
}

function generateDrawingsData(count: number): DataItem[] {
  const drawingTypes = [
    "Stage Layout Plan",
    "Lighting Plot",
    "Audio System Diagram",
    "Rigging Layout",
    "Venue Floor Plan",
    "Electrical Distribution",
    "Video System Schematic",
    "Set Design Rendering",
    "Truss Configuration",
    "Site Survey Blueprint",
  ]
  const drawingStatuses = ["draft", "in_review", "approved", "as_built", "revision_required"]
  const revisions = ["Rev A", "Rev B", "Rev C", "Rev D", "Final"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `drawing-${i + 1}`,
    name: `${drawingTypes[i % drawingTypes.length]}_${revisions[i % revisions.length]}.dwg`,
    description: `CAD drawing - Scale: ${i % 3 === 0 ? '1:50' : i % 3 === 1 ? '1:100' : '1:200'} - ${(Math.random() * 3 + 1).toFixed(2)} MB`,
    status: drawingStatuses[i % drawingStatuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Technical Designer" : i % 4 === 1 ? "Production Designer" : i % 4 === 2 ? "Lighting Designer" : "Audio Engineer",
    assignee_name: i % 4 === 0 ? "Technical Designer" : i % 4 === 1 ? "Production Designer" : i % 4 === 2 ? "Lighting Designer" : "Audio Engineer",
    due_date: getRandomFutureDate(45),
    start_date: getRandomPastDate(20),
    created_at: getRandomPastDate(40),
    updated_at: new Date().toISOString(),
    tags: ["drawing", "technical", drawingTypes[i % drawingTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 4) + 1,
  }))
}

function generateCallSheetsData(count: number): DataItem[] {
  const productions = [
    "Main Event Show",
    "Festival Day 1",
    "Festival Day 2",
    "Corporate Gala",
    "Concert Series",
    "Theater Production",
    "Awards Ceremony",
    "Touring Show",
  ]
  const statuses = ["draft", "pending_approval", "distributed", "confirmed", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `callsheet-${i + 1}`,
    name: `Call_Sheet_${productions[i % productions.length].replace(/\s+/g, '_')}_${new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '-')}.pdf`,
    description: `Crew call: ${['6:00 AM', '8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM'][i % 5]} - ${Math.floor(Math.random() * 50) + 20} personnel`,
    status: statuses[i % statuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Production Manager" : i % 3 === 1 ? "Stage Manager" : "Production Coordinator",
    assignee_name: i % 3 === 0 ? "Production Manager" : i % 3 === 1 ? "Stage Manager" : "Production Coordinator",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(2),
    created_at: getRandomPastDate(3),
    updated_at: new Date().toISOString(),
    tags: ["call-sheet", "scheduling", "daily"],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: 1,
  }))
}

function generateRidersData(count: number): DataItem[] {
  const riderTypes = [
    "Technical Rider - Audio",
    "Technical Rider - Lighting",
    "Technical Rider - Video",
    "Technical Rider - Stage",
    "Hospitality Rider - Talent",
    "Hospitality Rider - Crew",
    "Dressing Room Rider",
    "Catering Rider",
    "Transportation Rider",
    "Security Rider",
  ]
  const statuses = ["current", "pending_update", "approved", "under_negotiation", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `rider-${i + 1}`,
    name: `${riderTypes[i % riderTypes.length]}_v${Math.floor(i / riderTypes.length) + 1}.pdf`,
    description: `${i % 2 === 0 ? 'Artist' : 'Production'} requirements - ${Math.floor(Math.random() * 15) + 3} pages`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Tour Manager" : i % 4 === 1 ? "Technical Director" : i % 4 === 2 ? "Production Manager" : "Artist Relations",
    assignee_name: i % 4 === 0 ? "Tour Manager" : i % 4 === 1 ? "Technical Director" : i % 4 === 2 ? "Production Manager" : "Artist Relations",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(30),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["rider", riderTypes[i % riderTypes.length].includes("Technical") ? "technical" : "hospitality"],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 3) + 1,
  }))
}

function generateBrandAssetsData(count: number): DataItem[] {
  const assetTypes = [
    "Logo - Primary",
    "Logo - Alternative",
    "Logo - Monochrome",
    "Brand Guidelines PDF",
    "Color Palette Swatches",
    "Typography Specifications",
    "Marketing Banner",
    "Social Media Graphics",
    "Event Signage Template",
    "Sponsor Logo Package",
  ]
  const fileFormats = [".ai", ".eps", ".svg", ".png", ".pdf", ".psd"]
  const statuses = ["approved", "in_review", "draft", "final", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `brand-${i + 1}`,
    name: `${assetTypes[i % assetTypes.length].replace(/\s+/g, '_')}${fileFormats[i % fileFormats.length]}`,
    description: `${['RGB', 'CMYK', 'Pantone'][i % 3]} - ${['High-Res', 'Web', 'Print'][i % 3]} - ${(Math.random() * 10 + 0.5).toFixed(2)} MB`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Creative Director" : i % 3 === 1 ? "Brand Manager" : "Graphic Designer",
    assignee_name: i % 3 === 0 ? "Creative Director" : i % 3 === 1 ? "Brand Manager" : "Graphic Designer",
    due_date: getRandomFutureDate(90),
    start_date: getRandomPastDate(45),
    created_at: getRandomPastDate(120),
    updated_at: new Date().toISOString(),
    tags: ["brand", "design", assetTypes[i % assetTypes.length].toLowerCase().includes("logo") ? "logo" : "asset"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 4) + 1,
  }))
}

function generateMediaData(count: number): DataItem[] {
  const mediaTypes = [
    "Event Photography",
    "Behind the Scenes Video",
    "Promotional Video",
    "Rehearsal Footage",
    "Drone Footage",
    "Interview Recording",
    "Live Performance Recording",
    "Time-lapse Video",
    "Audio Recording - Soundcheck",
    "Marketing Photography",
  ]
  const formats = [".jpg", ".png", ".mp4", ".mov", ".wav", ".mp3", ".raw"]
  const statuses = ["raw", "in_editing", "final", "published", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `media-${i + 1}`,
    name: `${mediaTypes[i % mediaTypes.length].replace(/\s+/g, '_')}_${new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}${formats[i % formats.length]}`,
    description: `${['4K', 'HD', 'High-Res'][i % 3]} - ${(Math.random() * 500 + 50).toFixed(0)} MB - ${['Image', 'Video', 'Audio'][i % 3]}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Photographer" : i % 4 === 1 ? "Videographer" : i % 4 === 2 ? "Video Editor" : "Media Manager",
    assignee_name: i % 4 === 0 ? "Photographer" : i % 4 === 1 ? "Videographer" : i % 4 === 2 ? "Video Editor" : "Media Manager",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(14),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["media", ['image', 'video', 'audio'][i % 3], mediaTypes[i % mediaTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: 1,
  }))
}

function generateTemplatesData(count: number): DataItem[] {
  const templateTypes = [
    "Production Budget Template",
    "Crew Contact Sheet Template",
    "Equipment Checklist Template",
    "Risk Assessment Template",
    "Load-In Schedule Template",
    "Incident Report Template",
    "Vendor Invoice Template",
    "Call Sheet Template",
    "Stage Plot Template",
    "Travel Itinerary Template",
  ]
  const statuses = ["active", "draft", "approved", "under_review", "deprecated"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `template-${i + 1}`,
    name: `${templateTypes[i % templateTypes.length]}.${i % 2 === 0 ? 'xlsx' : 'docx'}`,
    description: `Organization template - Version ${Math.floor(i / templateTypes.length) + 1}.${i % 10} - Last updated ${Math.floor(Math.random() * 60)} days ago`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Operations Manager" : i % 3 === 1 ? "Production Manager" : "Admin Team",
    assignee_name: i % 3 === 0 ? "Operations Manager" : i % 3 === 1 ? "Production Manager" : "Admin Team",
    due_date: getRandomFutureDate(120),
    start_date: getRandomPastDate(90),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: ["template", "organization", templateTypes[i % templateTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: 1,
  }))
}

function generateReportsData(count: number): DataItem[] {
  const reportTypes = [
    "Daily Production Report",
    "Weekly Status Report",
    "Budget Variance Report",
    "Crew Timesheet Report",
    "Equipment Utilization Report",
    "Safety Inspection Report",
    "Attendance Report",
    "Post-Event Summary",
    "Financial Reconciliation Report",
    "Performance Metrics Report",
  ]
  const periods = ["Daily", "Weekly", "Monthly", "Quarterly", "Annual"]
  const statuses = ["draft", "submitted", "approved", "published", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `report-${i + 1}`,
    name: `${reportTypes[i % reportTypes.length]}_${new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')}.pdf`,
    description: `${periods[i % periods.length]} report - ${Math.floor(Math.random() * 30) + 5} pages - Generated automatically`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Production Manager" : i % 4 === 1 ? "Financial Controller" : i % 4 === 2 ? "Operations Director" : "Department Head",
    assignee_name: i % 4 === 0 ? "Production Manager" : i % 4 === 1 ? "Financial Controller" : i % 4 === 2 ? "Operations Director" : "Department Head",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["report", "documentation", periods[i % periods.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 3) + 1,
  }))
}

function generateArchivedData(count: number): DataItem[] {
  const archivedTypes = [
    "Archived Contract - 2023",
    "Archived Event Report - Q2",
    "Archived Technical Drawing",
    "Archived Call Sheet - Tour",
    "Archived Media Assets - Festival",
    "Archived Budget Report",
    "Archived Permit - Expired",
    "Archived Marketing Materials",
    "Archived Production Files",
    "Archived Correspondence",
  ]
  const statuses = ["archived", "expired", "superseded", "completed", "historical"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `archived-${i + 1}`,
    name: `${archivedTypes[i % archivedTypes.length]}_${2020 + (i % 4)}.pdf`,
    description: `Archived ${Math.floor(Math.random() * 365 * 3)} days ago - Retention until ${new Date(Date.now() + (365 * (i % 5 + 1)) * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    status: statuses[i % statuses.length],
    priority: "low",
    assignee: i % 3 === 0 ? "Records Manager" : i % 3 === 1 ? "Archive Administrator" : "Compliance Officer",
    assignee_name: i % 3 === 0 ? "Records Manager" : i % 3 === 1 ? "Archive Administrator" : "Compliance Officer",
    due_date: getRandomFutureDate(365),
    start_date: getRandomPastDate(365 * 2),
    created_at: getRandomPastDate(365 * 3),
    updated_at: new Date().toISOString(),
    tags: ["archived", "historical", archivedTypes[i % archivedTypes.length].toLowerCase().replace(/\s+/g, '-')],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3) + 1,
  }))
}

function generateGenericFilesData(count: number): DataItem[] {
  const statuses = ["active", "pending", "approved", "archived"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Production Document",
    "Technical Specification",
    "Project File",
    "Reference Material",
    "Supporting Document",
    "Resource File",
    "Documentation",
    "Archive Item",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `file-${i + 1}`,
    name: `${names[i % names.length]}_${i + 1}.pdf`,
    description: "Production file requiring review or action",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "File Manager" : i % 3 === 1 ? "Document Controller" : "Production Team",
    assignee_name: i % 3 === 0 ? "File Manager" : i % 3 === 1 ? "Document Controller" : "Production Team",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["file", "production"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: 1,
  }))
}
