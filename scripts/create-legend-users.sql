-- =====================================================
-- CREATE LEGEND USER ACCOUNTS
-- =====================================================
-- Creates two user accounts in auth.users and assigns Legend roles
-- =====================================================

-- Insert Julian Clarkson
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'julian.clarkson@ghxstship.pro',
  crypt('ChangeMe123!', gen_salt('bf')), -- Temporary password - CHANGE THIS
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Julian Clarkson"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Insert Jay Sea
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token,
  aud,
  role
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'sos@ghxstship.pro',
  crypt('ChangeMe123!', gen_salt('bf')), -- Temporary password - CHANGE THIS
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Jay Sea"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  '',
  'authenticated',
  'authenticated'
)
ON CONFLICT (email) DO NOTHING;

-- Now run the Legend assignment from migration 150
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

  IF v_julian_id IS NULL THEN
    RAISE EXCEPTION 'Julian Clarkson user not found';
  END IF;

  IF v_jay_id IS NULL THEN
    RAISE EXCEPTION 'Jay Sea user not found';
  END IF;

  -- Get the Legend role ID
  SELECT id INTO v_legend_role_id FROM roles WHERE slug = 'legend';

  IF v_legend_role_id IS NULL THEN
    RAISE EXCEPTION 'Legend role not found';
  END IF;

  -- Get or create a default workspace
  SELECT id INTO v_workspace_id FROM workspaces LIMIT 1;
  
  -- Get or create a default organization
  SELECT id INTO v_org_id FROM organizations LIMIT 1;

  -- Remove any existing Legend role assignments
  DELETE FROM user_role_assignments WHERE role_id = v_legend_role_id;

  -- Assign Legend role to Julian Clarkson
  INSERT INTO user_role_assignments (
    user_id, role_id, workspace_id, organization_id,
    is_active, valid_from, valid_until, assigned_by, notes
  ) VALUES (
    v_julian_id, v_legend_role_id, v_workspace_id, v_org_id,
    true, NOW(), NULL, v_julian_id,
    'Platform Super Admin - Julian Clarkson - Seeded during initial setup'
  );

  -- Assign Legend role to Jay Sea
  INSERT INTO user_role_assignments (
    user_id, role_id, workspace_id, organization_id,
    is_active, valid_from, valid_until, assigned_by, notes
  ) VALUES (
    v_jay_id, v_legend_role_id, v_workspace_id, v_org_id,
    true, NOW(), NULL, v_julian_id,
    'Platform Super Admin - Jay Sea - Seeded during initial setup'
  );

  RAISE NOTICE 'Successfully created and assigned Legend roles!';
  RAISE NOTICE 'Julian Clarkson: %', v_julian_id;
  RAISE NOTICE 'Jay Sea: %', v_jay_id;
  RAISE NOTICE 'IMPORTANT: Both accounts have temporary password: ChangeMe123!';
  RAISE NOTICE 'Please change passwords immediately after first login.';

END $$;
