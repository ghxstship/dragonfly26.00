#!/usr/bin/env node

/**
 * Network Hub Phase 3: FINAL Complete Internationalization
 * 
 * This script handles ALL remaining hardcoded strings:
 * - Placeholders
 * - SelectValue placeholders
 * - Empty state messages
 * - Button labels
 * - Conditional text
 * - Mock data labels
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');

const FILES_TO_FIX = [
  'community/discussions-tab.tsx',
  'community/events-tab.tsx',
  'community/news-tab.tsx',
  'community/showcase-tab.tsx',
  'community/studios-tab.tsx',
  'marketplace/orders-tab.tsx',
  'marketplace/products-tab.tsx',
  'marketplace/purchases-tab.tsx',
  'marketplace/reviews-tab.tsx',
  'marketplace/services-tab.tsx',
  'marketplace/shop-tab.tsx',
  'marketplace/vendors-tab.tsx',
  'resources/resources-library-tab.tsx',
  'resources/resources-guides-tab.tsx',
  'resources/resources-courses-tab.tsx',
  'resources/resources-grants-tab.tsx',
  'resources/resources-publications-tab.tsx',
  'resources/resources-glossary-tab.tsx',
  'resources/resources-troubleshooting-tab.tsx',
];

// Final comprehensive replacements
const FINAL_REPLACEMENTS = [
  // Discussions placeholders
  [/placeholder="Discussion title\.\.\."/g, `placeholder={t('discussionTitle')}`],
  [/placeholder="Share your thoughts, ask a question, or start a conversation\.\.\."/g, `placeholder={t('shareThoughts')}`],
  
  // Events
  [/event\.price === "free" \? "Free" : /g, `event.price === "free" ? t('free') : `],
  
  // News
  [/placeholder="Search news articles\.\.\."/g, `placeholder={t('searchNews')}`],
  [/"Stay updated with industry news and announcements"/g, `t('stayUpdated')`],
  
  // Showcase
  [/label: "Featured"/g, `label: t('featured')`],
  [/label: "Sponsored"/g, `label: t('sponsored')`],
  [/label: "Achievement"/g, `label: t('achievement')`],
  
  // Studios
  [/placeholder="Search studios, pages, and groups\.\.\."/g, `placeholder={t('searchStudios')}`],
  [/"Discover and connect with production studios"/g, `t('discoverStudios')`],
  [/studio\.visibility === "public" \? "Public" : "Private"/g, `studio.visibility === "public" ? t('public') : t('private')`],
  
  // Marketplace Orders
  [/<SelectValue placeholder="Order Type" \/>/g, `<SelectValue placeholder={t('orderType')} />`],
  [/<SelectValue placeholder="Status" \/>/g, `<SelectValue placeholder={t('status')} />`],
  
  // Marketplace Products
  [/<SelectValue placeholder="Category" \/>/g, `<SelectValue placeholder={t('category')} />`],
  
  // Marketplace Purchases
  [/<SelectValue placeholder="Purchase Type" \/>/g, `<SelectValue placeholder={t('purchaseType')} />`],
  
  // Marketplace Reviews
  [/<SelectValue placeholder="Item Type" \/>/g, `<SelectValue placeholder={t('itemType')} />`],
  [/<SelectValue placeholder="Sort by" \/>/g, `<SelectValue placeholder={t('sortBy')} />`],
  
  // Marketplace Services
  [/<SelectValue placeholder="Service Type" \/>/g, `<SelectValue placeholder={t('serviceType')} />`],
  [/<SelectValue placeholder="Experience Level" \/>/g, `<SelectValue placeholder={t('experienceLevel')} />`],
  
  // Marketplace Shop
  
  // Marketplace Vendors
  [/<SelectValue placeholder="Vendor Type" \/>/g, `<SelectValue placeholder={t('vendorType')} />`],
  [/<SelectValue placeholder="Filter" \/>/g, `<SelectValue placeholder={t('filter')} />`],
  
  // Resources - empty states
  [/"Add courses to build your library"/g, `t('addCourses')`],
  [/actionLabel=\{!searchQuery \? "Add Course" : undefined\}/g, `actionLabel={!searchQuery ? t('addCourse') : undefined}`],
  [/"Try adjusting your search or filter"/g, `t('tryAdjustingSearch')`],
  [/"Add terms to build your glossary"/g, `t('addTerms')`],
  [/actionLabel=\{!searchQuery && !selectedLetter \? "Add Term" : undefined\}/g, `actionLabel={!searchQuery && !selectedLetter ? t('addTerm') : undefined}`],
  [/"Add grants to track funding opportunities"/g, `t('addGrants')`],
  [/actionLabel=\{!searchQuery \? "Add Grant" : undefined\}/g, `actionLabel={!searchQuery ? t('addGrant') : undefined}`],
  [/"Add guides to build your library"/g, `t('addGuides')`],
  [/actionLabel=\{!searchQuery \? "Add Guide" : undefined\}/g, `actionLabel={!searchQuery ? t('addGuide') : undefined}`],
  [/"Add resources to build your library"/g, `t('addResources')`],
  [/actionLabel=\{!searchQuery \? "Add Resource" : undefined\}/g, `actionLabel={!searchQuery ? t('addResource') : undefined}`],
  [/"Add publications to build your library"/g, `t('addPublications')`],
  [/actionLabel=\{!searchQuery \? "Add Publication" : undefined\}/g, `actionLabel={!searchQuery ? t('addPublication') : undefined}`],
  [/"Try adjusting your search"/g, `t('tryAdjustingSearch')`],
  [/"Add issues to build your troubleshooting guide"/g, `t('addIssues')`],
  [/actionLabel=\{!searchQuery \? "Add Issue" : undefined\}/g, `actionLabel={!searchQuery ? t('addIssue') : undefined}`],
  
  // Resources - search placeholders
  [/placeholder="Search terms by name or definition\.\.\."/g, `placeholder={t('searchTerms')}`],
  [/placeholder="Search grants by title, provider, or description\.\.\."/g, `placeholder={t('searchGrants')}`],
  [/placeholder="Search publications by title, author, publisher, or description\.\.\."/g, `placeholder={t('searchPublications')}`],
  [/placeholder="Search issues by title or description\.\.\."/g, `placeholder={t('searchIssues')}`],
];

function processFile(filePath) {
  const fullPath = path.join(COMPONENTS_DIR, filePath);
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = 0;
    
    // Apply all replacements
    for (const [pattern, replacement] of FINAL_REPLACEMENTS) {
      const before = content;
      content = content.replace(pattern, replacement);
      if (content !== before) {
        changesMade++;
      }
    }
    
    if (changesMade > 0) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath} (${changesMade} patterns)`);
      return true;
    } else {
      console.log(`⏭️  Skipped: ${filePath} (no changes needed)`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Network Hub Phase 3: FINAL Complete Internationalization\n');
console.log(`Processing ${FILES_TO_FIX.length} files...\n`);

let successCount = 0;
let failCount = 0;

for (const filePath of FILES_TO_FIX) {
  if (processFile(filePath)) {
    successCount++;
  } else {
    failCount++;
  }
}

console.log('\n' + '='.repeat(50));
console.log('PHASE 3 FINAL COMPLETE');
console.log('='.repeat(50));
console.log(`✅ Files processed: ${successCount}/${FILES_TO_FIX.length}`);
console.log(`❌ Files failed: ${failCount}`);
console.log('='.repeat(50));

process.exit(failCount > 0 ? 1 : 0);
