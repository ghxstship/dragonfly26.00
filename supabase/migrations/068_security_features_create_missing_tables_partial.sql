-- Create Missing Database Tables
-- Generated: 2025-10-20T12:45:31.490Z
-- Total Tables: 95

-- This migration creates all missing database tables identified in the audit
-- Each table includes:
-- - Standard fields (id, workspace_id, name, description, status)
-- - JSONB fields for flexible data storage
-- - Audit fields (created_at, updated_at, created_by, updated_by)
-- - Soft delete support (deleted_at, deleted_by)
-- - Appropriate indexes for performance
-- - Row Level Security (RLS) policies
-- - Updated_at trigger

-- ============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================
-- For tables that already exist, add missing columns that are referenced in indexes

DO $$
DECLARE
    tbl_name TEXT;
    table_names TEXT[] := ARRAY[
        'automations', 'custom_statuses', 'plugins', 'analytics_comparisons', 'analytics_custom_views',
        'analytics_metrics_library', 'analytics_pivot_tables', 'analytics_trends', 'competitions',
        'company_compliance', 'company_invoices', 'company_reviews', 'company_work_orders',
        'user_advances', 'user_agenda', 'user_assets', 'user_expenses', 'user_files', 'user_jobs',
        'user_orders', 'user_reports', 'user_tasks', 'user_travel', 'event_calendar', 'event_run_of_show',
        'event_shipping_receiving', 'event_trainings', 'document_library', 'file_folders', 'file_recent',
        'file_shared', 'file_starred', 'file_trash', 'insight_alerts', 'insight_anomalies',
        'insight_correlations', 'insight_forecasts', 'insight_patterns', 'insight_recommendations',
        'insight_scenarios', 'insight_segments', 'insight_summaries', 'insight_what_if', 'job_applications',
        'job_candidates', 'job_interviews', 'job_offers', 'job_onboarding', 'job_postings', 'job_requisitions',
        'location_access', 'location_amenities', 'location_bookings', 'location_capacity', 'location_equipment',
        'location_floor_plans', 'location_zones', 'marketplace_favorites', 'marketplace_lists', 'marketplace_orders',
        'marketplace_products', 'marketplace_purchases', 'marketplace_reviews', 'marketplace_sales',
        'marketplace_services', 'marketplace_vendors', 'people_availability', 'people_certifications',
        'people_departments', 'people_directory', 'people_keyboard_shortcuts', 'people_org_chart', 'people_skills',
        'people_teams', 'scopes_of_work', 'project_budgets', 'project_calendar', 'project_gantt', 'project_milestones',
        'project_resources', 'project_risks', 'project_tasks', 'project_timelines', 'report_builder',
        'report_dashboards', 'report_exports', 'report_schedules', 'report_templates', 'resource_courses',
        'resource_glossary', 'resource_grants', 'resource_guides', 'resource_library', 'resource_publications',
        'resource_troubleshooting'
    ];
BEGIN
    FOREACH tbl_name IN ARRAY table_names
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables t WHERE t.table_schema = 'public' AND t.table_name = tbl_name) THEN
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ', tbl_name);
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id)', tbl_name);
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS data JSONB DEFAULT %L::jsonb', tbl_name, '{}');
            EXECUTE format('ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS status TEXT DEFAULT %L', tbl_name, 'active');
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- ADMIN MODULE (3 tables)
-- ============================================================================

