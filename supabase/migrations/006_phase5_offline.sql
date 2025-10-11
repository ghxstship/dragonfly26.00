-- =============================================
-- PHASE 5: MOBILE & OFFLINE-FIRST
-- Sync Engine, Conflict Resolution, PWA Support
-- =============================================

-- =============================================
-- 1. SYNC ENGINE
-- =============================================

-- Sync log (track all changes for offline sync)
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Change tracking
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    operation TEXT NOT NULL CHECK (operation IN ('insert', 'update', 'delete')),
    
    -- Change data
    old_data JSONB,
    new_data JSONB,
    changed_fields TEXT[],
    
    -- Attribution
    user_id UUID NOT NULL REFERENCES auth.users(id),
    device_id TEXT,
    client_timestamp TIMESTAMPTZ NOT NULL,
    server_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Sync status
    is_synced BOOLEAN DEFAULT true,
    sync_generation BIGINT DEFAULT 0,
    
    -- Conflict info
    has_conflict BOOLEAN DEFAULT false,
    conflict_resolved BOOLEAN DEFAULT false,
    conflict_resolution_strategy TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_log_org ON sync_log(organization_id);
CREATE INDEX idx_sync_log_record ON sync_log(table_name, record_id);
CREATE INDEX idx_sync_log_user ON sync_log(user_id);
CREATE INDEX idx_sync_log_device ON sync_log(device_id);
CREATE INDEX idx_sync_log_timestamp ON sync_log(server_timestamp);
CREATE INDEX idx_sync_log_generation ON sync_log(sync_generation);
CREATE INDEX idx_sync_log_conflicts ON sync_log(has_conflict) WHERE has_conflict = true;

-- Sync state per device (cursor-based sync)
CREATE TABLE sync_state (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Last sync cursor
    last_sync_generation BIGINT DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    
    -- Device info
    device_type TEXT, -- 'ios', 'android', 'web', 'desktop'
    app_version TEXT,
    os_version TEXT,
    
    -- Sync stats
    total_syncs INTEGER DEFAULT 0,
    last_sync_duration_ms INTEGER,
    pending_changes_count INTEGER DEFAULT 0,
    
    -- Status
    is_online BOOLEAN DEFAULT true,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, device_id, organization_id)
);

CREATE INDEX idx_sync_state_user ON sync_state(user_id);
CREATE INDEX idx_sync_state_device ON sync_state(device_id);
CREATE INDEX idx_sync_state_org ON sync_state(organization_id);
CREATE INDEX idx_sync_state_generation ON sync_state(last_sync_generation);

-- =============================================
-- 2. CONFLICT RESOLUTION
-- =============================================

-- Conflicts that need manual resolution
CREATE TABLE sync_conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Conflict details
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    field_name TEXT,
    
    -- Conflicting versions
    server_value JSONB NOT NULL,
    server_timestamp TIMESTAMPTZ NOT NULL,
    server_user_id UUID REFERENCES auth.users(id),
    
    client_value JSONB NOT NULL,
    client_timestamp TIMESTAMPTZ NOT NULL,
    client_user_id UUID REFERENCES auth.users(id),
    client_device_id TEXT,
    
    -- Resolution
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
    resolution_strategy TEXT CHECK (resolution_strategy IN (
        'server_wins',
        'client_wins', 
        'merge',
        'manual',
        'last_write_wins',
        'first_write_wins'
    )),
    resolved_value JSONB,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conflicts_org ON sync_conflicts(organization_id);
CREATE INDEX idx_conflicts_record ON sync_conflicts(table_name, record_id);
CREATE INDEX idx_conflicts_status ON sync_conflicts(status) WHERE status = 'pending';
CREATE INDEX idx_conflicts_user ON sync_conflicts(client_user_id);

-- =============================================
-- 3. OFFLINE QUEUE
-- =============================================

