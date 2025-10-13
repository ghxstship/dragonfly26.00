import { ModuleSchema, commonFields, type FieldSchema } from '../data-schemas'

const roleOptions = [
  { label: 'Owner', value: 'owner', color: '#dc2626' },
  { label: 'Admin', value: 'admin', color: '#ea580c' },
  { label: 'Member', value: 'member', color: '#2563eb' },
  { label: 'Guest', value: 'guest', color: '#64748b' },
]

const statusOptions = [
  { label: 'Active', value: 'active', color: '#16a34a' },
  { label: 'Pending', value: 'pending', color: '#f59e0b' },
  { label: 'Inactive', value: 'inactive', color: '#64748b' },
]

export const billingSchema: ModuleSchema = {
  moduleId: 'admin',
  tabId: 'admin-billing',
  tableName: 'billing_records',
  primaryKey: 'id',
  displayField: 'invoice_number',
  fields: [
    commonFields.id,
    { 
      id: 'invoice_number', 
      label: 'Invoice #', 
      type: 'text', 
      required: true, 
      showInList: true, 
      showInForm: false, 
      sortable: true, 
      order: 1 
    },
    { 
      id: 'amount', 
      label: 'Amount', 
      type: 'currency', 
      required: true, 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 2 
    },
    { 
      id: 'billing_date', 
      label: 'Billing Date', 
      type: 'date', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 3 
    },
    { 
      id: 'due_date', 
      label: 'Due Date', 
      type: 'date', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 4 
    },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'status', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 5, 
      options: [
        { label: 'Paid', value: 'paid', color: '#16a34a' },
        { label: 'Pending', value: 'pending', color: '#f59e0b' },
        { label: 'Overdue', value: 'overdue', color: '#dc2626' },
        { label: 'Cancelled', value: 'cancelled', color: '#64748b' },
      ]
    },
    { 
      id: 'plan', 
      label: 'Plan', 
      type: 'select', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 6, 
      options: [
        { label: 'Network', value: 'network' },
        { label: 'Crew', value: 'crew' },
        { label: 'Team', value: 'team' },
        { label: 'Pro', value: 'pro' },
        { label: 'Core', value: 'core' },
        { label: 'Executive', value: 'executive' },
      ]
    },
    { 
      id: 'payment_method', 
      label: 'Payment Method', 
      type: 'text', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 7 
    },
    commonFields.createdAt,
  ],
}

export const rolesPermissionsSchema: ModuleSchema = {
  moduleId: 'admin',
  tabId: 'admin-roles-permissions',
  tableName: 'roles',
  primaryKey: 'id',
  displayField: 'name',
  fields: [
    commonFields.id,
    { ...commonFields.name, placeholder: 'Role Name' },
    commonFields.description,
    { 
      id: 'level', 
      label: 'Access Level', 
      type: 'select', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 3, 
      options: roleOptions
    },
    { 
      id: 'permissions', 
      label: 'Permissions', 
      type: 'multiselect', 
      showInList: false, 
      showInDetail: true,
      showInForm: true, 
      order: 4, 
      options: [
        { label: 'View Projects', value: 'projects.view' },
        { label: 'Edit Projects', value: 'projects.edit' },
        { label: 'Delete Projects', value: 'projects.delete' },
        { label: 'Manage Users', value: 'users.manage' },
        { label: 'Manage Billing', value: 'billing.manage' },
        { label: 'Manage Settings', value: 'settings.manage' },
      ]
    },
    { 
      id: 'user_count', 
      label: 'Users', 
      type: 'number', 
      showInList: true, 
      showInDetail: true,
      showInForm: false, 
      order: 5 
    },
    { 
      id: 'is_default', 
      label: 'Default Role', 
      type: 'toggle', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 6 
    },
    commonFields.createdAt,
  ],
}

export const securitySchema: ModuleSchema = {
  moduleId: 'admin',
  tabId: 'admin-security',
  tableName: 'security_logs',
  primaryKey: 'id',
  displayField: 'event',
  fields: [
    commonFields.id,
    { 
      id: 'event', 
      label: 'Event', 
      type: 'text', 
      required: true, 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 1 
    },
    { 
      id: 'event_type', 
      label: 'Type', 
      type: 'select', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 2, 
      options: [
        { label: 'Login', value: 'login' },
        { label: 'Logout', value: 'logout' },
        { label: 'Password Change', value: 'password_change' },
        { label: 'Permission Change', value: 'permission_change' },
        { label: 'Failed Login', value: 'failed_login' },
        { label: 'Suspicious Activity', value: 'suspicious' },
      ]
    },
    { 
      id: 'user_id', 
      label: 'User', 
      type: 'user', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 3 
    },
    { 
      id: 'ip_address', 
      label: 'IP Address', 
      type: 'text', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 4 
    },
    { 
      id: 'user_agent', 
      label: 'User Agent', 
      type: 'text', 
      showInList: false, 
      showInDetail: true,
      showInForm: true, 
      order: 5 
    },
    { 
      id: 'severity', 
      label: 'Severity', 
      type: 'select', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      sortable: true, 
      order: 6, 
      options: [
        { label: 'Low', value: 'low', color: '#64748b' },
        { label: 'Medium', value: 'medium', color: '#f59e0b' },
        { label: 'High', value: 'high', color: '#ea580c' },
        { label: 'Critical', value: 'critical', color: '#dc2626' },
      ]
    },
    commonFields.createdAt,
  ],
}

export const membersSchema: ModuleSchema = {
  moduleId: 'admin',
  tabId: 'admin-members',
  tableName: 'members',
  primaryKey: 'id',
  displayField: 'name',
  fields: [
    commonFields.id,
    commonFields.name,
    { 
      id: 'email', 
      label: 'Email', 
      type: 'email', 
      required: true, 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 2 
    },
    { 
      id: 'role', 
      label: 'Role', 
      type: 'select', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 3, 
      options: roleOptions
    },
    { 
      id: 'status', 
      label: 'Status', 
      type: 'status', 
      showInList: true, 
      showInDetail: true,
      showInForm: true, 
      order: 4, 
      options: statusOptions
    },
    { 
      id: 'last_active', 
      label: 'Last Active', 
      type: 'datetime', 
      showInList: true, 
      showInDetail: true,
      showInForm: false, 
      sortable: true, 
      order: 5 
    },
    { 
      id: 'invited_by', 
      label: 'Invited By', 
      type: 'user', 
      showInList: false, 
      showInDetail: true,
      showInForm: false, 
      order: 6 
    },
    commonFields.createdAt,
  ],
}
