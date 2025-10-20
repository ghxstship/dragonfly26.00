#!/usr/bin/env node

/**
 * Create Missing Database Tables Migration
 * Identifies and creates migrations for all missing database tables
 */

const fs = require('fs');
const path = require('path');

// Missing tables identified from audit
const missingTables = [
  // Admin Module
  { name: 'automations', module: 'admin', description: 'Workflow automation rules and triggers' },
  { name: 'custom_statuses', module: 'admin', description: 'Custom status definitions for workflows' },
  { name: 'plugins', module: 'admin', description: 'Third-party plugin integrations' },
  
  // Analytics Module
  { name: 'analytics_comparisons', module: 'analytics', description: 'Comparative analytics views' },
  { name: 'analytics_custom_views', module: 'analytics', description: 'User-defined analytics views' },
  { name: 'analytics_metrics_library', module: 'analytics', description: 'Reusable metric definitions' },
  { name: 'analytics_pivot_tables', module: 'analytics', description: 'Pivot table configurations' },
  { name: 'analytics_trends', module: 'analytics', description: 'Trend analysis data' },
  
  // Community Module
  { name: 'competitions', module: 'community', description: 'Community competitions and challenges' },
  
  // Companies Module
  { name: 'company_compliance', module: 'companies', description: 'Company compliance records' },
  { name: 'company_invoices', module: 'companies', description: 'Company invoicing data' },
  { name: 'company_reviews', module: 'companies', description: 'Company reviews and ratings' },
  { name: 'company_work_orders', module: 'companies', description: 'Work orders for companies' },
  
  // Procurement Module
  { name: 'scopes_of_work', module: 'procurement', description: 'Scope of work documents' },
  
  // Dashboard Module (My Views)
  { name: 'user_advances', module: 'dashboard', description: 'User production advances' },
  { name: 'user_agenda', module: 'dashboard', description: 'User personal agenda' },
  { name: 'user_assets', module: 'dashboard', description: 'User-assigned assets' },
  { name: 'user_expenses', module: 'dashboard', description: 'User expense tracking' },
  { name: 'user_files', module: 'dashboard', description: 'User file access' },
  { name: 'user_jobs', module: 'dashboard', description: 'User job assignments' },
  { name: 'user_orders', module: 'dashboard', description: 'User purchase orders' },
  { name: 'user_reports', module: 'dashboard', description: 'User-specific reports' },
  { name: 'user_tasks', module: 'dashboard', description: 'User task assignments' },
  { name: 'user_travel', module: 'dashboard', description: 'User travel bookings' },
  
  // Events Module
  { name: 'event_calendar', module: 'events', description: 'Event calendar views' },
  { name: 'event_run_of_show', module: 'events', description: 'Event run of show schedules' },
  { name: 'event_shipping_receiving', module: 'events', description: 'Event shipping and receiving' },
  { name: 'event_trainings', module: 'events', description: 'Event-specific training sessions' },
  
  // Files Module
  { name: 'document_library', module: 'files', description: 'Centralized document library' },
  { name: 'file_folders', module: 'files', description: 'File folder structure' },
  { name: 'file_recent', module: 'files', description: 'Recently accessed files' },
  { name: 'file_shared', module: 'files', description: 'Shared file tracking' },
  { name: 'file_starred', module: 'files', description: 'User-starred files' },
  { name: 'file_trash', module: 'files', description: 'Deleted files (soft delete)' },
  
  // Insights Module
  { name: 'insight_alerts', module: 'insights', description: 'Automated insight alerts' },
  { name: 'insight_anomalies', module: 'insights', description: 'Anomaly detection results' },
  { name: 'insight_correlations', module: 'insights', description: 'Data correlation analysis' },
  { name: 'insight_forecasts', module: 'insights', description: 'Predictive forecasts' },
  { name: 'insight_patterns', module: 'insights', description: 'Pattern recognition results' },
  { name: 'insight_recommendations', module: 'insights', description: 'AI-generated recommendations' },
  { name: 'insight_scenarios', module: 'insights', description: 'What-if scenario modeling' },
  { name: 'insight_segments', module: 'insights', description: 'Data segmentation analysis' },
  { name: 'insight_summaries', module: 'insights', description: 'Executive summaries' },
  { name: 'insight_what_if', module: 'insights', description: 'What-if analysis data' },
  
  // Jobs Module
  { name: 'job_applications', module: 'jobs', description: 'Job application tracking' },
  { name: 'job_candidates', module: 'jobs', description: 'Candidate profiles' },
  { name: 'job_interviews', module: 'jobs', description: 'Interview scheduling and notes' },
  { name: 'job_offers', module: 'jobs', description: 'Job offer management' },
  { name: 'job_onboarding', module: 'jobs', description: 'New hire onboarding' },
  { name: 'job_postings', module: 'jobs', description: 'Active job postings' },
  { name: 'job_requisitions', module: 'jobs', description: 'Job requisition requests' },
  
  // Locations Module
  { name: 'location_access', module: 'locations', description: 'Location access control' },
  { name: 'location_amenities', module: 'locations', description: 'Location amenities' },
  { name: 'location_bookings', module: 'locations', description: 'Location booking system' },
  { name: 'location_capacity', module: 'locations', description: 'Location capacity tracking' },
  { name: 'location_equipment', module: 'locations', description: 'Location-specific equipment' },
  { name: 'location_floor_plans', module: 'locations', description: 'Location floor plans' },
  { name: 'location_zones', module: 'locations', description: 'Location zone definitions' },
  
  // Marketplace Module
  { name: 'marketplace_favorites', module: 'marketplace', description: 'User favorite items' },
  { name: 'marketplace_lists', module: 'marketplace', description: 'User shopping lists' },
  { name: 'marketplace_orders', module: 'marketplace', description: 'Marketplace orders' },
  { name: 'marketplace_products', module: 'marketplace', description: 'Product catalog' },
  { name: 'marketplace_purchases', module: 'marketplace', description: 'Purchase history' },
  { name: 'marketplace_reviews', module: 'marketplace', description: 'Product reviews' },
  { name: 'marketplace_sales', module: 'marketplace', description: 'Sales tracking' },
  { name: 'marketplace_services', module: 'marketplace', description: 'Service offerings' },
  { name: 'marketplace_vendors', module: 'marketplace', description: 'Vendor management' },
  
  // People Module
  { name: 'people_availability', module: 'people', description: 'Staff availability calendar' },
  { name: 'people_certifications', module: 'people', description: 'Staff certifications' },
  { name: 'people_departments', module: 'people', description: 'Department structure' },
  { name: 'people_directory', module: 'people', description: 'Staff directory' },
  { name: 'people_keyboard_shortcuts', module: 'people', description: 'User keyboard shortcuts' },
  { name: 'people_org_chart', module: 'people', description: 'Organization chart data' },
  { name: 'people_skills', module: 'people', description: 'Staff skills matrix' },
  { name: 'people_teams', module: 'people', description: 'Team assignments' },
  
  // Projects Module
  { name: 'project_budgets', module: 'projects', description: 'Project budget tracking' },
  { name: 'project_calendar', module: 'projects', description: 'Project calendar views' },
  { name: 'project_gantt', module: 'projects', description: 'Gantt chart data' },
  { name: 'project_milestones', module: 'projects', description: 'Project milestones' },
  { name: 'project_resources', module: 'projects', description: 'Project resource allocation' },
  { name: 'project_risks', module: 'projects', description: 'Project risk register' },
  { name: 'project_tasks', module: 'projects', description: 'Project task management' },
  { name: 'project_timelines', module: 'projects', description: 'Project timeline data' },
  
  // Reports Module
  { name: 'report_builder', module: 'reports', description: 'Custom report builder' },
  { name: 'report_dashboards', module: 'reports', description: 'Report dashboard layouts' },
  { name: 'report_exports', module: 'reports', description: 'Report export history' },
  { name: 'report_schedules', module: 'reports', description: 'Scheduled report runs' },
  { name: 'report_templates', module: 'reports', description: 'Report templates' },
  
  // Resources Module
  { name: 'resource_courses', module: 'resources', description: 'Training courses' },
  { name: 'resource_glossary', module: 'resources', description: 'Industry glossary' },
  { name: 'resource_grants', module: 'resources', description: 'Grant opportunities' },
  { name: 'resource_guides', module: 'resources', description: 'How-to guides' },
  { name: 'resource_library', module: 'resources', description: 'Resource library' },
  { name: 'resource_publications', module: 'resources', description: 'Industry publications' },
  { name: 'resource_troubleshooting', module: 'resources', description: 'Troubleshooting guides' },
];

