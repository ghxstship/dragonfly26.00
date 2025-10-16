#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting comprehensive lint error fixes...\n');

// Pattern 1: Fix syntax errors where hooks are in function parameters
const syntaxErrorFiles = [
  'src/components/assets/assets-overview-tab.tsx',
  'src/components/assets/assets-tracking-tab.tsx',
  'src/components/events/events-activities-tab.tsx',
  'src/components/files/files-all-documents-tab.tsx',
  'src/components/files/files-archive-tab.tsx',
  'src/components/files/files-call-sheets-tab.tsx',
  'src/components/files/files-contracts-tab.tsx',
  'src/components/files/files-insurance-permits-tab.tsx',
  'src/components/files/files-media-assets-tab.tsx',
  'src/components/files/files-production-reports-tab.tsx',
  'src/components/files/files-riders-tab.tsx',
  'src/components/files/files-shared-tab.tsx',
  'src/components/files/files-tech-specs-tab.tsx',
];

function fixSyntaxErrors() {
  console.log('📝 Fixing syntax errors (hooks in parameters)...');
  let fixed = 0;

  syntaxErrorFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern: export function Name({ const t = ... const tCommon = ... data, loading }: Props)
    // Fix: Move hooks inside function body
    const regex = /export function (\w+)\(\{\s*const t = useTranslations\([^)]+\)\s*const tCommon = useTranslations\([^)]+\)\s*([^}]+)\}: ([^)]+)\) \{/s;
    
    if (regex.test(content)) {
      content = content.replace(regex, (match, funcName, params, propsType) => {
        return `export function ${funcName}({ ${params.trim()} }: ${propsType}) {\n  const t = useTranslations('${getTranslationKey(file)}')\n  const tCommon = useTranslations('common')`;
      });
      
      // Also fix the duplicate closing braces/parens
      content = content.replace(/\s+<\/div>\s+\)\s+}/m, '\n    )\n  }');
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      fixed++;
    }
  });

  console.log(`✅ Fixed ${fixed} syntax error files\n`);
}

function getTranslationKey(file) {
  if (file.includes('assets/')) {
    const match = file.match(/assets-(\w+)-tab/);
    return match ? `production.assets.${match[1]}` : 'production.assets.overview';
  }
  if (file.includes('events/')) {
    const match = file.match(/events-(\w+)-tab/);
    return match ? `production.events.${match[1]}` : 'production.events.activities';
  }
  if (file.includes('files/')) {
    const match = file.match(/files-(\w+)-tab/);
    if (match) {
      const key = match[1].replace(/-/g, '_');
      return `production.files.${key}`;
    }
  }
  return 'common';
}

// Pattern 2: Fix duplicate className props
function fixDuplicateProps() {
  console.log('📝 Fixing duplicate props...');
  
  const duplicatePropsFiles = [
    'src/components/assets/assets-approvals-tab.tsx',
    'src/components/assets/counts-tab.tsx',
    'src/components/assets/inventory-tab.tsx',
    'src/components/dashboard/dashboard-my-advances-tab.tsx',
    'src/components/dashboard/dashboard-my-files-tab.tsx',
    'src/components/dashboard/dashboard-my-orders-tab.tsx',
    'src/components/dashboard/dashboard-my-reports-tab.tsx',
    'src/components/dashboard/dashboard-my-travel-tab.tsx',
  ];

  let fixed = 0;

  duplicatePropsFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Pattern: <Icon ... aria-hidden="true" className="..." />
    // Fix: Merge className props
    const lines = content.split('\n');
    const newLines = lines.map(line => {
      // Match lines with duplicate className
      const match = line.match(/(<\w+[^>]*)\s+aria-hidden="true"\s+className="([^"]+)"/);
      if (match) {
        modified = true;
        return line.replace(/\s+aria-hidden="true"\s+className="([^"]+)"/, ' className="$1" aria-hidden="true"');
      }
      
      // Also check for className appearing twice in different order
      const match2 = line.match(/className="([^"]+)"([^>]*?)className="([^"]+)"/);
      if (match2) {
        modified = true;
        // Merge the two classNames
        const combined = `${match2[1]} ${match2[3]}`.trim();
        return line.replace(/className="[^"]+"([^>]*?)className="[^"]+"/, `className="${combined}"$1`);
      }
      
      return line;
    });

    if (modified) {
      fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
      console.log(`✅ Fixed: ${file}`);
      fixed++;
    }
  });

  console.log(`✅ Fixed ${fixed} duplicate props files\n`);
}