-- Queue for operations performed offline
CREATE TABLE offline_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Operation details
    operation_type TEXT NOT NULL CHECK (operation_type IN (
        'create_item',
        'update_item',
        'delete_item',
        'add_comment',
        'upload_file',
        'update_status',
        'assign_user'
    )),
    
    -- Target
    table_name TEXT NOT NULL,
    record_id UUID,
    
    -- Operation data
    payload JSONB NOT NULL,
    optimistic_id UUID, -- Temporary ID for new records
    
    -- Execution
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'success', 'failed', 'conflict')),
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    
    -- Dependencies
    depends_on UUID REFERENCES offline_queue(id)
);

CREATE INDEX idx_offline_queue_user ON offline_queue(user_id);
CREATE INDEX idx_offline_queue_device ON offline_queue(device_id);
CREATE INDEX idx_offline_queue_status ON offline_queue(status) WHERE status = 'pending';
CREATE INDEX idx_offline_queue_scheduled ON offline_queue(scheduled_at) WHERE status = 'pending';
CREATE INDEX idx_offline_queue_depends ON offline_queue(depends_on);

-- =============================================
-- 4. DEVICE REGISTRATION
-- =============================================

-- Registered devices for push notifications
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Device identification
    device_id TEXT NOT NULL,
    device_name TEXT,
    device_type TEXT NOT NULL CHECK (device_type IN ('ios', 'android', 'web', 'desktop')),
    
    -- Device info
    os_name TEXT,
    os_version TEXT,
    app_version TEXT,
    browser_name TEXT,
    browser_version TEXT,
    
    -- Push notifications
    push_token TEXT,
    push_enabled BOOLEAN DEFAULT false,
    
    -- Capabilities
    supports_offline BOOLEAN DEFAULT false,
    supports_notifications BOOLEAN DEFAULT false,
    storage_quota_mb INTEGER,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(user_id, device_id)
);

CREATE INDEX idx_devices_user ON devices(user_id);
CREATE INDEX idx_devices_org ON devices(organization_id);
CREATE INDEX idx_devices_active ON devices(is_active) WHERE is_active = true;
CREATE INDEX idx_devices_push ON devices(push_token) WHERE push_enabled = true;

-- =============================================
-- 5. OFFLINE DATA CACHE
-- =============================================

-- Metadata for offline-cached data
CREATE TABLE offline_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Cached entity
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Cache metadata
    data_hash TEXT NOT NULL,
    size_bytes INTEGER,
    
    -- Status
    is_stale BOOLEAN DEFAULT false,
    cache_priority INTEGER DEFAULT 0, -- Higher = more important
    
    cached_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_count INTEGER DEFAULT 0,
    
    UNIQUE(user_id, device_id, entity_type, entity_id)
);

