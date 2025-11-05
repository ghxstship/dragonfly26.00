-- =============================================
-- FINANCE MODULE OPTIMIZATION
-- Ramp + Runway + Prism.fm Integration
-- Migration: 20251015000000
-- =============================================
-- 
-- This migration enhances the Finance module to be competitive with:
-- - Ramp.com: Spend management, policy enforcement, automated approvals
-- - Runway.com: FP&A, scenario planning, forecasting, variance analysis
-- - Prism.fm: Show settlements, deal tracking, financial insights
--
-- =============================================

-- =============================================
-- PART 1: SPENDING POLICIES & CONTROLS (RAMP)
-- =============================================

-- Spending Policies
CREATE TABLE spending_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    policy_type TEXT NOT NULL CHECK (policy_type IN (
        'expense_limit', 'category_restriction', 'approval_required', 
        'pre_approval', 'merchant_restriction', 'time_restriction'
    )),
    
    applies_to_role TEXT[],
    applies_to_user_ids UUID[],
    applies_to_production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    applies_to_department TEXT,
    
    rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    
    enforcement_action TEXT DEFAULT 'require_approval' CHECK (enforcement_action IN (
        'block', 'require_approval', 'flag_for_review', 'notify_only'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Policy Violations Log
CREATE TABLE policy_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    policy_id UUID NOT NULL REFERENCES spending_policies(id) ON DELETE CASCADE,
    transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
    expense_item_id UUID REFERENCES expense_items(id) ON DELETE SET NULL,
    
    violated_by UUID NOT NULL REFERENCES auth.users(id),
    violation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    violation_type TEXT NOT NULL,
    violation_description TEXT NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved_exception', 'rejected', 'resolved'
    )),
    
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Corporate Cards
CREATE TABLE corporate_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    card_holder_id UUID NOT NULL REFERENCES auth.users(id),
    
    card_name TEXT NOT NULL,
    last_four TEXT NOT NULL,
    card_type TEXT CHECK (card_type IN ('physical', 'virtual', 'one_time')),
    
    spending_limit DECIMAL(12, 2),
    spending_period TEXT CHECK (spending_period IN ('daily', 'weekly', 'monthly', 'total')),
    spent_current_period DECIMAL(12, 2) DEFAULT 0,
    
    policy_id UUID REFERENCES spending_policies(id) ON DELETE SET NULL,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'frozen', 'cancelled', 'expired'
    )),
    
    issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Receipt Matching
CREATE TABLE receipt_matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    transaction_id UUID REFERENCES financial_transactions(id) ON DELETE CASCADE,
    expense_item_id UUID REFERENCES expense_items(id) ON DELETE CASCADE,
    
    receipt_url TEXT NOT NULL,
    receipt_data JSONB,
    
    match_status TEXT NOT NULL DEFAULT 'pending' CHECK (match_status IN (
        'pending', 'matched', 'mismatch', 'manual_review'
    )),
    
    match_confidence DECIMAL(3, 2),
    
    amount_difference DECIMAL(10, 2),
    date_difference INTEGER,
    mismatch_reason TEXT,
    
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PART 2: APPROVAL WORKFLOWS (RAMP)
-- =============================================

-- Enhanced Approval Chains
CREATE TABLE approval_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    chain_type TEXT NOT NULL CHECK (chain_type IN (
        'sequential', 'parallel', 'conditional'
    )),
    
    triggers_on TEXT NOT NULL CHECK (triggers_on IN (
        'budget', 'purchase_order', 'expense_report', 'invoice', 'payment', 'transaction'
    )),
    
    trigger_conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
    approver_chain JSONB NOT NULL,
    
    auto_approve_under_amount DECIMAL(12, 2),
    timeout_hours INTEGER DEFAULT 48,
    escalation_enabled BOOLEAN DEFAULT true,
    escalation_user_id UUID REFERENCES auth.users(id),
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approval Steps
CREATE TABLE approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    approval_chain_id UUID REFERENCES approval_chains(id) ON DELETE CASCADE,
    
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    step_level INTEGER NOT NULL,
    approver_id UUID NOT NULL REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'skipped', 'escalated'
    )),
    
    responded_at TIMESTAMPTZ,
    response_notes TEXT,
    
    due_date TIMESTAMPTZ,
    reminded_at TIMESTAMPTZ,
    escalated_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PART 3: BUDGET SCENARIOS & FORECASTING (RUNWAY)
