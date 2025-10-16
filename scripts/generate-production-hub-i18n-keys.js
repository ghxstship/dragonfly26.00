#!/usr/bin/env node

/**
 * Generate ALL Production Hub translation keys for en.json
 * Creates ~600+ keys for 74 tab components across 7 modules
 */

const fs = require('fs');
const path = require('path');

// Standard keys every tab needs
const standardKeys = {
  title: "Title",
  description: "Description",
  create: "Create",
  totalItems: "Total Items",
  active: "Active",
  pending: "Pending",
  completed: "Completed",
  loadingMessage: "Loading...",
  noItemsFound: "No items found",
  emptyStateMessage: "Get started by creating your first item",
  cardDescription: "View and manage items"
};

// Module and tab structure
const modules = {
  dashboard: {
    name: "Dashboard",
    tabs: ['overview', 'my_advances', 'my_agenda', 'my_assets', 'my_expenses', 'my_files', 'my_jobs', 'my_orders', 'my_reports', 'my_tasks', 'my_travel']
  },
  projects: {
    name: "Projects",
    tabs: ['overview', 'activations', 'compliance', 'costs', 'milestones', 'productions', 'checklists', 'work_orders', 'safety', 'schedule', 'tasks']
  },
  events: {
    name: "Events",
    tabs: ['all_events', 'activities', 'blocks', 'bookings', 'calendar', 'equipment', 'incidents', 'internal', 'itineraries', 'rehearsals', 'reservations', 'run_of_show', 'shipping_receiving', 'tours', 'trainings']
  },
  people: {
    name: "People",
    tabs: ['personnel', 'applicants', 'assignments', 'onboarding', 'openings', 'scheduling', 'teams', 'timekeeping', 'training']
  },
  assets: {
    name: "Assets",
    tabs: ['overview', 'advances', 'approvals', 'maintenance', 'tracking', 'catalog', 'counts', 'inventory']
  },
  locations: {
    name: "Locations",
    tabs: ['directory', 'access', 'bim_models', 'coordination', 'logistics', 'site_maps', 'spatial_features', 'utilities', 'warehousing']
  },
  files: {
    name: "Files",
    tabs: ['all_documents', 'archive', 'call_sheets', 'contracts', 'insurance_permits', 'media_assets', 'production_reports', 'riders', 'shared', 'tech_specs']
  }
};

// Additional common keys for specific use cases
const additionalKeys = {
  // Status and badges
  inProgress: "In Progress",
  cancelled: "Cancelled",
  overdue: "Overdue",
  onHold: "On Hold",
  showDay: "Show Day",
  travelDay: "Travel Day",
  festival: "Festival",
  confirmed: "Confirmed",
  conflict: "Conflict",
  
  // Time periods
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  
  // Actions
  details: "Details",
  runOfShow: "Run of Show",
  resolve: "Resolve",
  
  // Labels
  requested: "Requested",
  start: "Start",
  end: "End",
  by: "By",
  lastUsed: "Last used",
  loadIn: "Load-in",
  capacity: "Capacity",
  miles: "miles",
  
  // Asset specific
  assetItem: "Asset/Item",
  category: "Category",
  production: "Production",
  requestor: "Requestor",
  period: "Period",
  totalAssets: "Total Assets",
  totalValue: "Total Value",
  utilizationRate: "Utilization Rate",
  inMaintenance: "In Maintenance",
  assetStatusDistribution: "Asset Status Distribution",
  available: "available",
  assetPortfolioValue: "Asset portfolio value",
  requiresAttention: "Requires attention",
  inUseRented: "In Use/Rented",
  maintenance: "Maintenance",
  retired: "Retired",
  
  // People specific
  schedulingConflicts: "Scheduling Conflicts",
  needsAttention: "These shifts need attention",
  
  // Locations specific
  mapVisualization: "Map visualization would appear here",
  selectMap: "Select a map from the list to view",
  
  // Other
  venueInformation: "Venue Information",
  logistics: "Logistics",
  name: "Name",
  address: "Address",
  contact: "Contact",
  soundCheck: "Sound Check",
  doors: "Doors",
  stopDetails: "Stop Details"
};

function generateProductionKeys() {
  const production = {};
  
  Object.entries(modules).forEach(([moduleKey, moduleData]) => {
    production[moduleKey] = {};
    
    moduleData.tabs.forEach(tabKey => {
      production[moduleKey][tabKey] = {
        ...standardKeys,
        ...additionalKeys,
        title: `${moduleData.name} - ${tabKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        description: `Manage ${tabKey.replace(/_/g, ' ')}`
      };
    });
  });
  
  return { production };
}

function main() {
  console.log('🚀 Generating Production Hub i18n keys...\n');
  
  const keys = generateProductionKeys();
  const keysJson = JSON.stringify(keys, null, 2);
  
  // Count total keys
  const totalTabs = Object.values(modules).reduce((sum, m) => sum + m.tabs.length, 0);
  const keysPerTab = Object.keys(standardKeys).length + Object.keys(additionalKeys).length;
  const totalKeys = totalTabs * keysPerTab;
  
  console.log(`📊 Generated ${totalKeys}+ translation keys`);
  console.log(`📁 ${totalTabs} tabs across 7 modules`);
  console.log(`🗝️  ${keysPerTab} keys per tab\n`);
  
  // Read current en.json
  const enJsonPath = path.join(__dirname, '..', 'src', 'i18n', 'messages', 'en.json');
  const currentContent = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
  
  // Add production keys
  const updatedContent = {
    ...currentContent,
    ...keys
  };
  
  // Write back
  fs.writeFileSync(enJsonPath, JSON.stringify(updatedContent, null, 2) + '\n', 'utf8');
  
  console.log('✅ Updated en.json with Production Hub keys');
  console.log(`📄 File: ${enJsonPath}\n`);
  console.log('🎉 Complete! All Production Hub translation keys added.');
}

main();
