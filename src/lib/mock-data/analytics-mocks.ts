/**
 * Mock Data for Analytics Module
 */

export const mockAnalyticsData = {
  overview: {
    total_projects: 12,
    active_projects: 3,
    total_revenue: 2450000,
    total_expenses: 1875000,
    profit_margin: 23.5,
    team_utilization: 78.3,
    client_satisfaction: 4.7,
  },
  
  revenueByMonth: [
    { month: 'Jan', revenue: 185000, expenses: 142000, profit: 43000 },
    { month: 'Feb', revenue: 210000, expenses: 165000, profit: 45000 },
    { month: 'Mar', revenue: 195000, expenses: 148000, profit: 47000 },
    { month: 'Apr', revenue: 225000, expenses: 172000, profit: 53000 },
    { month: 'May', revenue: 240000, expenses: 185000, profit: 55000 },
    { month: 'Jun', revenue: 265000, expenses: 198000, profit: 67000 },
  ],
  
  projectsByStatus: [
    { status: 'Planning', count: 4, percentage: 33 },
    { status: 'In Progress', count: 3, percentage: 25 },
    { status: 'Completed', count: 5, percentage: 42 },
  ],
  
  topClients: [
    { name: 'Festival Productions Inc.', projects: 5, revenue: 850000 },
    { name: 'TechCorp Events', projects: 3, revenue: 425000 },
    { name: 'Broadway Theater Group', projects: 2, revenue: 675000 },
    { name: 'Live Nation', projects: 2, revenue: 500000 },
  ],
  
  teamPerformance: [
    { name: 'Alex Rodriguez', role: 'Lighting Designer', utilization: 92, projects: 6, rating: 4.9 },
    { name: 'Maria Garcia', role: 'Audio Engineer', utilization: 88, projects: 5, rating: 4.8 },
    { name: 'James Kim', role: 'Video Engineer', utilization: 75, projects: 4, rating: 4.6 },
    { name: 'Sarah Lee', role: 'Stage Manager', utilization: 81, projects: 7, rating: 4.7 },
  ],
  
  equipmentUsage: [
    { category: 'Lighting', utilization: 85, items: 145, revenue: 385000 },
    { category: 'Audio', utilization: 78, items: 289, revenue: 425000 },
    { category: 'Video', utilization: 92, items: 78, revenue: 485000 },
    { category: 'Rigging', utilization: 68, items: 456, revenue: 225000 },
  ],
  
  expensesByCategory: [
    { category: 'Labor', amount: 875000, percentage: 46.7 },
    { category: 'Equipment Rental', amount: 425000, percentage: 22.7 },
    { category: 'Transportation', amount: 185000, percentage: 9.9 },
    { category: 'Venue Costs', amount: 225000, percentage: 12.0 },
    { category: 'Other', amount: 165000, percentage: 8.8 },
  ],
  
  projectTimeline: [
    {
      project: 'Summer Music Festival 2025',
      start: new Date(Date.now() - 7776000000).toISOString(),
      end: new Date(Date.now() + 5443200000).toISOString(),
      progress: 66,
      status: 'on_track',
    },
    {
      project: 'Corporate Gala 2025',
      start: new Date(Date.now() - 5184000000).toISOString(),
      end: new Date(Date.now() + 2678400000).toISOString(),
      progress: 38,
      status: 'on_track',
    },
    {
      project: 'Theater Revival',
      start: new Date(Date.now() - 2592000000).toISOString(),
      end: new Date(Date.now() + 15552000000).toISOString(),
      progress: 5,
      status: 'planning',
    },
  ],
}

export const mockReportTemplates = [
  {
    id: 'template-1',
    name: 'Monthly Financial Summary',
    description: 'Revenue, expenses, and profit analysis by month',
    category: 'Financial',
    fields: ['revenue', 'expenses', 'profit_margin', 'project_count'],
  },
  {
    id: 'template-2',
    name: 'Project Performance Report',
    description: 'Detailed analysis of project metrics and KPIs',
    category: 'Projects',
    fields: ['budget_variance', 'timeline_status', 'team_utilization', 'client_satisfaction'],
  },
  {
    id: 'template-3',
    name: 'Equipment Utilization Report',
    description: 'Asset usage and revenue generation by category',
    category: 'Assets',
    fields: ['utilization_rate', 'revenue_per_item', 'maintenance_costs'],
  },
]
