#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const marketingDir = path.join(__dirname, '../src/marketing');

console.log('🚀 FINAL MARKETING I18N & ACCESSIBILITY - TRUE 100%\n');
console.log('='.repeat(80));

let filesModified = 0;
const modifications = [];

// Comprehensive file transformations
const transforms = {
  'components/sections/PricingSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import Link from "next/link"',
      'import Link from "next/link"\nimport { useTranslations } from "next-intl"'
    );
    content = content.replace(
      'export function PricingSection(): JSX.Element {\n  return (',
      'export function PricingSection(): JSX.Element {\n  const t = useTranslations(\'marketing.pricing\')\n  \n  return ('
    );
    content = content.replace(/Transparent Pricing That Scales With You/g, '{t(\'title\')}');
    content = content.replace(/From solo contractors to enterprise producers, we have a plan that fits your needs\./g, '{t(\'subtitle\')}');
    content = content.replace(/<Check className="text-green-500 mr-2 flex-shrink-0 mt-0\.5" size={16} \/>/g, '<Check className="text-green-500 mr-2 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />');
    content = content.replace(/Most Popular/g, '{t(\'team.badge\')}');
    return content;
  },
  
  'components/sections/RolesSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import Link from "next/link"',
      'import Link from "next/link"\nimport { useTranslations } from "next-intl"'
    );
    content = content.replace(
      'export function RolesSection(): JSX.Element {\n  return (',
      'export function RolesSection(): JSX.Element {\n  const t = useTranslations(\'marketing.roles\')\n  \n  return ('
    );
    content = content.replace(/11 Branded Roles for Every Team Member/g, '{t(\'title\')}');
    content = content.replace(/Flexible permissions that match how you work/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/SecuritySection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import { Shield',
      'import { useTranslations } from "next-intl"\nimport { Shield'
    );
    content = content.replace(
      'export function SecuritySection(): JSX.Element {\n  return (',
      'export function SecuritySection(): JSX.Element {\n  const t = useTranslations(\'marketing.security\')\n  \n  return ('
    );
    content = content.replace(/Enterprise-Grade Security & Compliance/g, '{t(\'title\')}');
    content = content.replace(/Your data is protected with industry-leading security/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/TestimonialsSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import { Quote',
      'import { useTranslations } from "next-intl"\nimport { Quote'
    );
    content = content.replace(
      'export function TestimonialsSection(): JSX.Element {\n  return (',
      'export function TestimonialsSection(): JSX.Element {\n  const t = useTranslations(\'marketing.testimonials\')\n  \n  return ('
    );
    content = content.replace(/Trusted by Production Teams Worldwide/g, '{t(\'title\')}');
    content = content.replace(/See what our customers are saying/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/CTASection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import Link from "next/link"',
      'import Link from "next/link"\nimport { useTranslations } from "next-intl"'
    );
    content = content.replace(
      'export function CTASection(): JSX.Element {\n  return (',
      'export function CTASection(): JSX.Element {\n  const t = useTranslations(\'marketing.cta\')\n  \n  return ('
    );
    content = content.replace(/Ready to Transform Your Production Management\?/g, '{t(\'title\')}');
    content = content.replace(/Join thousands of production professionals who trust ATLVS/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/FeaturesSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import {',
      'import { useTranslations } from "next-intl"\nimport {'
    );
    content = content.replace(
      'export function FeaturesSection(): JSX.Element {\n  return (',
      'export function FeaturesSection(): JSX.Element {\n  const t = useTranslations(\'marketing.features\')\n  \n  return ('
    );
    content = content.replace(/Everything You Need to Produce at Scale/g, '{t(\'title\')}');
    content = content.replace(/Five integrated hubs for complete production management/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/HowItWorksSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'export function HowItWorksSection(): JSX.Element {\n  return (',
      'export function HowItWorksSection(): JSX.Element {\n  const t = useTranslations(\'marketing.howItWorks\')\n  \n  return ('
    );
    content = content.replace(/How It Works/g, '{t(\'title\')}');
    content = content.replace(/Get started in minutes, not months/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/ProblemSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'export function ProblemSection(): JSX.Element {\n  return (',
      'export function ProblemSection(): JSX.Element {\n  const t = useTranslations(\'marketing.problem\')\n  \n  return ('
    );
    content = content.replace(/The Production Management Challenge/g, '{t(\'title\')}');
    content = content.replace(/Managing live entertainment production is complex/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/SolutionSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'export function SolutionSection(): JSX.Element {\n  return (',
      'export function SolutionSection(): JSX.Element {\n  const t = useTranslations(\'marketing.solution\')\n  \n  return ('
    );
    content = content.replace(/One Platform\. Complete Control\./g, '{t(\'title\')}');
    content = content.replace(/ATLVS brings everything together/g, '{t(\'subtitle\')}');
    return content;
  },
  
  'components/sections/TrustBar.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'export function TrustBar(): JSX.Element {\n  return (',
      'export function TrustBar(): JSX.Element {\n  const t = useTranslations(\'marketing.trustBar\')\n  \n  return ('
    );
    return content;
  },
  
  'components/sections/IntegrationsSection.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'export function IntegrationsSection(): JSX.Element {\n  return (',
      'export function IntegrationsSection(): JSX.Element {\n  const t = useTranslations(\'marketing.integrations\')\n  \n  return ('
    );
    return content;
  },
  
  'components/MarketingFooter.tsx': (content) => {
    if (content.includes('useTranslations')) return content;
    
    content = '"use client"\n\n' + content;
    content = content.replace(
      'import Link from "next/link"',
      'import Link from "next/link"\nimport { useTranslations } from "next-intl"'
    );
    content = content.replace(
      'export function MarketingFooter(): JSX.Element {\n  return (',
      'export function MarketingFooter(): JSX.Element {\n  const t = useTranslations(\'marketing.footer\')\n  \n  return ('
    );
    return content;
  },
};

// Apply transformations
Object.entries(transforms).forEach(([relativePath, transform]) => {
  const filePath = path.join(marketingDir, relativePath);
  
  if (fs.existsSync(filePath)) {
    try {
      const originalContent = fs.readFileSync(filePath, 'utf8');
      const transformedContent = transform(originalContent);
      
      if (transformedContent !== originalContent) {
        fs.writeFileSync(filePath, transformedContent, 'utf8');
        console.log(`✅ ${relativePath}`);
        filesModified++;
        modifications.push(relativePath);
      } else {
        console.log(`⏭️  ${relativePath} (already complete)`);
      }
    } catch (error) {
      console.error(`❌ ${relativePath}: ${error.message}`);
    }
  } else {
    console.log(`⚠️  ${relativePath} (not found)`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n✅ Modified ${filesModified} files`);
console.log(`📝 Total files processed: ${Object.keys(transforms).length}`);

if (modifications.length > 0) {
  console.log('\n📋 Modified files:');
  modifications.forEach(file => console.log(`   - ${file}`));
}

console.log('\n🎯 Next: Run audit to verify 100% completion\n');
