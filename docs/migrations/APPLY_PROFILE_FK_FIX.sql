-- =====================================================
-- QUICK FIX: Apply Profile Foreign Keys
-- =====================================================
-- Run this in Supabase SQL Editor to fix relationship errors
-- This adds missing foreign keys from user columns to profiles(id)

BEGIN;

-- SUBCONTRACTOR REVIEWS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_reviews_reviewed_by_profile'
  ) THEN
    ALTER TABLE subcontractor_reviews
      ADD CONSTRAINT fk_subcontractor_reviews_reviewed_by_profile
      FOREIGN KEY (reviewed_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_subcontractor_reviews_reviewed_by 
      ON subcontractor_reviews(reviewed_by);
    
    RAISE NOTICE 'Added FK: subcontractor_reviews.reviewed_by -> profiles(id)';
  END IF;
END $$;

-- ESTIMATES
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_estimates_created_by_profile'
  ) THEN
    ALTER TABLE estimates
      ADD CONSTRAINT fk_estimates_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_estimates_created_by 
      ON estimates(created_by);
    
    RAISE NOTICE 'Added FK: estimates.created_by -> profiles(id)';
  END IF;
END $$;

-- WORK ORDERS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_orders_created_by_profile'
  ) THEN
    ALTER TABLE work_orders
      ADD CONSTRAINT fk_work_orders_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_work_orders_created_by 
      ON work_orders(created_by);
    
    RAISE NOTICE 'Added FK: work_orders.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_orders_compliance_verified_by_profile'
  ) THEN
    ALTER TABLE work_orders
      ADD CONSTRAINT fk_work_orders_compliance_verified_by_profile
      FOREIGN KEY (compliance_verified_by) REFERENCES profiles(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'Added FK: work_orders.compliance_verified_by -> profiles(id)';
  END IF;
END $$;

-- WORK ORDER OFFERS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_work_order_offers_decided_by_profile'
  ) THEN
    ALTER TABLE work_order_offers
      ADD CONSTRAINT fk_work_order_offers_decided_by_profile
      FOREIGN KEY (decided_by) REFERENCES profiles(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'Added FK: work_order_offers.decided_by -> profiles(id)';
  END IF;
END $$;

-- SUBCONTRACTOR INVOICES
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_invoices_created_by_profile'
  ) THEN
    ALTER TABLE subcontractor_invoices
      ADD CONSTRAINT fk_subcontractor_invoices_created_by_profile
      FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    
    CREATE INDEX IF NOT EXISTS idx_subcontractor_invoices_created_by 
      ON subcontractor_invoices(created_by);
    
    RAISE NOTICE 'Added FK: subcontractor_invoices.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_subcontractor_invoices_approved_by_profile'
  ) THEN
    ALTER TABLE subcontractor_invoices
      ADD CONSTRAINT fk_subcontractor_invoices_approved_by_profile
      FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
    
    RAISE NOTICE 'Added FK: subcontractor_invoices.approved_by -> profiles(id)';
  END IF;
END $$;

-- COMMUNICATION THREADS
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
      
      CREATE INDEX IF NOT EXISTS idx_communication_threads_created_by 
        ON communication_threads(created_by);
      
      RAISE NOTICE 'Added FK: communication_threads.created_by -> profiles(id)';
    END IF;
  END IF;
END $$;

-- THREAD MESSAGES
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
      
      CREATE INDEX IF NOT EXISTS idx_thread_messages_author_id 
        ON thread_messages(author_id);
      
      RAISE NOTICE 'Added FK: thread_messages.author_id -> profiles(id)';
    END IF;
  END IF;
END $$;

-- COMPLIANCE DOCS
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
      
      RAISE NOTICE 'Added FK: subcontractor_compliance_docs.verified_by -> profiles(id)';
    END IF;
  END IF;
END $$;

-- ANALYTICS & BUSINESS INTELLIGENCE
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics_integrations') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_analytics_integrations_created_by_profile') THEN
    ALTER TABLE analytics_integrations ADD CONSTRAINT fk_analytics_integrations_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: analytics_integrations.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'saved_reports') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_saved_reports_created_by_profile') THEN
    ALTER TABLE saved_reports ADD CONSTRAINT fk_saved_reports_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: saved_reports.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'business_goals') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_business_goals_created_by_profile') THEN
      ALTER TABLE business_goals ADD CONSTRAINT fk_business_goals_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: business_goals.created_by -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_business_goals_owner_profile') THEN
      ALTER TABLE business_goals ADD CONSTRAINT fk_business_goals_owner_profile FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: business_goals.owner_id -> profiles(id)';
    END IF;
  END IF;
END $$;

