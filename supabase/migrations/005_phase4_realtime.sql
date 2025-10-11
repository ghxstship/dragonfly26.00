-- =============================================
-- PHASE 4: REAL-TIME COLLABORATION
-- Live Cursors, Presence, Comments, Activity Feed
-- =============================================

-- =============================================
-- 1. PRESENCE SYSTEM
-- =============================================

-- User presence (who's online and where)
CREATE TABLE presence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Location
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    current_page TEXT, -- '/projects/123', '/tasks/456', etc.
    item_id UUID, -- Currently viewing item
    item_type TEXT, -- Type of item being viewed
    
    -- Cursor position (for collaborative editing)
    cursor_x INTEGER,
    cursor_y INTEGER,
    selection_start INTEGER,
    selection_end INTEGER,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'idle', 'away', 'dnd', 'offline')),
    custom_status TEXT,
    
    -- Device info
    device_type TEXT,
    browser TEXT,
    
    -- Timestamps
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, organization_id)
);

CREATE INDEX idx_presence_user ON presence(user_id);
CREATE INDEX idx_presence_org ON presence(organization_id);
CREATE INDEX idx_presence_workspace ON presence(workspace_id);
CREATE INDEX idx_presence_item ON presence(item_id, item_type);
CREATE INDEX idx_presence_status ON presence(status) WHERE status = 'active';

-- =============================================
-- 2. REAL-TIME COMMENTS & MENTIONS
-- =============================================

-- Comments system (threaded discussions)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Target (what's being commented on)
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL, -- 'task', 'project', 'document', etc.
    
    -- Threading
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    thread_id UUID, -- Root comment ID for the thread
    
    -- Content
    content TEXT NOT NULL,
    content_html TEXT, -- Rendered HTML with mentions, formatting
    mentions UUID[], -- User IDs mentioned
    
    -- Attachments
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Reactions
    reactions JSONB DEFAULT '{}'::jsonb, -- { "👍": ["user1", "user2"], "❤️": ["user3"] }
    
    -- Status
    is_edited BOOLEAN DEFAULT false,
    is_deleted BOOLEAN DEFAULT false,
    is_resolved BOOLEAN DEFAULT false,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_comments_item ON comments(item_id, item_type) WHERE is_deleted = false;
CREATE INDEX idx_comments_thread ON comments(thread_id) WHERE is_deleted = false;
CREATE INDEX idx_comments_parent ON comments(parent_comment_id) WHERE is_deleted = false;
CREATE INDEX idx_comments_mentions ON comments USING GIN(mentions);
CREATE INDEX idx_comments_created ON comments(created_at);

-- =============================================
-- 3. ACTIVITY FEED
-- =============================================

-- Activity log (all user actions)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Actor
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    -- Action
    action TEXT NOT NULL CHECK (action IN (
        'created', 'updated', 'deleted', 'completed', 'archived', 'restored',
        'assigned', 'unassigned', 'commented', 'mentioned', 'reacted',
        'attached', 'uploaded', 'shared', 'moved', 'duplicated',
        'status_changed', 'priority_changed', 'due_date_changed'
    )),
    
    -- Target (what was acted upon)
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    item_name TEXT, -- Denormalized for performance
    
    -- Additional context
    old_value JSONB,
    new_value JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Visibility
    is_public BOOLEAN DEFAULT true,
    visible_to UUID[], -- Specific users who can see this
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_org ON activities(organization_id, created_at DESC);
CREATE INDEX idx_activities_workspace ON activities(workspace_id, created_at DESC);
CREATE INDEX idx_activities_user ON activities(user_id, created_at DESC);
CREATE INDEX idx_activities_item ON activities(item_id, item_type);
CREATE INDEX idx_activities_action ON activities(action);
CREATE INDEX idx_activities_visible ON activities USING GIN(visible_to);

-- =============================================
-- 4. NOTIFICATIONS
-- =============================================

-- User notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Notification type
    type TEXT NOT NULL CHECK (type IN (
        'mention', 'comment', 'assignment', 'due_date', 'status_change',
        'file_upload', 'share', 'reaction', 'approval_request', 'approval_decision',
        'system', 'announcement'
    )),
    
    -- Content
    title TEXT NOT NULL,
    message TEXT,
    
    -- Link
    link_url TEXT, -- Where to navigate when clicked
    link_item_id UUID,
    link_item_type TEXT,
    
    -- Actor (who caused this notification)
    actor_id UUID REFERENCES auth.users(id),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    
    -- Priority
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Grouping (for combining similar notifications)
    group_key TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_org ON notifications(organization_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_group ON notifications(group_key);

-- =============================================
-- 5. COLLABORATIVE SESSIONS
-- =============================================

-- Sessions for collaborative editing
CREATE TABLE collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Document being edited
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    
    -- Participants
    host_user_id UUID NOT NULL REFERENCES auth.users(id),
    participant_ids UUID[] DEFAULT '{}',
    
    -- Session status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'ended')),
    
    -- Settings
    allow_editing BOOLEAN DEFAULT true,
    allow_comments BOOLEAN DEFAULT true,
    
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

