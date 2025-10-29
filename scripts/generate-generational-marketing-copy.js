#!/usr/bin/env node

/**
 * Generate Generational Marketing Copy
 * 
 * Creates generational variants for all marketing copy:
 * - Baby Boomer: Traditional, formal, value-focused
 * - Gen X: Pragmatic, skeptical, no-nonsense
 * - Millennial: Collaborative, purpose-driven, tech-savvy (similar to default)
 * - Gen Z: Authentic, direct, meme-aware
 * - Gen Alpha: Digital-native, visual, gamified
 */

const fs = require('fs');
const path = require('path');

const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

// Generational variants for marketing copy
const generationalVariants = {
  "baby-boomer": {
    "hero": {
      "headline": "Professional Production Management Solutions",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Comprehensive project, workforce, asset, and financial management from a centralized platform. Designed for professionals who deliver exceptional experiences.",
      "supportingCopy": "From festivals to corporate events and immersive experiences—ATLVS provides the structure and oversight needed for successful production management.",
      "ctaPrimary": "Begin Free Trial",
      "ctaSecondary": "Request Demonstration"
    },
    "problem": {
      "title": "The Production Management Challenge",
      "subtitle": "Industry-wide inefficiencies",
      "pain1Title": "Fragmented Systems",
      "pain1Description": "Teams utilize multiple disconnected platforms including spreadsheets, email, and various project management tools",
      "pain2Title": "Information Loss",
      "pain2Description": "Critical project details are lost during transitions and team handoffs",
      "pain3Title": "Budget Overruns",
      "pain3Description": "Without proper financial oversight, costs exceed projections",
      "pain4Title": "Communication Breakdowns",
      "pain4Description": "Vendors, crew members, and stakeholders experience coordination difficulties"
    },
    "solution": {
      "title": "Comprehensive Platform. Complete Control.",
      "subtitle": "Integrated production management",
      "feature1Title": "Centralized Platform",
      "feature1Description": "All projects, personnel, and resources managed from one location",
      "feature2Title": "Real-Time Updates",
      "feature2Description": "Instant synchronization ensures all team members have current information",
      "feature3Title": "Financial Oversight",
      "feature3Description": "Track budgets, expenses, and invoices with precision and accuracy",
      "feature4Title": "Vendor Coordination",
      "feature4Description": "Streamline external partner relationships and deliverables"
    },
    "testimonials": {
      "testimonial1Quote": "ATLVS has transformed our festival management operations. The centralized platform provides the structure and oversight we need.",
      "testimonial2Quote": "The role-based access control system is exactly what our organization required. Professional-grade security and permissions.",
      "testimonial3Quote": "We reduced budget overruns by 40% in the first quarter. The financial visibility and reporting capabilities are exceptional."
    }
  },
  "gen-x": {
    "hero": {
      "headline": "Production Management That Doesn't Waste Your Time",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Manage projects, crew, assets, and budgets without the usual platform bloat. Built for people who actually do the work.",
      "supportingCopy": "Festivals, corporate events, immersive experiences—ATLVS gets out of your way so you can get things done.",
      "ctaPrimary": "Try It Free",
      "ctaSecondary": "See Demo"
    },
    "problem": {
      "title": "The Production Management Problem",
      "subtitle": "Same issues, different decade",
      "pain1Title": "Too Many Tools",
      "pain1Description": "Spreadsheets, Slack, email, random cloud docs—your workflow is a mess of disconnected platforms",
      "pain2Title": "Lost Information",
      "pain2Description": "Critical details disappear during handoffs. Someone sent that file, but good luck finding it",
      "pain3Title": "Budget Creep",
      "pain3Description": "Costs sneak up on you. By the time you notice, you're already over budget",
      "pain4Title": "Communication Failures",
      "pain4Description": "Vendors miss updates, crew works off outdated info, stakeholders keep asking the same questions"
    },
    "solution": {
      "title": "One Platform. Actually Works.",
      "subtitle": "Everything where it should be",
      "feature1Title": "Unified System",
      "feature1Description": "Projects, people, and resources in one place. Finally.",
      "feature2Title": "Real-Time Sync",
      "feature2Description": "Updates happen instantly. Everyone works from the same information",
      "feature3Title": "Budget Control",
      "feature3Description": "Track every dollar in real-time. No surprises, no excuses",
      "feature4Title": "Vendor Management",
      "feature4Description": "Keep external partners informed without giving them full access"
    },
    "testimonials": {
      "testimonial1Quote": "ATLVS actually works. Everything in one place, no unnecessary features. It does what it says it does.",
      "testimonial2Quote": "The access control system works for our complex structure. No compromises, no workarounds required.",
      "testimonial3Quote": "We cut budget overruns by 40% first quarter. The financial tracking actually delivers results."
    }
  },
  "millennial": {
    "hero": {
      "headline": "Production Management That Actually Works",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Navigate your projects, crew, assets, and budgets from a single command center. Built for the people who create unforgettable experiences.",
      "supportingCopy": "Whether you're producing festivals, corporate events, or immersive activations—ATLVS charts the course from concept to curtain call.",
      "ctaPrimary": "Start Free Today",
      "ctaSecondary": "See It in Action"
    },
    "problem": {
      "title": "The Production Chaos Problem",
      "subtitle": "You know the drill",
      "pain1Title": "Tool Overload",
      "pain1Description": "Spreadsheets, Slack, email, that one Google Doc nobody can find—your workflow is scattered across a dozen platforms",
      "pain2Title": "Information Black Holes",
      "pain2Description": "Critical details vanish during handoffs. Someone definitely sent that file... somewhere",
      "pain3Title": "Budget Surprises",
      "pain3Description": "Costs creep up in the shadows. By the time you notice, you're already over",
      "pain4Title": "Communication Drift",
      "pain4Description": "Vendors miss updates, crew works off old info, stakeholders ask the same questions twice"
    },
    "solution": {
      "title": "One Platform. Zero Chaos.",
      "subtitle": "Everything in its right place",
      "feature1Title": "Unified Command Center",
      "feature1Description": "Projects, people, and resources all sailing in formation",
      "feature2Title": "Real-Time Sync",
      "feature2Description": "Updates flow instantly. Everyone's working from the same chart",
      "feature3Title": "Budget Radar",
      "feature3Description": "Track every dollar in real-time. No surprises, no overruns",
      "feature4Title": "Vendor Coordination",
      "feature4Description": "Keep external partners in the loop without giving away the ship"
    },
    "testimonials": {
      "testimonial1Quote": "ATLVS transformed how we manage festivals. Everything in one place, everyone on the same page. Finally.",
      "testimonial2Quote": "The RBAC system is perfect for our complex org structure. Proper access control for production? Revolutionary.",
      "testimonial3Quote": "We cut budget overruns by 40% in the first quarter. The financial visibility is legitimately game-changing."
    }
  },
  "gen-z": {
    "hero": {
      "headline": "Production Management That Hits Different",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Manage projects, crew, assets, and budgets from one place. No cap, it actually works.",
      "supportingCopy": "Festivals, corporate events, immersive experiences—ATLVS is the platform that doesn't make you want to rage quit.",
      "ctaPrimary": "Start Free",
      "ctaSecondary": "See Demo"
    },
    "problem": {
      "title": "The Production Chaos Is Real",
      "subtitle": "We've all been there",
      "pain1Title": "Too Many Apps",
      "pain1Description": "Spreadsheets, Slack, email, that random Google Doc—your workflow is giving 'disorganized chaos'",
      "pain2Title": "Files Go Missing",
      "pain2Description": "Critical info just disappears. Someone sent it... allegedly",
      "pain3Title": "Budget Goes Brr",
      "pain3Description": "Costs sneak up on you. By the time you notice, you're already cooked",
      "pain4Title": "Communication = Broken",
      "pain4Description": "Vendors miss updates, crew has old info, stakeholders keep asking the same thing"
    },
    "solution": {
      "title": "One Platform. No Drama.",
      "subtitle": "Everything where it belongs",
      "feature1Title": "All-in-One Hub",
      "feature1Description": "Projects, people, resources—all in one place like it should be",
      "feature2Title": "Live Updates",
      "feature2Description": "Changes happen instantly. Everyone stays synced",
      "feature3Title": "Budget Tracking",
      "feature3Description": "Track every dollar in real-time. No surprises, no stress",
      "feature4Title": "Vendor Management",
      "feature4Description": "Keep external partners updated without giving them full access"
    },
    "testimonials": {
      "testimonial1Quote": "ATLVS lowkey changed how we run festivals. Everything's organized, everyone's informed. It's giving efficiency.",
      "testimonial2Quote": "The access control system? *Chef's kiss*. Finally, proper permissions for production work.",
      "testimonial3Quote": "We cut budget overruns by 40% first quarter. The financial visibility is actually insane (in a good way)."
    }
  },
  "gen-alpha": {
    "hero": {
      "headline": "Level Up Your Production Game",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Manage projects, crew, assets, and budgets from your command center. Built for creators who make epic experiences.",
      "supportingCopy": "Festivals, events, immersive worlds—ATLVS is your co-pilot from idea to launch.",
      "ctaPrimary": "Start Free 🚀",
      "ctaSecondary": "Watch Demo 🎮"
    },
    "problem": {
      "title": "Production Chaos = Game Over",
      "subtitle": "Time to respawn",
      "pain1Title": "Too Many Apps 📱",
      "pain1Description": "Your workflow is scattered across a million different apps and platforms",
      "pain2Title": "Lost Files 🔍",
      "pain2Description": "Important stuff just disappears. Where did that file go? Nobody knows",
      "pain3Title": "Budget Explosion 💸",
      "pain3Description": "Costs keep going up. By the time you notice, you're way over budget",
      "pain4Title": "Communication Lag 💬",
      "pain4Description": "Team members miss updates and work with old information"
    },
    "solution": {
      "title": "One Platform. Total Control. 🎯",
      "subtitle": "Everything in one place",
      "feature1Title": "Command Center 🎮",
      "feature1Description": "All your projects, team, and resources in one hub",
      "feature2Title": "Live Sync ⚡",
      "feature2Description": "Updates happen instantly. Everyone stays connected",
      "feature3Title": "Budget Tracker 💰",
      "feature3Description": "See every dollar in real-time. No surprises",
      "feature4Title": "Team Coordination 🤝",
      "feature4Description": "Keep everyone updated and on the same page"
    },
    "testimonials": {
      "testimonial1Quote": "ATLVS is OP for managing festivals. Everything's organized, everyone's synced. 10/10 would recommend.",
      "testimonial2Quote": "The permissions system is fire. Finally got proper access control for our team.",
      "testimonial3Quote": "We cut budget problems by 40% first quarter. The money tracking is straight up amazing."
    }
  }
};

