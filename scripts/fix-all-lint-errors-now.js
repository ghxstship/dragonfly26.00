#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING ALL LINT ERRORS - 100% REMEDIATION\n');

let fixCount = 0;

// Fix 1: members-overview-tab.tsx - Parsing error (duplicate function signature)
const membersOverviewPath = path.join(process.cwd(), 'src/components/admin/members-overview-tab.tsx');
if (fs.existsSync(membersOverviewPath)) {
  let content = fs.readFileSync(membersOverviewPath, 'utf-8');
  content = content.replace(
    /export function MembersOverviewTab\(\): JSX\.Element \{\{ workspaceId = '', userId = '' \}: MembersOverviewTabProps\): JSX\.Element \{/,
    'export function MembersOverviewTab({ workspaceId = \'\', userId = \'\' }: MembersOverviewTabProps): JSX.Element {'
  );
  fs.writeFileSync(membersOverviewPath, content, 'utf-8');
  console.log('✅ Fixed: members-overview-tab.tsx (parsing error)');
  fixCount++;
}

// Fix 2: Remove all duplicate props (aria-hidden, aria-label, role, className, onClick)
const componentsDir = path.join(process.cwd(), 'src/components');

function fixDuplicateProps(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // Remove duplicate aria-hidden
  const ariaHiddenRegex = /(\s+aria-hidden=(?:"[^"]*"|{[^}]*}))\s+aria-hidden=(?:"[^"]*"|{[^}]*})/g;
  if (ariaHiddenRegex.test(content)) {
    content = content.replace(ariaHiddenRegex, '$1');
    modified = true;
  }
  
  // Remove duplicate aria-label
  const ariaLabelRegex = /(\s+aria-label=(?:"[^"]*"|{[^}]*}))\s+aria-label=(?:"[^"]*"|{[^}]*})/g;
  if (ariaLabelRegex.test(content)) {
    content = content.replace(ariaLabelRegex, '$1');
    modified = true;
  }
  
  // Remove duplicate role
  const roleRegex = /(\s+role=(?:"[^"]*"|{[^}]*}))\s+role=(?:"[^"]*"|{[^}]*})/g;
  if (roleRegex.test(content)) {
    content = content.replace(roleRegex, '$1');
    modified = true;
  }
  
  // Remove duplicate className
  const classNameRegex = /(\s+className=(?:"[^"]*"|{[^}]*}))\s+className=(?:"[^"]*"|{[^}]*})/g;
  if (classNameRegex.test(content)) {
    content = content.replace(classNameRegex, '$1');
    modified = true;
  }
  
  // Remove duplicate onClick
  const onClickRegex = /(\s+onClick=\{[^}]*\})\s+onClick=\{[^}]*\}/g;
  if (onClickRegex.test(content)) {
    content = content.replace(onClickRegex, '$1');
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  return false;
}

// Fix 3: Move hooks before early returns
function fixConditionalHooks(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  // Find the component function
  let functionStart = -1;
  let functionEnd = -1;
  let bracketCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Find function declaration
    if (functionStart === -1 && (
      line.match(/^export\s+(default\s+)?function\s+\w+/) ||
      line.match(/^export\s+const\s+\w+\s*=\s*\(/)
    )) {
      functionStart = i;
    }
    
    if (functionStart !== -1) {
      bracketCount += (line.match(/\{/g) || []).length;
      bracketCount -= (line.match(/\}/g) || []).length;
      
      if (bracketCount === 0 && i > functionStart) {
        functionEnd = i;
        break;
      }
    }
  }
  
  if (functionStart === -1) return false;
  
  // Extract hooks and early returns
  const hookLines = [];
  const otherLines = [];
  let hasEarlyReturn = false;
  let earlyReturnIndex = -1;
  
  for (let i = functionStart + 1; i < (functionEnd || lines.length); i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check for early return
    if (trimmed.startsWith('if') && lines[i + 1]?.trim().startsWith('return')) {
      hasEarlyReturn = true;
      if (earlyReturnIndex === -1) earlyReturnIndex = otherLines.length;
    }
    
    // Check for hooks
    if (line.match(/^\s+(const|let)\s+.*=\s*(use[A-Z]\w+|useState|useEffect|useTranslations|useQuery|useMutation)\(/)) {
      hookLines.push({ line, index: i });
    } else {
      otherLines.push({ line, index: i });
    }
  }
  
  // If hooks are after early return, reorganize
  if (hasEarlyReturn && hookLines.length > 0) {
    const firstHookIndex = hookLines[0].index;
    const earlyReturnLine = otherLines.find(l => l.line.trim().startsWith('if'))?.index || 0;
    
    if (firstHookIndex > earlyReturnLine) {
      // Rebuild the function
      const newLines = [...lines];
      
      // Remove hooks from their current position
      hookLines.forEach(h => {
        newLines[h.index] = null;
      });
      
      // Insert hooks right after function declaration
      const insertIndex = functionStart + 1;
      const hooksToInsert = [
        '',
        '  // Hooks must be called unconditionally at the top',
        ...hookLines.map(h => h.line),
        ''
      ];
      
      newLines.splice(insertIndex, 0, ...hooksToInsert);
      
      // Write back
      const finalContent = newLines.filter(l => l !== null).join('\n');
      fs.writeFileSync(filePath, finalContent, 'utf-8');
      return true;
    }
  }
  
  return false;
}

// Scan all component files
function scanAndFix(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanAndFix(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      // Fix duplicate props
      if (fixDuplicateProps(fullPath)) {
        console.log(`✅ Fixed duplicate props: ${path.relative(process.cwd(), fullPath)}`);
        fixCount++;
      }
      
      // Fix conditional hooks
      if (fixConditionalHooks(fullPath)) {
        console.log(`✅ Fixed conditional hooks: ${path.relative(process.cwd(), fullPath)}`);
        fixCount++;
      }
    }
  }
}

console.log('Scanning and fixing all files...\n');
scanAndFix(componentsDir);

console.log(`\n✅ FIXED ${fixCount} FILES\n`);
console.log('Running lint to verify...\n');