CREATE INDEX idx_collab_sessions_item ON collaboration_sessions(item_id, item_type);
CREATE INDEX idx_collab_sessions_host ON collaboration_sessions(host_user_id);
CREATE INDEX idx_collab_sessions_status ON collaboration_sessions(status) WHERE status = 'active';

-- =============================================
-- 6. TYPING INDICATORS
-- =============================================

-- Track who is typing where
CREATE TABLE typing_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Location
    item_id UUID NOT NULL,
    item_type TEXT NOT NULL,
    field_name TEXT, -- Which field they're typing in
    
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, item_id, item_type, field_name)
);

CREATE INDEX idx_typing_item ON typing_indicators(item_id, item_type);
CREATE INDEX idx_typing_expires ON typing_indicators(started_at);

-- Auto-expire typing indicators after 5 seconds
CREATE OR REPLACE FUNCTION cleanup_typing_indicators()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM typing_indicators
    WHERE started_at < NOW() - INTERVAL '5 seconds';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_typing
    AFTER INSERT ON typing_indicators
    EXECUTE FUNCTION cleanup_typing_indicators();

-- =============================================
-- RLS POLICIES
-- =============================================

-- Presence
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view presence in their org"
    ON presence FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can manage own presence"
    ON presence FOR ALL
    USING (user_id = auth.uid());

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments in their org"
    ON comments FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
        AND is_deleted = false
    );

CREATE POLICY "Users can create comments"
    ON comments FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update own comments"
    ON comments FOR UPDATE
    USING (created_by = auth.uid());

-- Activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities in their org"
    ON activities FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
        AND (
            is_public = true
            OR user_id = auth.uid()
            OR auth.uid() = ANY(visible_to)
        )
    );

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Create notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_organization_id UUID,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT DEFAULT NULL,
    p_link_url TEXT DEFAULT NULL,
    p_actor_id UUID DEFAULT NULL,
    p_priority TEXT DEFAULT 'normal'
) RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id,
        organization_id,
        type,
        title,
        message,
        link_url,
        actor_id,
        priority
    ) VALUES (
        p_user_id,
        p_organization_id,
        p_type,
        p_title,
        p_message,
        p_link_url,
        p_actor_id,
        p_priority
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Log activity
CREATE OR REPLACE FUNCTION log_activity(
    p_organization_id UUID,
    p_user_id UUID,
    p_action TEXT,
    p_item_id UUID,
    p_item_type TEXT,
    p_item_name TEXT DEFAULT NULL,
    p_old_value JSONB DEFAULT NULL,
    p_new_value JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    activity_id UUID;
BEGIN
    INSERT INTO activities (
        organization_id,
        user_id,
        action,
        item_id,
        item_type,
        item_name,
        old_value,
        new_value
    ) VALUES (
        p_organization_id,
        p_user_id,
        p_action,
        p_item_id,
        p_item_type,
        p_item_name,
        p_old_value,
        p_new_value
    ) RETURNING id INTO activity_id;
    
    RETURN activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Handle mentions in comments
CREATE OR REPLACE FUNCTION process_comment_mentions()
RETURNS TRIGGER AS $$
DECLARE
    mentioned_user_id UUID;
BEGIN
    -- Create notifications for each mentioned user
    FOREACH mentioned_user_id IN ARRAY NEW.mentions
    LOOP
        PERFORM create_notification(
            mentioned_user_id,
            NEW.organization_id,
            'mention',
            'You were mentioned in a comment',
            NEW.content,
            '/comments/' || NEW.id,
            NEW.created_by,
            'normal'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_comment_mentions
    AFTER INSERT ON comments
    FOR EACH ROW
    WHEN (array_length(NEW.mentions, 1) > 0)
    EXECUTE FUNCTION process_comment_mentions();

-- Update presence on activity
CREATE OR REPLACE FUNCTION update_user_presence()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO presence (user_id, organization_id, last_seen_at)
    VALUES (auth.uid(), NEW.organization_id, NOW())
    ON CONFLICT (user_id, organization_id)
    DO UPDATE SET last_seen_at = NOW(), status = 'active';
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- REALTIME SUBSCRIPTIONS
-- =============================================

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE presence;
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE typing_indicators;