console.log('🎯 Generating generational marketing variants...\n');

try {
  // Read current en.json
  const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
  
  // Ensure marketingGenerational exists
  if (!enJson.marketingGenerational) {
    enJson.marketingGenerational = {};
  }
  
  // Add each generational variant
  for (const [generation, content] of Object.entries(generationalVariants)) {
    enJson.marketingGenerational[generation] = content;
    console.log(`✅ Added ${generation} variant`);
  }
  
  // Write back to file
  fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2) + '\n', 'utf8');
  
  console.log('\n✅ Successfully generated all generational variants');
  console.log('\nGenerated Variants:');
  console.log('  • baby-boomer: Traditional, formal, value-focused');
  console.log('  • gen-x: Pragmatic, skeptical, no-nonsense');
  console.log('  • millennial: Collaborative, purpose-driven (default)');
  console.log('  • gen-z: Authentic, direct, meme-aware');
  console.log('  • gen-alpha: Digital-native, visual, gamified\n');
  
  console.log('Coverage:');
  console.log('  • Hero section: 5 variants');
  console.log('  • Problem section: 5 variants');
  console.log('  • Solution section: 5 variants');
  console.log('  • Testimonials: 5 variants');
  console.log('  • Total keys per variant: ~20\n');
  
} catch (error) {
  console.error('❌ Error generating generational variants:', error.message);
  process.exit(1);
}
