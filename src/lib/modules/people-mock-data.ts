import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generatePeopleMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'personnel':
      return generatePersonnelData(count)
    case 'teams':
      return generateTeamsData(count)
    case 'assignments':
      return generateAssignmentsData(count)
    case 'timekeeping':
      return generateTimekeepingData(count)
    case 'scheduling':
      return generateSchedulingData(count)
    case 'training':
      return generateTrainingData(count)
    case 'onboarding':
      return generateOnboardingData(count)
    case 'openings':
      return generateOpeningsData(count)
    case 'applicants':
      return generateApplicantsData(count)
    default:
      return generateGenericData(count)
  }
}

function generatePersonnelData(count: number): DataItem[] {
  const roles = [
    "Production Manager",
    "Stage Manager",
    "Lighting Designer",
    "Audio Engineer",
    "Video Engineer",
    "Rigger",
    "Technical Director",
    "Carpenter",
    "Electrician",
    "Sound Technician",
  ]
  const departments = ["Production", "Audio", "Lighting", "Video", "Rigging", "Stage", "Technical", "Management"]
  const statuses = ["active", "on_leave", "contracted", "part_time"]
  const names = [
    "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim", 
    "Emma Wilson", "James Taylor", "Maria Garcia", "Alex Thompson",
    "Rachel Lee", "Chris Brown", "Jennifer Martinez", "Robert Taylor"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `person-${i + 1}`,
    name: names[i % names.length],
    description: `${roles[i % roles.length]} with ${Math.floor(Math.random() * 15) + 1} years experience`,
    status: statuses[i % statuses.length],
    priority: "normal",
    assignee: roles[i % roles.length],
    assignee_name: roles[i % roles.length],
    due_date: new Date().toISOString(),
    start_date: getRandomPastDate(365 * 5),
    created_at: getRandomPastDate(365 * 5),
    updated_at: new Date().toISOString(),
    tags: [departments[i % departments.length].toLowerCase(), "crew"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateTeamsData(count: number): DataItem[] {
  const teamTypes = [
    "Production Team",
    "Audio Team",
    "Lighting Team",
    "Video Team",
    "Stage Crew",
    "Rigging Team",
    "Technical Team",
    "Management Team",
    "Load-In Crew",
    "Setup Team",
  ]
  const leads = [
    "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim",
    "Emma Wilson", "James Taylor", "Maria Garcia", "Alex Thompson"
  ]
  const statuses = ["active", "planning", "on_project", "available", "archived"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `${teamTypes[i % teamTypes.length]} ${i > 9 ? Math.floor(i / 10) : ''}`.trim(),
    description: `Dedicated ${teamTypes[i % teamTypes.length].toLowerCase()} with ${Math.floor(Math.random() * 15) + 5} members`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: leads[i % leads.length],
    assignee_name: leads[i % leads.length],
    due_date: new Date().toISOString(),
    start_date: getRandomPastDate(180),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    tags: [teamTypes[i % teamTypes.length].split(' ')[0].toLowerCase(), "team"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateAssignmentsData(count: number): DataItem[] {
  const projects = [
    "Summer Festival 2024",
    "Corporate Event Series",
    "Tour Production",
    "Theater Season",
    "Concert Series",
    "Broadway Show",
    "Award Ceremony",
    "Music Video Shoot",
  ]
  const taskTypes = [
    "Setup & Load-In",
    "Strike & Load-Out",
    "Technical Rehearsal",
    "Performance",
    "Equipment Prep",
    "Site Survey",
    "Design Review",
    "Safety Inspection",
  ]
  const assignees = [
    "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim",
    "Emma Wilson", "James Taylor", "Maria Garcia", "Alex Thompson"
  ]
  const statuses = ["assigned", "in_progress", "completed", "pending", "overdue"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `assignment-${i + 1}`,
    name: `${taskTypes[i % taskTypes.length]} - ${projects[i % projects.length]}`,
    description: `${taskTypes[i % taskTypes.length]} assignment for ${projects[i % projects.length]}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: assignees[i % assignees.length],
    assignee_name: assignees[i % assignees.length],
    due_date: getRandomFutureDate(45),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: [taskTypes[i % taskTypes.length].split(' ')[0].toLowerCase(), "task"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateTimekeepingData(count: number): DataItem[] {
  const personnel = [
    "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim",
    "Emma Wilson", "James Taylor", "Maria Garcia", "Alex Thompson"
  ]
  const projects = ["Summer Festival", "Corporate Event", "Tour Production", "Theater Season"]
  const statuses = ["submitted", "approved", "pending", "rejected", "paid"]
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
    const clockIn = new Date(date)
    clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
    const hoursWorked = 6 + Math.random() * 6
    const clockOut = new Date(clockIn.getTime() + hoursWorked * 60 * 60 * 1000)
    
    return {
      id: `timesheet-${i + 1}`,
      name: `${personnel[i % personnel.length]} - ${date.toLocaleDateString()}`,
      description: `Time entry: ${hoursWorked.toFixed(2)} hours on ${projects[i % projects.length]}`,
      status: statuses[i % statuses.length],
      priority: "normal",
      assignee: personnel[i % personnel.length],
      assignee_name: personnel[i % personnel.length],
      due_date: clockOut.toISOString(),
      start_date: clockIn.toISOString(),
      created_at: clockIn.toISOString(),
      updated_at: new Date().toISOString(),
      tags: [projects[i % projects.length].split(' ')[0].toLowerCase(), "timesheet"],
      comments_count: Math.floor(Math.random() * 3),
      attachments_count: 0,
    }
  })
}

function generateSchedulingData(count: number): DataItem[] {
  const personnel = [
    "Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim",
    "Emma Wilson", "James Taylor", "Maria Garcia", "Alex Thompson"
  ]
  const shifts = [
    "Morning Shift (8AM-4PM)",
    "Afternoon Shift (12PM-8PM)",
    "Evening Shift (4PM-12AM)",
    "Night Shift (8PM-4AM)",
    "Full Day (8AM-8PM)",
    "Split Shift",
  ]
  const locations = ["Main Stage", "Studio A", "Warehouse", "Theatre One", "Venue B"]
  const statuses = ["scheduled", "confirmed", "tentative", "cancelled", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `schedule-${i + 1}`,
    name: `${personnel[i % personnel.length]} - ${shifts[i % shifts.length]}`,
    description: `${shifts[i % shifts.length]} at ${locations[i % locations.length]}`,
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "high" : "normal",
    assignee: personnel[i % personnel.length],
    assignee_name: personnel[i % personnel.length],
    due_date: getRandomFutureDate(30),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(15),
    updated_at: new Date().toISOString(),
    tags: [shifts[i % shifts.length].split(' ')[0].toLowerCase(), "schedule"],
    comments_count: Math.floor(Math.random() * 4),
    attachments_count: 0,
  }))
}

function generateTrainingData(count: number): DataItem[] {
  const programs = [
    "OSHA Safety Certification",
    "Rigging Safety Training",
    "First Aid & CPR",
    "Electrical Safety",
    "Fall Protection",
    "Forklift Operation",
    "Audio Systems Training",
    "Lighting Console Training",
    "Emergency Response",
    "Hazmat Handling",
  ]
  const instructors = ["John Smith", "Emily Davis", "Robert Martinez", "Jennifer Lee"]
  const statuses = ["scheduled", "in_progress", "completed", "cancelled", "certification_pending"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `training-${i + 1}`,
    name: `${programs[i % programs.length]} - Session ${Math.floor(i / programs.length) + 1}`,
    description: `Professional training program: ${programs[i % programs.length].toLowerCase()}`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : "normal",
    assignee: instructors[i % instructors.length],
    assignee_name: instructors[i % instructors.length],
    due_date: getRandomFutureDate(90),
    start_date: getRandomFutureDate(60),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: [programs[i % programs.length].split(' ')[0].toLowerCase(), "training", "certification"],
    comments_count: Math.floor(Math.random() * 6),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateOnboardingData(count: number): DataItem[] {
  const newHires = [
    "Alex Chen", "Jordan Smith", "Taylor Davis", "Morgan Wilson",
    "Casey Johnson", "Riley Brown", "Avery Garcia", "Quinn Martinez",
    "Sage Anderson", "Dakota Lee"
  ]
  const positions = [
    "Audio Technician",
    "Lighting Designer",
    "Stage Manager",
    "Production Assistant",
    "Rigger",
    "Video Engineer",
    "Carpenter",
    "Electrician",
  ]
  const statuses = ["not_started", "in_progress", "pending_review", "completed", "on_hold"]
  const mentors = ["Sarah Johnson", "Mike Chen", "Lisa Anderson", "David Kim"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `onboarding-${i + 1}`,
    name: `${newHires[i % newHires.length]} - ${positions[i % positions.length]}`,
    description: `Onboarding ${newHires[i % newHires.length]} as ${positions[i % positions.length].toLowerCase()}`,
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "high" : "normal",
    assignee: mentors[i % mentors.length],
    assignee_name: mentors[i % mentors.length],
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(i),
    created_at: getRandomPastDate(i),
    updated_at: new Date().toISOString(),
    tags: [positions[i % positions.length].split(' ')[0].toLowerCase(), "onboarding", "new-hire"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateOpeningsData(count: number): DataItem[] {
  const positions = [
    "Senior Audio Engineer",
    "Lighting Designer",
    "Production Manager",
    "Stage Manager",
    "Video Technician",
    "Rigging Supervisor",
    "Technical Director",
    "Assistant Production Manager",
    "Audio Technician",
    "Lighting Technician",
    "Carpenter",
    "Electrician",
  ]
  const departments = ["Audio", "Lighting", "Production", "Video", "Rigging", "Technical", "Stage"]
  const types = ["full_time", "part_time", "contract", "seasonal"]
  const statuses = ["open", "interviewing", "on_hold", "filled", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `opening-${i + 1}`,
    name: `${positions[i % positions.length]} - ${types[i % types.length].replace('_', ' ').toUpperCase()}`,
    description: `Seeking experienced ${positions[i % positions.length].toLowerCase()} for ${departments[i % departments.length]} team`,
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: "HR Department",
    assignee_name: "HR Department",
    due_date: getRandomFutureDate(60),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(10),
    updated_at: new Date().toISOString(),
    tags: [departments[i % departments.length].toLowerCase(), "job-opening", types[i % types.length]],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateApplicantsData(count: number): DataItem[] {
  const names = [
    "Jennifer Martinez", "Robert Taylor", "Patricia Anderson", "Michael Thomas",
    "Linda Jackson", "William White", "Elizabeth Harris", "David Martin",
    "Barbara Thompson", "Richard Garcia", "Susan Rodriguez", "Joseph Lee",
    "Nancy Wilson", "Christopher Moore", "Karen Taylor"
  ]
  const positions = [
    "Audio Engineer",
    "Lighting Designer",
    "Stage Manager",
    "Production Assistant",
    "Rigger",
    "Video Technician",
    "Carpenter",
    "Electrician",
  ]
  const statuses = ["applied", "screening", "interviewing", "offer_sent", "hired", "rejected"]
  const sources = ["Website", "LinkedIn", "Referral", "Job Board", "Indeed", "Company Career Page"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `applicant-${i + 1}`,
    name: `${names[i % names.length]} - ${positions[i % positions.length]}`,
    description: `Applied for ${positions[i % positions.length]} via ${sources[i % sources.length]}`,
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "high" : i % 4 === 1 ? "normal" : "low",
    assignee: "HR Team",
    assignee_name: "HR Team",
    due_date: getRandomFutureDate(20),
    start_date: getRandomPastDate(30 - i),
    created_at: getRandomPastDate(30 - i),
    updated_at: new Date().toISOString(),
    tags: [positions[i % positions.length].split(' ')[0].toLowerCase(), "applicant", sources[i % sources.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 6),
    attachments_count: Math.floor(Math.random() * 4) + 1,
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["active", "pending", "completed", "on_hold"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Personnel Record",
    "Team Assignment",
    "Staff Coordination",
    "Crew Management",
    "Schedule Planning",
    "Resource Allocation",
    "Training Record",
    "HR Documentation",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "People management item requiring attention and completion",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "HR Manager" : i % 3 === 1 ? "Production Manager" : "Operations Lead",
    assignee_name: i % 3 === 0 ? "HR Manager" : i % 3 === 1 ? "Production Manager" : "Operations Lead",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["people"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