-- Workflow automation rules and triggers
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_automations_workspace_id ON public.automations(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_automations_status ON public.automations(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_automations_created_at ON public.automations(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_automations_data ON public.automations USING gin(data);

-- Enable RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view automations in their workspace"
  ON public.automations
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert automations in their workspace"
  ON public.automations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update automations in their workspace"
  ON public.automations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete automations in their workspace"
  ON public.automations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Custom status definitions for workflows
CREATE TABLE IF NOT EXISTS public.custom_statuses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_custom_statuses_workspace_id ON public.custom_statuses(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_custom_statuses_status ON public.custom_statuses(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_custom_statuses_created_at ON public.custom_statuses(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_custom_statuses_data ON public.custom_statuses USING gin(data);

-- Enable RLS
ALTER TABLE public.custom_statuses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view custom_statuses in their workspace"
  ON public.custom_statuses
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert custom_statuses in their workspace"
  ON public.custom_statuses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update custom_statuses in their workspace"
  ON public.custom_statuses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete custom_statuses in their workspace"
  ON public.custom_statuses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_custom_statuses_updated_at
  BEFORE UPDATE ON public.custom_statuses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Third-party plugin integrations
CREATE TABLE IF NOT EXISTS public.plugins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_plugins_workspace_id ON public.plugins(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_plugins_status ON public.plugins(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_plugins_created_at ON public.plugins(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_plugins_data ON public.plugins USING gin(data);

-- Enable RLS
ALTER TABLE public.plugins ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view plugins in their workspace"
  ON public.plugins
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert plugins in their workspace"
  ON public.plugins
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update plugins in their workspace"
  ON public.plugins
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete plugins in their workspace"
  ON public.plugins
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_plugins_updated_at
  BEFORE UPDATE ON public.plugins
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- ANALYTICS MODULE (5 tables)
-- ============================================================================

-- Comparative analytics views
CREATE TABLE IF NOT EXISTS public.analytics_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_analytics_comparisons_workspace_id ON public.analytics_comparisons(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_analytics_comparisons_status ON public.analytics_comparisons(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_analytics_comparisons_created_at ON public.analytics_comparisons(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_analytics_comparisons_data ON public.analytics_comparisons USING gin(data);

-- Enable RLS
ALTER TABLE public.analytics_comparisons ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view analytics_comparisons in their workspace"
  ON public.analytics_comparisons
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert analytics_comparisons in their workspace"
  ON public.analytics_comparisons
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update analytics_comparisons in their workspace"
  ON public.analytics_comparisons
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete analytics_comparisons in their workspace"
  ON public.analytics_comparisons
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_analytics_comparisons_updated_at
  BEFORE UPDATE ON public.analytics_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User-defined analytics views
CREATE TABLE IF NOT EXISTS public.analytics_custom_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_analytics_custom_views_workspace_id ON public.analytics_custom_views(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_analytics_custom_views_status ON public.analytics_custom_views(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_analytics_custom_views_created_at ON public.analytics_custom_views(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_analytics_custom_views_data ON public.analytics_custom_views USING gin(data);

-- Enable RLS
ALTER TABLE public.analytics_custom_views ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view analytics_custom_views in their workspace"
  ON public.analytics_custom_views
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert analytics_custom_views in their workspace"
  ON public.analytics_custom_views
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update analytics_custom_views in their workspace"
  ON public.analytics_custom_views
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete analytics_custom_views in their workspace"
  ON public.analytics_custom_views
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_analytics_custom_views_updated_at
  BEFORE UPDATE ON public.analytics_custom_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Reusable metric definitions
CREATE TABLE IF NOT EXISTS public.analytics_metrics_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_library_workspace_id ON public.analytics_metrics_library(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_library_status ON public.analytics_metrics_library(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_library_created_at ON public.analytics_metrics_library(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_analytics_metrics_library_data ON public.analytics_metrics_library USING gin(data);

-- Enable RLS
ALTER TABLE public.analytics_metrics_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view analytics_metrics_library in their workspace"
  ON public.analytics_metrics_library
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert analytics_metrics_library in their workspace"
  ON public.analytics_metrics_library
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update analytics_metrics_library in their workspace"
  ON public.analytics_metrics_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete analytics_metrics_library in their workspace"
  ON public.analytics_metrics_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_analytics_metrics_library_updated_at
  BEFORE UPDATE ON public.analytics_metrics_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Pivot table configurations
CREATE TABLE IF NOT EXISTS public.analytics_pivot_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_analytics_pivot_tables_workspace_id ON public.analytics_pivot_tables(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_analytics_pivot_tables_status ON public.analytics_pivot_tables(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_analytics_pivot_tables_created_at ON public.analytics_pivot_tables(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_analytics_pivot_tables_data ON public.analytics_pivot_tables USING gin(data);

-- Enable RLS
ALTER TABLE public.analytics_pivot_tables ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view analytics_pivot_tables in their workspace"
  ON public.analytics_pivot_tables
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert analytics_pivot_tables in their workspace"
  ON public.analytics_pivot_tables
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update analytics_pivot_tables in their workspace"
  ON public.analytics_pivot_tables
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete analytics_pivot_tables in their workspace"
  ON public.analytics_pivot_tables
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_analytics_pivot_tables_updated_at
  BEFORE UPDATE ON public.analytics_pivot_tables
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Trend analysis data
CREATE TABLE IF NOT EXISTS public.analytics_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_analytics_trends_workspace_id ON public.analytics_trends(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_analytics_trends_status ON public.analytics_trends(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_analytics_trends_created_at ON public.analytics_trends(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_analytics_trends_data ON public.analytics_trends USING gin(data);

-- Enable RLS
ALTER TABLE public.analytics_trends ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view analytics_trends in their workspace"
  ON public.analytics_trends
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert analytics_trends in their workspace"
  ON public.analytics_trends
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update analytics_trends in their workspace"
  ON public.analytics_trends
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete analytics_trends in their workspace"
  ON public.analytics_trends
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_analytics_trends_updated_at
  BEFORE UPDATE ON public.analytics_trends
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- COMMUNITY MODULE (1 tables)
-- ============================================================================

-- Community competitions and challenges
CREATE TABLE IF NOT EXISTS public.competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_competitions_workspace_id ON public.competitions(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_competitions_created_at ON public.competitions(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_competitions_data ON public.competitions USING gin(data);

-- Enable RLS
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view competitions in their workspace"
  ON public.competitions
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert competitions in their workspace"
  ON public.competitions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update competitions in their workspace"
  ON public.competitions
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete competitions in their workspace"
  ON public.competitions
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_competitions_updated_at
  BEFORE UPDATE ON public.competitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- COMPANIES MODULE (4 tables)
-- ============================================================================

-- Company compliance records
CREATE TABLE IF NOT EXISTS public.company_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_company_compliance_workspace_id ON public.company_compliance(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_company_compliance_status ON public.company_compliance(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_company_compliance_created_at ON public.company_compliance(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_company_compliance_data ON public.company_compliance USING gin(data);

-- Enable RLS
ALTER TABLE public.company_compliance ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view company_compliance in their workspace"
  ON public.company_compliance
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert company_compliance in their workspace"
  ON public.company_compliance
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update company_compliance in their workspace"
  ON public.company_compliance
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete company_compliance in their workspace"
  ON public.company_compliance
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_company_compliance_updated_at
  BEFORE UPDATE ON public.company_compliance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Company invoicing data
CREATE TABLE IF NOT EXISTS public.company_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_company_invoices_workspace_id ON public.company_invoices(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_company_invoices_status ON public.company_invoices(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_company_invoices_created_at ON public.company_invoices(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_company_invoices_data ON public.company_invoices USING gin(data);

-- Enable RLS
ALTER TABLE public.company_invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view company_invoices in their workspace"
  ON public.company_invoices
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert company_invoices in their workspace"
  ON public.company_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update company_invoices in their workspace"
  ON public.company_invoices
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete company_invoices in their workspace"
  ON public.company_invoices
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_company_invoices_updated_at
  BEFORE UPDATE ON public.company_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Company reviews and ratings
CREATE TABLE IF NOT EXISTS public.company_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_company_reviews_workspace_id ON public.company_reviews(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_company_reviews_status ON public.company_reviews(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_company_reviews_created_at ON public.company_reviews(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_company_reviews_data ON public.company_reviews USING gin(data);

-- Enable RLS
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view company_reviews in their workspace"
  ON public.company_reviews
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert company_reviews in their workspace"
  ON public.company_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update company_reviews in their workspace"
  ON public.company_reviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete company_reviews in their workspace"
  ON public.company_reviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_company_reviews_updated_at
  BEFORE UPDATE ON public.company_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Work orders for companies
CREATE TABLE IF NOT EXISTS public.company_work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_company_work_orders_workspace_id ON public.company_work_orders(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_company_work_orders_status ON public.company_work_orders(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_company_work_orders_created_at ON public.company_work_orders(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_company_work_orders_data ON public.company_work_orders USING gin(data);

-- Enable RLS
ALTER TABLE public.company_work_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view company_work_orders in their workspace"
  ON public.company_work_orders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert company_work_orders in their workspace"
  ON public.company_work_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update company_work_orders in their workspace"
  ON public.company_work_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete company_work_orders in their workspace"
  ON public.company_work_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_company_work_orders_updated_at
  BEFORE UPDATE ON public.company_work_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- DASHBOARD MODULE (10 tables)
-- ============================================================================

-- User production advances
CREATE TABLE IF NOT EXISTS public.user_advances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_advances_workspace_id ON public.user_advances(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_advances_status ON public.user_advances(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_advances_created_at ON public.user_advances(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_advances_data ON public.user_advances USING gin(data);

-- Enable RLS
ALTER TABLE public.user_advances ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_advances in their workspace"
  ON public.user_advances
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_advances in their workspace"
  ON public.user_advances
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_advances in their workspace"
  ON public.user_advances
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_advances in their workspace"
  ON public.user_advances
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_advances_updated_at
  BEFORE UPDATE ON public.user_advances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User personal agenda
CREATE TABLE IF NOT EXISTS public.user_agenda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_agenda_workspace_id ON public.user_agenda(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_agenda_status ON public.user_agenda(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_agenda_created_at ON public.user_agenda(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_agenda_data ON public.user_agenda USING gin(data);

-- Enable RLS
ALTER TABLE public.user_agenda ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_agenda in their workspace"
  ON public.user_agenda
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_agenda in their workspace"
  ON public.user_agenda
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_agenda in their workspace"
  ON public.user_agenda
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_agenda in their workspace"
  ON public.user_agenda
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_agenda_updated_at
  BEFORE UPDATE ON public.user_agenda
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User-assigned assets
CREATE TABLE IF NOT EXISTS public.user_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_assets_workspace_id ON public.user_assets(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_assets_status ON public.user_assets(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_assets_created_at ON public.user_assets(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_assets_data ON public.user_assets USING gin(data);

-- Enable RLS
ALTER TABLE public.user_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_assets in their workspace"
  ON public.user_assets
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_assets in their workspace"
  ON public.user_assets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_assets in their workspace"
  ON public.user_assets
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_assets in their workspace"
  ON public.user_assets
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_assets_updated_at
  BEFORE UPDATE ON public.user_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User expense tracking
CREATE TABLE IF NOT EXISTS public.user_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_expenses_workspace_id ON public.user_expenses(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_expenses_status ON public.user_expenses(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_expenses_created_at ON public.user_expenses(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_expenses_data ON public.user_expenses USING gin(data);

-- Enable RLS
ALTER TABLE public.user_expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_expenses in their workspace"
  ON public.user_expenses
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_expenses in their workspace"
  ON public.user_expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_expenses in their workspace"
  ON public.user_expenses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_expenses in their workspace"
  ON public.user_expenses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_expenses_updated_at
  BEFORE UPDATE ON public.user_expenses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User file access
CREATE TABLE IF NOT EXISTS public.user_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_files_workspace_id ON public.user_files(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_files_status ON public.user_files(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_files_created_at ON public.user_files(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_files_data ON public.user_files USING gin(data);

-- Enable RLS
ALTER TABLE public.user_files ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_files in their workspace"
  ON public.user_files
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_files in their workspace"
  ON public.user_files
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_files in their workspace"
  ON public.user_files
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_files in their workspace"
  ON public.user_files
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_files_updated_at
  BEFORE UPDATE ON public.user_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User job assignments
CREATE TABLE IF NOT EXISTS public.user_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_jobs_workspace_id ON public.user_jobs(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_jobs_status ON public.user_jobs(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_jobs_created_at ON public.user_jobs(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_jobs_data ON public.user_jobs USING gin(data);

-- Enable RLS
ALTER TABLE public.user_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_jobs in their workspace"
  ON public.user_jobs
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_jobs in their workspace"
  ON public.user_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_jobs in their workspace"
  ON public.user_jobs
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_jobs in their workspace"
  ON public.user_jobs
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_jobs_updated_at
  BEFORE UPDATE ON public.user_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User purchase orders
CREATE TABLE IF NOT EXISTS public.user_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_orders_workspace_id ON public.user_orders(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_orders_status ON public.user_orders(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_orders_created_at ON public.user_orders(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_orders_data ON public.user_orders USING gin(data);

-- Enable RLS
ALTER TABLE public.user_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_orders in their workspace"
  ON public.user_orders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_orders in their workspace"
  ON public.user_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_orders in their workspace"
  ON public.user_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_orders in their workspace"
  ON public.user_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_orders_updated_at
  BEFORE UPDATE ON public.user_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User-specific reports
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_reports_workspace_id ON public.user_reports(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_reports_status ON public.user_reports(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_reports_created_at ON public.user_reports(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_reports_data ON public.user_reports USING gin(data);

-- Enable RLS
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_reports in their workspace"
  ON public.user_reports
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_reports in their workspace"
  ON public.user_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_reports in their workspace"
  ON public.user_reports
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_reports in their workspace"
  ON public.user_reports
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User task assignments
CREATE TABLE IF NOT EXISTS public.user_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_tasks_workspace_id ON public.user_tasks(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_tasks_status ON public.user_tasks(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_tasks_created_at ON public.user_tasks(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_tasks_data ON public.user_tasks USING gin(data);

-- Enable RLS
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_tasks in their workspace"
  ON public.user_tasks
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_tasks in their workspace"
  ON public.user_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_tasks in their workspace"
  ON public.user_tasks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_tasks in their workspace"
  ON public.user_tasks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_tasks_updated_at
  BEFORE UPDATE ON public.user_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User travel bookings
CREATE TABLE IF NOT EXISTS public.user_travel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_user_travel_workspace_id ON public.user_travel(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_user_travel_status ON public.user_travel(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_user_travel_created_at ON public.user_travel(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_user_travel_data ON public.user_travel USING gin(data);

-- Enable RLS
ALTER TABLE public.user_travel ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view user_travel in their workspace"
  ON public.user_travel
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert user_travel in their workspace"
  ON public.user_travel
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update user_travel in their workspace"
  ON public.user_travel
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete user_travel in their workspace"
  ON public.user_travel
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_user_travel_updated_at
  BEFORE UPDATE ON public.user_travel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- EVENTS MODULE (4 tables)
-- ============================================================================

-- Event calendar views
CREATE TABLE IF NOT EXISTS public.event_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_event_calendar_workspace_id ON public.event_calendar(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_event_calendar_status ON public.event_calendar(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_event_calendar_created_at ON public.event_calendar(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_event_calendar_data ON public.event_calendar USING gin(data);

-- Enable RLS
ALTER TABLE public.event_calendar ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view event_calendar in their workspace"
  ON public.event_calendar
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert event_calendar in their workspace"
  ON public.event_calendar
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update event_calendar in their workspace"
  ON public.event_calendar
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete event_calendar in their workspace"
  ON public.event_calendar
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_event_calendar_updated_at
  BEFORE UPDATE ON public.event_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Event run of show schedules
CREATE TABLE IF NOT EXISTS public.event_run_of_show (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_event_run_of_show_workspace_id ON public.event_run_of_show(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_event_run_of_show_status ON public.event_run_of_show(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_event_run_of_show_created_at ON public.event_run_of_show(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_event_run_of_show_data ON public.event_run_of_show USING gin(data);

-- Enable RLS
ALTER TABLE public.event_run_of_show ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view event_run_of_show in their workspace"
  ON public.event_run_of_show
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert event_run_of_show in their workspace"
  ON public.event_run_of_show
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update event_run_of_show in their workspace"
  ON public.event_run_of_show
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete event_run_of_show in their workspace"
  ON public.event_run_of_show
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_event_run_of_show_updated_at
  BEFORE UPDATE ON public.event_run_of_show
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Event shipping and receiving
CREATE TABLE IF NOT EXISTS public.event_shipping_receiving (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_event_shipping_receiving_workspace_id ON public.event_shipping_receiving(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_event_shipping_receiving_status ON public.event_shipping_receiving(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_event_shipping_receiving_created_at ON public.event_shipping_receiving(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_event_shipping_receiving_data ON public.event_shipping_receiving USING gin(data);

-- Enable RLS
ALTER TABLE public.event_shipping_receiving ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view event_shipping_receiving in their workspace"
  ON public.event_shipping_receiving
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert event_shipping_receiving in their workspace"
  ON public.event_shipping_receiving
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update event_shipping_receiving in their workspace"
  ON public.event_shipping_receiving
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete event_shipping_receiving in their workspace"
  ON public.event_shipping_receiving
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_event_shipping_receiving_updated_at
  BEFORE UPDATE ON public.event_shipping_receiving
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Event-specific training sessions
CREATE TABLE IF NOT EXISTS public.event_trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_event_trainings_workspace_id ON public.event_trainings(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_event_trainings_status ON public.event_trainings(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_event_trainings_created_at ON public.event_trainings(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_event_trainings_data ON public.event_trainings USING gin(data);

-- Enable RLS
ALTER TABLE public.event_trainings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view event_trainings in their workspace"
  ON public.event_trainings
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert event_trainings in their workspace"
  ON public.event_trainings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update event_trainings in their workspace"
  ON public.event_trainings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete event_trainings in their workspace"
  ON public.event_trainings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_event_trainings_updated_at
  BEFORE UPDATE ON public.event_trainings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- FILES MODULE (6 tables)
-- ============================================================================

-- Centralized document library
CREATE TABLE IF NOT EXISTS public.document_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_document_library_workspace_id ON public.document_library(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_document_library_status ON public.document_library(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_document_library_created_at ON public.document_library(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_document_library_data ON public.document_library USING gin(data);

-- Enable RLS
ALTER TABLE public.document_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view document_library in their workspace"
  ON public.document_library
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert document_library in their workspace"
  ON public.document_library
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update document_library in their workspace"
  ON public.document_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete document_library in their workspace"
  ON public.document_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_document_library_updated_at
  BEFORE UPDATE ON public.document_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- File folder structure
CREATE TABLE IF NOT EXISTS public.file_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Add missing columns if they don't exist
ALTER TABLE public.file_folders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE public.file_folders ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES auth.users(id);
ALTER TABLE public.file_folders ADD COLUMN IF NOT EXISTS data JSONB DEFAULT '{}'::jsonb;

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_file_folders_workspace_id ON public.file_folders(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_file_folders_status ON public.file_folders(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_file_folders_created_at ON public.file_folders(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_file_folders_data ON public.file_folders USING gin(data);

-- Enable RLS
ALTER TABLE public.file_folders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view file_folders in their workspace"
  ON public.file_folders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert file_folders in their workspace"
  ON public.file_folders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update file_folders in their workspace"
  ON public.file_folders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete file_folders in their workspace"
  ON public.file_folders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_file_folders_updated_at
  BEFORE UPDATE ON public.file_folders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Recently accessed files
CREATE TABLE IF NOT EXISTS public.file_recent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_file_recent_workspace_id ON public.file_recent(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_file_recent_status ON public.file_recent(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_file_recent_created_at ON public.file_recent(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_file_recent_data ON public.file_recent USING gin(data);

-- Enable RLS
ALTER TABLE public.file_recent ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view file_recent in their workspace"
  ON public.file_recent
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert file_recent in their workspace"
  ON public.file_recent
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update file_recent in their workspace"
  ON public.file_recent
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete file_recent in their workspace"
  ON public.file_recent
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_file_recent_updated_at
  BEFORE UPDATE ON public.file_recent
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Shared file tracking
CREATE TABLE IF NOT EXISTS public.file_shared (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_file_shared_workspace_id ON public.file_shared(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_file_shared_status ON public.file_shared(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_file_shared_created_at ON public.file_shared(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_file_shared_data ON public.file_shared USING gin(data);

-- Enable RLS
ALTER TABLE public.file_shared ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view file_shared in their workspace"
  ON public.file_shared
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert file_shared in their workspace"
  ON public.file_shared
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update file_shared in their workspace"
  ON public.file_shared
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete file_shared in their workspace"
  ON public.file_shared
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_file_shared_updated_at
  BEFORE UPDATE ON public.file_shared
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User-starred files
CREATE TABLE IF NOT EXISTS public.file_starred (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_file_starred_workspace_id ON public.file_starred(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_file_starred_status ON public.file_starred(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_file_starred_created_at ON public.file_starred(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_file_starred_data ON public.file_starred USING gin(data);

-- Enable RLS
ALTER TABLE public.file_starred ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view file_starred in their workspace"
  ON public.file_starred
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert file_starred in their workspace"
  ON public.file_starred
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update file_starred in their workspace"
  ON public.file_starred
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete file_starred in their workspace"
  ON public.file_starred
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_file_starred_updated_at
  BEFORE UPDATE ON public.file_starred
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Deleted files (soft delete)
CREATE TABLE IF NOT EXISTS public.file_trash (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_file_trash_workspace_id ON public.file_trash(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_file_trash_status ON public.file_trash(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_file_trash_created_at ON public.file_trash(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_file_trash_data ON public.file_trash USING gin(data);

-- Enable RLS
ALTER TABLE public.file_trash ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view file_trash in their workspace"
  ON public.file_trash
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert file_trash in their workspace"
  ON public.file_trash
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update file_trash in their workspace"
  ON public.file_trash
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete file_trash in their workspace"
  ON public.file_trash
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_file_trash_updated_at
  BEFORE UPDATE ON public.file_trash
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- INSIGHTS MODULE (10 tables)
-- ============================================================================

-- Automated insight alerts
CREATE TABLE IF NOT EXISTS public.insight_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_alerts_workspace_id ON public.insight_alerts(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_alerts_status ON public.insight_alerts(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_alerts_created_at ON public.insight_alerts(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_alerts_data ON public.insight_alerts USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_alerts in their workspace"
  ON public.insight_alerts
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_alerts in their workspace"
  ON public.insight_alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_alerts in their workspace"
  ON public.insight_alerts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_alerts in their workspace"
  ON public.insight_alerts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_alerts_updated_at
  BEFORE UPDATE ON public.insight_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Anomaly detection results
CREATE TABLE IF NOT EXISTS public.insight_anomalies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_anomalies_workspace_id ON public.insight_anomalies(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_anomalies_status ON public.insight_anomalies(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_anomalies_created_at ON public.insight_anomalies(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_anomalies_data ON public.insight_anomalies USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_anomalies ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_anomalies in their workspace"
  ON public.insight_anomalies
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_anomalies in their workspace"
  ON public.insight_anomalies
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_anomalies in their workspace"
  ON public.insight_anomalies
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_anomalies in their workspace"
  ON public.insight_anomalies
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_anomalies_updated_at
  BEFORE UPDATE ON public.insight_anomalies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Data correlation analysis
CREATE TABLE IF NOT EXISTS public.insight_correlations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_correlations_workspace_id ON public.insight_correlations(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_correlations_status ON public.insight_correlations(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_correlations_created_at ON public.insight_correlations(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_correlations_data ON public.insight_correlations USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_correlations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_correlations in their workspace"
  ON public.insight_correlations
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_correlations in their workspace"
  ON public.insight_correlations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_correlations in their workspace"
  ON public.insight_correlations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_correlations in their workspace"
  ON public.insight_correlations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_correlations_updated_at
  BEFORE UPDATE ON public.insight_correlations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Predictive forecasts
CREATE TABLE IF NOT EXISTS public.insight_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_forecasts_workspace_id ON public.insight_forecasts(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_forecasts_status ON public.insight_forecasts(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_forecasts_created_at ON public.insight_forecasts(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_forecasts_data ON public.insight_forecasts USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_forecasts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_forecasts in their workspace"
  ON public.insight_forecasts
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_forecasts in their workspace"
  ON public.insight_forecasts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_forecasts in their workspace"
  ON public.insight_forecasts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_forecasts in their workspace"
  ON public.insight_forecasts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_forecasts_updated_at
  BEFORE UPDATE ON public.insight_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Pattern recognition results
CREATE TABLE IF NOT EXISTS public.insight_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_patterns_workspace_id ON public.insight_patterns(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_patterns_status ON public.insight_patterns(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_patterns_created_at ON public.insight_patterns(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_patterns_data ON public.insight_patterns USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_patterns ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_patterns in their workspace"
  ON public.insight_patterns
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_patterns in their workspace"
  ON public.insight_patterns
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_patterns in their workspace"
  ON public.insight_patterns
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_patterns in their workspace"
  ON public.insight_patterns
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_patterns_updated_at
  BEFORE UPDATE ON public.insight_patterns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- AI-generated recommendations
CREATE TABLE IF NOT EXISTS public.insight_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_workspace_id ON public.insight_recommendations(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_status ON public.insight_recommendations(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_created_at ON public.insight_recommendations(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_recommendations_data ON public.insight_recommendations USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_recommendations in their workspace"
  ON public.insight_recommendations
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_recommendations in their workspace"
  ON public.insight_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_recommendations in their workspace"
  ON public.insight_recommendations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_recommendations in their workspace"
  ON public.insight_recommendations
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_recommendations_updated_at
  BEFORE UPDATE ON public.insight_recommendations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- What-if scenario modeling
CREATE TABLE IF NOT EXISTS public.insight_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_workspace_id ON public.insight_scenarios(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_status ON public.insight_scenarios(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_created_at ON public.insight_scenarios(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_scenarios_data ON public.insight_scenarios USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_scenarios in their workspace"
  ON public.insight_scenarios
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_scenarios in their workspace"
  ON public.insight_scenarios
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_scenarios in their workspace"
  ON public.insight_scenarios
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_scenarios in their workspace"
  ON public.insight_scenarios
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_scenarios_updated_at
  BEFORE UPDATE ON public.insight_scenarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Data segmentation analysis
CREATE TABLE IF NOT EXISTS public.insight_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_segments_workspace_id ON public.insight_segments(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_segments_status ON public.insight_segments(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_segments_created_at ON public.insight_segments(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_segments_data ON public.insight_segments USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_segments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_segments in their workspace"
  ON public.insight_segments
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_segments in their workspace"
  ON public.insight_segments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_segments in their workspace"
  ON public.insight_segments
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_segments in their workspace"
  ON public.insight_segments
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_segments_updated_at
  BEFORE UPDATE ON public.insight_segments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Executive summaries
CREATE TABLE IF NOT EXISTS public.insight_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_summaries_workspace_id ON public.insight_summaries(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_summaries_status ON public.insight_summaries(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_summaries_created_at ON public.insight_summaries(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_summaries_data ON public.insight_summaries USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_summaries in their workspace"
  ON public.insight_summaries
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_summaries in their workspace"
  ON public.insight_summaries
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_summaries in their workspace"
  ON public.insight_summaries
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_summaries in their workspace"
  ON public.insight_summaries
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_summaries_updated_at
  BEFORE UPDATE ON public.insight_summaries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- What-if analysis data
CREATE TABLE IF NOT EXISTS public.insight_what_if (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_insight_what_if_workspace_id ON public.insight_what_if(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_insight_what_if_status ON public.insight_what_if(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_insight_what_if_created_at ON public.insight_what_if(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_insight_what_if_data ON public.insight_what_if USING gin(data);

-- Enable RLS
ALTER TABLE public.insight_what_if ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view insight_what_if in their workspace"
  ON public.insight_what_if
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert insight_what_if in their workspace"
  ON public.insight_what_if
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update insight_what_if in their workspace"
  ON public.insight_what_if
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete insight_what_if in their workspace"
  ON public.insight_what_if
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_insight_what_if_updated_at
  BEFORE UPDATE ON public.insight_what_if
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- JOBS MODULE (7 tables)
-- ============================================================================

-- Job application tracking
CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_applications_workspace_id ON public.job_applications(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON public.job_applications(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_applications_data ON public.job_applications USING gin(data);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_applications in their workspace"
  ON public.job_applications
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_applications in their workspace"
  ON public.job_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_applications in their workspace"
  ON public.job_applications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_applications in their workspace"
  ON public.job_applications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Candidate profiles
CREATE TABLE IF NOT EXISTS public.job_candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_candidates_workspace_id ON public.job_candidates(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_candidates_status ON public.job_candidates(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_candidates_created_at ON public.job_candidates(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_candidates_data ON public.job_candidates USING gin(data);

-- Enable RLS
ALTER TABLE public.job_candidates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_candidates in their workspace"
  ON public.job_candidates
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_candidates in their workspace"
  ON public.job_candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_candidates in their workspace"
  ON public.job_candidates
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_candidates in their workspace"
  ON public.job_candidates
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_candidates_updated_at
  BEFORE UPDATE ON public.job_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Interview scheduling and notes
CREATE TABLE IF NOT EXISTS public.job_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_interviews_workspace_id ON public.job_interviews(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_interviews_status ON public.job_interviews(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_interviews_created_at ON public.job_interviews(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_interviews_data ON public.job_interviews USING gin(data);

-- Enable RLS
ALTER TABLE public.job_interviews ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_interviews in their workspace"
  ON public.job_interviews
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_interviews in their workspace"
  ON public.job_interviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_interviews in their workspace"
  ON public.job_interviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_interviews in their workspace"
  ON public.job_interviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_interviews_updated_at
  BEFORE UPDATE ON public.job_interviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Job offer management
CREATE TABLE IF NOT EXISTS public.job_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_offers_workspace_id ON public.job_offers(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_offers_status ON public.job_offers(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_offers_created_at ON public.job_offers(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_offers_data ON public.job_offers USING gin(data);

-- Enable RLS
ALTER TABLE public.job_offers ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_offers in their workspace"
  ON public.job_offers
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_offers in their workspace"
  ON public.job_offers
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_offers in their workspace"
  ON public.job_offers
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_offers in their workspace"
  ON public.job_offers
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_offers_updated_at
  BEFORE UPDATE ON public.job_offers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- New hire onboarding
CREATE TABLE IF NOT EXISTS public.job_onboarding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_onboarding_workspace_id ON public.job_onboarding(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_onboarding_status ON public.job_onboarding(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_onboarding_created_at ON public.job_onboarding(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_onboarding_data ON public.job_onboarding USING gin(data);

-- Enable RLS
ALTER TABLE public.job_onboarding ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_onboarding in their workspace"
  ON public.job_onboarding
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_onboarding in their workspace"
  ON public.job_onboarding
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_onboarding in their workspace"
  ON public.job_onboarding
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_onboarding in their workspace"
  ON public.job_onboarding
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_onboarding_updated_at
  BEFORE UPDATE ON public.job_onboarding
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Active job postings
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_postings_workspace_id ON public.job_postings(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_postings_status ON public.job_postings(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_postings_created_at ON public.job_postings(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_postings_data ON public.job_postings USING gin(data);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_postings in their workspace"
  ON public.job_postings
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_postings in their workspace"
  ON public.job_postings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_postings in their workspace"
  ON public.job_postings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_postings in their workspace"
  ON public.job_postings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Job requisition requests
CREATE TABLE IF NOT EXISTS public.job_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_job_requisitions_workspace_id ON public.job_requisitions(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_job_requisitions_status ON public.job_requisitions(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_job_requisitions_created_at ON public.job_requisitions(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_job_requisitions_data ON public.job_requisitions USING gin(data);

-- Enable RLS
ALTER TABLE public.job_requisitions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view job_requisitions in their workspace"
  ON public.job_requisitions
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert job_requisitions in their workspace"
  ON public.job_requisitions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update job_requisitions in their workspace"
  ON public.job_requisitions
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete job_requisitions in their workspace"
  ON public.job_requisitions
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_job_requisitions_updated_at
  BEFORE UPDATE ON public.job_requisitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- LOCATIONS MODULE (7 tables)
-- ============================================================================

-- Location access control
CREATE TABLE IF NOT EXISTS public.location_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_access_workspace_id ON public.location_access(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_access_status ON public.location_access(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_access_created_at ON public.location_access(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_access_data ON public.location_access USING gin(data);

-- Enable RLS
ALTER TABLE public.location_access ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_access in their workspace"
  ON public.location_access
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_access in their workspace"
  ON public.location_access
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_access in their workspace"
  ON public.location_access
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_access in their workspace"
  ON public.location_access
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_access_updated_at
  BEFORE UPDATE ON public.location_access
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location amenities
CREATE TABLE IF NOT EXISTS public.location_amenities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_amenities_workspace_id ON public.location_amenities(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_amenities_status ON public.location_amenities(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_amenities_created_at ON public.location_amenities(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_amenities_data ON public.location_amenities USING gin(data);

-- Enable RLS
ALTER TABLE public.location_amenities ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_amenities in their workspace"
  ON public.location_amenities
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_amenities in their workspace"
  ON public.location_amenities
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_amenities in their workspace"
  ON public.location_amenities
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_amenities in their workspace"
  ON public.location_amenities
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_amenities_updated_at
  BEFORE UPDATE ON public.location_amenities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location booking system
CREATE TABLE IF NOT EXISTS public.location_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_bookings_workspace_id ON public.location_bookings(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_bookings_status ON public.location_bookings(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_bookings_created_at ON public.location_bookings(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_bookings_data ON public.location_bookings USING gin(data);

-- Enable RLS
ALTER TABLE public.location_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_bookings in their workspace"
  ON public.location_bookings
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_bookings in their workspace"
  ON public.location_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_bookings in their workspace"
  ON public.location_bookings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_bookings in their workspace"
  ON public.location_bookings
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_bookings_updated_at
  BEFORE UPDATE ON public.location_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location capacity tracking
CREATE TABLE IF NOT EXISTS public.location_capacity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_capacity_workspace_id ON public.location_capacity(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_capacity_status ON public.location_capacity(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_capacity_created_at ON public.location_capacity(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_capacity_data ON public.location_capacity USING gin(data);

-- Enable RLS
ALTER TABLE public.location_capacity ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_capacity in their workspace"
  ON public.location_capacity
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_capacity in their workspace"
  ON public.location_capacity
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_capacity in their workspace"
  ON public.location_capacity
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_capacity in their workspace"
  ON public.location_capacity
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_capacity_updated_at
  BEFORE UPDATE ON public.location_capacity
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location-specific equipment
CREATE TABLE IF NOT EXISTS public.location_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_equipment_workspace_id ON public.location_equipment(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_equipment_status ON public.location_equipment(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_equipment_created_at ON public.location_equipment(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_equipment_data ON public.location_equipment USING gin(data);

-- Enable RLS
ALTER TABLE public.location_equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_equipment in their workspace"
  ON public.location_equipment
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_equipment in their workspace"
  ON public.location_equipment
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_equipment in their workspace"
  ON public.location_equipment
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_equipment in their workspace"
  ON public.location_equipment
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_equipment_updated_at
  BEFORE UPDATE ON public.location_equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location floor plans
CREATE TABLE IF NOT EXISTS public.location_floor_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_workspace_id ON public.location_floor_plans(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_status ON public.location_floor_plans(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_created_at ON public.location_floor_plans(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_floor_plans_data ON public.location_floor_plans USING gin(data);

-- Enable RLS
ALTER TABLE public.location_floor_plans ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_floor_plans in their workspace"
  ON public.location_floor_plans
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_floor_plans in their workspace"
  ON public.location_floor_plans
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_floor_plans in their workspace"
  ON public.location_floor_plans
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_floor_plans in their workspace"
  ON public.location_floor_plans
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_floor_plans_updated_at
  BEFORE UPDATE ON public.location_floor_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Location zone definitions
CREATE TABLE IF NOT EXISTS public.location_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_location_zones_workspace_id ON public.location_zones(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_location_zones_status ON public.location_zones(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_location_zones_created_at ON public.location_zones(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_location_zones_data ON public.location_zones USING gin(data);

-- Enable RLS
ALTER TABLE public.location_zones ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view location_zones in their workspace"
  ON public.location_zones
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert location_zones in their workspace"
  ON public.location_zones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update location_zones in their workspace"
  ON public.location_zones
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete location_zones in their workspace"
  ON public.location_zones
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_location_zones_updated_at
  BEFORE UPDATE ON public.location_zones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- MARKETPLACE MODULE (9 tables)
-- ============================================================================

-- User favorite items
CREATE TABLE IF NOT EXISTS public.marketplace_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_workspace_id ON public.marketplace_favorites(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_status ON public.marketplace_favorites(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_created_at ON public.marketplace_favorites(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_favorites_data ON public.marketplace_favorites USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_favorites in their workspace"
  ON public.marketplace_favorites
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_favorites in their workspace"
  ON public.marketplace_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_favorites in their workspace"
  ON public.marketplace_favorites
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_favorites in their workspace"
  ON public.marketplace_favorites
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_favorites_updated_at
  BEFORE UPDATE ON public.marketplace_favorites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User shopping lists
CREATE TABLE IF NOT EXISTS public.marketplace_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_workspace_id ON public.marketplace_lists(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_status ON public.marketplace_lists(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_created_at ON public.marketplace_lists(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_lists_data ON public.marketplace_lists USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_lists ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_lists in their workspace"
  ON public.marketplace_lists
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_lists in their workspace"
  ON public.marketplace_lists
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_lists in their workspace"
  ON public.marketplace_lists
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_lists in their workspace"
  ON public.marketplace_lists
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_lists_updated_at
  BEFORE UPDATE ON public.marketplace_lists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Marketplace orders
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_workspace_id ON public.marketplace_orders(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at ON public.marketplace_orders(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_data ON public.marketplace_orders USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_orders in their workspace"
  ON public.marketplace_orders
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_orders in their workspace"
  ON public.marketplace_orders
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_orders in their workspace"
  ON public.marketplace_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_orders in their workspace"
  ON public.marketplace_orders
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_orders_updated_at
  BEFORE UPDATE ON public.marketplace_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Product catalog
CREATE TABLE IF NOT EXISTS public.marketplace_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_products_workspace_id ON public.marketplace_products(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_products_status ON public.marketplace_products(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_products_created_at ON public.marketplace_products(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_products_data ON public.marketplace_products USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_products ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_products in their workspace"
  ON public.marketplace_products
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_products in their workspace"
  ON public.marketplace_products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_products in their workspace"
  ON public.marketplace_products
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_products in their workspace"
  ON public.marketplace_products
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_products_updated_at
  BEFORE UPDATE ON public.marketplace_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Purchase history
CREATE TABLE IF NOT EXISTS public.marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_workspace_id ON public.marketplace_purchases(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_status ON public.marketplace_purchases(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_created_at ON public.marketplace_purchases(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_data ON public.marketplace_purchases USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_purchases in their workspace"
  ON public.marketplace_purchases
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_purchases in their workspace"
  ON public.marketplace_purchases
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_purchases in their workspace"
  ON public.marketplace_purchases
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_purchases in their workspace"
  ON public.marketplace_purchases
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_purchases_updated_at
  BEFORE UPDATE ON public.marketplace_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Product reviews
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_workspace_id ON public.marketplace_reviews(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_status ON public.marketplace_reviews(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_created_at ON public.marketplace_reviews(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_data ON public.marketplace_reviews USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_reviews in their workspace"
  ON public.marketplace_reviews
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_reviews in their workspace"
  ON public.marketplace_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_reviews in their workspace"
  ON public.marketplace_reviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_reviews in their workspace"
  ON public.marketplace_reviews
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_reviews_updated_at
  BEFORE UPDATE ON public.marketplace_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Sales tracking
CREATE TABLE IF NOT EXISTS public.marketplace_sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_workspace_id ON public.marketplace_sales(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_status ON public.marketplace_sales(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_created_at ON public.marketplace_sales(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_sales_data ON public.marketplace_sales USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_sales in their workspace"
  ON public.marketplace_sales
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_sales in their workspace"
  ON public.marketplace_sales
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_sales in their workspace"
  ON public.marketplace_sales
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_sales in their workspace"
  ON public.marketplace_sales
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_sales_updated_at
  BEFORE UPDATE ON public.marketplace_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Service offerings
CREATE TABLE IF NOT EXISTS public.marketplace_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_services_workspace_id ON public.marketplace_services(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_services_status ON public.marketplace_services(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_services_created_at ON public.marketplace_services(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_services_data ON public.marketplace_services USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_services ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_services in their workspace"
  ON public.marketplace_services
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_services in their workspace"
  ON public.marketplace_services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_services in their workspace"
  ON public.marketplace_services
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_services in their workspace"
  ON public.marketplace_services
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_services_updated_at
  BEFORE UPDATE ON public.marketplace_services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Vendor management
CREATE TABLE IF NOT EXISTS public.marketplace_vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_workspace_id ON public.marketplace_vendors(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_status ON public.marketplace_vendors(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_created_at ON public.marketplace_vendors(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_marketplace_vendors_data ON public.marketplace_vendors USING gin(data);

-- Enable RLS
ALTER TABLE public.marketplace_vendors ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view marketplace_vendors in their workspace"
  ON public.marketplace_vendors
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert marketplace_vendors in their workspace"
  ON public.marketplace_vendors
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update marketplace_vendors in their workspace"
  ON public.marketplace_vendors
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete marketplace_vendors in their workspace"
  ON public.marketplace_vendors
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_marketplace_vendors_updated_at
  BEFORE UPDATE ON public.marketplace_vendors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- PEOPLE MODULE (8 tables)
-- ============================================================================

-- Staff availability calendar
CREATE TABLE IF NOT EXISTS public.people_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_availability_workspace_id ON public.people_availability(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_availability_status ON public.people_availability(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_availability_created_at ON public.people_availability(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_availability_data ON public.people_availability USING gin(data);

-- Enable RLS
ALTER TABLE public.people_availability ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_availability in their workspace"
  ON public.people_availability
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_availability in their workspace"
  ON public.people_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_availability in their workspace"
  ON public.people_availability
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_availability in their workspace"
  ON public.people_availability
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_availability_updated_at
  BEFORE UPDATE ON public.people_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Staff certifications
CREATE TABLE IF NOT EXISTS public.people_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_certifications_workspace_id ON public.people_certifications(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_certifications_status ON public.people_certifications(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_certifications_created_at ON public.people_certifications(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_certifications_data ON public.people_certifications USING gin(data);

-- Enable RLS
ALTER TABLE public.people_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_certifications in their workspace"
  ON public.people_certifications
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_certifications in their workspace"
  ON public.people_certifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_certifications in their workspace"
  ON public.people_certifications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_certifications in their workspace"
  ON public.people_certifications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_certifications_updated_at
  BEFORE UPDATE ON public.people_certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Department structure
CREATE TABLE IF NOT EXISTS public.people_departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_departments_workspace_id ON public.people_departments(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_departments_status ON public.people_departments(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_departments_created_at ON public.people_departments(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_departments_data ON public.people_departments USING gin(data);

-- Enable RLS
ALTER TABLE public.people_departments ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_departments in their workspace"
  ON public.people_departments
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_departments in their workspace"
  ON public.people_departments
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_departments in their workspace"
  ON public.people_departments
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_departments in their workspace"
  ON public.people_departments
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_departments_updated_at
  BEFORE UPDATE ON public.people_departments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Staff directory
CREATE TABLE IF NOT EXISTS public.people_directory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_directory_workspace_id ON public.people_directory(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_directory_status ON public.people_directory(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_directory_created_at ON public.people_directory(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_directory_data ON public.people_directory USING gin(data);

-- Enable RLS
ALTER TABLE public.people_directory ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_directory in their workspace"
  ON public.people_directory
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_directory in their workspace"
  ON public.people_directory
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_directory in their workspace"
  ON public.people_directory
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_directory in their workspace"
  ON public.people_directory
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_directory_updated_at
  BEFORE UPDATE ON public.people_directory
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- User keyboard shortcuts
CREATE TABLE IF NOT EXISTS public.people_keyboard_shortcuts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_keyboard_shortcuts_workspace_id ON public.people_keyboard_shortcuts(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_keyboard_shortcuts_status ON public.people_keyboard_shortcuts(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_keyboard_shortcuts_created_at ON public.people_keyboard_shortcuts(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_keyboard_shortcuts_data ON public.people_keyboard_shortcuts USING gin(data);

-- Enable RLS
ALTER TABLE public.people_keyboard_shortcuts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_keyboard_shortcuts in their workspace"
  ON public.people_keyboard_shortcuts
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_keyboard_shortcuts in their workspace"
  ON public.people_keyboard_shortcuts
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_keyboard_shortcuts in their workspace"
  ON public.people_keyboard_shortcuts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_keyboard_shortcuts in their workspace"
  ON public.people_keyboard_shortcuts
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_keyboard_shortcuts_updated_at
  BEFORE UPDATE ON public.people_keyboard_shortcuts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Organization chart data
CREATE TABLE IF NOT EXISTS public.people_org_chart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_org_chart_workspace_id ON public.people_org_chart(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_org_chart_status ON public.people_org_chart(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_org_chart_created_at ON public.people_org_chart(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_org_chart_data ON public.people_org_chart USING gin(data);

-- Enable RLS
ALTER TABLE public.people_org_chart ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_org_chart in their workspace"
  ON public.people_org_chart
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_org_chart in their workspace"
  ON public.people_org_chart
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_org_chart in their workspace"
  ON public.people_org_chart
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_org_chart in their workspace"
  ON public.people_org_chart
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_org_chart_updated_at
  BEFORE UPDATE ON public.people_org_chart
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Staff skills matrix
CREATE TABLE IF NOT EXISTS public.people_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_skills_workspace_id ON public.people_skills(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_skills_status ON public.people_skills(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_skills_created_at ON public.people_skills(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_skills_data ON public.people_skills USING gin(data);

-- Enable RLS
ALTER TABLE public.people_skills ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_skills in their workspace"
  ON public.people_skills
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_skills in their workspace"
  ON public.people_skills
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_skills in their workspace"
  ON public.people_skills
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_skills in their workspace"
  ON public.people_skills
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_skills_updated_at
  BEFORE UPDATE ON public.people_skills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Team assignments
CREATE TABLE IF NOT EXISTS public.people_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_people_teams_workspace_id ON public.people_teams(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_people_teams_status ON public.people_teams(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_people_teams_created_at ON public.people_teams(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_people_teams_data ON public.people_teams USING gin(data);

-- Enable RLS
ALTER TABLE public.people_teams ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view people_teams in their workspace"
  ON public.people_teams
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert people_teams in their workspace"
  ON public.people_teams
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update people_teams in their workspace"
  ON public.people_teams
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete people_teams in their workspace"
  ON public.people_teams
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_people_teams_updated_at
  BEFORE UPDATE ON public.people_teams
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- PROCUREMENT MODULE (1 tables)
-- ============================================================================

-- Scope of work documents
CREATE TABLE IF NOT EXISTS public.scopes_of_work (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_scopes_of_work_workspace_id ON public.scopes_of_work(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_scopes_of_work_status ON public.scopes_of_work(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_scopes_of_work_created_at ON public.scopes_of_work(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_scopes_of_work_data ON public.scopes_of_work USING gin(data);

-- Enable RLS
ALTER TABLE public.scopes_of_work ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view scopes_of_work in their workspace"
  ON public.scopes_of_work
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert scopes_of_work in their workspace"
  ON public.scopes_of_work
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update scopes_of_work in their workspace"
  ON public.scopes_of_work
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete scopes_of_work in their workspace"
  ON public.scopes_of_work
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_scopes_of_work_updated_at
  BEFORE UPDATE ON public.scopes_of_work
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- PROJECTS MODULE (8 tables)
-- ============================================================================

-- Project budget tracking
CREATE TABLE IF NOT EXISTS public.project_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_budgets_workspace_id ON public.project_budgets(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_budgets_status ON public.project_budgets(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_budgets_created_at ON public.project_budgets(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_budgets_data ON public.project_budgets USING gin(data);

-- Enable RLS
ALTER TABLE public.project_budgets ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_budgets in their workspace"
  ON public.project_budgets
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_budgets in their workspace"
  ON public.project_budgets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_budgets in their workspace"
  ON public.project_budgets
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_budgets in their workspace"
  ON public.project_budgets
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_budgets_updated_at
  BEFORE UPDATE ON public.project_budgets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project calendar views
CREATE TABLE IF NOT EXISTS public.project_calendar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_calendar_workspace_id ON public.project_calendar(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_calendar_status ON public.project_calendar(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_calendar_created_at ON public.project_calendar(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_calendar_data ON public.project_calendar USING gin(data);

-- Enable RLS
ALTER TABLE public.project_calendar ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_calendar in their workspace"
  ON public.project_calendar
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_calendar in their workspace"
  ON public.project_calendar
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_calendar in their workspace"
  ON public.project_calendar
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_calendar in their workspace"
  ON public.project_calendar
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_calendar_updated_at
  BEFORE UPDATE ON public.project_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Gantt chart data
CREATE TABLE IF NOT EXISTS public.project_gantt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_gantt_workspace_id ON public.project_gantt(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_gantt_status ON public.project_gantt(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_gantt_created_at ON public.project_gantt(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_gantt_data ON public.project_gantt USING gin(data);

-- Enable RLS
ALTER TABLE public.project_gantt ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_gantt in their workspace"
  ON public.project_gantt
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_gantt in their workspace"
  ON public.project_gantt
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_gantt in their workspace"
  ON public.project_gantt
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_gantt in their workspace"
  ON public.project_gantt
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_gantt_updated_at
  BEFORE UPDATE ON public.project_gantt
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project milestones
CREATE TABLE IF NOT EXISTS public.project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_milestones_workspace_id ON public.project_milestones(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_milestones_status ON public.project_milestones(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_milestones_created_at ON public.project_milestones(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_milestones_data ON public.project_milestones USING gin(data);

-- Enable RLS
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_milestones in their workspace"
  ON public.project_milestones
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_milestones in their workspace"
  ON public.project_milestones
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_milestones in their workspace"
  ON public.project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_milestones in their workspace"
  ON public.project_milestones
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_milestones_updated_at
  BEFORE UPDATE ON public.project_milestones
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project resource allocation
CREATE TABLE IF NOT EXISTS public.project_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_resources_workspace_id ON public.project_resources(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_resources_status ON public.project_resources(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_resources_created_at ON public.project_resources(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_resources_data ON public.project_resources USING gin(data);

-- Enable RLS
ALTER TABLE public.project_resources ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_resources in their workspace"
  ON public.project_resources
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_resources in their workspace"
  ON public.project_resources
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_resources in their workspace"
  ON public.project_resources
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_resources in their workspace"
  ON public.project_resources
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_resources_updated_at
  BEFORE UPDATE ON public.project_resources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project risk register
CREATE TABLE IF NOT EXISTS public.project_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_risks_workspace_id ON public.project_risks(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_risks_status ON public.project_risks(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_risks_created_at ON public.project_risks(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_risks_data ON public.project_risks USING gin(data);

-- Enable RLS
ALTER TABLE public.project_risks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_risks in their workspace"
  ON public.project_risks
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_risks in their workspace"
  ON public.project_risks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_risks in their workspace"
  ON public.project_risks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_risks in their workspace"
  ON public.project_risks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_risks_updated_at
  BEFORE UPDATE ON public.project_risks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project task management
CREATE TABLE IF NOT EXISTS public.project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_tasks_workspace_id ON public.project_tasks(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_tasks_status ON public.project_tasks(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_tasks_created_at ON public.project_tasks(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_tasks_data ON public.project_tasks USING gin(data);

-- Enable RLS
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_tasks in their workspace"
  ON public.project_tasks
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_tasks in their workspace"
  ON public.project_tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_tasks in their workspace"
  ON public.project_tasks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_tasks in their workspace"
  ON public.project_tasks
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_tasks_updated_at
  BEFORE UPDATE ON public.project_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Project timeline data
CREATE TABLE IF NOT EXISTS public.project_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_project_timelines_workspace_id ON public.project_timelines(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_project_timelines_status ON public.project_timelines(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_project_timelines_created_at ON public.project_timelines(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_project_timelines_data ON public.project_timelines USING gin(data);

-- Enable RLS
ALTER TABLE public.project_timelines ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view project_timelines in their workspace"
  ON public.project_timelines
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert project_timelines in their workspace"
  ON public.project_timelines
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update project_timelines in their workspace"
  ON public.project_timelines
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete project_timelines in their workspace"
  ON public.project_timelines
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_project_timelines_updated_at
  BEFORE UPDATE ON public.project_timelines
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- REPORTS MODULE (5 tables)
-- ============================================================================

-- Custom report builder
CREATE TABLE IF NOT EXISTS public.report_builder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_report_builder_workspace_id ON public.report_builder(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_report_builder_status ON public.report_builder(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_report_builder_created_at ON public.report_builder(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_report_builder_data ON public.report_builder USING gin(data);

-- Enable RLS
ALTER TABLE public.report_builder ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view report_builder in their workspace"
  ON public.report_builder
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert report_builder in their workspace"
  ON public.report_builder
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update report_builder in their workspace"
  ON public.report_builder
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete report_builder in their workspace"
  ON public.report_builder
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_report_builder_updated_at
  BEFORE UPDATE ON public.report_builder
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Report dashboard layouts
CREATE TABLE IF NOT EXISTS public.report_dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_report_dashboards_workspace_id ON public.report_dashboards(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_report_dashboards_status ON public.report_dashboards(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_report_dashboards_created_at ON public.report_dashboards(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_report_dashboards_data ON public.report_dashboards USING gin(data);

-- Enable RLS
ALTER TABLE public.report_dashboards ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view report_dashboards in their workspace"
  ON public.report_dashboards
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert report_dashboards in their workspace"
  ON public.report_dashboards
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update report_dashboards in their workspace"
  ON public.report_dashboards
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete report_dashboards in their workspace"
  ON public.report_dashboards
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_report_dashboards_updated_at
  BEFORE UPDATE ON public.report_dashboards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Report export history
CREATE TABLE IF NOT EXISTS public.report_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_report_exports_workspace_id ON public.report_exports(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_report_exports_status ON public.report_exports(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_report_exports_created_at ON public.report_exports(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_report_exports_data ON public.report_exports USING gin(data);

-- Enable RLS
ALTER TABLE public.report_exports ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view report_exports in their workspace"
  ON public.report_exports
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert report_exports in their workspace"
  ON public.report_exports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update report_exports in their workspace"
  ON public.report_exports
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete report_exports in their workspace"
  ON public.report_exports
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_report_exports_updated_at
  BEFORE UPDATE ON public.report_exports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Scheduled report runs
CREATE TABLE IF NOT EXISTS public.report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_report_schedules_workspace_id ON public.report_schedules(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_report_schedules_status ON public.report_schedules(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_report_schedules_created_at ON public.report_schedules(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_report_schedules_data ON public.report_schedules USING gin(data);

-- Enable RLS
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view report_schedules in their workspace"
  ON public.report_schedules
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert report_schedules in their workspace"
  ON public.report_schedules
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update report_schedules in their workspace"
  ON public.report_schedules
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete report_schedules in their workspace"
  ON public.report_schedules
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_report_schedules_updated_at
  BEFORE UPDATE ON public.report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Report templates
CREATE TABLE IF NOT EXISTS public.report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_report_templates_workspace_id ON public.report_templates(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_report_templates_status ON public.report_templates(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_report_templates_created_at ON public.report_templates(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_report_templates_data ON public.report_templates USING gin(data);

-- Enable RLS
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view report_templates in their workspace"
  ON public.report_templates
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert report_templates in their workspace"
  ON public.report_templates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update report_templates in their workspace"
  ON public.report_templates
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete report_templates in their workspace"
  ON public.report_templates
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_report_templates_updated_at
  BEFORE UPDATE ON public.report_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();



-- ============================================================================
-- RESOURCES MODULE (7 tables)
-- ============================================================================

-- Training courses
CREATE TABLE IF NOT EXISTS public.resource_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_courses_workspace_id ON public.resource_courses(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_courses_status ON public.resource_courses(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_courses_created_at ON public.resource_courses(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_courses_data ON public.resource_courses USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_courses ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_courses in their workspace"
  ON public.resource_courses
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_courses in their workspace"
  ON public.resource_courses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_courses in their workspace"
  ON public.resource_courses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_courses in their workspace"
  ON public.resource_courses
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_courses_updated_at
  BEFORE UPDATE ON public.resource_courses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Industry glossary
CREATE TABLE IF NOT EXISTS public.resource_glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_glossary_workspace_id ON public.resource_glossary(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_glossary_status ON public.resource_glossary(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_glossary_created_at ON public.resource_glossary(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_glossary_data ON public.resource_glossary USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_glossary ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_glossary in their workspace"
  ON public.resource_glossary
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_glossary in their workspace"
  ON public.resource_glossary
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_glossary in their workspace"
  ON public.resource_glossary
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_glossary in their workspace"
  ON public.resource_glossary
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_glossary_updated_at
  BEFORE UPDATE ON public.resource_glossary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Grant opportunities
CREATE TABLE IF NOT EXISTS public.resource_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_grants_workspace_id ON public.resource_grants(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_grants_status ON public.resource_grants(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_grants_created_at ON public.resource_grants(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_grants_data ON public.resource_grants USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_grants ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_grants in their workspace"
  ON public.resource_grants
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_grants in their workspace"
  ON public.resource_grants
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_grants in their workspace"
  ON public.resource_grants
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_grants in their workspace"
  ON public.resource_grants
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_grants_updated_at
  BEFORE UPDATE ON public.resource_grants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- How-to guides
CREATE TABLE IF NOT EXISTS public.resource_guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_guides_workspace_id ON public.resource_guides(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_guides_status ON public.resource_guides(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_guides_created_at ON public.resource_guides(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_guides_data ON public.resource_guides USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_guides ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_guides in their workspace"
  ON public.resource_guides
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_guides in their workspace"
  ON public.resource_guides
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_guides in their workspace"
  ON public.resource_guides
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_guides in their workspace"
  ON public.resource_guides
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_guides_updated_at
  BEFORE UPDATE ON public.resource_guides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Resource library
CREATE TABLE IF NOT EXISTS public.resource_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_library_workspace_id ON public.resource_library(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_library_status ON public.resource_library(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_library_created_at ON public.resource_library(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_library_data ON public.resource_library USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_library ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_library in their workspace"
  ON public.resource_library
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_library in their workspace"
  ON public.resource_library
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_library in their workspace"
  ON public.resource_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_library in their workspace"
  ON public.resource_library
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_library_updated_at
  BEFORE UPDATE ON public.resource_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Industry publications
CREATE TABLE IF NOT EXISTS public.resource_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_publications_workspace_id ON public.resource_publications(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_publications_status ON public.resource_publications(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_publications_created_at ON public.resource_publications(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_publications_data ON public.resource_publications USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_publications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_publications in their workspace"
  ON public.resource_publications
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_publications in their workspace"
  ON public.resource_publications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_publications in their workspace"
  ON public.resource_publications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_publications in their workspace"
  ON public.resource_publications
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_publications_updated_at
  BEFORE UPDATE ON public.resource_publications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


-- Troubleshooting guides
CREATE TABLE IF NOT EXISTS public.resource_troubleshooting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_resource_troubleshooting_workspace_id ON public.resource_troubleshooting(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_resource_troubleshooting_status ON public.resource_troubleshooting(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_resource_troubleshooting_created_at ON public.resource_troubleshooting(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_resource_troubleshooting_data ON public.resource_troubleshooting USING gin(data);

-- Enable RLS
ALTER TABLE public.resource_troubleshooting ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view resource_troubleshooting in their workspace"
  ON public.resource_troubleshooting
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert resource_troubleshooting in their workspace"
  ON public.resource_troubleshooting
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update resource_troubleshooting in their workspace"
  ON public.resource_troubleshooting
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete resource_troubleshooting in their workspace"
  ON public.resource_troubleshooting
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_resource_troubleshooting_updated_at
  BEFORE UPDATE ON public.resource_troubleshooting
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();


