# Database Architecture Plan - Layer 1
## Complete Schema for All 18 Modules

---

## Foundation (Already Implemented ✅)

### Core Tables
- ✅ `organizations` - Multitenant isolation
- ✅ `workspaces` - Organization subdivisions  
- ✅ `organization_members` - User-org relationships
- ✅ `custom_fields` - Extensible field system
- ✅ `module_configs` - Per-module configuration
- ✅ `views` - Saved view configurations (18 types supported)
- ✅ `templates` - Reusable templates
- ✅ `activities` - Audit log / activity feed
- ✅ `comments` - Universal commenting system
- ✅ `user_presence` - Realtime presence tracking
- ✅ `notifications` - User notifications

---

## Module Tables to Implement

### 1. Dashboard Module
**Purpose**: Personal dashboards and widgets

```sql
-- Dashboard configurations
CREATE TABLE dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_default BOOLEAN DEFAULT false,
    layout JSONB DEFAULT '[]'::jsonb, -- Widget positions and sizes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Dashboard widgets
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'metric', 'chart', 'list', 'calendar', etc.
    title TEXT NOT NULL,
    data_source TEXT NOT NULL, -- Which module/query
    config JSONB DEFAULT '{}'::jsonb,
    position JSONB NOT NULL, -- x, y, w, h
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 2. Projects Module  
**Purpose**: Productions, activations, and project management

```sql
-- Productions/Projects
CREATE TABLE productions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    code TEXT, -- Internal project code
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('concert', 'festival', 'tour', 'film', 'tv', 'theater', 'immersive', 'activation', 'trade_show', 'corporate', 'conference', 'convention', 'health', 'community', 'educational', 'philanthropic')),
    
    -- Status & Timeline
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled', 'archived')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    -- Location
    venue_id UUID REFERENCES locations(id),
    location_details JSONB, -- Address, coordinates, etc.
    
    -- Team
    project_manager_id UUID REFERENCES auth.users(id),
    team_members UUID[], -- Array of user IDs
    
    -- Financial
    budget DECIMAL(15, 2),
    budget_spent DECIMAL(15, 2) DEFAULT 0,
    budget_currency TEXT DEFAULT 'USD',
    
    -- Health Indicators
    health TEXT DEFAULT 'healthy' CHECK (health IN ('healthy', 'at_risk', 'critical')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    -- Metadata
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    -- Tracking
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Tasks
CREATE TABLE project_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'blocked', 'done')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Assignment
    assignee_id UUID REFERENCES auth.users(id),
    assignees UUID[], -- Multiple assignees
    
    -- Timeline
    start_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    estimated_hours DECIMAL(8, 2),
    actual_hours DECIMAL(8, 2),
    
    -- Relationships
    parent_task_id UUID REFERENCES project_tasks(id),
    depends_on UUID[], -- Task dependencies
    
    -- Tracking
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project Milestones
CREATE TABLE project_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'missed')),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Safety & Compliance
CREATE TABLE project_compliance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('license', 'permit', 'inspection', 'insurance', 'certification')),
    name TEXT NOT NULL,
    issuing_authority TEXT,
    reference_number TEXT,
    issue_date TIMESTAMPTZ,
    expiry_date TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'expired')),
    document_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE project_safety (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('risk_assessment', 'safety_plan', 'emergency_procedure', 'incident_report')),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
    mitigation_steps TEXT,
    responsible_person_id UUID REFERENCES auth.users(id),
    document_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 3. Events Module
**Purpose**: All events, activities, schedules

