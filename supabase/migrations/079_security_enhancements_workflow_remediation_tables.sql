-- =============================================
-- WORKFLOW REMEDIATION: Missing Critical Tables
-- Migration: 20251104214000
-- Date: November 4, 2025
-- Purpose: Create 11 missing tables to complete workflow infrastructure
-- =============================================

-- =============================================
-- 1. ASSET CATALOG TABLE (BESPOKE GLOBAL CATALOG)
-- =============================================
-- Purpose: Global reference catalog of all available asset types
-- This is separate from the 'assets' table which tracks actual inventory instances
-- The existing seeded data in 'assets' table with global workspace will be migrated here

CREATE TABLE IF NOT EXISTS public.asset_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identification
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  sku TEXT UNIQUE,
  
  -- Classification
  asset_type TEXT CHECK (asset_type IN ('infrastructure', 'equipment', 'consumable', 'vehicle', 'technology')),
  asset_category TEXT, -- Legacy field for compatibility with seeded data
  industry TEXT[], -- Multi-industry support (events, construction, film, etc.)
  
  -- Specifications (flexible JSONB for any asset type)
  specifications JSONB DEFAULT '{}'::jsonb,
  dimensions JSONB DEFAULT '{}'::jsonb,
  
  -- Manufacturer details
  manufacturer TEXT,
  model_number TEXT,
  year INTEGER,
  
  -- Pricing (reference pricing, actual pricing may vary by workspace)
  msrp DECIMAL(15, 2),
  estimated_rental_daily DECIMAL(15, 2),
  estimated_rental_weekly DECIMAL(15, 2),
  estimated_rental_monthly DECIMAL(15, 2),
  
  -- Search & discovery
  tags TEXT[],
  keywords TEXT[], -- Alternative names, search terms
  
  -- Catalog metadata
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0,
  
  -- Media
  image_url TEXT,
  thumbnail_url TEXT,
  documentation_url TEXT,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX idx_asset_catalog_category ON public.asset_catalog(category) WHERE is_active = true;
CREATE INDEX idx_asset_catalog_subcategory ON public.asset_catalog(subcategory) WHERE is_active = true;
CREATE INDEX idx_asset_catalog_type ON public.asset_catalog(asset_type) WHERE is_active = true;
CREATE INDEX idx_asset_catalog_sku ON public.asset_catalog(sku) WHERE is_active = true;
CREATE INDEX idx_asset_catalog_manufacturer ON public.asset_catalog(manufacturer) WHERE is_active = true;
CREATE INDEX idx_asset_catalog_tags ON public.asset_catalog USING gin(tags);
CREATE INDEX idx_asset_catalog_keywords ON public.asset_catalog USING gin(keywords);
CREATE INDEX idx_asset_catalog_industry ON public.asset_catalog USING gin(industry);
CREATE INDEX idx_asset_catalog_specs ON public.asset_catalog USING gin(specifications);

-- Enable RLS
ALTER TABLE public.asset_catalog ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Asset catalog is globally readable (it's a reference catalog)
CREATE POLICY "Asset catalog is globally readable"
  ON public.asset_catalog FOR SELECT TO authenticated
  USING (is_active = true);

-- Only system admins can modify the global catalog
CREATE POLICY "Only admins can modify asset catalog"
  ON public.asset_catalog FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('legend', 'phantom')
    )
  );

CREATE TRIGGER set_asset_catalog_updated_at BEFORE UPDATE ON public.asset_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- MIGRATE EXISTING GLOBAL CATALOG DATA
-- =============================================
-- Migrate seeded assets from the global workspace to the new asset_catalog table
INSERT INTO public.asset_catalog (
  id,
  name,
  description,
  category,
  asset_type,
  asset_category,
  manufacturer,
  model_number,
  tags,
  keywords,
  specifications,
  created_at,
  created_by
)
SELECT 
  id,
  name,
  description,
  category,
  type as asset_type,
  asset_category,
  manufacturer,
  model_number,
  tags,
  tags as keywords, -- Use tags as initial keywords
  specifications,
  created_at,
  created_by