-- =============================================

-- Budget Scenarios
CREATE TABLE budget_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    scenario_type TEXT NOT NULL CHECK (scenario_type IN (
        'optimistic', 'pessimistic', 'expected', 'custom'
    )),
    
    description TEXT,
    assumptions JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    projected_revenue DECIMAL(15, 2),
    projected_expenses DECIMAL(15, 2),
    projected_net DECIMAL(15, 2),
    
    probability_percentage INTEGER CHECK (probability_percentage >= 0 AND probability_percentage <= 100),
    
    variance_from_base DECIMAL(15, 2),
    variance_percentage DECIMAL(5, 2),
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial Forecasts
CREATE TABLE financial_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    forecast_start_date DATE NOT NULL,
    forecast_end_date DATE NOT NULL,
    forecast_frequency TEXT DEFAULT 'monthly' CHECK (forecast_frequency IN (
        'weekly', 'monthly', 'quarterly', 'annually'
    )),
    
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    budget_id UUID REFERENCES budgets(id) ON DELETE SET NULL,
    
    forecast_type TEXT NOT NULL CHECK (forecast_type IN (
        'revenue', 'expenses', 'cash_flow', 'profitability', 'comprehensive'
    )),
    
    forecast_model TEXT,
    assumptions JSONB DEFAULT '{}'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'archived', 'superseded'
    )),
    
    last_accuracy_check TIMESTAMPTZ,
    accuracy_score DECIMAL(5, 2),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forecast Data Points
CREATE TABLE forecast_data_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    forecast_id UUID NOT NULL REFERENCES financial_forecasts(id) ON DELETE CASCADE,
    
    period_start_date DATE NOT NULL,
    period_end_date DATE NOT NULL,
    
    forecasted_amount DECIMAL(15, 2) NOT NULL,
    actual_amount DECIMAL(15, 2),
    
    variance_amount DECIMAL(15, 2),
    variance_percentage DECIMAL(5, 2),
    
    confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PART 4: VARIANCE ANALYSIS & TRACKING (RUNWAY)
-- =============================================

-- Budget Variance Tracking
CREATE TABLE budget_variance_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    budget_line_item_id UUID REFERENCES budget_line_items(id) ON DELETE SET NULL,
    
    tracking_period_start DATE NOT NULL,
    tracking_period_end DATE NOT NULL,
    
    budgeted_amount DECIMAL(15, 2) NOT NULL,
    actual_amount DECIMAL(15, 2) NOT NULL,
    
    variance_amount DECIMAL(15, 2) GENERATED ALWAYS AS (actual_amount - budgeted_amount) STORED,
    variance_percentage DECIMAL(5, 2),
    
    variance_type TEXT CHECK (variance_type IN ('favorable', 'unfavorable', 'neutral')),
    variance_category TEXT,
    
    root_cause TEXT,
    root_cause_category TEXT CHECK (root_cause_category IN (
        'volume', 'price', 'efficiency', 'timing', 'scope_change', 'error', 'other'
    )),
    
    impact_assessment TEXT,
    corrective_action TEXT,
    
    requires_action BOOLEAN DEFAULT false,
    action_taken BOOLEAN DEFAULT false,
    
    analyzed_by UUID REFERENCES auth.users(id),
    analyzed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cash Flow Projections
CREATE TABLE cash_flow_projections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    
    projection_start_date DATE NOT NULL,
    projection_end_date DATE NOT NULL,
    
    opening_balance DECIMAL(15, 2) NOT NULL,
    
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'active', 'locked', 'archived'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cash Flow Items
CREATE TABLE cash_flow_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    projection_id UUID NOT NULL REFERENCES cash_flow_projections(id) ON DELETE CASCADE,
    
    period_date DATE NOT NULL,
    
    projected_inflows DECIMAL(15, 2) DEFAULT 0,
    actual_inflows DECIMAL(15, 2),
    
    projected_outflows DECIMAL(15, 2) DEFAULT 0,
    actual_outflows DECIMAL(15, 2),
    
    projected_net DECIMAL(15, 2) GENERATED ALWAYS AS (projected_inflows - projected_outflows) STORED,
    projected_balance DECIMAL(15, 2),
    
    actual_net DECIMAL(15, 2),
    actual_balance DECIMAL(15, 2),
    
    inflow_breakdown JSONB DEFAULT '{}'::jsonb,
    outflow_breakdown JSONB DEFAULT '{}'::jsonb,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PART 5: ENHANCED RECONCILIATION (PRISM.FM)
