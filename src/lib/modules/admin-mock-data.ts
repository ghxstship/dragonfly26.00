import type { DataItem } from "@/types"

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateAdminMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'overview':
      return generateOverviewData(count)
    case 'organization':
      return generateOrganizationData(count)
    case 'invite':
      return generateInviteData(count)
    case 'users':
      return generateUsersData(count)
    case 'roles':
      return generateRolesData(count)
    case 'permissions':
      return generatePermissionsData(count)
    case 'workspaces':
      return generateWorkspacesData(count)
    case 'teams':
      return generateTeamsData(count)
    case 'integrations':
      return generateIntegrationsData(count)
    case 'webhooks':
      return generateWebhooksData(count)
    case 'api-tokens':
      return generateAPITokensData(count)
    case 'audit-logs':
      return generateAuditLogsData(count)
    case 'billing':
      return generateBillingData(count)
    default:
      return generateOverviewData(count)
  }
}

function generateOverviewData(count: number): DataItem[] {
  const metrics = [
    "Total Active Users",
    "Total Workspaces",
    "Storage Used",
    "API Calls This Month",
    "Active Integrations",
    "Pending Invitations"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `admin-metric-${i + 1}`,
    name: metrics[i % metrics.length],
    description: "Organization overview metric",
    status: "active",
    priority: "normal",
    assignee: "System",
    assignee_name: "System",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["admin", "metric"],
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateOrganizationData(count: number): DataItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `org-${i + 1}`,
    name: `Organization ${i + 1}`,
    description: "Organization profile and settings",
    status: "active",
    priority: "high",
    assignee: "person-1",
    assignee_name: "Admin",
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    tags: ["organization", "settings"],
    comments_count: Math.floor(Math.random() * 5),
    attachments_count: Math.floor(Math.random() * 3),
  }))
}

