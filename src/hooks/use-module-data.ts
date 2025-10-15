'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Universal hook for fetching module data
 * Maps tab slugs to database tables and handles real-time subscriptions
 */

// Table mapping for all modules
const TAB_TO_TABLE_MAP: Record<string, { table: string; select?: string; orderBy?: string }> = {
  // Dashboard
  'overview': { table: 'workspaces', select: '*' },
  'my-agenda': { table: 'events', orderBy: 'start_time' },
  'my-jobs': { table: 'job_contracts', select: '*', orderBy: 'start_date' },
  'my-tasks': { table: 'project_tasks', orderBy: 'due_date' },
  'my-assets': { table: 'assets', select: '*, location:locations!location_id(name, city)', orderBy: 'name' },
  'my-orders': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'my-advances': { table: 'production_advances', select: '*, production:productions!production_id(name, status), requested_by_user:profiles!requested_by(first_name, last_name)', orderBy: 'created_at' },
  'my-travel': { table: 'travel_itineraries', select: '*, traveler:personnel!traveler_id(first_name, last_name)', orderBy: 'departure_date' },
  'my-expenses': { table: 'financial_transactions', orderBy: 'transaction_date' },
  'my-reports': { table: 'report_templates', select: '*', orderBy: 'name' },
  'my-files': { table: 'files', select: '*, category:file_categories!category_id(name)', orderBy: 'created_at' },
  
  // Projects
  'productions': { table: 'productions', select: '*', orderBy: 'created_at' },
  'activations': { table: 'productions', select: '*', orderBy: 'created_at' },
  'schedule': { table: 'project_milestones', select: '*, production:productions!production_id(name)', orderBy: 'due_date' },
  'tasks': { table: 'project_tasks', select: '*, production:productions!production_id(name), assignee:profiles!assignee_id(first_name, last_name)', orderBy: 'created_at' },
  'milestones': { table: 'project_milestones', select: '*, production:productions!production_id(name)', orderBy: 'due_date' },
  'compliance': { table: 'project_compliance', select: '*, production:productions!production_id(name)', orderBy: 'expiry_date' },
  'safety': { table: 'project_safety', select: '*, production:productions!production_id(name)', orderBy: 'created_at' },
  'projects-work-orders': { table: 'work_orders', select: '*, company:companies!company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'scheduled_start' },
  'costs': { table: 'project_costs', select: '*, production:productions!production_id(name), category:project_cost_categories!category_id(name, code), company:companies!company_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'cost_date' },
  'projects-checklists': { table: 'checklists', select: '*, template:checklist_templates!template_id(name)', orderBy: 'created_at' },
  
  // Events
  'all-events': { table: 'events', select: '*, location:locations!location_id(name, city), production:productions!production_id(name)', orderBy: 'start_time' },
  'activities': { table: 'events', select: '*, location:locations!location_id(name, city), production:productions!production_id(name)', orderBy: 'start_time' },
  'run-of-show': { table: 'run_of_show', select: '*, event:events!event_id(name, start_time)', orderBy: 'sequence_number' },
  'rehearsals': { table: 'events', select: '*, location:locations!location_id(name, city), production:productions!production_id(name)', orderBy: 'start_time' },
  'blocks': { table: 'bookings', select: '*, event:events!event_id(name), location:locations!location_id(name)', orderBy: 'start_time' },
  'bookings': { table: 'bookings', select: '*, event:events!event_id(name), location:locations!location_id(name)', orderBy: 'start_time' },
  'tours': { table: 'tours', select: '*, production:productions!production_id(name)', orderBy: 'start_date' },
  'itineraries': { table: 'travel_itineraries', select: '*, traveler:personnel!traveler_id(first_name, last_name)', orderBy: 'departure_date' },
  'reservations': { table: 'hospitality_reservations', select: '*, event:events!event_id(name)', orderBy: 'reservation_date' },
  'equipment': { table: 'assets', select: '*, location:locations!location_id(name, city)', orderBy: 'name' },
  'shipping-receiving': { table: 'shipments', select: '*, production:productions!production_id(name)', orderBy: 'ship_date' },
  'incidents': { table: 'incidents', select: '*, event:events!event_id(name), reported_by_user:profiles!reported_by(first_name, last_name)', orderBy: 'occurred_at' },
  'internal': { table: 'events', select: '*, location:locations!location_id(name, city), production:productions!production_id(name)', orderBy: 'start_time' },
  
  // People
  'personnel': { table: 'personnel', select: '*', orderBy: 'last_name' },
  'teams': { table: 'teams', select: '*, lead:personnel!leader_id(first_name, last_name)', orderBy: 'name' },
  'assignments': { table: 'personnel_assignments', select: '*, personnel:personnel!personnel_id(first_name, last_name), production:productions!production_id(name)', orderBy: 'created_at' },
  'timekeeping': { table: 'time_entries', select: '*, personnel:personnel!personnel_id(first_name, last_name)', orderBy: 'start_time' },
  'scheduling': { table: 'events', select: '*, location:locations!location_id(name, city)', orderBy: 'start_time' },
  'training': { table: 'training_records', select: '*, personnel:personnel!personnel_id(first_name, last_name)', orderBy: 'completed_date' },
  'onboarding': { table: 'personnel', select: '*', orderBy: 'created_at' },
  'openings': { table: 'job_openings', select: '*', orderBy: 'created_at' },
  'applicants': { table: 'job_applicants', select: '*, job_opening:job_openings!job_opening_id(title)', orderBy: 'applied_at' },
  
  // Assets
  'tracking': { table: 'asset_transactions', select: '*, asset:assets!asset_id(name, type), checked_out_person:personnel!checked_out_to(first_name, last_name)', orderBy: 'created_at' },
  'inventory': { table: 'assets', select: '*, location:locations!location_id(name, city)', orderBy: 'name' },
  'maintenance': { table: 'asset_maintenance', select: '*, asset:assets!asset_id(name, type, status)', orderBy: 'scheduled_date' },
  'advances': { table: 'production_advances', select: '*, production:productions!production_id(name, status), requested_by_user:profiles!requested_by(first_name, last_name)', orderBy: 'created_at' },
  'catalog': { table: 'assets', select: '*, location:locations!location_id(name, city)', orderBy: 'name' },
  
  // Locations
  'directory': { table: 'locations', select: '*', orderBy: 'name' },
  'site-maps': { table: 'site_maps', select: '*, location:locations!location_id(name, city)', orderBy: 'created_at' },
  'access': { table: 'locations', select: '*', orderBy: 'name' },
  'warehousing': { table: 'locations', select: '*', orderBy: 'name' },
  'logistics': { table: 'shipments', select: '*, production:productions!production_id(name)', orderBy: 'ship_date' },
  'utilities': { table: 'location_utilities', select: '*, location:locations!location_id(name, city)', orderBy: 'name' },
  'bim-models': { table: 'location_bim_models', select: '*, location:locations!location_id(name, city)', orderBy: 'created_at' },
  'coordination': { table: 'location_bim_clashes', select: '*, location:locations!location_id(name, city)', orderBy: 'detected_at' },
  'spatial-features': { table: 'location_features', select: '*, location:locations!location_id(name, city), layer:location_layers!layer_id(name)', orderBy: 'created_at' },
  
  // Files - Enhanced with collaboration features
  'all-documents': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url), folder:file_folders!folder_id(name, path)', orderBy: 'created_at' },
  'contracts': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'riders': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'tech-specs': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'call-sheets': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'insurance-permits': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'media-assets': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'production-reports': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'shared': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  'archive': { table: 'files', select: '*, category:file_categories!category_id(name), uploader:profiles!uploaded_by(first_name, last_name, avatar_url)', orderBy: 'created_at' },
  
  // Companies
  'organizations': { table: 'companies', select: '*', orderBy: 'name' },
  'contacts': { table: 'company_contacts', select: '*, company:companies!company_id(name)', orderBy: 'last_name' },
  'deliverables': { table: 'scopes_of_work', select: '*, company:companies!company_id(name), production:productions!production_id(name)', orderBy: 'end_date' },
  'scopes-of-work': { table: 'scopes_of_work', select: '*, company:companies!company_id(name), production:productions!production_id(name)', orderBy: 'created_at' },
  'documents': { table: 'files', select: '*, category:file_categories!category_id(name)', orderBy: 'created_at' },
  'bids': { table: 'bids', select: '*, company:companies!company_id(name), production:productions!production_id(name)', orderBy: 'submitted_date' },
  'companies-compliance': { table: 'subcontractor_compliance_docs', select: '*, company:companies!company_id(name), verified_by_user:profiles!verified_by(first_name, last_name)', orderBy: 'expiration_date' },
  'companies-work-orders': { table: 'work_orders', select: '*, company:companies!company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'scheduled_start' },
  'companies-invoices': { table: 'subcontractor_invoices', select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(work_order_number)', orderBy: 'invoice_date' },
  'companies-reviews': { table: 'subcontractor_reviews', select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(work_order_number), reviewed_by_user:profiles!reviewed_by(first_name, last_name)', orderBy: 'created_at' },
  'subcontractor-profile': { table: 'subcontractor_profiles', select: '*, company:companies!company_id(name)', orderBy: 'company_id' },
  
  // Finance
  'budgets': { table: 'budgets', select: '*, production:productions!production_id(name)', orderBy: 'created_at' },
  'approvals': { table: 'approval_steps', select: '*, approval_chain:approval_chains!approval_chain_id(chain_name, target_type), approver:profiles!approver_id(first_name, last_name)', orderBy: 'due_date' },
  'scenarios': { table: 'budget_scenarios', select: '*, budget:budgets!budget_id(name, total_amount)', orderBy: 'created_at' },
  'variance': { table: 'budget_variance_tracking', select: '*, budget:budgets!budget_id(name)', orderBy: 'tracking_period_start' },
  'cash-flow': { table: 'cash_flow_projections', select: '*, production:productions!production_id(name)', orderBy: 'projection_date' },
  'forecasts': { table: 'financial_forecasts', select: '*, budget:budgets!budget_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'forecast_date' },
  'forecasting': { table: 'financial_forecasts', select: '*, budget:budgets!budget_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'forecast_date' },
  'transactions': { table: 'financial_transactions', select: '*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)', orderBy: 'transaction_date' },
  'revenue': { table: 'financial_transactions', select: '*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)', orderBy: 'transaction_date' },
  'expenses': { table: 'financial_transactions', select: '*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)', orderBy: 'transaction_date' },
  'payroll': { table: 'payroll', select: '*, production:productions!production_id(name), processed_by_user:profiles!processed_by(first_name, last_name)', orderBy: 'pay_date' },
  'reconciliation': { table: 'reconciliations', select: '*, production:productions!production_id(name), event:events!event_id(name), reconciled_by_user:profiles!reconciled_by(first_name, last_name), approved_by_user:profiles!approved_by(first_name, last_name)', orderBy: 'reconciliation_date' },
  'payments': { table: 'financial_transactions', select: '*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)', orderBy: 'transaction_date' },
  'invoices': { table: 'invoices', select: '*, company:companies!company_id(name), production:productions!production_id(name)', orderBy: 'issue_date' },
  'taxes': { table: 'financial_transactions', select: '*, budget:budgets!budget_id(name), production:productions!production_id(name), company:companies!company_id(name)', orderBy: 'transaction_date' },
  'policies': { table: 'spending_policies', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'accounts': { table: 'gl_codes', select: '*', orderBy: 'code' },
  'gl-codes': { table: 'gl_codes', select: '*', orderBy: 'code' },
  
  // Procurement
  'fulfillment': { table: 'purchase_orders', select: '*, company:companies!company_id(name)', orderBy: 'issue_date' },
  'orders': { table: 'purchase_orders', select: '*, company:companies!company_id(name)', orderBy: 'issue_date' },
  'agreements': { table: 'procurement_agreements', select: '*, company:companies!company_id(name)', orderBy: 'start_date' },
  'requisitions': { table: 'purchase_requisitions', select: '*, requested_by_user:profiles!requested_by(first_name, last_name)', orderBy: 'created_at' },
  'line-items': { table: 'purchase_orders', select: '*, company:companies!company_id(name)', orderBy: 'created_at' },
  'audits': { table: 'purchase_orders', select: '*, company:companies!company_id(name)', orderBy: 'created_at' },
  'receiving': { table: 'goods_receipts', select: '*, purchase_order:purchase_orders!po_id(po_number), received_by_user:profiles!received_by(first_name, last_name)', orderBy: 'received_date' },
  'matching': { table: 'three_way_matches', select: '*, purchase_order:purchase_orders!po_id(po_number), receipt:goods_receipts!receipt_id(receipt_number), invoice:invoices!invoice_id(invoice_number)', orderBy: 'created_at' },
  'procurement-approvals': { table: 'approval_steps', select: '*, approval_chain:approval_chains!approval_chain_id(chain_name, target_type), approver:profiles!approver_id(first_name, last_name)', orderBy: 'due_date' },
  
  // Community
  'news': { table: 'community_posts', select: '*, author:profiles!author_id(id, first_name, last_name, avatar_url, job_title, company)', orderBy: 'created_at' },
  'showcase': { table: 'community_posts', select: '*, author:profiles!author_id(id, first_name, last_name, avatar_url, job_title, company)', orderBy: 'created_at' },
  'activity': { table: 'community_posts', select: '*, author:profiles!author_id(id, first_name, last_name, avatar_url, job_title, company)', orderBy: 'created_at' },
  'connections': { table: 'connections', select: '*, user:profiles!user_id(id, first_name, last_name, avatar_url, job_title, company, city, state), connected_user:profiles!connected_user_id(id, first_name, last_name, avatar_url, job_title, company, city, state)', orderBy: 'requested_at' },
  'studios': { table: 'companies', select: '*, industry, website, description, logo_url', orderBy: 'name' },
  'community-events': { table: 'events', select: '*, location:locations!location_id(name, city, state), production:productions!production_id(name)', orderBy: 'start_time' },
  'discussions': { table: 'community_posts', select: '*, author:profiles!author_id(id, first_name, last_name, avatar_url, job_title, company)', orderBy: 'created_at' },
  'competitions': { table: 'community_posts', select: '*, author:profiles!author_id(id, first_name, last_name, avatar_url, job_title, company)', orderBy: 'created_at' },
  
  // Marketplace
  'spotlight': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'shop': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'favorites': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'sales': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'purchases': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  'lists': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'created_at' },
  'products': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'name' },
  'services': { table: 'marketplace_products', select: '*, vendor:companies!vendor_id(name)', orderBy: 'name' },
  'vendors': { table: 'companies', select: '*', orderBy: 'name' },
  'reviews': { table: 'marketplace_orders', select: '*, buyer:profiles!buyer_id(first_name, last_name)', orderBy: 'created_at' },
  
  // Resources
  'library': { table: 'resources', select: '*, published_by_user:profiles!published_by(first_name, last_name)', orderBy: 'title' },
  'guides': { table: 'resources', select: '*, published_by_user:profiles!published_by(first_name, last_name)', orderBy: 'title' },
  'courses': { table: 'courses', select: '*, instructor:profiles!instructor_id(first_name, last_name)', orderBy: 'title' },
  'grants': { table: 'grants', select: '*', orderBy: 'application_deadline' },
  'publications': { table: 'resources', select: '*, published_by_user:profiles!published_by(first_name, last_name)', orderBy: 'title' },
  'glossary': { table: 'resources', select: '*, published_by_user:profiles!published_by(first_name, last_name)', orderBy: 'title' },
  'troubleshooting': { table: 'resources', select: '*, published_by_user:profiles!published_by(first_name, last_name)', orderBy: 'title' },
  
  // Jobs - Contracts & RFPs
  'active': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'start_date' },
  'pipeline': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'offers': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'shortlists': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'rfps': { table: 'rfps', select: '*, issuer:companies!issuer_id(name), awarded_company:companies!awarded_to(name)', orderBy: 'submission_deadline' },
  'completed': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'end_date' },
  'archived': { table: 'job_contracts', select: '*, client:companies!client_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'end_date' },
  
  // Jobs - Work Orders & Scheduling (using general work_orders table)
  'work-orders': { table: 'work_orders', select: '*, company:companies!company_id(name), production:productions!production_id(name), job_contract:job_contracts!job_contract_id(title, contract_number), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'scheduled_start' },
  'dispatch': { table: 'work_orders', select: '*, company:companies!company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  
  // Jobs - Estimates & Quotes (using general estimates table)
  'estimates': { table: 'estimates', select: '*, client_company:companies!client_company_id(name), production:productions!production_id(name), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  
  // Jobs - Invoices & Payments (using general subcontractor_invoices table)
  'jobs-invoices': { table: 'subcontractor_invoices', select: '*, company:companies!company_id(name), work_order:work_orders!work_order_id(title, work_order_number), job_contract:job_contracts!job_contract_id(title, contract_number), created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'invoice_date' },
  'jobs-invoice-approvals': { table: 'subcontractor_invoices', select: '*, company:companies!company_id(name), approved_by_user:profiles!approved_by(first_name, last_name)', orderBy: 'submitted_at' },
  
  // Jobs - Compliance (using general subcontractor_compliance_docs table)
  'jobs-compliance': { table: 'subcontractor_compliance_docs', select: '*, company:companies!company_id(name), verified_by_user:profiles!verified_by(first_name, last_name)', orderBy: 'expiration_date' },
  'authorization-rules': { table: 'work_authorization_rules', select: '*', orderBy: 'work_category' },
  
  // Jobs - Checklists (using general checklists table)
  'checklists': { table: 'checklists', select: '*, template:checklist_templates!template_id(name)', orderBy: 'created_at' },
  'checklist-templates': { table: 'checklist_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  
  // Jobs - Communication (using general communication_threads table)
  'communications': { table: 'communication_threads', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  
  // Jobs - Approval Workflows (using general approval_workflows table)
  'approval-workflows': { table: 'approval_workflows', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'approval-requests': { table: 'approval_requests', select: '*, workflow:approval_workflows!workflow_id(name), requested_by_user:profiles!requested_by(first_name, last_name)', orderBy: 'requested_at' },
  
  // Jobs - Recruiting (using general hiring_applications table)
  'recruiting': { table: 'hiring_applications', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'applications': { table: 'hiring_application_responses', select: '*, company:companies!company_id(name), hiring_application:hiring_applications!hiring_application_id(title)', orderBy: 'created_at' },
  
  // Reports (using module-specific keys to avoid conflicts)
  'reports-overview': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'updated_at' },
  'templates': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'custom-builder': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'scheduled': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'exports': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'created_at' },
  'reports-compliance': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'executive': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'operational': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'name' },
  'reports-archived': { table: 'report_templates', select: '*, created_by_user:profiles!created_by(first_name, last_name)', orderBy: 'updated_at' },
  
  // Analytics (using module-specific keys to avoid conflicts)
  'analytics-overview': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-performance': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-trends': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-comparisons': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-forecasting': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-realtime': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-custom-views': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-pivot-tables': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-metrics-library': { table: 'analytics_views', select: '*', orderBy: 'created_at' },
  'analytics-data-sources': { table: 'data_sources', select: '*', orderBy: 'name' },
  'analytics-benchmarks': { table: 'benchmarks', select: '*', orderBy: 'name' },
  
  // Insights (using module-specific keys for complete coverage)
  'insights-overview': { table: 'objectives', select: '*, owner:profiles!owner_id(first_name, last_name)', orderBy: 'start_date' },
  'insights-objectives': { table: 'objectives', select: '*, owner:profiles!owner_id(first_name, last_name)', orderBy: 'start_date' },
  'insights-key-results': { table: 'key_results', select: '*, objective:objectives!objective_id(title)', orderBy: 'created_at' },
  'insights-benchmarks': { table: 'benchmarks', select: '*', orderBy: 'name' },
  'insights-recommendations': { table: 'ai_recommendations', select: '*', orderBy: 'generated_at' },
  'insights-priorities': { table: 'strategic_priorities', select: '*', orderBy: 'priority_rank' },
  'insights-progress-tracking': { table: 'objectives', select: '*, owner:profiles!owner_id(first_name, last_name)', orderBy: 'start_date' },
  'insights-reviews': { table: 'strategic_reviews', select: '*', orderBy: 'review_date' },
  'insights-intelligence-feed': { table: 'intelligence_feed', select: '*', orderBy: 'published_at' },
  'insights-success-metrics': { table: 'key_results', select: '*, objective:objectives!objective_id(title)', orderBy: 'created_at' },
}

export function useModuleData(
  moduleSlug: string,
  tabSlug: string,
  workspaceId: string,
  filters: Record<string, any> = {}
) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        
        // Don't query if workspaceId is not yet available
        if (!workspaceId) {
          setLoading(false)
          return
        }
        
        // Check for module-specific mapping first, then fall back to tab-only mapping
        const moduleSpecificKey = `${moduleSlug}-${tabSlug}`
        let config = TAB_TO_TABLE_MAP[moduleSpecificKey] || TAB_TO_TABLE_MAP[tabSlug]
        
        // Special handling for community events to use events table
        if (moduleSlug === 'community' && tabSlug === 'events' && !config) {
          config = { table: 'events', select: '*, location:locations!location_id(name, city, state), production:productions!production_id(name)', orderBy: 'start_time' }
        }
        
        if (!config) {
          console.warn(`No table mapping for tab: ${tabSlug} (module: ${moduleSlug})`)
          setData([])
          setLoading(false)
          return
        }

        let query = supabase
          .from(config.table)
          .select(config.select || '*')
        
        // Handle tables with special filtering logic
        if (config.table === 'workspaces') {
          // Workspaces table: filter by id (not workspace_id)
          query = query.eq('id', workspaceId)
        } else if (config.table === 'connections') {
          // Connections table: user-to-user, no workspace_id
          // Don't filter by workspace - connections are global per user
        } else {
          // Standard case: filter by workspace_id
          query = query.eq('workspace_id', workspaceId)
        }

        // Apply additional filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            query = query.eq(key, value)
          }
        })

        // Apply ordering
        if (config.orderBy) {
          const isDescending = config.orderBy === 'created_at' || config.orderBy === 'updated_at'
          query = query.order(config.orderBy, { ascending: !isDescending })
        }

        const { data: result, error: queryError } = await query

        if (queryError) throw queryError

        setData(result || [])
        setError(null)
      } catch (err) {
        console.error('Error fetching module data:', err)
        setError(err as Error)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    if (workspaceId && tabSlug) {
      fetchData()
    }

    // Real-time subscription
    if (!workspaceId) return
    
    // Check for module-specific mapping first, then fall back to tab-only mapping
    const moduleSpecificKey = `${moduleSlug}-${tabSlug}`
    let config = TAB_TO_TABLE_MAP[moduleSpecificKey] || TAB_TO_TABLE_MAP[tabSlug]
    
    // Special handling for community events to use events table
    if (moduleSlug === 'community' && tabSlug === 'events' && !config) {
      config = { table: 'events', select: '*, location:locations!location_id(name, city, state), production:productions!production_id(name)', orderBy: 'start_time' }
    }
    
    if (!config) return

    // Handle real-time subscription filters based on table type
    let filterConfig: any = {
      event: '*',
      schema: 'public',
      table: config.table,
    }
    
    // Apply appropriate filter based on table
    if (config.table === 'workspaces') {
      filterConfig.filter = `id=eq.${workspaceId}`
    } else if (config.table === 'connections') {
      // Connections are global per user, no workspace filter needed
      // We'll filter by user_id in the query itself
    } else {
      filterConfig.filter = `workspace_id=eq.${workspaceId}`
    }
    
    const channel = supabase
      .channel(`${moduleSlug}:${tabSlug}:${workspaceId}`)
      .on('postgres_changes', filterConfig, () => {
        fetchData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [moduleSlug, tabSlug, workspaceId, JSON.stringify(filters)])

  return { data, loading, error }
}

// Hook for creating items
export function useCreateItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const createItem = async (data: any) => {
    try {
      setLoading(true)
      const { data: result, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single()

      if (insertError) throw insertError

      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createItem, loading, error }
}

// Hook for updating items
export function useUpdateItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateItem = async (id: string, updates: any) => {
    try {
      setLoading(true)
      const { data: result, error: updateError } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateItem, loading, error }
}

// Hook for deleting items
export function useDeleteItem(table: string) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const deleteItem = async (id: string) => {
    try {
      setLoading(true)
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { deleteItem, loading, error }
}

// Hook for global search
export function useGlobalSearch(workspaceId: string, query: string) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function search() {
      if (!query || query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      const { data, error } = await supabase
        .rpc('global_search', {
          p_workspace_id: workspaceId,
          p_query: query,
          p_limit: 50
        })

      if (!error && data) {
        setResults(data)
      }
      setLoading(false)
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [workspaceId, query])

  return { results, loading }
}