-- =============================================

-- Deal Financial Terms
CREATE TABLE deal_financial_terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    deal_name TEXT NOT NULL,
    deal_type TEXT NOT NULL CHECK (deal_type IN (
        'show_deal', 'guarantee', 'versus_deal', 'profit_split', 
        'percentage_of_gross', 'flat_fee', 'hybrid'
    )),
    
    financial_structure JSONB NOT NULL DEFAULT '{}'::jsonb,
    party_splits JSONB DEFAULT '[]'::jsonb,
    
    currency TEXT DEFAULT 'USD',
    deposit_amount DECIMAL(12, 2),
    deposit_due_date DATE,
    deposit_received_date DATE,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'negotiating', 'agreed', 'contracted', 'executed', 'settled', 'disputed'
    )),
    
    contract_date DATE,
    settlement_due_date DATE,
    
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enhanced Reconciliation Line Items
CREATE TABLE reconciliation_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reconciliation_id UUID NOT NULL REFERENCES reconciliations(id) ON DELETE CASCADE,
    
    line_type TEXT NOT NULL CHECK (line_type IN (
        'revenue', 'expense', 'adjustment', 'tax', 'fee', 'split_payment'
    )),
    
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    
    budgeted_amount DECIMAL(12, 2),
    actual_amount DECIMAL(12, 2) NOT NULL,
    
    variance DECIMAL(12, 2) GENERATED ALWAYS AS (actual_amount - COALESCE(budgeted_amount, 0)) STORED,
    
    reference_type TEXT,
    reference_id UUID,
    
    party_name TEXT,
    party_company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Schedules
CREATE TABLE payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deal_financial_terms(id) ON DELETE SET NULL,
    purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE SET NULL,
    
    schedule_name TEXT NOT NULL,
    
    total_amount DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
        'active', 'completed', 'cancelled', 'defaulted'
    )),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment Milestones
CREATE TABLE payment_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_schedule_id UUID NOT NULL REFERENCES payment_schedules(id) ON DELETE CASCADE,
    
    milestone_number INTEGER NOT NULL,
    milestone_name TEXT NOT NULL,
    description TEXT,
    
    amount DECIMAL(12, 2) NOT NULL,
    percentage_of_total DECIMAL(5, 2),
    
    due_date DATE NOT NULL,
    completed_date DATE,
    
    trigger_event TEXT,
    prerequisites TEXT[],
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'due', 'paid', 'late', 'waived', 'disputed'
    )),
    
    payment_transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
    paid_amount DECIMAL(12, 2),
    paid_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PART 6: AUTOMATED RULES ENGINE
-- =============================================

-- Automated Financial Rules
CREATE TABLE automated_financial_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    rule_name TEXT NOT NULL,
    description TEXT,
    
    rule_type TEXT NOT NULL CHECK (rule_type IN (
        'auto_categorize', 'auto_approve', 'auto_flag', 
        'auto_reconcile', 'auto_split', 'notification'
    )),
    
    triggers_on TEXT NOT NULL CHECK (triggers_on IN (
        'transaction_created', 'expense_submitted', 'invoice_received',
        'payment_due', 'budget_threshold', 'time_based'
    )),
    
    conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
    actions JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    execution_count INTEGER DEFAULT 0,
    last_executed_at TIMESTAMPTZ,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rule Execution Log
CREATE TABLE rule_execution_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    rule_id UUID NOT NULL REFERENCES automated_financial_rules(id) ON DELETE CASCADE,
    
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    execution_status TEXT NOT NULL CHECK (execution_status IN (
        'success', 'partial_success', 'failed', 'skipped'
    )),
    
    triggered_by_entity_type TEXT,
    triggered_by_entity_id UUID,
    
    actions_taken JSONB DEFAULT '[]'::jsonb,
    error_message TEXT,
    
    execution_time_ms INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Financial KPI Tracking
