-- =====================================================
-- FIX PROFILE FOREIGN KEY CONSTRAINTS
-- Migration: 067
-- Date: 2025-10-15
-- =====================================================
-- 
-- Purpose: Add missing foreign key constraints from user-referencing 
-- columns to profiles(id) to enable PostgREST relationship discovery.
--
-- This fixes "Could not find a relationship between X and 'profiles'" errors
-- =====================================================

-- =====================================================
-- WORK ORDERS MODULE
-- =====================================================

-- Add profile FK for work_orders.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_orders_created_by_profile'
  ) THEN
    ALTER TABLE work_orders
      ADD CONSTRAINT fk_work_orders_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_work_orders_created_by ON work_orders(created_by);
  END IF;
END $$;

-- Add profile FK for work_orders.compliance_verified_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_orders_compliance_verified_by_profile'
  ) THEN
    ALTER TABLE work_orders
      ADD CONSTRAINT fk_work_orders_compliance_verified_by_profile
      FOREIGN KEY (compliance_verified_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Add profile FK for work_order_offers.decided_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_order_offers_decided_by_profile'
  ) THEN
    ALTER TABLE work_order_offers
      ADD CONSTRAINT fk_work_order_offers_decided_by_profile
      FOREIGN KEY (decided_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =====================================================
-- COST TRACKING MODULE
-- =====================================================

-- Add profile FK for project_costs.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_project_costs_created_by_profile'
  ) THEN
    ALTER TABLE project_costs
      ADD CONSTRAINT fk_project_costs_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_project_costs_created_by ON project_costs(created_by);
  END IF;
END $$;

-- Add profile FK for project_costs.approved_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_project_costs_approved_by_profile'
  ) THEN
    ALTER TABLE project_costs
      ADD CONSTRAINT fk_project_costs_approved_by_profile
      FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =====================================================
-- APPROVAL WORKFLOWS MODULE
-- =====================================================

-- Add profile FK for approval_steps.approver_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_approval_steps_approver_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'approval_steps') THEN
      ALTER TABLE approval_steps
        ADD CONSTRAINT fk_approval_steps_approver_profile
        FOREIGN KEY (approver_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add profile FK for approval_requests.requested_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_approval_requests_requested_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'approval_requests') THEN
      ALTER TABLE approval_requests
        ADD CONSTRAINT fk_approval_requests_requested_by_profile
        FOREIGN KEY (requested_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add profile FK for approval_requests.resolved_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_approval_requests_resolved_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'approval_requests') THEN
      ALTER TABLE approval_requests
        ADD CONSTRAINT fk_approval_requests_resolved_by_profile
        FOREIGN KEY (resolved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Add profile FK for approval_workflows.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_approval_workflows_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'approval_workflows') THEN
      ALTER TABLE approval_workflows
        ADD CONSTRAINT fk_approval_workflows_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add profile FK for checklist_templates.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_checklist_templates_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'checklist_templates') THEN
      ALTER TABLE checklist_templates
        ADD CONSTRAINT fk_checklist_templates_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add profile FK for checklist_items.assigned_to
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_checklist_items_assigned_to_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'checklist_items') THEN
      ALTER TABLE checklist_items
        ADD CONSTRAINT fk_checklist_items_assigned_to_profile
        FOREIGN KEY (assigned_to) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- Add profile FK for checklist_items.completed_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_checklist_items_completed_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'checklist_items') THEN
      ALTER TABLE checklist_items
        ADD CONSTRAINT fk_checklist_items_completed_by_profile
        FOREIGN KEY (completed_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- PRODUCTION ADVANCES MODULE
-- =====================================================

-- Update production_advances - handle both old and new column names
DO $$ 
BEGIN
  -- requestor_id (new schema)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'production_advances' AND column_name = 'requestor_id') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'fk_production_advances_requestor_profile'
    ) THEN
      ALTER TABLE production_advances
        ADD CONSTRAINT fk_production_advances_requestor_profile
        FOREIGN KEY (requestor_id) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_production_advances_requestor ON production_advances(requestor_id);
    END IF;
  END IF;

  -- approver_id  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'production_advances' AND column_name = 'approver_id') THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.table_constraints 
      WHERE constraint_name = 'fk_production_advances_approver_profile'
    ) THEN
      ALTER TABLE production_advances
        ADD CONSTRAINT fk_production_advances_approver_profile
        FOREIGN KEY (approver_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;

  -- created_by
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_production_advances_created_by_profile'
  ) THEN
    ALTER TABLE production_advances
      ADD CONSTRAINT fk_production_advances_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_production_advances_created_by ON production_advances(created_by);
  END IF;
