#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing final build errors...\n');

// Fix duplicate props in specific files
const duplicatePropsFiles = {
  'src/components/assets/assets-approvals-tab.tsx': [46, 48, 50, 80],
  'src/components/assets/counts-tab.tsx': [74, 75, 76, 102, 279, 292, 296],
  'src/components/assets/inventory-tab.tsx': [60, 178, 182, 209, 258, 262],
  'src/components/dashboard/dashboard-my-advances-tab.tsx': [194, 270, 274],
  'src/components/dashboard/dashboard-my-files-tab.tsx': [122],
  'src/components/dashboard/dashboard-my-orders-tab.tsx': [228],
  'src/components/dashboard/dashboard-my-reports-tab.tsx': [115, 205, 233, 283, 287, 291, 295],
  'src/components/dashboard/dashboard-my-travel-tab.tsx': [178, 180],
  'src/components/events/events-calendar-tab.tsx': [105, 109, 120, 130, 142, 154, 272],
  'src/components/events/events-run-of-show-tab.tsx': [115, 119, 123, 127, 131, 152, 156, 201, 204, 224],
  'src/components/events/events-tours-tab.tsx': [80, 84, 95, 108, 119, 130, 177, 179, 190, 196, 203, 210, 217, 224]
};

Object.entries(duplicatePropsFiles).forEach(([file, lines]) => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const contentLines = content.split('\n');
  let modified = false;
  
  lines.forEach(lineNum => {
    const idx = lineNum - 1;
    if (idx < contentLines.length) {
      const line = contentLines[idx];
      
      // Remove duplicate aria-hidden
      if ((line.match(/aria-hidden="true"/g) || []).length > 1) {
        contentLines[idx] = line.replace(/(\s+aria-hidden="true")(\s+aria-hidden="true")+/g, '$1');
        modified = true;
      }
      
      // Remove duplicate className
      const classNameMatches = line.match(/className="[^"]*"/g);
      if (classNameMatches && classNameMatches.length > 1) {
        // Keep first, remove rest
        let fixedLine = line;
        for (let i = 1; i < classNameMatches.length; i++) {
          const idx = fixedLine.lastIndexOf(classNameMatches[i]);
          fixedLine = fixedLine.substring(0, idx) + fixedLine.substring(idx + classNameMatches[i].length);
        }
        contentLines[idx] = fixedLine;
        modified = true;
      }
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, contentLines.join('\n'), 'utf8');
    console.log(`✅ Fixed duplicate props: ${file}`);
  }
});

// Fix Plus import in finance files
const financeFiles = [
  'src/components/finance/finance-cash-flow-tab.tsx',
  'src/components/finance/finance-variance-tab.tsx'
];

financeFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if Plus is in imports
  if (content.includes('from "lucide-react"') && !content.includes('import {') + content.includes(' Plus')) {
    // Already has Plus
    return;
  }
  
  // Check if Plus is used but not imported
  if (content.includes('<Plus ') && !content.match(/import\s*{[^}]*\bPlus\b[^}]*}\s*from\s*"lucide-react"/)) {
    // Find the lucide-react import
    const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*"lucide-react"/);
    if (importMatch) {
      const currentImports = importMatch[1].trim();
      const newImports = currentImports + ', Plus';
      content = content.replace(
        /import\s*{([^}]+)}\s*from\s*"lucide-react"/,
        `import { ${newImports} } from "lucide-react"`
      );
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed Plus import: ${file}`);
    }
  }
});

console.log('\n✅ All final errors fixed!');
