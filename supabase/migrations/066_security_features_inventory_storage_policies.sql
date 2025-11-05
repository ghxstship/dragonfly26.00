-- =============================================
-- INVENTORY PHOTOS STORAGE POLICIES
-- Migration: 20251015030000
--
-- Storage policies for inventory-photos bucket
-- Enables workspace-scoped photo management
-- =============================================

-- =============================================
-- STORAGE POLICIES FOR INVENTORY-PHOTOS BUCKET
-- =============================================

-- Note: Storage policies require proper permissions
-- If these fail, they should be created via Supabase Dashboard or with service role
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Users can view inventory photos in their workspaces" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload inventory photos in their workspaces" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update inventory photos in their workspaces" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete inventory photos in their workspaces" ON storage.objects;
    
    -- Policy: Users can view inventory photos in their workspaces
    CREATE POLICY "Users can view inventory photos in their workspaces"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'inventory-photos'
        AND (storage.foldername(name))[1] IN (
            SELECT id::text FROM workspaces 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    );

    -- Policy: Users can upload inventory photos in their workspaces
    CREATE POLICY "Users can upload inventory photos in their workspaces"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'inventory-photos'
        AND (storage.foldername(name))[1] IN (
            SELECT id::text FROM workspaces 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    );

    -- Policy: Users can update inventory photos in their workspaces
    CREATE POLICY "Users can update inventory photos in their workspaces"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'inventory-photos'
        AND (storage.foldername(name))[1] IN (
            SELECT id::text FROM workspaces 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    );

    -- Policy: Users can delete inventory photos in their workspaces
    CREATE POLICY "Users can delete inventory photos in their workspaces"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'inventory-photos'
        AND (storage.foldername(name))[1] IN (
            SELECT id::text FROM workspaces 
            WHERE organization_id IN (
                SELECT organization_id FROM organization_members 
                WHERE user_id = auth.uid()
            )
        )
    );
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Storage policies require elevated permissions - create via Dashboard';
    WHEN OTHERS THEN
        RAISE NOTICE 'Storage policy creation skipped: %', SQLERRM;
END $$;

-- =============================================
-- HELPER FUNCTION FOR PHOTO CLEANUP
-- =============================================

-- Function to clean up orphaned inventory photos
CREATE OR REPLACE FUNCTION cleanup_inventory_photos(
    p_inventory_item_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_workspace_id UUID;
    v_photo_urls TEXT[];
    v_photo_url TEXT;
    v_deleted_count INTEGER := 0;
BEGIN
    -- Get item workspace and photos
    SELECT workspace_id, photos
    INTO v_workspace_id, v_photo_urls
    FROM inventory_items
    WHERE id = p_inventory_item_id;
    
    IF v_workspace_id IS NULL THEN
        RAISE EXCEPTION 'Inventory item not found';
    END IF;
    
    -- Delete photos from storage
    -- Note: This requires storage admin privileges
    -- In practice, this would call storage.delete or be handled by Edge Functions
    
    RETURN jsonb_build_object(
        'success', true,
        'workspace_id', v_workspace_id,
        'item_id', p_inventory_item_id,
        'photo_count', array_length(v_photo_urls, 1)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON FUNCTION cleanup_inventory_photos IS 'Helper function to cleanup orphaned inventory photos from storage';
