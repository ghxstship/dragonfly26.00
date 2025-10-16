#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const allTabs = {
  // Settings
  'settings/team-tab': 'Team settings and member management',
  'settings/integrations-tab': 'Configure third-party integrations',
  'settings/billing-tab': 'Billing and subscription management',
  'settings/automations-tab': 'Automation rules and workflows',
  'settings/appearance-tab': 'Customize appearance and theme',
  'settings/account-tab': 'Account settings and preferences',
  
  // Resources
  'resources/resources-library-tab': 'Resource library and documentation',
  
  // Projects
  'projects/projects-schedule-tab': 'Project schedules and timelines',
  'projects/projects-productions-tab': 'Production management',
  
  // Members
  'members/invite-tab': 'Invite new team members',
  'members/create-tab': 'Create member profiles',
  
  // Profile
  'profile/tags-tab': 'Manage profile tags and skills',
  'profile/professional-tab': 'Professional information',
  'profile/health-tab': 'Health and safety information',
  'profile/endorsements-tab': 'Endorsements and recommendations',
  'profile/certifications-tab': 'Certifications and credentials',
  'profile/access-tab': 'Access control and permissions',
  'profile/travel-profile-tab': 'Travel preferences and profile',
  'profile/social-media-tab': 'Social media connections',
  'profile/performance-tab': 'Performance reviews and feedback',
  'profile/history-tab': 'Work history and experience',
  'profile/emergency-contact-tab': 'Emergency contact information',
  'profile/basic-info-tab': 'Basic profile information',
  
  // People
  'people/people-scheduling-tab': 'Personnel scheduling',
  
  // Locations
  'locations/locations-directory-tab': 'Directory of locations',
  'locations/locations-site-maps-tab': 'Site maps and layouts',
  
  // Marketplace (remaining)
  'marketplace/spotlight-tab': 'Featured marketplace items',
  'marketplace/vendors-tab': 'Vendor directory',
  'marketplace/shop-tab': 'Browse marketplace catalog',
  'marketplace/services-tab': 'Services marketplace',
  'marketplace/products-tab': 'Products catalog',
  
  // Jobs
  'jobs/jobs-pipeline-tab': 'Job pipeline and opportunities',
  
  // Community (remaining)
  'community/showcase-tab': 'Community showcase and highlights',
  'community/news-tab': 'Community news and updates',
  'community/activity-tab': 'Recent community activity',
  
  // Analytics (missing buttons)
  'analytics/analytics-trends-tab': 'Analytics trends and patterns',
  'analytics/analytics-realtime-tab': 'Real-time analytics dashboard',
  'analytics/analytics-performance-tab': 'Performance analytics',
  'analytics/analytics-forecasting-tab': 'Forecasting and predictions',
  'analytics/analytics-comparisons-tab': 'Comparative analytics',
  
  // Finance (missing buttons)
  'finance/finance-cash-flow-tab': 'Cash flow management',
  'finance/finance-approvals-tab': 'Financial approvals workflow',
  
  // Admin (missing buttons)
  'admin/templates-tab': 'Document and form templates',
  'admin/roles-permissions-tab': 'Roles and permissions management',
  'admin/plugins-tab': 'Plugin management',
  'admin/organization-settings-tab': 'Organization settings',
  'admin/admin-overview-tab': 'Admin dashboard overview',
};

function fixTab(filePath, description) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has standard positioning
    if (content.includes('Action Buttons - Standard Positioning')) {
      return { fixed: false, reason: 'already-correct' };
    }
    
    // Pattern 1: Find return ( <div className="space-y-6">
    const pattern1 = /return \(\s*<div className="space-y-6">/;
    if (pattern1.test(content)) {
      const header = `      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          ${description}
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>

`;
      content = content.replace(pattern1, `return (\n    <div className="space-y-6">\n${header}`);
      fs.writeFileSync(filePath, content, 'utf8');
      return { fixed: true };
    }
    
    return { fixed: false, reason: 'no-pattern-match' };
  } catch (err) {
    return { fixed: false, reason: err.message };
  }
}

async function main() {
  console.log('🚀 FINAL BATCH FIX - Processing ALL remaining tabs...\n');
  
  const componentsDir = path.join(__dirname, '../src/components');
  let fixed = 0;
  let skipped = 0;
  let notFound = 0;
  
  for (const [tabPath, description] of Object.entries(allTabs)) {
    const filePath = path.join(componentsDir, `${tabPath}.tsx`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ Not found: ${tabPath}`);
      notFound++;
      continue;
    }
    
    const result = fixTab(filePath, description);
    if (result.fixed) {
      console.log(`✅ Fixed: ${tabPath}`);
      fixed++;
    } else {
      console.log(`⏭️  Skipped: ${tabPath} (${result.reason})`);
      skipped++;
    }
  }
  
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 FINAL BATCH COMPLETE!');
  console.log(`${'='.repeat(50)}`);
  console.log(`   ✅ Fixed: ${fixed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Not Found: ${notFound}`);
  console.log(`   📝 Total Processed: ${Object.keys(allTabs).length}`);
}

main().catch(console.error);
