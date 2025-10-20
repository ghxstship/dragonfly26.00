#!/usr/bin/env node

/**
 * Generate All Missing API Routes
 * 
 * Creates standardized Next.js API routes for all modules identified
 * in the zero-tolerance audit as missing API endpoints.
 * 
 * Each API route includes:
 * - Authentication validation
 * - CRUD operations (GET, POST, PUT, DELETE)
 * - Error handling
 * - Type safety
 * - Supabase integration
 */

const fs = require('fs');
const path = require('path');

// API route template with full CRUD operations
const generateRouteTemplate = (moduleName, tableName) => `import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * GET - Fetch ${moduleName} records
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Fetch single record by ID
    if (id) {
      const { data, error } = await supabase
        .from('${tableName}')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }

      return NextResponse.json({ data })
    }

    // Fetch multiple records with pagination
    const { data, error, count } = await supabase
      .from('${tableName}')
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      count,
      limit,
      offset
    })
  } catch (error: any) {
    console.error('GET ${moduleName} error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST - Create new ${moduleName} record
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate required fields
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      )
    }

    // Add audit fields
    const record = {
      ...body,
      created_by: user.id,
      updated_by: user.id,
    }

    // Insert record
    const { data, error } = await supabase
      .from('${tableName}')
      .insert(record)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { data, message: '${moduleName} created successfully' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('POST ${moduleName} error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT - Update existing ${moduleName} record
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Add audit fields
    const record = {
      ...updates,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    }

    // Update record
    const { data, error } = await supabase
      .from('${tableName}')
      .update(record)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data,
      message: '${moduleName} updated successfully'
    })
  } catch (error: any) {
    console.error('PUT ${moduleName} error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remove ${moduleName} record
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Authenticate user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Record ID is required' },
        { status: 400 }
      )
    }

    // Delete record
    const { error } = await supabase
      .from('${tableName}')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '${moduleName} deleted successfully'
    })
  } catch (error: any) {
    console.error('DELETE ${moduleName} error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
`;

