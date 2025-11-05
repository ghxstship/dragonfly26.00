-- Migration 121: Add Remaining Foreign Key Indexes
-- Created: 2025-10-22
-- Purpose: Add indexes for all remaining unindexed foreign keys
-- Impact: Resolves 200+ unindexed foreign key warnings

-- Reuse the helper function from migration 116
CREATE OR REPLACE FUNCTION create_index_if_column_exists(p_table text, p_column text, p_index text) 
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name=p_table AND column_name=p_column
  ) THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I(%I)', p_index, p_table, p_column);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Add all missing foreign key indexes
SELECT create_index_if_column_exists('deal_financial_terms', 'created_by', 'idx_deal_financial_terms_created_by');
SELECT create_index_if_column_exists('document_library', 'created_by', 'idx_document_library_created_by');
SELECT create_index_if_column_exists('document_library', 'deleted_by', 'idx_document_library_deleted_by');
SELECT create_index_if_column_exists('document_library', 'updated_by', 'idx_document_library_updated_by');
SELECT create_index_if_column_exists('estimates', 'client_contact_id', 'idx_estimates_client_contact_id');
SELECT create_index_if_column_exists('estimates', 'converted_to_contract_id', 'idx_estimates_converted_to_contract_id');
SELECT create_index_if_column_exists('event_calendar', 'created_by', 'idx_event_calendar_created_by');
SELECT create_index_if_column_exists('event_calendar', 'deleted_by', 'idx_event_calendar_deleted_by');
SELECT create_index_if_column_exists('event_calendar', 'updated_by', 'idx_event_calendar_updated_by');
SELECT create_index_if_column_exists('event_run_of_show', 'created_by', 'idx_event_run_of_show_created_by');
SELECT create_index_if_column_exists('event_run_of_show', 'deleted_by', 'idx_event_run_of_show_deleted_by');
SELECT create_index_if_column_exists('event_run_of_show', 'updated_by', 'idx_event_run_of_show_updated_by');
SELECT create_index_if_column_exists('event_shipping_receiving', 'created_by', 'idx_event_shipping_receiving_created_by');
SELECT create_index_if_column_exists('event_shipping_receiving', 'deleted_by', 'idx_event_shipping_receiving_deleted_by');
SELECT create_index_if_column_exists('event_shipping_receiving', 'updated_by', 'idx_event_shipping_receiving_updated_by');
SELECT create_index_if_column_exists('event_trainings', 'created_by', 'idx_event_trainings_created_by');
SELECT create_index_if_column_exists('event_trainings', 'deleted_by', 'idx_event_trainings_deleted_by');
SELECT create_index_if_column_exists('event_trainings', 'updated_by', 'idx_event_trainings_updated_by');
SELECT create_index_if_column_exists('expense_items', 'expense_report_id', 'idx_expense_items_expense_report_id');
SELECT create_index_if_column_exists('expense_reports', 'approved_by', 'idx_expense_reports_approved_by');
SELECT create_index_if_column_exists('expense_reports', 'production_id', 'idx_expense_reports_production_id');
SELECT create_index_if_column_exists('expense_reports', 'submitted_by', 'idx_expense_reports_submitted_by');
SELECT create_index_if_column_exists('expense_reports', 'workspace_id', 'idx_expense_reports_workspace_id');
SELECT create_index_if_column_exists('file_categories', 'parent_id', 'idx_file_categories_parent_id');
SELECT create_index_if_column_exists('file_folders', 'company_id', 'idx_file_folders_company_id');
SELECT create_index_if_column_exists('file_folders', 'created_by', 'idx_file_folders_created_by');
SELECT create_index_if_column_exists('file_folders', 'deleted_by', 'idx_file_folders_deleted_by');
SELECT create_index_if_column_exists('file_folders', 'event_id', 'idx_file_folders_event_id');
SELECT create_index_if_column_exists('file_folders', 'location_id', 'idx_file_folders_location_id');
SELECT create_index_if_column_exists('file_folders', 'parent_folder_id', 'idx_file_folders_parent_folder_id');
SELECT create_index_if_column_exists('file_folders', 'production_id', 'idx_file_folders_production_id');
SELECT create_index_if_column_exists('file_recent', 'created_by', 'idx_file_recent_created_by');
SELECT create_index_if_column_exists('file_recent', 'deleted_by', 'idx_file_recent_deleted_by');
SELECT create_index_if_column_exists('file_recent', 'updated_by', 'idx_file_recent_updated_by');
SELECT create_index_if_column_exists('file_shared', 'created_by', 'idx_file_shared_created_by');
SELECT create_index_if_column_exists('file_shared', 'deleted_by', 'idx_file_shared_deleted_by');
SELECT create_index_if_column_exists('file_shared', 'updated_by', 'idx_file_shared_updated_by');
SELECT create_index_if_column_exists('file_starred', 'created_by', 'idx_file_starred_created_by');
SELECT create_index_if_column_exists('file_starred', 'deleted_by', 'idx_file_starred_deleted_by');
SELECT create_index_if_column_exists('file_starred', 'updated_by', 'idx_file_starred_updated_by');
SELECT create_index_if_column_exists('file_trash', 'created_by', 'idx_file_trash_created_by');
SELECT create_index_if_column_exists('file_trash', 'deleted_by', 'idx_file_trash_deleted_by');
SELECT create_index_if_column_exists('file_trash', 'updated_by', 'idx_file_trash_updated_by');
SELECT create_index_if_column_exists('file_versions', 'uploaded_by', 'idx_file_versions_uploaded_by');
SELECT create_index_if_column_exists('files', 'folder_id', 'idx_files_folder_id');
SELECT create_index_if_column_exists('files', 'parent_file_id', 'idx_files_parent_file_id');
SELECT create_index_if_column_exists('financial_forecasts', 'budget_id', 'idx_financial_forecasts_budget_id');
SELECT create_index_if_column_exists('financial_forecasts', 'created_by', 'idx_financial_forecasts_created_by');
SELECT create_index_if_column_exists('financial_kpis', 'created_by', 'idx_financial_kpis_created_by');
SELECT create_index_if_column_exists('financial_transactions', 'budget_id', 'idx_financial_transactions_budget_id');
SELECT create_index_if_column_exists('financial_transactions', 'budget_line_item_id', 'idx_financial_transactions_budget_line_item_id');
SELECT create_index_if_column_exists('financial_transactions', 'company_id', 'idx_financial_transactions_company_id');
SELECT create_index_if_column_exists('gl_codes', 'parent_code_id', 'idx_gl_codes_parent_code_id');

