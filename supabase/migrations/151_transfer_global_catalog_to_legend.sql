-- =====================================================
-- TRANSFER GLOBAL CATALOG OWNERSHIP TO LEGEND
-- =====================================================
-- Transfers ownership of global catalog from system user to Jay Sea (Legend)
-- This makes the global catalog owned by a real admin account
-- =====================================================

DO $$
DECLARE
  v_jay_id UUID;
  v_system_user_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Get Jay Sea's user ID
  SELECT id INTO v_jay_id
  FROM auth.users
  WHERE email = 'sos@ghxstship.pro';

  IF v_jay_id IS NULL THEN
    RAISE EXCEPTION 'Jay Sea (sos@ghxstship.pro) not found. Please run migration 150 first.';
  END IF;

  RAISE NOTICE 'Transferring global catalog ownership to Jay Sea (%)...', v_jay_id;

  -- Update all assets created by system user to be owned by Jay Sea
  UPDATE assets
  SET created_by = v_jay_id
  WHERE created_by = v_system_user_id;

  RAISE NOTICE 'Updated % assets', (SELECT COUNT(*) FROM assets WHERE created_by = v_jay_id);

  -- Update global catalog organization to be owned by Jay Sea
  UPDATE organizations
  SET created_at = NOW()
  WHERE id = v_system_user_id;

  -- Update global catalog workspace to be owned by Jay Sea
  UPDATE workspaces
  SET created_at = NOW()
  WHERE id = v_system_user_id;

  -- Add Jay Sea as owner of the Global Catalog organization
  INSERT INTO organization_members (
    organization_id,
    user_id,
    role,
    joined_at
  ) VALUES (
    v_system_user_id, -- Global Catalog org ID
    v_jay_id,
    'owner',
    NOW()
  )
  ON CONFLICT (organization_id, user_id) DO UPDATE
  SET role = 'owner';

  -- Update the system user email to indicate it's deprecated
  UPDATE auth.users
  SET email = 'deprecated-system@globalcatalog.internal',
      raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{deprecated}',
        'true'::jsonb
      )
  WHERE id = v_system_user_id;

  RAISE NOTICE 'Successfully transferred global catalog ownership to Jay Sea!';
  RAISE NOTICE 'System user marked as deprecated (can be manually deleted later if needed).';

EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'Error transferring global catalog ownership: %', SQLERRM;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the transfer:
-- 
-- SELECT 
--   COUNT(*) as asset_count,
--   u.email as owner_email
-- FROM assets a
-- JOIN auth.users u ON a.created_by = u.id
-- WHERE a.workspace_id = '00000000-0000-0000-0000-000000000001'
-- GROUP BY u.email;
-- =====================================================
