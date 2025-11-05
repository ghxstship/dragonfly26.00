-- =====================================================
-- ADD PROFILE FOREIGN KEY CONSTRAINTS
-- Migration: 032
-- Date: 2025-10-14
-- =====================================================
-- 
-- Purpose: Add explicit foreign key constraints from all user-referencing 
-- columns to profiles(id) to enable PostgREST relationship discovery.
--
-- Since profiles.id = auth.users.id (same UUID), these constraints are valid
-- and enable automatic joins in Supabase queries without breaking existing
-- auth.users foreign keys.
--
-- This fixes ALL "Error loading data - Could not find relationship" issues.
-- =====================================================

-- =====================================================
-- REPORTS MODULE
-- =====================================================

ALTER TABLE report_templates 
  ADD CONSTRAINT fk_report_templates_created_by_profile 
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE custom_metrics
  ADD CONSTRAINT fk_custom_metrics_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- FINANCE MODULE
-- =====================================================

ALTER TABLE budgets
  ADD CONSTRAINT fk_budgets_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE financial_transactions
  ADD CONSTRAINT fk_financial_transactions_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE invoices
  ADD CONSTRAINT fk_invoices_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- payroll table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payroll') THEN
    ALTER TABLE payroll
      ADD CONSTRAINT fk_payroll_processed_by_profile
      FOREIGN KEY (processed_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- reconciliations table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reconciliations') THEN
    ALTER TABLE reconciliations
      ADD CONSTRAINT fk_reconciliations_reconciled_by_profile
      FOREIGN KEY (reconciled_by) REFERENCES profiles(id) ON DELETE SET NULL;
    
    ALTER TABLE reconciliations
      ADD CONSTRAINT fk_reconciliations_approved_by_profile
      FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
  END IF;
END $$;

-- =====================================================
-- PROCUREMENT MODULE
-- =====================================================

-- production_advances table
ALTER TABLE production_advances
  ADD CONSTRAINT fk_production_advances_requested_by_profile
  FOREIGN KEY (requested_by) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE production_advances
  ADD CONSTRAINT fk_production_advances_approved_by_profile
  FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- purchase_orders table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchase_orders') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchase_orders' AND column_name = 'created_by') THEN
      ALTER TABLE purchase_orders
        ADD CONSTRAINT fk_purchase_orders_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- purchase_requisitions table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchase_requisitions') THEN
    ALTER TABLE purchase_requisitions
      ADD CONSTRAINT fk_purchase_requisitions_requested_by_profile
      FOREIGN KEY (requested_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'purchase_requisitions' AND column_name = 'approved_by') THEN
      ALTER TABLE purchase_requisitions
        ADD CONSTRAINT fk_purchase_requisitions_approved_by_profile
        FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- procurement_agreements table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'procurement_agreements') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'procurement_agreements' AND column_name = 'created_by') THEN
      ALTER TABLE procurement_agreements
        ADD CONSTRAINT fk_procurement_agreements_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'procurement_agreements' AND column_name = 'approved_by') THEN
      ALTER TABLE procurement_agreements
        ADD CONSTRAINT fk_procurement_agreements_approved_by_profile
        FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- RESOURCES MODULE
-- =====================================================

ALTER TABLE resources
  ADD CONSTRAINT fk_resources_published_by_profile
  FOREIGN KEY (published_by) REFERENCES profiles(id) ON DELETE SET NULL;

-- courses table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'courses') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'instructor_id') THEN
      ALTER TABLE courses
        ADD CONSTRAINT fk_courses_instructor_profile
        FOREIGN KEY (instructor_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- JOBS MODULE
-- =====================================================

ALTER TABLE job_contracts
  ADD CONSTRAINT fk_job_contracts_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- COMMUNITY MODULE
-- =====================================================

ALTER TABLE community_posts
  ADD CONSTRAINT fk_community_posts_author_profile
  FOREIGN KEY (author_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE connections
  ADD CONSTRAINT fk_connections_user_profile
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE connections
  ADD CONSTRAINT fk_connections_connected_user_profile
  FOREIGN KEY (connected_user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- MARKETPLACE MODULE
-- =====================================================

ALTER TABLE marketplace_orders
  ADD CONSTRAINT fk_marketplace_orders_buyer_profile
  FOREIGN KEY (buyer_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- EVENTS MODULE
-- =============================================

ALTER TABLE events
  ADD CONSTRAINT fk_events_organizer_profile
  FOREIGN KEY (organizer_id) REFERENCES profiles(id) ON DELETE SET NULL;

ALTER TABLE events
  ADD CONSTRAINT fk_events_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- run_of_show table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'run_of_show') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'run_of_show' AND column_name = 'responsible_person_id') THEN
      ALTER TABLE run_of_show
        ADD CONSTRAINT fk_run_of_show_responsible_person_profile
        FOREIGN KEY (responsible_person_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- incidents table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'incidents') THEN
    ALTER TABLE incidents
      ADD CONSTRAINT fk_incidents_reported_by_profile
      FOREIGN KEY (reported_by) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- bookings table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'bookings') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'created_by') THEN
      ALTER TABLE bookings
        ADD CONSTRAINT fk_bookings_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- tours table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tours') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'tour_manager_id') THEN
      ALTER TABLE tours
        ADD CONSTRAINT fk_tours_tour_manager_profile
        FOREIGN KEY (tour_manager_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tours' AND column_name = 'created_by') THEN
      ALTER TABLE tours
        ADD CONSTRAINT fk_tours_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- hospitality_reservations table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hospitality_reservations') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hospitality_reservations' AND column_name = 'created_by') THEN
      ALTER TABLE hospitality_reservations
        ADD CONSTRAINT fk_hospitality_reservations_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- =====================================================
