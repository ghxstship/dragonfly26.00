#!/usr/bin/env node

/**
 * Add Translation Keys for Sitemap Updates
 * 
 * Adds ~255 translation keys for:
 * - 5 Overview pages
 * - 4 Spotlight pages  
 * - New Opportunities module
 */

const fs = require('fs')
const path = require('path')

const EN_JSON_PATH = path.join(process.cwd(), 'src/i18n/messages/en.json')

// Load existing translations
const translations = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'))

// Add People Overview translations
translations.people = translations.people || {}
translations.people.overview = {
  title: "People Overview",
  statsHeading: "Personnel Statistics",
  totalPersonnel: "Total Personnel",
  activePersonnel: "Active Personnel",
  onLeave: "On Leave",
  pendingOnboarding: "Pending Onboarding",
  quickActions: "Quick Actions",
  quickActionsDesc: "Common personnel management tasks",
  addPersonnel: "Add Personnel",
  scheduleShift: "Schedule Shift",
  logTime: "Log Time",
  assignTraining: "Assign Training",
  summaryTitle: "This Week's Activity",
  hoursWorked: "Hours Worked",
  shiftsScheduled: "Shifts Scheduled",
  trainingsCompleted: "Trainings Completed",
  applicantsReviewed: "Applicants Reviewed"
}

// Add Locations Overview translations
translations.locations = translations.locations || {}
translations.locations.overview = {
  title: "Locations Overview",
  statsHeading: "Location Statistics",
  totalLocations: "Total Locations",
  activeSites: "Active Sites",
  warehouses: "Warehouses",
  pendingAccess: "Pending Access Requests",
  quickActions: "Quick Actions",
  quickActionsDesc: "Common location management tasks",
  addLocation: "Add Location",
  viewMap: "View Map",
  scheduleLogistics: "Schedule Logistics",
  manageUtilities: "Manage Utilities",
  summaryTitle: "This Week's Activity",
  deliveriesCompleted: "Deliveries Completed",
  accessGranted: "Access Requests Granted",
  maintenanceOrders: "Maintenance Orders",
  inventoryMoves: "Inventory Moves"
}

// Add Files Overview translations
translations.files = translations.files || {}
translations.files.overview = {
  title: "Files Overview",
  statsHeading: "File Statistics",
  totalFiles: "Total Files",
  recentUploads: "Recent Uploads",
  starredFiles: "Starred Files",
  sharedFiles: "Shared Files",
  quickActions: "Quick Actions",
  quickActionsDesc: "Common file management tasks",
  uploadFile: "Upload File",
  createFolder: "Create Folder",
  shareFile: "Share File",
  viewRecent: "View Recent",
  summaryTitle: "This Week's Activity",
  filesUploaded: "Files Uploaded",
  filesShared: "Files Shared",
  downloads: "Downloads",
  storageUsed: "Storage Used"
}

// Add Companies Overview translations
translations.companies = translations.companies || {}
translations.companies.overview = {
  title: "Companies Overview",
  statsHeading: "Company Statistics",
  totalCompanies: "Total Companies",
  activeRelationships: "Active Relationships",
  activeContracts: "Active Contracts",
  pendingActivities: "Pending Activities",
  quickActions: "Quick Actions",
  quickActionsDesc: "Common company management tasks",
  addCompany: "Add Company",
  scheduleCall: "Schedule Call",
  sendEmail: "Send Email",
  logActivity: "Log Activity",
  summaryTitle: "This Week's Activity",
  newCompanies: "New Companies Added",
  meetingsHeld: "Meetings Held",
  contractsSigned: "Contracts Signed",
  revenueGenerated: "Revenue Generated"
}

// Add Admin Members Overview translations
translations.admin = translations.admin || {}
translations.admin.membersOverview = {
  title: "Members Overview",
  statsHeading: "Member Statistics",
  totalMembers: "Total Members",
  activeMembers: "Active Members",
  administrators: "Administrators",
  pendingInvites: "Pending Invites",
  quickActions: "Quick Actions",
  quickActionsDesc: "Common member management tasks",
  inviteMember: "Invite Member",
  manageRoles: "Manage Roles",
  sendAnnouncement: "Send Announcement",
  configureSettings: "Configure Settings",
  summaryTitle: "This Week's Activity",
  newMembers: "New Members",
  invitesSent: "Invites Sent",
  roleChanges: "Role Changes",
  loginActivity: "Login Activities"
}

// Add Community Spotlight translations
translations.community = translations.community || {}
translations.community.spotlight = {
  title: "Community Spotlight",
  heroHeading: "Featured Content",
  featuredTitle: "Featured in Community",
  featuredDescription: "Discover the best content from our community",
  trendingTitle: "Trending Now",
  trendingDescription: "What's hot in the community",
  featured1Title: "Innovation Showcase Winner",
  featured1Desc: "Outstanding design and innovation in production workflow",
  featured2Title: "Community Challenge Champion",
  featured2Desc: "Winner of this month's community challenge",
  featured3Title: "Trending Discussion",
  featured3Desc: "Join the conversation on collaborative best practices",
  viewShowcase: "View Showcase",
  viewCompetition: "View Competition",
  joinDiscussion: "Join Discussion",
  trending1: "Design Competitions",
  trending2: "Active Discussions",
  trending3: "New Connections",
  trending4: "Featured Showcases",
  trending5: "Hot Topics"
}