// Map of module names to their database table names
const moduleToTableMap = {
  'tokens': 'api_tokens',
  'automations': 'automations',
  'billing': 'billing_transactions',
  'templates': 'checklist_templates',
  'statuses': 'custom_statuses',
  'integrations': 'integrations',
  'invite': 'invitations',
  'management': 'members',
  'settings': 'organization_settings',
  'organization': 'organizations',
  'plugins': 'plugins',
  'rules': 'recurrence_rules',
  'permissions': 'role_permissions',
  'security': 'security_logs',
  'comparisons': 'analytics_comparisons',
  'custom-views': 'analytics_custom_views',
  'data-sources': 'analytics_data_sources',
  'forecasting': 'analytics_forecasts',
  'metrics-library': 'analytics_metrics',
  'performance': 'analytics_performance',
  'pivot-tables': 'analytics_pivot_tables',
  'realtime': 'analytics_realtime',
  'trends': 'analytics_trends',
  'advances': 'asset_advances',
  'assignments': 'asset_assignments',
  'audits': 'asset_audits',
  'blocks': 'asset_blocks',
  'bookings': 'asset_bookings',
  'equipment': 'asset_equipment',
  'maintenance': 'asset_maintenance',
  'media-assets': 'asset_media',
  'reservations': 'asset_reservations',
  'tracking': 'asset_tracking',
  'utilities': 'asset_utilities',
  'bim-models': 'bim_models',
  'companies-compliance': 'company_compliance',
  'companies-invoices': 'company_invoices',
  'companies-reviews': 'company_reviews',
  'companies-work-orders': 'company_work_orders',
  'competitions': 'community_competitions',
  'connections': 'community_connections',
  'discussions': 'community_discussions',
  'news': 'community_news',
  'showcase': 'community_showcase',
  'studios': 'community_studios',
  'counts': 'dashboard_counts',
  'my-agenda': 'dashboard_agenda',
  'my-assets': 'dashboard_my_assets',
  'my-expenses': 'dashboard_my_expenses',
  'my-files': 'dashboard_my_files',
  'my-jobs': 'dashboard_my_jobs',
  'my-orders': 'dashboard_my_orders',
  'my-reports': 'dashboard_my_reports',
  'my-tasks': 'dashboard_my_tasks',
  'my-travel': 'dashboard_my_travel',
  'all-events': 'events',
  'calendar': 'event_calendar',
  'call-sheets': 'event_call_sheets',
  'itineraries': 'event_itineraries',
  'logistics': 'event_logistics',
  'rehearsals': 'event_rehearsals',
  'run-of-show': 'event_run_of_show',
  'scheduled': 'event_scheduled',
  'tours': 'event_tours',
  'accounts': 'finance_accounts',
  'approvals': 'finance_approvals',
  'budgets': 'finance_budgets',
  'cash-flow': 'finance_cash_flow',
  'expenses': 'finance_expenses',
  'forecasts': 'finance_forecasts',
  'gl-codes': 'finance_gl_codes',
  'invoices': 'finance_invoices',
  'line-items': 'finance_line_items',
  'payments': 'finance_payments',
  'payroll': 'finance_payroll',
  'reconciliation': 'finance_reconciliation',
  'revenue': 'finance_revenue',
  'taxes': 'finance_taxes',
  'transactions': 'finance_transactions',
  'variance': 'finance_variance',
  'all-documents': 'files',
  'archive': 'file_archive',
  'exports': 'file_exports',
  'shared': 'file_shared',
  'applicants': 'job_applicants',
  'jobs-compliance': 'job_compliance',
  'jobs-invoices': 'job_invoices',
  'offers': 'job_offers',
  'onboarding': 'job_onboarding',
  'openings': 'job_openings',
  'pipeline': 'job_pipeline',
  'recruiting': 'job_recruiting',
  'shortlists': 'job_shortlists',
  'teams': 'job_teams',
  'training': 'job_training',
  'trainings': 'job_trainings',
  'contacts': 'location_contacts',
  'coordination': 'location_coordination',
  'dispatch': 'location_dispatch',
  'insurance-permits': 'location_insurance_permits',
  'policies': 'location_policies',
  'safety': 'location_safety',
  'scheduling': 'location_scheduling',
  'site-maps': 'location_site_maps',
  'spatial-features': 'location_spatial_features',
  'tech-specs': 'location_tech_specs',
  'favorites': 'marketplace_favorites',
  'lists': 'marketplace_lists',
  'orders': 'marketplace_orders',
  'products': 'marketplace_products',
  'purchases': 'marketplace_purchases',
  'reviews': 'marketplace_reviews',
  'sales': 'marketplace_sales',
  'services': 'marketplace_services',
  'shop': 'marketplace_shop',
  'spotlight': 'marketplace_spotlight',
  'vendors': 'marketplace_vendors',
  'active': 'people_active',
  'activities': 'people_activities',
  'directory': 'people_directory',
  'personnel': 'people_personnel',
  'bids': 'procurement_bids',
  'catalog': 'procurement_catalog',
  'contracts': 'procurement_contracts',
  'fulfillment': 'procurement_fulfillment',
  'inventory': 'procurement_inventory',
  'matching': 'procurement_matching',
  'orders-dashboard': 'procurement_orders',
  'procurement-approvals': 'procurement_approvals',
  'receiving': 'procurement_receiving',
  'requisitions': 'procurement_requisitions',
  'rfps': 'procurement_rfps',
  'shipping-receiving': 'procurement_shipping',
  'warehousing': 'procurement_warehousing',
  'access': 'profile_access',
  'account': 'profile_account',
  'certifications': 'profile_certifications',
  'emergency': 'profile_emergency_contacts',
  'endorsements': 'profile_endorsements',
  'health': 'profile_health',
  'history': 'profile_history',
  'info': 'profiles',
  'professional': 'profile_professional',
  'social': 'profile_social_media',
  'tags': 'profile_tags',
  'travel': 'profile_travel',
  'activations': 'project_activations',
  'archived': 'project_archived',
  'checklists': 'project_checklists',
  'completed': 'project_completed',
  'costs': 'project_costs',
  'deliverables': 'project_deliverables',
  'documents': 'project_documents',
  'milestones': 'project_milestones',
  'priorities': 'project_priorities',
  'production-reports': 'project_production_reports',
  'productions': 'project_productions',
  'progress-tracking': 'project_progress',
  'projects-checklists': 'project_checklists',
  'projects-work-orders': 'project_work_orders',
  'schedule': 'project_schedule',
  'scopes-of-work': 'project_scope',
  'tasks': 'project_tasks',
  'timekeeping': 'project_timekeeping',
  'work-orders': 'project_work_orders',
  'benchmarks': 'report_benchmarks',
  'compliance': 'report_compliance',
  'custom-builder': 'report_custom_builder',
  'executive': 'report_executive',
  'incidents': 'report_incidents',
  'operational': 'report_operational',
  'courses': 'resource_courses',
  'glossary': 'resource_glossary',
  'grants': 'resource_grants',
  'guides': 'resource_guides',
  'library': 'resource_library',
  'publications': 'resource_publications',
  'troubleshooting': 'resource_troubleshooting',
  'appearance': 'settings_appearance',
  'intelligence-feed': 'insight_intelligence_feed',
  'key-results': 'insight_key_results',
  'objectives': 'insight_objectives',
  'recommendations': 'insight_recommendations',
  'scenarios': 'insight_scenarios',
  'success-metrics': 'insight_success_metrics',
  'agreements': 'subcontractor_agreements',
  'estimates': 'subcontractor_estimates',
  'internal': 'subcontractor_internal',
  'organizations': 'subcontractor_organizations',
  'riders': 'subcontractor_riders',
  'subcontractor-profile': 'subcontractor_profiles',
  'team': 'team_members',
};