```sql
-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('performance', 'rehearsal', 'class', 'workshop', 'recreation', 'meeting', 'booking', 'tour_date', 'training', 'internal')),
    
    -- Timing
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    all_day BOOLEAN DEFAULT false,
    timezone TEXT DEFAULT 'UTC',
    
    -- Location
    location_id UUID REFERENCES locations(id),
    location_details TEXT,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule TEXT, -- RRULE format
    parent_event_id UUID REFERENCES events(id),
    
    -- Participants
    organizer_id UUID REFERENCES auth.users(id),
    attendees UUID[],
    capacity INTEGER,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Metadata
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Run of Show / Cue Sheets
CREATE TABLE run_of_show (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    sequence_number INTEGER NOT NULL,
    cue_number TEXT,
    time_offset INTERVAL, -- Time from show start
    duration INTERVAL,
    
    action TEXT NOT NULL,
    description TEXT,
    department TEXT, -- 'audio', 'lighting', 'video', etc.
    responsible_person_id UUID REFERENCES auth.users(id),
    
    notes TEXT,
    completed BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(event_id, sequence_number)
);

-- Bookings & Reservations
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    type TEXT NOT NULL CHECK (type IN ('venue', 'room_block', 'dressing_room', 'green_room', 'studio', 'hospitality', 'entertainment')),
    name TEXT NOT NULL,
    location_id UUID REFERENCES locations(id),
    
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    confirmation_number TEXT,
    
    cost DECIMAL(10, 2),
    notes TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incident Reports
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
    type TEXT NOT NULL CHECK (type IN ('injury', 'equipment_failure', 'safety_violation', 'security', 'other')),
    
    occurred_at TIMESTAMPTZ NOT NULL,
    location_id UUID REFERENCES locations(id),
    location_details TEXT,
    
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    witnesses UUID[],
    
    actions_taken TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 4. People Module
**Purpose**: Personnel, teams, crew management

```sql
-- Personnel
CREATE TABLE personnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id), -- Linked user account (optional)
    
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
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'inactive', 'on_leave', 'terminated')),
    employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contractor', 'freelance', 'volunteer')),
    
    -- Contact
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Dates
    hire_date DATE,
    termination_date DATE,
    
    -- Skills & Certifications
    skills TEXT[],
    certifications JSONB,
    
    -- Metadata
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('department', 'crew', 'project_team', 'ad_hoc')),
    
    leader_id UUID REFERENCES personnel(id),
    members UUID[], -- Array of personnel IDs
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assignments
CREATE TABLE personnel_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('pending', 'assigned', 'active', 'completed', 'cancelled')),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Time Tracking
CREATE TABLE time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id),
    task_id UUID REFERENCES project_tasks(id),
    
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

-- Training & Certifications
CREATE TABLE training_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    personnel_id UUID NOT NULL REFERENCES personnel(id) ON DELETE CASCADE,
    
    training_name TEXT NOT NULL,
    type TEXT CHECK (type IN ('safety', 'technical', 'compliance', 'professional_development')),
    
    completed_date DATE,
    expiry_date DATE,
    certification_number TEXT,
    
    instructor TEXT,
    hours DECIMAL(5, 2),
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'expired')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job Openings
CREATE TABLE job_openings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    department TEXT,
    employment_type TEXT CHECK (employment_type IN ('full_time', 'part_time', 'contractor', 'freelance')),
    
    location_id UUID REFERENCES locations(id),
    remote_allowed BOOLEAN DEFAULT false,
    
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed', 'filled')),
    posted_date DATE,
    close_date DATE,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Applicants
