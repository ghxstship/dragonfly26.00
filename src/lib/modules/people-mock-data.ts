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
  const employmentStatuses = ["active", "inactive", "on_leave", "terminated"]
  const employmentTypes = ["full_time", "part_time", "contractor", "freelance", "volunteer"]
  const firstNames = ["Sarah", "Mike", "Lisa", "David", "Emma", "James", "Maria", "Alex", "Rachel", "Chris", "Jennifer", "Robert"]
  const lastNames = ["Johnson", "Chen", "Anderson", "Kim", "Wilson", "Taylor", "Garcia", "Thompson", "Lee", "Brown", "Martinez", "Davis"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `person-${i + 1}`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[(i + 3) % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i + 3) % lastNames.length].toLowerCase()}@example.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    photo_url: null,
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    title: roles[i % roles.length],
    employee_id: `EMP-${String(i + 1).padStart(4, '0')}`,
    employment_status: employmentStatuses[i % employmentStatuses.length],
    employment_type: employmentTypes[i % employmentTypes.length],
    hire_date: getRandomPastDate(365 * 5),
    termination_date: null,
    emergency_contact_name: null,
    emergency_contact_phone: null,
    skills: [roles[i % roles.length].toLowerCase().replace(/ /g, '_'), departments[i % departments.length].toLowerCase()],
    certifications: null,
    tags: [departments[i % departments.length].toLowerCase(), "crew"],
    created_at: getRandomPastDate(365 * 5),
    updated_at: new Date().toISOString(),
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
  const teamTypeEnums = ["department", "crew", "project_team", "ad_hoc"]
  const leaders = ["person-1", "person-2", "person-3", "person-4"]
  const memberCounts = [5, 8, 12, 15, 20]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    name: `${teamTypes[i % teamTypes.length]} ${i > 9 ? Math.floor(i / 10) : ''}`.trim(),
    description: `Dedicated ${teamTypes[i % teamTypes.length].toLowerCase()} with ${memberCounts[i % memberCounts.length]} members`,
    type: teamTypeEnums[i % teamTypeEnums.length],
    leader_id: leaders[i % leaders.length],
    members: Array.from({ length: memberCounts[i % memberCounts.length] }, (_, j) => `person-${j + 1}`),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateAssignmentsData(count: number): DataItem[] {
  const personnelIds = ["person-1", "person-2", "person-3", "person-4", "person-5", "person-6", "person-7", "person-8"]
  const productions = ["production-1", "production-2", "production-3"]
  const roles = ["Crew Chief", "Technician", "Assistant", "Lead", "Specialist", "Coordinator"]
  const statuses = ["active", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date(Date.now() + (i - 10) * 24 * 60 * 60 * 1000)
    const endDate = new Date(startDate.getTime() + (5 + Math.random() * 30) * 24 * 60 * 60 * 1000)
    
    return {
      id: `assignment-${i + 1}`,
      personnel_id: personnelIds[i % personnelIds.length],
      production_id: productions[i % productions.length],
      role: roles[i % roles.length],
      rate: parseFloat((25 + Math.random() * 75).toFixed(2)),
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
      status: statuses[i % statuses.length],
      notes: `${roles[i % roles.length]} assignment for production work`,
      created_at: getRandomPastDate(20),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 5),
      attachments_count: Math.floor(Math.random() * 3),
    }
  })
}

