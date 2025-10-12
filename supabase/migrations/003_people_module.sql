-- =============================================
-- PEOPLE MODULE - Personnel, Teams, Time Tracking, Training
-- Migration: 003
-- =============================================

-- =============================================
-- PERSONNEL
-- =============================================

CREATE TABLE personnel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Linked user account (optional)
    
    -- Basic Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    photo_url TEXT,
    
    -- Professional Info
    role TEXT,
    department TEXT,
    title TEXT,
    employee_id TEXT,
    
    -- Status
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN (
        'active', 'inactive', 'on_leave', 'terminated'
    )),
    employment_type TEXT CHECK (employment_type IN (
        'full_time', 'part_time', 'contractor', 'freelance', 'volunteer'
    )),
    
    -- Contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Dates
    hire_date DATE,
    termination_date DATE,
    
    -- Skills & Certifications
    skills TEXT[] DEFAULT '{}',
    certifications JSONB DEFAULT '[]'::jsonb,
    
    -- Metadata
    tags TEXT[] DEFAULT '{}',
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TEAMS
-- =============================================

CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('department', 'crew', 'project_team', 'ad_hoc')),
    
    leader_id UUID REFERENCES personnel(id) ON DELETE SET NULL,
    members UUID[] DEFAULT '{}', -- Array of personnel IDs
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- PERSONNEL ASSIGNMENTS
-- =============================================

CREATE TABLE personnel_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN (
        'pending', 'assigned', 'active', 'completed', 'cancelled'
    )),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TIME TRACKING
-- =============================================

CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    task_id UUID REFERENCES project_tasks(id) ON DELETE SET NULL,
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration INTERVAL,
    
    type TEXT CHECK (type IN ('regular', 'overtime', 'break')),
    billable BOOLEAN DEFAULT true,
    rate DECIMAL(10, 2),
    
    notes TEXT,
    approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TRAINING & CERTIFICATIONS
-- =============================================

CREATE TABLE training_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    training_name TEXT NOT NULL,
    type TEXT CHECK (type IN (
        'safety', 'technical', 'compliance', 'professional_development'
    )),
    
    completed_date DATE,
    expiry_date DATE,
    certification_number TEXT,
    
    instructor TEXT,
    hours DECIMAL(5, 2),
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN (
        'scheduled', 'in_progress', 'completed', 'expired'
    )),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- JOB OPENINGS
-- =============================================

CREATE TABLE job_openings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT,
    employment_type TEXT CHECK (employment_type IN (
        'full_time', 'part_time', 'contractor', 'freelance'
    )),
    
    location_id UUID, -- Will reference locations(id)
    remote_allowed BOOLEAN DEFAULT false,
    
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'published', 'closed', 'filled'
    )),
    posted_date DATE,
    close_date DATE,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- JOB APPLICANTS
-- =============================================

CREATE TABLE job_applicants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    resume_url TEXT,
    cover_letter TEXT,
    
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN (
        'applied', 'screening', 'interview', 'offer', 'hired', 'rejected'
    )),
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

-- Personnel
CREATE INDEX idx_personnel_workspace ON personnel(workspace_id);
CREATE INDEX idx_personnel_user ON personnel(user_id);
CREATE INDEX idx_personnel_status ON personnel(employment_status);
CREATE INDEX idx_personnel_type ON personnel(employment_type);
CREATE INDEX idx_personnel_department ON personnel(department);
CREATE INDEX idx_personnel_name ON personnel(last_name, first_name);

-- Teams
CREATE INDEX idx_teams_workspace ON teams(workspace_id);
CREATE INDEX idx_teams_leader ON teams(leader_id);
CREATE INDEX idx_teams_type ON teams(type);

-- Assignments
CREATE INDEX idx_assignments_workspace ON personnel_assignments(workspace_id);
CREATE INDEX idx_assignments_personnel ON personnel_assignments(personnel_id);
CREATE INDEX idx_assignments_production ON personnel_assignments(production_id);
CREATE INDEX idx_assignments_status ON personnel_assignments(status);

