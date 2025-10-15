// Core Types
export type UserRole = 'owner' | 'admin' | 'member' | 'guest'
export type ItemPermission = 'can_edit' | 'can_comment' | 'can_view'
export type ViewPermission = 'private' | 'team' | 'public'
export type SubscriptionTier = 'network' | 'crew' | 'team' | 'pro' | 'core' | 'executive'
export type ViewType =
  | 'list'
  | 'board'
  | 'table'
  | 'calendar'
  | 'timeline'
  | 'workload'
  | 'map'
  | 'mind-map'
  | 'form'
  | 'activity'
  | 'box'
  | 'embed'
  | 'chat'
  | 'dashboard'
  | 'doc'
  | 'financial'
  | 'portfolio'
  | 'pivot'

export type ThemeMode = 'light' | 'dark' | 'high-contrast'
export type Density = 'compact' | 'comfortable' | 'spacious'
export type CalendarMode = 'month' | 'week' | 'day' | 'agenda'
export type Priority = 'urgent' | 'high' | 'normal' | 'low'

// User & Organization
export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url?: string
  subscription_tier: SubscriptionTier
  subscription_status: 'active' | 'past_due' | 'canceled' | 'trialing'
  stripe_customer_id?: string
  stripe_subscription_id?: string
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  organization_id: string
  name: string
  description?: string
  color?: string
  icon?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface OrganizationMember {
  id: string
  organization_id: string
  user_id: string
  role: UserRole
  invited_by?: string
  joined_at: string
  user?: User
}

// Modules
export type ModuleCategory = 'production' | 'network' | 'business' | 'intelligence'

export interface ModuleTab {
  id: string
  module_id: string
  name: string
  slug: string
  description?: string
  icon: string
  order: number
  enabled: boolean
  default_view?: ViewType
  available_views: ViewType[]
  color?: string
  badge?: number | string
}

export interface Module {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  category: ModuleCategory
  order: number
  enabled: boolean
  color?: string
  has_tabs?: boolean
  tabs?: ModuleTab[]
}

export interface ModuleConfig {
  id: string
  workspace_id: string
  module_id: string
  table_name: string
  enabled: boolean
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

// Generic Data Types
export interface DataItem {
  id: string
  [key: string]: any
  created_at: string
  updated_at: string
  created_by?: string
}

export interface CustomField {
  id: string
  workspace_id: string
  name: string
  type: CustomFieldType
  options?: any
  required: boolean
  order: number
  created_at: string
}

export type CustomFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'select'
  | 'multi-select'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone'
  | 'currency'
  | 'percent'
  | 'duration'
  | 'rating'
  | 'file'
  | 'user'
  | 'relation'

// Views
export interface View {
  id: string
  workspace_id: string
  module_id: string
  name: string
  type: ViewType
  config: ViewConfig
  permission: ViewPermission
  is_default: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface ViewConfig {
  columns?: ColumnConfig[]
  filters?: FilterConfig[]
  sorting?: SortConfig[]
  grouping?: GroupConfig[]
  layout?: Record<string, any>
  customization?: Record<string, any>
}

export interface ColumnConfig {
  id: string
  field: string
  label: string
  width?: number
  visible: boolean
  pinned?: 'left' | 'right'
  order: number
}

export interface FilterConfig {
  id: string
  field: string
  operator: FilterOperator
  value: any
  condition?: 'AND' | 'OR'
}

export type FilterOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'is_before'
  | 'is_after'
  | 'is_on'
  | 'is_between'
  | 'in'
  | 'not_in'

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
  order: number
}

export interface GroupConfig {
  field: string
  order: number
}

// Activity & Collaboration (See Phase 4 for full definitions)

export interface UserPresence {
  user_id: string
  workspace_id: string
  location: string
  cursor?: { x: number; y: number }
  last_seen: string
  user?: User
}

// Templates
export interface Template {
  id: string
  name: string
  description: string
  category: string
  module_type?: string
  view_type?: ViewType
  preview_url?: string
  price: number
  is_free: boolean
  vendor_id?: string
  downloads: number
  rating: number
  config: Record<string, any>
  created_at: string
}

// Stripe
export interface SubscriptionPlan {
  id: string
  name: string
  tier: SubscriptionTier
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  max_users?: number
  max_workspaces?: number
  stripe_price_id_monthly: string
  stripe_price_id_yearly: string
}

export interface MarketplaceProduct {
  id: string
  name: string
  description: string
  type: 'template' | 'integration' | 'addon'
  price: number
  vendor_id: string
  stripe_product_id: string
  stripe_price_id: string
  created_at: string
}

// UI State
export interface UIState {
  sidebarCollapsed: boolean
  rightSidebarOpen: boolean
  density: Density
  theme: ThemeMode
  accentColor: string
  currentWorkspace?: Workspace
  currentModule?: Module
  currentView?: View
}

// Notifications (See Phase 4 for full definition)

// =============================================
// PHASE 1: ADVANCED FEATURES
// =============================================

// Organization Settings (Admin-controlled)
export interface OrganizationSettings {
  id: string
  organization_id: string
  
