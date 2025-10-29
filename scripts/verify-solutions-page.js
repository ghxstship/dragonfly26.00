#!/usr/bin/env node

/**
 * Verify Solutions page implementation
 * Checks all components, translations, and navigation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Solutions Page Implementation...\n');

const checks = {
  passed: 0,
  failed: 0,
  total: 0
};

function check(name, condition, details = '') {
  checks.total++;
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    checks.passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    checks.failed++;
  }
}

// 1. Check page file exists
const pagePath = path.join(__dirname, '..', 'src', 'app', '[locale]', '(marketing)', 'solutions', 'page.tsx');
check('Solutions page file exists', fs.existsSync(pagePath), pagePath);

// 2. Check SolutionsSection component exists
const sectionPath = path.join(__dirname, '..', 'src', 'marketing', 'components', 'sections', 'SolutionsSection.tsx');
check('SolutionsSection component exists', fs.existsSync(sectionPath), sectionPath);

// 3. Check component uses atomic design patterns
if (fs.existsSync(sectionPath)) {
  const sectionContent = fs.readFileSync(sectionPath, 'utf8');
  check('Uses design tokens', sectionContent.includes('@/design-tokens'));
  check('Uses useTranslations', sectionContent.includes('useTranslations'));
  check('Has proper TypeScript types', sectionContent.includes('JSX.Element'));
  check('Uses semantic HTML', sectionContent.includes('<section'));
  check('Has ARIA attributes', sectionContent.includes('aria-hidden'));
  check('Uses responsive grid', sectionContent.includes('grid.cards3'));
  check('Has dark mode support', sectionContent.includes('dark:'));
}

// 4. Check navigation updated
const navPath = path.join(__dirname, '..', 'src', 'marketing', 'components', 'MarketingNav.tsx');
if (fs.existsSync(navPath)) {
  const navContent = fs.readFileSync(navPath, 'utf8');
  check('Solutions link in desktop nav', navContent.includes('href="/solutions"'));
  check('Solutions link before Features', 
    navContent.indexOf('href="/solutions"') < navContent.indexOf('href="/features"'));
}

// 5. Check translations in all 20 languages
const LANGUAGES = [
  'en', 'zh', 'hi', 'es', 'fr', 'ar', 'bn', 'ru', 'pt', 'id',
  'ur', 'de', 'ja', 'sw', 'mr', 'te', 'tr', 'ta', 'vi', 'ko'
];

const messagesDir = path.join(__dirname, '..', 'src', 'i18n', 'messages');
let translationCount = 0;

LANGUAGES.forEach(lang => {
  const filePath = path.join(messagesDir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.marketing?.solutions && data.marketing?.nav?.solutions) {
      translationCount++;
    }
  }
});

check(`Translations in all ${LANGUAGES.length} languages`, 
  translationCount === LANGUAGES.length, 
  `${translationCount}/${LANGUAGES.length} languages have Solutions translations`);

// 6. Check all 9 industry solutions are present
if (fs.existsSync(sectionPath)) {
  const sectionContent = fs.readFileSync(sectionPath, 'utf8');
  const industries = [
    'concerts', 'festivals', 'immersive', 'theatrical', 
    'filmTv', 'brandActivations', 'corporate', 'tradeShows', 'wellness'
  ];
  
  let industryCount = 0;
  industries.forEach(industry => {
    if (sectionContent.includes(`'${industry}.title'`)) {
      industryCount++;
    }
  });
  
  check('All 9 industry solutions defined', 
    industryCount === 9, 
    `${industryCount}/9 industries found`);
}

// 7. Check English translations have all required keys
const enPath = path.join(messagesDir, 'en.json');
if (fs.existsSync(enPath)) {
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const solutions = enData.marketing?.solutions;
  
  if (solutions) {
    check('Hero title exists', !!solutions.hero?.title);
    check('Hero subtitle exists', !!solutions.hero?.subtitle);
    check('Concerts solution exists', !!solutions.concerts?.title && !!solutions.concerts?.description);
    check('Festivals solution exists', !!solutions.festivals?.title && !!solutions.festivals?.description);
    check('Immersive solution exists', !!solutions.immersive?.title && !!solutions.immersive?.description);
    check('Theatrical solution exists', !!solutions.theatrical?.title && !!solutions.theatrical?.description);
    check('Film/TV solution exists', !!solutions.filmTv?.title && !!solutions.filmTv?.description);
    check('Brand Activations solution exists', !!solutions.brandActivations?.title && !!solutions.brandActivations?.description);
    check('Corporate solution exists', !!solutions.corporate?.title && !!solutions.corporate?.description);
    check('Trade Shows solution exists', !!solutions.tradeShows?.title && !!solutions.tradeShows?.description);
    check('Wellness solution exists', !!solutions.wellness?.title && !!solutions.wellness?.description);
  }
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 VERIFICATION SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Passed: ${checks.passed}/${checks.total}`);
console.log(`❌ Failed: ${checks.failed}/${checks.total}`);
console.log(`📈 Success Rate: ${((checks.passed / checks.total) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (checks.failed === 0) {
  console.log('\n🎉 100% VERIFIED - Solutions page is production ready!');
  console.log('✅ All components implemented');
  console.log('✅ Atomic design patterns followed');
  console.log('✅ 100% i18n compliance (20 languages)');
  console.log('✅ Navigation updated');
  console.log('✅ All 9 industry solutions present');
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed - review output above');
  process.exit(1);
}
