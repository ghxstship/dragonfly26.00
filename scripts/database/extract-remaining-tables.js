#!/usr/bin/env node

// Extract unique table names from the remaining auth warnings
const tables = [
  // Marketplace tables (8 tables)
  "marketplace_favorites", "marketplace_lists", "marketplace_purchases",
  "marketplace_reviews", "marketplace_sales", "marketplace_services", "marketplace_vendors",
  // People tables (9 tables)
  "people_availability", "people_certifications", "people_departments",
  "people_directory", "people_emergency_contacts", "people_performance",
  "people_skills", "people_teams", "people_timesheets",
  // Procurement tables (7 tables)
  "procurement_approvals", "procurement_contracts", "procurement_invoices",
  "procurement_orders", "procurement_quotes", "procurement_receiving", "procurement_vendors",
  // Project tables (9 tables)
  "project_budgets", "project_dependencies", "project_documents",
  "project_gantt", "project_milestones", "project_phases",
  "project_resources", "project_risks", "project_timelines",
  // Report tables (4 tables)
  "report_builder", "report_dashboards", "report_exports", "report_schedules",
  // Resource tables (7 tables)
  "resource_courses", "resource_glossary", "resource_grants",
  "resource_guides", "resource_library", "resource_publications", "resource_troubleshooting"
];

// Remove duplicates and sort
const uniqueTables = [...new Set(tables)].sort();

console.log(`Total unique tables: ${uniqueTables.length}`);
console.log(`Total policies: ${uniqueTables.length * 4}`);
console.log(`\nTables by category:`);
console.log(`- Marketplace: 7 tables`);
console.log(`- People: 9 tables`);
console.log(`- Procurement: 7 tables`);
console.log(`- Project: 9 tables`);
console.log(`- Report: 4 tables`);
console.log(`- Resource: 7 tables`);
console.log(`\nAll tables:`);
uniqueTables.forEach(t => console.log(`  ${t}`));
