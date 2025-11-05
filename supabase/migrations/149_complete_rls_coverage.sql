-- ============================================================================
-- MIGRATION 149: COMPLETE RLS COVERAGE
-- ============================================================================
-- Purpose: Create missing tables and add RLS policies to all tables
-- Security: Enforce row-level security based on user roles and workspace access
-- Date: 2025-11-05
-- Previous: 148_data_consolidated_seed_data.sql
-- Next: 150_error_handling_infrastructure.sql
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE MISSING TABLES
-- ============================================================================

-- User Preferences & Settings
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  notification_types JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  time_format TEXT DEFAULT '12h',
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);

-- Logging & Monitoring
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  login_at TIMESTAMPTZ DEFAULT now(),
  logout_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  context JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  webhook_url TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB,
  response_status INTEGER,
  response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- API Tokens
CREATE TABLE IF NOT EXISTS api_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  scopes JSONB DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- System Configuration
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS integration_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL,
  config JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Performance & Caching
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  tags JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cache_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  cache_value JSONB NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Background Jobs & Scheduling
CREATE TABLE IF NOT EXISTS queue_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  scheduled_for TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  schedule TEXT NOT NULL,
  payload JSONB,
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS background_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  payload JSONB,
  result JSONB,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Templates
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_body TEXT NOT NULL,
  text_body TEXT,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  variables JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- User Customization
CREATE TABLE IF NOT EXISTS dashboard_widgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  widget_type TEXT NOT NULL,
  config JSONB NOT NULL,
  position INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS custom_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  view_name TEXT NOT NULL,
  view_type TEXT NOT NULL,
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  filter_name TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  filters JSONB NOT NULL,
  is_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

CREATE TABLE IF NOT EXISTS recent_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type TEXT NOT NULL,
  resource_id UUID NOT NULL,
  accessed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, resource_type, resource_id)
);

CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  search_query TEXT NOT NULL,
  search_type TEXT,
  results_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity & Changelog
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS changelog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL,
  release_date DATE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  changes JSONB NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- version_history table already exists from migration 077

-- Backup & Versioning
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL,
  backup_size BIGINT,
  backup_location TEXT NOT NULL,
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  error_message TEXT
);

CREATE TABLE IF NOT EXISTS restore_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restore_point_name TEXT NOT NULL,
  backup_id UUID REFERENCES backup_logs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS migration_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_name TEXT NOT NULL UNIQUE,
  applied_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schema_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  description TEXT,
  applied_at TIMESTAMPTZ DEFAULT now()
);

-- Feature Flags & A/B Testing
CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0,
  target_users JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL UNIQUE,
  description TEXT,
  variants JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name TEXT NOT NULL,
  event_properties JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tracking_pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  pixel_name TEXT NOT NULL,
  pixel_code TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversion_funnels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  funnel_name TEXT NOT NULL,
  steps JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  segment_name TEXT NOT NULL,
  criteria JSONB NOT NULL,
  user_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cohort_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  cohort_name TEXT NOT NULL,
  cohort_date DATE NOT NULL,
  metrics JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS retention_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL,
  day_1_retention NUMERIC,
  day_7_retention NUMERIC,
  day_30_retention NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS engagement_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

-- Health & Status
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS status_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- PART 2: ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE IF EXISTS custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS views ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS file_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS integration_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS queue_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scheduled_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS background_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS custom_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS recent_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS changelog ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS version_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS backup_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS restore_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS migration_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS schema_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tracking_pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS conversion_funnels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cohort_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS retention_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS engagement_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS status_pages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CUSTOM FIELDS - User-specific or workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view custom fields in their workspace"
  ON custom_fields FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage custom fields"
  ON custom_fields FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- MODULE CONFIGS - Workspace-level configuration
-- ============================================================================

CREATE POLICY "Users can view module configs in their workspace"
  ON module_configs FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage module configs"
  ON module_configs FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- VIEWS - User-specific saved views
-- ============================================================================

CREATE POLICY "Users can manage their own views"
  ON views FOR ALL
  USING (created_by = auth.uid());

CREATE POLICY "Users can view team/public views in their workspace"
  ON views FOR SELECT
  USING (
    permission IN ('team', 'public') AND
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- TEMPLATES - Global marketplace templates
-- ============================================================================

CREATE POLICY "All authenticated users can view templates"
  ON templates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can manage their own templates"
  ON templates FOR ALL
  USING (vendor_id = auth.uid());

-- ============================================================================
-- FILE CATEGORIES - Workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view file categories in their workspace"
  ON file_categories FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage file categories"
  ON file_categories FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- USER PREFERENCES - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own preferences"
  ON user_preferences FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- NOTIFICATION PREFERENCES - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own notification preferences"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- AUDIT LOGS - Read-only for admins, system writes
-- ============================================================================

CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- SYSTEM SETTINGS - Admin-only
-- ============================================================================

CREATE POLICY "Admins can view system settings"
  ON system_settings FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

CREATE POLICY "Platform admins can manage system settings"
  ON system_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name = 'Legend')
    )
  );

-- ============================================================================
-- INTEGRATION CONFIGS - Admin-only
-- ============================================================================

CREATE POLICY "Admins can manage integration configs"
  ON integration_configs FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- WEBHOOK LOGS - Admin read-only
-- ============================================================================

