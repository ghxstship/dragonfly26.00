-- CONSOLIDATED SEED DATA
-- Generated: 2025-11-05T04:15:30.511Z
-- Combines: seed.sql, seed-part2.sql, seed-part3.sql, storage-buckets-config.sql

-- This migration contains demo/seed data for development and testing
-- It should be applied AFTER all schema migrations

-- ============================================================================
-- PART 1: ORIGINAL SEED DATA
-- ============================================================================

-- FROM: seed.sql
-- =============================================
-- COMPREHENSIVE DEMO SEED SCRIPT
-- Purpose: Demonstrate full platform capabilities with fictional data
-- Date: January 2025
-- NOTE: All data marked as demo and only visible to demo users
-- =============================================

-- =============================================
-- PART 1: DEMO ORGANIZATION & HIERARCHY
-- =============================================

-- Create demo organization: "Starlight Productions" (fictional)
INSERT INTO organizations (id, name, slug, subscription_tier, subscription_status, is_demo)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Starlight Productions',
    'starlight-productions',
    'enterprise',
    'active',
    true  -- DEMO FLAG
);

-- Create Project: "Galactic Festivals 2025" (fictional)
INSERT INTO projects (
    id,
    organization_id,
    name,
    code,
    description,
    type,
    status,
    priority,
    start_date,
    end_date,
    total_budget,
    created_by,
    created_at,
    is_demo
) VALUES (
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Galactic Festivals 2025',
    'GALA-2025',
    'Intergalactic music festival series featuring cosmic performances and stellar production',
    'festivals',
    'active',
    'urgent',
    '2025-01-01',
    '2025-12-31',
    50000000.00,
    '00000000-0000-0000-0000-000000000100', -- Will be Legend user
    NOW(),
    true  -- DEMO FLAG
);

-- Create Production: "Nebula Nights Festival" (fictional)
INSERT INTO productions (
    id,
    project_id,
    organization_id,
    name,
    code,
    description,
    type,
    status,
    priority,
    start_date,
    end_date,
    total_budget,
    created_by,
    created_at,
    is_demo
) VALUES (
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000001',
    'Nebula Nights Festival',
    'NEB-2025',
    'Three-day cosmic celebration at the Celestial Arena featuring holographic stages and zero-gravity dance floors',
    'festival',
    'active',
    'urgent',
    '2025-05-16',
    '2025-05-18',
    25000000.00,
    '00000000-0000-0000-0000-000000000100',
    NOW(),
    true  -- DEMO FLAG
);

-- Create Activation: "Quantum Stage" (fictional)
INSERT INTO activations (
    id,
    production_id,
    name,
    code,
    description,
    type,
    status,
    priority,
    start_date,
    end_date,
    budget,
    expected_attendance,
    capacity,
    created_by,
    created_at,
    is_demo
) VALUES (
    '00000000-0000-0000-0000-000000000030',
    '00000000-0000-0000-0000-000000000020',
    'Quantum Stage',
    'NEB-QS',
    'Main holographic stage featuring interdimensional sound systems and particle-effect lighting',
    'event',
    'active',
    'urgent',
    '2025-05-16 18:00:00',
    '2025-05-18 06:00:00',
    8000000.00,
    150000,
    150000,
    '00000000-0000-0000-0000-000000000100',
    NOW(),
    true  -- DEMO FLAG
);

-- Create Workspace: "Nebula Nights - Quantum Operations" (fictional)
INSERT INTO workspaces (
    id,
    organization_id,
    activation_id,
    name,
    description,
    color,
    is_default,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000030',
    'Nebula Nights - Quantum Operations',
    'Central command for all quantum stage operations, holographic logistics, and interdimensional coordination',
    '#7c3aed',
    true,
    true,  -- DEMO FLAG
    NOW()
);

-- =============================================
-- PART 2: DEMO USERS (All 11 Roles)
-- =============================================

-- NOTE: In production, users are created via Supabase Auth
-- This seed creates profile records that would link to auth.users

-- User 1: Legend (Platform Super Admin)
-- Captain Nova Starwind - Legendary Space Explorer
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000100',
    'nova.starwind@starlight.demo',
    'Nova',
    'Starwind',
    'Supreme Commander',
    'Legendary space explorer who discovered the quantum sound frequencies that power interdimensional festivals',
    '+1-555-NOVA',
    'https://i.pravatar.cc/150?img=1',
    true,  -- DEMO FLAG
    NOW()
);

-- User 2: Phantom (Organization Super Admin)
-- Commander Orion Shadowblade - Phantom Operations Chief
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000101',
    'orion.shadowblade@starlight.demo',
    'Orion',
    'Shadowblade',
    'Operations Phantom',
    'Master of stealth logistics, coordinates all galactic festival operations from the shadow realm',
    '+1-555-PHAN',
    'https://i.pravatar.cc/150?img=12',
    true,  -- DEMO FLAG
    NOW()
);

-- User 3: Aviator (Strategic Leader)
-- Captain Zara Skyforge - Strategic Flight Commander
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000102',
    'zara.skyforge@starlight.demo',
    'Zara',
    'Skyforge',
    'Strategic Aviator',
    'Elite pilot who navigates the cosmic festival circuit, coordinating multi-planet event strategies',
    '+1-555-AVIA',
    'https://i.pravatar.cc/150?img=5',
    true,  -- DEMO FLAG
    NOW()
);

-- User 4: Gladiator (Project Manager)
-- Maximus Thunderforge - Arena Champion
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000103',
    'maximus.thunderforge@starlight.demo',
    'Maximus',
    'Thunderforge',
    'Arena Gladiator',
    'Champion warrior who conquered the Celestial Colosseum, now commands festival production battles',
    '+1-555-GLAD',
    'https://i.pravatar.cc/150?img=13',
    true,  -- DEMO FLAG
    NOW()
);

-- User 5: Navigator (Department Manager)
-- Luna Starchart - Cosmic Navigator
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000104',
    'luna.starchart@starlight.demo',
    'Luna',
    'Starchart',
    'Quantum Navigator',
    'Expert in navigating quantum dimensions, charts the course for holographic stage productions',
    '+1-555-NAVI',
    'https://i.pravatar.cc/150?img=9',
    true,  -- DEMO FLAG
    NOW()
);

-- User 6: Deviator (Team Lead)
-- Rogue Soundwave - Audio Rebel
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000105',
    'rogue.soundwave@starlight.demo',
    'Rogue',
    'Soundwave',
    'Sonic Deviator',
    'Rebel sound engineer who broke the laws of physics to create interdimensional audio systems',
    '+1-555-DEVI',
    'https://i.pravatar.cc/150?img=14',
    true,  -- DEMO FLAG
    NOW()
);

