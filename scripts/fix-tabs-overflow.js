#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Fix tabs overflow issues by:
 * 1. Adding min-w-0 to TabsTrigger with icons
 * 2. Adding flex-shrink-0 to icons
 * 3. Wrapping text in truncate spans
 */

const srcDir = path.join(__dirname, '..', 'src');

// Find all TSX files
const files = glob.sync('**/*.tsx', { cwd: srcDir, absolute: true });

let totalFiles = 0;
let totalFixes = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  let fileFixCount = 0;

  // Pattern 1: TabsTrigger with className containing gap but missing min-w-0
  // Example: <TabsTrigger value="invite" className="gap-2">
  const pattern1 = /<TabsTrigger\s+([^>]*className="[^"]*gap[^"]*")([^>]*)>/g;
  content = content.replace(pattern1, (match, classNamePart, rest) => {
    if (!classNamePart.includes('min-w-0')) {
      fileFixCount++;
      modified = true;
      // Add min-w-0 to className
      const newClassName = classNamePart.replace('className="', 'className="min-w-0 ');
      return `<TabsTrigger ${newClassName}${rest}>`;
    }
    return match;
  });

  // Pattern 2: Icons inside TabsTrigger without flex-shrink-0
  // Example: <Mail className="h-4 w-4" />
  const pattern2 = /(<TabsTrigger[^>]*>[\s\S]*?)(<[A-Z][a-zA-Z]*\s+[^>]*className="[^"]*h-4[^"]*")([^>]*>)([\s\S]*?<\/TabsTrigger>)/g;
  content = content.replace(pattern2, (match, before, iconStart, iconEnd, after) => {
    if (!iconStart.includes('flex-shrink-0')) {
      fileFixCount++;
      modified = true;
      const newIconStart = iconStart.replace('className="', 'className="flex-shrink-0 ');
      return `${before}${newIconStart}${iconEnd}${after}`;
    }
    return match;
  });

  // Pattern 3: Text content in TabsTrigger without truncate span
  // This is more complex - we need to wrap plain text in <span className="truncate">
  // Look for TabsTrigger with text that's not already wrapped
  const pattern3 = /(<TabsTrigger[^>]*>)([\s\S]*?)(<\/TabsTrigger>)/g;
  content = content.replace(pattern3, (match, opening, content, closing) => {
    // Skip if already has truncate span
    if (content.includes('className="truncate"') || content.includes("className='truncate'")) {
      return match;
    }
    
    // Check if there's plain text (not just JSX/icons)
    const hasIcon = /<[A-Z][a-zA-Z]*/.test(content);
    const hasText = /[a-zA-Z]{2,}/.test(content.replace(/<[^>]*>/g, ''));
    
    if (hasText) {
      // If it has both icon and text, wrap the text part
      if (hasIcon) {
        // Complex case: has icon + text
        // Try to wrap text portions
        let newContent = content.replace(/([^<>]+)(?=\s*<\/)/g, (textMatch) => {
          const trimmed = textMatch.trim();
          if (trimmed && !trimmed.startsWith('{') && trimmed.length > 1) {
            fileFixCount++;
            modified = true;
            return `<span className="truncate">${textMatch}</span>`;
          }
          return textMatch;
        });
        return `${opening}${newContent}${closing}`;
      } else {
        // Simple case: just text
        const trimmed = content.trim();
        if (trimmed && !trimmed.startsWith('{') && !trimmed.includes('<span')) {
          fileFixCount++;
          modified = true;
          return `${opening}<span className="truncate">${content}</span>${closing}`;
        }
      }
    }
    
    return match;
  });

  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    totalFiles++;
    totalFixes += fileFixCount;
    console.log(`✅ Fixed ${fileFixCount} issues in: ${path.relative(srcDir, file)}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ COMPLETE: Fixed ${totalFixes} tab overflow issues in ${totalFiles} files`);
console.log('='.repeat(60));
