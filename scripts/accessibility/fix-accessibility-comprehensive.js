#!/usr/bin/env node

/**
 * Comprehensive Accessibility Remediation
 * Adds ARIA attributes to all components missing them
 * Target: 100% accessibility compliance (WCAG 2.1 AA)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'src', 'components');

let filesModified = 0;
let ariaAttributesAdded = 0;

// Patterns to add ARIA attributes
const ariaPatterns = [
  // Icon buttons without aria-label
  {
    pattern: /<button([^>]*?)>\s*<([A-Z][a-zA-Z]*Icon|[A-Z][a-zA-Z]*)\s/g,
    check: (match) => !match.includes('aria-label'),
    fix: (content) => {
      return content.replace(
        /<button([^>]*?)>\s*<([A-Z][a-zA-Z]*Icon|[A-Z][a-zA-Z]*)\s/g,
        (match, attrs, iconName) => {
          if (match.includes('aria-label')) return match;
          
          // Extract action from icon name
          const action = iconName
            .replace(/Icon$/, '')
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase();
          
          return `<button${attrs} aria-label="${action}">\n        <${iconName} `;
        }
      );
    },
  },
  
  // Decorative icons without aria-hidden
  {
    pattern: /<([A-Z][a-zA-Z]*Icon|[A-Z][a-zA-Z]*)\s+className/g,
    check: (match) => !match.includes('aria-hidden'),
    fix: (content) => {
      return content.replace(
        /<([A-Z][a-zA-Z]*Icon|[A-Z][a-zA-Z]*)\s+className/g,
        (match, iconName) => {
          if (match.includes('aria-hidden')) return match;
          return `<${iconName} aria-hidden="true" className`;
        }
      );
    },
  },
  
  // Input fields without proper labels
  {
    pattern: /<input([^>]*?)type="([^"]+)"([^>]*?)\/>/g,
    check: (match) => !match.includes('aria-label') && !match.includes('aria-labelledby'),
    fix: (content) => {
      return content.replace(
        /<input([^>]*?)type="([^"]+)"([^>]*?)\/>/g,
        (match, before, type, after) => {
          if (match.includes('aria-label') || match.includes('aria-labelledby') || match.includes('id=')) {
            return match;
          }
          
          // Extract placeholder for label
          const placeholderMatch = match.match(/placeholder="([^"]+)"/);
          const label = placeholderMatch ? placeholderMatch[1] : type;
          
          return `<input${before}type="${type}"${after} aria-label="${label}" />`;
        }
      );
    },
  },
  
  // Select elements without labels
  {
    pattern: /<select([^>]*?)>/g,
    check: (match) => !match.includes('aria-label') && !match.includes('aria-labelledby'),
    fix: (content) => {
      return content.replace(
        /<select([^>]*?)>/g,
        (match, attrs) => {
          if (match.includes('aria-label') || match.includes('aria-labelledby')) {
            return match;
          }
          return `<select${attrs} aria-label="Select option">`;
        }
      );
    },
  },
  
  // Textarea without labels
  {
    pattern: /<textarea([^>]*?)>/g,
    check: (match) => !match.includes('aria-label') && !match.includes('aria-labelledby'),
    fix: (content) => {
      return content.replace(
        /<textarea([^>]*?)>/g,
        (match, attrs) => {
          if (match.includes('aria-label') || match.includes('aria-labelledby')) {
            return match;
          }
          
          const placeholderMatch = match.match(/placeholder="([^"]+)"/);
          const label = placeholderMatch ? placeholderMatch[1] : 'Text input';
          
          return `<textarea${attrs} aria-label="${label}">`;
        }
      );
    },
  },
  
  // Clickable divs without role
  {
    pattern: /<div([^>]*?)onClick=/g,
    check: (match) => !match.includes('role=') && !match.includes('button'),
    fix: (content) => {
      return content.replace(
        /<div([^>]*?)onClick=/g,
        (match, attrs) => {
          if (match.includes('role=')) return match;
          return `<div${attrs} role="button" tabIndex={0} onClick=`;
        }
      );
    },
  },
  
  // Images without alt text
  {
    pattern: /<img([^>]*?)src=/g,
    check: (match) => !match.includes('alt='),
    fix: (content) => {
      return content.replace(
        /<img([^>]*?)src=/g,
        (match, attrs) => {
          if (match.includes('alt=')) return match;
          return `<img${attrs} alt="" src=`;
        }
      );
    },
  },
  
  // Links without descriptive text
  {
    pattern: /<a([^>]*?)href="([^"]+)"([^>]*?)>\s*<([A-Z][a-zA-Z]*Icon)/g,
    check: (match) => !match.includes('aria-label'),
    fix: (content) => {
      return content.replace(
        /<a([^>]*?)href="([^"]+)"([^>]*?)>\s*<([A-Z][a-zA-Z]*Icon)/g,
        (match, before, href, after, iconName) => {
          if (match.includes('aria-label')) return match;
          
          const action = iconName
            .replace(/Icon$/, '')
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .toLowerCase();
          
          return `<a${before}href="${href}"${after} aria-label="${action}">\n        <${iconName}`;
        }
      );
    },
  },
  
  // Dialog/Modal without role
  {
    pattern: /<div([^>]*?)className="[^"]*?(dialog|modal|popup|overlay)[^"]*?"/g,
    check: (match) => !match.includes('role=') && !match.includes('Dialog'),
    fix: (content) => {
      return content.replace(
        /<div([^>]*?)className="([^"]*?(dialog|modal|popup|overlay)[^"]*?)"/g,
        (match, attrs, className) => {
          if (match.includes('role=')) return match;
          return `<div${attrs} role="dialog" aria-modal="true" className="${className}"`;
        }
      );
    },
  },
  
  // Navigation without role
  {
    pattern: /<div([^>]*?)className="[^"]*?(nav|navigation|menu)[^"]*?"/g,
    check: (match) => !match.includes('role=') && !match.includes('<nav'),
    fix: (content) => {
      return content.replace(
        /<div([^>]*?)className="([^"]*?(nav|navigation|menu)[^"]*?)"/g,
        (match, attrs, className) => {
          if (match.includes('role=')) return match;
          return `<div${attrs} role="navigation" className="${className}"`;
        }
      );
    },
  },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;
    let addedCount = 0;
    
    for (const pattern of ariaPatterns) {
      const matches = content.match(pattern.pattern);
      if (matches && matches.some(m => pattern.check(m))) {
        const before = content;
        content = pattern.fix(content);
        if (content !== before) {
          modified = true;
          const newMatches = content.match(pattern.pattern) || [];
          addedCount += (matches.length - newMatches.length);
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      ariaAttributesAdded += addedCount;
      console.log(`✅ Fixed: ${path.relative(ROOT_DIR, filePath)} (+${addedCount} ARIA attributes)`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function findComponentFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item.name);
      
      if (item.isDirectory()) {
        if (!item.name.startsWith('.') && item.name !== 'node_modules') {
          traverse(fullPath);
        }
      } else if (item.name.endsWith('.tsx') || item.name.endsWith('.jsx')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

function main() {
  console.log('🔍 Finding component files...');
  const componentFiles = findComponentFiles(COMPONENTS_DIR);
  console.log(`📁 Found ${componentFiles.length} component files\n`);
  
  console.log('🔧 Adding ARIA attributes...\n');
  
  for (const file of componentFiles) {
    processFile(file);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✨ ACCESSIBILITY REMEDIATION COMPLETE');
  console.log('='.repeat(80));
  console.log(`📊 Files Modified: ${filesModified}`);
  console.log(`🎯 ARIA Attributes Added: ${ariaAttributesAdded}`);
  console.log(`📈 Target: 100% accessibility compliance (WCAG 2.1 AA)`);
  console.log('='.repeat(80));
}

main();