-- User 7: Raider (Team Member)
-- Echo Stormbringer - Tech Raider
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000106',
    'echo.stormbringer@starlight.demo',
    'Echo',
    'Stormbringer',
    'Tech Raider',
    'Front-line technician who raids ancient temples for lost audio artifacts and quantum crystals',
    '+1-555-RAID',
    'https://i.pravatar.cc/150?img=10',
    true,  -- DEMO FLAG
    NOW()
);

-- User 8: Vendor (External Contractor)
-- Merlin Lightweaver - Mystical Equipment Supplier
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000107',
    'merlin.lightweaver@cosmicgear.demo',
    'Merlin',
    'Lightweaver',
    'Arcane Vendor',
    'Ancient wizard who supplies enchanted holographic equipment and particle-effect generators',
    '+1-555-VEND',
    'https://i.pravatar.cc/150?img=15',
    true,  -- DEMO FLAG
    NOW()
);

-- User 9: Visitor (Temporary Access)
-- Inspector Sage Moonwhisper - Mystical Safety Guardian
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000108',
    'sage.moonwhisper@cosmic-council.demo',
    'Sage',
    'Moonwhisper',
    'Cosmic Safety Inspector',
    'Mystical guardian from the Cosmic Council ensuring dimensional rifts meet safety standards',
    '+1-555-VISI',
    'https://i.pravatar.cc/150?img=16',
    true,  -- DEMO FLAG
    NOW()
);

-- User 10: Partner (Read-Only Stakeholder)
-- Lord Atlas Goldenheart - Royal Patron
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000109',
    'atlas.goldenheart@celestial-kingdom.demo',
    'Atlas',
    'Goldenheart',
    'Royal Partner',
    'Noble patron from the Celestial Kingdom who sponsors galactic festivals across the universe',
    '+1-555-PART',
    'https://i.pravatar.cc/150?img=17',
    true,  -- DEMO FLAG
    NOW()
);

-- User 11: Ambassador (Marketing Affiliate)
-- Stella Starshine - Cosmic Influencer
INSERT INTO profiles (
    id,
    email,
    first_name,
    last_name,
    job_title,
    bio,
    phone,
    avatar_url,
    is_demo,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000110',
    'stella.starshine@galaxy-stream.demo',
    'Stella',
    'Starshine',
    'Galactic Ambassador',
    'Cosmic celebrity who broadcasts festival experiences across 1000 star systems to billions of followers',
    '+1-555-AMBA',
    'https://i.pravatar.cc/150?img=18',
    true,  -- DEMO FLAG
    NOW()
);

-- =============================================
-- PART 3: ROLE ASSIGNMENTS
-- =============================================

-- Get role IDs (these should exist from migrations)
-- Assign roles to users with appropriate scope

-- Legend: Sarah Chen (Platform-wide)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000100',
    id,
    NULL, -- Platform-wide
    '00000000-0000-0000-0000-000000000100',
    NOW()
FROM roles WHERE name = 'legend';

-- Phantom: Marcus Rodriguez (Insomniac org)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000101',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000100',
    NOW()
FROM roles WHERE name = 'phantom';

