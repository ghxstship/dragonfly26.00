/**
 * Maps module tabs to their corresponding database tables
 * Used by CreateItemDialogEnhanced for direct database integration
 */

export interface TableMapping {
  tableName: string
  requiresWorkspaceId?: boolean
  requiresUserId?: boolean
}

export function getTableMapping(moduleId: string, tabSlug: string): TableMapping | null {
  const mappings: Record<string, Record<string, TableMapping>> = {
    // Dashboard
    dashboard: {
      'my-agenda': { tableName: 'events', requiresWorkspaceId: true, requiresUserId: true },
      'my-jobs': { tableName: 'user_contracts', requiresWorkspaceId: true, requiresUserId: true },
      'my-tasks': { tableName: 'project_tasks', requiresWorkspaceId: true, requiresUserId: true },
      'my-assets': { tableName: 'personal_assets', requiresWorkspaceId: true, requiresUserId: true },
      'my-orders': { tableName: 'marketplace_orders', requiresWorkspaceId: true, requiresUserId: true },
      'my-advances': { tableName: 'production_advances', requiresWorkspaceId: true, requiresUserId: true },
      'my-travel': { tableName: 'travel_arrangements', requiresWorkspaceId: true, requiresUserId: true },
      'my-expenses': { tableName: 'expense_reports', requiresWorkspaceId: true, requiresUserId: true },
      'my-reports': { tableName: 'saved_reports', requiresWorkspaceId: true, requiresUserId: true },
      'my-files': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Projects
    projects: {
      'productions': { tableName: 'productions', requiresWorkspaceId: true, requiresUserId: true },
      'activations': { tableName: 'activations', requiresWorkspaceId: true, requiresUserId: true },
      'tasks': { tableName: 'project_tasks', requiresWorkspaceId: true, requiresUserId: true },
      'milestones': { tableName: 'project_milestones', requiresWorkspaceId: true, requiresUserId: true },
      'compliance': { tableName: 'compliance_items', requiresWorkspaceId: true, requiresUserId: true },
      'safety': { tableName: 'safety_items', requiresWorkspaceId: true, requiresUserId: true },
      'work-orders': { tableName: 'work_orders', requiresWorkspaceId: true, requiresUserId: true },
      'projects-work-orders': { tableName: 'work_orders', requiresWorkspaceId: true, requiresUserId: true },
      'checklists': { tableName: 'checklists', requiresWorkspaceId: true, requiresUserId: true },
      'projects-checklists': { tableName: 'checklists', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Events
    events: {
      'all-events': { tableName: 'events', requiresWorkspaceId: true, requiresUserId: true },
      'activities': { tableName: 'activities', requiresWorkspaceId: true, requiresUserId: true },
      'run-of-show': { tableName: 'run_of_show', requiresWorkspaceId: true, requiresUserId: true },
      'rehearsals': { tableName: 'rehearsals', requiresWorkspaceId: true, requiresUserId: true },
      'blocks': { tableName: 'blocks', requiresWorkspaceId: true, requiresUserId: true },
      'bookings': { tableName: 'bookings', requiresWorkspaceId: true, requiresUserId: true },
      'tours': { tableName: 'tours', requiresWorkspaceId: true, requiresUserId: true },
      'itineraries': { tableName: 'itineraries', requiresWorkspaceId: true, requiresUserId: true },
      'reservations': { tableName: 'reservations', requiresWorkspaceId: true, requiresUserId: true },
      'equipment': { tableName: 'event_equipment', requiresWorkspaceId: true, requiresUserId: true },
      'shipping-receiving': { tableName: 'shipments', requiresWorkspaceId: true, requiresUserId: true },
      'trainings': { tableName: 'training_sessions', requiresWorkspaceId: true, requiresUserId: true },
      'incidents': { tableName: 'incident_reports', requiresWorkspaceId: true, requiresUserId: true },
      'internal': { tableName: 'internal_events', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // People
    people: {
      'personnel': { tableName: 'personnel', requiresWorkspaceId: true, requiresUserId: true },
      'teams': { tableName: 'teams', requiresWorkspaceId: true, requiresUserId: true },
      'assignments': { tableName: 'personnel_assignments', requiresWorkspaceId: true, requiresUserId: true },
      'timekeeping': { tableName: 'time_entries', requiresWorkspaceId: true, requiresUserId: true },
      'scheduling': { tableName: 'schedules', requiresWorkspaceId: true, requiresUserId: true },
      'training': { tableName: 'training_programs', requiresWorkspaceId: true, requiresUserId: true },
      'onboarding': { tableName: 'onboarding_records', requiresWorkspaceId: true, requiresUserId: true },
      'openings': { tableName: 'job_openings', requiresWorkspaceId: true, requiresUserId: true },
      'applicants': { tableName: 'job_applicants', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Assets
    assets: {
      'tracking': { tableName: 'asset_movements', requiresWorkspaceId: true, requiresUserId: true },
      'inventory': { tableName: 'inventory_items', requiresWorkspaceId: true, requiresUserId: true },
      'counts': { tableName: 'inventory_counts', requiresWorkspaceId: true, requiresUserId: true },
      'maintenance': { tableName: 'maintenance_records', requiresWorkspaceId: true, requiresUserId: true },
      'approvals': { tableName: 'approval_requests', requiresWorkspaceId: true, requiresUserId: true },
      'advances': { tableName: 'production_advances', requiresWorkspaceId: true, requiresUserId: true },
      'catalog': { tableName: 'asset_catalog', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Locations
    locations: {
      'directory': { tableName: 'locations', requiresWorkspaceId: true, requiresUserId: true },
      'site-maps': { tableName: 'site_maps', requiresWorkspaceId: true, requiresUserId: true },
      'access': { tableName: 'access_points', requiresWorkspaceId: true, requiresUserId: true },
      'warehousing': { tableName: 'warehouse_locations', requiresWorkspaceId: true, requiresUserId: true },
      'logistics': { tableName: 'logistics_routes', requiresWorkspaceId: true, requiresUserId: true },
      'utilities': { tableName: 'utilities', requiresWorkspaceId: true, requiresUserId: true },
      'bim-models': { tableName: 'bim_models', requiresWorkspaceId: true, requiresUserId: true },
      'coordination': { tableName: 'coordination_issues', requiresWorkspaceId: true, requiresUserId: true },
      'spatial-features': { tableName: 'spatial_features', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Files
    files: {
      'all-documents': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'contracts': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'riders': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'tech-specs': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'call-sheets': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'insurance-permits': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'media-assets': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'production-reports': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'shared': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
      'archive': { tableName: 'files', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Companies
    companies: {
      'organizations': { tableName: 'company_organizations', requiresWorkspaceId: true, requiresUserId: true },
      'contacts': { tableName: 'company_contacts', requiresWorkspaceId: true, requiresUserId: true },
      'deliverables': { tableName: 'deliverables', requiresWorkspaceId: true, requiresUserId: true },
      'scopes-of-work': { tableName: 'scopes_of_work', requiresWorkspaceId: true, requiresUserId: true },
      'documents': { tableName: 'company_documents', requiresWorkspaceId: true, requiresUserId: true },
      'bids': { tableName: 'bids', requiresWorkspaceId: true, requiresUserId: true },
      'companies-compliance': { tableName: 'company_compliance', requiresWorkspaceId: true, requiresUserId: true },
      'companies-work-orders': { tableName: 'work_orders', requiresWorkspaceId: true, requiresUserId: true },
      'companies-invoices': { tableName: 'invoices', requiresWorkspaceId: true, requiresUserId: true },
      'companies-reviews': { tableName: 'company_reviews', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Finance
    finance: {
      'budgets': { tableName: 'budgets', requiresWorkspaceId: true, requiresUserId: true },
      'transactions': { tableName: 'transactions', requiresWorkspaceId: true, requiresUserId: true },
      'revenue': { tableName: 'revenue_entries', requiresWorkspaceId: true, requiresUserId: true },
      'expenses': { tableName: 'expense_entries', requiresWorkspaceId: true, requiresUserId: true },
      'payroll': { tableName: 'payroll_entries', requiresWorkspaceId: true, requiresUserId: true },
      'reconciliation': { tableName: 'reconciliations', requiresWorkspaceId: true, requiresUserId: true },
      'payments': { tableName: 'payments', requiresWorkspaceId: true, requiresUserId: true },
      'invoices': { tableName: 'invoices', requiresWorkspaceId: true, requiresUserId: true },
      'taxes': { tableName: 'tax_documents', requiresWorkspaceId: true, requiresUserId: true },
      'policies': { tableName: 'spending_policies', requiresWorkspaceId: true, requiresUserId: true },
      'accounts': { tableName: 'account_categories', requiresWorkspaceId: true, requiresUserId: true },
      'gl-codes': { tableName: 'gl_codes', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Procurement
    procurement: {
      'orders': { tableName: 'purchase_orders', requiresWorkspaceId: true, requiresUserId: true },
      'agreements': { tableName: 'agreements', requiresWorkspaceId: true, requiresUserId: true },
      'approvals': { tableName: 'procurement_approvals', requiresWorkspaceId: true, requiresUserId: true },
      'procurement-approvals': { tableName: 'procurement_approvals', requiresWorkspaceId: true, requiresUserId: true },
      'requisitions': { tableName: 'requisitions', requiresWorkspaceId: true, requiresUserId: true },
      'line-items': { tableName: 'procurement_line_items', requiresWorkspaceId: true, requiresUserId: true },
      'audits': { tableName: 'procurement_audits', requiresWorkspaceId: true, requiresUserId: true },
      'receiving': { tableName: 'goods_receipts', requiresWorkspaceId: true, requiresUserId: true },
      'matching': { tableName: 'three_way_matching', requiresWorkspaceId: true, requiresUserId: true },
      'fulfillment': { tableName: 'order_fulfillment', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Jobs
    jobs: {
      'active': { tableName: 'jobs', requiresWorkspaceId: true, requiresUserId: true },
      'pipeline': { tableName: 'jobs', requiresWorkspaceId: true, requiresUserId: true },
      'offers': { tableName: 'job_offers', requiresWorkspaceId: true, requiresUserId: true },
      'shortlists': { tableName: 'job_shortlists', requiresWorkspaceId: true, requiresUserId: true },
      'rfps': { tableName: 'rfps', requiresWorkspaceId: true, requiresUserId: true },
      'completed': { tableName: 'jobs', requiresWorkspaceId: true, requiresUserId: true },
      'archived': { tableName: 'jobs', requiresWorkspaceId: true, requiresUserId: true },
      'work-orders': { tableName: 'work_orders', requiresWorkspaceId: true, requiresUserId: true },
      'dispatch': { tableName: 'work_order_dispatch', requiresWorkspaceId: true, requiresUserId: true },
      'estimates': { tableName: 'estimates', requiresWorkspaceId: true, requiresUserId: true },
      'jobs-invoices': { tableName: 'invoices', requiresWorkspaceId: true, requiresUserId: true },
      'jobs-compliance': { tableName: 'contractor_compliance', requiresWorkspaceId: true, requiresUserId: true },
      'checklists': { tableName: 'checklists', requiresWorkspaceId: true, requiresUserId: true },
      'recruiting': { tableName: 'contractor_recruitment', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Community
    community: {
      'news': { tableName: 'community_news', requiresWorkspaceId: true, requiresUserId: true },
      'showcase': { tableName: 'showcase_posts', requiresWorkspaceId: true, requiresUserId: true },
      'activity': { tableName: 'activity_feed', requiresWorkspaceId: true, requiresUserId: true },
      'connections': { tableName: 'connections', requiresWorkspaceId: true, requiresUserId: true },
      'studios': { tableName: 'studios', requiresWorkspaceId: true, requiresUserId: true },
      'events': { tableName: 'public_events', requiresWorkspaceId: true, requiresUserId: true },
      'discussions': { tableName: 'discussions', requiresWorkspaceId: true, requiresUserId: true },
      'competitions': { tableName: 'competitions', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Marketplace
    marketplace: {
      'shop': { tableName: 'marketplace_products', requiresWorkspaceId: true, requiresUserId: true },
      'favorites': { tableName: 'marketplace_favorites', requiresWorkspaceId: true, requiresUserId: true },
      'sales': { tableName: 'marketplace_sales', requiresWorkspaceId: true, requiresUserId: true },
      'purchases': { tableName: 'marketplace_orders', requiresWorkspaceId: true, requiresUserId: true },
      'lists': { tableName: 'shopping_lists', requiresWorkspaceId: true, requiresUserId: true },
      'products': { tableName: 'marketplace_products', requiresWorkspaceId: true, requiresUserId: true },
      'services': { tableName: 'marketplace_services', requiresWorkspaceId: true, requiresUserId: true },
      'vendors': { tableName: 'marketplace_vendors', requiresWorkspaceId: true, requiresUserId: true },
      'reviews': { tableName: 'marketplace_reviews', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Resources
    resources: {
      'library': { tableName: 'resources', requiresWorkspaceId: true, requiresUserId: true },
      'guides': { tableName: 'resource_guides', requiresWorkspaceId: true, requiresUserId: true },
      'courses': { tableName: 'courses', requiresWorkspaceId: true, requiresUserId: true },
      'grants': { tableName: 'grants', requiresWorkspaceId: true, requiresUserId: true },
      'publications': { tableName: 'publications', requiresWorkspaceId: true, requiresUserId: true },
      'glossary': { tableName: 'glossary_terms', requiresWorkspaceId: true, requiresUserId: true },
      'troubleshooting': { tableName: 'troubleshooting_guides', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Reports
    reports: {
      'custom-builder': { tableName: 'custom_reports', requiresWorkspaceId: true, requiresUserId: true },
      'templates': { tableName: 'report_templates', requiresWorkspaceId: true, requiresUserId: true },
      'scheduled': { tableName: 'scheduled_reports', requiresWorkspaceId: true, requiresUserId: true },
      'exports': { tableName: 'report_exports', requiresWorkspaceId: true, requiresUserId: true },
      'compliance': { tableName: 'compliance_reports', requiresWorkspaceId: true, requiresUserId: true },
      'executive': { tableName: 'executive_reports', requiresWorkspaceId: true, requiresUserId: true },
      'operational': { tableName: 'operational_reports', requiresWorkspaceId: true, requiresUserId: true },
      'archived': { tableName: 'archived_reports', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Analytics
    analytics: {
      'custom-views': { tableName: 'analytics_views', requiresWorkspaceId: true, requiresUserId: true },
      'pivot-tables': { tableName: 'pivot_tables', requiresWorkspaceId: true, requiresUserId: true },
      'metrics-library': { tableName: 'saved_metrics', requiresWorkspaceId: true, requiresUserId: true },
      'data-sources': { tableName: 'data_sources', requiresWorkspaceId: true, requiresUserId: true },
    },
    
    // Insights
    insights: {
      'objectives': { tableName: 'strategic_objectives', requiresWorkspaceId: true, requiresUserId: true },
      'key-results': { tableName: 'key_results', requiresWorkspaceId: true, requiresUserId: true },
      'priorities': { tableName: 'priorities', requiresWorkspaceId: true, requiresUserId: true },
      'recommendations': { tableName: 'recommendations', requiresWorkspaceId: true, requiresUserId: true },
    },
  }

  return mappings[moduleId]?.[tabSlug] || null
}
