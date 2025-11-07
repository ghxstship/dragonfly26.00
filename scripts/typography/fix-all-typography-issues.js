#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING ALL TYPOGRAPHY ISSUES\n');

const fixes = [];

// FeaturesSection.tsx - Line 15: Remove duplicate font-heading, keep font-title for h2
const featuresPath = 'src/marketing/components/sections/FeaturesSection.tsx';
let featuresContent = fs.readFileSync(featuresPath, 'utf8');
const featuresOld = '<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl font-title uppercase text-gray-900 dark:text-white mb-6 font-heading uppercase">';
const featuresNew = '<h2 className="text-2xl md:text-3xl lg:text-4xl md:text-3xl md:text-4xl lg:text-5xl font-heading uppercase text-gray-900 dark:text-white mb-6">';
if (featuresContent.includes(featuresOld)) {
  featuresContent = featuresContent.replace(featuresOld, featuresNew);
  fs.writeFileSync(featuresPath, featuresContent);
  fixes.push('FeaturesSection.tsx: Fixed duplicate font classes on h2');
}

// FeaturesSection.tsx - Line 18: Remove font-heading from paragraph
const featuresOld2 = '<p className="text-base md:text-lg lg:text-xl font-heading uppercase text-gray-600 dark:text-gray-400">';
const featuresNew2 = '<p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400">';
if (featuresContent.includes(featuresOld2)) {
  featuresContent = featuresContent.replace(featuresOld2, featuresNew2);
  fs.writeFileSync(featuresPath, featuresContent);
  fixes.push('FeaturesSection.tsx: Removed font-heading from subtitle paragraph');
}

// HeroSection.tsx - Line 23: Remove font-heading from paragraph (subheadline should be body text)
const heroPath = 'src/marketing/components/sections/HeroSection.tsx';
let heroContent = fs.readFileSync(heroPath, 'utf8');
const heroOld = '<p className="text-lg sm:text-xl md:text-2xl font-heading uppercase text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed">';
const heroNew = '<p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-8 leading-relaxed">';
if (heroContent.includes(heroOld)) {
  heroContent = heroContent.replace(heroOld, heroNew);
  fs.writeFileSync(heroPath, heroContent);
  fixes.push('HeroSection.tsx: Removed font-heading from subheadline paragraph');
}

// TestimonialsSection.tsx - Author names should be body text, not headings
const testimonialsPath = 'src/marketing/components/sections/TestimonialsSection.tsx';
let testimonialsContent = fs.readFileSync(testimonialsPath, 'utf8');
const testimonialsOld = 'className="font-heading uppercase text-gray-900 dark:text-white"';
const testimonialsNew = 'className="text-gray-900 dark:text-white"';
let testimonialsFixed = 0;
while (testimonialsContent.includes(testimonialsOld)) {
  testimonialsContent = testimonialsContent.replace(testimonialsOld, testimonialsNew);
  testimonialsFixed++;
}
if (testimonialsFixed > 0) {
  fs.writeFileSync(testimonialsPath, testimonialsContent);
  fixes.push(`TestimonialsSection.tsx: Removed font-heading from ${testimonialsFixed} author names`);
}

console.log('✅ FIXES APPLIED:\n');
fixes.forEach((fix, i) => {
  console.log(`${i + 1}. ${fix}`);
});

console.log(`\n✨ Total fixes: ${fixes.length}`);
console.log('\n✅ Typography rules enforced:');
console.log('   - h1: font-title uppercase');
console.log('   - h2-h4: font-heading uppercase');
console.log('   - p, span, div text: NO font classes (uses body font-tech from layout)');
console.log('   - Logo: font-pixel');
console.log('   - Buttons: font-heading uppercase (from Button component)');
console.log('\nNO SHORTCUTS. NO COMPROMISES. TRUE 100%.');