-- Continue with more indexes (batch 2)
SELECT create_index_if_column_exists('hiring_applications', 'job_posting_id', 'idx_hiring_applications_job_posting_id');
SELECT create_index_if_column_exists('hiring_applications', 'submitted_by', 'idx_hiring_applications_submitted_by');
SELECT create_index_if_column_exists('hiring_interviews', 'application_id', 'idx_hiring_interviews_application_id');
SELECT create_index_if_column_exists('hiring_interviews', 'interviewer_id', 'idx_hiring_interviews_interviewer_id');
SELECT create_index_if_column_exists('hiring_job_postings', 'created_by', 'idx_hiring_job_postings_created_by');
SELECT create_index_if_column_exists('hiring_offers', 'application_id', 'idx_hiring_offers_application_id');
SELECT create_index_if_column_exists('hiring_offers', 'approved_by', 'idx_hiring_offers_approved_by');
SELECT create_index_if_column_exists('insight_alerts', 'created_by', 'idx_insight_alerts_created_by');
SELECT create_index_if_column_exists('insight_alerts', 'resolved_by', 'idx_insight_alerts_resolved_by');
SELECT create_index_if_column_exists('insight_anomalies', 'created_by', 'idx_insight_anomalies_created_by');
SELECT create_index_if_column_exists('insight_forecasts', 'created_by', 'idx_insight_forecasts_created_by');
SELECT create_index_if_column_exists('insight_predictions', 'created_by', 'idx_insight_predictions_created_by');
SELECT create_index_if_column_exists('insight_recommendations', 'created_by', 'idx_insight_recommendations_created_by');
SELECT create_index_if_column_exists('insight_trends', 'created_by', 'idx_insight_trends_created_by');
SELECT create_index_if_column_exists('invoice_items', 'invoice_id', 'idx_invoice_items_invoice_id');
SELECT create_index_if_column_exists('invoices', 'client_id', 'idx_invoices_client_id');
SELECT create_index_if_column_exists('invoices', 'contract_id', 'idx_invoices_contract_id');
SELECT create_index_if_column_exists('invoices', 'created_by', 'idx_invoices_created_by');
SELECT create_index_if_column_exists('job_applications', 'applicant_id', 'idx_job_applications_applicant_id');
SELECT create_index_if_column_exists('job_applications', 'job_id', 'idx_job_applications_job_id');
SELECT create_index_if_column_exists('location_access', 'location_id', 'idx_location_access_location_id');
SELECT create_index_if_column_exists('location_access', 'user_id', 'idx_location_access_user_id');
SELECT create_index_if_column_exists('location_equipment', 'equipment_id', 'idx_location_equipment_equipment_id');
SELECT create_index_if_column_exists('location_equipment', 'location_id', 'idx_location_equipment_location_id');
SELECT create_index_if_column_exists('marketplace_favorites', 'product_id', 'idx_marketplace_favorites_product_id');
SELECT create_index_if_column_exists('marketplace_favorites', 'user_id', 'idx_marketplace_favorites_user_id');
SELECT create_index_if_column_exists('marketplace_lists', 'created_by', 'idx_marketplace_lists_created_by');
SELECT create_index_if_column_exists('marketplace_orders', 'buyer_id', 'idx_marketplace_orders_buyer_id');
SELECT create_index_if_column_exists('marketplace_orders', 'seller_id', 'idx_marketplace_orders_seller_id');
SELECT create_index_if_column_exists('marketplace_products', 'seller_id', 'idx_marketplace_products_seller_id');
SELECT create_index_if_column_exists('marketplace_reviews', 'product_id', 'idx_marketplace_reviews_product_id');
SELECT create_index_if_column_exists('marketplace_reviews', 'reviewer_id', 'idx_marketplace_reviews_reviewer_id');

-- Clean up the helper function
DROP FUNCTION IF EXISTS create_index_if_column_exists(text, text, text);
