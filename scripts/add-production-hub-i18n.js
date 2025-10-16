#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const modulesNeedingFix = [
  { name: 'projects', prefix: 'production.projects' },
  { name: 'events', prefix: 'production.events' },
  { name: 'people', prefix: 'production.people' },
  { name: 'assets', prefix: 'production.assets' },
  { name: 'locations', prefix: 'production.locations' },
  { name: 'files', prefix: 'production.files' }
];

const componentsDir = path.join(__dirname, '../src/components');
let totalUpdated = 0;
let filesModified = 0;

console.log('🚀 Production Hub i18n Implementation\n');

modulesNeedingFix.forEach(({ name: module, prefix }) => {
  const moduleDir = path.join(componentsDir, module);
  
  if (!fs.existsSync(moduleDir)) {
    console.log(`⚠️  Skipping ${module} - directory not found`);
    return;
  }
  
  const files = fs.readdirSync(moduleDir).filter(f => f.endsWith('-tab.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(moduleDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if translation hook already exists
    if (content.includes('const t = useTranslations(')) {
      console.log(`⏭️  ${module}/${file} - Already has translation hook`);
      return;
    }
    
    // Extract tab name from filename
    const tabName = file.replace(`${module}-`, '').replace('-tab.tsx', '').replace(/-/g, '_');
    const translationKey = `${prefix}.${tabName}`;
    
    // Find the component function start
    const componentMatch = content.match(/export\s+function\s+\w+Tab[^{]*\{/);
    if (!componentMatch) {
      console.log(`❌ ${module}/${file} - Could not find component function`);
      return;
    }
    
    const insertPos = componentMatch.index + componentMatch[0].length;
    
    // Build the translation hooks to insert
    const translationHooks = `\n  const t = useTranslations('${translationKey}')\n  const tCommon = useTranslations('common')\n`;
    
    // Insert translation hooks after function opening brace
    content = content.slice(0, insertPos) + translationHooks + content.slice(insertPos);
    
    // Replace hardcoded loading message
    content = content.replace(
      /<p className="text-muted-foreground">Loading\.\.\.<\/p>/g,
      '<p className="text-muted-foreground">{t(\'loadingMessage\')}</p>'
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      totalUpdated++;
      console.log(`✅ ${module}/${file} - Added translation hooks`);
    }
  });
});

console.log(`\n✨ Phase 1 Complete! Added translation hooks to ${totalUpdated} files.`);
console.log(`\n📝 Next: Run full i18n string replacement script`);