CREATE TABLE job_applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_opening_id UUID NOT NULL REFERENCES job_openings(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    resume_url TEXT,
    cover_letter TEXT,
    
    status TEXT NOT NULL DEFAULT 'applied' CHECK (status IN ('applied', 'screening', 'interview', 'offer', 'hired', 'rejected')),
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 5. Assets Module
**Purpose**: Equipment, inventory, tracking

```sql
-- Asset Catalog
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('infrastructure', 'equipment', 'vehicle', 'tool', 'credential', 'consumable')),
    category TEXT,
    subcategory TEXT,
    
    -- Identification
    asset_tag TEXT UNIQUE,
    serial_number TEXT,
    model_number TEXT,
    manufacturer TEXT,
    
    -- Financial
    purchase_price DECIMAL(12, 2),
    purchase_date DATE,
    current_value DECIMAL(12, 2),
    depreciation_rate DECIMAL(5, 2),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance', 'retired', 'lost', 'damaged')),
    condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
    
    -- Location
    location_id UUID REFERENCES locations(id),
    current_location TEXT,
    
    -- Ownership
    ownership TEXT CHECK (ownership IN ('owned', 'rented', 'leased')),
    vendor_id UUID REFERENCES companies(id),
    
    -- Metadata
    specifications JSONB,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Asset Check-in/Check-out
CREATE TABLE asset_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('check_out', 'check_in', 'transfer', 'maintenance', 'inspection')),
    
    checked_out_to UUID REFERENCES personnel(id),
    production_id UUID REFERENCES productions(id),
    event_id UUID REFERENCES events(id),
    
    checked_out_at TIMESTAMPTZ,
    expected_return_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    
    from_location_id UUID REFERENCES locations(id),
    to_location_id UUID REFERENCES locations(id),
    
    condition_at_checkout TEXT,
    condition_at_return TEXT,
    
    notes TEXT,
    
    performed_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintenance Records
CREATE TABLE asset_maintenance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('preventive', 'corrective', 'inspection', 'repair', 'upgrade')),
    title TEXT NOT NULL,
    description TEXT,
    
    scheduled_date TIMESTAMPTZ,
    completed_date TIMESTAMPTZ,
    next_maintenance_date TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    performed_by UUID REFERENCES personnel(id),
    vendor_id UUID REFERENCES companies(id),
    
    cost DECIMAL(10, 2),
    parts_used TEXT[],
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Production Advances (Equipment/Material Requests)
CREATE TABLE production_advances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID NOT NULL REFERENCES productions(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('equipment', 'materials', 'credentials', 'vehicle', 'tools')),
    title TEXT NOT NULL,
    description TEXT,
    
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    needed_by TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'fulfilled', 'returned')),
    
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    
    items JSONB, -- Array of requested items
    quantity INTEGER,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 6. Locations Module
**Purpose**: Venues, facilities, warehouses

```sql
-- Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('venue', 'office', 'warehouse', 'studio', 'stage', 'room', 'facility', 'site')),
    description TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT DEFAULT 'US',
    
    -- Geo
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    timezone TEXT,
    
    -- Details
    capacity INTEGER,
    size_sqft INTEGER,
    
    -- Contact
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    
    -- Parent/Child
    parent_location_id UUID REFERENCES locations(id),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'under_construction')),
    
    -- Metadata
    amenities TEXT[],
    restrictions TEXT[],
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Maps
CREATE TABLE site_maps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('floor_plan', 'site_map', 'seating_chart', 'technical_drawing')),
    
    file_url TEXT NOT NULL,
    scale TEXT,
    dimensions TEXT,
    
    version INTEGER DEFAULT 1,
    is_current BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Access Control
CREATE TABLE location_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('entry_point', 'security_checkpoint', 'restricted_area')),
    name TEXT NOT NULL,
    
    access_level TEXT NOT NULL CHECK (access_level IN ('public', 'staff', 'crew', 'vip', 'restricted')),
    
    requires_credential BOOLEAN DEFAULT false,
    credential_type TEXT,
    
    hours_of_operation JSONB, -- Operating hours
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Utilities & Infrastructure
CREATE TABLE location_utilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('power', 'water', 'internet', 'hvac', 'lighting', 'audio', 'other')),
    name TEXT NOT NULL,
    description TEXT,
    
    capacity TEXT, -- e.g., "200A 3-phase", "1Gbps", etc.
    location_details TEXT,
    
    status TEXT NOT NULL DEFAULT 'operational' CHECK (status IN ('operational', 'limited', 'offline', 'maintenance')),
    
    vendor_id UUID REFERENCES companies(id),
    contact_info TEXT,
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 7. Files Module
**Purpose**: Document management, contracts, media assets

