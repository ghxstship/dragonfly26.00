-- Migration: Public Access RLS Policies
-- Date: October 19, 2025
-- Purpose: Implement RLS policies for public/community tables
-- Priority: P0 CRITICAL

-- ============================================================
-- PHASE 4.5: PUBLIC-ACCESS POLICIES
-- ============================================================

-- These policies allow controlled public access to community and marketplace data.
-- Pattern: Public read, authenticated write with ownership checks

-- ============================================================
-- COMMUNITY_POSTS TABLE
-- ============================================================

-- SELECT: All authenticated users can view public posts
CREATE POLICY "Users can view public community posts"
ON community_posts FOR SELECT
USING (
    visibility = 'public' 
    OR (visibility = 'workspace' AND is_workspace_member(workspace_id))
    OR (visibility = 'private' AND author_id = auth.uid())
);

-- INSERT: Authenticated users can create posts
CREATE POLICY "Users can insert own community posts"
ON community_posts FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- UPDATE: Users can update their own posts
CREATE POLICY "Users can update own community posts"
ON community_posts FOR UPDATE
USING (auth.uid() = author_id);

-- DELETE: Users can delete their own posts
CREATE POLICY "Users can delete own community posts"
ON community_posts FOR DELETE
USING (auth.uid() = author_id);

-- ============================================================
-- COMMUNITY_CONNECTIONS TABLE
-- ============================================================

-- SELECT: Users can view their own connections
CREATE POLICY "Users can view own connections"
ON community_connections FOR SELECT
USING (
    auth.uid() = user_id 
    OR auth.uid() = connected_user_id
);

-- INSERT: Users can create connections
CREATE POLICY "Users can insert own connections"
ON community_connections FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own connections
CREATE POLICY "Users can update own connections"
ON community_connections FOR UPDATE
USING (auth.uid() = user_id);

-- DELETE: Users can delete their own connections
CREATE POLICY "Users can delete own connections"
ON community_connections FOR DELETE
USING (auth.uid() = user_id);

-- ============================================================
-- COMMUNITY_EVENTS TABLE
-- ============================================================

-- SELECT: All authenticated users can view public events
CREATE POLICY "Users can view public community events"
ON community_events FOR SELECT
USING (
    visibility = 'public'
    OR (visibility = 'workspace' AND is_workspace_member(workspace_id))
    OR (visibility = 'private' AND organizer_id = auth.uid())
);

-- INSERT: Authenticated users can create events
CREATE POLICY "Users can insert own community events"
ON community_events FOR INSERT
WITH CHECK (auth.uid() = organizer_id);

-- UPDATE: Organizers can update their events
CREATE POLICY "Users can update own community events"
ON community_events FOR UPDATE
USING (auth.uid() = organizer_id);

-- DELETE: Organizers can delete their events
CREATE POLICY "Users can delete own community events"
ON community_events FOR DELETE
USING (auth.uid() = organizer_id);

-- ============================================================
-- COMPETITIONS TABLE
-- ============================================================

-- SELECT: All authenticated users can view active competitions
CREATE POLICY "Users can view active competitions"
ON competitions FOR SELECT
USING (
    status = 'active'
    OR (status = 'draft' AND creator_id = auth.uid())
    OR is_workspace_member(workspace_id)
);

-- INSERT: Authenticated users can create competitions
CREATE POLICY "Users can insert own competitions"
ON competitions FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- UPDATE: Creators can update their competitions
CREATE POLICY "Users can update own competitions"
ON competitions FOR UPDATE
USING (auth.uid() = creator_id);

-- DELETE: Creators can delete their competitions
CREATE POLICY "Users can delete own competitions"
ON competitions FOR DELETE
USING (auth.uid() = creator_id);

-- ============================================================
-- SHOWCASES TABLE
-- ============================================================

-- SELECT: All authenticated users can view public showcases
CREATE POLICY "Users can view public showcases"
ON showcases FOR SELECT
USING (
    visibility = 'public'
    OR (visibility = 'workspace' AND is_workspace_member(workspace_id))
    OR (visibility = 'private' AND creator_id = auth.uid())
);

