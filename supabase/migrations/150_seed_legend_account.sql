-- =====================================================
-- SEED LEGEND ACCOUNTS - Julian Clarkson & Jay Sea
-- =====================================================
-- Seeds two Legend (Platform Super Admin) accounts:
-- 1. Julian Clarkson (julian.clarkson@ghxstship.pro)
-- 2. Jay Sea (sos@ghxstship.pro)
--
-- This migration creates the users if they don't exist and assigns Legend roles
-- =====================================================

-- Create users using DO block to handle existence check
DO $$
BEGIN
  -- Create Julian Clarkson if doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'julian.clarkson@ghxstship.pro') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token, aud, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'julian.clarkson@ghxstship.pro',
      crypt('ChangeMe123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Julian Clarkson"}',
      NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
    );
    RAISE NOTICE 'Created user: Julian Clarkson (julian.clarkson@ghxstship.pro)';
    RAISE NOTICE 'Temporary password: ChangeMe123! - CHANGE IMMEDIATELY';
  ELSE
    RAISE NOTICE 'User already exists: julian.clarkson@ghxstship.pro';
  END IF;

  -- Create Jay Sea if doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'sos@ghxstship.pro') THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token, aud, role
    ) VALUES (
      gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
      'sos@ghxstship.pro',
      crypt('ChangeMe123!', gen_salt('bf')),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"full_name":"Jay Sea"}',
      NOW(), NOW(), '', '', '', '', 'authenticated', 'authenticated'
    );
    RAISE NOTICE 'Created user: Jay Sea (sos@ghxstship.pro)';
    RAISE NOTICE 'Temporary password: ChangeMe123! - CHANGE IMMEDIATELY';
  ELSE
    RAISE NOTICE 'User already exists: sos@ghxstship.pro';
  END IF;
END $$;

-- Now assign Legend roles
DO $$
DECLARE
  v_julian_id UUID;
  v_jay_id UUID;
  v_legend_role_id UUID;
  v_workspace_id UUID;
  v_org_id UUID;
BEGIN
  -- Get the user IDs
  SELECT id INTO v_julian_id FROM auth.users WHERE email = 'julian.clarkson@ghxstship.pro';
  SELECT id INTO v_jay_id FROM auth.users WHERE email = 'sos@ghxstship.pro';

  -- Check if users exist (they should now)
  IF v_julian_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create/find Julian Clarkson user';
  END IF;

  IF v_jay_id IS NULL THEN
    RAISE EXCEPTION 'Failed to create/find Jay Sea user';
  END IF;

  -- Get the Legend role ID
  SELECT id INTO v_legend_role_id
  FROM roles
  WHERE slug = 'legend';

  -- If Legend role doesn't exist, raise an error
  IF v_legend_role_id IS NULL THEN
    RAISE EXCEPTION 'Legend role not found. Please ensure migration 008 has been applied.';
  END IF;

  -- Get or create a default workspace for platform-level access
  -- Legend operates at platform level, but we need a workspace_id for the table structure
  SELECT id INTO v_workspace_id
  FROM workspaces
  LIMIT 1;

  -- Get or create a default organization
  SELECT id INTO v_org_id
  FROM organizations
  LIMIT 1;

  -- Remove any existing Legend role assignments (clean slate)
  DELETE FROM user_role_assignments
  WHERE role_id = v_legend_role_id;

  -- Assign Legend role to Julian Clarkson
  INSERT INTO user_role_assignments (
    user_id,
    role_id,
    workspace_id,
    organization_id,
    is_active,
    valid_from,
    valid_until,
    assigned_by,
    notes
  ) VALUES (
    v_julian_id,
    v_legend_role_id,
    v_workspace_id,
    v_org_id,
    true,
    NOW(),
    NULL, -- No expiration for Legend
    v_julian_id, -- Self-assigned
    'Platform Super Admin - Julian Clarkson - Seeded during initial setup'
  );

  -- Assign Legend role to Jay Sea
  INSERT INTO user_role_assignments (
    user_id,
    role_id,
    workspace_id,
    organization_id,
    is_active,
    valid_from,
    valid_until,
    assigned_by,
    notes
  ) VALUES (
    v_jay_id,
    v_legend_role_id,
    v_workspace_id,
    v_org_id,
    true,
    NOW(),
    NULL, -- No expiration for Legend
    v_julian_id, -- Assigned by Julian
    'Platform Super Admin - Jay Sea - Seeded during initial setup'
  );

  RAISE NOTICE 'Successfully assigned Legend role to Julian Clarkson (%)!', v_julian_id;
  RAISE NOTICE 'Successfully assigned Legend role to Jay Sea (%)!', v_jay_id;
  RAISE NOTICE 'Both accounts are now Legends (Platform Super Admins) in the system.';

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error seeding Legend accounts: %', SQLERRM;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the Legend assignment:
-- 
-- SELECT 
--   u.email,
--   r.name as role,
--   r.level,
--   ura.is_active,
--   ura.assigned_at,
--   ura.notes
-- FROM user_role_assignments ura
-- JOIN auth.users u ON ura.user_id = u.id
-- JOIN roles r ON ura.role_id = r.id
-- WHERE r.slug = 'legend';
-- =====================================================