// Pattern 3: Fix conditional hook calls
function fixConditionalHooks() {
  console.log('📝 Fixing conditional hook calls...');
  
  const hookFiles = [
    'src/components/companies/companies-bids-tab.tsx',
    'src/components/companies/companies-companies-compliance-tab.tsx',
    'src/components/companies/companies-companies-invoices-tab.tsx',
    'src/components/companies/companies-companies-reviews-tab.tsx',
    'src/components/companies/companies-companies-work-orders-tab.tsx',
    'src/components/companies/companies-deliverables-tab.tsx',
    'src/components/companies/companies-documents-tab.tsx',
    'src/components/companies/companies-scopes-of-work-tab.tsx',
    'src/components/companies/companies-subcontractor-profile-tab.tsx',
    'src/components/events/events-all-events-tab.tsx',
    'src/components/events/events-attendance-tab.tsx',
    'src/components/events/events-budgets-tab.tsx',
    'src/components/events/events-catering-tab.tsx',
    'src/components/events/events-equipment-tab.tsx',
    'src/components/events/events-logistics-tab.tsx',
    'src/components/events/events-permits-tab.tsx',
    'src/components/events/events-schedules-tab.tsx',
    'src/components/events/events-talent-tab.tsx',
    'src/components/events/events-transportation-tab.tsx',
    'src/components/events/events-venues-tab.tsx',
    'src/components/locations/locations-facilities-tab.tsx',
    'src/components/locations/locations-locations-permits-tab.tsx',
    'src/components/locations/locations-locations-scouting-tab.tsx',
    'src/components/locations/locations-maps-tab.tsx',
    'src/components/locations/locations-overview-tab.tsx',
    'src/components/locations/locations-parking-tab.tsx',
    'src/components/locations/locations-security-tab.tsx',
    'src/components/locations/locations-warehousing-tab.tsx',
    'src/components/people/people-applicants-tab.tsx',
    'src/components/people/people-assignments-tab.tsx',
    'src/components/people/people-onboarding-tab.tsx',
    'src/components/people/people-openings-tab.tsx',
    'src/components/people/people-personnel-tab.tsx',
    'src/components/people/people-teams-tab.tsx',
    'src/components/people/people-timekeeping-tab.tsx',
    'src/components/procurement/procurement-agreements-tab.tsx',
    'src/components/procurement/procurement-audits-tab.tsx',
    'src/components/procurement/procurement-fulfillment-tab.tsx',
    'src/components/procurement/procurement-line-items-tab.tsx',
    'src/components/procurement/procurement-orders-tab.tsx',
    'src/components/procurement/procurement-overview-tab.tsx',
    'src/components/procurement/procurement-procurement-approvals-tab.tsx',
    'src/components/procurement/procurement-requisitions-tab.tsx',
    'src/components/projects/projects-activations-tab.tsx',
    'src/components/projects/projects-compliance-tab.tsx',
    'src/components/projects/projects-costs-tab.tsx',
    'src/components/projects/projects-milestones-tab.tsx',
    'src/components/projects/projects-overview-tab.tsx',
    'src/components/projects/projects-projects-checklists-tab.tsx',
    'src/components/projects/projects-projects-work-orders-tab.tsx',
    'src/components/projects/projects-safety-tab.tsx',
    'src/components/projects/projects-tasks-tab.tsx',
  ];

  let fixed = 0;

  hookFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Pattern: const { data: fetchedData, loading: fetchLoading } = data ? { data, loading } : useModuleData(...)
    // Fix: Always call the hook, use the result conditionally
    const conditionalHookPattern = /const \{ data: fetchedData, loading: fetchLoading \} = data\s*\?\s*\{ data, loading \}\s*:\s*useModuleData\(([^)]+)\)/;
    
    if (conditionalHookPattern.test(content)) {
      content = content.replace(
        conditionalHookPattern,
        'const { data: hookData, loading: hookLoading } = useModuleData($1)\n  const fetchedData = data || hookData\n  const fetchLoading = loading !== undefined ? loading : hookLoading'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      fixed++;
    }
  });

  console.log(`✅ Fixed ${fixed} conditional hook files\n`);
}

// Pattern 4: Fix TabsTrigger in SelectContent
function fixTabsTrigger() {
  console.log('📝 Fixing TabsTrigger in SelectContent...');
  
  const file = 'src/components/admin/members-management-tab.tsx';
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace TabsTrigger with SelectItem inside SelectContent
  content = content.replace(
    /<TabsTrigger value="invite">\{t\('members\.invite'\)\}<\/TabsTrigger>/,
    '<SelectItem value="admin">Admin</SelectItem>'
  );
  content = content.replace(
    /<TabsTrigger value="create">\{t\('members\.create'\)\}<\/TabsTrigger>/,
    '<SelectItem value="member">Member</SelectItem>'
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed: ${file}\n`);
}

// Pattern 5: Fix resources module syntax errors
function fixResourcesSyntax() {
  console.log('📝 Fixing resources module syntax errors...');
  
  const files = [
    'src/components/resources/resources-grants-tab.tsx',
    'src/components/resources/resources-publications-tab.tsx',
    'src/components/resources/resources-troubleshooting-tab.tsx',
  ];

  let fixed = 0;

  files.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${file}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix: mainMessage={searchQuery ? "No grants found" : {t('nothingToSeeYet')}}
    // Should be: mainMessage={searchQuery ? "No grants found" : t('nothingToSeeYet')}
    content = content.replace(
      /mainMessage=\{searchQuery \? "[^"]*" : \{t\('([^']+)'\)\}\}/g,
      "mainMessage={searchQuery ? t('searchNoResults') : t('$1')}"
    );
    
    // Fix: description={searchQuery ? {t('tryAdjustingSearch')} : t('addGrants')}
    // Should be: description={searchQuery ? t('tryAdjustingSearch') : t('addGrants')}
    content = content.replace(
      /description=\{searchQuery \? \{t\('([^']+)'\)\} : t\('([^']+)'\)\}/g,
      "description={searchQuery ? t('$1') : t('$2')}"
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
    fixed++;
  });

  console.log(`✅ Fixed ${fixed} resources files\n`);
}

// Run all fixes
try {
  fixSyntaxErrors();
  fixDuplicateProps();
  fixConditionalHooks();
  fixTabsTrigger();
  fixResourcesSyntax();
  
  console.log('✅ All lint errors fixed successfully!');
  console.log('\n🔍 Run "npm run lint" to verify fixes');
} catch (error) {
  console.error('❌ Error during fixes:', error);
  process.exit(1);
}
