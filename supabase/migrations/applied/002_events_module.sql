-- =============================================
-- EVENTS MODULE - Performances, Rehearsals, Bookings, Run of Show
-- Migration: 002
-- =============================================

-- =============================================
-- EVENTS
-- =============================================

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN (
        'performance', 'rehearsal', 'class', 'workshop', 'recreation',
        'meeting', 'booking', 'tour_date', 'training', 'internal'
    )),
    
    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    
    -- Location
    location_id UUID, -- Will reference locations(id)
    location_details TEXT,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT, -- RRULE format
    parent_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    -- Participants
    organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    attendees UUID[] DEFAULT '{}',
    capacity INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'draft', 'scheduled', 'in_progress', 'completed', 'cancelled'
    )),
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_event_times CHECK (end_time > start_time)
);

-- =============================================
-- RUN OF SHOW / CUE SHEETS
-- =============================================

CREATE TABLE run_of_show (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    sequence_number INTEGER NOT NULL,
    cue_number TEXT,
    time_offset INTERVAL, -- Time from show start
    duration INTERVAL,
    
    action TEXT NOT NULL,
    description TEXT,
    department TEXT, -- 'audio', 'lighting', 'video', 'stage', etc.
    responsible_person_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(event_id, sequence_number)
);

-- =============================================
-- BOOKINGS & RESERVATIONS
-- =============================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    type TEXT NOT NULL CHECK (type IN (
        'venue', 'room_block', 'dressing_room', 'green_room',
        'studio', 'hospitality', 'entertainment'
    )),
    name TEXT NOT NULL,
    location_id UUID, -- Will reference locations(id)
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'confirmed', 'cancelled'
    )),
    confirmation_number TEXT,
    
    cost DECIMAL(10, 2),
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT valid_booking_times CHECK (end_time > start_time)
);

-- =============================================
-- INCIDENT REPORTS
-- =============================================

CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
    type TEXT NOT NULL CHECK (type IN (
        'injury', 'equipment_failure', 'safety_violation', 'security', 'other'
    )),
    
    occurred_at TIMESTAMPTZ NOT NULL,
    location_id UUID, -- Will reference locations(id)
    location_details TEXT,
    
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    witnesses UUID[] DEFAULT '{}',
    
    actions_taken TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN (
        'open', 'investigating', 'resolved', 'closed'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Events
CREATE INDEX idx_events_workspace ON events(workspace_id);
CREATE INDEX idx_events_production ON events(production_id);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_end_time ON events(end_time);
CREATE INDEX idx_events_organizer ON events(organizer_id);
CREATE INDEX idx_events_parent ON events(parent_event_id);
CREATE INDEX idx_events_location ON events(location_id);

-- Run of Show
CREATE INDEX idx_run_of_show_event ON run_of_show(event_id);
CREATE INDEX idx_run_of_show_workspace ON run_of_show(workspace_id);
CREATE INDEX idx_run_of_show_sequence ON run_of_show(event_id, sequence_number);
CREATE INDEX idx_run_of_show_department ON run_of_show(department);

-- Bookings
CREATE INDEX idx_bookings_workspace ON bookings(workspace_id);
CREATE INDEX idx_bookings_event ON bookings(event_id);
CREATE INDEX idx_bookings_type ON bookings(type);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_times ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_location ON bookings(location_id);

-- Incidents
CREATE INDEX idx_incidents_workspace ON incidents(workspace_id);
CREATE INDEX idx_incidents_event ON incidents(event_id);
CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_type ON incidents(type);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_occurred ON incidents(occurred_at);
CREATE INDEX idx_incidents_reporter ON incidents(reported_by);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_events_search ON events 
    USING GIN (to_tsvector('english', 
        name || ' ' || COALESCE(description, '')
    ));

CREATE INDEX idx_incidents_search ON incidents 
    USING GIN (to_tsvector('english', 
        title || ' ' || description
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_run_of_show_updated_at
    BEFORE UPDATE ON run_of_show
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE run_of_show ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can view events in their workspaces"
    ON events FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage events in their workspaces"
    ON events FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Run of Show policies
CREATE POLICY "Users can view run of show in their workspaces"
    ON run_of_show FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage run of show in their workspaces"
    ON run_of_show FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Bookings policies
CREATE POLICY "Users can view bookings in their workspaces"
    ON bookings FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage bookings in their workspaces"
    ON bookings FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Incidents policies
CREATE POLICY "Users can view incidents in their workspaces"
    ON incidents FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage incidents in their workspaces"
    ON incidents FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE run_of_show;
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE incidents;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE events IS 'Events, performances, rehearsals, meetings, and scheduled activities';
COMMENT ON TABLE run_of_show IS 'Cue sheets and show sequences for events';
COMMENT ON TABLE bookings IS 'Venue, room, and resource reservations';
COMMENT ON TABLE incidents IS 'Incident reports for safety, security, and operational issues';
