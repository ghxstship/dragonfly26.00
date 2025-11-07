#!/usr/bin/env node

/**
 * Generate Safe Index Migration
 * Purpose: Create indexes only for columns that actually exist
 * Date: 2025-10-21
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const foreignKeyIndexes = [
  { table: 'activations', column: 'created_by', index: 'idx_activations_created_by' },
  { table: 'activations', column: 'updated_by', index: 'idx_activations_updated_by' },
  { table: 'agreements', column: 'approved_by', index: 'idx_agreements_approved_by' },
  { table: 'agreements', column: 'created_by', index: 'idx_agreements_created_by' },
  { table: 'ai_recommendations', column: 'reviewed_by', index: 'idx_ai_recommendations_reviewed_by' },
  { table: 'analytics_comparisons', column: 'created_by', index: 'idx_analytics_comparisons_created_by' },
  { table: 'analytics_comparisons', column: 'deleted_by', index: 'idx_analytics_comparisons_deleted_by' },
  { table: 'analytics_comparisons', column: 'updated_by', index: 'idx_analytics_comparisons_updated_by' },
  { table: 'analytics_custom_views', column: 'created_by', index: 'idx_analytics_custom_views_created_by' },
  { table: 'analytics_custom_views', column: 'deleted_by', index: 'idx_analytics_custom_views_deleted_by' },
  { table: 'analytics_custom_views', column: 'updated_by', index: 'idx_analytics_custom_views_updated_by' },
  { table: 'analytics_metrics_library', column: 'created_by', index: 'idx_analytics_metrics_library_created_by' },
  { table: 'analytics_metrics_library', column: 'deleted_by', index: 'idx_analytics_metrics_library_deleted_by' },
  { table: 'analytics_metrics_library', column: 'updated_by', index: 'idx_analytics_metrics_library_updated_by' },
  { table: 'analytics_pivot_tables', column: 'created_by', index: 'idx_analytics_pivot_tables_created_by' },
  { table: 'analytics_pivot_tables', column: 'deleted_by', index: 'idx_analytics_pivot_tables_deleted_by' },
  { table: 'analytics_pivot_tables', column: 'updated_by', index: 'idx_analytics_pivot_tables_updated_by' },
  { table: 'analytics_trends', column: 'created_by', index: 'idx_analytics_trends_created_by' },
  { table: 'analytics_trends', column: 'deleted_by', index: 'idx_analytics_trends_deleted_by' },
  { table: 'analytics_trends', column: 'updated_by', index: 'idx_analytics_trends_updated_by' },
  { table: 'analytics_views', column: 'created_by', index: 'idx_analytics_views_created_by' },
  { table: 'analytics_views', column: 'data_source_id', index: 'idx_analytics_views_data_source_id' },
  { table: 'approval_chains', column: 'created_by', index: 'idx_approval_chains_created_by' },
  { table: 'approval_chains', column: 'escalation_user_id', index: 'idx_approval_chains_escalation_user_id' },
  { table: 'approval_requests', column: 'approved_by', index: 'idx_approval_requests_approved_by' },
  { table: 'approval_requests', column: 'current_approver', index: 'idx_approval_requests_current_approver' },
  { table: 'approval_requests', column: 'requested_by', index: 'idx_approval_requests_requested_by' },
  { table: 'approval_workflows', column: 'created_by', index: 'idx_approval_workflows_created_by' },
  { table: 'asset_maintenance', column: 'performed_by', index: 'idx_asset_maintenance_performed_by' },
  { table: 'asset_maintenance', column: 'vendor_id', index: 'idx_asset_maintenance_vendor_id' },
  { table: 'asset_transactions', column: 'performed_by', index: 'idx_asset_transactions_performed_by' },
  { table: 'asset_transactions', column: 'from_location_id', index: 'idx_asset_transactions_from_location' },
  { table: 'asset_transactions', column: 'to_location_id', index: 'idx_asset_transactions_to_location' },
  { table: 'assets', column: 'created_by', index: 'idx_assets_created_by' },
  { table: 'automated_financial_rules', column: 'created_by', index: 'idx_automated_financial_rules_created_by' },
  { table: 'automations', column: 'created_by', index: 'idx_automations_created_by' },
  { table: 'automations', column: 'deleted_by', index: 'idx_automations_deleted_by' },
  { table: 'automations', column: 'updated_by', index: 'idx_automations_updated_by' },
  { table: 'bids', column: 'production_id', index: 'idx_bids_production_id' },
  { table: 'bookings', column: 'created_by', index: 'idx_bookings_created_by' },
  { table: 'budget_scenarios', column: 'created_by', index: 'idx_budget_scenarios_created_by' },
  { table: 'budget_variance_tracking', column: 'analyzed_by', index: 'idx_budget_variance_tracking_analyzed_by' },
  { table: 'budget_variance_tracking', column: 'budget_line_item_id', index: 'idx_budget_variance_tracking_budget_line_item_id' },
  { table: 'cash_flow_projections', column: 'created_by', index: 'idx_cash_flow_projections_created_by' },
  { table: 'checklist_items', column: 'completed_by', index: 'idx_checklist_items_completed_by' },
  { table: 'checklist_templates', column: 'created_by', index: 'idx_checklist_templates_created_by' },
  { table: 'checklists', column: 'template_id', index: 'idx_checklists_template_id' },
  { table: 'companies', column: 'created_by', index: 'idx_companies_created_by' },
  { table: 'company_contacts', column: 'created_by', index: 'idx_company_contacts_created_by' },
  { table: 'compliance_docs', column: 'uploaded_by', index: 'idx_compliance_docs_uploaded_by' },
  { table: 'compliance_docs', column: 'verified_by', index: 'idx_compliance_docs_verified_by' },
  { table: 'contracts', column: 'approved_by', index: 'idx_contracts_approved_by' },
  { table: 'contracts', column: 'created_by', index: 'idx_contracts_created_by' },
];

async function checkColumnExists(table, column) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select(column)
      .limit(0);
    
    return !error;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('Checking which columns exist...\n');
  
  const validIndexes = [];
  const invalidIndexes = [];
  
  for (const fk of foreignKeyIndexes) {
    const exists = await checkColumnExists(fk.table, fk.column);
    if (exists) {
      validIndexes.push(fk);
      console.log(`✅ ${fk.table}.${fk.column}`);
    } else {
      invalidIndexes.push(fk);
      console.log(`❌ ${fk.table}.${fk.column} - DOES NOT EXIST`);
    }
  }
  
  console.log(`\n\nValid: ${validIndexes.length}`);
  console.log(`Invalid: ${invalidIndexes.length}`);
  
  // Generate SQL
  let sql = `-- Migration 105: Fix Unindexed Foreign Keys (Safe Version)
-- Created: 2025-10-21
-- Only creates indexes for columns that actually exist

`;
  
  validIndexes.forEach(fk => {
    sql += `CREATE INDEX IF NOT EXISTS ${fk.index} ON ${fk.table}(${fk.column});\n`;
  });
  
  sql += `\n-- ANALYZE tables\n`;
  const uniqueTables = [...new Set(validIndexes.map(fk => fk.table))];
  uniqueTables.forEach(table => {
    sql += `ANALYZE ${table};\n`;
  });
  
  console.log('\n\nGenerated SQL saved to: 105_fix_unindexed_foreign_keys_safe.sql');
  require('fs').writeFileSync(
    '/Users/julianclarkson/Documents/Dragonfly26.00/supabase/migrations/105_fix_unindexed_foreign_keys_safe.sql',
    sql
  );
}

main().catch(console.error);
