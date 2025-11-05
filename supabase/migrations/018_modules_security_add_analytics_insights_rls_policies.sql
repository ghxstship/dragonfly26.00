-- =============================================
-- ANALYTICS & INSIGHTS MODULES RLS POLICIES
-- =============================================
-- Migration: 20251014020000_add_analytics_insights_rls_policies.sql
-- Purpose: Add missing RLS policies for Analytics and Insights module tables
-- Issue: RLS was enabled but no policies were created, causing "Error Loading Data"
-- Tables: analytics_views, benchmarks, data_sources (shared with Reports),
--         objectives, key_results, strategic_priorities, strategic_reviews,
--         ai_recommendations, intelligence_feed
-- =============================================

-- =============================================
-- ANALYTICS_VIEWS POLICIES
-- =============================================

-- SELECT: Users can view analytics views in their workspace

DROP POLICY IF EXISTS "Users can view analytics views in their workspace" ON analytics_views;
CREATE POLICY "Users can view analytics views in their workspace"
    ON analytics_views FOR SELECT
    USING (
        is_public = true OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create analytics views in their workspace

DROP POLICY IF EXISTS "Users can create analytics views in their workspace" ON analytics_views;
CREATE POLICY "Users can create analytics views in their workspace"
    ON analytics_views FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update analytics views they created or in their workspace

DROP POLICY IF EXISTS "Users can update analytics views in their workspace" ON analytics_views;
CREATE POLICY "Users can update analytics views in their workspace"
    ON analytics_views FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete analytics views they created

DROP POLICY IF EXISTS "Users can delete analytics views in their workspace" ON analytics_views;
CREATE POLICY "Users can delete analytics views in their workspace"
    ON analytics_views FOR DELETE
    USING (
        created_by = auth.uid() OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- BENCHMARKS POLICIES
-- =============================================

-- SELECT: Users can view benchmarks in their workspace or global benchmarks

DROP POLICY IF EXISTS "Users can view benchmarks in their workspace" ON benchmarks;
CREATE POLICY "Users can view benchmarks in their workspace"
    ON benchmarks FOR SELECT
    USING (
        workspace_id IS NULL OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create benchmarks in their workspace

DROP POLICY IF EXISTS "Users can create benchmarks in their workspace" ON benchmarks;
CREATE POLICY "Users can create benchmarks in their workspace"
    ON benchmarks FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update benchmarks in their workspace

DROP POLICY IF EXISTS "Users can update benchmarks in their workspace" ON benchmarks;
CREATE POLICY "Users can update benchmarks in their workspace"
    ON benchmarks FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete benchmarks in their workspace

DROP POLICY IF EXISTS "Users can delete benchmarks in their workspace" ON benchmarks;
CREATE POLICY "Users can delete benchmarks in their workspace"
    ON benchmarks FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- OBJECTIVES POLICIES (OKRs)
-- =============================================

-- SELECT: Users can view objectives in their workspace

DROP POLICY IF EXISTS "Users can view objectives in their workspace" ON objectives;
CREATE POLICY "Users can view objectives in their workspace"
    ON objectives FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create objectives in their workspace

DROP POLICY IF EXISTS "Users can create objectives in their workspace" ON objectives;
CREATE POLICY "Users can create objectives in their workspace"
    ON objectives FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update objectives in their workspace

DROP POLICY IF EXISTS "Users can update objectives in their workspace" ON objectives;
CREATE POLICY "Users can update objectives in their workspace"
    ON objectives FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete objectives they own or if they're admin

DROP POLICY IF EXISTS "Users can delete objectives in their workspace" ON objectives;
CREATE POLICY "Users can delete objectives in their workspace"
    ON objectives FOR DELETE
    USING (
        owner_id = auth.uid() OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- KEY_RESULTS POLICIES
-- =============================================

-- SELECT: Users can view key results in their workspace

DROP POLICY IF EXISTS "Users can view key results in their workspace" ON key_results;
CREATE POLICY "Users can view key results in their workspace"
    ON key_results FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create key results in their workspace

DROP POLICY IF EXISTS "Users can create key results in their workspace" ON key_results;
CREATE POLICY "Users can create key results in their workspace"
    ON key_results FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update key results they own or in their workspace

DROP POLICY IF EXISTS "Users can update key results in their workspace" ON key_results;
CREATE POLICY "Users can update key results in their workspace"
    ON key_results FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Users can delete key results they own or if they're admin

DROP POLICY IF EXISTS "Users can delete key results in their workspace" ON key_results;
CREATE POLICY "Users can delete key results in their workspace"
    ON key_results FOR DELETE
    USING (
        owner_id = auth.uid() OR
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- STRATEGIC_PRIORITIES POLICIES
-- =============================================

-- SELECT: Users can view strategic priorities in their workspace

DROP POLICY IF EXISTS "Users can view strategic priorities in their workspace" ON strategic_priorities;
CREATE POLICY "Users can view strategic priorities in their workspace"
    ON strategic_priorities FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create strategic priorities in their workspace

DROP POLICY IF EXISTS "Users can create strategic priorities in their workspace" ON strategic_priorities;
CREATE POLICY "Users can create strategic priorities in their workspace"
    ON strategic_priorities FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update strategic priorities in their workspace

DROP POLICY IF EXISTS "Users can update strategic priorities in their workspace" ON strategic_priorities;
CREATE POLICY "Users can update strategic priorities in their workspace"
    ON strategic_priorities FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Admins can delete strategic priorities in their workspace

DROP POLICY IF EXISTS "Admins can delete strategic priorities in their workspace" ON strategic_priorities;
CREATE POLICY "Admins can delete strategic priorities in their workspace"
    ON strategic_priorities FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- STRATEGIC_REVIEWS POLICIES
-- =============================================

-- SELECT: Users can view strategic reviews in their workspace

DROP POLICY IF EXISTS "Users can view strategic reviews in their workspace" ON strategic_reviews;
CREATE POLICY "Users can view strategic reviews in their workspace"
    ON strategic_reviews FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: Users can create strategic reviews in their workspace

DROP POLICY IF EXISTS "Users can create strategic reviews in their workspace" ON strategic_reviews;
CREATE POLICY "Users can create strategic reviews in their workspace"
    ON strategic_reviews FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update strategic reviews in their workspace

DROP POLICY IF EXISTS "Users can update strategic reviews in their workspace" ON strategic_reviews;
CREATE POLICY "Users can update strategic reviews in their workspace"
    ON strategic_reviews FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Admins can delete strategic reviews in their workspace

DROP POLICY IF EXISTS "Admins can delete strategic reviews in their workspace" ON strategic_reviews;
CREATE POLICY "Admins can delete strategic reviews in their workspace"
    ON strategic_reviews FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- AI_RECOMMENDATIONS POLICIES
-- =============================================

-- SELECT: Users can view AI recommendations in their workspace

DROP POLICY IF EXISTS "Users can view ai recommendations in their workspace" ON ai_recommendations;
CREATE POLICY "Users can view ai recommendations in their workspace"
    ON ai_recommendations FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: System can create AI recommendations

DROP POLICY IF EXISTS "System can create ai recommendations" ON ai_recommendations;
CREATE POLICY "System can create ai recommendations"
    ON ai_recommendations FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update AI recommendations (review status)

DROP POLICY IF EXISTS "Users can update ai recommendations in their workspace" ON ai_recommendations;
CREATE POLICY "Users can update ai recommendations in their workspace"
    ON ai_recommendations FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Admins can delete AI recommendations

DROP POLICY IF EXISTS "Admins can delete ai recommendations in their workspace" ON ai_recommendations;
CREATE POLICY "Admins can delete ai recommendations in their workspace"
    ON ai_recommendations FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- INTELLIGENCE_FEED POLICIES
-- =============================================

-- SELECT: Users can view intelligence feed in their workspace

DROP POLICY IF EXISTS "Users can view intelligence feed in their workspace" ON intelligence_feed;
CREATE POLICY "Users can view intelligence feed in their workspace"
    ON intelligence_feed FOR SELECT
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- INSERT: System can create intelligence feed items

DROP POLICY IF EXISTS "System can create intelligence feed items" ON intelligence_feed;
CREATE POLICY "System can create intelligence feed items"
    ON intelligence_feed FOR INSERT
    WITH CHECK (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- UPDATE: Users can update intelligence feed items (mark as read)

DROP POLICY IF EXISTS "Users can update intelligence feed in their workspace" ON intelligence_feed;
CREATE POLICY "Users can update intelligence feed in their workspace"
    ON intelligence_feed FOR UPDATE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
        )
    );

-- DELETE: Admins can delete intelligence feed items

DROP POLICY IF EXISTS "Admins can delete intelligence feed in their workspace" ON intelligence_feed;
CREATE POLICY "Admins can delete intelligence feed in their workspace"
    ON intelligence_feed FOR DELETE
    USING (
        workspace_id IN (
            SELECT workspace_id FROM workspace_members
            WHERE user_id = (SELECT auth.uid())
            AND role IN ('owner', 'admin')
        )
    );

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify policies were created successfully
-- Run: SELECT tablename, policyname, cmd FROM pg_policies WHERE tablename IN (
--   'analytics_views', 'benchmarks', 'objectives', 'key_results', 
--   'strategic_priorities', 'strategic_reviews', 'ai_recommendations', 'intelligence_feed'
-- ) ORDER BY tablename, cmd;
-- Expected: 32 policies total (4 per table × 8 tables)