-- Aviator: Jennifer Park (Festivals project)
INSERT INTO user_roles (user_id, role_id, organization_id, project_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000102',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000101',
    NOW()
FROM roles WHERE name = 'aviator';

-- Gladiator: David Thompson (EDC production)
INSERT INTO user_roles (user_id, role_id, organization_id, project_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000103',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000010',
    '00000000-0000-0000-0000-000000000102',
    NOW()
FROM roles WHERE name = 'gladiator';

-- Navigator: Lisa Martinez (Stage department)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000104',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    NOW()
FROM roles WHERE name = 'navigator';

-- Deviator: James Wilson (Audio team)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000105',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000104',
    NOW()
FROM roles WHERE name = 'deviator';

-- Raider: Emily Johnson (Team member)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000106',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000105',
    NOW()
FROM roles WHERE name = 'raider';

-- Vendor: Michael Brown (External)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000107',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000103',
    NOW()
FROM roles WHERE name = 'vendor';

-- Visitor: Rachel Green (Temporary, expires in 30 days)
INSERT INTO user_roles (user_id, role_id, organization_id, expires_at, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000108',
    id,
    '00000000-0000-0000-0000-000000000001',
    NOW() + INTERVAL '30 days',
    '00000000-0000-0000-0000-000000000103',
    NOW()
FROM roles WHERE name = 'visitor';

-- Partner: Robert Taylor (Read-only)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000109',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    NOW()
FROM roles WHERE name = 'partner';

-- Ambassador: Sophia Davis (Marketing only)
INSERT INTO user_roles (user_id, role_id, organization_id, granted_by, granted_at)
SELECT 
    '00000000-0000-0000-0000-000000000110',
    id,
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000101',
    NOW()
FROM roles WHERE name = 'ambassador';

-- =============================================
-- PART 4: ORGANIZATION MEMBERS
-- =============================================

INSERT INTO organization_members (organization_id, user_id, role, invited_by, joined_at)
VALUES
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000100', 'owner', NULL, NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000101', 'admin', '00000000-0000-0000-0000-000000000100', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000102', 'admin', '00000000-0000-0000-0000-000000000101', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000103', 'member', '00000000-0000-0000-0000-000000000101', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000104', 'member', '00000000-0000-0000-0000-000000000103', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000105', 'member', '00000000-0000-0000-0000-000000000104', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000106', 'member', '00000000-0000-0000-0000-000000000105', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000107', 'guest', '00000000-0000-0000-0000-000000000103', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000108', 'guest', '00000000-0000-0000-0000-000000000103', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000109', 'guest', '00000000-0000-0000-0000-000000000101', NOW()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000110', 'guest', '00000000-0000-0000-0000-000000000101', NOW());

-- Continue in next message due to length...



-- FROM: seed-part2.sql
-- =============================================
-- COMPREHENSIVE DEMO SEED SCRIPT - PART 2
-- Production Data & Workflows
-- =============================================

-- =============================================
-- PART 5: TASKS & WORKFLOWS
-- Demonstrates task management, assignments, dependencies
-- =============================================

-- Task 1: Stage Design Approval (Gladiator creates, assigns to Navigator)
INSERT INTO tasks (
    id,
    workspace_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000200',
    '00000000-0000-0000-0000-000000000040',
    'Finalize Quantum Stage Design',
    'Complete technical drawings and obtain approval for main stage configuration including LED panels, truss layout, and sonic projection arrays',
    'in_progress',
    'high',
    '00000000-0000-0000-0000-000000000104', -- Lisa (Navigator)
    '00000000-0000-0000-0000-000000000103', -- David (Gladiator)
    NOW() + INTERVAL '7 days',
    ARRAY['stage', 'design', 'critical-path'],
    NOW() - INTERVAL '3 days'
);

-- Task 2: Audio Equipment Procurement (Navigator assigns to Deviator)
INSERT INTO tasks (
    id,
    workspace_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000040',
    'Coordinate Audio Equipment Rental with Cosmic Gear Co',
    'Finalize speaker package, quantum mixers, and ethereal transmission systems rental agreement',
    'in_progress',
    'high',
    '00000000-0000-0000-0000-000000000105', -- James (Deviator)
    '00000000-0000-0000-0000-000000000104', -- Lisa (Navigator)
    NOW() + INTERVAL '14 days',
    ARRAY['audio', 'procurement', 'vendor'],
    NOW() - INTERVAL '2 days'
);

-- Task 3: Sound System Installation (Deviator assigns to Raider)
INSERT INTO tasks (
    id,
    workspace_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000040',
    'Install and Test Main PA System',
    'Rig line arrays, configure amplifiers, run system tuning and verification',
    'pending',
    'high',
    '00000000-0000-0000-0000-000000000106', -- Emily (Raider)
    '00000000-0000-0000-0000-000000000105', -- James (Deviator)
    NOW() + INTERVAL '21 days',
    ARRAY['audio', 'installation', 'technical'],
    NOW() - INTERVAL '1 day'
);

-- Task 4: Safety Inspection Coordination (Visitor access)
INSERT INTO tasks (
    id,
    workspace_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000040',
    'Schedule Health & Safety Inspection',
    'Coordinate with Cosmic Council for pre-event safety and health compliance inspection',
    'pending',
    'urgent',
    '00000000-0000-0000-0000-000000000108', -- Rachel (Visitor)
    '00000000-0000-0000-0000-000000000103', -- David (Gladiator)
    NOW() + INTERVAL '10 days',
    ARRAY['safety', 'compliance', 'inspection'],
    NOW()
);

-- Task 5: Marketing Asset Delivery (Ambassador)
INSERT INTO tasks (
    id,
    workspace_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    created_by,
    due_date,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000204',
    '00000000-0000-0000-0000-000000000040',
    'Create Social Media Content Package',
    'Develop holographic streams, quantum broadcasts, and stories showcasing stage production',
    'in_progress',
    'normal',
    '00000000-0000-0000-0000-000000000110', -- Sophia (Ambassador)
    '00000000-0000-0000-0000-000000000101', -- Marcus (Phantom)
    NOW() + INTERVAL '5 days',
    ARRAY['marketing', 'galactic-broadcast', 'content'],
    NOW() - INTERVAL '1 day'
);

-- =============================================
-- PART 6: TASK COMMENTS & COLLABORATION
-- Demonstrates cross-role communication
-- =============================================

-- Comment 1: Gladiator provides context to Navigator
INSERT INTO comments (
    id,
    workspace_id,
    entity_type,
    entity_id,
    user_id,
    content,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000300',
    '00000000-0000-0000-0000-000000000040',
    'task',
    '00000000-0000-0000-0000-000000000200',
    '00000000-0000-0000-0000-000000000103', -- David
    'Lisa, please prioritize the LED panel configuration. We need to finalize this before vendor contracts are signed. Budget approved for premium panels.',
    NOW() - INTERVAL '2 days'
);

-- Comment 2: Navigator responds and tags Deviator
INSERT INTO comments (
    id,
    workspace_id,
    entity_type,
    entity_id,
    user_id,
    content,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000040',
    'task',
    '00000000-0000-0000-0000-000000000200',
    '00000000-0000-0000-0000-000000000104', -- Lisa
    'On it! @Rogue Soundwave - can you coordinate with Cosmic Gear Co on the audio integration points? We need to ensure speaker placement doesn''t interfere with LED rigging.',
    NOW() - INTERVAL '2 days' + INTERVAL '3 hours'
);

-- Comment 3: Deviator confirms and updates
INSERT INTO comments (
    id,
    workspace_id,
    entity_type,
    entity_id,
    user_id,
    content,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000040',
    'task',
    '00000000-0000-0000-0000-000000000200',
    '00000000-0000-0000-0000-000000000105', -- James
    'Already on the call with Cosmic Gear Co. Merlin Lightweaver is sending updated CAD drawings by EOD. We''re good to proceed.',
    NOW() - INTERVAL '1 day'
);

-- Comment 4: Vendor provides update
INSERT INTO comments (
    id,
    workspace_id,
    entity_type,
    entity_id,
    user_id,
    content,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000040',
    'task',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000107', -- Michael (Vendor)
    'Equipment manifest attached. We''re including 4x Stellar Array X2 arrays, 8x KS28 subs, and 2x Quantum Resonator consoles. Installation crew arrives May 14th.',
    NOW() - INTERVAL '12 hours'
);

-- Comment 5: Raider asks technical question
INSERT INTO comments (
    id,
    workspace_id,
    entity_type,
    entity_id,
    user_id,
    content,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000304',
    '00000000-0000-0000-0000-000000000040',
    'task',
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000106', -- Emily
    'James - do we have the rigging points certified for the K2 weight? Need to verify before we start the hang.',
    NOW() - INTERVAL '6 hours'
);

-- =============================================
-- PART 7: ASSETS & INVENTORY
-- Demonstrates asset tracking and assignments
-- =============================================

-- Asset Category: Audio Equipment
INSERT INTO asset_categories (
    id,
    workspace_id,
    name,
    description,
    color,
    icon,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000400',
    '00000000-0000-0000-0000-000000000040',
    'Audio Equipment',
    'Professional audio gear including speakers, consoles, and processing',
    '#3b82f6',
    'Volume2',
    NOW()
);

-- Asset 1: Quantum Resonator Console #1
INSERT INTO assets (
    id,
    workspace_id,
    category_id,
    name,
    asset_tag,
    description,
    status,
    condition,
    acquisition_date,
    acquisition_cost,
    current_value,
    assigned_to,
    location_id,
    metadata,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000400',
    'Quantum Resonator MK-VII - Quantum Nexus',
    'AUDIO-SD7-001',
    'Quantum mixing nexus - 256 channels, Quantum engine',
    'in_use',
    'excellent',
    '2024-01-15',
    250000.00,
    225000.00,
    '00000000-0000-0000-0000-000000000105', -- Assigned to James
    NULL,
    '{"manufacturer": "Quantum Systems", "model": "SD7 Quantum", "serial": "SD7Q-2024-001", "channels": 256, "rental": false}'::jsonb,
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '30 days'
);

-- Asset 2: Stellar Array X2 Array
INSERT INTO assets (
    id,
    workspace_id,
    category_id,
    name,
    asset_tag,
    description,
    status,
    condition,
    acquisition_date,
    acquisition_cost,
    current_value,
    assigned_to,
    metadata,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000400',
    'Stellar Array X2 Stellar Array (16 boxes)',
    'AUDIO-K2-MAIN',
    'Main sonic projection system - 16x K2 cabinets with rigging',
    'in_use',
    'excellent',
    NULL, -- Rental
    NULL,
    NULL,
    '00000000-0000-0000-0000-000000000106', -- Assigned to Emily
    '{"manufacturer": "Stellar Acoustics", "model": "K2", "quantity": 16, "rental": true, "vendor": "Cosmic Gear Co", "rental_period": "2025-05-14 to 2025-05-20"}'::jsonb,
    '00000000-0000-0000-0000-000000000105',
    NOW() - INTERVAL '15 days'
);

-- Asset Maintenance Record
INSERT INTO asset_maintenance (
    id,
    asset_id,
    workspace_id,
    maintenance_type,
    description,
    performed_by,
    performed_date,
    cost,
    next_maintenance_date,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000450',
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000040',
    'preventive',
    'Full system diagnostic, firmware update to v1.7.2, cleaned all faders and encoders',
    '00000000-0000-0000-0000-000000000106', -- Emily
    NOW() - INTERVAL '7 days',
    500.00,
    NOW() + INTERVAL '90 days',
    NOW() - INTERVAL '7 days'
);

-- =============================================
-- PART 8: FINANCIAL DATA
-- Demonstrates budget tracking and expenses
-- =============================================

-- Budget: Quantum Stage Production
INSERT INTO budgets (
    id,
    workspace_id,
    name,
    description,
    total_amount,
    spent_amount,
    category,
    status,
    start_date,
    end_date,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000500',
    '00000000-0000-0000-0000-000000000040',
    'Quantum Stage - Audio Production',
    'Complete audio system rental, installation, and operation',
    2500000.00,
    1750000.00,
    'production',
    'active',
    '2025-01-01',
    '2025-05-31',
    '00000000-0000-0000-0000-000000000103', -- David
    NOW() - INTERVAL '60 days'
);

-- Expense 1: Cosmic Gear Co Audio Equipment Rental
INSERT INTO expenses (
    id,
    workspace_id,
    budget_id,
    title,
    description,
    amount,
    category,
    status,
    expense_date,
    vendor_name,
    receipt_url,
    submitted_by,
    approved_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000500',
    'Cosmic Gear Co Audio Equipment - Main Package',
    'Stellar Array X2 system, Quantum Systems consoles, ethereal transmission systems, installation labor',
    1500000.00,
    'equipment_rental',
    'approved',
    NOW() - INTERVAL '10 days',
    'Cosmic Gear Co (Cosmic Gear Co)',
    'https://storage.example.com/receipts/prg-audio-2025.pdf',
    '00000000-0000-0000-0000-000000000105', -- James submitted
    '00000000-0000-0000-0000-000000000104', -- Lisa approved
    NOW() - INTERVAL '10 days'
);

-- Expense 2: Audio Crew Labor
INSERT INTO expenses (
    id,
    workspace_id,
    budget_id,
    title,
    description,
    amount,
    category,
    status,
    expense_date,
    submitted_by,
    approved_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000502',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000500',
    'Audio Crew - Installation & Operation',
    '12 technicians x 5 days @ $500/day = $30,000',
    250000.00,
    'labor',
    'approved',
    NOW() - INTERVAL '5 days',
    '00000000-0000-0000-0000-000000000105', -- James submitted
    '00000000-0000-0000-0000-000000000103', -- David approved
    NOW() - INTERVAL '5 days'
);

-- Invoice: Cosmic Gear Co Final Payment
INSERT INTO invoices (
    id,
    workspace_id,
    invoice_number,
    vendor_name,
    description,
    amount,
    status,
    issue_date,
    due_date,
    paid_date,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000550',
    '00000000-0000-0000-0000-000000000040',
    'Cosmic Gear Co-2025-Nebula-001',
    'Cosmic Gear Co (Cosmic Gear Co)',
    'Final payment for audio equipment rental and services',
    1500000.00,
    'paid',
    NOW() - INTERVAL '15 days',
    NOW() + INTERVAL '15 days',
    NOW() - INTERVAL '5 days',
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '15 days'
);

-- =============================================
-- PART 9: PEOPLE & SCHEDULING
-- Demonstrates crew management and scheduling
-- =============================================

-- Person 1: Additional Crew Member
INSERT INTO people (
    id,
    workspace_id,
    first_name,
    last_name,
    email,
    phone,
    role,
    department,
    status,
    hire_date,
    rate,
    rate_type,
    skills,
    certifications,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000600',
    '00000000-0000-0000-0000-000000000040',
    'Alex',
    'Rivera',
    'phoenix.fireforge@freelance.demo',
    '+1-555-0600',
    'Sonic Engineer',
    'Audio',
    'active',
    '2025-04-01',
    75.00,
    'hourly',
    ARRAY['Stellar Acoustics', 'Quantum Systems', 'System Tuning', 'RF Coordination'],
    ARRAY['OSHA 30', 'ETCP Rigging'],
    '00000000-0000-0000-0000-000000000105',
    NOW() - INTERVAL '20 days'
);

-- Schedule: Audio Team Shifts
INSERT INTO schedules (
    id,
    workspace_id,
    person_id,
    title,
    description,
    start_time,
    end_time,
    location,
    status,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000650',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000600',
    'System Installation - Day 1',
    'Rig main PA arrays, run cable, configure amplifiers',
    '2025-05-14 08:00:00',
    '2025-05-14 20:00:00',
    'Quantum Stage - Main Stage',
    'scheduled',
    '00000000-0000-0000-0000-000000000105',
    NOW() - INTERVAL '10 days'
);

-- =============================================
-- PART 10: DOCUMENTS & FILES
-- Demonstrates file management and sharing
-- =============================================

-- File 1: Stage Design CAD
INSERT INTO files (
    id,
    workspace_id,
    name,
    description,
    file_type,
    file_size,
    storage_path,
    folder_path,
    uploaded_by,
    tags,
    metadata,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000700',
    '00000000-0000-0000-0000-000000000040',
    'Kinetic_Field_Stage_Design_v3.dwg',
    'Final approved stage design with LED panels, truss, and audio rigging points',
    'application/acad',
    15728640, -- 15MB
    'projects/edc-lv-2025/stage-design/Kinetic_Field_Stage_Design_v3.dwg',
    '/Stage Design/CAD Files',
    '00000000-0000-0000-0000-000000000104', -- Lisa
    ARRAY['stage', 'design', 'cad', 'approved'],
    '{"version": "3.0", "approved_by": "Maximus Thunderforge", "approval_date": "2025-04-15"}'::jsonb,
    NOW() - INTERVAL '5 days'
);

-- File 2: Audio Equipment Manifest
INSERT INTO files (
    id,
    workspace_id,
    name,
    description,
    file_type,
    file_size,
    storage_path,
    folder_path,
    uploaded_by,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000701',
    '00000000-0000-0000-0000-000000000040',
    'Cosmic Gear Co_Audio_Equipment_Manifest.xlsx',
    'Complete equipment list with serial numbers, quantities, and delivery schedule',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    2097152, -- 2MB
    'projects/edc-lv-2025/audio/Cosmic Gear Co_Audio_Equipment_Manifest.xlsx',
    '/Audio/Vendor Documents',
    '00000000-0000-0000-0000-000000000107', -- Michael (Vendor)
    ARRAY['audio', 'equipment', 'vendor', 'prg'],
    NOW() - INTERVAL '3 days'
);

-- File 3: Safety Inspection Checklist
INSERT INTO files (
    id,
    workspace_id,
    name,
    description,
    file_type,
    file_size,
    storage_path,
    folder_path,
    uploaded_by,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000702',
    '00000000-0000-0000-0000-000000000040',
    'Clark_County_Safety_Inspection_Checklist.pdf',
    'Official safety inspection requirements and checklist for large-scale events',
    'application/pdf',
    524288, -- 512KB
    'projects/edc-lv-2025/compliance/Clark_County_Safety_Inspection_Checklist.pdf',
    '/Compliance/Safety',
    '00000000-0000-0000-0000-000000000108', -- Rachel (Visitor)
    ARRAY['safety', 'compliance', 'inspection', 'required'],
    NOW() - INTERVAL '1 day'
);

-- Continue in next message...



-- FROM: seed-part3.sql
-- =============================================
-- COMPREHENSIVE DEMO SEED SCRIPT - PART 3
-- Events, Locations, Companies & Analytics
-- =============================================

-- =============================================
-- PART 11: EVENTS & TIMELINE
-- Demonstrates event management and scheduling
-- =============================================

-- Event 1: Load-In Day
INSERT INTO events (
    id,
    workspace_id,
    title,
    description,
    event_type,
    status,
    start_date,
    end_date,
    location,
    capacity,
    attendees_count,
    created_by,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000800',
    '00000000-0000-0000-0000-000000000040',
    'Quantum Stage - Load-In & Installation',
    'Complete stage build, audio/lighting installation, and system integration',
    'production',
    'scheduled',
    '2025-05-14 06:00:00',
    '2025-05-15 23:59:00',
    'Celestial Arena - Quantum Stage',
    200, -- Crew capacity
    150, -- Expected crew
    '00000000-0000-0000-0000-000000000103',
    ARRAY['load-in', 'installation', 'critical'],
    NOW() - INTERVAL '30 days'
);

-- Event 2: Sound Check & System Tuning
INSERT INTO events (
    id,
    workspace_id,
    title,
    description,
    event_type,
    status,
    start_date,
    end_date,
    location,
    created_by,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000040',
    'Quantum Stage - Sound Check & System Optimization',
    'Full sonic projection system tuning, artist sound checks, and final technical rehearsal',
    'rehearsal',
    'scheduled',
    '2025-05-16 10:00:00',
    '2025-05-16 17:00:00',
    'Celestial Arena - Quantum Stage',
    '00000000-0000-0000-0000-000000000105', -- James
    ARRAY['sound-check', 'tuning', 'pre-show'],
    NOW() - INTERVAL '25 days'
);

-- Event 3: Festival Day 1
INSERT INTO events (
    id,
    workspace_id,
    title,
    description,
    event_type,
    status,
    start_date,
    end_date,
    location,
    capacity,
    attendees_count,
    created_by,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000040',
    'Nebula Nights Festival - Day 1',
    'First night of Nebula Nights featuring 50+ artists',
    'festival',
    'scheduled',
    '2025-05-16 18:00:00',
    '2025-05-17 06:00:00',
    'Celestial Arena - Quantum Stage',
    150000,
    0, -- Will be updated post-event
    '00000000-0000-0000-0000-000000000103',
    ARRAY['festival', 'day-1', 'live-event'],
    NOW() - INTERVAL '30 days'
);

-- =============================================
-- PART 12: LOCATIONS & VENUES
-- Demonstrates location management
-- =============================================

-- Location 1: Celestial Arena
INSERT INTO locations (
    id,
    workspace_id,
    name,
    type,
    address,
    city,
    state,
    country,
    postal_code,
    capacity,
    description,
    amenities,
    contact_name,
    contact_email,
    contact_phone,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000900',
    '00000000-0000-0000-0000-000000000040',
    'Celestial Arena',
    'venue',
    '7000 N Nebula City Blvd',
    'Nebula City',
    'NV',
    'USA',
    'QNT-01',
    150000,
    'World-class interdimensional venue hosting Nebula Nights annually',
    ARRAY['parking', 'power', 'water', 'security', 'medical', 'wifi'],
    'Venue Operations Manager',
    'operations@celestial-arena.demo',
    '+1-555-COSMIC',
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '60 days'
);

-- Location 2: Quantum Stage Area
INSERT INTO locations (
    id,
    workspace_id,
    parent_location_id,
    name,
    type,
    description,
    capacity,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000901',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000900',
    'Quantum Stage - Main Stage Area',
    'stage',
    'Primary performance stage with 360-degree LED cathedral design',
    150000,
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '45 days'
);

-- Location 3: Production Office
INSERT INTO locations (
    id,
    workspace_id,
    parent_location_id,
    name,
    type,
    description,
    amenities,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000000902',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000900',
    'Production Office - Quantum Stage',
    'office',
    'On-site production office for stage management and coordination',
    ARRAY['wifi', 'power', 'ac', 'security'],
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '40 days'
);

-- =============================================
-- PART 13: COMPANIES & VENDORS
-- Demonstrates vendor management
-- =============================================

-- Company 1: Cosmic Gear Co (Cosmic Gear Co)
INSERT INTO companies (
    id,
    workspace_id,
    name,
    type,
    industry,
    description,
    website,
    email,
    phone,
    address,
    city,
    state,
    country,
    postal_code,
    status,
    tags,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001000',
    '00000000-0000-0000-0000-000000000040',
    'Cosmic Gear Co (Cosmic Gear Co)',
    'vendor',
    'Entertainment Technology',
    'Global leader in entertainment and event technology solutions',
    'https://www.cosmicgear.demo',
    'info@cosmicgear.demo',
    '+1-555-ARCANE',
    '12233 W Olympic Blvd',
    'Los Angeles',
    'CA',
    'USA',
    '90064',
    'active',
    ARRAY['audio', 'lighting', 'video', 'preferred-vendor'],
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '90 days'
);

-- Company Contact: Merlin Lightweaver at Cosmic Gear Co
INSERT INTO company_contacts (
    id,
    workspace_id,
    company_id,
    first_name,
    last_name,
    title,
    email,
    phone,
    is_primary,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001050',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000001000',
    'Michael',
    'Brown',
    'Arcane Vendor',
    'merlin.lightweaver@cosmicgear.demo',
    '+1-555-0107',
    true,
    '00000000-0000-0000-0000-000000000105',
    NOW() - INTERVAL '85 days'
);

-- Company 2: Celestial Kingdom
INSERT INTO companies (
    id,
    workspace_id,
    name,
    type,
    industry,
    description,
    website,
    email,
    phone,
    status,
    tags,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001001',
    '00000000-0000-0000-0000-000000000040',
    'Celestial Kingdom Enterprises',
    'partner',
    'Live Entertainment',
    'Global leader in live entertainment and ticketing',
    'https://www.celestial-kingdom.demo',
    'partnerships@celestial-kingdom.demo',
    '+1-555-ROYAL',
    'active',
    ARRAY['partner', 'strategic', 'ticketing'],
    '00000000-0000-0000-0000-000000000101',
    NOW() - INTERVAL '120 days'
);

-- =============================================
-- PART 14: PROCUREMENT & PURCHASE ORDERS
-- Demonstrates procurement workflow
-- =============================================

-- Purchase Order 1: Cosmic Gear Co Audio Equipment
INSERT INTO purchase_orders (
    id,
    workspace_id,
    po_number,
    vendor_id,
    title,
    description,
    total_amount,
    status,
    order_date,
    delivery_date,
    payment_terms,
    created_by,
    approved_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001100',
    '00000000-0000-0000-0000-000000000040',
    'PO-2025-Nebula-001',
    '00000000-0000-0000-0000-000000001000', -- Cosmic Gear Co
    'Audio Equipment Rental - Quantum Stage',
    'Complete audio system rental including installation and technical support',
    1500000.00,
    'approved',
    NOW() - INTERVAL '30 days',
    '2025-05-14',
    'Net 30',
    '00000000-0000-0000-0000-000000000105', -- James created
    '00000000-0000-0000-0000-000000000103', -- David approved
    NOW() - INTERVAL '30 days'
);

-- PO Line Items
INSERT INTO po_line_items (
    id,
    po_id,
    workspace_id,
    description,
    quantity,
    unit_price,
    total_price,
    created_at
) VALUES 
(
    '00000000-0000-0000-0000-000000001150',
    '00000000-0000-0000-0000-000000001100',
    '00000000-0000-0000-0000-000000000040',
    'Stellar Array X2 Stellar Array System (64 boxes)',
    64,
    15000.00,
    960000.00,
    NOW() - INTERVAL '30 days'
),
(
    '00000000-0000-0000-0000-000000001151',
    '00000000-0000-0000-0000-000000001100',
    '00000000-0000-0000-0000-000000000040',
    'Quantum Resonator MK-VII Consoles (2 units)',
    2,
    50000.00,
    100000.00,
    NOW() - INTERVAL '30 days'
),
(
    '00000000-0000-0000-0000-000000001152',
    '00000000-0000-0000-0000-000000001100',
    '00000000-0000-0000-0000-000000000040',
    'Installation & Technical Support (5 days)',
    1,
    440000.00,
    440000.00,
    NOW() - INTERVAL '30 days'
);

-- =============================================
-- PART 15: ANALYTICS & REPORTING DATA
-- Demonstrates analytics capabilities
-- =============================================

-- Analytics Event: Budget Tracking
INSERT INTO analytics_events (
    id,
    workspace_id,
    event_type,
    event_name,
    properties,
    user_id,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001200',
    '00000000-0000-0000-0000-000000000040',
    'budget_update',
    'Budget Spent Threshold Reached',
    '{"budget_id": "00000000-0000-0000-0000-000000000500", "threshold": 70, "spent_percentage": 70, "category": "production"}'::jsonb,
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '5 days'
);

-- Analytics Event: Task Completion
INSERT INTO analytics_events (
    id,
    workspace_id,
    event_type,
    event_name,
    properties,
    user_id,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001201',
    '00000000-0000-0000-0000-000000000040',
    'task_completed',
    'Critical Task Completed',
    '{"task_id": "00000000-0000-0000-0000-000000000200", "priority": "high", "completion_time_hours": 72}'::jsonb,
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '1 day'
);

-- Report: Production Status Summary
INSERT INTO reports (
    id,
    workspace_id,
    name,
    description,
    report_type,
    parameters,
    schedule,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001250',
    '00000000-0000-0000-0000-000000000040',
    'Weekly Production Status Report',
    'Comprehensive weekly summary of production progress, budget, and risks',
    'production_status',
    '{"include_budget": true, "include_tasks": true, "include_risks": true, "recipients": ["maximus.thunderforge@starlight.demo", "zara.skyforge@starlight.demo"]}'::jsonb,
    'weekly',
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '20 days'
);

-- =============================================
-- PART 16: NOTIFICATIONS & ACTIVITY
-- Demonstrates real-time collaboration
-- =============================================

-- Notification 1: Task Assignment (Navigator → Deviator)
INSERT INTO notifications (
    id,
    workspace_id,
    user_id,
    type,
    title,
    message,
    link,
    read,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001300',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000105', -- James
    'task_assigned',
    'New Task Assigned: Coordinate Audio Equipment Rental',
    'Luna Starchart assigned you a high-priority task for audio equipment procurement',
    '/tasks/00000000-0000-0000-0000-000000000201',
    true,
    NOW() - INTERVAL '2 days'
);

-- Notification 2: Budget Alert (System → Gladiator)
INSERT INTO notifications (
    id,
    workspace_id,
    user_id,
    type,
    title,
    message,
    link,
    read,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001301',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000103', -- David
    'budget_alert',
    'Budget Alert: 70% Spent on Audio Production',
    'Quantum Stage Audio Production budget has reached 70% utilization ($1.75M of $2.5M)',
    '/budgets/00000000-0000-0000-0000-000000000500',
    false,
    NOW() - INTERVAL '5 days'
);

-- Notification 3: Comment Mention (Deviator → Navigator)
INSERT INTO notifications (
    id,
    workspace_id,
    user_id,
    type,
    title,
    message,
    link,
    read,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001302',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000104', -- Lisa
    'mention',
    'Rogue Soundwave mentioned you in a comment',
    '@Luna Starchart - can you coordinate with Cosmic Gear Co on the audio integration points?',
    '/tasks/00000000-0000-0000-0000-000000000200#comment-00000000-0000-0000-0000-000000000301',
    true,
    NOW() - INTERVAL '2 days' + INTERVAL '3 hours'
);

-- Activity Log: Document Upload
INSERT INTO activity_logs (
    id,
    workspace_id,
    user_id,
    action,
    entity_type,
    entity_id,
    description,
    metadata,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001350',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000107', -- Michael (Vendor)
    'file_uploaded',
    'file',
    '00000000-0000-0000-0000-000000000701',
    'Uploaded Cosmic Gear Co_Audio_Equipment_Manifest.xlsx',
    '{"file_size": 2097152, "file_type": "xlsx", "folder": "/Audio/Vendor Documents"}'::jsonb,
    NOW() - INTERVAL '3 days'
);

-- =============================================
-- PART 17: JOBS & OPPORTUNITIES
-- Demonstrates hiring and crew management
-- =============================================

-- Job Posting: Tech Raider
INSERT INTO jobs (
    id,
    workspace_id,
    title,
    description,
    department,
    employment_type,
    experience_level,
    location,
    salary_min,
    salary_max,
    salary_type,
    status,
    required_skills,
    preferred_skills,
    posted_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001400',
    '00000000-0000-0000-0000-000000000040',
    'Tech Raider - Nebula Nights Festival',
    'Seeking experienced audio technicians for Nebula Nights festival production. Must have large-format sonic projection system experience.',
    'Audio',
    'contract',
    'intermediate',
    'Nebula City, NV',
    60.00,
    85.00,
    'hourly',
    'filled',
    ARRAY['Stellar Acoustics', 'Large Format PA', 'Festival Experience', 'OSHA Certified'],
    ARRAY['Quantum Systems', 'RF Coordination', 'System Tuning'],
    '00000000-0000-0000-0000-000000000105', -- James
    NOW() - INTERVAL '45 days'
);

-- Job Application: Phoenix Fireforge
INSERT INTO job_applications (
    id,
    job_id,
    workspace_id,
    applicant_name,
    applicant_email,
    applicant_phone,
    resume_url,
    cover_letter,
    status,
    applied_date,
    reviewed_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001450',
    '00000000-0000-0000-0000-000000001400',
    '00000000-0000-0000-0000-000000000040',
    'Phoenix Fireforge',
    'phoenix.fireforge@freelance.demo',
    '+1-555-0600',
    'https://storage.example.com/resumes/alex-rivera.pdf',
    'I have 8 years of experience with Stellar Acoustics systems and have worked Nebula, Coachella, and Tomorrowland. Excited to join the Quantum Stage team.',
    'hired',
    NOW() - INTERVAL '40 days',
    '00000000-0000-0000-0000-000000000105',
    NOW() - INTERVAL '40 days'
);

-- =============================================
-- PART 18: MARKETPLACE & RESOURCES
-- Demonstrates community features
-- =============================================

-- Marketplace Listing: Used Audio Gear
INSERT INTO marketplace_listings (
    id,
    workspace_id,
    seller_id,
    title,
    description,
    category,
    price,
    condition,
    status,
    images,
    tags,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001500',
    '00000000-0000-0000-0000-000000000040',
    '00000000-0000-0000-0000-000000000105', -- James
    'Cosmic Wave Transmitter Wireless System (4 channels)',
    'Lightly used Cosmic Wave Transmitter wireless system with 4 channels. Perfect for festivals and large events. Includes rack, antennas, and 4 handheld transmitters.',
    'audio_equipment',
    12000.00,
    'excellent',
    'active',
    ARRAY['https://storage.example.com/marketplace/shure-axient-1.jpg'],
    ARRAY['wireless', 'shure', 'audio', 'festival-grade'],
    NOW() - INTERVAL '10 days'
);

-- Resource: Best Practices Guide
INSERT INTO resources (
    id,
    workspace_id,
    title,
    description,
    resource_type,
    content_url,
    category,
    tags,
    created_by,
    views,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001550',
    '00000000-0000-0000-0000-000000000040',
    'Festival Audio System Design Best Practices',
    'Comprehensive guide to designing and deploying large-format sonic projection systems for outdoor festivals',
    'guide',
    'https://docs.example.com/festival-audio-best-practices.pdf',
    'audio',
    ARRAY['audio', 'festival', 'best-practices', 'pa-systems'],
    '00000000-0000-0000-0000-000000000105',
    247,
    NOW() - INTERVAL '60 days'
);

-- =============================================
-- PART 19: INSIGHTS & METRICS
-- Demonstrates data-driven decision making
-- =============================================

-- Insight: Budget Efficiency
INSERT INTO insights (
    id,
    workspace_id,
    title,
    description,
    insight_type,
    priority,
    data,
    recommendations,
    created_by,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001600',
    '00000000-0000-0000-0000-000000000040',
    'Audio Budget Optimization Opportunity',
    'Analysis shows potential 15% cost savings on audio equipment rental through early booking and multi-event contracts',
    'cost_optimization',
    'medium',
    '{"current_cost": 1500000, "potential_savings": 225000, "confidence": 0.85}'::jsonb,
    ARRAY['Negotiate multi-festival contract with Cosmic Gear Co', 'Book equipment 90+ days in advance', 'Consider purchasing frequently used items'],
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '15 days'
);

-- Metric: Team Productivity
INSERT INTO metrics (
    id,
    workspace_id,
    metric_name,
    metric_value,
    metric_unit,
    category,
    period_start,
    period_end,
    metadata,
    created_at
) VALUES (
    '00000000-0000-0000-0000-000000001650',
    '00000000-0000-0000-0000-000000000040',
    'Task Completion Rate',
    92.5,
    'percentage',
    'productivity',
    NOW() - INTERVAL '30 days',
    NOW(),
    '{"team": "Audio", "total_tasks": 40, "completed_tasks": 37, "on_time_completion": 35}'::jsonb,
    NOW()
);

-- =============================================
-- PART 20: TAGS & CATEGORIZATION
-- Demonstrates organizational flexibility
-- =============================================

-- Global Tags
INSERT INTO tags (
    id,
    workspace_id,
    name,
    color,
    category,
    usage_count,
    created_by,
    created_at
) VALUES 
(
    '00000000-0000-0000-0000-000000001700',
    '00000000-0000-0000-0000-000000000040',
    'critical-path',
    '#ef4444',
    'priority',
    15,
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '60 days'
),
(
    '00000000-0000-0000-0000-000000001701',
    '00000000-0000-0000-0000-000000000040',
    'vendor-coordination',
    '#f59e0b',
    'workflow',
    23,
    '00000000-0000-0000-0000-000000000104',
    NOW() - INTERVAL '55 days'
),
(
    '00000000-0000-0000-0000-000000001702',
    '00000000-0000-0000-0000-000000000040',
    'safety-required',
    '#dc2626',
    'compliance',
    8,
    '00000000-0000-0000-0000-000000000103',
    NOW() - INTERVAL '50 days'
);

-- =============================================
-- SUMMARY STATISTICS
-- =============================================

-- This seed script creates:
-- - 1 Organization (Starlight Productions)
-- - 1 Project (Galactic Festivals 2025)
-- - 1 Production (Nebula Nights Festival)
-- - 1 Activation (Quantum Stage)
-- - 1 Workspace (Nebula LV 2025 - Site Operations)
-- - 11 Users (one for each role type)
-- - 11 Role assignments
-- - 5 Tasks (demonstrating workflow hierarchy)
-- - 5 Comments (cross-role collaboration)
-- - 2 Assets with maintenance records
-- - 1 Budget with 2 expenses and 1 invoice
-- - 1 Additional crew member with schedule
-- - 3 Files (CAD, manifest, checklist)
-- - 3 Events (load-in, sound check, festival)
-- - 3 Locations (venue, stage, office)
-- - 2 Companies with 1 contact
-- - 1 Purchase order with 3 line items
-- - 2 Analytics events and 1 report
-- - 3 Notifications and 1 activity log
-- - 1 Job posting with 1 application
-- - 1 Marketplace listing and 1 resource
-- - 1 Insight and 1 metric
-- - 3 Tags

-- Total: 70+ interconnected records demonstrating full platform capabilities



-- FROM: storage-buckets-config.sql
-- =============================================
-- STORAGE BUCKETS CONFIGURATION
-- =============================================
-- This file documents the storage buckets that need to be created
-- via Supabase Dashboard or CLI. These CANNOT be created via migrations.
--
-- TO CREATE BUCKETS:
-- 1. Via Dashboard: Navigate to Storage > Create Bucket
-- 2. Via CLI: Use the Supabase Management API or Dashboard
-- =============================================

-- =============================================
-- BUCKET CONFIGURATIONS
-- =============================================

-- 1. AVATARS
-- Name: avatars
-- Public: Yes
-- File size limit: 5MB (5242880 bytes)
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

-- 2. LOGOS
-- Name: logos
-- Public: Yes
-- File size limit: 5MB (5242880 bytes)
-- Allowed MIME types: image/jpeg, image/png, image/svg+xml, image/webp

-- 3. DOCUMENTS
-- Name: documents
-- Public: No
-- File size limit: 50MB (52428800 bytes)
-- Allowed MIME types: 
--   - application/pdf
--   - application/msword
--   - application/vnd.openxmlformats-officedocument.wordprocessingml.document
--   - application/vnd.ms-excel
--   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
--   - application/vnd.ms-powerpoint
--   - application/vnd.openxmlformats-officedocument.presentationml.presentation
--   - text/plain
--   - text/csv

-- 4. MEDIA
-- Name: media
-- Public: No
-- File size limit: 500MB (524288000 bytes)
-- Allowed MIME types:
--   - image/jpeg, image/png, image/webp, image/gif, image/svg+xml
--   - video/mp4, video/quicktime, video/x-msvideo
--   - audio/mpeg, audio/wav, audio/ogg

-- 5. PROJECT-FILES
-- Name: project-files
-- Public: No
-- File size limit: 100MB (104857600 bytes)
-- Allowed MIME types:
--   - application/pdf
--   - application/zip
--   - application/x-zip-compressed
--   - image/jpeg, image/png, image/webp
--   - application/vnd.openxmlformats-officedocument.wordprocessingml.document
--   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

-- 6. EVENT-ASSETS
-- Name: event-assets
-- Public: No
-- File size limit: 500MB (524288000 bytes)
-- Allowed MIME types:
--   - image/jpeg, image/png, image/webp
--   - video/mp4, video/quicktime
--   - application/pdf

-- 7. TECHNICAL-DRAWINGS
-- Name: technical-drawings
-- Public: No
-- File size limit: 50MB (52428800 bytes)
-- Allowed MIME types:
--   - application/pdf
--   - image/jpeg, image/png
--   - application/vnd.autocad.dwg
--   - image/svg+xml

-- 8. CONTRACTS
-- Name: contracts
-- Public: No
-- File size limit: 50MB (52428800 bytes)
-- Allowed MIME types:
--   - application/pdf
--   - application/msword
--   - application/vnd.openxmlformats-officedocument.wordprocessingml.document

-- 9. REPORTS
-- Name: reports
-- Public: No
-- File size limit: 50MB (52428800 bytes)
-- Allowed MIME types:
--   - application/pdf
--   - application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
--   - text/csv

-- 10. RECEIPTS
-- Name: receipts
-- Public: No
-- File size limit: 10MB (10485760 bytes)
-- Allowed MIME types:
--   - application/pdf
--   - image/jpeg, image/png, image/webp

-- 11. INVENTORY-PHOTOS
-- Name: inventory-photos
-- Public: No (workspace-scoped access)
-- File size limit: 10MB per photo (10485760 bytes)
-- Allowed MIME types:
--   - image/jpeg, image/png, image/webp, image/heic
-- Max photos per item: 8 (Sortly standard)
-- Features: Visual inventory tracking, barcode label photos, condition documentation

-- =============================================
-- FOLDER STRUCTURE REFERENCE
-- =============================================

-- avatars/{user_id}/avatar.jpg
-- logos/{organization_id}/logo.png
-- documents/{workspace_id}/contracts/
-- documents/{workspace_id}/riders/
-- documents/{workspace_id}/tech-specs/
-- documents/{workspace_id}/permits/
-- documents/{workspace_id}/insurance/
-- media/{workspace_id}/{production_id}/photos/
-- media/{workspace_id}/{production_id}/videos/
-- media/{workspace_id}/{production_id}/audio/
-- project-files/{workspace_id}/{production_id}/planning/
-- project-files/{workspace_id}/{production_id}/designs/
-- project-files/{workspace_id}/{production_id}/deliverables/
-- event-assets/{workspace_id}/{event_id}/run-of-show/
-- event-assets/{workspace_id}/{event_id}/cue-sheets/
-- event-assets/{workspace_id}/{event_id}/stage-plots/
-- technical-drawings/{workspace_id}/{location_id}/floor-plans/
-- technical-drawings/{workspace_id}/{location_id}/site-maps/
-- technical-drawings/{workspace_id}/{location_id}/cad/
-- contracts/{workspace_id}/vendor/
-- contracts/{workspace_id}/client/
-- contracts/{workspace_id}/employment/
-- reports/{workspace_id}/financial/
-- reports/{workspace_id}/analytics/
-- reports/{workspace_id}/compliance/
-- receipts/{workspace_id}/{expense_report_id}/
-- inventory-photos/{workspace_id}/{inventory_item_id}/photo-{index}.jpg
-- inventory-photos/{workspace_id}/{inventory_item_id}/barcode-label.png
-- inventory-photos/{workspace_id}/{inventory_item_id}/condition-{timestamp}.jpg


