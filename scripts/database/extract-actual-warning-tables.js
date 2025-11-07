#!/usr/bin/env node

// Extract ONLY the tables that appeared in the actual warning JSON
// These are the tables that definitely exist and have the auth warnings

const tables = [
  // From the actual warnings provided
  "marketplace_favorites",
  "marketplace_lists", 
  "marketplace_purchases",
  "marketplace_reviews",
  "marketplace_sales",
  "marketplace_services",
  "marketplace_vendors",
  "people_availability",
  "people_certifications",
  "people_departments",
  "people_directory",
  "people_skills",
  "people_teams",
  "project_budgets",
  "project_dependencies",
  "project_documents",
  "project_gantt",
  "project_milestones",
  "project_phases",
  "project_resources",
  "project_risks",
  "project_timelines",
  "report_builder",
  "report_dashboards",
  "report_exports",
  "report_schedules",
  "resource_courses",
  "resource_glossary",
  "resource_grants",
  "resource_guides",
  "resource_library",
  "resource_publications",
  "resource_troubleshooting"
];

console.log(`Total tables from actual warnings: ${tables.length}`);
console.log(`Total policies: ${tables.length * 4}`);
console.log(`\nTables:`);
tables.forEach(t => console.log(`  ${t}`));