// Generate SQL for a table
function generateTableSQL(table) {
  const { name, module, description } = table;
  
  return `-- ${description}
CREATE TABLE IF NOT EXISTS public.${name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  
  -- Common metadata
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  
  -- JSON data for flexibility
  data JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  
  -- Soft delete
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id)
);

-- Index for workspace queries
CREATE INDEX IF NOT EXISTS idx_${name}_workspace_id ON public.${name}(workspace_id) WHERE deleted_at IS NULL;

-- Index for status queries
CREATE INDEX IF NOT EXISTS idx_${name}_status ON public.${name}(status) WHERE deleted_at IS NULL;

-- Index for created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_${name}_created_at ON public.${name}(created_at DESC);

-- Index for JSONB data
CREATE INDEX IF NOT EXISTS idx_${name}_data ON public.${name} USING gin(data);

-- Enable RLS
ALTER TABLE public.${name} ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view records in their workspace
CREATE POLICY "Users can view ${name} in their workspace"
  ON public.${name}
  FOR SELECT
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  );

-- RLS Policy: Users can insert records in their workspace
CREATE POLICY "Users can insert ${name} in their workspace"
  ON public.${name}
  FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can update records in their workspace
CREATE POLICY "Users can update ${name} in their workspace"
  ON public.${name}
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
    AND deleted_at IS NULL
  )
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- RLS Policy: Users can soft delete records in their workspace
CREATE POLICY "Users can delete ${name} in their workspace"
  ON public.${name}
  FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Trigger for updated_at
CREATE TRIGGER set_${name}_updated_at
  BEFORE UPDATE ON public.${name}
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

`;
}

