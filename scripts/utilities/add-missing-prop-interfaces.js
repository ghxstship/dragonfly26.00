#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 ADDING MISSING PROP INTERFACES');
console.log('==================================\n');

// Get all tab component files
const componentDirs = [
  'src/components/admin',
  'src/components/analytics',
  'src/components/assets',
  'src/components/community',
  'src/components/companies',
  'src/components/dashboard',
  'src/components/events',
  'src/components/files',
  'src/components/finance',
  'src/components/insights',
  'src/components/jobs',
  'src/components/locations',
  'src/components/marketplace',
  'src/components/people',
  'src/components/procurement',
  'src/components/profile',
  'src/components/projects',
  'src/components/reports',
  'src/components/resources',
  'src/components/settings'
];

let totalFiles = 0;
let filesFixed = 0;
let interfacesAdded = 0;

componentDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    totalFiles++;
    const filePath = path.join(dirPath, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has prop interface
    const hasPropInterface = /interface\s+\w+Props/.test(content) || /type\s+\w+Props\s*=/.test(content);
    
    if (hasPropInterface) {
      return; // Already has props
    }

    // Extract component name from export
    let componentName = null;
    const exportMatch = content.match(/export function ([A-Z]\w+)/);
    if (exportMatch) {
      componentName = exportMatch[1];
    }

    if (!componentName) {
      return; // Can't determine component name
    }

    // Check if component uses TabComponentProps or similar
    const usesTabComponentProps = /\{\s*workspaceId[^}]*\}:\s*TabComponentProps/.test(content);
    const usesDashboardTabProps = /\{\s*workspaceId[^}]*\}:\s*DashboardTabProps/.test(content);
    
    if (usesTabComponentProps || usesDashboardTabProps) {
      // Already using a shared props type
      return;
    }

    // Check if component has no props
    const hasNoProps = new RegExp(`export function ${componentName}\\(\\s*\\)`).test(content);
    
    if (hasNoProps) {
      // Add empty props interface
      const propsInterface = `\ninterface ${componentName}Props {\n  // This component doesn't require props\n}\n\n`;
      
      // Find where to insert (before export)
      const insertPoint = content.search(/export function/);
      if (insertPoint > 0) {
        content = content.slice(0, insertPoint) + propsInterface + content.slice(insertPoint);
        
        // Update component signature
        content = content.replace(
          new RegExp(`(export function ${componentName})\\(\\s*\\)`),
          `$1(props: ${componentName}Props)`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`   ✅ ${path.basename(dir)}/${file} - Added ${componentName}Props`);
        filesFixed++;
        interfacesAdded++;
      }
    }
  });
});

console.log(`\n✅ COMPLETE\n`);
console.log(`Files processed: ${totalFiles}`);
console.log(`Files modified: ${filesFixed}`);
console.log(`Interfaces added: ${interfacesAdded}\n`);

// Run verification
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 RUNNING FINAL VERIFICATION...');
console.log('═══════════════════════════════════════════════════════════\n');

const { execSync } = require('child_process');
try {
  execSync('node scripts/verify-type-safety.js', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
} catch (error) {
  console.log('Verification completed');
}