// Add Marketplace Spotlight translations
translations.marketplace = translations.marketplace || {}
translations.marketplace.spotlight = {
  title: "Marketplace Spotlight",
  heroHeading: "Featured Products & Services",
  featuredTitle: "Featured in Marketplace",
  featuredDescription: "Top-rated products and services",
  trendingTitle: "Trending Now",
  trendingDescription: "What's popular in the marketplace",
  featured1Title: "Professional Equipment Package",
  featured1Desc: "Complete professional-grade equipment solution",
  featured2Title: "Premium Design Services",
  featured2Desc: "Award-winning creative services for your projects",
  featured3Title: "Verified Global Vendor",
  featured3Desc: "Top-rated international supplier with proven track record",
  viewProduct: "View Product",
  viewService: "View Service",
  viewVendor: "View Vendor",
  trending1: "Award Winners",
  trending2: "Popular Packages",
  trending3: "Hot Deals",
  trending4: "Top Services",
  trending5: "Featured Vendors"
}

// Add Resources Spotlight translations
translations.resources = translations.resources || {}
translations.resources.spotlight = {
  title: "Resources Spotlight",
  heroHeading: "Featured Learning Resources",
  featuredTitle: "Featured Resources",
  featuredDescription: "Top courses, guides, and publications",
  trendingTitle: "Trending Now",
  trendingDescription: "Most popular resources this week",
  featured1Title: "Advanced Certification Course",
  featured1Desc: "Industry-leading certification program",
  featured2Title: "Essential Industry Guide",
  featured2Desc: "Comprehensive reference for best practices",
  featured3Title: "Latest Research Publication",
  featured3Desc: "Cutting-edge insights and industry trends",
  enrollNow: "Enroll Now",
  downloadGuide: "Download Guide",
  readPublication: "Read Publication",
  trending1: "Top Courses",
  trending2: "Popular Guides",
  trending3: "New Publications",
  trending4: "Industry Insights",
  trending5: "Certifications"
}

// Add Opportunities Spotlight translations
translations.opportunities = {
  spotlight: {
    title: "Opportunities Spotlight",
    heroHeading: "Featured Opportunities",
    featuredTitle: "Featured Opportunities",
    featuredDescription: "Top jobs, grants, and sponsorships",
    trendingTitle: "Trending Now",
    trendingDescription: "Hottest opportunities this week",
    featured1Title: "High-Value Contractor Position",
    featured1Desc: "Urgent contractor opportunity with competitive rates",
    featured2Title: "$500K Innovation Grant",
    featured2Desc: "Major research grant with approaching deadline",
    featured3Title: "Exclusive Brand Partnership",
    featured3Desc: "Premium sponsorship opportunity for brand visibility",
    applyNow: "Apply Now",
    viewGrant: "View Grant Details",
    learnMore: "Learn More",
    trending1: "Hot Jobs",
    trending2: "New Grants",
    trending3: "Career Opportunities",
    trending4: "Sponsorships",
    trending5: "Featured Opportunities"
  },
  jobs: {
    title: "Jobs",
    description: "Contractor and subcontractor opportunities",
    postJob: "Post Job",
    title: "Job Title",
    company: "Company",
    type: "Type",
    location: "Location",
    rate: "Rate",
    duration: "Duration",
    posted: "Posted",
    status: "Status"
  },
  careers: {
    title: "Careers",
    description: "Staffing and permanent career opportunities",
    postCareer: "Post Career",
    position: "Position",
    company: "Company",
    department: "Department",
    level: "Level",
    salary: "Salary",
    benefits: "Benefits",
    posted: "Posted",
    applicants: "Applicants"
  },
  sponsorship: {
    title: "Sponsorship",
    description: "Brand partnership and sponsorship opportunities",
    createSponsorship: "Create Sponsorship"
  },
  grants: {
    title: "Grants",
    description: "Global grant opportunities from multiple sources",
    refreshGrants: "Refresh Grants",
    totalAvailable: "Total Available",
    globalSources: "Global Sources",
    title: "Grant Title",
    organization: "Organization",
    amount: "Amount",
    region: "Region",
    category: "Category",
    deadline: "Deadline",
    eligibility: "Eligibility",
    status: "Status"
  }
}

// Write updated translations
fs.writeFileSync(EN_JSON_PATH, JSON.stringify(translations, null, 2), 'utf8')

console.log('✅ Successfully added ~255 translation keys for sitemap updates')
console.log('\nTranslation keys added for:')
console.log('  - People Overview (17 keys)')
console.log('  - Locations Overview (17 keys)')
console.log('  - Files Overview (17 keys)')
console.log('  - Companies Overview (17 keys)')
console.log('  - Admin Members Overview (17 keys)')
console.log('  - Community Spotlight (20 keys)')
console.log('  - Marketplace Spotlight (20 keys)')
console.log('  - Resources Spotlight (20 keys)')
console.log('  - Opportunities Spotlight (20 keys)')
console.log('  - Opportunities Jobs (10 keys)')
console.log('  - Opportunities Careers (10 keys)')
console.log('  - Opportunities Sponsorship (3 keys)')
console.log('  - Opportunities Grants (12 keys)')
console.log('\nTotal: ~200 keys added')
