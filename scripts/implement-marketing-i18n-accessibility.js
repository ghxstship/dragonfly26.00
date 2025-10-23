#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = path.join(__dirname, '../src/marketing');

// File-specific transformations
const fileTransformations = {
  'components/MarketingNav.tsx': (content) => {
    // Add useTranslations import
    if (!content.includes('useTranslations')) {
      content = content.replace(
        '"use client"\n\nimport { useState } from "react"',
        '"use client"\n\nimport { useState } from "react"\nimport { useTranslations } from "next-intl"'
      );
    }
    
    // Add translation hook
    if (!content.includes('const t = useTranslations')) {
      content = content.replace(
        'export function MarketingNav(): JSX.Element {\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)',
        'export function MarketingNav(): JSX.Element {\n  const t = useTranslations(\'marketing.nav\')\n  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)'
      );
    }
    
    // Replace hardcoded strings
    content = content.replace(
      /<div className="text-2xl font-bold text-gray-900">ATLVS<\/div>/g,
      '<div className="text-2xl font-bold text-gray-900">{t(\'logo\')}</div>'
    );
    
    content = content.replace(/Features<\/Link>/g, '{t(\'features\')}</Link>');
    content = content.replace(/Pricing<\/Link>/g, '{t(\'pricing\')}</Link>');
    content = content.replace(/Docs<\/Link>/g, '{t(\'docs\')}</Link>');
    content = content.replace(/Blog<\/Link>/g, '{t(\'blog\')}</Link>');
    content = content.replace(/About<\/Link>/g, '{t(\'about\')}</Link>');
    content = content.replace(/Sign In<\/Button>/g, '{t(\'signIn\')}</Button>');
    content = content.replace(/Start Free<\/Button>/g, '{t(\'startFree\')}</Button>');
    
    // Add ARIA labels
    content = content.replace(
      'aria-label="Toggle menu"',
      'aria-label={t(\'toggleMenu\')}'
    );
    
    return content;
  },
  
  'components/sections/HeroSection.tsx': (content) => {
    // Add useTranslations import
    if (!content.includes('useTranslations')) {
      content = content.replace(
        'import Link from "next/link"',
        'import Link from "next/link"\nimport { useTranslations } from "next-intl"'
      );
    }
    
    // Make it a client component if it uses translations
    if (!content.includes('"use client"')) {
      content = '"use client"\n\n' + content;
    }
    
    // Add translation hook
    if (!content.includes('const t = useTranslations')) {
      content = content.replace(
        'export function HeroSection(): JSX.Element {\n  return (',
        'export function HeroSection(): JSX.Element {\n  const t = useTranslations(\'marketing.hero\')\n  \n  return ('
      );
    }
    
    // Replace hardcoded strings
    content = content.replace(
      /The Project Management System for\{" "\}/g,
      '{t(\'headline\')}{" "}'
    );
    content = content.replace(
      /<span className="text-blue-600">Experiential Production Teams<\/span>/g,
      '<span className="text-blue-600">{t(\'headlineHighlight\')}</span>'
    );
    content = content.replace(
      /Unify your projects, workforce, assets, and finances in one powerful platform designed specifically for experiential entertainment production\./g,
      '{t(\'subheadline\')}'
    );
    content = content.replace(
      /From festivals to corporate events, concerts to immersive experiences—ATLVS gives production teams the clarity, control, and collaboration they need to deliver unforgettable moments\./g,
      '{t(\'supportingCopy\')}'
    );
    content = content.replace(/Start Free Today/g, '{t(\'ctaPrimary\')}');
    content = content.replace(/Schedule a Demo/g, '{t(\'ctaSecondary\')}');
    content = content.replace(
      /No credit card required • 14-day free trial • Cancel anytime/g,
      '{t(\'trustIndicators\')}'
    );
    content = content.replace(/Platform Screenshot/g, '{t(\'platformScreenshot\')}');
    
    // Add ARIA hidden to decorative icon
    content = content.replace(
      /<ArrowRight className="ml-2" size={20} \/>/g,
      '<ArrowRight className="ml-2" size={20} aria-hidden="true" />'
    );
    
    return content;
  },
  
  'components/sections/FAQSection.tsx': (content) => {
    // Add useTranslations import
    if (!content.includes('useTranslations')) {
      content = content.replace(
        'import { useState } from "react"',
        'import { useState } from "react"\nimport { useTranslations } from "next-intl"'
      );
    }
    
    // Add translation hook
    if (!content.includes('const t = useTranslations')) {
      content = content.replace(
        'export function FAQSection(): JSX.Element {\n  const [openIndex, setOpenIndex] = useState<number | null>(0)',
        'export function FAQSection(): JSX.Element {\n  const t = useTranslations(\'marketing.faq\')\n  const [openIndex, setOpenIndex] = useState<number | null>(0)'
      );
    }
    
    // Replace FAQ data with translation keys
    content = content.replace(
      /const faqs = \[[\s\S]*?\]/,
      `const faqs = [
    {
      question: t('question1'),
      answer: t('answer1'),
    },
    {
      question: t('question2'),
      answer: t('answer2'),
    },
    {
      question: t('question3'),
      answer: t('answer3'),
    },
    {
      question: t('question4'),
      answer: t('answer4'),
    },
    {
      question: t('question5'),
      answer: t('answer5'),
    },
    {
      question: t('question6'),
      answer: t('answer6'),
    },
  ]`
    );
    
    // Replace title
    content = content.replace(
      /Frequently Asked Questions/g,
      '{t(\'title\')}'
    );
    
    return content;
  },
};

function transformFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(marketingDir, filePath);
  
  if (fileTransformations[relativePath]) {
    const transformed = fileTransformations[relativePath](content);
    if (transformed !== content) {
      fs.writeFileSync(filePath, transformed, 'utf8');
      console.log(`✅ Transformed: ${relativePath}`);
      return true;
    }
  }
  
  return false;
}

function scanDirectory(dir) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    });
  }
  
  walk(dir);
  return files;
}

console.log('🚀 IMPLEMENTING MARKETING I18N & ACCESSIBILITY\n');
console.log('='.repeat(80));

const files = scanDirectory(marketingDir);
let transformedCount = 0;

files.forEach(file => {
  if (transformFile(file)) {
    transformedCount++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Transformed ${transformedCount} files`);
console.log(`📝 Remaining: ${files.length - transformedCount} files need manual implementation\n`);
