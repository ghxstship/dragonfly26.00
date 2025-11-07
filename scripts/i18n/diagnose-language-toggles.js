#!/usr/bin/env node

/**
 * Language Toggle Diagnosis Script
 * Identifies issues with nationality-based and generational language toggles
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 LANGUAGE TOGGLE DIAGNOSIS\n');
console.log('=' .repeat(80));

const issues = [];
const fixes = [];

// Check 1: LanguageSwitcher implementation
console.log('\n1️⃣  Checking LanguageSwitcher (Nationality-Based)...');
const languageSwitcherPath = path.join(process.cwd(), 'src/components/layout/language-switcher.tsx');
const languageSwitcherContent = fs.readFileSync(languageSwitcherPath, 'utf8');

if (languageSwitcherContent.includes('router.replace(pathname, { locale: newLocale })')) {
  issues.push('❌ LanguageSwitcher uses router.replace which does not trigger full re-render');
  fixes.push('✅ Use router.push + router.refresh() or window.location for full reload');
}

// Check 2: GenerationalLanguageContext usage
console.log('\n2️⃣  Checking GenerationalLanguageToggle...');
const genTogglePath = path.join(process.cwd(), 'src/components/marketing/GenerationalLanguageToggle.tsx');
const genToggleContent = fs.readFileSync(genTogglePath, 'utf8');

if (!genToggleContent.includes('router') && !genToggleContent.includes('window.location')) {
  issues.push('❌ GenerationalLanguageToggle saves to localStorage but does not trigger page update');
  fixes.push('✅ Add page reload or state propagation mechanism after variant change');
}

// Check 3: Translation system integration
console.log('\n3️⃣  Checking translation system integration...');
const messagesDir = path.join(process.cwd(), 'src/i18n/messages');
const enMessages = JSON.parse(fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf8'));

let hasGenerationalVariants = false;
const checkForVariants = (obj, prefix = '') => {
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null) {
      checkForVariants(value, prefix + key + '.');
    } else if (typeof value === 'string') {
      if (key.includes('variant') || key.includes('generational') || key.includes('boomer') || key.includes('gen-')) {
        hasGenerationalVariants = true;
      }
    }
  }
};
checkForVariants(enMessages);

if (!hasGenerationalVariants) {
  issues.push('❌ Translation files do not contain generational variant keys');
  fixes.push('✅ Add generational variant translations or implement variant transformation layer');
}

// Check 4: Middleware locale detection
console.log('\n4️⃣  Checking middleware locale detection...');
const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');

if (!middlewareContent.includes('NEXT_LOCALE')) {
  issues.push('⚠️  Middleware may not be reading NEXT_LOCALE cookie for locale detection');
  fixes.push('✅ Ensure middleware reads cookie and applies locale correctly');
}

// Report findings
console.log('\n' + '='.repeat(80));
console.log('\n📊 DIAGNOSIS RESULTS\n');

if (issues.length === 0) {
  console.log('✅ No issues found!');
} else {
  console.log(`Found ${issues.length} issue(s):\n`);
  issues.forEach((issue, i) => {
    console.log(`${i + 1}. ${issue}`);
  });
  
  console.log('\n💡 RECOMMENDED FIXES:\n');
  fixes.forEach((fix, i) => {
    console.log(`${i + 1}. ${fix}`);
  });
}

console.log('\n' + '='.repeat(80));
console.log('\n🎯 ROOT CAUSES:\n');
console.log('1. LanguageSwitcher: router.replace() does not force component re-render');
console.log('   - Next.js router navigation is optimized and may not reload translations');
console.log('   - Need full page reload or explicit refresh\n');
console.log('2. GenerationalLanguageToggle: No integration with translation system');
console.log('   - Saves preference but does not apply it');
console.log('   - Need to either reload page or implement runtime variant switching\n');
console.log('3. Missing cookie-based locale detection in routing');
console.log('   - Middleware needs to read NEXT_LOCALE cookie and apply it\n');

console.log('=' .repeat(80));
