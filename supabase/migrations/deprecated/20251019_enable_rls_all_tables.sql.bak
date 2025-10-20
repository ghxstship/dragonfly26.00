-- Migration: Enable Row Level Security on All Tables
-- Date: October 19, 2025
-- Purpose: Enable RLS on all 70 tables to secure data access
-- Priority: P0 CRITICAL - Required before production deployment

-- ============================================================
-- PHASE 4.1: ENABLE RLS ON ALL TABLES
-- ============================================================

-- Admin & Settings Tables (16)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE appearance_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_info ENABLE ROW LEVEL SECURITY;

-- Business Operations Tables (14)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_pipelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_requisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Production & Assets Tables (12)
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE bim_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_advances ENABLE ROW LEVEL SECURITY;

-- Community & Marketplace Tables (12)
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcases ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_levels ENABLE ROW LEVEL SECURITY;

-- Intelligence & Analytics Tables (6)
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_schedules ENABLE ROW LEVEL SECURITY;

-- Core System Tables (10)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_member_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICATION
-- ============================================================

-- Verify RLS is enabled on all tables
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN (
        'audit_logs', 'system_settings', 'api_tokens', 'webhooks',
        'integrations', 'automations', 'custom_fields', 'custom_statuses',
        'templates', 'checklist_templates', 'user_preferences', 'user_integrations',
        'user_automations', 'notification_settings', 'appearance_settings', 'billing_info',
        'companies', 'company_contacts', 'company_contracts', 'company_documents',
        'company_notes', 'jobs', 'job_pipelines', 'job_offers',
        'job_invoices', 'job_team_members', 'purchase_orders', 'purchase_requisitions',
        'goods_receipts', 'vendors', 'locations', 'location_access',
        'bim_models', 'location_zones', 'files', 'file_versions',
        'file_shares', 'folders', 'assets', 'asset_transactions',
        'asset_maintenance', 'production_advances', 'community_posts', 'community_connections',
        'community_events', 'competitions', 'showcases', 'marketplace_products',
        'marketplace_orders', 'marketplace_reviews', 'marketplace_categories', 'product_variants',
        'product_options', 'inventory_levels', 'analytics_metrics', 'analytics_dashboards',
        'analytics_reports', 'reports', 'report_templates', 'report_schedules',
        'profiles', 'community_member_levels', 'projects', 'tasks',
        'events', 'people', 'finance_transactions', 'invoices',
        'expenses', 'budgets'
    );
    
    IF table_count = 70 THEN
        RAISE NOTICE 'SUCCESS: RLS enabled on all 70 tables';
    ELSE
        RAISE EXCEPTION 'ERROR: Only % tables found, expected 70', table_count;
    END IF;
END $$;

-- ============================================================
-- NOTES
-- ============================================================

-- This migration only ENABLES RLS. Policies must be added separately.
-- Without policies, ALL access will be DENIED by default.
-- Next steps:
--   1. Apply this migration
--   2. Run 20251019_user_scoped_policies.sql
--   3. Run 20251019_workspace_scoped_policies.sql
--   4. Run 20251019_admin_policies.sql
--   5. Test access with verify-rls-policies.ts script
