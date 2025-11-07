#!/usr/bin/env node

/**
 * Update Marketing Typography
 * 
 * This script updates all marketing section components to use the new typography system:
 * - Titles: font-title uppercase (Anton SC)
 * - Headings: font-heading uppercase (Bebas Neue)
 * - Body: font-tech (Share Tech) - applied via layout
 * - Mono: font-tech-mono (Share Tech Mono)
 * - Logo: font-pixel (Coral Pixels)
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');

const updates = [
  // Update h2 tags (section headings) - use font-heading uppercase
  {
    pattern: /<h2\s+className="([^"]*?)"/g,
    replacement: (match, classes) => {
      if (!classes.includes('font-heading')) {
        // Remove font-bold if present
        const newClasses = classes.replace(/font-bold\s*/g, '');
        return `<h2 className="${newClasses} font-heading uppercase"`;
      }
      return match;
    },
    description: 'Update h2 tags to use font-heading uppercase'
  },
  // Update h3 tags (subsection headings) - use font-heading uppercase
  {
    pattern: /<h3\s+className="([^"]*?)"/g,
    replacement: (match, classes) => {
      if (!classes.includes('font-heading')) {
        // Remove font-bold if present
        const newClasses = classes.replace(/font-bold\s*/g, '');
        return `<h3 className="${newClasses} font-heading uppercase"`;
      }
      return match;
    },
    description: 'Update h3 tags to use font-heading uppercase'
  },
  // Update h4 tags (smaller headings) - use font-heading uppercase
  {
    pattern: /<h4\s+className="([^"]*?)"/g,
    replacement: (match, classes) => {
      if (!classes.includes('font-heading')) {
        const newClasses = classes.replace(/font-bold\s*/g, '');
        return `<h4 className="${newClasses} font-heading uppercase"`;
      }
      return match;
    },
    description: 'Update h4 tags to use font-heading uppercase'
  }
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changes = [];

  updates.forEach(update => {
    const originalContent = content;
    
    if (typeof update.replacement === 'function') {
      // For complex replacements with context
      const lines = content.split('\n');
      const newLines = lines.map((line, index) => {
        if (update.pattern.test(line)) {
          const newLine = line.replace(update.pattern, update.replacement);
          if (newLine !== line) {
            changes.push(`Line ${index + 1}: ${update.description}`);
            return newLine;
          }
        }
        return line;
      });
      content = newLines.join('\n');
    } else {
      // For simple string replacements
      content = content.replace(update.pattern, update.replacement);
    }

    if (content !== originalContent) {
      modified = true;
      if (changes.length === 0) {
        changes.push(update.description);
      }
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return changes;
  }

  return null;
}

function main() {
  console.log('🎨 Updating Marketing Typography...\n');

  const files = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));

  let totalUpdated = 0;
  const results = [];

  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    const changes = updateFile(filePath);

    if (changes) {
      totalUpdated++;
      results.push({
        file: fileName,
        changes: changes
      });
      console.log(`✅ ${fileName}`);
      changes.forEach(change => console.log(`   - ${change}`));
    } else {
      console.log(`⏭️  ${fileName} (no changes needed)`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${files.length}`);
  console.log(`   Files updated: ${totalUpdated}`);
  console.log(`   Files unchanged: ${files.length - totalUpdated}`);

  if (totalUpdated > 0) {
    console.log('\n✨ Marketing typography updated successfully!');
    console.log('\n📝 Typography System:');
    console.log('   - Titles (h1): font-title uppercase (Anton SC)');
    console.log('   - Headings (h2-h4): font-heading uppercase (Bebas Neue)');
    console.log('   - Body: font-tech (Share Tech) - via layout');
    console.log('   - Mono: font-tech-mono (Share Tech Mono)');
    console.log('   - Logo: font-pixel (Coral Pixels)');
  } else {
    console.log('\n✨ All files already up to date!');
  }
}

main();
