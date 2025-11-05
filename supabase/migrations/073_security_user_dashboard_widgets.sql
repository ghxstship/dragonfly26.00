-- =============================================
-- USER DASHBOARD WIDGETS
-- Migration: 065
-- Description: User customizable dashboard widgets
-- =============================================

-- User Dashboard Widgets Table
CREATE TABLE user_dashboard_widgets (
    id TEXT PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT true,
    settings JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(workspace_id, user_id, type)
);

-- Indexes for performance
CREATE INDEX idx_user_dashboard_widgets_workspace ON user_dashboard_widgets(workspace_id);
CREATE INDEX idx_user_dashboard_widgets_user ON user_dashboard_widgets(user_id);
CREATE INDEX idx_user_dashboard_widgets_enabled ON user_dashboard_widgets(enabled) WHERE enabled = true;

-- RLS Policies
ALTER TABLE user_dashboard_widgets ENABLE ROW LEVEL SECURITY;

-- Users can view their own widgets
CREATE POLICY "Users can view own widgets"
    ON user_dashboard_widgets
    FOR SELECT
    USING (
        (SELECT (SELECT auth.uid())) = user_id
    );

-- Users can insert their own widgets
CREATE POLICY "Users can insert own widgets"
    ON user_dashboard_widgets
    FOR INSERT
    WITH CHECK (
        (SELECT (SELECT auth.uid())) = user_id
    );

-- Users can update their own widgets
CREATE POLICY "Users can update own widgets"
    ON user_dashboard_widgets
    FOR UPDATE
    USING (
        (SELECT (SELECT auth.uid())) = user_id
    )
    WITH CHECK (
        (SELECT (SELECT auth.uid())) = user_id
    );

-- Users can delete their own widgets
CREATE POLICY "Users can delete own widgets"
    ON user_dashboard_widgets
    FOR DELETE
    USING (
        (SELECT (SELECT auth.uid())) = user_id
    );

-- Trigger for updated_at
CREATE TRIGGER update_user_dashboard_widgets_updated_at
    BEFORE UPDATE ON user_dashboard_widgets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Comments
COMMENT ON TABLE user_dashboard_widgets IS 'User customizable dashboard widget configurations';
COMMENT ON COLUMN user_dashboard_widgets.type IS 'Widget type identifier (my-tasks, my-agenda, etc.)';
COMMENT ON COLUMN user_dashboard_widgets.position IS 'Display order position';
COMMENT ON COLUMN user_dashboard_widgets.settings IS 'JSON configuration for widget-specific settings';
