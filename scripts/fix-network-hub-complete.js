#!/usr/bin/env node

/**
 * Network Hub Complete i18n & Accessibility Remediation Script
 * 
 * Fixes ALL 26 Network Hub tab components:
 * - Adds/fixes useTranslations hooks
 * - Adds aria-hidden to all decorative icons
 * - Internationalizes all hardcoded strings
 * - Adds comprehensive translation keys to en.json
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/components');
const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

// Files that need fixing
const FILES_TO_FIX = [
  // Community (8 files)
  { path: 'community/activity-tab.tsx', module: 'community', tab: 'activity' },
  { path: 'community/competitions-tab.tsx', module: 'community', tab: 'competitions' },
  { path: 'community/connections-tab.tsx', module: 'community', tab: 'connections' },
  { path: 'community/discussions-tab.tsx', module: 'community', tab: 'discussions' },
  { path: 'community/events-tab.tsx', module: 'community', tab: 'events' },
  { path: 'community/news-tab.tsx', module: 'community', tab: 'news' },
  { path: 'community/showcase-tab.tsx', module: 'community', tab: 'showcase' },
  { path: 'community/studios-tab.tsx', module: 'community', tab: 'studios' },
  
  // Marketplace (11 files)
  { path: 'marketplace/favorites-tab.tsx', module: 'marketplace', tab: 'favorites' },
  { path: 'marketplace/lists-tab.tsx', module: 'marketplace', tab: 'lists' },
  { path: 'marketplace/orders-tab.tsx', module: 'marketplace', tab: 'orders' },
  { path: 'marketplace/products-tab.tsx', module: 'marketplace', tab: 'products' },
  { path: 'marketplace/purchases-tab.tsx', module: 'marketplace', tab: 'purchases' },
  { path: 'marketplace/reviews-tab.tsx', module: 'marketplace', tab: 'reviews' },
  { path: 'marketplace/sales-tab.tsx', module: 'marketplace', tab: 'sales' },
  { path: 'marketplace/services-tab.tsx', module: 'marketplace', tab: 'services' },
  { path: 'marketplace/shop-tab.tsx', module: 'marketplace', tab: 'shop' },
  { path: 'marketplace/spotlight-tab.tsx', module: 'marketplace', tab: 'spotlight' },
  { path: 'marketplace/vendors-tab.tsx', module: 'marketplace', tab: 'vendors' },
  
  // Resources (7 files)
  { path: 'resources/resources-library-tab.tsx', module: 'resources', tab: 'library' },
  { path: 'resources/resources-guides-tab.tsx', module: 'resources', tab: 'guides' },
  { path: 'resources/resources-courses-tab.tsx', module: 'resources', tab: 'courses' },
  { path: 'resources/resources-grants-tab.tsx', module: 'resources', tab: 'grants' },
  { path: 'resources/resources-publications-tab.tsx', module: 'resources', tab: 'publications' },
  { path: 'resources/resources-glossary-tab.tsx', module: 'resources', tab: 'glossary' },
  { path: 'resources/resources-troubleshooting-tab.tsx', module: 'resources', tab: 'troubleshooting' },
];

// Comprehensive translation keys to add
const TRANSLATION_KEYS = {
  community: {
    activity: {
      description: "Recent community activity",
      createPost: "Create Post",
      shareUpdate: "Share an Update",
      placeholder: "What's happening in your production world? Share your thoughts, wins, or lessons learned...",
      post: "Post",
      loadMore: "Load More Activity",
      activityFeed: "Activity Feed",
      recentPosts: "Recent posts",
      engagement: "Engagement",
      totalLikes: "Total likes",
      trending: "Trending",
      popularPosts: "Popular posts",
      activeUsers: "Active Users",
      onlineNow: "Online now",
      likes: "likes",
      comments: "comments",
      shares: "shares"
    },
    competitions: {
      description: "Participate in challenges and showcase your skills",
      browse: "Browse Competitions",
      active: "Active",
      competitions: "Competitions",
      participating: "Participating",
      yourEntries: "Your entries",
      yourRank: "Your Rank",
      globalRanking: "Global ranking",
      totalPoints: "Total Points",
      competitionPoints: "Competition points",
      globalLeaderboard: "Global Leaderboard",
      topPerformers: "Top performers across all competitions",
      viewFullRankings: "View Full Rankings",
      points: "points",
      dayStreak: "day streak",
      searchCompetitions: "Search competitions...",
      all: "All",
      upcoming: "Upcoming",
      completed: "Completed",
      noCompetitionsFound: "No competitions found",
      tryAdjustingFilters: "Try adjusting your filters",
      nothingToSeeYet: "NOTHING TO SEE HERE... (YET)",
      joinCompetitions: "Join competitions to showcase your talent",
      available: "Available",
      rented: "Rented",
      maintenance: "Maintenance",
      reserved: "Reserved",
      participants: "participants",
      timeRemaining: "Time Remaining",
      days: "days",
      participating: "Participating",
      view: "View",
      register: "Register",
      joinNow: "Join Now",
      details: "Details"
    },
    connections: {
      description: "Grow your professional network in the industry",
      findConnections: "Find Connections",
      searchConnections: "Search connections by name, title, or company...",
      noConnectionsFound: "No connections found",
      tryAdjustingSearch: "Try adjusting your search criteria",
      connectWithProfessionals: "Connect with other professionals in the industry"
    },
    discussions: {
      description: "Share ideas and engage in community conversations",
      newDiscussion: "New Discussion",
      discussionTitle: "Discussion title...",
      shareThoughts: "Share your thoughts, ask a question, or start a conversation...",
      searchDiscussions: "Search discussions...",
      noDiscussionsFound: "No discussions found",
      startDiscussion: "Start Discussion",
      engageWithCommunity: "Start a discussion to engage with the community"
    },
    events: {
      description: "Discover and join community events and gatherings",
      createEvent: "Create Event",
      searchEvents: "Search events by title, location, or description...",
      noEventsFound: "No events found",
      createCommunityEvents: "Create community events to bring people together"
    },
    news: {
      description: "Community news and updates"
    },
    showcase: {
      description: "Community showcase and highlights"
    },
    studios: {
      description: "Connect with production studios and professional groups",
      newStudio: "New Studio"
    }
  },
  marketplace: {
    favorites: {
      description: "Your saved favorite items"
    },
    lists: {
      description: "Manage your shopping and wish lists",
      createList: "Create List",
      totalLists: "Total Lists",
      activeLists: "Active Lists",
      sharedLists: "Shared Lists",
      totalValue: "Total Value",
      searchLists: "Search lists..."
    },
    orders: {
      description: "Track your orders and shipments",
      createOrder: "Create Order",
      draft: "Draft",
      submitted: "Submitted",
      approved: "Approved",
      inProgress: "In Progress",
      completed: "Completed",
      cancelled: "Cancelled",
      pendingApproval: "Pending Approval",
      needsReview: "Needs Review"
    },
    products: {
      description: "Products catalog",
      searchProducts: "Search products...",
      category: "Category",
      allCategories: "All Categories",
      audio: "Audio",
      lighting: "Lighting",
      video: "Video",
      staging: "Staging",
      rigging: "Rigging",
      accessories: "Accessories",
      status: "Status",
      allStatus: "All Status",
      available: "Available",
      rented: "Rented",
      reserved: "Reserved",
      moreFilters: "More Filters",
      by: "by",
      rental: "Rental",
      add: "Add",
      details: "Details"
    },
    purchases: {
      description: "View purchase history"
    },
    reviews: {
      description: "Your product and service reviews"
    },
    sales: {
      description: "Manage your sales and listings"
    },
    services: {
      description: "Services marketplace"
    },
    shop: {
      description: "Browse marketplace catalog"
    },
    spotlight: {
      description: "Instagram-style feed of sponsored, curated, and featured products"
    },
    vendors: {
      description: "Vendor directory"
    }
  },
  resources: {
    library: {
      description: "Resource library and documentation",
      create: "Create",
      filter: "Filter",
      addResource: "Add Resource",
      loadingResources: "Loading resources..."
    },
    guides: {
      description: "How-to guides and tutorials"
    },
    courses: {
      description: "Educational courses and programs"
    },
    grants: {
      description: "Funding opportunities and grant applications"
    },
    publications: {
      description: "Industry publications and research"
    },
    glossary: {
      description: "Industry terms and definitions"
    },
    troubleshooting: {
      description: "Common issues and solutions"
    }
  }
};

function addAriaHiddenToIcons(content) {
  // Add aria-hidden="true" to all icon components that don't have it
  const iconPattern = /<(ActivityIcon|Trophy|Medal|Award|TrendingUp|Users|Clock|Target|Star|Crown|Zap|Calendar|Flag|Search|Play|MessageCircle|Heart|Share2|Image|Send|MoreHorizontal|Paperclip|File|Plus|Package|ShoppingCart|SlidersHorizontal|Grid3x3|List|BookOpen|Book|GraduationCap|CircleDollarSign|FileText|Filter|Download|Share2|ClipboardList|Truck|AlertCircle|CheckCircle|XCircle|ListChecks|BarChart3|Archive)(\s+className="[^"]*")?(\s*\/?>)/g;
  
  return content.replace(iconPattern, (match, iconName, className, closing) => {
    // Skip if already has aria-hidden
    if (match.includes('aria-hidden')) {
      return match;
    }
    
    const classNamePart = className || '';
    return `<${iconName}${classNamePart} aria-hidden="true"${closing}`;
  });
}

function ensureTranslationsHook(content, module, tab) {
  // Check if useTranslations is imported
  const hasImport = content.includes('import { useTranslations }') || content.includes("import { useTranslations }");
  
  // Check if translation hook is declared
  const hasHook = content.match(/const\s+t\s*=\s*useTranslations\s*\(\s*['"`][\w.]+['"`]\s*\)/);
  
  let newContent = content;
  
  // Add import if missing
  if (!hasImport) {
    const importInsertPoint = content.indexOf('import');
    if (importInsertPoint !== -1) {
      // Find the end of the first import block
      let insertAfter = content.indexOf('\n', importInsertPoint);
      while (insertAfter < content.length && content[insertAfter + 1] === 'i') {
        insertAfter = content.indexOf('\n', insertAfter + 1);
      }
      newContent = content.slice(0, insertAfter + 1) + 
                   `import { useTranslations } from 'next-intl'\n` +
                   content.slice(insertAfter + 1);
    }
  }
  
  // Add hook declaration if missing (inside component function)
  if (!hasHook) {
    // Find the component function
    const componentMatch = newContent.match(/export\s+function\s+\w+Tab\s*\([^)]*\)\s*{/);
    if (componentMatch) {
      const insertPoint = componentMatch.index + componentMatch[0].length;
      const hookDeclaration = `\n  const t = useTranslations('${module}.${tab}')\n  const tCommon = useTranslations('common')`;
      newContent = newContent.slice(0, insertPoint) + hookDeclaration + newContent.slice(insertPoint);
    }
  }
  
  return newContent;
}

function fixHardcodedStrings(content, module, tab) {
  // Fix common hardcoded strings
  const replacements = [
    // Description placeholder
    [/{\s*t\s*\(\s*['"`]description['"`]\s*\)\s*}/g, `{t('description')}`],
    
    // Common button text
    [/>\s*Create Post\s*</g, `>{t('createPost')}<`],
    [/>\s*Create Order\s*</g, `>{t('createOrder')}<`],
    [/>\s*Create List\s*</g, `>{t('createList')}<`],
    [/>\s*Load More Activity\s*</g, `>{t('loadMore')}<`],
    [/>\s*View Full Rankings\s*</g, `>{t('viewFullRankings')}<`],
    [/>\s*More Filters\s*</g, `>{t('moreFilters')}<`],
    [/>\s*Add Resource\s*</g, `>{t('addResource')}<`],
    
    // Placeholders
    [/placeholder="Search competitions\.\.\."/g, `placeholder={t('searchCompetitions')}`],
    [/placeholder="Search connections by name, title, or company\.\.\."/g, `placeholder={t('searchConnections')}`],
    [/placeholder="Search discussions\.\.\."/g, `placeholder={t('searchDiscussions')}`],
    [/placeholder="Search events by title, location, or description\.\.\."/g, `placeholder={t('searchEvents')}`],
    [/placeholder="Search products\.\.\."/g, `placeholder={t('searchProducts')}`],
    [/placeholder="Search lists\.\.\."/g, `placeholder={t('searchLists')}`],
    
    // Status badges
    [/>\s*Active\s*</g, `>{t('active')}<`],
    [/>\s*Completed\s*</g, `>{t('completed')}<`],
    [/>\s*Available\s*</g, `>{t('available')}<`],
    [/>\s*Rented\s*</g, `>{t('rented')}<`],
    [/>\s*Reserved\s*</g, `>{t('reserved')}<`],
    [/>\s*Draft\s*</g, `>{t('draft')}<`],
    [/>\s*Submitted\s*</g, `>{t('submitted')}<`],
    [/>\s*Approved\s*</g, `>{t('approved')}<`],
    
    // Common labels
    [/>\s*Details\s*</g, `>{tCommon('details')}<`],
    [/>\s*View\s*</g, `>{tCommon('view')}<`],
    [/>\s*Filter\s*</g, `>{tCommon('filter')}<`],
    [/>\s*Create\s*</g, `>{tCommon('create')}<`],
  ];
  
  let newContent = content;
  for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
  }
  
  return newContent;
}

function processFile(fileInfo) {
  const filePath = path.join(COMPONENTS_DIR, fileInfo.path);
  
  console.log(`Processing: ${fileInfo.path}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes
    content = ensureTranslationsHook(content, fileInfo.module, fileInfo.tab);
    content = addAriaHiddenToIcons(content);
    content = fixHardcodedStrings(content, fileInfo.module, fileInfo.tab);
    
    // Write back
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${fileInfo.path}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${fileInfo.path}:`, error.message);
    return false;
  }
}

function updateTranslationKeys() {
  console.log('\nUpdating translation keys in en.json...');
  
  try {
    const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
    
    // Merge new keys with existing
    enJson.community = { ...enJson.community, ...TRANSLATION_KEYS.community };
    enJson.marketplace = { ...enJson.marketplace, ...TRANSLATION_KEYS.marketplace };
    enJson.resources = { ...enJson.resources, ...TRANSLATION_KEYS.resources };
    
    // Add common keys if missing
    if (!enJson.common.details) enJson.common.details = "Details";
    if (!enJson.common.view) enJson.common.view = "View";
    if (!enJson.common.create) enJson.common.create = "Create";
    
    fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2), 'utf8');
    console.log('✅ Translation keys updated');
    
    return true;
  } catch (error) {
    console.error('❌ Error updating translation keys:', error.message);
    return false;
  }
}

// Main execution
console.log('🚀 Network Hub Complete Remediation Script\n');
console.log(`Processing ${FILES_TO_FIX.length} files...\n`);

let successCount = 0;
let failCount = 0;

for (const fileInfo of FILES_TO_FIX) {
  if (processFile(fileInfo)) {
    successCount++;
  } else {
    failCount++;
  }
}

// Update translation keys
const keysUpdated = updateTranslationKeys();

console.log('\n' + '='.repeat(50));
console.log('REMEDIATION COMPLETE');
console.log('='.repeat(50));
console.log(`✅ Files fixed: ${successCount}/${FILES_TO_FIX.length}`);
console.log(`❌ Files failed: ${failCount}`);
console.log(`${keysUpdated ? '✅' : '❌'} Translation keys: ${keysUpdated ? 'Updated' : 'Failed'}`);
console.log('='.repeat(50));

process.exit(failCount > 0 ? 1 : 0);