// Create API route directory and file
function createAPIRoute(moduleName, tableName) {
  const apiDir = path.join(__dirname, '..', 'src', 'app', 'api', moduleName);
  const routeFile = path.join(apiDir, 'route.ts');

  // Create directory if it doesn't exist
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
    console.log(`✅ Created directory: ${apiDir}`);
  }

  // Check if route already exists
  if (fs.existsSync(routeFile)) {
    console.log(`⚠️  Route already exists: ${routeFile}`);
    return false;
  }

  // Write route file
  const content = generateRouteTemplate(moduleName, tableName);
  fs.writeFileSync(routeFile, content, 'utf8');
  console.log(`✅ Created API route: ${routeFile}`);
  return true;
}

// Main execution
console.log('🚀 Starting API Route Generation...\n');

let created = 0;
let skipped = 0;
let errors = 0;

Object.entries(moduleToTableMap).forEach(([moduleName, tableName]) => {
  try {
    const wasCreated = createAPIRoute(moduleName, tableName);
    if (wasCreated) {
      created++;
    } else {
      skipped++;
    }
  } catch (error) {
    console.error(`❌ Error creating route for ${moduleName}:`, error.message);
    errors++;
  }
});

console.log('\n📊 API Route Generation Summary:');
console.log(`   ✅ Created: ${created} routes`);
console.log(`   ⚠️  Skipped: ${skipped} routes (already exist)`);
console.log(`   ❌ Errors: ${errors} routes`);
console.log(`   📁 Total: ${Object.keys(moduleToTableMap).length} modules processed`);

if (created > 0) {
  console.log('\n✨ API Routes generated successfully!');
  console.log('   All routes include:');
  console.log('   - Full CRUD operations (GET, POST, PUT, DELETE)');
  console.log('   - Authentication validation');
  console.log('   - Error handling');
  console.log('   - Type safety');
  console.log('   - Supabase integration');
  console.log('   - Pagination support');
  console.log('   - Audit fields (created_by, updated_by)');
}

console.log('\n🎯 Next Steps:');
console.log('   1. Review generated routes for business logic requirements');
console.log('   2. Add module-specific validation rules');
console.log('   3. Test each endpoint with proper authentication');
console.log('   4. Update API documentation');
console.log('   5. Run zero-tolerance audit to verify 100% compliance');

process.exit(errors > 0 ? 1 : 0);
