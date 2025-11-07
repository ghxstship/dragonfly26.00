#!/usr/bin/env node

/**
 * Advanced Bullet Point Wrapping Fix
 * Adds flex-shrink-0 to bullets and break-words to text spans
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const DRY_RUN = process.argv.includes('--dry-run');

let filesModified = 0;
let totalFixes = 0;

function findFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && !file.startsWith('.')) {
      results = results.concat(findFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  return results;
}

function fixBulletPoints(content) {
  let modified = false;
  let fixes = 0;

  // Pattern 1: Fix bullet spans without flex-shrink-0
  const bulletPattern = /<span className="([^"]*)(h-1\.5 w-1\.5 rounded-full|text-green-\d+|text-primary)(?!.*flex-shrink-0)([^"]*)">([•▸]|<[^>]+\/>)<\/span>/g;
  content = content.replace(bulletPattern, (match, before, middle, after, bullet) => {
    if (!before.includes('flex-shrink-0') && !after.includes('flex-shrink-0')) {
      fixes++;
      modified = true;
      return `<span className="${before}${middle} flex-shrink-0${after}">${bullet}</span>`;
    }
    return match;
  });

  // Pattern 2: Fix text spans without break-words in bullet lists
  const textPattern = /<span className="([^"]*)"(?!.*break-words)>([^<]+)<\/span>/g;
  const lines = content.split('\n');
  let inBulletList = false;
  
  content = lines.map(line => {
    // Detect if we're in a bullet list context
    if (line.includes('flex items-start gap-2')) {
      inBulletList = true;
    } else if (line.includes('</ul>') || line.includes('</div>')) {
      inBulletList = false;
    }

    if (inBulletList && line.includes('<span') && !line.includes('break-words')) {
      return line.replace(textPattern, (match, classes, text) => {
        if (classes.includes('flex-1') && !classes.includes('break-words')) {
          fixes++;
          modified = true;
          return `<span className="${classes} break-words">${text}</span>`;
        }
        return match;
      });
    }
    return line;
  }).join('\n');

  return { content, modified, fixes };
}

function processFile(filePath) {
  try {
    const originalContent = fs.readFileSync(filePath, 'utf-8');
    const { content, modified, fixes } = fixBulletPoints(originalContent);

    if (modified) {
      if (!DRY_RUN) {
        fs.writeFileSync(filePath, content, 'utf-8');
      }
      filesModified++;
      totalFixes += fixes;
      return { modified: true, fixes };
    }
    return { modified: false };
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err.message);
    return { modified: false, error: err.message };
  }
}

function main() {
  console.log('🎯 Fixing Advanced Bullet Point Wrapping...\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE\n');
  }

  const files = findFiles(COMPONENTS_DIR);
  console.log(`Scanning ${files.length} files...\n`);

  const results = [];
  files.forEach(file => {
    const result = processFile(file);
    if (result.modified) {
      results.push({ file: path.relative(COMPONENTS_DIR, file), ...result });
    }
  });

  console.log('='.repeat(60));
  console.log(`Files Modified: ${filesModified}`);
  console.log(`Total Fixes: ${totalFixes}`);
  console.log('='.repeat(60));

  if (results.length > 0 && results.length <= 20) {
    console.log('\nModified Files:');
    results.forEach(r => {
      console.log(`  • ${r.file} (${r.fixes} fixes)`);
    });
  }

  if (!DRY_RUN && filesModified > 0) {
    console.log('\n✅ Bullet point fixes applied!');
  }
}

main();