FROM public.assets
WHERE workspace_id = '00000000-0000-0000-0000-000000000001' -- Global catalog workspace
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- UPDATE ASSETS TABLE TO REFERENCE CATALOG
-- =============================================
-- Add catalog reference to existing assets table
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS catalog_item_id UUID REFERENCES public.asset_catalog(id);
CREATE INDEX IF NOT EXISTS idx_assets_catalog_item ON public.assets(catalog_item_id);

-- Add helper column to distinguish catalog-based vs custom assets
ALTER TABLE public.assets ADD COLUMN IF NOT EXISTS is_catalog_item BOOLEAN DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_assets_is_catalog_item ON public.assets(is_catalog_item) WHERE is_catalog_item = true;

-- =============================================
-- 2. COMPANY CONTRACTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.company_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  
  -- Contract details
  contract_number TEXT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('service', 'vendor', 'partnership', 'nda', 'msa', 'sow', 'other')),
  status TEXT CHECK (status IN ('draft', 'pending', 'active', 'expired', 'terminated', 'renewed')) DEFAULT 'draft',
  
  -- Dates
  start_date DATE,
  end_date DATE,
  renewal_date DATE,
  
  -- Financial
  contract_value DECIMAL(15, 2),
  payment_terms TEXT,
  
  -- Documents
  document_url TEXT,
  signed_document_url TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_company_contracts_workspace ON public.company_contracts(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_company_contracts_company ON public.company_contracts(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_company_contracts_status ON public.company_contracts(status) WHERE deleted_at IS NULL;

ALTER TABLE public.company_contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view company contracts in their workspace"
  ON public.company_contracts FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert company contracts in their workspace"
  ON public.company_contracts FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update company contracts in their workspace"
  ON public.company_contracts FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_company_contracts_updated_at BEFORE UPDATE ON public.company_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 3-6. PROCUREMENT TABLES
-- =============================================

-- 3. Procurement Requisitions
CREATE TABLE IF NOT EXISTS public.procurement_requisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Requisition details
  requisition_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'ordered', 'cancelled')) DEFAULT 'draft',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high', 'urgent')) DEFAULT 'normal',
  
  -- Requestor
  requested_by UUID REFERENCES auth.users(id),
  department TEXT,
  
  -- Dates
  requested_date DATE DEFAULT CURRENT_DATE,
  needed_by_date DATE,
  
  -- Financial
  estimated_total DECIMAL(15, 2),
  budget_code TEXT,
  
  -- Approval
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_procurement_requisitions_workspace ON public.procurement_requisitions(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_requisitions_status ON public.procurement_requisitions(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_requisitions_number ON public.procurement_requisitions(requisition_number) WHERE deleted_at IS NULL;

ALTER TABLE public.procurement_requisitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procurement requisitions in their workspace"
  ON public.procurement_requisitions FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert procurement requisitions in their workspace"
  ON public.procurement_requisitions FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update procurement requisitions in their workspace"
  ON public.procurement_requisitions FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_procurement_requisitions_updated_at BEFORE UPDATE ON public.procurement_requisitions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. Procurement Orders
CREATE TABLE IF NOT EXISTS public.procurement_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  requisition_id UUID REFERENCES public.procurement_requisitions(id),
  vendor_id UUID REFERENCES public.companies(id),
  
  -- Order details
  order_number TEXT UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'approved', 'ordered', 'partial', 'received', 'cancelled')) DEFAULT 'draft',
  
  -- Dates
  order_date DATE DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  
  -- Financial
  subtotal DECIMAL(15, 2),
  tax DECIMAL(15, 2),
  shipping DECIMAL(15, 2),
  total DECIMAL(15, 2),
  
  -- Payment
  payment_terms TEXT,
  payment_status TEXT CHECK (payment_status IN ('unpaid', 'partial', 'paid')) DEFAULT 'unpaid',
  
  -- Shipping
  shipping_address JSONB DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_procurement_orders_workspace ON public.procurement_orders(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_orders_status ON public.procurement_orders(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_orders_number ON public.procurement_orders(order_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_orders_vendor ON public.procurement_orders(vendor_id) WHERE deleted_at IS NULL;

ALTER TABLE public.procurement_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procurement orders in their workspace"
  ON public.procurement_orders FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert procurement orders in their workspace"
  ON public.procurement_orders FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update procurement orders in their workspace"
  ON public.procurement_orders FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_procurement_orders_updated_at BEFORE UPDATE ON public.procurement_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 5. Procurement Receiving
CREATE TABLE IF NOT EXISTS public.procurement_receiving (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.procurement_orders(id),
  
  -- Receiving details
  receipt_number TEXT UNIQUE,
  received_date DATE DEFAULT CURRENT_DATE,
  received_by UUID REFERENCES auth.users(id),
  
  -- Condition
  condition TEXT CHECK (condition IN ('good', 'damaged', 'partial', 'incorrect')) DEFAULT 'good',
  notes TEXT,
  
  -- Quantities
  items_received JSONB DEFAULT '[]'::jsonb,
  
  -- Inspection
  inspected_by UUID REFERENCES auth.users(id),
  inspection_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_procurement_receiving_workspace ON public.procurement_receiving(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_receiving_order ON public.procurement_receiving(order_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_receiving_number ON public.procurement_receiving(receipt_number) WHERE deleted_at IS NULL;

ALTER TABLE public.procurement_receiving ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procurement receiving in their workspace"
  ON public.procurement_receiving FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert procurement receiving in their workspace"
  ON public.procurement_receiving FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update procurement receiving in their workspace"
  ON public.procurement_receiving FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_procurement_receiving_updated_at BEFORE UPDATE ON public.procurement_receiving
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 6. Procurement Matching (3-way match: PO, Receipt, Invoice)
CREATE TABLE IF NOT EXISTS public.procurement_matching (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.procurement_orders(id),
  receipt_id UUID REFERENCES public.procurement_receiving(id),
  invoice_id UUID REFERENCES public.invoices(id),
  
  -- Match status
  status TEXT CHECK (status IN ('pending', 'matched', 'discrepancy', 'resolved')) DEFAULT 'pending',
  match_type TEXT CHECK (match_type IN ('2-way', '3-way')) DEFAULT '3-way',
  
  -- Discrepancies
  price_variance DECIMAL(15, 2),
  quantity_variance INTEGER,
  discrepancy_notes TEXT,
  
  -- Resolution
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_procurement_matching_workspace ON public.procurement_matching(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_matching_order ON public.procurement_matching(order_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_procurement_matching_status ON public.procurement_matching(status) WHERE deleted_at IS NULL;

ALTER TABLE public.procurement_matching ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view procurement matching in their workspace"
  ON public.procurement_matching FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert procurement matching in their workspace"
  ON public.procurement_matching FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update procurement matching in their workspace"
  ON public.procurement_matching FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_procurement_matching_updated_at BEFORE UPDATE ON public.procurement_matching
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 7-8. COMMUNITY TABLES
-- =============================================

-- 7. Community Members
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Member details
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  
  -- Status
  status TEXT CHECK (status IN ('active', 'inactive', 'banned', 'pending')) DEFAULT 'active',
  member_since DATE DEFAULT CURRENT_DATE,
  
  -- Engagement
  posts_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  likes_given INTEGER DEFAULT 0,
  likes_received INTEGER DEFAULT 0,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_community_members_workspace ON public.community_members(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_community_members_user ON public.community_members(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_community_members_status ON public.community_members(status) WHERE deleted_at IS NULL;

ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view community members in their workspace"
  ON public.community_members FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert community members in their workspace"
  ON public.community_members FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update their own community member record"
  ON public.community_members FOR UPDATE TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE TRIGGER set_community_members_updated_at BEFORE UPDATE ON public.community_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 8. User Points (Gamification)
CREATE TABLE IF NOT EXISTS public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Points
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  rank TEXT,
  
  -- Activity tracking
  action_type TEXT NOT NULL,
  action_description TEXT,
  points_earned INTEGER DEFAULT 0,
  points_deducted INTEGER DEFAULT 0,
  
  -- Context
  related_entity_type TEXT,
  related_entity_id UUID,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_user_points_workspace ON public.user_points(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_points_user ON public.user_points(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_points_action_type ON public.user_points(action_type) WHERE deleted_at IS NULL;

ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view user points in their workspace"
  ON public.user_points FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "System can insert user points"
  ON public.user_points FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE TRIGGER set_user_points_updated_at BEFORE UPDATE ON public.user_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 9. ANALYTICS FORECASTING TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.analytics_forecasting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Forecast details
  name TEXT NOT NULL,
  description TEXT,
  metric_name TEXT NOT NULL,
  forecast_type TEXT CHECK (forecast_type IN ('linear', 'exponential', 'seasonal', 'arima', 'ml')) DEFAULT 'linear',
  
  -- Time range
  historical_start_date DATE,
  historical_end_date DATE,
  forecast_start_date DATE,
  forecast_end_date DATE,
  
  -- Data
  historical_data JSONB DEFAULT '[]'::jsonb,
  forecast_data JSONB DEFAULT '[]'::jsonb,
  confidence_intervals JSONB DEFAULT '{}'::jsonb,
  
  -- Accuracy
  accuracy_score DECIMAL(5, 4),
  mean_absolute_error DECIMAL(15, 2),
  
  -- Status
  status TEXT CHECK (status IN ('draft', 'running', 'completed', 'failed')) DEFAULT 'draft',
  
  -- Metadata
  parameters JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_analytics_forecasting_workspace ON public.analytics_forecasting(workspace_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_analytics_forecasting_metric ON public.analytics_forecasting(metric_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_analytics_forecasting_status ON public.analytics_forecasting(status) WHERE deleted_at IS NULL;

ALTER TABLE public.analytics_forecasting ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics forecasting in their workspace"
  ON public.analytics_forecasting FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Users can insert analytics forecasting in their workspace"
  ON public.analytics_forecasting FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "Users can update analytics forecasting in their workspace"
  ON public.analytics_forecasting FOR UPDATE TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()) AND deleted_at IS NULL);

CREATE TRIGGER set_analytics_forecasting_updated_at BEFORE UPDATE ON public.analytics_forecasting
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- 10. USER ACTIVITY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  
  -- Activity details
  activity_type TEXT NOT NULL,
  activity_description TEXT,
  
  -- Context
  entity_type TEXT,
  entity_id UUID,
  entity_name TEXT,
  
  -- Action details
  action TEXT,
  changes JSONB DEFAULT '{}'::jsonb,
  
  -- Session
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_activity_workspace ON public.user_activity(workspace_id);
CREATE INDEX idx_user_activity_user ON public.user_activity(user_id);
CREATE INDEX idx_user_activity_type ON public.user_activity(activity_type);
CREATE INDEX idx_user_activity_created_at ON public.user_activity(created_at DESC);
CREATE INDEX idx_user_activity_entity ON public.user_activity(entity_type, entity_id);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view user activity in their workspace"
  ON public.user_activity FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "System can insert user activity"
  ON public.user_activity FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- =============================================
-- 11. AUTOMATION LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  automation_id UUID REFERENCES public.automations(id),
  
  -- Execution details
  execution_id TEXT,
  status TEXT CHECK (status IN ('pending', 'running', 'success', 'failed', 'cancelled')) DEFAULT 'pending',
  
  -- Trigger
  trigger_type TEXT,
  trigger_data JSONB DEFAULT '{}'::jsonb,
  
  -- Execution
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  duration_ms INTEGER,
  
  -- Results
  actions_executed JSONB DEFAULT '[]'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  stack_trace TEXT,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_automation_logs_workspace ON public.automation_logs(workspace_id);
CREATE INDEX idx_automation_logs_automation ON public.automation_logs(automation_id);
CREATE INDEX idx_automation_logs_status ON public.automation_logs(status);
CREATE INDEX idx_automation_logs_created_at ON public.automation_logs(created_at DESC);

ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view automation logs in their workspace"
  ON public.automation_logs FOR SELECT TO authenticated
  USING (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

CREATE POLICY "System can insert automation logs"
  ON public.automation_logs FOR INSERT TO authenticated
  WITH CHECK (workspace_id IN (SELECT workspace_id FROM public.workspace_members WHERE user_id = auth.uid()));

-- =============================================
-- ENABLE REALTIME
-- =============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.asset_catalog;
ALTER PUBLICATION supabase_realtime ADD TABLE public.company_contracts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.procurement_requisitions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.procurement_orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.procurement_receiving;
ALTER PUBLICATION supabase_realtime ADD TABLE public.procurement_matching;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_points;
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_forecasting;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.automation_logs;
