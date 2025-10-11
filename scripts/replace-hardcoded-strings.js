const fs = require('fs');
const path = require('path');

// Common string replacements
const replacements = [
  // Common buttons
  { pattern: /(['"`])Save\1/g, replace: "t('common.save')" },
  { pattern: /(['"`])Cancel\1/g, replace: "t('common.cancel')" },
  { pattern: /(['"`])Delete\1/g, replace: "t('common.delete')" },
  { pattern: /(['"`])Edit\1/g, replace: "t('common.edit')" },
  { pattern: /(['"`])Create\1/g, replace: "t('common.create')" },
  { pattern: /(['"`])Update\1/g, replace: "t('common.update')" },
  { pattern: /(['"`])Close\1/g, replace: "t('common.close')" },
  { pattern: /(['"`])Submit\1/g, replace: "t('common.submit')" },
  { pattern: /(['"`])Add\1/g, replace: "t('common.add')" },
  { pattern: /(['"`])Remove\1/g, replace: "t('common.remove')" },
  { pattern: /(['"`])View\1/g, replace: "t('common.view')" },
  { pattern: /(['"`])Export\1/g, replace: "t('common.export')" },
  { pattern: /(['"`])Import\1/g, replace: "t('common.import')" },
  { pattern: /(['"`])Filter\1/g, replace: "t('common.filter')" },
  { pattern: /(['"`])Sort\1/g, replace: "t('common.sort')" },
  { pattern: /(['"`])Refresh\1/g, replace: "t('common.refresh')" },
  { pattern: /(['"`])Apply\1/g, replace: "t('common.apply')" },
  { pattern: /(['"`])Reset\1/g, replace: "t('common.reset')" },
  { pattern: /(['"`])Clear\1/g, replace: "t('common.clear')" },
  
  // Loading states
  { pattern: /(['"`])Loading\.\.\.\1/g, replace: "t('common.loading')" },
  { pattern: /(['"`])Loading\1/g, replace: "t('common.loading')" },
  
  // Common labels
  { pattern: /(['"`])Name\1/g, replace: "t('fields.name')" },
  { pattern: /(['"`])Description\1/g, replace: "t('fields.description')" },
  { pattern: /(['"`])Status\1/g, replace: "t('fields.status')" },
  { pattern: /(['"`])Priority\1/g, replace: "t('fields.priority')" },
  { pattern: /(['"`])Assignee\1/g, replace: "t('fields.assignee')" },
  { pattern: /(['"`])Owner\1/g, replace: "t('fields.owner')" },
  { pattern: /(['"`])Tags\1/g, replace: "t('fields.tags')" },
  
  // Date labels
  { pattern: /(['"`])Due Date\1/g, replace: "t('fields.dueDate')" },
  { pattern: /(['"`])Start Date\1/g, replace: "t('fields.startDate')" },
  { pattern: /(['"`])Today\1/g, replace: "t('date.today')" },
  { pattern: /(['"`])Tomorrow\1/g, replace: "t('date.tomorrow')" },
  { pattern: /(['"`])Yesterday\1/g, replace: "t('date.yesterday')" },
  
  // Statuses
  { pattern: /(['"`])Active\1/g, replace: "t('statuses.active')" },
  { pattern: /(['"`])Completed\1/g, replace: "t('statuses.completed')" },
  { pattern: /(['"`])In Progress\1/g, replace: "t('statuses.inProgress')" },
  
  // Priorities
  { pattern: /(['"`])High\1/g, replace: "t('priority.high')" },
  { pattern: /(['"`])Medium\1/g, replace: "t('priority.medium')" },
  { pattern: /(['"`])Low\1/g, replace: "t('priority.low')" },
  { pattern: /(['"`])Urgent\1/g, replace: "t('priority.urgent')" },
];

// Directories to process
const dirs = [
  'src/components/views',
  'src/components/admin', 
  'src/components/shared',
  'src/components/goals',
  'src/components/reports',
  'src/components/automations',
  'src/components/plugins',
];

let filesProcessed = 0;
let filesUpdated = 0;
let totalReplacements = 0;

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dir}`);
    return;
  }
  
  const files = fs.readdirSync(fullPath).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const filePath = path.join(fullPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let fileReplacements = 0;
    
    filesProcessed++;
    
    replacements.forEach(({ pattern, replace }) => {
      const matches = content.match(pattern);
      if (matches) {
        content = content.replace(pattern, replace);
        fileReplacements += matches.length;
      }
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesUpdated++;
      totalReplacements += fileReplacements;
      console.log(`✓ ${dir}/${file} - ${fileReplacements} replacements`);
    }
  });
});

console.log(`\n✅ Processed ${filesProcessed} files`);
console.log(`📝 Updated ${filesUpdated} files`);
console.log(`🔄 Total replacements: ${totalReplacements}`);
console.log(`\n⚠️  Note: Review changes and test thoroughly!`);
