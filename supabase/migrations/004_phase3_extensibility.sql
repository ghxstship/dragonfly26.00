-- =============================================
-- PHASE 3: EXTENSIBILITY & ADVANCED FEATURES
-- Plugins, Webhooks, API, Formulas, Reports
-- =============================================

-- =============================================
-- 1. PLUGIN SYSTEM
-- =============================================

-- Plugin registry (marketplace plugins)
CREATE TABLE plugins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Plugin identity
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    
    -- Developer info
    developer_name TEXT NOT NULL,
    developer_email TEXT,
    developer_url TEXT,
    
    -- Plugin metadata
    version TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'automation',
        'integration',
        'reporting',
        'ui',
        'workflow',
        'productivity',
        'communication',
        'other'
    )),
    
    -- Pricing
    pricing_model TEXT DEFAULT 'free' CHECK (pricing_model IN ('free', 'paid', 'freemium', 'trial')),
    price_monthly DECIMAL,
    price_annual DECIMAL,
    
    -- Capabilities
    required_permissions TEXT[] DEFAULT '{}',
    supports_webhooks BOOLEAN DEFAULT false,
    supports_api BOOLEAN DEFAULT false,
    supports_ui BOOLEAN DEFAULT false,
    
    -- Installation
    install_url TEXT,
    config_schema JSONB, -- JSON Schema for plugin configuration
    
    -- Marketplace
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    install_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    deprecated_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plugins_slug ON plugins(slug);
CREATE INDEX idx_plugins_category ON plugins(category) WHERE is_published = true;
CREATE INDEX idx_plugins_featured ON plugins(is_featured) WHERE is_published = true;

-- Plugin installations (org-level)
CREATE TABLE plugin_installations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plugin_id UUID NOT NULL REFERENCES plugins(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Installation status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error', 'uninstalled')),
    
    -- Configuration
    config JSONB DEFAULT '{}'::jsonb,
    
    -- Usage tracking
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    
    -- Subscription (for paid plugins)
    subscription_id TEXT,
    subscription_status TEXT,
    trial_ends_at TIMESTAMPTZ,
    
    installed_by UUID NOT NULL REFERENCES auth.users(id),
    installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(plugin_id, organization_id)
);

CREATE INDEX idx_plugin_installations_org ON plugin_installations(organization_id);
CREATE INDEX idx_plugin_installations_plugin ON plugin_installations(plugin_id);
CREATE INDEX idx_plugin_installations_status ON plugin_installations(status);

-- Plugin events (activity log)
CREATE TABLE plugin_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plugin_installation_id UUID NOT NULL REFERENCES plugin_installations(id) ON DELETE CASCADE,
    
    event_type TEXT NOT NULL,
    event_data JSONB,
    
    triggered_by UUID REFERENCES auth.users(id),
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_plugin_events_installation ON plugin_events(plugin_installation_id);
CREATE INDEX idx_plugin_events_type ON plugin_events(event_type);
CREATE INDEX idx_plugin_events_date ON plugin_events(triggered_at);

-- =============================================
-- 2. WEBHOOK SYSTEM
-- =============================================

-- Webhook endpoints
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Endpoint configuration
    url TEXT NOT NULL,
    method TEXT DEFAULT 'POST' CHECK (method IN ('POST', 'PUT', 'PATCH')),
    headers JSONB DEFAULT '{}'::jsonb,
    secret TEXT, -- For HMAC signature validation
    
    -- Events to trigger on
    events TEXT[] NOT NULL, -- ['item.created', 'item.updated', 'item.deleted', etc.]
    
    -- Filters (optional)
    filters JSONB DEFAULT '{}'::jsonb, -- { "item_type": "task", "status": "done" }
    
    -- Retry configuration
    retry_enabled BOOLEAN DEFAULT true,
    max_retries INTEGER DEFAULT 3,
    retry_delay_seconds INTEGER DEFAULT 60,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMPTZ,
    last_success_at TIMESTAMPTZ,
    last_failure_at TIMESTAMPTZ,
    failure_count INTEGER DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_org ON webhooks(organization_id);
CREATE INDEX idx_webhooks_workspace ON webhooks(workspace_id);
CREATE INDEX idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;
CREATE INDEX idx_webhooks_events ON webhooks USING GIN(events);

