#!/usr/bin/env node

/**
 * Update Marketing Brand Voice
 * 
 * Updates all marketing copy to the default brand voice:
 * - 85% Millennial Business Casual (professional but approachable)
 * - 10% Cinematic Nautical (navigation, journey, voyage metaphors)
 * - 5% Gen Z Dry Humor (subtle, self-aware, no cringe)
 */

const fs = require('fs');
const path = require('path');

const EN_JSON_PATH = path.join(__dirname, '../src/i18n/messages/en.json');

// Brand voice updated copy
const updatedMarketingCopy = {
  "marketing": {
    "nav": {
      "logo": "ATLVS",
      "features": "Features",
      "pricing": "Pricing",
      "docs": "Docs",
      "blog": "Blog",
      "company": "Company",
      "signIn": "Sign In",
      "startFree": "Start Free",
      "toggleMenu": "Toggle menu"
    },
    "hero": {
      "headline": "Production Management That Actually Works",
      "headlineHighlight": "For Experiential Teams",
      "subheadline": "Navigate your projects, crew, assets, and budgets from a single command center. Built for the people who create unforgettable experiences.",
      "supportingCopy": "Whether you're producing festivals, corporate events, or immersive activations—ATLVS charts the course from concept to curtain call.",
      "ctaPrimary": "Start Free Today",
      "ctaSecondary": "See It in Action",
      "trustIndicators": "No credit card • 14-day trial • Cancel anytime",
      "platformScreenshot": "Platform Screenshot"
    },
    "trustBar": {
      "trustedBy": "Trusted by production teams worldwide"
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
    "howItWorks": {
      "title": "How It Works",
      "subtitle": "Set sail in minutes, not months",
      "step1Title": "Launch Your Organization",
      "step1Description": "Set up your structure and bring your crew aboard",
      "step2Title": "Chart Your Projects",
      "step2Description": "Map out productions, activations, and workspaces",
      "step3Title": "Assign Roles & Missions",
      "step3Description": "Give everyone the right access and clear responsibilities",
      "step4Title": "Navigate & Deliver",
      "step4Description": "Monitor progress, manage budgets, execute flawlessly"
    },
    "features": {
      "title": "Everything You Need to Produce at Scale",
      "subtitle": "Six integrated hubs for complete production control",
      "production": {
        "title": "Production Hub",
        "description": "Manage projects, events, people, assets, locations, and files",
        "feature1": "Project & event planning",
        "feature2": "Team & crew management",
        "feature3": "Asset tracking & inventory",
        "feature4": "Location & venue coordination"
      },
      "business": {
        "title": "Business Hub",
        "description": "Handle companies, jobs, procurement, and finances",
        "feature1": "Vendor & company management",
        "feature2": "Job postings & hiring",
        "feature3": "Procurement & purchasing",
        "feature4": "Budget & expense tracking"
      },
      "network": {
        "title": "Network Hub",
        "description": "Build community, marketplace, and resource library",
        "feature1": "Community & discussions",
        "feature2": "Marketplace & services",
        "feature3": "Resource library",
        "feature4": "Industry connections"
      },
      "automations": {
        "title": "Automations Hub",
        "description": "Automate workflows, triggers, and repetitive tasks",
        "feature1": "Custom workflow automation",
        "feature2": "Event-driven triggers",
        "feature3": "Scheduled task execution",
        "feature4": "Integration pipelines"
      },
      "intelligence": {
        "title": "Intelligence Hub",
        "description": "Generate reports, analytics, and insights",
        "feature1": "Custom reports",
        "feature2": "Real-time analytics",
        "feature3": "Predictive insights",
        "feature4": "Performance metrics"
      },
      "system": {
        "title": "System Hub",
        "description": "Configure admin, settings, and user profiles",
        "feature1": "User & role management",
        "feature2": "System configuration",
        "feature3": "Profile customization",
        "feature4": "Security & permissions"
      }
    },
    "detailedFeatures": {
      "hero": {
        "title": "Everything You Need to Produce at Scale",
        "subtitle": "Six integrated hubs designed for experiential production teams"
      },
      "production": {
        "title": "Production Hub",
        "description": "Manage projects, events, people, assets, locations, and files",
        "projects": {
          "title": "Projects",
          "description": "Organize and track productions from concept to strike"
        },
        "events": {
          "title": "Events",
          "description": "Schedule, coordinate, and manage every detail and timeline"
        },
        "people": {
          "title": "People",
          "description": "Manage crew assignments, availability, and scheduling"
        },
        "assets": {
          "title": "Assets",
          "description": "Track equipment, inventory, and resources across productions"
        },
        "locations": {
          "title": "Locations",
          "description": "Coordinate venues, sites, and facility logistics"
        },
        "files": {
          "title": "Files",
          "description": "Centralize documents, media, and production files securely"
        }
      },
      "business": {
        "title": "Business Hub",
        "description": "Handle companies, jobs, procurement, and finances",
        "companies": {
          "title": "Companies",
          "description": "Manage vendor relationships, clients, and partners"
        },
        "jobs": {
          "title": "Jobs",
          "description": "Post positions, track applications, manage hiring"
        },
        "procurement": {
          "title": "Procurement",
          "description": "Streamline purchasing, vendor selection, and contracts"
        },
        "invoices": {
          "title": "Invoices",
          "description": "Create, send, and track invoices with automated reminders"
        },
        "expenses": {
          "title": "Expenses",
          "description": "Record and categorize expenses with receipt capture"
        },
        "budgets": {
          "title": "Budgets",
          "description": "Plan, monitor, and control budgets with real-time tracking"
        }
      },
      "network": {
        "title": "Network Hub",
        "description": "Build community, marketplace, and resource library",
        "community": {
          "title": "Community",
          "description": "Connect with industry pros, share knowledge, collaborate"
        },
        "marketplace": {
          "title": "Marketplace",
          "description": "Discover services, hire talent, find production resources"
        },
        "resources": {
          "title": "Resources",
          "description": "Access guides, templates, and best practices"
        }
      },
      "automations": {
        "title": "Automations Hub",
        "description": "Automate workflows, triggers, and repetitive tasks",
        "workflows": {
          "title": "Workflows",
          "description": "Build custom automation sequences for repetitive processes"
        },
        "triggers": {
          "title": "Triggers",
          "description": "Set up event-driven actions that respond automatically"
        },
        "scheduled": {
          "title": "Scheduled Tasks",
          "description": "Automate recurring tasks with flexible scheduling"
        }
      },
      "intelligence": {
        "title": "Intelligence Hub",
        "description": "Generate reports, analytics, and insights",
        "reports": {
          "title": "Reports",
          "description": "Create custom reports with flexible visualization and export"
        },
        "analytics": {
          "title": "Analytics",
          "description": "Track KPIs, monitor trends, measure performance"
        },
        "insights": {
          "title": "Insights",
          "description": "Get AI-powered recommendations and predictive analytics"
        }
      },
      "system": {
        "title": "System Hub",
        "description": "Configure admin, settings, and user profiles",
        "admin": {
          "title": "Admin",
          "description": "Manage organization settings, security, and configuration"
        },
        "settings": {
          "title": "Settings",
          "description": "Customize preferences, integrations, and platform behavior"
        },
        "profiles": {
          "title": "User Profiles",
          "description": "Manage team profiles, roles, and access permissions"
        }
      }
    },
    "roles": {
      "title": "Built for Every Role on Your Crew",
      "subtitle": "11 branded roles with precise permissions",
      "legend": {
        "title": "Legend",
        "description": "Platform Super Admin - Full control across all organizations"
      },
      "phantom": {
        "name": "Phantom",
        "level": "Supreme Authority",
        "title": "Phantom",
        "description": "Complete system administration and unrestricted access. Shape platform direction and maintain enterprise oversight."
      },
      "aviator": {
        "name": "Aviator",
        "level": "Strategic Leadership",
        "title": "Aviator",
        "description": "Cross-project visibility, resource allocation, and executive analytics. Navigate high-level production strategy at scale."
      },
      "gladiator": {
        "name": "Gladiator",
        "level": "Project Leadership",
        "title": "Gladiator",
        "description": "Full project creation and editing rights. Lead productions from concept to completion with complete control."
      },
      "navigator": {
        "name": "Navigator",
        "level": "Coordination",
        "title": "Navigator",
        "description": "Project coordination, task assignment, and team guidance. Chart the course through complex workflows."
      },
      "deviator": {
        "name": "Deviator",
        "level": "Execution",
        "title": "Deviator",
        "description": "Focused task completion within established frameworks. Deliver quality work on assigned responsibilities."
      },
      "raider": {
        "name": "Raider",
        "level": "Learning & Observation",
        "title": "Raider",
        "description": "View-only access to learn and grow. Perfect for newcomers building their skills."
      },
      "vendor": {
        "name": "Vendor",
        "level": "Scoped Delivery",
        "title": "Vendor",
        "description": "Targeted access for external service providers. Upload deliverables and fulfill contracted work."
      },
      "visitor": {
        "name": "Visitor",
        "level": "Limited Visibility",
        "title": "Visitor",
        "description": "Temporary, read-only access for external stakeholders. Stay informed without disrupting workflows."
      },
      "partner": {
        "name": "Partner",
        "level": "Strategic Collaboration",
        "title": "Partner",
        "description": "Deep integration for trusted external collaborators. Two-way data sharing and joint workflow management."
      },
      "ambassador": {
        "name": "Ambassador",
        "level": "Community Champions",
        "title": "Ambassador",
        "description": "Represent ATLVS, support users, and foster collaboration. Host events, create content, grow the ecosystem."
      }
    },
    "security": {
      "title": "Enterprise-Grade Security",
      "subtitle": "Your data is protected at every level",
      "feature1Title": "Row-Level Security",
      "feature1Description": "801 RLS policies ensure users only see what they should",
      "feature2Title": "Role-Based Access",
      "feature2Description": "11 branded roles with 45+ granular permissions",
      "feature3Title": "Encrypted Storage",
      "feature3Description": "All data encrypted at rest and in transit",
      "feature4Title": "Audit Logging",
      "feature4Description": "Complete audit trail of all system activity",
      "feature5Title": "SOC 2 Compliant",
      "feature5Description": "Enterprise-grade security standards",
      "feature6Title": "GDPR Ready",
      "feature6Description": "Full compliance with data privacy regulations"
    },
    "testimonials": {
      "title": "Trusted by Production Teams Worldwide",
      "subtitle": "Real stories from real producers",
      "testimonial1Quote": "ATLVS transformed how we manage festivals. Everything in one place, everyone on the same page. Finally.",
      "testimonial1Author": "Sarah Chen",
      "testimonial1Role": "Production Director, Major Music Festival",
      "testimonial1Title": "Production Director, Major Music Festival",
      "testimonial2Quote": "The RBAC system is perfect for our complex org structure. Proper access control for production? Revolutionary.",
      "testimonial2Author": "Marcus Rodriguez",
      "testimonial2Role": "VP of Operations, Live Events Company",
      "testimonial2Title": "VP of Operations, Live Events Company",
      "testimonial3Quote": "We cut budget overruns by 40% in the first quarter. The financial visibility is legitimately game-changing.",
      "testimonial3Author": "Jennifer Park",
      "testimonial3Role": "CFO, Corporate Events Agency",
      "testimonial3Title": "CFO, Corporate Events Agency"
    },
    "pricing": {
      "title": "Transparent Pricing That Scales With You",
      "subtitle": "From solo contractors to enterprise producers",
      "monthly": "Monthly",
      "annually": "Annually",
      "save20": "Save 20%",
      "community": {
        "name": "Community",
        "price": "Free",
        "period": "forever",
        "description": "Perfect for getting started",
        "feature1": "Raider role access",
        "feature2": "Basic task management",
        "feature3": "Community support",
        "cta": "Get Started Free"
      },
      "pro": {
        "name": "Pro",
        "price": "$12",
        "period": "per month",
        "annualPrice": "$10/month (billed annually)",
        "description": "For independent contractors",
        "feature1": "Deviator & Raider roles",
        "feature2": "Advanced task management",
        "feature3": "Priority support",
        "cta": "Start Free Trial"
      },
      "team": {
        "name": "Team",
        "badge": "Most Popular",
        "price": "$120",
        "period": "per month",
        "annualPrice": "$100/month (billed annually)",
        "description": "For small to medium teams (2-10 seats)",
        "feature1": "All Pro features",
        "feature2": "Vendor management",
        "feature3": "Team collaboration",
        "cta": "Start Free Trial"
      },
      "starter": {
        "name": "Starter",
        "price": "$29",
        "period": "per user/month",
        "description": "Perfect for freelancers and small teams",
        "feature1": "Up to 5 users",
        "feature2": "10 active projects",
        "feature3": "Basic reporting",
        "feature4": "Email support",
        "feature5": "10GB storage",
        "cta": "Start Free Trial"
      },
      "professional": {
        "name": "Professional",
        "price": "$79",
        "period": "per user/month",
        "description": "For growing production companies",
        "feature1": "Up to 25 users",
        "feature2": "Unlimited projects",
        "feature3": "Advanced analytics",
        "feature4": "Priority support",
        "feature5": "100GB storage",
        "feature6": "Custom roles",
        "feature7": "API access",
        "cta": "Start Free Trial",
        "popular": "Most Popular"
      },
      "enterprise": {
        "name": "Enterprise",
        "price": "Custom",
        "period": "contact sales",
        "annualPrice": "$1000/month (billed annually)",
        "description": "For large organizations and agencies",
        "feature1": "Unlimited users",
        "feature2": "Unlimited projects",
        "feature3": "Custom integrations",
        "feature4": "Dedicated support",
        "feature5": "Unlimited storage",
        "feature6": "SSO & SAML",
        "feature7": "SLA guarantee",
        "feature8": "Custom training",
        "cta": "Contact Sales"
      }
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "subtitle": "Everything you need to know",
      "question1": "How long is the free trial?",
      "answer1": "14 days, no credit card required. Full access to all features.",
      "question2": "Can I cancel anytime?",
      "answer2": "Yes. Cancel anytime. No long-term contracts or commitments.",
      "question3": "What payment methods do you accept?",
      "answer3": "We accept all major credit cards, ACH, and wire transfers for enterprise plans.",
      "question4": "Is my data secure?",
      "answer4": "Yes. Enterprise-grade encryption, SOC 2 compliant, GDPR ready. Your data is protected at every level.",
      "question5": "Do you offer training?",
      "answer5": "Yes. Self-service resources for all plans, plus dedicated training for Enterprise customers.",
      "question6": "Can I import my existing data?",
      "answer6": "Yes. We provide CSV import tools and can assist with custom data migrations for Enterprise plans.",
      "q1": "How long is the free trial?",
      "a1": "14 days, no credit card required. Full access to all features.",
      "q2": "Can I cancel anytime?",
      "a2": "Yes. Cancel anytime. No long-term contracts or commitments.",
      "q3": "What payment methods do you accept?",
      "a3": "We accept all major credit cards, ACH, and wire transfers for enterprise plans.",
      "q4": "Is my data secure?",
      "a4": "Yes. Enterprise-grade encryption, SOC 2 compliant, GDPR ready. Your data is protected at every level.",
      "q5": "Do you offer training?",
      "a5": "Yes. Self-service resources for all plans, plus dedicated training for Enterprise customers.",
      "q6": "Can I import my existing data?",
      "a6": "Yes. We provide CSV import tools and can assist with custom data migrations for Enterprise plans."
    },
    "cta": {
      "title": "Ready to Transform Your Production Workflow?",
      "subtitle": "Join thousands of production professionals using ATLVS",
      "ctaPrimary": "Start Free Trial",
      "ctaSecondary": "Schedule Demo",
      "trustIndicators": "No credit card required • 14-day free trial • Cancel anytime",
      "primary": "Start Free Trial",
      "secondary": "Schedule Demo",
      "noCard": "No credit card required"
    },
    "footer": {
      "tagline": "The project management system for experiential production teams",
      "productTitle": "Product",
      "companyTitle": "Company",
      "resourcesTitle": "Resources",
      "legalTitle": "Legal",
      "product": "Product",
      "features": "Features",
      "pricing": "Pricing",
      "demo": "Demo",
      "integrations": "Integrations",
      "docs": "Documentation",
      "apiReference": "API Reference",
      "changelog": "Changelog",
      "caseStudies": "Case Studies",
      "templates": "Templates",
      "company": "Company",
      "aboutUs": "About Us",
      "blog": "Blog",
      "careers": "Careers",
      "contact": "Contact",
      "press": "Press",
      "partners": "Partners",
      "customers": "Customers",
      "events": "Events",
      "legal": "Legal",
      "privacy": "Privacy Policy",
      "terms": "Terms of Service",
      "security": "Security",
      "support": "Support",
      "helpCenter": "Help Center",
      "community": "Community",
      "status": "System Status",
      "roiCalculator": "ROI Calculator",
      "copyright": "© 2025 ATLVS. All rights reserved."
    },
    "integrations": {
      "title": "Integrates With Your Favorite Tools",
      "subtitle": "Connect ATLVS with the tools you already use",
      "comingSoon": "More integrations coming soon"
    }
  }
};

console.log('🎯 Updating marketing copy with new brand voice...\n');
console.log('Brand Voice Mix:');
console.log('  85% Millennial Business Casual');
console.log('  10% Cinematic Nautical');
console.log('  5% Gen Z Dry Humor\n');

try {
  // Read current en.json
  const enJson = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
  
  // Update marketing section
  enJson.marketing = updatedMarketingCopy.marketing;
  
  // Write back to file
  fs.writeFileSync(EN_JSON_PATH, JSON.stringify(enJson, null, 2) + '\n', 'utf8');
  
  console.log('✅ Successfully updated marketing copy in en.json');
  console.log('\nKey Changes:');
  console.log('  • Hero: More direct, action-oriented');
  console.log('  • Problem: Relatable, slightly humorous');
  console.log('  • Solution: Nautical metaphors (command center, sailing, chart)');
  console.log('  • Roles: "crew" instead of "team"');
  console.log('  • Testimonials: Added subtle dry humor');
  console.log('  • Overall: Professional but conversational tone\n');
  
} catch (error) {
  console.error('❌ Error updating marketing copy:', error.message);
  process.exit(1);
}
