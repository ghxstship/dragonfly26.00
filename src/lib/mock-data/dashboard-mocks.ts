/**
 * Centralized Mock Data for Dashboard Module
 * Used when NEXT_PUBLIC_DEMO_MODE=true
 */

export const mockEvents = [
  {
    id: 'demo-event-1',
    title: 'Tech Rehearsal - Summer Festival',
    name: 'Tech Rehearsal',
    start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    end_time: new Date(Date.now() + 14400000).toISOString(), // 4 hours from now
    location_name: 'Main Stage',
    location: { name: 'Main Stage' },
    type: 'Rehearsal',
    attendees: [],
    status: 'confirmed',
    is_virtual: false,
    created_by: 'demo-user',
    workspace_id: 'demo-workspace',
  },
  {
    id: 'demo-event-2',
    title: 'Production Meeting',
    name: 'Production Meeting',
    start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    end_time: new Date(Date.now() + 90000000).toISOString(),
    location_name: 'Conference Room A',
    location: { name: 'Conference Room A' },
    type: 'Meeting',
    attendees: [],
    status: 'confirmed',
    is_virtual: false,
    created_by: 'demo-user',
    workspace_id: 'demo-workspace',
  },
]

export const mockTasks = [
  {
    id: 'demo-task-1',
    title: 'Finalize lighting plot for main stage',
    name: 'Finalize lighting plot',
    due_date: new Date(Date.now() + 3600000).toISOString(),
    priority: 'high',
    status: 'in_progress',
    created_by: 'demo-user',
    production: { name: 'Summer Music Festival' },
    workspace_id: 'demo-workspace',
  },
  {
    id: 'demo-task-2',
    title: 'Review equipment rental quotes',
    name: 'Review quotes',
    due_date: new Date(Date.now() + 7200000).toISOString(),
    priority: 'high',
    status: 'pending',
    created_by: 'other-user',
    production: { name: 'Corporate Gala' },
    workspace_id: 'demo-workspace',
  },
]

export const mockJobs = [
  {
    id: 'demo-job-1',
    title: 'Technical Director - Summer Music Festival',
    role: 'Technical Director',
    type: 'Contract',
    status: 'active',
    start_date: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    end_date: new Date(Date.now() + 2592000000).toISOString(), // 30 days from now
    location: 'Central Park, NY',
    rate: '$8,500/week',
    company: { name: 'Festival Productions Inc.' },
    progress: 65,
    workspace_id: 'demo-workspace',
  },
]

export const mockAssets = [
  {
    id: 'demo-asset-1',
    name: 'Shure SM58 Microphone',
    title: 'Shure SM58',
    category: { name: 'Audio Equipment' },
    ownership_type: 'Owned',
    quantity: 12,
    condition: 'Good',
    last_used: new Date(Date.now() - 86400000).toISOString(),
    current_production: 'Available',
    purchase_price: 99,
    location: { name: 'Equipment Storage' },
    workspace_id: 'demo-workspace',
  },
]

export const mockExpenses = [
  {
    id: 'demo-expense-1',
    title: 'Equipment Rental & Supplies',
    description: 'Lighting equipment rental for venue',
    amount: 2450,
    category: { name: 'Equipment' },
    status: 'pending',
    submitted_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    production: { name: 'Summer Music Festival' },
    receipts: ['receipt1.pdf'],
    workspace_id: 'demo-workspace',
  },
]

export const mockOrders = [
  {
    id: 'demo-order-1',
    item_name: 'Wireless Microphone System Bundle',
    title: 'Wireless Mic System',
    quantity: 4,
    unit_price: 899,
    total_price: 3596,
    status: 'shipped',
    ordered_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    vendor: { name: 'B&H Photo Video' },
    production: { name: 'Corporate Gala' },
    tracking_number: 'TRK123456789',
    workspace_id: 'demo-workspace',
  },
]

export const mockAdvances = [
  {
    id: 'demo-advance-1',
    title: 'Lighting Package - Summer Festival',
    description: 'Advance request for lighting equipment package',
    type: 'Equipment',
    status: 'approved',
    quantity: 1,
    created_at: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
    approved_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    date_needed: new Date(Date.now() + 86400000).toISOString(),
    production: { name: 'Summer Music Festival' },
    approver: { name: 'Production Manager' },
    workspace_id: 'demo-workspace',
  },
]

export const mockFiles = [
  {
    id: 'demo-file-1',
    name: 'Summer_Festival_Tech_Rider.pdf',
    title: 'Tech Rider',
    size: 2457600, // 2.4 MB
    type: 'application/pdf',
    uploaded_at: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
    uploaded_by: { name: 'Demo User' },
    production: { name: 'Summer Music Festival' },
    workspace_id: 'demo-workspace',
  },
]

export const mockReports = [
  {
    id: 'demo-report-1',
    name: 'Personal Task Performance',
    title: 'Task Performance Report',
    type: 'Performance',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    description: 'Analysis of completed tasks and productivity metrics',
    workspace_id: 'demo-workspace',
  },
]

export const mockTravels = [
  {
    id: 'demo-travel-1',
    title: 'Site Survey - Theater Revival',
    purpose: 'Site survey and venue assessment',
    destination: 'Broadway District, NY',
    departure_date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
    return_date: new Date(Date.now() + 691200000).toISOString(), // 8 days from now
    status: 'approved',
    flight_details: {
      outbound: 'AA1234 - 8:00 AM',
      return: 'AA5678 - 6:00 PM',
    },
    hotel_details: 'Manhattan Hotel, Confirmed',
    production: { name: 'Theater Revival' },
    workspace_id: 'demo-workspace',
  },
]
