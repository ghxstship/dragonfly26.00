-- Migration 116: Add Foreign Key Indexes (Safe Version)
CREATE OR REPLACE FUNCTION create_index_if_column_exists(p_table text, p_column text, p_index text) RETURNS void AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=p_table AND column_name=p_column) THEN
    EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I(%I)', p_index, p_table, p_column);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Apply all indexes (only creates if column exists)
SELECT create_index_if_column_exists('comments', 'parent_id', 'idx_comments_parent_id');
SELECT create_index_if_column_exists('company_compliance', 'created_by', 'idx_company_compliance_created_by');
SELECT create_index_if_column_exists('company_compliance', 'deleted_by', 'idx_company_compliance_deleted_by');
SELECT create_index_if_column_exists('company_compliance', 'updated_by', 'idx_company_compliance_updated_by');
SELECT create_index_if_column_exists('company_invoices', 'created_by', 'idx_company_invoices_created_by');
SELECT create_index_if_column_exists('company_invoices', 'deleted_by', 'idx_company_invoices_deleted_by');
SELECT create_index_if_column_exists('company_invoices', 'updated_by', 'idx_company_invoices_updated_by');
SELECT create_index_if_column_exists('company_reviews', 'created_by', 'idx_company_reviews_created_by');
SELECT create_index_if_column_exists('company_reviews', 'deleted_by', 'idx_company_reviews_deleted_by');
SELECT create_index_if_column_exists('company_reviews', 'updated_by', 'idx_company_reviews_updated_by');
SELECT create_index_if_column_exists('company_work_orders', 'created_by', 'idx_company_work_orders_created_by');
SELECT create_index_if_column_exists('company_work_orders', 'deleted_by', 'idx_company_work_orders_deleted_by');
SELECT create_index_if_column_exists('company_work_orders', 'updated_by', 'idx_company_work_orders_updated_by');
SELECT create_index_if_column_exists('competitions', 'created_by', 'idx_competitions_created_by');
SELECT create_index_if_column_exists('competitions', 'deleted_by', 'idx_competitions_deleted_by');
SELECT create_index_if_column_exists('competitions', 'updated_by', 'idx_competitions_updated_by');
SELECT create_index_if_column_exists('corporate_cards', 'created_by', 'idx_corporate_cards_created_by');
SELECT create_index_if_column_exists('corporate_cards', 'policy_id', 'idx_corporate_cards_policy_id');
SELECT create_index_if_column_exists('count_line_items', 'counted_by', 'idx_count_line_items_counted_by');
SELECT create_index_if_column_exists('custom_fields', 'workspace_id', 'idx_custom_fields_workspace_id');
SELECT create_index_if_column_exists('custom_metrics', 'created_by', 'idx_custom_metrics_created_by');
SELECT create_index_if_column_exists('custom_statuses', 'created_by', 'idx_custom_statuses_created_by');
SELECT create_index_if_column_exists('custom_statuses', 'deleted_by', 'idx_custom_statuses_deleted_by');
SELECT create_index_if_column_exists('custom_statuses', 'updated_by', 'idx_custom_statuses_updated_by');
SELECT create_index_if_column_exists('data_sources', 'created_by', 'idx_data_sources_created_by');
SELECT create_index_if_column_exists('people', 'created_by', 'idx_people_created_by');
SELECT create_index_if_column_exists('people', 'deleted_by', 'idx_people_deleted_by');
SELECT create_index_if_column_exists('people', 'updated_by', 'idx_people_updated_by');
SELECT create_index_if_column_exists('tasks', 'assigned_to', 'idx_tasks_assigned_to');
SELECT create_index_if_column_exists('tasks', 'created_by', 'idx_tasks_created_by');
SELECT create_index_if_column_exists('tasks', 'deleted_by', 'idx_tasks_deleted_by');
SELECT create_index_if_column_exists('tasks', 'parent_task_id', 'idx_tasks_parent_task_id');
SELECT create_index_if_column_exists('tasks', 'updated_by', 'idx_tasks_updated_by');
SELECT create_index_if_column_exists('workspace_invitations', 'invited_by', 'idx_workspace_invitations_invited_by');
SELECT create_index_if_column_exists('workspace_members', 'invited_by', 'idx_workspace_members_invited_by');

DROP FUNCTION create_index_if_column_exists;