```sql
-- File Categories (Contracts, Riders, Tech Specs, etc.)
CREATE TABLE file_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id UUID REFERENCES file_categories(id),
    icon TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(workspace_id, slug)
);

-- Files
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- MIME type
    category_id UUID REFERENCES file_categories(id),
    
    -- Storage
    storage_path TEXT NOT NULL, -- Supabase Storage path
    size_bytes BIGINT NOT NULL,
    checksum TEXT,
    
    -- Classification
    file_type TEXT CHECK (file_type IN ('contract', 'rider', 'tech_spec', 'drawing', 'call_sheet', 'insurance', 'permit', 'media', 'report', 'other')),
    
    -- Relationships
    production_id UUID REFERENCES productions(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_file_id UUID REFERENCES files(id),
    is_latest BOOLEAN DEFAULT true,
    
    -- Access
    is_shared BOOLEAN DEFAULT false,
    shared_with UUID[], -- External parties
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    
    -- Metadata
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- File Versions (for tracking changes)
CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    
    version INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    
    changes_description TEXT,
    uploaded_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(file_id, version)
);
```

---

### 8-11. Admin, Settings, Profile Modules
**Purpose**: System configuration and user management

```sql
-- Admin: Roles & Permissions (Enhanced)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false, -- System roles can't be deleted
    
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id, name)
);

-- Admin: API Tokens
CREATE TABLE api_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE, -- Hashed token
    scope TEXT NOT NULL CHECK (scope IN ('read', 'read:write', 'admin')),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin: Webhooks
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    secret TEXT NOT NULL,
    
    events TEXT[] NOT NULL, -- Array of event types to listen for
    active BOOLEAN DEFAULT true,
    
    last_triggered_at TIMESTAMPTZ,
    failure_count INTEGER DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin: Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    
    ip_address INET,
    user_agent TEXT,
    
    changes JSONB, -- Before/after values
    metadata JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profile: User Profiles (Extended)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic Info
    first_name TEXT,
    last_name TEXT,
    display_name TEXT,
    bio TEXT,
    avatar_url TEXT,
    
    -- Professional
    title TEXT,
    company TEXT,
    department TEXT,
    
    -- Contact
    phone TEXT,
    email TEXT, -- Work email (can differ from auth email)
    
    -- Social
    linkedin_url TEXT,
    twitter_url TEXT,
    website_url TEXT,
    
    -- Certifications & Skills
    certifications JSONB DEFAULT '[]'::jsonb,
    skills TEXT[],
    
    -- Travel
    passport_number TEXT ENCRYPTED,
    passport_expiry DATE,
    tsa_precheck TEXT,
    global_entry TEXT,
    
    -- Health & Emergency
    dietary_restrictions TEXT[],
    allergies TEXT[],
    medical_notes TEXT ENCRYPTED,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    
    -- Preferences
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    theme TEXT DEFAULT 'system',
    
    -- Metadata
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profile: Endorsements
CREATE TABLE endorsements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endorsed_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    skill TEXT NOT NULL,
    comment TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, endorsed_by, skill)
);

-- Profile: Work History
CREATE TABLE work_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    production_id UUID REFERENCES productions(id),
    role TEXT NOT NULL,
    company TEXT,
    
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT false,
    
    description TEXT,
    achievements TEXT[],
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 12. Companies Module
**Purpose**: Vendors, clients, partners

```sql
-- Companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    -- Basic Info
    name TEXT NOT NULL,
    legal_name TEXT,
    type TEXT CHECK (type IN ('vendor', 'client', 'partner', 'supplier', 'contractor')),
    industry TEXT,
    
    -- Contact
    email TEXT,
    phone TEXT,
    website TEXT,
    
    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    postal_code TEXT,
    country TEXT,
    
    -- Financial
    tax_id TEXT,
    payment_terms TEXT,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Metadata
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}'::jsonb,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Company Contacts
CREATE TABLE company_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    title TEXT,
    role TEXT,
    
    email TEXT,
    phone TEXT,
    is_primary BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scopes of Work
CREATE TABLE scopes_of_work (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables TEXT[],
    
    start_date DATE,
    end_date DATE,
    
    value DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'in_progress', 'completed', 'cancelled')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bids & Quotes
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id),
    
    title TEXT NOT NULL,
    description TEXT,
    
    bid_amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    submitted_date TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 13. Community Module
