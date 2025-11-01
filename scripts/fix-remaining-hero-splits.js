#!/usr/bin/env node

/**
 * Fix remaining hero headline splits that were missed
 */

const fs = require('fs');
const path = require('path');

const messagesDir = path.join(__dirname, '../src/i18n/messages');

// Manual fixes for remaining languages
const fixes = {
  'ar.json': {
    'marketing.hero': {
      headlineHighlight: 'للفرق التجريبية',
      headlineHighlightPrefix: 'للفرق',
      headlineHighlightMain: 'التجريبية'
    },
    'marketing.generational.baby-boomer.hero': {
      headlineHighlight: 'للفرق التجريبية',
      headlineHighlightPrefix: 'للفرق',
      headlineHighlightMain: 'التجريبية'
    },
    'marketing.generational.gen-x.hero': {
      headlineHighlight: 'لا هراء',
      headlineHighlightPrefix: '',
      headlineHighlightMain: 'لا هراء'
    },
    'marketing.generational.millennial.hero': {
      headlineHighlight: 'للفرق التجريبية',
      headlineHighlightPrefix: 'للفرق',
      headlineHighlightMain: 'التجريبية'
    },
    'marketing.generational.gen-z.hero': {
      headlineHighlight: 'لمنشئي الأحداث',
      headlineHighlightPrefix: 'لمنشئي',
      headlineHighlightMain: 'الأحداث'
    },
    'marketing.generational.gen-alpha.hero': {
      headlineHighlight: 'لمنشئي الأحداث',
      headlineHighlightPrefix: 'لمنشئي',
      headlineHighlightMain: 'الأحداث'
    }
  },
  'bn.json': {
    'marketing.hero': {
      headlineHighlight: 'অভিজ্ঞতামূলক দলের জন্য',
      headlineHighlightPrefix: 'জন্য',
      headlineHighlightMain: 'অভিজ্ঞতামূলক দলের'
    },
    'marketing.generational.baby-boomer.hero': {
      headlineHighlight: 'অভিজ্ঞতামূলক দলের জন্য',
      headlineHighlightPrefix: 'জন্য',
      headlineHighlightMain: 'অভিজ্ঞতামূলক দলের'
    },
    'marketing.generational.gen-x.hero': {
      headlineHighlight: 'কোন বিএস নেই',
      headlineHighlightPrefix: '',
      headlineHighlightMain: 'কোন বিএস নেই'
    },
    'marketing.generational.millennial.hero': {
      headlineHighlight: 'অভিজ্ঞতামূলক দলের জন্য',
      headlineHighlightPrefix: 'জন্য',
      headlineHighlightMain: 'অভিজ্ঞতামূলক দলের'
    },
    'marketing.generational.gen-z.hero': {
      headlineHighlight: 'ইভেন্ট নির্মাতাদের জন্য',
      headlineHighlightPrefix: 'জন্য',
      headlineHighlightMain: 'ইভেন্ট নির্মাতাদের'
    },
    'marketing.generational.gen-alpha.hero': {
      headlineHighlight: 'ইভেন্ট নির্মাতাদের জন্য',
      headlineHighlightPrefix: 'জন্য',
      headlineHighlightMain: 'ইভেন্ট নির্মাতাদের'
    }
  },
  'hi.json': {
    'marketing.hero': {
      headlineHighlight: 'अनुभवात्मक टीमों के लिए',
      headlineHighlightPrefix: 'के लिए',
      headlineHighlightMain: 'अनुभवात्मक टीमों'
    },
    'marketing.generational.baby-boomer.hero': {
      headlineHighlight: 'अनुभवात्मक टीमों के लिए',
      headlineHighlightPrefix: 'के लिए',
      headlineHighlightMain: 'अनुभवात्मक टीमों'
    },
    'marketing.generational.gen-x.hero': {
      headlineHighlight: 'कोई बीएस नहीं',
      headlineHighlightPrefix: '',
      headlineHighlightMain: 'कोई बीएस नहीं'
    },
    'marketing.generational.millennial.hero': {
      headlineHighlight: 'अनुभवात्मक टीमों के लिए',
      headlineHighlightPrefix: 'के लिए',
      headlineHighlightMain: 'अनुभवात्मक टीमों'
    },
    'marketing.generational.gen-z.hero': {
      headlineHighlight: 'इवेंट क्रिएटर्स के लिए',
      headlineHighlightPrefix: 'के लिए',
      headlineHighlightMain: 'इवेंट क्रिएटर्स'
    },
    'marketing.generational.gen-alpha.hero': {
      headlineHighlight: 'इवेंट क्रिएटर्स के लिए',
      headlineHighlightPrefix: 'के लिए',
      headlineHighlightMain: 'इवेंट क्रिएटर्स'
    }
  }
};

// Gen-X variants that need empty prefix (no "for" equivalent)
const genXFixes = [
  'ja.json', 'ko.json', 'mr.json', 'ta.json', 'te.json', 'tr.json', 'ur.json', 'vi.json', 'zh.json'
];

function setNestedProperty(obj, path, value) {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]]) {
      current[parts[i]] = {};
    }
    current = current[parts[i]];
  }
  
  current[parts[parts.length - 1]] = value;
}

function getNestedProperty(obj, path) {
  return path.split('.').reduce((current, part) => current?.[part], obj);
}

console.log('🔧 Fixing remaining hero headline splits...\n');

let totalFiles = 0;
let modifiedFiles = 0;

// Fix specific languages (ar, bn, hi)
Object.entries(fixes).forEach(([filename, paths]) => {
  const filepath = path.join(messagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`⏭️  Skipping ${filename} (not found)`);
    return;
  }

  console.log(`📝 Processing ${filename}...`);
  totalFiles++;

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    let modified = false;

    Object.entries(paths).forEach(([path, values]) => {
      setNestedProperty(data, `${path}.headlineHighlightPrefix`, values.headlineHighlightPrefix);
      setNestedProperty(data, `${path}.headlineHighlightMain`, values.headlineHighlightMain);
      console.log(`  ✓ ${path}: "${values.headlineHighlightPrefix}" + "${values.headlineHighlightMain}"`);
      modified = true;
    });

    if (modified) {
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      modifiedFiles++;
      console.log(`  ✅ Updated ${filename}\n`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
  }
});

// Fix Gen-X variants for languages with postpositions
genXFixes.forEach(filename => {
  const filepath = path.join(messagesDir, filename);
  
  if (!fs.existsSync(filepath)) {
    return;
  }

  console.log(`📝 Processing Gen-X for ${filename}...`);
  totalFiles++;

  try {
    const content = fs.readFileSync(filepath, 'utf8');
    const data = JSON.parse(content);
    
    const genXHero = data.marketing?.generational?.['gen-x']?.hero;
    if (genXHero && genXHero.headlineHighlight && !genXHero.headlineHighlightPrefix) {
      genXHero.headlineHighlightPrefix = '';
      genXHero.headlineHighlightMain = genXHero.headlineHighlight;
      
      console.log(`  ✓ gen-x: "" + "${genXHero.headlineHighlightMain}"`);
      
      fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      modifiedFiles++;
      console.log(`  ✅ Updated ${filename}\n`);
    }
  } catch (error) {
    console.error(`  ❌ Error processing ${filename}:`, error.message);
  }
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Complete!`);
console.log(`   Files processed: ${totalFiles}`);
console.log(`   Files modified: ${modifiedFiles}`);
console.log('='.repeat(60));
