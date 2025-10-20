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
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'approval_requests' AND column_name = 'resolved_by'
    ) THEN
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
-- ADDITIONAL MODULES
-- =====================================================

-- Analytics, Events, Files, Companies, Locations, Tours, etc.
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_integrations') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_analytics_integrations_created_by_profile') THEN ALTER TABLE analytics_integrations ADD CONSTRAINT fk_analytics_integrations_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_reports') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_saved_reports_created_by_profile') THEN ALTER TABLE saved_reports ADD CONSTRAINT fk_saved_reports_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'business_goals') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_business_goals_created_by_profile') THEN ALTER TABLE business_goals ADD CONSTRAINT fk_business_goals_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_business_goals_owner_profile') THEN ALTER TABLE business_goals ADD CONSTRAINT fk_business_goals_owner_profile FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_events_organizer_profile') THEN ALTER TABLE events ADD CONSTRAINT fk_events_organizer_profile FOREIGN KEY (organizer_id) REFERENCES profiles(id) ON DELETE SET NULL; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_events_created_by_profile') THEN ALTER TABLE events ADD CONSTRAINT fk_events_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tasks') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_tasks_responsible_person_profile') THEN ALTER TABLE event_tasks ADD CONSTRAINT fk_event_tasks_responsible_person_profile FOREIGN KEY (responsible_person_id) REFERENCES profiles(id) ON DELETE SET NULL; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_logistics') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_logistics_created_by_profile') THEN ALTER TABLE event_logistics ADD CONSTRAINT fk_event_logistics_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_incidents') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_incidents_reported_by_profile') THEN ALTER TABLE event_incidents ADD CONSTRAINT fk_event_incidents_reported_by_profile FOREIGN KEY (reported_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_files_uploaded_by_profile') THEN ALTER TABLE files ADD CONSTRAINT fk_files_uploaded_by_profile FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'file_versions') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_file_versions_uploaded_by_profile') THEN ALTER TABLE file_versions ADD CONSTRAINT fk_file_versions_uploaded_by_profile FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_companies_created_by_profile') THEN ALTER TABLE companies ADD CONSTRAINT fk_companies_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'locations') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_locations_created_by_profile') THEN ALTER TABLE locations ADD CONSTRAINT fk_locations_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'location_versions') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_location_versions_created_by_profile') THEN ALTER TABLE location_versions ADD CONSTRAINT fk_location_versions_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tours') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tours_manager_profile') THEN ALTER TABLE tours ADD CONSTRAINT fk_tours_manager_profile FOREIGN KEY (tour_manager_id) REFERENCES profiles(id) ON DELETE SET NULL; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tours_created_by_profile') THEN ALTER TABLE tours ADD CONSTRAINT fk_tours_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tour_settlements') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tour_settlements_created_by_profile') THEN ALTER TABLE tour_settlements ADD CONSTRAINT fk_tour_settlements_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settlement_reconciliations') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_settlement_reconciliations_reconciled_by_profile') THEN ALTER TABLE settlement_reconciliations ADD CONSTRAINT fk_settlement_reconciliations_reconciled_by_profile FOREIGN KEY (reconciled_by) REFERENCES profiles(id) ON DELETE SET NULL; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_settlement_reconciliations_approved_by_profile') THEN ALTER TABLE settlement_reconciliations ADD CONSTRAINT fk_settlement_reconciliations_approved_by_profile FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchase_requisitions') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_purchase_requisitions_requested_by_profile') THEN ALTER TABLE purchase_requisitions ADD CONSTRAINT fk_purchase_requisitions_requested_by_profile FOREIGN KEY (requested_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_purchase_requisitions_approved_by_profile') THEN ALTER TABLE purchase_requisitions ADD CONSTRAINT fk_purchase_requisitions_approved_by_profile FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expense_policy_rules') AND NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_expense_policy_rules_created_by_profile') THEN ALTER TABLE expense_policy_rules ADD CONSTRAINT fk_expense_policy_rules_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_violations') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_policy_violations_violated_by_profile') THEN ALTER TABLE policy_violations ADD CONSTRAINT fk_policy_violations_violated_by_profile FOREIGN KEY (violated_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_policy_violations_resolved_by_profile') THEN ALTER TABLE policy_violations ADD CONSTRAINT fk_policy_violations_resolved_by_profile FOREIGN KEY (resolved_by) REFERENCES profiles(id) ON DELETE SET NULL; END IF; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'virtual_cards') THEN IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_virtual_cards_holder_profile') THEN ALTER TABLE virtual_cards ADD CONSTRAINT fk_virtual_cards_holder_profile FOREIGN KEY (card_holder_id) REFERENCES profiles(id) ON DELETE CASCADE; END IF; IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_virtual_cards_created_by_profile') THEN ALTER TABLE virtual_cards ADD CONSTRAINT fk_virtual_cards_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE; END IF; END IF; END $$;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 067: Comprehensive profile foreign keys added successfully';
  RAISE NOTICE 'Fixed relationships for all modules:';
  RAISE NOTICE '  - Work Orders, Estimates, Reviews, Invoices';
  RAISE NOTICE '  - Communication, Compliance, Analytics, Events';
  RAISE NOTICE '  - Files, Companies, Locations, Tours, Procurement';
  RAISE NOTICE 'PostgREST relationship discovery enabled for entire schema';
END $$;
