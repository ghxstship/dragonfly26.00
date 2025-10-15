/**
 * Mock Data for Admin Module
 */

export const mockMembers = [
  {
    id: 'demo-member-1',
    user_id: 'demo-user-1',
    workspace_id: 'demo-workspace',
    role: 'phantom',
    status: 'active',
    joined_at: new Date(Date.now() - 15552000000).toISOString(), // 180 days ago
    profile: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      avatar_url: null,
      job_title: 'Production Director'
    }
  },
  {
    id: 'demo-member-2',
    user_id: 'demo-user-2',
    workspace_id: 'demo-workspace',
    role: 'aviator',
    status: 'active',
    joined_at: new Date(Date.now() - 12960000000).toISOString(), // 150 days ago
    profile: {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com',
      avatar_url: null,
      job_title: 'Stage Manager'
    }
  },
  {
    id: 'demo-member-3',
    user_id: 'demo-user-3',
    workspace_id: 'demo-workspace',
    role: 'raider',
    status: 'active',
    joined_at: new Date(Date.now() - 8640000000).toISOString(), // 100 days ago
    profile: {
      first_name: 'Bob',
      last_name: 'Wilson',
      email: 'bob.wilson@example.com',
      avatar_url: null,
      job_title: 'Audio Technician'
    }
  },
]

export const mockBillingData = {
  subscription: {
    plan: 'core',
    status: 'active',
    current_period_start: new Date(Date.now() - 1296000000).toISOString(),
    current_period_end: new Date(Date.now() + 1296000000).toISOString(),
    cancel_at_period_end: false,
  },
  usage: {
    members: 12,
    storage_gb: 45.2,
    api_calls: 125000,
  },
  invoices: [
    {
      id: 'inv_demo_1',
      amount: 99,
      status: 'paid',
      created: new Date(Date.now() - 2592000000).toISOString(),
      pdf_url: '#',
    }
  ]
}

export const mockApiTokens = [
  {
    id: 'token_demo_1',
    name: 'Production API Key',
    prefix: 'sk_live_',
    created_at: new Date(Date.now() - 5184000000).toISOString(),
    last_used: new Date(Date.now() - 86400000).toISOString(),
    scopes: ['read', 'write'],
  }
]

export const mockAuditLogs = [
  {
    id: 'log_demo_1',
    action: 'member.invited',
    actor: { name: 'John Doe', email: 'john.doe@example.com' },
    target: 'jane.smith@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    ip_address: '192.168.1.1',
  },
  {
    id: 'log_demo_2',
    action: 'settings.updated',
    actor: { name: 'Jane Smith', email: 'jane.smith@example.com' },
    target: 'workspace_settings',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    ip_address: '192.168.1.2',
  }
]
