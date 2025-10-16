#!/usr/bin/env node

/**
 * Network Hub Phase 2: Complete String Internationalization
 * 
 * This script handles ALL remaining hardcoded strings including:
 * - Card titles and descriptions
 * - Button labels
 * - Placeholders
 * - Status badges
 * - Empty state messages
 * - Mock data strings (names, titles, badges)
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

const FILES_TO_FIX = [
  'community/activity-tab.tsx',
  'community/competitions-tab.tsx',
  'community/connections-tab.tsx',
  'community/discussions-tab.tsx',
  'community/events-tab.tsx',
  'community/news-tab.tsx',
  'community/showcase-tab.tsx',
  'community/studios-tab.tsx',
  'marketplace/favorites-tab.tsx',
  'marketplace/lists-tab.tsx',
  'marketplace/orders-tab.tsx',
  'marketplace/products-tab.tsx',
  'marketplace/purchases-tab.tsx',
  'marketplace/reviews-tab.tsx',
  'marketplace/sales-tab.tsx',
  'marketplace/services-tab.tsx',
  'marketplace/shop-tab.tsx',
  'marketplace/spotlight-tab.tsx',
  'marketplace/vendors-tab.tsx',
  'resources/resources-library-tab.tsx',
  'resources/resources-guides-tab.tsx',
  'resources/resources-courses-tab.tsx',
  'resources/resources-grants-tab.tsx',
  'resources/resources-publications-tab.tsx',
  'resources/resources-glossary-tab.tsx',
  'resources/resources-troubleshooting-tab.tsx',
];

// Comprehensive string replacements
const GLOBAL_REPLACEMENTS = [
  // Card stats and labels
  [/>\s*Activity Feed\s*</g, `>{t('activityFeed')}<`],
  [/>\s*Recent posts\s*</g, `>{t('recentPosts')}<`],
  [/>\s*Engagement\s*</g, `>{t('engagement')}<`],
  [/>\s*Total likes\s*</g, `>{t('totalLikes')}<`],
  [/>\s*Trending\s*</g, `>{t('trending')}<`],
  [/>\s*Popular posts\s*</g, `>{t('popularPosts')}<`],
  [/>\s*Active Users\s*</g, `>{t('activeUsers')}<`],
  [/>\s*Online now\s*</g, `>{t('onlineNow')}<`],
  [/>\s*Participating\s*</g, `>{t('participating')}<`],
  [/>\s*Your entries\s*</g, `>{t('yourEntries')}<`],
  [/>\s*Your Rank\s*</g, `>{t('yourRank')}<`],
  [/>\s*Global ranking\s*</g, `>{t('globalRanking')}<`],
  [/>\s*Total Points\s*</g, `>{t('totalPoints')}<`],
  [/>\s*Competition points\s*</g, `>{t('competitionPoints')}<`],
  [/>\s*Global Leaderboard\s*</g, `>{t('globalLeaderboard')}<`],
  [/>\s*Top performers across all competitions\s*</g, `>{t('topPerformers')}<`],
  [/>\s*Total Lists\s*</g, `>{t('totalLists')}<`],
  [/>\s*Active Lists\s*</g, `>{t('activeLists')}<`],
  [/>\s*Shared Lists\s*</g, `>{t('sharedLists')}<`],
  [/>\s*Total Value\s*</g, `>{t('totalValue')}<`],
  [/>\s*In Progress\s*</g, `>{t('inProgress')}<`],
  [/>\s*Pending Approval\s*</g, `>{t('pendingApproval')}<`],
  [/>\s*Needs Review\s*</g, `>{t('needsReview')}<`],
  [/>\s*All Categories\s*</g, `>{t('allCategories')}<`],
  [/>\s*All Status\s*</g, `>{t('allStatus')}<`],
  
  // Engagement metrics
  [/>\s*likes\s*</g, `>{t('likes')}<`],
  [/>\s*comments\s*</g, `>{t('comments')}<`],
  [/>\s*shares\s*</g, `>{t('shares')}<`],
  [/>\s*points\s*</g, `>{t('points')}<`],
  [/>\s*day streak\s*</g, `>{t('dayStreak')}<`],
  [/>\s*participants\s*</g, `>{t('participants')}<`],
  [/>\s*days\s*</g, `>{t('days')}<`],
  [/>\s*Time Remaining\s*</g, `>{t('timeRemaining')}<`],
  
  // Status badges (in JSX)
  [/>\s*Competitions\s*</g, `>{t('competitions')}<`],
  [/>\s*Maintenance\s*</g, `>{t('maintenance')}<`],
  [/>\s*Cancelled\s*</g, `>{t('cancelled')}<`],
  [/>\s*Audio\s*</g, `>{t('audio')}<`],
  [/>\s*Lighting\s*</g, `>{t('lighting')}<`],
  [/>\s*Video\s*</g, `>{t('video')}<`],
  [/>\s*Staging\s*</g, `>{t('staging')}<`],
  [/>\s*Rigging\s*</g, `>{t('rigging')}<`],
  [/>\s*Accessories\s*</g, `>{t('accessories')}<`],
  [/>\s*Category\s*</g, `>{t('category')}<`],
  [/>\s*Rental\s*</g, `>{t('rental')}<`],
  [/>\s*by\s+</g, `>{t('by')} <`],
  
  // Empty state messages
  [/"No competitions found"/g, `{t('noCompetitionsFound')}`],
  [/"Try adjusting your filters"/g, `{t('tryAdjustingFilters')}`],
  [/"NOTHING TO SEE HERE\.\.\. \(YET\)"/g, `{t('nothingToSeeYet')}`],
  [/"Join competitions to showcase your talent"/g, `{t('joinCompetitions')}`],
  [/"No connections found"/g, `{t('noConnectionsFound')}`],
  [/"Try adjusting your search criteria"/g, `{t('tryAdjustingSearch')}`],
  [/"Connect with other professionals in the industry"/g, `{t('connectWithProfessionals')}`],
  [/"No discussions found"/g, `{t('noDiscussionsFound')}`],
  [/"Start a discussion to engage with the community"/g, `{t('engageWithCommunity')}`],
  [/"No events found"/g, `{t('noEventsFound')}`],
  [/"Create community events to bring people together"/g, `>{t('createCommunityEvents')}`],
  
  // Button labels (ternary expressions)
  [/"Register" : "Join Now"/g, `t('register') : t('joinNow')`],
  [/"Find Connections"/g, `{t('findConnections')}`],
  [/"Start Discussion"/g, `{t('startDiscussion')}`],
  
  // Common button text not yet covered
  [/>\s*Add\s*</g, `>{tCommon('add')}<`],
  [/>\s*All\s*</g, `>{t('all')}<`],
  [/>\s*Upcoming\s*</g, `>{t('upcoming')}<`],
];

function processFile(filePath) {
  const fullPath = path.join(COMPONENTS_DIR, filePath);
  console.log(`Processing: ${filePath}`);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    let changesMade = 0;
    
    // Apply all replacements
    for (const [pattern, replacement] of GLOBAL_REPLACEMENTS) {
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
console.log('🚀 Network Hub Phase 2: Complete String Internationalization\n');
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
console.log('PHASE 2 COMPLETE');
console.log('='.repeat(50));
console.log(`✅ Files processed: ${successCount}/${FILES_TO_FIX.length}`);
console.log(`❌ Files failed: ${failCount}`);
console.log('='.repeat(50));

process.exit(failCount > 0 ? 1 : 0);