**Purpose**: Social features, news, discussions

```sql
-- Community Posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- NULL for public posts
    
    type TEXT NOT NULL CHECK (type IN ('news', 'showcase', 'activity', 'announcement')),
    
    author_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT,
    content TEXT NOT NULL,
    media_urls TEXT[],
    
    -- Engagement
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    
    -- Visibility
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'connections', 'workspace', 'private')),
    
    -- Metadata
    tags TEXT[],
    
    -- Moderation
    is_featured BOOLEAN DEFAULT false,
    is_sponsored BOOLEAN DEFAULT false,
    moderation_status TEXT DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Post Reactions
CREATE TABLE post_reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('like', 'love', 'celebrate', 'insightful')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Connections (Professional Network)
CREATE TABLE connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    
    UNIQUE(user_id, connected_user_id)
);

-- Discussions (Forums)
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT,
    
    author_id UUID NOT NULL REFERENCES auth.users(id),
    
    pinned BOOLEAN DEFAULT false,
    locked BOOLEAN DEFAULT false,
    
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    
    last_activity_at TIMESTAMPTZ DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Discussion Replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
    parent_reply_id UUID REFERENCES discussion_replies(id),
    
    author_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    
    upvotes INTEGER DEFAULT 0,
    is_solution BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Competitions
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    rules TEXT,
    
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    
    prize_details JSONB,
    
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'judging', 'completed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Competition Entries
CREATE TABLE competition_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    description TEXT,
    submission_url TEXT,
    
    score INTEGER DEFAULT 0,
    rank INTEGER,
    
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 14. Marketplace Module
**Purpose**: Products, services, transactions

```sql
-- Marketplace Products
CREATE TABLE marketplace_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    vendor_id UUID NOT NULL REFERENCES companies(id),
    
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    pricing_model TEXT CHECK (pricing_model IN ('one_time', 'recurring', 'usage_based')),
    
    -- Inventory
    sku TEXT UNIQUE,
    stock_quantity INTEGER,
    low_stock_threshold INTEGER,
    
    -- Media
    images TEXT[],
    videos TEXT[],
    
    -- Specs
    specifications JSONB,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'out_of_stock', 'discontinued')),
    
    -- Ratings
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Marketplace Orders
CREATE TABLE marketplace_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    order_number TEXT UNIQUE NOT NULL,
    
    buyer_id UUID NOT NULL REFERENCES auth.users(id),
    production_id UUID REFERENCES productions(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    shipping DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    shipping_address JSONB,
    billing_address JSONB,
    
    payment_method TEXT,
    payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Line Items
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES marketplace_orders(id) ON DELETE CASCADE,
    
    product_id UUID REFERENCES marketplace_products(id),
    product_name TEXT NOT NULL, -- Snapshot in case product is deleted
    
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Reviews
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES marketplace_products(id) ON DELETE CASCADE,
    
    user_id UUID NOT NULL REFERENCES auth.users(id),
    order_id UUID REFERENCES marketplace_orders(id),
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    content TEXT NOT NULL,
    
    verified_purchase BOOLEAN DEFAULT false,
    helpful_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(product_id, user_id, order_id)
);
```

---

### 15. Finance Module
**Purpose**: Budgets, transactions, invoices

```sql
-- Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    production_id UUID REFERENCES productions(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    total_amount DECIMAL(15, 2) NOT NULL,
    allocated_amount DECIMAL(15, 2) DEFAULT 0,
    spent_amount DECIMAL(15, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    start_date DATE,
    end_date DATE,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'active', 'closed')),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Budget Line Items
