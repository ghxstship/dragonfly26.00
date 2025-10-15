// =============================================
// SETTINGS MODULE - MOCK DATA
// Comprehensive mock data for settings module
// =============================================

export const mockThemes = [
  {
    id: '1',
    name: 'Light',
    value: 'light',
    preview: '/themes/light-preview.png',
    isPremium: false,
  },
  {
    id: '2',
    name: 'Dark',
    value: 'dark',
    preview: '/themes/dark-preview.png',
    isPremium: false,
  },
  {
    id: '3',
    name: 'Auto',
    value: 'system',
    preview: '/themes/auto-preview.png',
    isPremium: false,
  },
  {
    id: '4',
    name: 'Nord',
    value: 'nord',
    preview: '/themes/nord-preview.png',
    isPremium: true,
  },
  {
    id: '5',
    name: 'Dracula',
    value: 'dracula',
    preview: '/themes/dracula-preview.png',
    isPremium: true,
  },
]

export const mockIntegrations = [
  {
    id: '1',
    name: 'Slack',
    description: 'Team communication and notifications',
    category: 'communication',
    icon: '/integrations/slack.svg',
    status: 'connected',
    isEnabled: true,
    connectedAt: '2024-09-15T10:30:00Z',
    settings: {
      channelId: 'C1234567890',
      channelName: '#general',
      notifyOnUpdates: true,
    },
  },
  {
    id: '2',
    name: 'Google Drive',
    description: 'Cloud storage and file sharing',
    category: 'storage',
    icon: '/integrations/google-drive.svg',
    status: 'connected',
    isEnabled: true,
    connectedAt: '2024-08-20T14:15:00Z',
    settings: {
      folderId: 'folder-abc-123',
      autoSync: true,
    },
  },
  {
    id: '3',
    name: 'Stripe',
    description: 'Payment processing',
    category: 'finance',
    icon: '/integrations/stripe.svg',
    status: 'connected',
    isEnabled: true,
    connectedAt: '2024-07-10T09:00:00Z',
    settings: {
      mode: 'live',
      webhooksEnabled: true,
    },
  },
  {
    id: '4',
    name: 'QuickBooks',
    description: 'Accounting and bookkeeping',
    category: 'finance',
    icon: '/integrations/quickbooks.svg',
    status: 'disconnected',
    isEnabled: false,
    connectedAt: null,
    settings: {},
  },
  {
    id: '5',
    name: 'Zoom',
    description: 'Video conferencing',
    category: 'communication',
    icon: '/integrations/zoom.svg',
    status: 'connected',
    isEnabled: true,
    connectedAt: '2024-09-01T11:45:00Z',
    settings: {
      autoRecording: true,
      defaultMeetingType: 'instant',
    },
  },
  {
    id: '6',
    name: 'GitHub',
    description: 'Code repository and version control',
    category: 'development',
    icon: '/integrations/github.svg',
    status: 'connected',
    isEnabled: false,
    connectedAt: '2024-06-15T16:20:00Z',
    settings: {
      repository: 'company/project',
      branch: 'main',
    },
  },
  {
    id: '7',
    name: 'Jira',
    description: 'Project management and issue tracking',
    category: 'productivity',
    icon: '/integrations/jira.svg',
    status: 'available',
    isEnabled: false,
    connectedAt: null,
    settings: {},
  },
  {
    id: '8',
    name: 'Salesforce',
    description: 'CRM and customer management',
    category: 'sales',
    icon: '/integrations/salesforce.svg',
    status: 'available',
    isEnabled: false,
    connectedAt: null,
    settings: {},
  },
]