CREATE TABLE financial_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    kpi_name TEXT NOT NULL,
    kpi_category TEXT NOT NULL CHECK (kpi_category IN (
        'profitability', 'liquidity', 'efficiency', 'growth', 'custom'
    )),
    
    calculation_formula TEXT,
    calculation_frequency TEXT DEFAULT 'monthly' CHECK (calculation_frequency IN (
        'daily', 'weekly', 'monthly', 'quarterly', 'annually'
    )),
    
    target_value DECIMAL(15, 2),
    target_operator TEXT CHECK (target_operator IN ('greater_than', 'less_than', 'equals', 'between')),
    
    current_value DECIMAL(15, 2),
    previous_value DECIMAL(15, 2),
    
    status TEXT CHECK (status IN ('on_target', 'below_target', 'above_target', 'unknown')),
    
    last_calculated_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Spending Policies
CREATE INDEX idx_spending_policies_workspace ON spending_policies(workspace_id);
CREATE INDEX idx_spending_policies_active ON spending_policies(is_active) WHERE is_active = true;
CREATE INDEX idx_spending_policies_type ON spending_policies(policy_type);

-- Policy Violations
CREATE INDEX idx_policy_violations_workspace ON policy_violations(workspace_id);
CREATE INDEX idx_policy_violations_policy ON policy_violations(policy_id);
CREATE INDEX idx_policy_violations_status ON policy_violations(status);
CREATE INDEX idx_policy_violations_date ON policy_violations(violation_date);

-- Corporate Cards
CREATE INDEX idx_corporate_cards_workspace ON corporate_cards(workspace_id);
CREATE INDEX idx_corporate_cards_holder ON corporate_cards(card_holder_id);
CREATE INDEX idx_corporate_cards_status ON corporate_cards(status);

-- Receipt Matches
CREATE INDEX idx_receipt_matches_workspace ON receipt_matches(workspace_id);
CREATE INDEX idx_receipt_matches_transaction ON receipt_matches(transaction_id);
CREATE INDEX idx_receipt_matches_expense ON receipt_matches(expense_item_id);
CREATE INDEX idx_receipt_matches_status ON receipt_matches(match_status);

-- Approval Chains
CREATE INDEX idx_approval_chains_workspace ON approval_chains(workspace_id);
CREATE INDEX idx_approval_chains_type ON approval_chains(chain_type);
CREATE INDEX idx_approval_chains_triggers ON approval_chains(triggers_on);

-- Approval Steps
CREATE INDEX idx_approval_steps_workspace ON approval_steps(workspace_id);
CREATE INDEX idx_approval_steps_chain ON approval_steps(approval_chain_id);
CREATE INDEX idx_approval_steps_approver ON approval_steps(approver_id);
CREATE INDEX idx_approval_steps_status ON approval_steps(status);
CREATE INDEX idx_approval_steps_entity ON approval_steps(entity_type, entity_id);

-- Budget Scenarios
CREATE INDEX idx_budget_scenarios_workspace ON budget_scenarios(workspace_id);
CREATE INDEX idx_budget_scenarios_budget ON budget_scenarios(budget_id);
CREATE INDEX idx_budget_scenarios_type ON budget_scenarios(scenario_type);

-- Financial Forecasts
CREATE INDEX idx_financial_forecasts_workspace ON financial_forecasts(workspace_id);
CREATE INDEX idx_financial_forecasts_production ON financial_forecasts(production_id);
CREATE INDEX idx_financial_forecasts_period ON financial_forecasts(forecast_start_date, forecast_end_date);
CREATE INDEX idx_financial_forecasts_status ON financial_forecasts(status);

-- Forecast Data Points
CREATE INDEX idx_forecast_data_points_forecast ON forecast_data_points(forecast_id);
CREATE INDEX idx_forecast_data_points_period ON forecast_data_points(period_start_date, period_end_date);

