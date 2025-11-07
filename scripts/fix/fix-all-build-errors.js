const fs = require('fs');
const path = require('path');

const fixes = [
  // Fix activity-tab.tsx - remove extra opening brace
  {
    file: 'src/components/community/activity-tab.tsx',
    search: /value=\{\s*\{posts\.reduce/g,
    replace: 'value={posts.reduce'
  },
  // Fix competitions-tab.tsx - remove extra opening brace
  {
    file: 'src/components/community/competitions-tab.tsx',
    search: /value=\{\s*\{competitions\.filter/g,
    replace: 'value={competitions.filter'
  },
  // Fix connections-tab.tsx - malformed JSX
  {
    file: 'src/components/community/connections-tab.tsx',
    search: /onClick=\{\(\) => setSelectedConnection\(connection\)\}>/g,
    replace: 'onClick={() => setSelectedConnection(connection)}\n                >'
  },
  // Fix discussions-tab.tsx - malformed JSX
  {
    file: 'src/components/community/discussions-tab.tsx',
    search: /onClick=\{\(\) => setSelectedDiscussion\(discussion\)\}>/g,
    replace: 'onClick={() => setSelectedDiscussion(discussion)}\n                >'
  },
  // Fix events-tab.tsx - malformed JSX
  {
    file: 'src/components/community/events-tab.tsx',
    search: /onClick=\{\(\) => setSelectedEvent\(event\)\}>/g,
    replace: 'onClick={() => setSelectedEvent(event)}\n                >'
  },
  // Fix news-tab.tsx - malformed JSX
  {
    file: 'src/components/community/news-tab.tsx',
    search: /onClick=\{\(\) => setSelectedArticle\(article\)\}>/g,
    replace: 'onClick={() => setSelectedArticle(article)}\n              >'
  },
  // Fix studios-tab.tsx - malformed JSX
  {
    file: 'src/components/community/studios-tab.tsx',
    search: /onClick=\{\(\) => setSelectedStudio\(studio\)\}>/g,
    replace: 'onClick={() => setSelectedStudio(studio)}\n                >'
  },
  // Fix companies-contacts-tab.tsx - malformed JSX
  {
    file: 'src/components/companies/companies-contacts-tab.tsx',
    search: /onClick=\{\(\) => \{\s*setSelectedContact\(contact\)\s*setDrawerMode\('view'\)\s*\}\}>/g,
    replace: 'onClick={() => {\n                  setSelectedContact(contact)\n                  setDrawerMode(\'view\')\n                }}\n                >'
  },
  // Fix companies-organizations-tab.tsx - malformed JSX
  {
    file: 'src/components/companies/companies-organizations-tab.tsx',
    search: /onClick=\{\(\) => \{\s*setSelectedOrg\(org\)\s*setDrawerMode\('view'\)\s*\}\}>/g,
    replace: 'onClick={() => {\n                  setSelectedOrg(org)\n                  setDrawerMode(\'view\')\n                }}\n                >'
  },
  // Fix custom-statuses-tab.tsx - extra closing brace on line 238
  {
    file: 'src/components/admin/custom-statuses-tab.tsx',
    search: /style=\{\{ backgroundColor: status\.color \}\}>/g,
    replace: 'style={{ backgroundColor: status.color }}\n                />'
  }
];

let totalFixed = 0;

fixes.forEach(fix => {
  const filePath = path.join(__dirname, '..', fix.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fix.file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  content = content.replace(fix.search, fix.replace);
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${fix.file}`);
    totalFixed++;
  } else {
    console.log(`⚠️  No match found in: ${fix.file}`);
  }
});

console.log(`\n✅ Total files fixed: ${totalFixed}/${fixes.length}`);