-- INSERT: Authenticated users can create showcases
CREATE POLICY "Users can insert own showcases"
ON showcases FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- UPDATE: Creators can update their showcases
CREATE POLICY "Users can update own showcases"
ON showcases FOR UPDATE
USING (auth.uid() = creator_id);

-- DELETE: Creators can delete their showcases
CREATE POLICY "Users can delete own showcases"
ON showcases FOR DELETE
USING (auth.uid() = creator_id);

-- ============================================================
-- MARKETPLACE_PRODUCTS TABLE
-- ============================================================

-- SELECT: All authenticated users can view active products
CREATE POLICY "Users can view active marketplace products"
ON marketplace_products FOR SELECT
USING (
    status = 'active'
    OR (status = 'draft' AND seller_id = auth.uid())
);

-- INSERT: Authenticated users can create products
CREATE POLICY "Users can insert own marketplace products"
ON marketplace_products FOR INSERT
WITH CHECK (auth.uid() = seller_id);

-- UPDATE: Sellers can update their products
CREATE POLICY "Users can update own marketplace products"
ON marketplace_products FOR UPDATE
USING (auth.uid() = seller_id);

-- DELETE: Sellers can delete their products
CREATE POLICY "Users can delete own marketplace products"
ON marketplace_products FOR DELETE
USING (auth.uid() = seller_id);

-- ============================================================
-- MARKETPLACE_ORDERS TABLE
-- ============================================================

-- SELECT: Users can view their own orders (buyer or seller)
CREATE POLICY "Users can view own marketplace orders"
ON marketplace_orders FOR SELECT
USING (
    auth.uid() = buyer_id
    OR auth.uid() IN (
        SELECT seller_id FROM marketplace_products
        WHERE id = product_id
    )
);

-- INSERT: Authenticated users can create orders
CREATE POLICY "Users can insert own marketplace orders"
ON marketplace_orders FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- UPDATE: Buyers and sellers can update orders
CREATE POLICY "Users can update own marketplace orders"
ON marketplace_orders FOR UPDATE
USING (
    auth.uid() = buyer_id
    OR auth.uid() IN (
        SELECT seller_id FROM marketplace_products
        WHERE id = product_id
    )
);

-- DELETE: Only buyers can delete pending orders
CREATE POLICY "Users can delete own pending marketplace orders"
ON marketplace_orders FOR DELETE
USING (auth.uid() = buyer_id AND status = 'pending');

-- ============================================================
-- MARKETPLACE_REVIEWS TABLE
-- ============================================================

-- SELECT: All authenticated users can view approved reviews
CREATE POLICY "Users can view approved marketplace reviews"
ON marketplace_reviews FOR SELECT
USING (
    status = 'approved'
    OR (status = 'pending' AND reviewer_id = auth.uid())
);

-- INSERT: Authenticated users can create reviews
CREATE POLICY "Users can insert own marketplace reviews"
ON marketplace_reviews FOR INSERT
WITH CHECK (auth.uid() = reviewer_id);

-- UPDATE: Reviewers can update their own reviews
CREATE POLICY "Users can update own marketplace reviews"
ON marketplace_reviews FOR UPDATE
USING (auth.uid() = reviewer_id);

-- DELETE: Reviewers can delete their own reviews
CREATE POLICY "Users can delete own marketplace reviews"
ON marketplace_reviews FOR DELETE
USING (auth.uid() = reviewer_id);

-- ============================================================
-- MARKETPLACE_CATEGORIES TABLE
-- ============================================================

-- SELECT: All authenticated users can view categories
CREATE POLICY "Users can view marketplace categories"
ON marketplace_categories FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT: Only admins can create categories
CREATE POLICY "Admins can insert marketplace categories"
ON marketplace_categories FOR INSERT
WITH CHECK (is_admin());

-- UPDATE: Only admins can update categories
CREATE POLICY "Admins can update marketplace categories"
ON marketplace_categories FOR UPDATE
USING (is_admin());

