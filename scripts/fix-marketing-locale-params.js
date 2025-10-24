#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = path.join(__dirname, '../src/app/[locale]/(marketing)');

// Find all page.tsx files recursively
function findPageFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...findPageFiles(fullPath));
    } else if (item === 'page.tsx') {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Fix a page file to accept locale params
function fixPageFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has params
  if (content.includes('params: Promise<{ locale: string }>') || content.includes('params: { locale: string }')) {
    console.log(`✓ Skipped (already fixed): ${path.relative(marketingDir, filePath)}`);
    return false;
  }
  
  // Find the export default function line
  const functionMatch = content.match(/export default function (\w+)\(\) \{/);
  
  if (!functionMatch) {
    console.log(`⚠ Could not find function declaration: ${path.relative(marketingDir, filePath)}`);
    return false;
  }
  
  const functionName = functionMatch[1];
  
  // Replace the function signature
  content = content.replace(
    `export default function ${functionName}() {`,
    `interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function ${functionName}({ params }: PageProps) {
  await params // Consume params to satisfy Next.js`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Fixed: ${path.relative(marketingDir, filePath)}`);
  return true;
}

// Main execution
console.log('Finding marketing page files...\n');
const pageFiles = findPageFiles(marketingDir);
console.log(`Found ${pageFiles.length} page files\n`);

let fixed = 0;
for (const file of pageFiles) {
  if (fixPageFile(file)) {
    fixed++;
  }
}

console.log(`\n✅ Fixed ${fixed} files`);
console.log(`✓ Skipped ${pageFiles.length - fixed} files (already fixed)`);