function generateInviteData(count: number): DataItem[] {
  const emails = Array.from({ length: count }, (_, i) => `user${i + 1}@example.com`)
  const statuses = ["pending", "accepted", "expired", "cancelled"]
  const roles = ["admin", "manager", "member", "viewer"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `invite-${i + 1}`,
    email: emails[i],
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    invited_by: "person-1",
    invited_at: getRandomPastDate(30),
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    accepted_at: statuses[i % statuses.length] === "accepted" ? getRandomPastDate(20) : null,
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateUsersData(count: number): DataItem[] {
  const firstNames = ["John", "Jane", "Mike", "Sarah", "David", "Emily", "Robert", "Lisa", "James", "Maria"]
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez"]
  const roles = ["admin", "manager", "member", "viewer"]
  const statuses = ["active", "inactive", "suspended"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `user-${i + 1}`,
    email: `${firstNames[i % firstNames.length].toLowerCase()}.${lastNames[i % lastNames.length].toLowerCase()}@example.com`,
    first_name: firstNames[i % firstNames.length],
    last_name: lastNames[i % lastNames.length],
    role: roles[i % roles.length],
    status: statuses[i % statuses.length],
    last_login: getRandomPastDate(7),
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateRolesData(count: number): DataItem[] {
  const roleNames = ["Administrator", "Production Manager", "Finance Manager", "Team Lead", "Crew Member", "Client", "Vendor", "Guest"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `role-${i + 1}`,
    name: roleNames[i % roleNames.length],
    description: `Role with specific permissions for ${roleNames[i % roleNames.length].toLowerCase()}`,
    permissions_count: Math.floor(Math.random() * 50) + 10,
    users_count: Math.floor(Math.random() * 20),
    is_system_role: i < 4,
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generatePermissionsData(count: number): DataItem[] {
  const permissions = [
    "projects.create",
    "projects.read",
    "projects.update",
    "projects.delete",
    "finance.read",
    "finance.update",
    "users.manage",
    "settings.manage",
    "reports.create",
    "assets.manage"
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `permission-${i + 1}`,
    name: permissions[i % permissions.length],
    description: `Permission to ${permissions[i % permissions.length].split('.')[1]} ${permissions[i % permissions.length].split('.')[0]}`,
    resource: permissions[i % permissions.length].split('.')[0],
    action: permissions[i % permissions.length].split('.')[1],
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateWorkspacesData(count: number): DataItem[] {
  const workspaceNames = ["Production Workspace", "Finance Workspace", "Operations Workspace", "Creative Workspace", "Admin Workspace"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `workspace-${i + 1}`,
    name: workspaceNames[i % workspaceNames.length],
    description: "Collaborative workspace for team",
    members_count: Math.floor(Math.random() * 50) + 5,
    projects_count: Math.floor(Math.random() * 20),
    status: "active",
    created_by: "person-1",
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateTeamsData(count: number): DataItem[] {
  const teamNames = ["Audio Team", "Lighting Team", "Video Team", "Stage Management", "Production Team", "Finance Team"]
  const departments = ["Technical", "Creative", "Operations", "Business", "Support"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    name: teamNames[i % teamNames.length],
    description: `Team for ${teamNames[i % teamNames.length].toLowerCase()}`,
    team_type: "functional",
    department: departments[i % departments.length],
    lead_id: `person-${(i % 5) + 1}`,
    member_count: Math.floor(Math.random() * 15) + 3,
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateIntegrationsData(count: number): DataItem[] {
  const integrations = ["Slack", "Google Workspace", "Microsoft 365", "Zoom", "QuickBooks", "Xero", "Stripe", "PayPal", "Dropbox", "Box"]
  const statuses = ["active", "inactive", "error"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `integration-${i + 1}`,
    name: integrations[i % integrations.length],
    description: `Integration with ${integrations[i % integrations.length]}`,
    status: statuses[i % statuses.length],
    api_calls_count: Math.floor(Math.random() * 10000),
    last_sync: getRandomPastDate(1),
    enabled: i % 4 !== 0,
    created_at: getRandomPastDate(180),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateWebhooksData(count: number): DataItem[] {
  const events = ["production.created", "event.updated", "invoice.paid", "user.invited", "task.completed"]
  const statuses = ["active", "inactive", "failed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `webhook-${i + 1}`,
    name: `Webhook ${i + 1}`,
    url: `https://example.com/webhooks/endpoint-${i + 1}`,
    events: [events[i % events.length]],
    status: statuses[i % statuses.length],
    last_triggered: getRandomPastDate(7),
    success_count: Math.floor(Math.random() * 500),
    failure_count: Math.floor(Math.random() * 10),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateAPITokensData(count: number): DataItem[] {
  const scopes = ["read", "write", "admin"]
  const statuses = ["active", "revoked", "expired"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `token-${i + 1}`,
    name: `API Token ${i + 1}`,
    token: `tok_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    scopes: [scopes[i % scopes.length]],
    status: statuses[i % statuses.length],
    last_used: getRandomPastDate(7),
    expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    created_by: "person-1",
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateAuditLogsData(count: number): DataItem[] {
  const actions = ["user.login", "production.created", "file.uploaded", "settings.updated", "user.invited", "role.modified"]
  const users = ["person-1", "person-2", "person-3"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `audit-${i + 1}`,
    action: actions[i % actions.length],
    user_id: users[i % users.length],
    resource_type: actions[i % actions.length].split('.')[0],
    resource_id: `resource-${i + 1}`,
    ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}

function generateBillingData(count: number): DataItem[] {
  const plans = ["Starter", "Professional", "Enterprise"]
  const statuses = ["active", "past_due", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `billing-${i + 1}`,
    plan: plans[i % plans.length],
    status: statuses[i % statuses.length],
    amount: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    currency: "USD",
    billing_cycle: i % 2 === 0 ? "monthly" : "annual",
    next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    payment_method: "card",
    created_at: getRandomPastDate(365),
    updated_at: new Date().toISOString(),
    comments_count: 0,
    attachments_count: 0,
  }))
}