CREATE TABLE budget_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL,
    subcategory TEXT,
    description TEXT,
    
    budgeted_amount DECIMAL(12, 2) NOT NULL,
    actual_amount DECIMAL(12, 2) DEFAULT 0,
    
    gl_code TEXT, -- General Ledger code
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Transactions
CREATE TABLE financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
    category TEXT NOT NULL,
    
    amount DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    description TEXT,
    transaction_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Relationships
    production_id UUID REFERENCES productions(id),
    budget_id UUID REFERENCES budgets(id),
    budget_line_item_id UUID REFERENCES budget_line_items(id),
    company_id UUID REFERENCES companies(id),
    
    -- Payment Details
    payment_method TEXT,
    reference_number TEXT,
    receipt_url TEXT,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cleared', 'reconciled', 'void')),
    
    -- Accounting
    gl_code TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    invoice_number TEXT UNIQUE NOT NULL,
    
    -- Parties
    company_id UUID REFERENCES companies(id),
    production_id UUID REFERENCES productions(id),
    
    -- Amounts
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Dates
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'cancelled')),
    
    notes TEXT,
    terms TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invoice Line Items
CREATE TABLE invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense Reports
CREATE TABLE expense_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    submitted_by UUID NOT NULL REFERENCES auth.users(id),
    production_id UUID REFERENCES productions(id),
    
    title TEXT NOT NULL,
    description TEXT,
    
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    submitted_date TIMESTAMPTZ,
    approved_date TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'reimbursed')),
    
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expense Items
CREATE TABLE expense_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_report_id UUID NOT NULL REFERENCES expense_reports(id) ON DELETE CASCADE,
    
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    
    receipt_url TEXT,
    merchant TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 16. Procurement Module
**Purpose**: Orders, agreements, approvals

```sql
-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    po_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('work_order', 'purchase_order', 'change_order', 'talent_order')),
    
    -- Parties
    company_id UUID REFERENCES companies(id),
    production_id UUID REFERENCES productions(id),
    
    -- Amounts
    subtotal DECIMAL(12, 2) NOT NULL,
    tax DECIMAL(12, 2) DEFAULT 0,
    total DECIMAL(12, 2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'issued', 'fulfilled', 'cancelled')),
    
    -- Dates
    issue_date DATE,
    delivery_date DATE,
    
    -- Approval
    requires_approval BOOLEAN DEFAULT true,
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    
    notes TEXT,
    terms TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- PO Line Items
CREATE TABLE po_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Rate Ranges for Forecasting
    min_rate DECIMAL(10, 2),
    max_rate DECIMAL(10, 2),
    
    gl_code TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agreements
CREATE TABLE procurement_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    agreement_number TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('service_agreement', 'vendor_contract', 'procurement_agreement', 'msa')),
    
    company_id UUID NOT NULL REFERENCES companies(id),
    
    title TEXT NOT NULL,
    description TEXT,
    
    value DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    
    start_date DATE,
    end_date DATE,
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'active', 'expired', 'terminated')),
    
    document_url TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Approval Workflows
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    entity_type TEXT NOT NULL, -- 'purchase_order', 'budget', 'expense_report', etc.
    entity_id UUID NOT NULL,
    
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    required_approvers UUID[], -- Array of user IDs
    current_approver UUID REFERENCES auth.users(id),
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    
    approved_by UUID REFERENCES auth.users(id),
    approved_date TIMESTAMPTZ,
    rejection_reason TEXT,
    
    notes TEXT
);

-- Procurement Audits
CREATE TABLE procurement_audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    audit_date DATE NOT NULL,
    auditor_id UUID NOT NULL REFERENCES auth.users(id),
    
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    
    findings TEXT,
    compliance_status TEXT CHECK (compliance_status IN ('compliant', 'non_compliant', 'needs_review')),
    
    recommendations TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 17. Jobs Module
**Purpose**: Contracts, opportunities, pipeline

```sql
-- Job Contracts
CREATE TABLE job_contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    contract_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    
    client_id UUID REFERENCES companies(id),
    production_id UUID REFERENCES productions(id),
    
    -- Scope
    scope_of_work TEXT,
    deliverables TEXT[],
    
    -- Financial
    contract_value DECIMAL(15, 2),
    currency TEXT DEFAULT 'USD',
    payment_terms TEXT,
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'proposal', 'negotiation', 'pending_approval', 'active', 'completed', 'cancelled', 'archived')),
    
    -- Documents
    contract_document_url TEXT,
    signed_document_url TEXT,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RFPs (Request for Proposals)