-- Budget Variance Tracking
CREATE INDEX idx_variance_tracking_workspace ON budget_variance_tracking(workspace_id);
CREATE INDEX idx_variance_tracking_budget ON budget_variance_tracking(budget_id);
CREATE INDEX idx_variance_tracking_period ON budget_variance_tracking(tracking_period_start, tracking_period_end);
CREATE INDEX idx_variance_tracking_type ON budget_variance_tracking(variance_type);

-- Cash Flow Projections
CREATE INDEX idx_cash_flow_projections_workspace ON cash_flow_projections(workspace_id);
CREATE INDEX idx_cash_flow_projections_production ON cash_flow_projections(production_id);
CREATE INDEX idx_cash_flow_projections_period ON cash_flow_projections(projection_start_date, projection_end_date);

-- Cash Flow Items
CREATE INDEX idx_cash_flow_items_projection ON cash_flow_items(projection_id);
CREATE INDEX idx_cash_flow_items_date ON cash_flow_items(period_date);

-- Deal Financial Terms
CREATE INDEX idx_deal_financial_terms_workspace ON deal_financial_terms(workspace_id);
CREATE INDEX idx_deal_financial_terms_event ON deal_financial_terms(event_id);
CREATE INDEX idx_deal_financial_terms_production ON deal_financial_terms(production_id);
CREATE INDEX idx_deal_financial_terms_status ON deal_financial_terms(status);

-- Reconciliation Line Items
CREATE INDEX idx_reconciliation_line_items_reconciliation ON reconciliation_line_items(reconciliation_id);
CREATE INDEX idx_reconciliation_line_items_type ON reconciliation_line_items(line_type);

-- Payment Schedules
CREATE INDEX idx_payment_schedules_workspace ON payment_schedules(workspace_id);
CREATE INDEX idx_payment_schedules_invoice ON payment_schedules(invoice_id);
CREATE INDEX idx_payment_schedules_deal ON payment_schedules(deal_id);
CREATE INDEX idx_payment_schedules_status ON payment_schedules(status);

-- Payment Milestones
CREATE INDEX idx_payment_milestones_schedule ON payment_milestones(payment_schedule_id);
CREATE INDEX idx_payment_milestones_due_date ON payment_milestones(due_date);
CREATE INDEX idx_payment_milestones_status ON payment_milestones(status);

-- Automated Financial Rules
CREATE INDEX idx_automated_rules_workspace ON automated_financial_rules(workspace_id);
CREATE INDEX idx_automated_rules_type ON automated_financial_rules(rule_type);
CREATE INDEX idx_automated_rules_active ON automated_financial_rules(is_active) WHERE is_active = true;

-- Rule Execution Log
CREATE INDEX idx_rule_execution_log_workspace ON rule_execution_log(workspace_id);
CREATE INDEX idx_rule_execution_log_rule ON rule_execution_log(rule_id);
CREATE INDEX idx_rule_execution_log_executed_at ON rule_execution_log(executed_at);