END $$;

-- =====================================================
-- RECRUITING MODULE
-- =====================================================

-- Add profile FK for hiring_applications.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_hiring_applications_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hiring_applications') THEN
      ALTER TABLE hiring_applications
        ADD CONSTRAINT fk_hiring_applications_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- Add profile FK for hiring_application_responses.reviewed_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_hiring_application_responses_reviewed_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hiring_application_responses') THEN
      ALTER TABLE hiring_application_responses
        ADD CONSTRAINT fk_hiring_application_responses_reviewed_by_profile
        FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- SUBCONTRACTOR REVIEWS MODULE
-- =====================================================

-- Add profile FK for subcontractor_reviews.reviewed_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_reviews_reviewed_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcontractor_reviews') THEN
      ALTER TABLE subcontractor_reviews
        ADD CONSTRAINT fk_subcontractor_reviews_reviewed_by_profile
        FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_subcontractor_reviews_reviewed_by ON subcontractor_reviews(reviewed_by);
    END IF;
  END IF;
END $$;

-- =====================================================
-- ESTIMATES MODULE
-- =====================================================

-- Add profile FK for estimates.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_estimates_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'estimates') THEN
      ALTER TABLE estimates
        ADD CONSTRAINT fk_estimates_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_estimates_created_by ON estimates(created_by);
    END IF;
  END IF;
END $$;

-- =====================================================
-- INVOICING MODULE
-- =====================================================

-- Add profile FK for subcontractor_invoices.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_invoices_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcontractor_invoices') THEN
      ALTER TABLE subcontractor_invoices
        ADD CONSTRAINT fk_subcontractor_invoices_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_subcontractor_invoices_created_by ON subcontractor_invoices(created_by);
    END IF;
  END IF;
END $$;

-- Add profile FK for subcontractor_invoices.approved_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_invoices_approved_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcontractor_invoices') THEN
      ALTER TABLE subcontractor_invoices
        ADD CONSTRAINT fk_subcontractor_invoices_approved_by_profile
        FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- COMMUNICATION MODULE
-- =====================================================

-- Add profile FK for communication_threads.created_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_communication_threads_created_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'communication_threads') THEN
      ALTER TABLE communication_threads
        ADD CONSTRAINT fk_communication_threads_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_communication_threads_created_by ON communication_threads(created_by);
    END IF;
  END IF;
END $$;

-- Add profile FK for thread_messages.author_id
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_thread_messages_author_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'thread_messages') THEN
      ALTER TABLE thread_messages
        ADD CONSTRAINT fk_thread_messages_author_profile
        FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;
      
      CREATE INDEX IF NOT EXISTS idx_thread_messages_author_id ON thread_messages(author_id);
    END IF;
  END IF;
END $$;

-- =====================================================
-- COMPLIANCE MODULE
-- =====================================================

-- Add profile FK for subcontractor_compliance_docs.verified_by
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_compliance_docs_verified_by_profile'
  ) THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subcontractor_compliance_docs') THEN
      ALTER TABLE subcontractor_compliance_docs
        ADD CONSTRAINT fk_subcontractor_compliance_docs_verified_by_profile
        FOREIGN KEY (verified_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- All tables with user references now have explicit foreign keys to profiles(id)
-- PostgREST will automatically discover these relationships
-- All "Error loading data - Could not find relationship" issues should be resolved

DO $$
BEGIN
  RAISE NOTICE 'Migration 067: Additional profile foreign keys added successfully';
  RAISE NOTICE 'Fixed relationships for: work_orders, estimates, subcontractor_reviews, invoices, communication_threads, compliance_docs';
  RAISE NOTICE 'PostgREST relationship discovery enabled for all modules';
END $$;