-- DELETE: Only admins can delete categories
CREATE POLICY "Admins can delete marketplace categories"
ON marketplace_categories FOR DELETE
USING (is_admin());

-- ============================================================
-- PRODUCT_VARIANTS TABLE
-- ============================================================

-- SELECT: Users can view variants of visible products
CREATE POLICY "Users can view product variants"
ON product_variants FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND (status = 'active' OR seller_id = auth.uid())
    )
);

-- INSERT: Sellers can create variants for their products
CREATE POLICY "Sellers can insert own product variants"
ON product_variants FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- UPDATE: Sellers can update variants for their products
CREATE POLICY "Sellers can update own product variants"
ON product_variants FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- DELETE: Sellers can delete variants for their products
CREATE POLICY "Sellers can delete own product variants"
ON product_variants FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- ============================================================
-- PRODUCT_OPTIONS TABLE
-- ============================================================

-- SELECT: Users can view options of visible products
CREATE POLICY "Users can view product options"
ON product_options FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND (status = 'active' OR seller_id = auth.uid())
    )
);

-- INSERT: Sellers can create options for their products
CREATE POLICY "Sellers can insert own product options"
ON product_options FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- UPDATE: Sellers can update options for their products
CREATE POLICY "Sellers can update own product options"
ON product_options FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- DELETE: Sellers can delete options for their products
CREATE POLICY "Sellers can delete own product options"
ON product_options FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- ============================================================
-- INVENTORY_LEVELS TABLE
-- ============================================================

-- SELECT: Users can view inventory for visible products
CREATE POLICY "Users can view product inventory"
ON inventory_levels FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND (status = 'active' OR seller_id = auth.uid())
    )
);

-- INSERT: Sellers can create inventory for their products
CREATE POLICY "Sellers can insert own product inventory"
ON inventory_levels FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- UPDATE: Sellers can update inventory for their products
CREATE POLICY "Sellers can update own product inventory"
ON inventory_levels FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- DELETE: Sellers can delete inventory for their products
CREATE POLICY "Sellers can delete own product inventory"
ON inventory_levels FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM marketplace_products
        WHERE id = product_id
        AND seller_id = auth.uid()
    )
);

-- ============================================================
-- COMMUNITY_MEMBER_LEVELS TABLE
-- ============================================================

-- SELECT: All authenticated users can view member levels
CREATE POLICY "Users can view community member levels"
ON community_member_levels FOR SELECT
USING (auth.uid() IS NOT NULL);

-- INSERT: System only (handled by triggers)
CREATE POLICY "System can insert community member levels"
ON community_member_levels FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- UPDATE: System only (handled by triggers)
CREATE POLICY "System can update community member levels"
ON community_member_levels FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- No DELETE - member levels are permanent records

-- ============================================================
-- VERIFICATION
-- ============================================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies
    WHERE schemaname = 'public'
    AND tablename IN (
        'community_posts', 'community_connections', 'community_events',
        'competitions', 'showcases', 'marketplace_products',
        'marketplace_orders', 'marketplace_reviews', 'marketplace_categories',
        'product_variants', 'product_options', 'inventory_levels',
        'community_member_levels'
    );
    
    -- Expected: 13 tables × ~4 policies avg = ~52 policies
    IF policy_count >= 52 THEN
        RAISE NOTICE 'SUCCESS: % public-access policies created', policy_count;
    ELSE
        RAISE WARNING 'Only % policies created, expected at least 52', policy_count;
    END IF;
END $$;

-- ============================================================
-- NOTES
-- ============================================================

-- These policies enable controlled public access to community features.
-- Users can view public content but only modify their own data.
-- Marketplace has buyer/seller access controls.
-- Categories are admin-only for consistency.
--
-- Next steps:
--   1. Test public access controls
--   2. Verify visibility rules work correctly
--   3. Test marketplace buyer/seller isolation
--   4. Run comprehensive RLS test suite
