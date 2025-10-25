#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix quote escaping in careers page
const careersPath = '/Users/julianclarkson/Documents/Dragonfly26.00/src/app/[locale]/(marketing)/careers/page.tsx';
let careersContent = fs.readFileSync(careersPath, 'utf8');
careersContent = careersContent.replace(/Don't See/g, "Don&apos;t See");
careersContent = careersContent.replace(/We're always/g, "We&apos;re always");
careersContent = careersContent.replace(/let's talk/g, "let&apos;s talk");
fs.writeFileSync(careersPath, careersContent);
console.log('✅ Fixed careers page quotes');

// Fix quote escaping in case-studies page
const caseStudiesPath = '/Users/julianclarkson/Documents/Dragonfly26.00/src/app/[locale]/(marketing)/case-studies/page.tsx';
let caseStudiesContent = fs.readFileSync(caseStudiesPath, 'utf8');
caseStudiesContent = caseStudiesContent.replace(/"{/g, '&ldquo;{');
caseStudiesContent = caseStudiesContent.replace(/}"/g, '}&rdquo;');
fs.writeFileSync(caseStudiesPath, caseStudiesContent);
console.log('✅ Fixed case-studies page quotes');

// Fix duplicate props in marketing sections
const sectionsToFix = [
  'PricingSection.tsx',
  'ProblemSection.tsx',
  'SecuritySection.tsx',
  'SolutionSection.tsx',
  'TestimonialsSection.tsx'
];

sectionsToFix.forEach(file => {
  const filePath = `/Users/julianclarkson/Documents/Dragonfly26.00/src/marketing/components/sections/${file}`;
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove duplicate iconBgColor props
    content = content.replace(/iconBgColor="([^"]+)"\s+iconBgColor="([^"]+)"/g, 'iconBgColor="$1"');
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${file}`);
  }
});

console.log('\n✅ All lint errors fixed!');