  // Feature toggles
  enable_multiple_assignees: boolean
  enable_watchers: boolean
  enable_custom_statuses: boolean
  enable_dependencies: boolean
  enable_recurring_tasks: boolean
  enable_checklists: boolean
  
  // Limits
  max_assignees_per_item: number
  max_watchers_per_item: number
  max_checklist_items: number
  
  // Defaults
  default_assignee_behavior: 'manual' | 'round_robin' | 'least_busy'
  
  created_at: string
  updated_at: string
}

// Custom Statuses (Organization-level)
export interface CustomStatus {
  id: string
  organization_id: string
  workspace_id?: string
  name: string
  color: string
  type: 'open' | 'in_progress' | 'closed' | 'custom'
  icon?: string
  order: number
  is_default: boolean
  on_enter_action?: string
  on_exit_action?: string
  created_at: string
  updated_at: string
}

// Assignees
export interface ItemAssignee {
  id: string
  item_id: string
  item_type: string
  user_id: string
  assigned_by?: string
  assigned_at: string
  user?: User
}

// Watchers
export interface ItemWatcher {
  id: string
  item_id: string
  item_type: string
  user_id: string
  watch_type: 'all' | 'mentions' | 'status_changes'
  added_at: string
  user?: User
}

// Dependencies
export type DependencyType = 'blocks' | 'blocked_by' | 'relates_to' | 'duplicates' | 'parent_of' | 'child_of'

export interface Dependency {
  id: string
  from_item_id: string
  from_item_type: string
  to_item_id: string
  to_item_type: string
  dependency_type: DependencyType
  lag_days: number
  created_by: string
  created_at: string
}

// Checklists
export interface ChecklistTemplate {
  id: string
  organization_id: string
  name: string
  description?: string
  items: ChecklistItemData[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Checklist {
  id: string
  item_id: string
  item_type: string
  name: string
  order: number
  created_at: string
  items?: ChecklistItem[]
}

export interface ChecklistItem {
  id: string
  checklist_id: string
  parent_id?: string
  content: string
  completed: boolean
  assignee?: string
  due_date?: string
  order: number
  completed_by?: string
  completed_at?: string
  created_at: string
  updated_at: string
  children?: ChecklistItem[]
}

export interface ChecklistItemData {
  content: string
  completed: boolean
  order: number
}

export interface ChecklistProgress {
  completed: number
  total: number
  percentage: number
}

// Recurring Tasks
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'

export interface RecurrenceRule {
  id: string
  organization_id: string
  name: string
  frequency: RecurrenceFrequency
  interval: number
  by_weekday?: number[]
  by_monthday?: number
  by_setpos?: number
  by_month?: number
  cron_expression?: string
  created_at: string
}

export interface ItemRecurrence {
  id: string
  item_id: string
  item_type: string
  recurrence_rule_id?: string
  frequency?: RecurrenceFrequency
  interval: number
  by_weekday?: number[]
  end_date?: string
  end_after_occurrences?: number
  last_generated_at?: string
  next_occurrence_at?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringInstance {
  id: string
  original_item_id: string
  original_item_type: string
  instance_item_id: string
  instance_item_type: string
  occurrence_date: string
  created_at: string
}

// =============================================
// PHASE 2: ADVANCED FEATURES
// =============================================

// Automations
export type AutomationTriggerType = 
  | 'status_change'
  | 'field_updated'
  | 'item_created'
  | 'item_deleted'
  | 'date_reached'
  | 'assignee_changed'
  | 'time_elapsed'
  | 'checklist_completed'
  | 'dependency_completed'
  | 'comment_added'

export interface AutomationCondition {
  field: string
  operator: FilterOperator
  value: any
}

export interface AutomationAction {
  type: 'update_field' | 'assign_user' | 'send_notification' | 'create_item' | 'move_to_list' | 'add_comment'
  config: Record<string, any>
}

export interface Automation {
  id: string
  organization_id: string
  workspace_id?: string
  name: string
  description?: string
  is_active: boolean
  trigger_type: AutomationTriggerType
  trigger_config: Record<string, any>
  conditions: AutomationCondition[]
  actions: AutomationAction[]
  run_once_per_item: boolean
  delay_minutes: number
  execution_count: number
  last_executed_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface AutomationExecution {
  id: string
  automation_id: string
  item_id: string
  item_type: string
  status: 'success' | 'failed' | 'skipped'
  error_message?: string
  actions_performed?: Record<string, any>
  execution_time_ms?: number
  executed_at: string
}

// Goals & OKRs
export type GoalType = 'number' | 'currency' | 'percentage' | 'boolean' | 'task_completion'
export type GoalStatus = 'not_started' | 'on_track' | 'at_risk' | 'behind' | 'completed'
export type ProgressCalcMethod = 'manual' | 'auto_sum' | 'auto_avg' | 'linked_tasks'

export interface Goal {
  id: string
  organization_id: string
  workspace_id?: string
  parent_goal_id?: string
  name: string
  description?: string
  type: GoalType
  target_value?: number
  current_value: number
  unit?: string
  start_date: string
  end_date: string
  status: GoalStatus
  owner_id?: string
  linked_items: string[]
  progress_calc_method: ProgressCalcMethod
  is_public: boolean
  created_by: string
  created_at: string
  updated_at: string
  children?: Goal[]
  owner?: User
}

export interface GoalProgress {
  id: string
  goal_id: string
  value: number
  note?: string
  recorded_by?: string
  recorded_at: string
}

// Sprints
export type SprintStatus = 'planned' | 'active' | 'completed' | 'cancelled'

export interface Sprint {
  id: string
  workspace_id: string
  name: string
  goal?: string
  start_date: string
  end_date: string
  status: SprintStatus
  team_capacity_hours?: number
  committed_points: number
  completed_points: number
  velocity?: number
  default_status_on_start?: string
  default_status_on_complete?: string
  created_by: string
  created_at: string
  updated_at: string
  items?: SprintItem[]
}

export interface SprintItem {
  id: string
  sprint_id: string
  item_id: string
  item_type: string
  story_points?: number
  added_at: string
  completed_at?: string
  is_carryover: boolean
  previous_sprint_id?: string
}

export interface SprintSnapshot {
  id: string
  sprint_id: string
  snapshot_date: string
  remaining_points: number
  completed_points: number
  added_points: number
  removed_points: number
  ideal_remaining_points?: number
  created_at: string
}

// Version Control
export type ChangeType = 'created' | 'updated' | 'deleted' | 'restored'

export interface ItemVersion {
  id: string
  item_id: string
  item_type: string
  version: number
  data: Record<string, any>
  changes?: Record<string, { old: any; new: any }>
  change_summary?: string
  changed_by: string
  changed_at: string
  change_type: ChangeType
  ip_address?: string
  user_agent?: string
  user?: User
}

export interface VersionRestore {
  id: string
  item_id: string
  item_type: string
  from_version: number
  to_version: number
  restored_by: string
  restored_at: string
  reason?: string
}

// Advanced Search
export interface SearchIndex {
  id: string
  item_id: string
  item_type: string
  workspace_id: string
  title?: string
  content?: string
  tags?: string[]
  status?: string
  priority?: string
  assignee_ids?: string[]
  created_by?: string
  created_at?: string
  updated_at?: string
  due_date?: string
  indexed_at: string
}

export interface SearchResult {
  item_id: string
  item_type: string
  title?: string
  content?: string
  rank: number
  highlight?: string
}

export interface SavedSearch {
  id: string
  user_id: string
  workspace_id?: string
  name: string
  query: string
  filters: Record<string, any>
  is_pinned: boolean
  created_at: string
  updated_at: string
}

// =============================================
// PHASE 3: EXTENSIBILITY & ADVANCED FEATURES
// =============================================

// Plugins
export type PluginCategory = 'automation' | 'integration' | 'reporting' | 'ui' | 'workflow' | 'productivity' | 'communication' | 'other'
export type PricingModel = 'free' | 'paid' | 'freemium' | 'trial'
export type PluginInstallationStatus = 'active' | 'paused' | 'error' | 'uninstalled'

export interface Plugin {
  id: string
  slug: string
  name: string
  description?: string
  icon_url?: string
  developer_name: string
  developer_email?: string
  developer_url?: string
  version: string
  category: PluginCategory
  pricing_model: PricingModel
  price_monthly?: number
  price_annual?: number
  required_permissions: string[]
  supports_webhooks: boolean
  supports_api: boolean
  supports_ui: boolean
  install_url?: string
  config_schema?: Record<string, any>
  is_published: boolean
  is_featured: boolean
  install_count: number
  rating?: number
  review_count: number
  is_active: boolean
  deprecated_at?: string
  created_at: string
  updated_at: string
}

export interface PluginInstallation {
  id: string
  plugin_id: string
  organization_id: string
  status: PluginInstallationStatus
  config: Record<string, any>
  last_used_at?: string
  usage_count: number
  subscription_id?: string
  subscription_status?: string
  trial_ends_at?: string
  installed_by: string
  installed_at: string
  updated_at: string
  plugin?: Plugin
}

// Webhooks
export interface Webhook {
  id: string
  organization_id: string
  workspace_id?: string
  name: string
  description?: string
  url: string
  method: 'POST' | 'PUT' | 'PATCH'
  headers: Record<string, string>
  secret?: string
  events: string[]
  filters: Record<string, any>
  retry_enabled: boolean
  max_retries: number
  retry_delay_seconds: number
  is_active: boolean
  last_triggered_at?: string
  last_success_at?: string
  last_failure_at?: string
  failure_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface WebhookDelivery {
  id: string
  webhook_id: string
  event_type: string
  event_data: Record<string, any>
  request_url: string
  request_method: string
  request_headers?: Record<string, any>
  request_body?: Record<string, any>
  response_status?: number
  response_headers?: Record<string, any>
  response_body?: string
  duration_ms?: number
  status: 'pending' | 'success' | 'failed' | 'retrying'
  error_message?: string
  retry_count: number
  next_retry_at?: string
  created_at: string
  completed_at?: string
}

// API Tokens
export interface APIToken {
  id: string
  organization_id: string
  name: string
  description?: string
  token_hash: string
  token_prefix: string
  scopes: string[]
  rate_limit_per_hour: number
  last_used_at?: string
  usage_count: number
  expires_at?: string
  is_active: boolean
  created_by: string
  created_at: string
}

// Custom Fields & Formulas (Phase 3 - Advanced)
export type AdvancedFieldType = 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi_select' | 'user' | 'formula' | 'rollup' | 'lookup'
export type FormulaResultType = 'number' | 'text' | 'date' | 'boolean'
export type RollupFunction = 'sum' | 'avg' | 'min' | 'max' | 'count' | 'unique'

export interface AdvancedCustomField {
  id: string
  organization_id: string
  name: string
  description?: string
  field_type: AdvancedFieldType
  formula?: string
  formula_result_type?: FormulaResultType
  rollup_relation_field?: string
  rollup_property?: string
  rollup_function?: RollupFunction
  options?: any
  is_required: boolean
  validation_rules?: Record<string, any>
  icon?: string
  color?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface CustomFieldValue {
  id: string
  custom_field_id: string
  item_id: string
  item_type: string
  value_text?: string
  value_number?: number
  value_date?: string
  value_boolean?: boolean
  value_json?: any
  updated_by?: string
  updated_at: string
}

// Reports
export type ReportType = 'table' | 'chart' | 'calendar' | 'timeline' | 'dashboard'
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'funnel'

export interface Report {
  id: string
  organization_id: string
  workspace_id?: string
  name: string
  description?: string
  type: ReportType
  data_source: string
  filters: any[]
  grouping: any[]
  sorting: any[]
  aggregations: any[]
  chart_type?: ChartType
  chart_config?: Record<string, any>
  layout?: Record<string, any>
  is_public: boolean
  shared_with?: string[]
  schedule_enabled: boolean
  schedule_cron?: string
  schedule_recipients?: string[]
  last_run_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ReportSnapshot {
  id: string
  report_id: string
  data: any
  row_count?: number
  generated_at: string
  expires_at?: string
}

// =============================================
// PHASE 4: REAL-TIME COLLABORATION
// =============================================

// Presence
export type PresenceStatus = 'active' | 'idle' | 'away' | 'dnd' | 'offline'

export interface Presence {
  id: string
  user_id: string
  organization_id: string
  workspace_id?: string
  current_page?: string
  item_id?: string
  item_type?: string
  cursor_x?: number
  cursor_y?: number
  selection_start?: number
  selection_end?: number
  status: PresenceStatus
  custom_status?: string
  device_type?: string
  browser?: string
  last_seen_at: string
  started_at: string
}

// Comments
export interface Comment {
  id: string
  organization_id: string
  item_id: string
  item_type: string
  parent_comment_id?: string
  thread_id?: string
  content: string
  content_html?: string
  mentions?: string[]
  attachments?: any[]
  reactions?: Record<string, string[]>
  is_edited: boolean
  is_deleted: boolean
  is_resolved: boolean
  resolved_by?: string
  resolved_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

// Activities
export type ActivityAction = 
  | 'created' | 'updated' | 'deleted' | 'completed' | 'archived' | 'restored'
  | 'assigned' | 'unassigned' | 'commented' | 'mentioned' | 'reacted'
  | 'attached' | 'uploaded' | 'shared' | 'moved' | 'duplicated'
  | 'status_changed' | 'priority_changed' | 'due_date_changed'

export interface Activity {
  id: string
  organization_id: string
  workspace_id?: string
  user_id: string
  action: ActivityAction
  item_id: string
  item_type: string
  item_name?: string
  old_value?: any
  new_value?: any
  metadata?: Record<string, any>
  is_public: boolean
  visible_to?: string[]
  created_at: string
}

// Notifications
export type NotificationType = 
  | 'mention' | 'comment' | 'assignment' | 'due_date' | 'status_change'
  | 'file_upload' | 'share' | 'reaction' | 'approval_request' | 'approval_decision'
  | 'system' | 'announcement'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Notification {
  id: string
  user_id: string
  organization_id: string
  type: NotificationType
  title: string
  message?: string
  link_url?: string
  link_item_id?: string
  link_item_type?: string
  actor_id?: string
  is_read: boolean
  read_at?: string
  priority: NotificationPriority
  group_key?: string
  created_at: string
}

// Collaboration Sessions
export interface CollaborationSession {
  id: string
  organization_id: string
  item_id: string
  item_type: string
  host_user_id: string
  participant_ids: string[]
  status: 'active' | 'paused' | 'ended'
  allow_editing: boolean
  allow_comments: boolean
  started_at: string
  ended_at?: string
}

// Typing Indicators
export interface TypingIndicator {
  id: string
  user_id: string
  item_id: string
  item_type: string
  field_name?: string
  started_at: string
}

// Schema Mapping
export interface SchemaMapping {
  table_name: string
  columns: ColumnMapping[]
  relationships: RelationshipMapping[]
}

export interface ColumnMapping {
  name: string
  type: string
  nullable: boolean
  default?: any
}

export interface RelationshipMapping {
  foreign_table: string
  foreign_column: string
  local_column: string
  type: 'one-to-many' | 'many-to-one' | 'many-to-many'
}

// =============================================
// OFFLINE & SYNC
// =============================================

export interface SyncState {
  last_sync_at?: string
  last_sync_generation?: number
  sync_status: 'idle' | 'syncing' | 'error'
  pending_changes: number
  error_message?: string
}

export interface SyncLog {
  id: string
  organization_id: string
  user_id: string
  sync_type: 'push' | 'pull'
  sync_generation?: number
  items_synced: number
  status: 'success' | 'failed' | 'partial'
  error_message?: string
  table_name?: string
  record_id?: string
  operation?: 'create' | 'update' | 'delete'
  new_data?: Record<string, any>
  started_at: string
  completed_at: string
}

export interface OfflineQueueItem {
  id: string
  operation: 'create' | 'update' | 'delete'
  operation_type?: 'create' | 'update' | 'delete'
  entity_type: string
  entity_id: string
  data: Record<string, any>
  timestamp: string
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  retry_count: number
}

export interface SyncConflict {
  id: string
  entity_type: string
  entity_id: string
  server_version: Record<string, any>
  client_version: Record<string, any>
  resolution?: 'server' | 'client' | 'merge'
  resolved_at?: string
}

// =============================================
// ASSETS & PRODUCTION ADVANCES
// =============================================

export type AssetCategory =
  | 'site_infrastructure'
  | 'site_services'
  | 'site_safety'
  | 'site_vehicles'
  | 'heavy_equipment'
  | 'consumables'
  | 'event_rentals'
  | 'signage'
  | 'backline'
  | 'access'
  | 'credentials'
  | 'parking'
  | 'meals'
  | 'flights'
  | 'lodging'
  | 'rental_cars'

export type AssetType = 
  | 'infrastructure'
  | 'equipment'
  | 'vehicle'
  | 'tool'
  | 'credential'
  | 'consumable'

export type AssetStatus = 
  | 'available'
  | 'in_use'
  | 'maintenance'
  | 'retired'
  | 'lost'
  | 'damaged'

export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor'

export type AssetOwnership = 'owned' | 'rented' | 'leased'

export interface Asset {
  id: string
  workspace_id: string
  name: string
  description?: string
  type: AssetType
  category?: string
  subcategory?: string
  asset_category?: AssetCategory
  asset_tag?: string
  serial_number?: string
  model_number?: string
  manufacturer?: string
  purchase_price?: number
  purchase_date?: string
  current_value?: number
  depreciation_rate?: number
  status: AssetStatus
  condition?: AssetCondition
  location_id?: string
  current_location?: string
  ownership?: AssetOwnership
  vendor_id?: string
  specifications?: Record<string, any>
  tags?: string[]
  custom_fields?: Record<string, any>
  created_by: string
  created_at: string
  updated_at: string
}

export type ProductionAdvanceStatus =
  | 'pending'
  | 'approved'
  | 'fulfilled'
  | 'active'
  | 'returned'
  | 'partially_returned'
  | 'overdue'
  | 'cancelled'
  | 'denied'

export interface ProductionAdvance {
  id: string
  workspace_id: string
  production_id?: string
  company_id?: string
  department_team?: string
  asset_category: AssetCategory
  asset_id?: string
  asset_item: string
  accessories?: string[]
  quantity: number
  start_date: string
  end_date?: string
  site_location_id?: string
  site_location_name?: string
  operational_purpose: string
  special_considerations?: string
  additional_information?: string
  requestor_id: string
  assigned_user_ids?: string[]
  approver_id?: string
  status: ProductionAdvanceStatus
  approved_at?: string
  fulfilled_at?: string
  checked_out_at?: string
  returned_at?: string
  notes?: string
  tags?: string[]
  custom_fields?: Record<string, any>
  created_by: string
  created_at: string
  updated_at: string
  // Relations
  production?: { id: string; name: string }
  company?: { id: string; name: string }
  asset?: Asset
  requestor?: User
  approver?: User
  assigned_users?: User[]
}
