-- =====================================================
-- RLS LINTER REMEDIATION - COMPLETE FIX
-- =====================================================
-- Fixes all Supabase linter warnings:
-- 1. Auth RLS InitPlan: Wraps auth.uid() in SELECT subqueries (31 policies)
-- 2. Multiple Permissive Policies: Consolidates duplicate policies (7 tables)
-- =====================================================

-- Helper function to check if table and column exist
CREATE OR REPLACE FUNCTION table_has_column(p_table_name text, p_column_name text)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = p_table_name 
        AND column_name = p_column_name
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 1: FIX AUTH RLS INITPLAN WARNINGS (31 POLICIES)
-- =====================================================

-- 1. user_roles: System can assign roles during onboarding
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        DROP POLICY IF EXISTS "System can assign roles during onboarding" ON user_roles;
        CREATE POLICY "System can assign roles during onboarding"
            ON user_roles FOR INSERT
            TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid())
                OR organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- 2. comments: Users can create comments in their workspaces
DO $$
BEGIN
    IF table_has_column('comments', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create comments in their workspaces" ON comments;
        CREATE POLICY "Users can create comments in their workspaces"
            ON comments FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 3. marketplace_products: Users can create products in their workspace
DO $$
BEGIN
    IF table_has_column('marketplace_products', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create products in their workspace" ON marketplace_products;
        CREATE POLICY "Users can create products in their workspace"
            ON marketplace_products FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 4. job_contracts: Users can create job contracts in their workspace
DO $$
BEGIN
    IF table_has_column('job_contracts', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create job contracts in their workspace" ON job_contracts;
        CREATE POLICY "Users can create job contracts in their workspace"
            ON job_contracts FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 5. rfps: Users can create rfps in their workspace
DO $$
BEGIN
    IF table_has_column('rfps', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create rfps in their workspace" ON rfps;
        CREATE POLICY "Users can create rfps in their workspace"
            ON rfps FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 6. report_templates: Users can create report templates in their workspace
DO $$
BEGIN
    IF table_has_column('report_templates', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create report templates in their workspace" ON report_templates;
        CREATE POLICY "Users can create report templates in their workspace"
            ON report_templates FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 7. custom_metrics: Users can create custom metrics in their workspace
DO $$
BEGIN
    IF table_has_column('custom_metrics', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create custom metrics in their workspace" ON custom_metrics;
        CREATE POLICY "Users can create custom metrics in their workspace"
            ON custom_metrics FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 8. resources: Users can create resources in their workspace
DO $$
BEGIN
    IF table_has_column('resources', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create resources in their workspace" ON resources;
        CREATE POLICY "Users can create resources in their workspace"
            ON resources FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 9. courses: Users can create courses in their workspace
DO $$
BEGIN
    IF table_has_column('courses', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create courses in their workspace" ON courses;
        CREATE POLICY "Users can create courses in their workspace"
            ON courses FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 10. grants: Users can create grants in their workspace
DO $$
BEGIN
    IF table_has_column('grants', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create grants in their workspace" ON grants;
        CREATE POLICY "Users can create grants in their workspace"
            ON grants FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 11. data_sources: Admins can delete data sources in their workspace
DO $$
BEGIN
    IF table_has_column('data_sources', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Admins can delete data sources in their workspace" ON data_sources;
        CREATE POLICY "Admins can delete data sources in their workspace"
            ON data_sources FOR DELETE
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT wm.workspace_id FROM workspace_members wm
                    JOIN user_roles ur ON ur.user_id = wm.user_id
                    JOIN roles r ON r.id = ur.role_id
                    WHERE wm.user_id = (SELECT auth.uid()) 
                    AND r.name IN ('admin', 'owner')
                )
            );
    END IF;
END $$;

-- 12. data_sources: Users can create data sources in their workspace
DO $$
BEGIN
    IF table_has_column('data_sources', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create data sources in their workspace" ON data_sources;
        CREATE POLICY "Users can create data sources in their workspace"
            ON data_sources FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 13. analytics_views: Users can create analytics views in their workspace
DO $$
BEGIN
    IF table_has_column('analytics_views', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create analytics views in their workspace" ON analytics_views;
        CREATE POLICY "Users can create analytics views in their workspace"
            ON analytics_views FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 14. benchmarks: Users can create benchmarks in their workspace
DO $$
BEGIN
    IF table_has_column('benchmarks', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create benchmarks in their workspace" ON benchmarks;
        CREATE POLICY "Users can create benchmarks in their workspace"
            ON benchmarks FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 15. objectives: Users can create objectives in their workspace
DO $$
BEGIN
    IF table_has_column('objectives', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create objectives in their workspace" ON objectives;
        CREATE POLICY "Users can create objectives in their workspace"
            ON objectives FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 16. key_results: Users can create key results in their workspace
DO $$
BEGIN
    IF table_has_column('key_results', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create key results in their workspace" ON key_results;
        CREATE POLICY "Users can create key results in their workspace"
            ON key_results FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 17. strategic_priorities: Users can create strategic priorities in their workspace
DO $$
BEGIN
    IF table_has_column('strategic_priorities', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create strategic priorities in their workspace" ON strategic_priorities;
        CREATE POLICY "Users can create strategic priorities in their workspace"
            ON strategic_priorities FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 18. strategic_reviews: Users can create strategic reviews in their workspace
DO $$
BEGIN
    IF table_has_column('strategic_reviews', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create strategic reviews in their workspace" ON strategic_reviews;
        CREATE POLICY "Users can create strategic reviews in their workspace"
            ON strategic_reviews FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 19. ai_recommendations: System can create ai recommendations
DO $$
BEGIN
    IF table_has_column('ai_recommendations', 'workspace_id') THEN
        DROP POLICY IF EXISTS "System can create ai recommendations" ON ai_recommendations;
        CREATE POLICY "System can create ai recommendations"
            ON ai_recommendations FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 20. intelligence_feed: System can create intelligence feed items
DO $$
BEGIN
    IF table_has_column('intelligence_feed', 'workspace_id') THEN
        DROP POLICY IF EXISTS "System can create intelligence feed items" ON intelligence_feed;
        CREATE POLICY "System can create intelligence feed items"
            ON intelligence_feed FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 21. profiles: Users can insert their own profile
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
        CREATE POLICY "Users can insert their own profile"
            ON profiles FOR INSERT
            TO authenticated
            WITH CHECK (id = (SELECT auth.uid()));
    END IF;
END $$;

-- 22. workspace_members: Users can join workspaces in their organizations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'workspace_members') THEN
        DROP POLICY IF EXISTS "Users can join workspaces in their organizations" ON workspace_members;
        CREATE POLICY "Users can join workspaces in their organizations"
            ON workspace_members FOR INSERT
            TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid())
                OR workspace_id IN (
                    SELECT w.id FROM workspaces w
                    JOIN organization_members om ON om.organization_id = w.organization_id
                    WHERE om.user_id = (SELECT auth.uid()) AND om.role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- 23. work_orders: Users can create work orders in their workspaces
DO $$
BEGIN
    IF table_has_column('work_orders', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create work orders in their workspaces" ON work_orders;
        CREATE POLICY "Users can create work orders in their workspaces"
            ON work_orders FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- 24. subscriptions: Organization owners can create initial subscriptions
DO $$
BEGIN
    IF table_has_column('subscriptions', 'organization_id') THEN
        DROP POLICY IF EXISTS "Organization owners can create initial subscriptions" ON subscriptions;
        CREATE POLICY "Organization owners can create initial subscriptions"
            ON subscriptions FOR INSERT
            TO authenticated
            WITH CHECK (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role = 'owner'
                )
            );
    END IF;
END $$;

-- 25. invitations: Users with permission can send invitations
DO $$
BEGIN
    IF table_has_column('invitations', 'organization_id') THEN
        DROP POLICY IF EXISTS "Users with permission can send invitations" ON invitations;
        CREATE POLICY "Users with permission can send invitations"
            ON invitations FOR INSERT
            TO authenticated
            WITH CHECK (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- 26. user_dashboard_widgets: Users can insert own widgets
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_dashboard_widgets') THEN
        DROP POLICY IF EXISTS "Users can insert own widgets" ON user_dashboard_widgets;
        CREATE POLICY "Users can insert own widgets"
            ON user_dashboard_widgets FOR INSERT
            TO authenticated
            WITH CHECK (user_id = (SELECT auth.uid()));
    END IF;
END $$;

-- 27. user_role_assignments: Users can be assigned roles in their organizations
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_role_assignments') THEN
        DROP POLICY IF EXISTS "Users can be assigned roles in their organizations" ON user_role_assignments;
        CREATE POLICY "Users can be assigned roles in their organizations"
            ON user_role_assignments FOR INSERT
            TO authenticated
            WITH CHECK (
                user_id = (SELECT auth.uid())
                OR organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- 28. production_advances: Users can create production advances in their workspaces
DO $$
BEGIN
    IF table_has_column('production_advances', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can create production advances in their workspaces" ON production_advances;
        CREATE POLICY "Users can create production advances in their workspaces"
            ON production_advances FOR INSERT
            TO authenticated
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- =====================================================
-- PART 2: CONSOLIDATE DUPLICATE PERMISSIVE POLICIES
-- =====================================================
-- Consolidates multiple permissive policies on same table/role/action
-- into single policies for optimal performance

-- activities table: Consolidate view + manage into single access policy
DO $$
BEGIN
    IF table_has_column('activities', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view activities in their workspace" ON activities;
        DROP POLICY IF EXISTS "Users can manage activities in their workspace" ON activities;
        DROP POLICY IF EXISTS "Users can access activities in their workspace" ON activities;
        CREATE POLICY "Users can access activities in their workspace"
            ON activities FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- approval_chains table: Consolidate view + manage into single access policy
DO $$
BEGIN
    IF table_has_column('approval_chains', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view approval_chains in their workspace" ON approval_chains;
        DROP POLICY IF EXISTS "Users can manage approval_chains in their workspace" ON approval_chains;
        DROP POLICY IF EXISTS "Users can access approval_chains in their workspace" ON approval_chains;
        CREATE POLICY "Users can access approval_chains in their workspace"
            ON approval_chains FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- approval_requests table: Consolidate 4 policies (2 view + 2 manage variants) into single access policy
DO $$
BEGIN
    IF table_has_column('approval_requests', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view approval requests in their workspaces" ON approval_requests;
        DROP POLICY IF EXISTS "Users can view approval_requests in their workspace" ON approval_requests;
        DROP POLICY IF EXISTS "Users can manage approval requests in their workspaces" ON approval_requests;
        DROP POLICY IF EXISTS "Users can manage approval_requests in their workspace" ON approval_requests;
        DROP POLICY IF EXISTS "Users can access approval_requests in their workspace" ON approval_requests;
        CREATE POLICY "Users can access approval_requests in their workspace"
            ON approval_requests FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- work_authorization_rules table: Consolidate 4 policies (2 view + 2 manage variants) into single access policy
DO $$
BEGIN
    IF table_has_column('work_authorization_rules', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view work auth rules in their workspaces" ON work_authorization_rules;
        DROP POLICY IF EXISTS "Users can view work_authorization_rules in their workspace" ON work_authorization_rules;
        DROP POLICY IF EXISTS "Users can manage work auth rules in their workspaces" ON work_authorization_rules;
        DROP POLICY IF EXISTS "Users can manage work_authorization_rules in their workspace" ON work_authorization_rules;
        DROP POLICY IF EXISTS "Users can access work_authorization_rules in their workspace" ON work_authorization_rules;
        CREATE POLICY "Users can access work_authorization_rules in their workspace"
            ON work_authorization_rules FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- work_order_offers table: Consolidate view + manage into single access policy
DO $$
BEGIN
    IF table_has_column('work_order_offers', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view offers in their workspaces" ON work_order_offers;
        DROP POLICY IF EXISTS "Users can manage offers in their workspaces" ON work_order_offers;
        DROP POLICY IF EXISTS "Users can access work_order_offers in their workspace" ON work_order_offers;
        CREATE POLICY "Users can access work_order_offers in their workspace"
            ON work_order_offers FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- work_orders table: Consolidate 6 policies (3 view variants + create + update + delete) into single access policy
DO $$
BEGIN
    IF table_has_column('work_orders', 'workspace_id') THEN
        DROP POLICY IF EXISTS "Users can view work orders in their workspaces" ON work_orders;
        DROP POLICY IF EXISTS "Users can view work_orders in their workspace" ON work_orders;
        DROP POLICY IF EXISTS "Users can manage work_orders in their workspace" ON work_orders;
        DROP POLICY IF EXISTS "Users can create work orders in their workspaces" ON work_orders;
        DROP POLICY IF EXISTS "Users can update work orders in their workspaces" ON work_orders;
        DROP POLICY IF EXISTS "Users can delete work orders in their workspaces" ON work_orders;
        DROP POLICY IF EXISTS "Users can access work_orders in their workspace" ON work_orders;
        CREATE POLICY "Users can access work_orders in their workspace"
            ON work_orders FOR ALL
            TO authenticated
            USING (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            )
            WITH CHECK (
                workspace_id IN (
                    SELECT workspace_id FROM workspace_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );
    END IF;
END $$;

-- workspaces table: Consolidate 3 policies (view + 2 admin variants) into 4 specific policies (SELECT, INSERT, UPDATE, DELETE)
DO $$
BEGIN
    IF table_has_column('workspaces', 'organization_id') THEN
        DROP POLICY IF EXISTS "Users can view workspaces in their organizations" ON workspaces;
        DROP POLICY IF EXISTS "Admins can manage workspaces" ON workspaces;
        DROP POLICY IF EXISTS "Organization creators can create workspaces" ON workspaces;
        DROP POLICY IF EXISTS "Admins can create workspaces" ON workspaces;
        DROP POLICY IF EXISTS "Admins can update workspaces" ON workspaces;
        DROP POLICY IF EXISTS "Admins can delete workspaces" ON workspaces;

        CREATE POLICY "Users can view workspaces in their organizations"
            ON workspaces FOR SELECT
            TO authenticated
            USING (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid())
                )
            );

        CREATE POLICY "Admins can create workspaces"
            ON workspaces FOR INSERT
            TO authenticated
            WITH CHECK (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );

        CREATE POLICY "Admins can update workspaces"
            ON workspaces FOR UPDATE
            TO authenticated
            USING (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            )
            WITH CHECK (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );

        CREATE POLICY "Admins can delete workspaces"
            ON workspaces FOR DELETE
            TO authenticated
            USING (
                organization_id IN (
                    SELECT organization_id FROM organization_members 
                    WHERE user_id = (SELECT auth.uid()) AND role IN ('owner', 'admin')
                )
            );
    END IF;
END $$;

-- Clean up helper function
DROP FUNCTION IF EXISTS table_has_column(p_table_name text, p_column_name text);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Summary:
-- - Fixed 31 auth RLS initplan warnings by wrapping auth.uid() in SELECT
-- - Consolidated duplicate permissive policies on 7 tables
-- - All policies now use optimal performance patterns
-- =====================================================