export const mockAutomations = [
  {
    id: '1',
    name: 'Daily Status Report',
    description: 'Send daily project status report to team',
    trigger: 'schedule',
    schedule: '0 9 * * *', // Daily at 9 AM
    isActive: true,
    actions: [
      {
        type: 'generate_report',
        config: { reportType: 'status', include: ['tasks', 'milestones'] },
      },
      {
        type: 'send_email',
        config: { recipients: ['team@example.com'], subject: 'Daily Status Update' },
      },
    ],
    lastRun: '2024-10-14T09:00:00Z',
    nextRun: '2024-10-15T09:00:00Z',
    runsCount: 145,
  },
  {
    id: '2',
    name: 'Invoice Reminder',
    description: 'Send reminder for unpaid invoices',
    trigger: 'schedule',
    schedule: '0 10 * * MON', // Weekly on Monday at 10 AM
    isActive: true,
    actions: [
      {
        type: 'find_unpaid_invoices',
        config: { daysOverdue: 7 },
      },
      {
        type: 'send_notification',
        config: { channel: 'slack', message: 'You have unpaid invoices' },
      },
    ],
    lastRun: '2024-10-07T10:00:00Z',
    nextRun: '2024-10-14T10:00:00Z',
    runsCount: 24,
  },
  {
    id: '3',
    name: 'Asset Maintenance Alert',
    description: 'Alert when asset maintenance is due',
    trigger: 'event',
    event: 'asset.maintenance_due',
    isActive: true,
    actions: [
      {
        type: 'create_task',
        config: { assignTo: 'maintenance-team', priority: 'high' },
      },
      {
        type: 'send_notification',
        config: { channel: 'email', template: 'maintenance-due' },
      },
    ],
    lastRun: '2024-10-12T14:30:00Z',
    nextRun: null,
    runsCount: 38,
  },
  {
    id: '4',
    name: 'New Team Member Onboarding',
    description: 'Automate onboarding checklist for new hires',
    trigger: 'event',
    event: 'team_member.created',
    isActive: true,
    actions: [
      {
        type: 'create_checklist',
        config: { template: 'onboarding', assignTo: 'new_member' },
      },
      {
        type: 'send_welcome_email',
        config: { template: 'welcome' },
      },
      {
        type: 'notify_hr',
        config: { channel: 'slack' },
      },
    ],
    lastRun: '2024-10-10T08:15:00Z',
    nextRun: null,
    runsCount: 12,
  },
  {
    id: '5',
    name: 'Budget Threshold Alert',
    description: 'Alert when project budget reaches 80%',
    trigger: 'condition',
    condition: 'budget_percentage >= 0.8',
    isActive: false,
    actions: [
      {
        type: 'send_alert',
        config: { recipients: ['pm@example.com', 'finance@example.com'], severity: 'warning' },
      },
    ],
    lastRun: '2024-09-28T16:45:00Z',
    nextRun: null,
    runsCount: 5,
  },
]

export const mockAccountSettings = {
  userId: 'user-123',
  email: 'john.doe@example.com',
  name: 'John Doe',
  username: 'johndoe',
  phone: '+1 (555) 123-4567',
  timezone: 'America/Los_Angeles',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
  currency: 'USD',
  avatar: '/avatars/john-doe.jpg',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: true,
  sessionTimeout: 60, // minutes
  emailNotifications: {
    marketing: false,
    productUpdates: true,
    securityAlerts: true,
    weeklyDigest: true,
  },
  pushNotifications: {
    mentions: true,
    assignments: true,
    comments: true,
    deadlines: true,
  },
}

export const mockTeamSettings = {
  teamId: 'team-456',
  name: 'Production Team',
  avatar: '/teams/production-team.jpg',
  description: 'Main production team for live events',
  memberCount: 24,
  adminCount: 3,
  settings: {
    defaultPermissions: 'member',
    invitesRequireApproval: true,
    allowGuestAccess: false,
    maxGuestsPerMember: 3,
    dataRetentionDays: 365,
  },
  features: {
    advancedReporting: true,
    customBranding: true,
    apiAccess: true,
    ssoEnabled: true,
    prioritySupport: true,
  },
}

export const mockBillingSettings = {
  subscriptionId: 'sub-789',
  plan: 'Enterprise',
  status: 'active',
  billingCycle: 'annual',
  currentPeriodStart: '2024-01-01T00:00:00Z',
  currentPeriodEnd: '2024-12-31T23:59:59Z',
  nextBillingDate: '2025-01-01T00:00:00Z',
  amount: 9999.00,
  currency: 'USD',
  paymentMethod: {
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2026,
  },
  billingEmail: 'billing@example.com',
  billingAddress: {
    line1: '123 Main St',
    line2: 'Suite 100',
    city: 'Los Angeles',
    state: 'CA',
    postalCode: '90001',
    country: 'US',
  },
  invoices: [
    {
      id: 'inv-001',
      date: '2024-01-01T00:00:00Z',
      amount: 9999.00,
      status: 'paid',
      pdfUrl: '/invoices/2024-01-01.pdf',
    },
    {
      id: 'inv-002',
      date: '2023-01-01T00:00:00Z',
      amount: 9999.00,
      status: 'paid',
      pdfUrl: '/invoices/2023-01-01.pdf',
    },
  ],
  usage: {
    users: 24,
    storage: 150.5, // GB
    apiCalls: 125430,
    limits: {
      users: 100,
      storage: 1000, // GB
      apiCalls: 1000000,
    },
  },
}

export const mockAppearanceSettings = {
  theme: 'dark',
  accentColor: '#8b5cf6',
  fontSize: 'medium',
  density: 'comfortable',
  sidebarPosition: 'left',
  sidebarCollapsed: false,
  showAvatars: true,
  showTimestamps: true,
  animationsEnabled: true,
  customCSS: '',
}

// Helper function to simulate async data loading
export const simulateDelay = (ms: number = 500) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