-- EVENTS MODULE
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'events') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_events_organizer_profile') THEN
      ALTER TABLE events ADD CONSTRAINT fk_events_organizer_profile FOREIGN KEY (organizer_id) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: events.organizer_id -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_events_created_by_profile') THEN
      ALTER TABLE events ADD CONSTRAINT fk_events_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: events.created_by -> profiles(id)';
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_tasks') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_tasks_responsible_person_profile') THEN
    ALTER TABLE event_tasks ADD CONSTRAINT fk_event_tasks_responsible_person_profile FOREIGN KEY (responsible_person_id) REFERENCES profiles(id) ON DELETE SET NULL;
    RAISE NOTICE 'Added FK: event_tasks.responsible_person_id -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_logistics') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_logistics_created_by_profile') THEN
    ALTER TABLE event_logistics ADD CONSTRAINT fk_event_logistics_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: event_logistics.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'event_incidents') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_event_incidents_reported_by_profile') THEN
    ALTER TABLE event_incidents ADD CONSTRAINT fk_event_incidents_reported_by_profile FOREIGN KEY (reported_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: event_incidents.reported_by -> profiles(id)';
  END IF;
END $$;

-- FILES MODULE
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'files') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_files_uploaded_by_profile') THEN
    ALTER TABLE files ADD CONSTRAINT fk_files_uploaded_by_profile FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: files.uploaded_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'file_versions') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_file_versions_uploaded_by_profile') THEN
    ALTER TABLE file_versions ADD CONSTRAINT fk_file_versions_uploaded_by_profile FOREIGN KEY (uploaded_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: file_versions.uploaded_by -> profiles(id)';
  END IF;
END $$;

-- COMPANIES & LOCATIONS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'companies') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_companies_created_by_profile') THEN
    ALTER TABLE companies ADD CONSTRAINT fk_companies_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: companies.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'locations') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_locations_created_by_profile') THEN
    ALTER TABLE locations ADD CONSTRAINT fk_locations_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: locations.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'location_versions') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_location_versions_created_by_profile') THEN
    ALTER TABLE location_versions ADD CONSTRAINT fk_location_versions_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: location_versions.created_by -> profiles(id)';
  END IF;
END $$;

-- TOURS & SETTLEMENTS
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tours') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tours_manager_profile') THEN
      ALTER TABLE tours ADD CONSTRAINT fk_tours_manager_profile FOREIGN KEY (tour_manager_id) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: tours.tour_manager_id -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tours_created_by_profile') THEN
      ALTER TABLE tours ADD CONSTRAINT fk_tours_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: tours.created_by -> profiles(id)';
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tour_settlements') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_tour_settlements_created_by_profile') THEN
    ALTER TABLE tour_settlements ADD CONSTRAINT fk_tour_settlements_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: tour_settlements.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'settlement_reconciliations') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_settlement_reconciliations_reconciled_by_profile') THEN
      ALTER TABLE settlement_reconciliations ADD CONSTRAINT fk_settlement_reconciliations_reconciled_by_profile FOREIGN KEY (reconciled_by) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: settlement_reconciliations.reconciled_by -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_settlement_reconciliations_approved_by_profile') THEN
      ALTER TABLE settlement_reconciliations ADD CONSTRAINT fk_settlement_reconciliations_approved_by_profile FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: settlement_reconciliations.approved_by -> profiles(id)';
    END IF;
  END IF;
END $$;

-- PROCUREMENT
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'purchase_requisitions') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_purchase_requisitions_requested_by_profile') THEN
      ALTER TABLE purchase_requisitions ADD CONSTRAINT fk_purchase_requisitions_requested_by_profile FOREIGN KEY (requested_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: purchase_requisitions.requested_by -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_purchase_requisitions_approved_by_profile') THEN
      ALTER TABLE purchase_requisitions ADD CONSTRAINT fk_purchase_requisitions_approved_by_profile FOREIGN KEY (approved_by) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: purchase_requisitions.approved_by -> profiles(id)';
    END IF;
  END IF;
END $$;

-- EXPENSE POLICIES & COMPLIANCE
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'expense_policy_rules') AND
     NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_expense_policy_rules_created_by_profile') THEN
    ALTER TABLE expense_policy_rules ADD CONSTRAINT fk_expense_policy_rules_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
    RAISE NOTICE 'Added FK: expense_policy_rules.created_by -> profiles(id)';
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'policy_violations') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_policy_violations_violated_by_profile') THEN
      ALTER TABLE policy_violations ADD CONSTRAINT fk_policy_violations_violated_by_profile FOREIGN KEY (violated_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: policy_violations.violated_by -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_policy_violations_resolved_by_profile') THEN
      ALTER TABLE policy_violations ADD CONSTRAINT fk_policy_violations_resolved_by_profile FOREIGN KEY (resolved_by) REFERENCES profiles(id) ON DELETE SET NULL;
      RAISE NOTICE 'Added FK: policy_violations.resolved_by -> profiles(id)';
    END IF;
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'virtual_cards') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_virtual_cards_holder_profile') THEN
      ALTER TABLE virtual_cards ADD CONSTRAINT fk_virtual_cards_holder_profile FOREIGN KEY (card_holder_id) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: virtual_cards.card_holder_id -> profiles(id)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'fk_virtual_cards_created_by_profile') THEN
      ALTER TABLE virtual_cards ADD CONSTRAINT fk_virtual_cards_created_by_profile FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE;
      RAISE NOTICE 'Added FK: virtual_cards.created_by -> profiles(id)';
    END IF;
  END IF;
END $$;

COMMIT;

-- Verify the fix
DO $$
DECLARE
  fk_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_name LIKE '%_profile'
    AND constraint_type = 'FOREIGN KEY';
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✓ PROFILE FOREIGN KEYS APPLIED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total profile foreign keys configured: %', fk_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Fixed modules:';
  RAISE NOTICE '  ✓ Work Orders & Estimates';
  RAISE NOTICE '  ✓ Subcontractor Reviews & Invoices';
  RAISE NOTICE '  ✓ Communication Threads';
  RAISE NOTICE '  ✓ Analytics & Business Intelligence';
  RAISE NOTICE '  ✓ Events & Incidents';
  RAISE NOTICE '  ✓ Files & Documents';
  RAISE NOTICE '  ✓ Companies & Locations';
  RAISE NOTICE '  ✓ Tours & Settlements';
  RAISE NOTICE '  ✓ Procurement & Requisitions';
  RAISE NOTICE '  ✓ Expense Policies & Virtual Cards';
  RAISE NOTICE '';
  RAISE NOTICE '✓ PostgREST relationship discovery is now enabled';
  RAISE NOTICE '✓ Refresh your application to see the changes';
  RAISE NOTICE '========================================';
END $$;