-- Webhook delivery log
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    
    -- Request details
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    request_url TEXT NOT NULL,
    request_method TEXT NOT NULL,
    request_headers JSONB,
    request_body JSONB,
    
    -- Response details
    response_status INTEGER,
    response_headers JSONB,
    response_body TEXT,
    
    -- Timing
    duration_ms INTEGER,
    
    -- Status
    status TEXT NOT NULL CHECK (status IN ('pending', 'success', 'failed', 'retrying')),
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    next_retry_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_webhook_deliveries_webhook ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_event ON webhook_deliveries(event_type);
CREATE INDEX idx_webhook_deliveries_date ON webhook_deliveries(created_at);

-- =============================================
-- 3. API TOKENS & RATE LIMITING
-- =============================================

-- API tokens for external access
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Token (hashed)
    token_hash TEXT NOT NULL UNIQUE,
    token_prefix TEXT NOT NULL, -- First 8 chars for display
    
    -- Permissions
    scopes TEXT[] NOT NULL DEFAULT '{}', -- ['read:projects', 'write:tasks', etc.]
    
    -- Rate limiting
    rate_limit_per_hour INTEGER DEFAULT 1000,
    
    -- Usage tracking
    last_used_at TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    
    -- Expiration
    expires_at TIMESTAMPTZ,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_tokens_org ON api_tokens(organization_id);
CREATE INDEX idx_api_tokens_hash ON api_tokens(token_hash);
CREATE INDEX idx_api_tokens_active ON api_tokens(is_active) WHERE is_active = true;

-- API usage log (for rate limiting and analytics)
CREATE TABLE api_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_token_id UUID REFERENCES api_tokens(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Request details
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    query_params JSONB,
    
    -- Response
    status_code INTEGER NOT NULL,
    duration_ms INTEGER,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_requests_token ON api_requests(api_token_id);
CREATE INDEX idx_api_requests_org ON api_requests(organization_id);
CREATE INDEX idx_api_requests_date ON api_requests(created_at);

-- =============================================
-- 4. FORMULA ENGINE
-- =============================================

-- Custom fields with formulas
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Field type
    field_type TEXT NOT NULL CHECK (field_type IN (
        'text', 'number', 'date', 'boolean', 'select', 'multi_select',
        'user', 'formula', 'rollup', 'lookup'
    )),
    
    -- Formula configuration (for formula fields)
    formula TEXT, -- e.g., "SUM({linked_items.budget})"
    formula_result_type TEXT CHECK (formula_result_type IN ('number', 'text', 'date', 'boolean')),
    
    -- Rollup configuration (for rollup fields)
    rollup_relation_field TEXT, -- Which field contains the related items
    rollup_property TEXT, -- Which property to aggregate
    rollup_function TEXT CHECK (rollup_function IN ('sum', 'avg', 'min', 'max', 'count', 'unique')),
    
    -- Options (for select fields)
    options JSONB DEFAULT '[]'::jsonb,
    
    -- Validation
    is_required BOOLEAN DEFAULT false,
    validation_rules JSONB,
    
    -- UI
    icon TEXT,
    color TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_fields_org ON custom_fields(organization_id);
CREATE INDEX idx_custom_fields_type ON custom_fields(field_type);

-- Custom field values
CREATE TABLE custom_field_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    custom_field_id UUID NOT NULL REFERENCES custom_fields(id) ON DELETE CASCADE,
    
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    -- Value storage
    value_text TEXT,
    value_number DECIMAL,
    value_date DATE,
    value_boolean BOOLEAN,
    value_json JSONB,
    
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(custom_field_id, item_id, item_type)
);

CREATE INDEX idx_custom_field_values_field ON custom_field_values(custom_field_id);
CREATE INDEX idx_custom_field_values_item ON custom_field_values(item_id, item_type);

-- =============================================
-- 5. REPORT BUILDER
-- =============================================

-- Custom reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Report type
    type TEXT NOT NULL CHECK (type IN ('table', 'chart', 'calendar', 'timeline', 'dashboard')),
    
    -- Data source
    data_source TEXT NOT NULL, -- Table or view name
    
    -- Query configuration
    filters JSONB DEFAULT '[]'::jsonb,
    grouping JSONB DEFAULT '[]'::jsonb,
    sorting JSONB DEFAULT '[]'::jsonb,
    aggregations JSONB DEFAULT '[]'::jsonb,
    
    -- Visualization settings
    chart_type TEXT CHECK (chart_type IN ('bar', 'line', 'pie', 'area', 'scatter', 'funnel')),
    chart_config JSONB,
    
    -- Layout (for dashboards)
    layout JSONB,
    
    -- Sharing
    is_public BOOLEAN DEFAULT false,
    shared_with UUID[], -- User IDs
    
    -- Scheduling
    schedule_enabled BOOLEAN DEFAULT false,
    schedule_cron TEXT,
    schedule_recipients UUID[],
    last_run_at TIMESTAMPTZ,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_org ON reports(organization_id);
