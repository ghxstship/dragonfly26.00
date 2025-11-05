-- =============================================
-- CONSOLIDATE: Remove Old Job-Specific Tables
-- Migration: 20251015000006
-- =============================================
-- 
-- This migration removes the old job-specific tables that are now
-- replaced by general-purpose tables created in migrations 20251015000001-5
--
-- OLD SYSTEM (Being Removed):
-- - job_work_orders → work_orders
-- - job_estimates → estimates
-- - job_invoices → subcontractor_invoices
-- - job_compliance_documents → subcontractor_compliance_docs
-- - job_communications → communication_threads/thread_messages
-- - job_checklists → checklists
-- - job_workflows → approval_workflows
-- - job_recruitment_campaigns → hiring_applications
--
-- NEW SYSTEM (Already Created):
-- - General-purpose tables that work across Projects, Jobs, Companies modules
-- =============================================

-- =============================================
-- DROP OLD JOB-SPECIFIC TABLES
-- =============================================

-- Drop in dependency order (children first, parents last)

-- Recruitment system
DROP TABLE IF EXISTS job_contractor_applications CASCADE;
DROP TABLE IF EXISTS job_recruitment_campaigns CASCADE;

-- Workflows
DROP TABLE IF EXISTS job_workflow_instances CASCADE;
DROP TABLE IF EXISTS job_workflows CASCADE;

-- Communications
DROP TABLE IF EXISTS job_communications CASCADE;

-- Checklists
DROP TABLE IF EXISTS job_checklist_items CASCADE;
DROP TABLE IF EXISTS job_checklists CASCADE;
DROP TABLE IF EXISTS job_checklist_template_items CASCADE;
DROP TABLE IF EXISTS job_checklist_templates CASCADE;

-- Reminders
DROP TABLE IF EXISTS job_reminders CASCADE;

-- Compliance
DROP TABLE IF EXISTS job_contractor_authorizations CASCADE;
DROP TABLE IF EXISTS job_compliance_documents CASCADE;
DROP TABLE IF EXISTS job_compliance_requirements CASCADE;

-- Calendar/Scheduling
DROP TABLE IF EXISTS job_calendar_events CASCADE;

-- Work Orders
DROP TABLE IF EXISTS job_work_order_items CASCADE;
DROP TABLE IF EXISTS job_work_orders CASCADE;

-- Invoices
DROP TABLE IF EXISTS job_invoice_items CASCADE;
DROP TABLE IF EXISTS job_invoices CASCADE;

-- Estimates/Quotes
DROP TABLE IF EXISTS job_estimate_items CASCADE;
DROP TABLE IF EXISTS job_estimates CASCADE;

-- Payment tracking (if exists)
DROP TABLE IF EXISTS job_payments CASCADE;

-- Approvals (if exists)
DROP TABLE IF EXISTS job_approval_requests CASCADE;

-- =============================================
-- VERIFICATION QUERY
-- =============================================
-- Run this after migration to verify tables are dropped:
-- 
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name LIKE 'job_%'
-- ORDER BY table_name;
--
-- Expected result: 2 tables remaining (job_contracts, rfps - these stay!)
-- =============================================

COMMENT ON SCHEMA public IS 'Consolidated to general-purpose tables: work_orders, estimates, subcontractor_invoices, communication_threads, checklists, approval_workflows, hiring_applications';
