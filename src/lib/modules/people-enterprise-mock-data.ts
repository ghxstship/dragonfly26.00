/**
 * Enhanced mock data for enterprise People module features
 * Includes PTO, scheduling, compliance, approvals, etc.
 */

// Generate comprehensive employee data with all enterprise fields
export function generateEnterprisePersonnel(count: number = 20) {
  const firstNames = ["Sarah", "Mike", "Lisa", "David", "Emma", "James", "Maria", "Alex", "Rachel", "Chris"]
  const lastNames = ["Johnson", "Chen", "Anderson", "Kim", "Wilson", "Taylor", "Garcia", "Thompson", "Lee", "Brown"]
  const departments = ["Production", "Audio", "Lighting", "Video", "Rigging", "Stage"]
  const roles = ["Manager", "Technician", "Designer", "Engineer", "Specialist", "Coordinator"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `person-${i + 1}`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[(i + 3) % lastNames.length],
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[(i + 3) % lastNames.length].toLowerCase()}@company.com`,
    phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    avatar_url: null,
    employee_id: `EMP-${String(i + 1).padStart(4, '0')}`,
    
    // Employment
    role: roles[i % roles.length],
    department: departments[i % departments.length],
    title: `${i % 3 === 0 ? 'Senior' : ''} ${roles[i % roles.length]}`.trim(),
    employment_status: i % 15 === 0 ? 'on_leave' : i % 20 === 0 ? 'inactive' : 'active',
    employment_type: i % 4 === 0 ? 'part_time' : i % 8 === 0 ? 'contractor' : 'full_time',
    hire_date: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365 * 3).toISOString().split('T')[0],
    
    // Manager hierarchy
    manager_id: i > 5 ? `person-${Math.floor(i / 5)}` : null,
    
    // Compensation
    salary_amount: 40000 + Math.floor(Math.random() * 80000),
    salary_frequency: i % 4 === 0 ? 'hourly' : 'annually',
    pay_type: i % 4 === 0 ? 'hourly' : 'salary',
    
    // Status
    onboarding_status: i < 3 ? 'in_progress' : 'completed',
    isClockedIn: i % 3 === 0,
    ptoAvailable: Math.floor(Math.random() * 20),
    
    // Skills
    skills: [`${roles[i % roles.length].toLowerCase()}`, `${departments[i % departments.length].toLowerCase()}`],
    certifications: [],
    
    created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 365).toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// Dashboard mock data
export function generateDashboardMockData() {
  return {
    headcount: {
      active: 47,
      fullTime: 35,
      partTime: 8,
      contractors: 4,
      onLeave: 2
    },
    schedule: {
      onDuty: 12,
      comingSoon: 8,
      openShifts: 3,
      shifts: [
        { time: '2:00 PM', count: 3 },
        { time: '4:00 PM', count: 5 },
        { time: '6:00 PM', count: 2 }
      ]
    },
    approvals: {
      total: 15,
      pto: 5,
      timesheets: 8,
      shifts: 2,
      documents: 0
    },
    alerts: [
      {
        id: '1',
        type: 'hours',
        severity: 'critical',
        message: 'Worked 52 hours this week (max: 40)',
        personnel: 'John Doe'
      },
      {
        id: '2',
        type: 'certification',
        severity: 'warning',
        message: 'Safety cert expiring in 5 days',
        personnel: 'Jane Smith'
      },
      {
        id: '3',
        type: 'break',
        severity: 'warning',
        message: 'Missed required break period',
        personnel: 'Bob Johnson'
      }
    ],
    stats: {
      onboarding: 2,
      reviewsDue: 5,
      ptoRequests: 5
    }
  }
}

// Today's schedule mock data
export function generateTodaysScheduleMockData() {
  return {
    onDuty: [
      { id: '1', personnelId: 'person-1', name: 'Sarah Johnson', startTime: '8:00 AM', endTime: '4:00 PM', location: 'Main Stage' },
      { id: '2', personnelId: 'person-2', name: 'Mike Chen', startTime: '9:00 AM', endTime: '5:00 PM', location: 'Studio A' },
      { id: '3', personnelId: 'person-3', name: 'Lisa Anderson', startTime: '7:00 AM', endTime: '3:00 PM', location: 'Warehouse' }
    ],
    comingSoon: [
      { id: '4', personnelId: 'person-4', name: 'David Kim', startTime: '2:00 PM', endTime: '10:00 PM', location: 'Main Stage' },
      { id: '5', personnelId: 'person-5', name: 'Emma Wilson', startTime: '4:00 PM', endTime: '12:00 AM', location: 'Studio B' }
    ],
    openShifts: [
      { time: '6:00 PM', count: 2, location: 'Main Stage' },
      { time: '8:00 PM', count: 1, location: 'Warehouse' }
    ],
    outToday: [
      { name: 'James Taylor', reason: 'pto' as const },
      { name: 'Maria Garcia', reason: 'sick' as const }
    ]
  }
}

// PTO requests mock data
export function generatePTORequestsMockData(count: number = 10) {
  const personnel = generateEnterprisePersonnel(10)
  const statuses = ['pending', 'approved', 'denied'] as const
  
  return Array.from({ length: count }, (_, i) => ({
    id: `pto-${i + 1}`,
    personnel_id: personnel[i % personnel.length].id,
    personnel: {
      first_name: personnel[i % personnel.length].first_name,
      last_name: personnel[i % personnel.length].last_name,
      avatar_url: null
    },
    policy_id: 'policy-1',
    policy: {
      name: 'Vacation',
      type: i % 3 === 0 ? 'sick' : 'vacation'
    },
    start_date: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date(Date.now() + ((i + 1) * 7 + 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    total_hours: (i + 1) * 8,
    status: statuses[i % statuses.length],
    reason: 'Family vacation',
    requested_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    reviewed_by: i % 3 !== 0 ? 'user-1' : null,
    reviewed_at: i % 3 !== 0 ? new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString() : null,
    created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  }))
}

// Compliance violations mock data
export function generateComplianceViolationsMockData() {
  return [
    {
      id: '1',
      rule_id: 'rule-1',
      rule: { name: 'Max Hours Per Week', rule_type: 'max_hours_per_week' },
      personnel_id: 'person-1',
      personnel: { first_name: 'John', last_name: 'Doe' },
      violation_type: 'max_hours_per_week',
      violation_date: new Date().toISOString().split('T')[0],
      severity: 'critical',
      description: 'Worked 52 hours this week, exceeding the 40-hour limit',
      actual_value: 52,
      expected_value: 40,
      status: 'open',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      rule_id: 'rule-2',
      rule: { name: 'Required Break Period', rule_type: 'required_break_duration' },
      personnel_id: 'person-2',
      personnel: { first_name: 'Jane', last_name: 'Smith' },
      violation_type: 'required_break_duration',
      violation_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      severity: 'warning',
      description: 'Missed required 30-minute break after 6 hours of work',
      actual_value: 0,
      expected_value: 30,
      status: 'open',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

// Onboarding progress mock data
export function generateOnboardingMockData() {
  return [
    {
      personnelName: 'Sarah Johnson',
      overallProgress: 80,
      tasks: [
        { category: 'Paperwork', completed: 5, total: 5, status: 'completed' },
        { category: 'Training', completed: 4, total: 5, status: 'in_progress' },
        { category: 'Equipment', completed: 3, total: 3, status: 'completed' },
        { category: 'Access', completed: 0, total: 2, status: 'pending' }
      ]
    },
    {
      personnelName: 'Mike Chen',
      overallProgress: 45,
      tasks: [
        { category: 'Paperwork', completed: 3, total: 5, status: 'in_progress' },
        { category: 'Training', completed: 1, total: 5, status: 'in_progress' },
        { category: 'Equipment', completed: 0, total: 3, status: 'pending' },
        { category: 'Access', completed: 0, total: 2, status: 'pending' }
      ]
    }
  ]
}

// Activity timeline mock data
export function generateActivityTimelineMockData() {
  return [
    {
      id: '1',
      type: 'clock',
      title: 'Clocked in at Downtown Office',
      description: 'GPS location verified',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      metadata: { location: 'Downtown Office' }
    },
    {
      id: '2',
      type: 'pto',
      title: 'PTO request approved',
      description: 'Oct 20-22: 3 days vacation',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      metadata: { days: '3' }
    },
    {
      id: '3',
      type: 'onboarding',
      title: 'Completed onboarding task',
      description: 'Safety training (5/5 tasks complete)',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      metadata: {}
    },
    {
      id: '4',
      type: 'document',
      title: 'Contract signed',
      description: 'Employment agreement',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      metadata: {}
    },
    {
      id: '5',
      type: 'clock',
      title: 'Clocked out',
      description: '8.5 hours worked',
      timestamp: new Date(Date.now() - 25 * 60 * 60 * 1000), // Yesterday evening
      metadata: { hours: '8.5' }
    }
  ]
}

// Goal progress mock data
export function generateGoalsMockData() {
  return [
    {
      goalTitle: 'Q1 Sales Target Achievement',
      progress: 75,
      status: 'in_progress',
      targetDate: 'Mar 31, 2025',
      keyResults: [
        { title: 'Close 50 new clients', completed: true },
        { title: 'Achieve $500K revenue', completed: true },
        { title: 'Maintain 95% client satisfaction', completed: false }
      ]
    },
    {
      goalTitle: 'Complete Technical Certification',
      progress: 60,
      status: 'in_progress',
      targetDate: 'Feb 15, 2025',
      keyResults: [
        { title: 'Attend all training sessions', completed: true },
        { title: 'Pass written exam', completed: false },
        { title: 'Complete practical assessment', completed: false }
      ]
    }
  ]
}

// Pending approvals mock data
export function generatePendingApprovalsMockData() {
  return {
    all: [
      {
        id: '1',
        type: 'pto',
        requester: { first_name: 'Sarah', last_name: 'Johnson' },
        details: { start_date: '2025-01-20', end_date: '2025-01-22', total_hours: 24 },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'timesheet',
        requester: { first_name: 'Mike', last_name: 'Chen' },
        details: { date: '2025-01-14', hours: 8.5 },
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'shift_swap',
        requester: { first_name: 'Lisa', last_name: 'Anderson' },
        details: { shift_date: '2025-01-18', shift_time: '2:00 PM - 10:00 PM' },
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ],
    pto: 5,
    timesheets: 8,
    shifts: 2
  }
}