CREATE TABLE rfps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    rfp_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    
    issuer_id UUID REFERENCES companies(id),
    
    issue_date DATE NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,
    
    budget_min DECIMAL(12, 2),
    budget_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('draft', 'open', 'closed', 'awarded')),
    
    awarded_to UUID REFERENCES companies(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RFP Responses
CREATE TABLE rfp_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    respondent_id UUID REFERENCES companies(id),
    
    proposal_document_url TEXT,
    proposed_value DECIMAL(12, 2),
    timeline_estimate TEXT,
    
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'shortlisted', 'accepted', 'rejected')),
    
    submitted_by UUID NOT NULL REFERENCES auth.users(id),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Job Offers
CREATE TABLE job_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    job_contract_id UUID REFERENCES job_contracts(id),
    
    offered_to UUID REFERENCES personnel(id),
    role TEXT NOT NULL,
    
    compensation DECIMAL(10, 2),
    compensation_type TEXT CHECK (compensation_type IN ('hourly', 'daily', 'weekly', 'project', 'annual')),
    
    start_date DATE,
    end_date DATE,
    
    offer_date DATE NOT NULL,
    expiry_date DATE,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'expired')),
    
    terms TEXT,
    notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 18. Reports & Analytics Modules
**Purpose**: Custom reporting, metrics, insights

```sql
-- Report Templates
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    
    -- Configuration
    data_sources JSONB NOT NULL, -- Which tables/modules to query
    filters JSONB DEFAULT '{}'::jsonb,
    grouping JSONB DEFAULT '{}'::jsonb,
    aggregations JSONB DEFAULT '{}'::jsonb,
    
    -- Visualization
    chart_type TEXT CHECK (chart_type IN ('table', 'bar', 'line', 'pie', 'scatter', 'heatmap', 'pivot')),
    chart_config JSONB,
    
    -- Access
    is_public BOOLEAN DEFAULT false,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generated Reports
CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    template_id UUID REFERENCES report_templates(id),
    name TEXT NOT NULL,
    
    -- Data Snapshot
    data JSONB NOT NULL,
    parameters JSONB,
    
    -- Export
    file_url TEXT,
    file_type TEXT CHECK (file_type IN ('pdf', 'csv', 'xlsx', 'json')),
    
    generated_by UUID NOT NULL REFERENCES auth.users(id),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Scheduled Reports
CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES report_templates(id),
    
    schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'monthly', 'quarterly')),
    schedule_config JSONB NOT NULL, -- Cron-like config
    
    recipients UUID[], -- Array of user IDs
    delivery_method TEXT DEFAULT 'email' CHECK (delivery_method IN ('email', 'slack', 'webhook')),
    
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    
    active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Custom Metrics
CREATE TABLE custom_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    description TEXT,
    
    -- Calculation
    metric_type TEXT NOT NULL CHECK (metric_type IN ('count', 'sum', 'average', 'percentage', 'ratio', 'custom')),
    source_table TEXT NOT NULL,
    calculation_formula JSONB NOT NULL,
    
    -- Display
    unit TEXT, -- '$', '%', 'hrs', etc.
    format TEXT, -- Number formatting
    
    -- Thresholds
    target_value DECIMAL(15, 2),
    warning_threshold DECIMAL(15, 2),
    critical_threshold DECIMAL(15, 2),
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KPI Tracking
CREATE TABLE kpi_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_id UUID NOT NULL REFERENCES custom_metrics(id) ON DELETE CASCADE,
    
    value DECIMAL(15, 2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Context
    production_id UUID REFERENCES productions(id),
    period_start DATE,
    period_end DATE,
    
    notes TEXT
);

-- Data Sources Configuration
CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('internal', 'api', 'database', 'webhook')),
    
    connection_config JSONB NOT NULL, -- Connection details (encrypted)
    
    sync_frequency TEXT CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'manual')),
    last_synced_at TIMESTAMPTZ,
    
    active BOOLEAN DEFAULT true,
    
    created_by UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

### 19. Resources Module
**Purpose**: Learning, documentation, knowledge base

```sql
-- Resource Library
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE, -- NULL for public resources
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    
    type TEXT NOT NULL CHECK (type IN ('guide', 'tutorial', 'course', 'publication', 'article', 'video', 'document')),
    category TEXT,
    
    -- Media
    thumbnail_url TEXT,
    file_url TEXT,
    video_url TEXT,
    
    -- Learning
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    
    -- Access
    is_public BOOLEAN DEFAULT true,
    requires_subscription BOOLEAN DEFAULT false,
    
    -- Engagement
    views_count INTEGER DEFAULT 0,
    downloads_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    author TEXT,
    
    published_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    syllabus TEXT,
    
    instructor_id UUID REFERENCES auth.users(id),
    
    duration_hours DECIMAL(5, 2),
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    
    -- Pricing
    price DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    enrollment_count INTEGER DEFAULT 0,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Course Modules
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    title TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    
    content TEXT,
    video_url TEXT,
    resource_urls TEXT[],
    
    duration_minutes INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Course Enrollments
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    
    certificate_url TEXT,
    
    UNIQUE(course_id, user_id)
);