function generateTimekeepingData(count: number): DataItem[] {
  const personnelIds = ["person-1", "person-2", "person-3", "person-4", "person-5", "person-6", "person-7", "person-8"]
  const productions = ["production-1", "production-2", "production-3"]
  const types = ["regular", "overtime", "break"]
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000)
    const clockIn = new Date(date)
    clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60))
    const hoursWorked = 6 + Math.random() * 6
    const clockOut = new Date(clockIn.getTime() + hoursWorked * 60 * 60 * 1000)
    const hourlyRate = 25 + Math.random() * 75
    
    return {
      id: `timesheet-${i + 1}`,
      personnel_id: personnelIds[i % personnelIds.length],
      start_time: clockIn.toISOString(),
      end_time: clockOut.toISOString(),
      duration: `${hoursWorked.toFixed(2)} hours`,
      type: types[i % types.length],
      billable: i % 3 !== 0,
      rate: parseFloat(hourlyRate.toFixed(2)),
      production_id: productions[i % productions.length],
      task_id: i % 2 === 0 ? `task-${i + 1}` : null,
      notes: `${hoursWorked.toFixed(2)} hours worked on ${date.toLocaleDateString()}`,
      approved: i % 4 !== 3,
      approved_by: i % 4 !== 3 ? "person-1" : null,
      created_at: clockIn.toISOString(),
      updated_at: new Date().toISOString(),
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

function generateTrainingsData(count: number): DataItem[] {
  const trainingNames = [
    "Rigging Safety Certification",
    "Electrical Code Training",
    "OSHA 30-Hour Construction",
    "Fall Protection Training",
    "Forklift Operation",
    "CPR & First Aid",
    "Fire Safety & Extinguisher Use",
    "Hazmat Handling",
    "Confined Space Entry",
    "Aerial Work Platform",
  ]
  const types = ["safety", "technical", "certification", "refresher", "compliance"]
  const personnelIds = ["person-1", "person-2", "person-3", "person-4", "person-5", "person-6"]
  const instructors = ["John Smith", "Emily Davis", "Robert Martinez", "Jennifer Lee"]
  const statuses = ["valid", "expired", "pending", "revoked"]
  
  return Array.from({ length: count }, (_, i) => {
    const completedDate = new Date(Date.now() - Math.random() * 365 * 2 * 24 * 60 * 60 * 1000)
    const expiryMonths = [12, 24, 36, 60][i % 4]
    const expiryDate = new Date(completedDate.getTime() + expiryMonths * 30 * 24 * 60 * 60 * 1000)
    
    return {
      id: `training-${i + 1}`,
      training_name: trainingNames[i % trainingNames.length],
      type: types[i % types.length],
      personnel_id: personnelIds[i % personnelIds.length],
      completed_date: completedDate.toISOString().split('T')[0],
      expiry_date: expiryDate.toISOString().split('T')[0],
      certification_number: `CERT-${String(Math.floor(Math.random() * 1000000)).padStart(8, '0')}`,
      instructor: instructors[i % instructors.length],
      hours: [8, 16, 24, 30, 40][i % 5],
      status: statuses[i % statuses.length],
      notes: `${trainingNames[i % trainingNames.length]} certification`,
      created_at: getRandomPastDate(30),
      updated_at: new Date().toISOString(),
      comments_count: Math.floor(Math.random() * 6),
      attachments_count: Math.floor(Math.random() * 4),
    }
  })
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
  const employmentTypes = ["full_time", "part_time", "contractor", "freelance"]
  const statuses = ["open", "on_hold", "filled", "cancelled"]
  const locations = ["New York", "Los Angeles", "Chicago", "Remote"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `opening-${i + 1}`,
    title: positions[i % positions.length],
    department: departments[i % departments.length],
    employment_type: employmentTypes[i % employmentTypes.length],
    location: locations[i % locations.length],
    description: `Seeking experienced ${positions[i % positions.length].toLowerCase()} for ${departments[i % departments.length]} team. Must have 3+ years experience.`,
    requirements: `Professional experience in ${departments[i % departments.length].toLowerCase()}, strong technical skills, team player`,
    salary_min: parseFloat((40000 + Math.random() * 30000).toFixed(2)),
    salary_max: parseFloat((70000 + Math.random() * 50000).toFixed(2)),
    salary_currency: "USD",
    posted_date: getRandomPastDate(30),
    closing_date: i % 3 === 0 ? getRandomFutureDate(60) : null,
    status: statuses[i % statuses.length],
    hiring_manager_id: "person-1",
    applicant_count: Math.floor(Math.random() * 50),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateApplicantsData(count: number): DataItem[] {
  const firstNames = ["Jennifer", "Robert", "Patricia", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Nancy", "Christopher", "Karen"]
  const lastNames = ["Martinez", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Rodriguez", "Lee", "Wilson", "Moore", "Davis"]
  const statuses = ["applied", "screening", "phone_interview", "in_person_interview", "offer_extended", "hired", "rejected", "withdrawn"]
  const sources = ["website", "linkedin", "referral", "job_board", "indeed", "career_page"]
  const openingIds = ["opening-1", "opening-2", "opening-3", "opening-4", "opening-5"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `applicant-${i + 1}`,
    job_opening_id: openingIds[i % openingIds.length],
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[(i + 3) % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i + 3) % lastNames.length].toLowerCase()}@email.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`,
    resume_url: `https://storage.example.com/resumes/applicant-${i + 1}.pdf`,
    cover_letter: `Experienced professional seeking to contribute skills and expertise to your team.`,
    linkedin_url: i % 3 === 0 ? `https://linkedin.com/in/${firstNames[i % firstNames.length].toLowerCase()}-${lastNames[(i + 3) % lastNames.length].toLowerCase()}` : null,
    portfolio_url: i % 4 === 0 ? `https://portfolio.example.com/${firstNames[i % firstNames.length].toLowerCase()}` : null,
    years_experience: Math.floor(Math.random() * 15) + 1,
    desired_salary: parseFloat((50000 + Math.random() * 70000).toFixed(2)),
    available_start_date: getRandomFutureDate(60),
    status: statuses[i % statuses.length],
    source: sources[i % sources.length],
    referral_source: i % 5 === 0 ? "person-1" : null,
    applied_date: getRandomPastDate(30),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
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