CREATE INDEX idx_cache_user_device ON offline_cache(user_id, device_id);
CREATE INDEX idx_cache_entity ON offline_cache(entity_type, entity_id);
CREATE INDEX idx_cache_expires ON offline_cache(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_cache_stale ON offline_cache(is_stale) WHERE is_stale = true;
CREATE INDEX idx_cache_priority ON offline_cache(cache_priority DESC);

-- =============================================
-- 6. BACKGROUND SYNC JOBS
-- =============================================

-- Background sync tasks
CREATE TABLE sync_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Job details
    job_type TEXT NOT NULL CHECK (job_type IN (
        'full_sync',
        'incremental_sync',
        'upload_changes',
        'download_changes',
        'resolve_conflicts',
        'cleanup_cache'
    )),
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    progress_percent INTEGER DEFAULT 0,
    
    -- Stats
    items_total INTEGER DEFAULT 0,
    items_processed INTEGER DEFAULT 0,
    items_failed INTEGER DEFAULT 0,
    bytes_transferred BIGINT DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_jobs_user ON sync_jobs(user_id);
CREATE INDEX idx_sync_jobs_device ON sync_jobs(device_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);
CREATE INDEX idx_sync_jobs_created ON sync_jobs(created_at);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Sync Log
ALTER TABLE sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own org sync log"
    ON sync_log FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

-- Sync State
ALTER TABLE sync_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sync state"
    ON sync_state FOR ALL
    USING (user_id = auth.uid());

-- Sync Conflicts
ALTER TABLE sync_conflicts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view org conflicts"
    ON sync_conflicts FOR SELECT
    USING (organization_id IN (
        SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
    ));

-- Offline Queue
ALTER TABLE offline_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own offline queue"
    ON offline_queue FOR ALL
    USING (user_id = auth.uid());

-- Devices
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own devices"
    ON devices FOR ALL
    USING (user_id = auth.uid());

-- Offline Cache
ALTER TABLE offline_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own cache"
    ON offline_cache FOR ALL
    USING (user_id = auth.uid());

-- Sync Jobs
ALTER TABLE sync_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sync jobs"
    ON sync_jobs FOR SELECT
    USING (user_id = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Get pending changes for sync
CREATE OR REPLACE FUNCTION get_pending_sync_changes(
    p_organization_id UUID,
    p_device_id TEXT,
    p_last_generation BIGINT DEFAULT 0,
    p_limit INTEGER DEFAULT 100
) RETURNS TABLE (
    sync_generation BIGINT,
    table_name TEXT,
    record_id UUID,
    operation TEXT,
    data JSONB,
    timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sl.sync_generation,
        sl.table_name,
        sl.record_id,
        sl.operation,
        sl.new_data,
        sl.server_timestamp
    FROM sync_log sl
    WHERE sl.organization_id = p_organization_id
        AND sl.sync_generation > p_last_generation
        AND (sl.device_id IS NULL OR sl.device_id != p_device_id) -- Don't sync own changes
    ORDER BY sl.sync_generation ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Resolve conflict
CREATE OR REPLACE FUNCTION resolve_conflict(
    p_conflict_id UUID,
    p_strategy TEXT,
    p_resolved_value JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
    conflict_record RECORD;
    final_value JSONB;
BEGIN
    SELECT * INTO conflict_record FROM sync_conflicts WHERE id = p_conflict_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Conflict not found';
    END IF;
    
    -- Apply resolution strategy
    CASE p_strategy
        WHEN 'server_wins' THEN
            final_value := conflict_record.server_value;
        WHEN 'client_wins' THEN
            final_value := conflict_record.client_value;
        WHEN 'last_write_wins' THEN
            IF conflict_record.client_timestamp > conflict_record.server_timestamp THEN
                final_value := conflict_record.client_value;
            ELSE
                final_value := conflict_record.server_value;
            END IF;
        WHEN 'manual' THEN
            final_value := p_resolved_value;
        ELSE
            RAISE EXCEPTION 'Invalid resolution strategy';
    END CASE;
    
    -- Update conflict
    UPDATE sync_conflicts
    SET status = 'resolved',
        resolution_strategy = p_strategy,
        resolved_value = final_value,
        resolved_by = auth.uid(),
        resolved_at = NOW()
    WHERE id = p_conflict_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process offline queue
CREATE OR REPLACE FUNCTION process_offline_queue_item(p_queue_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    queue_item RECORD;
BEGIN
    SELECT * INTO queue_item FROM offline_queue WHERE id = p_queue_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Mark as processing
    UPDATE offline_queue SET status = 'processing' WHERE id = p_queue_id;
    
    -- Execute operation based on type
    -- (Implementation depends on operation_type)
    -- This is a simplified version
    
    -- Mark as success
    UPDATE offline_queue 
    SET status = 'success',
        processed_at = NOW()
    WHERE id = p_queue_id;
    
    RETURN true;
EXCEPTION WHEN OTHERS THEN
    UPDATE offline_queue
    SET status = 'failed',
        error_message = SQLERRM,
        retry_count = retry_count + 1
    WHERE id = p_queue_id;
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update sync generation (trigger)
CREATE OR REPLACE FUNCTION increment_sync_generation()
RETURNS TRIGGER AS $$
BEGIN
    NEW.sync_generation := (SELECT COALESCE(MAX(sync_generation), 0) + 1 FROM sync_log);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_generation
    BEFORE INSERT ON sync_log
    FOR EACH ROW
    EXECUTE FUNCTION increment_sync_generation();

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX idx_sync_log_org_generation ON sync_log(organization_id, sync_generation);
CREATE INDEX idx_offline_queue_user_status ON offline_queue(user_id, status);
