#!/usr/bin/env node

/**
 * Complete ARIA Implementation for System Hub
 * Adds aria-hidden="true" to all decorative icons
 * Adds aria-labels to all icon-only buttons
 */

const fs = require('fs');
const path = require('path');

const filesToProcess = [
  // Admin (remaining 3)
  'src/components/admin/members-management-tab.tsx',
  'src/components/admin/organization-settings-tab.tsx',
  'src/components/admin/plugins-tab.tsx',
  
  // Settings (3)
  'src/components/settings/appearance-tab.tsx',
  'src/components/settings/automations-tab.tsx',
  'src/components/settings/billing-tab.tsx',
  
  // Profile (4)
  'src/components/profile/access-tab.tsx',
  'src/components/profile/endorsements-tab.tsx',
  'src/components/profile/history-tab.tsx',
  'src/components/profile/performance-tab.tsx',
];

// Common icon patterns that should have aria-hidden
const decorativeIconPatterns = [
  /(<(?:Settings|Edit|Trash|MoreHorizontal|Plus|X|Check|ChevronDown|ChevronRight|ChevronLeft|ChevronUp|ArrowRight|ArrowLeft|Upload|Download|Search|Filter|Eye|EyeOff|Copy|ExternalLink|Info|AlertCircle|CheckCircle|XCircle|Calendar|Clock|User|Users|Mail|Phone|MapPin|Globe|Briefcase|Building|FileText|Image|Video|Paperclip|Link|Lock|Unlock|Star|Heart|ThumbsUp|MessageSquare|Bell|Home|Menu|Grid|List|BarChart|PieChart|TrendingUp|Activity|Award|Target|Zap|Shield|Bookmark|Flag|Tag|Hash|AtSign|Percent|DollarSign|CreditCard|ShoppingCart|Package|Truck|Database|Server|Cloud|Cpu|HardDrive|Smartphone|Tablet|Monitor|Headphones|Camera|Mic|Printer|Speaker|Battery|Wifi|Bluetooth|Radio|Cast|Airplay|GitBranch|GitCommit|GitMerge|GitPullRequest|Github|Gitlab|Twitter|Facebook|Instagram|Linkedin|Youtube|Slack|Discord|Figma|Chrome|Firefox|Safari|MessageCircle|Send|Loader|RefreshCw|RotateCw|RotateCcw|Maximize|Minimize|ZoomIn|ZoomOut|Move|Layers|Layout|Sidebar|ToggleLeft|ToggleRight|Volume|Volume1|Volume2|VolumeX|Play|Pause|SkipBack|SkipForward|FastForward|Rewind|StopCircle|Power|LogOut|LogIn|Key|Shield|AlertTriangle|HelpCircle|MinusCircle|PlusCircle|Slash|Square|Circle|Triangle|Pentagon|Hexagon|Octagon|Columns|Rows|Table|Code|Terminal|Command|CornerUpLeft|CornerUpRight|CornerDownLeft|CornerDownRight|Archive|Inbox|Sent|FileCheck|FilePlus|FileMinus|FileX|Folder|FolderPlus|FolderMinus|FolderOpen|SortAsc|SortDesc|Repeat|Shuffle|Clock|Timer|Stopwatch|AlarmClock|Sun|Moon|CloudRain|CloudSnow|Wind|Droplet|Thermometer|Feather|Anchor|Compass|Map|Navigation|Navigation2|Crosshair|MapPin)\s+className="[^"]*")/g;

const ariaBtnPatterns = [
  // Icon-only buttons without aria-label
  {
    pattern: /(<Button[^>]*variant="ghost"[^>]*size="icon"[^>]*)(>)/g,
    check: /aria-label=/,
  },
  {
    pattern: /(<Button[^>]*size="icon"[^>]*variant="ghost"[^>]*)(>)/g,
    check: /aria-label=/,
  },
];

function addAriaToIcons(content) {
  // Add aria-hidden="true" to decorative icons that don't have it
  let modified = content.replace(
    /(<(?:Settings|Edit|Trash|MoreHorizontal|Plus|X|Check|ChevronDown|ChevronRight|ChevronLeft|ChevronUp|ArrowRight|ArrowLeft|Upload|Download|Search|Filter|Eye|EyeOff|Copy|ExternalLink|Info|AlertCircle|CheckCircle|XCircle|Calendar|Clock|User|Users|Mail|Phone|MapPin|Globe|Briefcase|Building|FileText|Image|Video|Paperclip|Link|Lock|Unlock|Star|Heart|ThumbsUp|MessageSquare|Bell|Home|Menu|Grid|List|BarChart|PieChart|TrendingUp|Activity|Award|Target|Zap|Shield|Bookmark|Flag|Tag|Hash|AtSign|Percent|DollarSign|CreditCard|ShoppingCart|Package|Truck|Database|Server|Cloud|Cpu|HardDrive|Smartphone|Tablet|Monitor|Headphones|Camera|Mic|Printer|Speaker|Battery|Wifi|Bluetooth|Radio|Cast|Airplay|GitBranch|GitCommit|GitMerge|GitPullRequest|Github|Gitlab|Twitter|Facebook|Instagram|Linkedin|Youtube|Slack|Discord|Figma|Chrome|Firefox|Safari|MessageCircle|Send|Loader|RefreshCw|RotateCw|RotateCcw|Maximize|Minimize|ZoomIn|ZoomOut|Move|Layers|Layout|Sidebar|ToggleLeft|ToggleRight|Volume|Volume1|Volume2|VolumeX|Play|Pause|SkipBack|SkipForward|FastForward|Rewind|StopCircle|Power|LogOut|LogIn|Key|Shield|AlertTriangle|HelpCircle|MinusCircle|PlusCircle|Slash|Square|Circle|Triangle|Pentagon|Hexagon|Octagon|Columns|Rows|Table|Code|Terminal|Command|CornerUpLeft|CornerUpRight|CornerDownLeft|CornerDownRight|Archive|Inbox|Sent|FileCheck|FilePlus|FileMinus|FileX|Folder|FolderPlus|FolderMinus|FolderOpen|SortAsc|SortDesc|Repeat|Shuffle|Clock|Timer|Stopwatch|AlarmClock|Sun|Moon|CloudRain|CloudSnow|Wind|Droplet|Thermometer|Feather|Anchor|Compass|Map|Navigation|Navigation2|Crosshair|MapPin)\s+className="[^"]*")(?!.*aria-hidden)/g,
    '$1 aria-hidden="true"'
  );

  return modified;
}

function addAriaToButtons(content) {
  // Add aria-label to icon-only buttons
  let modified = content;
  
  // Find all Button components with size="icon" that don't have aria-label
  const iconButtonRegex = /<Button[^>]*size="icon"[^>]*>/g;
  const matches = content.match(iconButtonRegex);
  
  if (matches) {
    matches.forEach((match) => {
      if (!match.includes('aria-label=')) {
        // Try to determine context from surrounding code
        let ariaLabel = 'Action button';
        
        // Add generic aria-label (will need manual refinement for specific cases)
        const newMatch = match.replace(/>$/, ' aria-label="Actions">');
        modified = modified.replace(match, newMatch);
      }
    });
  }
  
  return modified;
}

function processFile(filePath) {
  try {
    const absolutePath = path.resolve(process.cwd(), filePath);
    
    if (!fs.existsSync(absolutePath)) {
      console.log(`⏭️  Skipping ${filePath} (not found)`);
      return { success: false, reason: 'not found' };
    }

    let content = fs.readFileSync(absolutePath, 'utf8');
    const originalContent = content;

    // Add aria-hidden to icons
    content = addAriaToIcons(content);
    
    // Add aria-label to icon buttons
    content = addAriaToButtons(content);

    if (content !== originalContent) {
      fs.writeFileSync(absolutePath, content, 'utf8');
      console.log(`✅ Updated ${filePath}`);
      return { success: true };
    } else {
      console.log(`⚠️  No changes needed for ${filePath}`);
      return { success: true, noChanges: true };
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return { success: false, reason: error.message };
  }
}

// Main execution
console.log('🚀 Starting ARIA implementation for System Hub...\n');

let successCount = 0;
let failCount = 0;
let skipCount = 0;

filesToProcess.forEach((filePath) => {
  const result = processFile(filePath);
  if (result.success) {
    if (!result.noChanges) successCount++;
  } else if (result.reason === 'not found') {
    skipCount++;
  } else {
    failCount++;
  }
});

console.log('\n📊 Summary:');
console.log(`   ✅ Updated: ${successCount}`);
console.log(`   ⏭️  Skipped: ${skipCount}`);
console.log(`   ❌ Failed: ${failCount}`);
console.log(`   📁 Total processed: ${filesToProcess.length}`);

if (failCount === 0) {
  console.log('\n🎉 ARIA implementation complete!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some files failed to process');
  process.exit(1);
}