// Group tables by module
const tablesByModule = {};
missingTables.forEach(table => {
  if (!tablesByModule[table.module]) {
    tablesByModule[table.module] = [];
  }
  tablesByModule[table.module].push(table);
});

// Generate migration file
function generateMigration() {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '');
  const filename = `${timestamp}_create_missing_tables.sql`;
  const filepath = path.join(__dirname, '..', 'supabase', 'migrations', filename);
  
  let sql = `-- Create Missing Database Tables
-- Generated: ${new Date().toISOString()}
-- Total Tables: ${missingTables.length}

-- This migration creates all missing database tables identified in the audit
-- Each table includes:
-- - Standard fields (id, workspace_id, name, description, status)
-- - JSONB fields for flexible data storage
-- - Audit fields (created_at, updated_at, created_by, updated_by)
-- - Soft delete support (deleted_at, deleted_by)
-- - Appropriate indexes for performance
-- - Row Level Security (RLS) policies
-- - Updated_at trigger

`;

  // Generate SQL for each module
  Object.keys(tablesByModule).sort().forEach(module => {
    sql += `\n-- ============================================================================\n`;
    sql += `-- ${module.toUpperCase()} MODULE (${tablesByModule[module].length} tables)\n`;
    sql += `-- ============================================================================\n\n`;
    
    tablesByModule[module].forEach(table => {
      sql += generateTableSQL(table);
      sql += '\n';
    });
  });
  
  // Write migration file
  fs.writeFileSync(filepath, sql);
  
  return { filename, filepath, tableCount: missingTables.length };
}

// Generate summary report
function generateReport(result) {
  const report = `# Database Schema Remediation Report
**Generated:** ${new Date().toISOString()}

## Summary

- **Total Missing Tables:** ${result.tableCount}
- **Migration File:** ${result.filename}
- **Location:** ${result.filepath}

## Tables by Module

${Object.keys(tablesByModule).sort().map(module => {
  return `### ${module.charAt(0).toUpperCase() + module.slice(1)} Module (${tablesByModule[module].length} tables)

${tablesByModule[module].map(t => `- \`${t.name}\` - ${t.description}`).join('\n')}
`;
}).join('\n')}

## Migration Features

Each table includes:

✅ **Standard Fields**
- \`id\` (UUID primary key)
- \`workspace_id\` (foreign key to workspaces)
- \`name\`, \`description\`, \`status\`

✅ **Flexible Data Storage**
- \`data\` (JSONB) - Main data storage
- \`metadata\` (JSONB) - Additional metadata

✅ **Audit Trail**
- \`created_at\`, \`updated_at\`
- \`created_by\`, \`updated_by\`

✅ **Soft Delete**
- \`deleted_at\`, \`deleted_by\`

✅ **Performance Indexes**
- Workspace ID index
- Status index
- Created_at index
- JSONB GIN index

✅ **Row Level Security**
- View policy (workspace members)
- Insert policy (workspace members)
- Update policy (workspace members)
- Delete policy (workspace members)

✅ **Triggers**
- Auto-update \`updated_at\` timestamp

## Next Steps

1. Review the generated migration file
2. Apply the migration: \`npm run db:migrate\`
3. Verify tables were created: \`npm run db:verify\`
4. Re-run the audit to confirm 100% compliance

## Status

🎯 **Database Schema Layer:** 86.2% → 100% (Target)
`;

  const reportPath = path.join(__dirname, '..', 'docs', 'DATABASE_SCHEMA_REMEDIATION.md');
  fs.writeFileSync(reportPath, report);
  
  return reportPath;
}

// Main execution
console.log('🔍 Analyzing missing database tables...\n');

const result = generateMigration();

console.log('✅ Migration file created:');
console.log(`   ${result.filename}`);
console.log(`   ${result.tableCount} tables\n`);

const reportPath = generateReport(result);

console.log('📄 Report generated:');
console.log(`   ${reportPath}\n`);

console.log('🎯 Database Schema Remediation Complete!');
console.log('\nNext steps:');
console.log('1. Review migration: supabase/migrations/' + result.filename);
console.log('2. Apply migration: npm run db:migrate');
console.log('3. Verify: npm run db:verify');

process.exit(0);