-- Financial KPIs
CREATE INDEX idx_financial_kpis_workspace ON financial_kpis(workspace_id);
CREATE INDEX idx_financial_kpis_category ON financial_kpis(kpi_category);
CREATE INDEX idx_financial_kpis_active ON financial_kpis(is_active) WHERE is_active = true;

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_spending_policies_updated_at BEFORE UPDATE ON spending_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_corporate_cards_updated_at BEFORE UPDATE ON corporate_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_approval_chains_updated_at BEFORE UPDATE ON approval_chains FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_budget_scenarios_updated_at BEFORE UPDATE ON budget_scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_financial_forecasts_updated_at BEFORE UPDATE ON financial_forecasts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_forecast_data_points_updated_at BEFORE UPDATE ON forecast_data_points FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_variance_tracking_updated_at BEFORE UPDATE ON budget_variance_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cash_flow_projections_updated_at BEFORE UPDATE ON cash_flow_projections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_deal_financial_terms_updated_at BEFORE UPDATE ON deal_financial_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payment_schedules_updated_at BEFORE UPDATE ON payment_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_automated_rules_updated_at BEFORE UPDATE ON automated_financial_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_financial_kpis_updated_at BEFORE UPDATE ON financial_kpis FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE spending_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipt_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_variance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cash_flow_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_financial_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE reconciliation_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_financial_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_execution_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY spending_policies_workspace_access ON spending_policies FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY policy_violations_workspace_access ON policy_violations FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY corporate_cards_workspace_access ON corporate_cards FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY receipt_matches_workspace_access ON receipt_matches FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY approval_chains_workspace_access ON approval_chains FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY approval_steps_workspace_access ON approval_steps FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY budget_scenarios_workspace_access ON budget_scenarios FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY financial_forecasts_workspace_access ON financial_forecasts FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY forecast_data_points_access ON forecast_data_points FOR ALL USING (forecast_id IN (SELECT id FROM financial_forecasts WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
CREATE POLICY variance_tracking_workspace_access ON budget_variance_tracking FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY cash_flow_projections_workspace_access ON cash_flow_projections FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY cash_flow_items_access ON cash_flow_items FOR ALL USING (projection_id IN (SELECT id FROM cash_flow_projections WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
CREATE POLICY deal_financial_terms_workspace_access ON deal_financial_terms FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY reconciliation_line_items_access ON reconciliation_line_items FOR ALL USING (reconciliation_id IN (SELECT id FROM reconciliations WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
CREATE POLICY payment_schedules_workspace_access ON payment_schedules FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY payment_milestones_access ON payment_milestones FOR ALL USING (payment_schedule_id IN (SELECT id FROM payment_schedules WHERE workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid())));
CREATE POLICY automated_rules_workspace_access ON automated_financial_rules FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY rule_execution_log_workspace_access ON rule_execution_log FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));
CREATE POLICY financial_kpis_workspace_access ON financial_kpis FOR ALL USING (workspace_id IN (SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE spending_policies;
ALTER PUBLICATION supabase_realtime ADD TABLE policy_violations;
ALTER PUBLICATION supabase_realtime ADD TABLE corporate_cards;
ALTER PUBLICATION supabase_realtime ADD TABLE approval_chains;
ALTER PUBLICATION supabase_realtime ADD TABLE approval_steps;
ALTER PUBLICATION supabase_realtime ADD TABLE budget_scenarios;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_forecasts;
ALTER PUBLICATION supabase_realtime ADD TABLE budget_variance_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE cash_flow_projections;
ALTER PUBLICATION supabase_realtime ADD TABLE deal_financial_terms;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_schedules;
ALTER PUBLICATION supabase_realtime ADD TABLE payment_milestones;
ALTER PUBLICATION supabase_realtime ADD TABLE automated_financial_rules;
ALTER PUBLICATION supabase_realtime ADD TABLE financial_kpis;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE spending_policies IS 'Ramp-style spending policies and limits';
COMMENT ON TABLE policy_violations IS 'Log of policy violations and exceptions';
COMMENT ON TABLE corporate_cards IS 'Corporate card management with spending limits';
COMMENT ON TABLE receipt_matches IS 'Automated receipt matching and OCR data';
COMMENT ON TABLE approval_chains IS 'Multi-level approval workflow chains';
COMMENT ON TABLE approval_steps IS 'Individual approval steps and responses';
COMMENT ON TABLE budget_scenarios IS 'Runway-style scenario planning for budgets';
COMMENT ON TABLE financial_forecasts IS 'Financial forecasting with multiple models';
COMMENT ON TABLE forecast_data_points IS 'Time-series forecast data with actuals';
COMMENT ON TABLE budget_variance_tracking IS 'Detailed variance analysis and tracking';
COMMENT ON TABLE cash_flow_projections IS 'Cash flow forecasting and management';
COMMENT ON TABLE cash_flow_items IS 'Period-by-period cash flow details';
COMMENT ON TABLE deal_financial_terms IS 'Prism.fm-style show deal structures';
COMMENT ON TABLE reconciliation_line_items IS 'Detailed settlement line items';
COMMENT ON TABLE payment_schedules IS 'Multi-milestone payment schedules';
COMMENT ON TABLE payment_milestones IS 'Individual payment milestones and triggers';
COMMENT ON TABLE automated_financial_rules IS 'Automated rule engine for finance operations';
COMMENT ON TABLE rule_execution_log IS 'Audit log for rule executions';
COMMENT ON TABLE financial_kpis IS 'Financial KPI tracking and monitoring';

