#!/usr/bin/env node

/**
 * Apply Marketing Typography Fonts
 * 
 * Updates all marketing section components with new typography:
 * - h1: font-title uppercase (Anton SC)
 * - h2, h3, h4: font-heading uppercase (Bebas Neue)
 */

const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, '../src/marketing/components/sections');

function processLine(line) {
  let modified = line;
  let changed = false;

  // Update h1 tags - add font-title uppercase
  if (line.includes('<h1') && line.includes('className=')) {
    if (!line.includes('font-title')) {
      // Remove font-bold, add font-title uppercase
      modified = modified.replace(/font-bold\s*/g, '');
      modified = modified.replace(/className="([^"]*)"/, (match, classes) => {
        const trimmed = classes.trim();
        return `className="${trimmed} font-title uppercase"`;
      });
      changed = true;
    }
  }

  // Update h2 tags - add font-heading uppercase
  if (line.includes('<h2') && line.includes('className=')) {
    if (!line.includes('font-heading')) {
      modified = modified.replace(/font-bold\s*/g, '');
      modified = modified.replace(/className="([^"]*)"/, (match, classes) => {
        const trimmed = classes.trim();
        return `className="${trimmed} font-heading uppercase"`;
      });
      changed = true;
    }
  }

  // Update h3 tags - add font-heading uppercase
  if (line.includes('<h3') && line.includes('className=')) {
    if (!line.includes('font-heading')) {
      modified = modified.replace(/font-bold\s*/g, '');
      modified = modified.replace(/className="([^"]*)"/, (match, classes) => {
        const trimmed = classes.trim();
        return `className="${trimmed} font-heading uppercase"`;
      });
      changed = true;
    }
  }

  // Update h4 tags - add font-heading uppercase
  if (line.includes('<h4') && line.includes('className=')) {
    if (!line.includes('font-heading')) {
      modified = modified.replace(/font-bold\s*/g, '');
      modified = modified.replace(/className="([^"]*)"/, (match, classes) => {
        const trimmed = classes.trim();
        return `className="${trimmed} font-heading uppercase"`;
      });
      changed = true;
    }
  }

  return { line: modified, changed };
}

function updateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let modified = false;
  const changes = [];

  const newLines = lines.map((line, index) => {
    const result = processLine(line);
    if (result.changed) {
      modified = true;
      changes.push(`Line ${index + 1}`);
    }
    return result.line;
  });

  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
    return changes.length;
  }

  return 0;
}

function main() {
  console.log('🎨 Applying Marketing Typography Fonts...\n');

  const files = fs.readdirSync(sectionsDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => path.join(sectionsDir, file));

  let totalUpdated = 0;
  let totalChanges = 0;

  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    const changes = updateFile(filePath);

    if (changes > 0) {
      totalUpdated++;
      totalChanges += changes;
      console.log(`✅ ${fileName} (${changes} changes)`);
    } else {
      console.log(`⏭️  ${fileName}`);
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${files.length}`);
  console.log(`   Files updated: ${totalUpdated}`);
  console.log(`   Total changes: ${totalChanges}`);

  console.log('\n✨ Typography System Applied:');
  console.log('   ✓ h1 tags: font-title uppercase (Anton SC)');
  console.log('   ✓ h2-h4 tags: font-heading uppercase (Bebas Neue)');
  console.log('   ✓ Body text: font-tech (Share Tech) via layout');
  console.log('   ✓ Logo: font-pixel (Coral Pixels)');
}

main();