CREATE INDEX idx_reports_workspace ON reports(workspace_id);
CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_creator ON reports(created_by);

-- Report snapshots (cached results)
CREATE TABLE report_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    
    -- Snapshot data
    data JSONB NOT NULL,
    row_count INTEGER,
    
    -- Metadata
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_report_snapshots_report ON report_snapshots(report_id);
CREATE INDEX idx_report_snapshots_date ON report_snapshots(generated_at);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Plugins
ALTER TABLE plugins ENABLE ROW LEVEL SECURITY;
ALTER TABLE plugin_installations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published plugins"
    ON plugins FOR SELECT
    USING (is_published = true);

CREATE POLICY "Users can view org plugin installations"
    ON plugin_installations FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage plugin installations"
    ON plugin_installations FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- Webhooks
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org webhooks"
    ON webhooks FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Admins can manage webhooks"
    ON webhooks FOR ALL
    USING (organization_id IN (
        SELECT organization_id FROM organization_members 
        WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    ));

-- API Tokens
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org API tokens"
    ON api_tokens FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

-- Custom Fields
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_field_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org custom fields"
    ON custom_fields FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

-- Reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view accessible reports"
    ON reports FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
        AND (
            is_public = true 
            OR created_by = auth.uid()
            OR auth.uid() = ANY(shared_with)
        )
    );

-- =============================================
-- FUNCTIONS
-- =============================================

-- Trigger webhook on item changes
CREATE OR REPLACE FUNCTION trigger_webhooks()
RETURNS TRIGGER AS $$
DECLARE
    webhook_record RECORD;
    event_name TEXT;
    event_payload JSONB;
BEGIN
    -- Determine event name
    event_name := TG_TABLE_NAME || '.' || 
        CASE TG_OP
            WHEN 'INSERT' THEN 'created'
            WHEN 'UPDATE' THEN 'updated'
            WHEN 'DELETE' THEN 'deleted'
        END;
    
    -- Build payload
    event_payload := jsonb_build_object(
        'event', event_name,
        'timestamp', NOW(),
        'data', CASE 
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
            ELSE to_jsonb(NEW)
        END
    );
    
    -- Queue webhook deliveries
    FOR webhook_record IN 
        SELECT * FROM webhooks 
        WHERE is_active = true 
        AND event_name = ANY(events)
    LOOP
        INSERT INTO webhook_deliveries (
            webhook_id,
            event_type,
            event_data,
            request_url,
            request_method,
            status
        ) VALUES (
            webhook_record.id,
            event_name,
            event_payload,
            webhook_record.url,
            webhook_record.method,
            'pending'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate formula field
CREATE OR REPLACE FUNCTION calculate_formula(
    p_formula TEXT,
    p_item_id UUID,
    p_item_type TEXT
) RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    -- Simplified formula execution
    -- In production, use a proper expression parser
    -- For now, return placeholder
    result := 'FORMULA_RESULT';
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute report query
CREATE OR REPLACE FUNCTION execute_report(
    p_report_id UUID
) RETURNS JSONB AS $$
DECLARE
    report_record RECORD;
    result JSONB;
BEGIN
    SELECT * INTO report_record FROM reports WHERE id = p_report_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Report not found';
    END IF;
    
    -- Execute query based on configuration
    -- This is a simplified version
    result := '[]'::jsonb;
    
    -- Cache result
    INSERT INTO report_snapshots (report_id, data, row_count)
    VALUES (p_report_id, result, jsonb_array_length(result));
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_webhook_deliveries_pending ON webhook_deliveries(webhook_id, next_retry_at) 
    WHERE status IN ('pending', 'retrying');
CREATE INDEX idx_api_requests_rate_limit ON api_requests(api_token_id, created_at);
CREATE INDEX idx_custom_field_values_lookup ON custom_field_values(item_id, item_type, custom_field_id);