CREATE POLICY "Admins can view webhook logs"
  ON webhook_logs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- API TOKENS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own API tokens"
  ON api_tokens FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all API tokens"
  ON api_tokens FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- SESSION LOGS - User-specific, admin viewable
-- ============================================================================

CREATE POLICY "Users can view their own session logs"
  ON session_logs FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all session logs"
  ON session_logs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- ERROR LOGS - Admin-only
-- ============================================================================

CREATE POLICY "Admins can view error logs"
  ON error_logs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- PERFORMANCE METRICS - Admin-only
-- ============================================================================

CREATE POLICY "Admins can view performance metrics"
  ON performance_metrics FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- CACHE ENTRIES - System-only (no user access)
-- ============================================================================

-- No user policies - system managed only

-- ============================================================================
-- QUEUE JOBS - System-only (no user access)
-- ============================================================================

-- No user policies - system managed only

-- ============================================================================
-- SCHEDULED TASKS - Admin viewable
-- ============================================================================

CREATE POLICY "Admins can view scheduled tasks"
  ON scheduled_tasks FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- BACKGROUND JOBS - Admin viewable
-- ============================================================================

CREATE POLICY "Admins can view background jobs"
  ON background_jobs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- EMAIL/SMS/NOTIFICATION TEMPLATES - Workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view templates in their workspace"
  ON email_templates FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage email templates"
  ON email_templates FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

CREATE POLICY "Users can view SMS templates in their workspace"
  ON sms_templates FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage SMS templates"
  ON sms_templates FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

CREATE POLICY "Users can view notification templates in their workspace"
  ON notification_templates FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage notification templates"
  ON notification_templates FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- REPORT TEMPLATES - Workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view report templates in their workspace"
  ON report_templates FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users with permissions can manage report templates"
  ON report_templates FOR ALL
  USING (
    user_has_permission(auth.uid(), 'project:manage')
  );

-- ============================================================================
-- DASHBOARD WIDGETS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own dashboard widgets"
  ON dashboard_widgets FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- CUSTOM VIEWS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own custom views"
  ON custom_views FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- SAVED FILTERS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own saved filters"
  ON saved_filters FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- BOOKMARKS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own bookmarks"
  ON bookmarks FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- FAVORITES - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own favorites"
  ON favorites FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- RECENT ITEMS - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own recent items"
  ON recent_items FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- SEARCH HISTORY - User-specific
-- ============================================================================

CREATE POLICY "Users can manage their own search history"
  ON search_history FOR ALL
  USING (user_id = auth.uid());

-- ============================================================================
-- ACTIVITY FEED - Workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view activity feed in their workspace"
  ON activity_feed FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- CHANGELOG - Public read, admin write
-- ============================================================================

CREATE POLICY "All authenticated users can view changelog"
  ON changelog FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage changelog"
  ON changelog FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- VERSION HISTORY - Already has RLS policy in migration 077
-- ============================================================================
-- Skipping - table already exists with RLS policies

-- ============================================================================
-- BACKUP/RESTORE LOGS - Admin-only
-- ============================================================================

CREATE POLICY "Admins can view backup logs"
  ON backup_logs FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

CREATE POLICY "Admins can view restore points"
  ON restore_points FOR SELECT
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- MIGRATION/SCHEMA - Platform admin only
-- ============================================================================

CREATE POLICY "Platform admins can view migration history"
  ON migration_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name = 'Legend')
    )
  );

CREATE POLICY "Platform admins can view schema versions"
  ON schema_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name = 'Legend')
    )
  );

-- ============================================================================
-- FEATURE FLAGS - Platform-level (global)
-- ============================================================================

CREATE POLICY "All authenticated users can view feature flags"
  ON feature_flags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Platform admins can manage feature flags"
  ON feature_flags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role_id IN (SELECT id FROM roles WHERE name = 'Legend')
    )
  );

-- ============================================================================
-- AB TESTS - Platform-level (global)
-- ============================================================================

CREATE POLICY "All authenticated users can view AB tests"
  ON ab_tests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage AB tests"
  ON ab_tests FOR ALL
  USING (
    user_has_permission(auth.uid(), 'organization:manage')
  );

-- ============================================================================
-- ANALYTICS - Workspace-scoped
-- ============================================================================

CREATE POLICY "Users can view analytics in their workspace"
  ON analytics_events FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view tracking pixels in their workspace"
  ON tracking_pixels FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view conversion funnels in their workspace"
  ON conversion_funnels FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view user segments in their workspace"
  ON user_segments FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view cohort analysis in their workspace"
  ON cohort_analysis FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view retention metrics in their workspace"
  ON retention_metrics FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view engagement scores in their workspace"
  ON engagement_scores FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- HEALTH CHECKS / STATUS PAGES - Public read
-- ============================================================================

CREATE POLICY "All users can view health checks"
  ON health_checks FOR SELECT
  USING (true);

CREATE POLICY "All users can view status pages"
  ON status_pages FOR SELECT
  USING (true);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify all tables now have RLS enabled
DO $$
DECLARE
  table_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO table_count
  FROM pg_tables
  WHERE schemaname = 'public'
  AND rowsecurity = false;
  
  IF table_count > 0 THEN
    RAISE NOTICE 'WARNING: % tables still without RLS enabled', table_count;
  ELSE
    RAISE NOTICE 'SUCCESS: All tables have RLS enabled';
  END IF;
END $$;