-- Glossary Terms
CREATE TABLE glossary_terms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    term TEXT NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    
    category TEXT,
    related_terms TEXT[],
    
    examples TEXT,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grants & Funding
CREATE TABLE grants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    organization TEXT NOT NULL,
    
    amount_min DECIMAL(12, 2),
    amount_max DECIMAL(12, 2),
    currency TEXT DEFAULT 'USD',
    
    eligibility_criteria TEXT,
    application_url TEXT,
    
    application_deadline DATE,
    
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('upcoming', 'open', 'closed')),
    
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## Summary: Complete Schema Overview

### Total Tables: ~100+

| Module | Tables | Status |
|--------|--------|--------|
| **Foundation** | 11 | ✅ Implemented |
| **Dashboard** | 2 | 📋 Planned |
| **Projects** | 8 | 📋 Planned |
| **Events** | 5 | 📋 Planned |
| **People** | 8 | 📋 Planned |
| **Assets** | 4 | 📋 Planned |
| **Locations** | 4 | 📋 Planned |
| **Files** | 3 | 📋 Planned |
| **Admin/Settings/Profile** | 9 | 📋 Planned |
| **Companies** | 4 | 📋 Planned |
| **Community** | 8 | 📋 Planned |
| **Marketplace** | 5 | 📋 Planned |
| **Finance** | 8 | 📋 Planned |
| **Procurement** | 5 | 📋 Planned |
| **Jobs** | 4 | 📋 Planned |
| **Reports/Analytics** | 7 | 📋 Planned |
| **Resources** | 6 | 📋 Planned |

---

## Next Steps

### Phase 1: Create Migration Files
1. Break schema into logical migration files
2. One migration per module (or group of related tables)
3. Proper foreign key ordering

### Phase 2: Add Indexes
```sql
-- Performance indexes for common queries
CREATE INDEX idx_productions_workspace ON productions(workspace_id);
CREATE INDEX idx_productions_status ON productions(status);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_files_workspace ON files(workspace_id);
-- etc...
```

### Phase 3: Add Full-Text Search
```sql
-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add search indexes
CREATE INDEX idx_productions_search ON productions 
    USING GIN (to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### Phase 4: Add Database Functions
```sql
-- Helper functions for common operations
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update triggers
CREATE TRIGGER update_productions_updated_at
    BEFORE UPDATE ON productions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
```

### Phase 5: Configure Realtime
```sql
-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE productions;
ALTER PUBLICATION supabase_realtime ADD TABLE project_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
-- etc...
```

---

**Ready to begin implementation!** 🚀

Would you like me to:
1. **Create the first migration file** (start with Projects module)?
2. **Set up Storage buckets** configuration?
3. **Something else**?