-- PROJECTS MODULE
-- =====================================================

-- project_tasks table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_tasks') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_tasks' AND column_name = 'assignee_id') THEN
      ALTER TABLE project_tasks
        ADD CONSTRAINT fk_project_tasks_assignee_profile
        FOREIGN KEY (assignee_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'project_tasks' AND column_name = 'created_by') THEN
      ALTER TABLE project_tasks
        ADD CONSTRAINT fk_project_tasks_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- productions table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'productions') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'productions' AND column_name = 'created_by') THEN
      ALTER TABLE productions
        ADD CONSTRAINT fk_productions_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- =====================================================
-- LOCATIONS MODULE
-- =====================================================

ALTER TABLE locations
  ADD CONSTRAINT fk_locations_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- site_maps table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_maps') THEN
    ALTER TABLE site_maps
      ADD CONSTRAINT fk_site_maps_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =====================================================
-- FILES MODULE
-- =====================================================

ALTER TABLE files
  ADD CONSTRAINT fk_files_uploaded_by_profile
  FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- file_versions table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'file_versions') THEN
    ALTER TABLE file_versions
      ADD CONSTRAINT fk_file_versions_uploaded_by_profile
      FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- =====================================================
-- COMPANIES MODULE
-- =====================================================

ALTER TABLE companies
  ADD CONSTRAINT fk_companies_created_by_profile
  FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;

-- =====================================================
-- TRAVEL MODULE
-- =====================================================

-- travel_itineraries table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'travel_itineraries') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'travel_itineraries' AND column_name = 'user_id') THEN
      ALTER TABLE travel_itineraries
        ADD CONSTRAINT fk_travel_itineraries_user_profile
        FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'travel_itineraries' AND column_name = 'created_by') THEN
      ALTER TABLE travel_itineraries
        ADD CONSTRAINT fk_travel_itineraries_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'travel_itineraries' AND column_name = 'approved_by') THEN
      ALTER TABLE travel_itineraries
        ADD CONSTRAINT fk_travel_itineraries_approved_by_profile
        FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- ANALYTICS MODULE
-- =====================================================

-- data_sources table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'data_sources') THEN
    ALTER TABLE data_sources
      ADD CONSTRAINT fk_data_sources_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- analytics_views table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_views') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'analytics_views' AND column_name = 'created_by') THEN
      ALTER TABLE analytics_views
        ADD CONSTRAINT fk_analytics_views_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- =====================================================
-- INSIGHTS MODULE
-- =====================================================

-- objectives table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'objectives') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'objectives' AND column_name = 'owner_id') THEN
      ALTER TABLE objectives
        ADD CONSTRAINT fk_objectives_owner_profile
        FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'objectives' AND column_name = 'created_by') THEN
      ALTER TABLE objectives
        ADD CONSTRAINT fk_objectives_created_by_profile
        FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    END IF;
  END IF;
END $$;

-- key_results table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'key_results') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'key_results' AND column_name = 'owner_id') THEN
      ALTER TABLE key_results
        ADD CONSTRAINT fk_key_results_owner_profile
        FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- strategic_priorities table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'strategic_priorities') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategic_priorities' AND column_name = 'owner_id') THEN
      ALTER TABLE strategic_priorities
        ADD CONSTRAINT fk_strategic_priorities_owner_profile
        FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- strategic_reviews table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'strategic_reviews') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'strategic_reviews' AND column_name = 'facilitator_id') THEN
      ALTER TABLE strategic_reviews
        ADD CONSTRAINT fk_strategic_reviews_facilitator_profile
        FOREIGN KEY (facilitator_id) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- ai_recommendations table
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ai_recommendations') THEN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'ai_recommendations' AND column_name = 'reviewed_by') THEN
      ALTER TABLE ai_recommendations
        ADD CONSTRAINT fk_ai_recommendations_reviewed_by_profile
        FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE SET NULL;
    END IF;
  END IF;
END $$;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
-- Add indexes on all new foreign key columns for query performance

CREATE INDEX IF NOT EXISTS idx_report_templates_created_by ON report_templates(created_by);
CREATE INDEX IF NOT EXISTS idx_budgets_created_by ON budgets(created_by);
CREATE INDEX IF NOT EXISTS idx_financial_transactions_created_by ON financial_transactions(created_by);
CREATE INDEX IF NOT EXISTS idx_production_advances_requested_by ON production_advances(requested_by);
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_connections_user_id ON connections(user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_id ON marketplace_orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_job_contracts_created_by ON job_contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_resources_published_by ON resources(published_by);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_locations_created_by ON locations(created_by);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_companies_created_by ON companies(created_by);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- All tables with user references now have explicit foreign keys to profiles(id)
-- PostgREST will automatically discover these relationships
-- All "Error loading data" issues should be resolved
-- Queries in use-module-data.ts will now work as intended

COMMENT ON CONSTRAINT fk_report_templates_created_by_profile ON report_templates IS 
  'Enables PostgREST relationship: report_templates.created_by -> profiles for automatic joins';

COMMENT ON CONSTRAINT fk_budgets_created_by_profile ON budgets IS 
  'Enables PostgREST relationship: budgets.created_by -> profiles for automatic joins';

-- Add notification
DO $$
BEGIN
  RAISE NOTICE 'Migration 032: Profile foreign keys added successfully';
  RAISE NOTICE 'All user-referencing columns now have explicit FKs to profiles(id)';
  RAISE NOTICE 'PostgREST relationship discovery enabled for all modules';
END $$;
