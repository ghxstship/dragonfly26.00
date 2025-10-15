/**
 * Mock Data for Projects/Productions Module
 */

export const mockProductions = [
  {
    id: 'demo-prod-1',
    name: 'Summer Music Festival 2025',
    description: 'Annual outdoor music festival featuring multiple stages and artists',
    status: 'in_progress',
    start_date: new Date(Date.now() + 5184000000).toISOString(), // 60 days from now
    end_date: new Date(Date.now() + 5443200000).toISOString(), // 63 days from now
    budget: 250000,
    spent: 165000,
    location: 'Central Park, NY',
    client: { name: 'Festival Productions Inc.' },
    manager: { name: 'John Doe' },
    team_members: 45,
    progress: 66,
    workspace_id: 'demo-workspace',
    created_at: new Date(Date.now() - 7776000000).toISOString(),
  },
  {
    id: 'demo-prod-2',
    name: 'Corporate Gala 2025',
    description: 'High-end corporate event with AV production',
    status: 'in_progress',
    start_date: new Date(Date.now() + 2592000000).toISOString(),
    end_date: new Date(Date.now() + 2678400000).toISOString(),
    budget: 85000,
    spent: 32000,
    location: 'Convention Center',
    client: { name: 'TechCorp Events' },
    manager: { name: 'Jane Smith' },
    team_members: 18,
    progress: 38,
    workspace_id: 'demo-workspace',
    created_at: new Date(Date.now() - 5184000000).toISOString(),
  },
  {
    id: 'demo-prod-3',
    name: 'Theater Revival',
    description: 'Broadway production technical setup',
    status: 'planning',
    start_date: new Date(Date.now() + 7776000000).toISOString(),
    end_date: new Date(Date.now() + 15552000000).toISOString(),
    budget: 500000,
    spent: 0,
    location: 'Broadway Theater',
    client: { name: 'Broadway Theater Group' },
    manager: { name: 'Bob Wilson' },
    team_members: 8,
    progress: 5,
    workspace_id: 'demo-workspace',
    created_at: new Date(Date.now() - 2592000000).toISOString(),
  },
]

export const mockProjectTasks = [
  {
    id: 'demo-task-1',
    title: 'Finalize stage layout and rigging plot',
    description: 'Complete technical drawings for main stage rigging',
    status: 'in_progress',
    priority: 'high',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    assigned_to: { name: 'Mike Chen', id: 'demo-user-4' },
    production_id: 'demo-prod-1',
    production: { name: 'Summer Music Festival 2025' },
    created_by: 'demo-user-1',
    workspace_id: 'demo-workspace',
  },
  {
    id: 'demo-task-2',
    title: 'Order LED wall panels',
    description: 'Purchase order for main stage LED displays',
    status: 'pending',
    priority: 'high',
    due_date: new Date(Date.now() + 259200000).toISOString(),
    assigned_to: { name: 'Sarah Lee', id: 'demo-user-5' },
    production_id: 'demo-prod-1',
    production: { name: 'Summer Music Festival 2025' },
    created_by: 'demo-user-1',
    workspace_id: 'demo-workspace',
  },
]

export const mockMilestones = [
  {
    id: 'demo-milestone-1',
    title: 'Load-In Complete',
    date: new Date(Date.now() + 5097600000).toISOString(),
    status: 'upcoming',
    production_id: 'demo-prod-1',
    production: { name: 'Summer Music Festival 2025' },
  },
  {
    id: 'demo-milestone-2',
    title: 'Technical Rehearsal',
    date: new Date(Date.now() + 5184000000).toISOString(),
    status: 'upcoming',
    production_id: 'demo-prod-1',
    production: { name: 'Summer Music Festival 2025' },
  },
]