-- Time Entries
CREATE INDEX idx_time_entries_workspace ON time_entries(workspace_id);
CREATE INDEX idx_time_entries_personnel ON time_entries(personnel_id);
CREATE INDEX idx_time_entries_production ON time_entries(production_id);
CREATE INDEX idx_time_entries_task ON time_entries(task_id);
CREATE INDEX idx_time_entries_start ON time_entries(start_time);

-- Training
CREATE INDEX idx_training_workspace ON training_records(workspace_id);
CREATE INDEX idx_training_personnel ON training_records(personnel_id);
CREATE INDEX idx_training_status ON training_records(status);
CREATE INDEX idx_training_expiry ON training_records(expiry_date);

-- Job Openings
CREATE INDEX idx_job_openings_workspace ON job_openings(workspace_id);
CREATE INDEX idx_job_openings_status ON job_openings(status);

-- Applicants
CREATE INDEX idx_applicants_job ON job_applicants(job_opening_id);
CREATE INDEX idx_applicants_workspace ON job_applicants(workspace_id);
CREATE INDEX idx_applicants_status ON job_applicants(status);

-- =============================================
-- FULL-TEXT SEARCH
-- =============================================

CREATE INDEX idx_personnel_search ON personnel 
    USING GIN (to_tsvector('english', 
        first_name || ' ' || last_name || ' ' || COALESCE(email, '') || ' ' || COALESCE(role, '')
    ));

CREATE INDEX idx_job_openings_search ON job_openings 
    USING GIN (to_tsvector('english', 
        title || ' ' || description
    ));

-- =============================================
-- TRIGGERS
-- =============================================

CREATE TRIGGER update_personnel_updated_at
    BEFORE UPDATE ON personnel
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_openings_updated_at
    BEFORE UPDATE ON job_openings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_job_applicants_updated_at
    BEFORE UPDATE ON job_applicants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE personnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applicants ENABLE ROW LEVEL SECURITY;

-- Standard workspace policies for all tables
CREATE POLICY "Users can view personnel in their workspaces"
    ON personnel FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage personnel in their workspaces"
    ON personnel FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Repeat for other tables
CREATE POLICY "Users can view teams in their workspaces"
    ON teams FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage teams in their workspaces"
    ON teams FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view assignments in their workspaces"
    ON personnel_assignments FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage assignments in their workspaces"
    ON personnel_assignments FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view time entries in their workspaces"
    ON time_entries FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage time entries in their workspaces"
    ON time_entries FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view training in their workspaces"
    ON training_records FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage training in their workspaces"
    ON training_records FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view job openings in their workspaces"
    ON job_openings FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage job openings in their workspaces"
    ON job_openings FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can view applicants in their workspaces"
    ON job_applicants FOR SELECT
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can manage applicants in their workspaces"
    ON job_applicants FOR ALL
    USING (workspace_id IN (
        SELECT id FROM workspaces WHERE organization_id IN (
            SELECT organization_id FROM organization_members WHERE user_id = auth.uid()
        )
    ));

-- Update user_roles to add foreign key for teams and departments
ALTER TABLE user_roles ADD CONSTRAINT fk_user_roles_team 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- =============================================
-- REALTIME PUBLICATION
-- =============================================

ALTER PUBLICATION supabase_realtime ADD TABLE personnel;
ALTER PUBLICATION supabase_realtime ADD TABLE teams;
ALTER PUBLICATION supabase_realtime ADD TABLE personnel_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE time_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE training_records;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE personnel IS 'Personnel and staff management';
COMMENT ON TABLE teams IS 'Teams, departments, and crew groups';
COMMENT ON TABLE personnel_assignments IS 'Project and production assignments';
COMMENT ON TABLE time_entries IS 'Time tracking and timesheets';
COMMENT ON TABLE training_records IS 'Training completion and certifications';
COMMENT ON TABLE job_openings IS 'Job postings and open positions';
COMMENT ON TABLE job_applicants IS 'Job applications and candidates';
