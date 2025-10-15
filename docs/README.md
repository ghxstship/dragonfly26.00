# 📚 Dragonfly Documentation

**Complete Documentation Hub for Dragonfly 26.00**

**Last Updated**: October 15, 2025  
**Documentation Status**: ✅ Fully Reorganized and Consolidated

---

## 🎯 Choose Your Path

### 👤 I'm a User
**[→ User Documentation](user/README.md)**

Complete guides for using Dragonfly:
- Getting started tutorials
- Module-by-module guides (all 20 modules)
- Feature documentation
- Common tasks and workflows
- Troubleshooting and FAQs

### 👨‍💻 I'm a Developer
**[→ Developer Documentation](developer/README.md)**

Technical documentation for building with Dragonfly:
- Quick start and setup
- Architecture and system design
- API references and SDKs
- Development guides
- Testing and deployment

### 📖 Complete Documentation Index
**[→ Documentation Index](DOCUMENTATION_INDEX.md)**

Master index of all documentation organized by role and topic.

---

## 📂 New Documentation Structure

This documentation has been completely reorganized (October 15, 2025) into a clear, role-based structure:

```
docs/
├── README.md (this file)           # Documentation hub
├── DOCUMENTATION_INDEX.md          # Master index
│
├── user/                           # USER DOCUMENTATION
│   ├── README.md                   # User docs home
│   ├── getting-started/            # Quick start, first login, basics
│   ├── modules/                    # All 20 modules documented
│   ├── features/                   # Views, search, notifications, etc.
│   └── guides/                     # Tasks, workflows, troubleshooting
│
├── developer/                      # DEVELOPER DOCUMENTATION
│   ├── README.md                   # Developer docs home
│   ├── getting-started/            # Dev setup and onboarding
│   ├── architecture/               # System architecture (8 layers)
│   ├── apis/                       # API references and examples
│   └── guides/                     # Development how-tos
│
└── legacy/                         # ORIGINAL DOCUMENTATION (preserved)
    └── [All original docs maintained for reference]
```

---

## 🚀 Quick Start Paths

### New User (5 minutes)
1. [User Quick Start](user/getting-started/quick-start.md)
2. [First Login Guide](user/getting-started/first-login.md)
3. [Dashboard Overview](user/modules/dashboard.md)

### New Developer (10 minutes)
1. [Developer Quick Start](developer/getting-started/quick-start.md)
2. [Project Structure](developer/getting-started/project-structure.md)
3. [Architecture Overview](developer/architecture/overview.md)

---

## 📊 What's New

### October 15, 2025 - Major Documentation Reorganization

**Complete Restructure:**
- ✅ Separated user and developer documentation
- ✅ Created modular, organized directory structure
- ✅ Added comprehensive quick start guides
- ✅ Documented all 20 modules
- ✅ Preserved all legacy documentation
- ✅ Created master documentation index

**User Documentation:**
- 4 getting started guides
- 20 complete module guides
- 7 feature guides
- 6 practical workflow guides
- **Total**: 37+ user documents

**Developer Documentation:**
- 4 onboarding guides  
- 13 architecture documents
- 8 API references
- 20+ development guides
- **Total**: 45+ developer documents

**Legacy Documentation:**
- All original documentation preserved in `legacy/`
- Includes layers, modules, features, audits, status reports
- Maintained for historical reference

---

## 🗂️ Legacy Documentation

### Original Documentation (Preserved)

The original documentation structure has been preserved in the `legacy/` directory:

- **[Legacy Documentation Home](legacy/ORIGINAL_README.md)** - Original README

---

## 🏗️ Layers

Technical architecture organized by layer:

| Layer | Document | Description | Status |
|-------|----------|-------------|--------|
| **Layer 1** | [LAYER_1_DATABASE.md](layers/LAYER_1_DATABASE.md) | Database schema, 120+ tables, PostGIS spatial | ✅ Complete |
| **Layer 2** | [LAYER_2_STORAGE.md](layers/LAYER_2_STORAGE.md) | File storage buckets | ✅ Complete |
| **Layer 3** | [LAYER_3_AUTH.md](layers/LAYER_3_AUTH.md) | Authentication system | ✅ Complete |
| **Layer 4** | [LAYER_4_RLS.md](layers/LAYER_4_RLS.md) | Row Level Security policies | ✅ Complete |
| **Layer 5** | [LAYER_5_REALTIME.md](layers/LAYER_5_REALTIME.md) | Real-time subscriptions | ✅ Complete |
| **Layer 6** | [LAYER_6_BUSINESS_LOGIC.md](layers/LAYER_6_BUSINESS_LOGIC.md) | RPC functions, business logic | ✅ Complete |
| **Layer 7** | [LAYER_7_UI.md](layers/LAYER_7_UI.md) | Frontend integration | ✅ Complete |
| **Layer 8** | [LAYER_8_INTEGRATIONS.md](layers/LAYER_8_INTEGRATIONS.md) | External integrations, webhooks | ✅ Complete |

---

## 📦 Modules

Feature modules (20 total):

### Core Modules
- [MODULE_DASHBOARD.md](modules/MODULE_DASHBOARD.md) - Personal dashboard (11 tabs)
- [MODULE_PROJECTS.md](modules/MODULE_PROJECTS.md) - Productions & tasks (8 tabs)
- [MODULE_EVENTS.md](modules/MODULE_EVENTS.md) - Events & scheduling (14 tabs)
- [MODULE_PEOPLE.md](modules/MODULE_PEOPLE.md) - Personnel & teams (9 tabs)
- [MODULE_ASSETS.md](modules/MODULE_ASSETS.md) - Equipment inventory (7 tabs)

### Operations Modules
- [MODULE_LOCATIONS.md](modules/MODULE_LOCATIONS.md) - Venues & facilities (9 tabs) - **NEW: GIS/CAD/BIM Complete**
- [MODULE_FILES.md](modules/MODULE_FILES.md) - Document management (10 tabs)
- [MODULE_FINANCE.md](modules/MODULE_FINANCE.md) - Financial management (13 tabs)
- [MODULE_PROCUREMENT.md](modules/MODULE_PROCUREMENT.md) - Purchasing (8 tabs)
- [MODULE_JOBS.md](modules/MODULE_JOBS.md) - Job openings & applicants (8 tabs)

### Business Modules
- [MODULE_COMPANIES.md](modules/MODULE_COMPANIES.md) - Vendors & clients (6 tabs)
- [MODULE_COMMUNITY.md](modules/MODULE_COMMUNITY.md) - Internal social (8 tabs)
- [MODULE_MARKETPLACE.md](modules/MODULE_MARKETPLACE.md) - Product marketplace (10 tabs)
- [MODULE_RESOURCES.md](modules/MODULE_RESOURCES.md) - Knowledge base (8 tabs)

### Analytics Modules
- [MODULE_REPORTS.md](modules/MODULE_REPORTS.md) - Report generation (9 tabs)
- [MODULE_ANALYTICS.md](modules/MODULE_ANALYTICS.md) - Data analytics (10 tabs)
- [MODULE_INSIGHTS.md](modules/MODULE_INSIGHTS.md) - AI insights (10 tabs)

### System Modules
- [MODULE_ADMIN.md](modules/MODULE_ADMIN.md) - System administration (11 tabs)
- [MODULE_SETTINGS.md](modules/MODULE_SETTINGS.md) - User & org settings (6 tabs)
- [MODULE_PROFILE.md](modules/MODULE_PROFILE.md) - User profiles (11 tabs)

---

## ⚡ Features

Cross-cutting features and systems:

### Internationalization
- [FEATURE_I18N.md](features/FEATURE_I18N.md) - 20 languages, 290+ keys | Status: ✅ Infrastructure complete, ~70% strings

### Data Management
- [FEATURE_CRUD.md](features/FEATURE_CRUD.md) - CRUD operations system | Status: ✅ Complete
- [FEATURE_VIEWS.md](features/FEATURE_VIEWS.md) - 18 view types (List, Board, Calendar, etc.) | Status: ✅ Complete
- [FEATURE_FORMS.md](features/FEATURE_FORMS.md) - Dynamic forms system | Status: ✅ Complete

### User Experience
- [FEATURE_ANIMATIONS.md](features/FEATURE_ANIMATIONS.md) - Microanimations guide | Status: ✅ Complete
- [FEATURE_AUTH.md](features/FEATURE_AUTH.md) - Auth & onboarding flows | Status: ✅ Complete
- [FEATURE_RBAC.md](features/FEATURE_RBAC.md) - Role-based access control | Status: ✅ Complete

### Phase Features
- [FEATURE_PHASES.md](features/FEATURE_PHASES.md) - Phase 1, 2, 5 feature implementations | Status: ✅ Complete

### Specialized Features
- [LOCATIONS_GIS_CAD_OPTIMIZATION.md](LOCATIONS_GIS_CAD_OPTIMIZATION.md) - GIS/CAD spatial optimization | Status: ✅ Complete (Jan 2025)
- [LOCATIONS_GIS_QUICK_REFERENCE.md](LOCATIONS_GIS_QUICK_REFERENCE.md) - GIS/CAD quick reference guide | Status: ✅ Complete
- [LOCATIONS_BIM_INTEGRATION.md](LOCATIONS_BIM_INTEGRATION.md) - BIM/IFC/Revit integration | Status: ✅ Complete (Jan 2025)
- [LOCATIONS_BIM_QUICK_REFERENCE.md](LOCATIONS_BIM_QUICK_REFERENCE.md) - BIM quick reference guide | Status: ✅ Complete

---

## 🔍 Audits

### Comprehensive Audit Summary
- [COMPREHENSIVE_AUDIT_SUMMARY.md](COMPREHENSIVE_AUDIT_SUMMARY.md) - Complete audit of all issues (Oct 2025) | Status: ✅ Complete

### All Audits (audits/ folder)
- [ZERO_TOLERANCE_ERROR_AUDIT_2025_10_13.md](audits/ZERO_TOLERANCE_ERROR_AUDIT_2025_10_13.md) - Initial comprehensive error audit
- [I18N_ZERO_TOLERANCE_AUDIT.md](audits/I18N_ZERO_TOLERANCE_AUDIT.md) - Internationalization audit
- [DOCUMENTATION_AUDIT.md](audits/DOCUMENTATION_AUDIT.md) - Documentation consolidation audit
- [CONSOLIDATION_COMPLETE_OCT_14.md](audits/CONSOLIDATION_COMPLETE_OCT_14.md) - Consolidation summary

### Module Audits
- [ANALYTICS_MODULE_AUDIT.md](audits/ANALYTICS_MODULE_AUDIT.md) - Analytics module audit
- [COMPANIES_MODULE_AUDIT_2025_10_13.md](audits/COMPANIES_MODULE_AUDIT_2025_10_13.md) - Companies module audit
- [COMMUNITY_MODULE_AUDIT.md](audits/COMMUNITY_MODULE_AUDIT.md) - Community module audit
- [DASHBOARD_AUDIT.md](audits/DASHBOARD_AUDIT.md) - Dashboard module audit
- [EVENTS_MODULE_AUDIT_2025_10_13.md](audits/EVENTS_MODULE_AUDIT_2025_10_13.md) - Events module audit
- [FINANCE_MODULE_AUDIT_2025_10_13.md](audits/FINANCE_MODULE_AUDIT_2025_10_13.md) - Finance module audit
- [PROFILE_MODULE_AUDIT_2025_01_14.md](audits/PROFILE_MODULE_AUDIT_2025_01_14.md) - Profile module audit
- [RESOURCES_MODULE_TAB_AUDIT.md](audits/RESOURCES_MODULE_TAB_AUDIT.md) - Resources module audit

### Feature Audits
- [I18N_AUDIT_EXECUTIVE_SUMMARY.md](audits/I18N_AUDIT_EXECUTIVE_SUMMARY.md) - I18n audit summary
- [ICON_AUDIT_SUMMARY.md](audits/ICON_AUDIT_SUMMARY.md) - Icon usage audit

---

## 🔧 Fixes & Status

### Module Fixes
- [MODULE_FIXES_COMPLETE_SUMMARY.md](fixes/MODULE_FIXES_COMPLETE_SUMMARY.md) - All module fixes consolidated | Status: ✅ Complete

### Historical Fixes (fixes/ folder)
- [ONBOARDING_FIXES_HISTORY.md](fixes/ONBOARDING_FIXES_HISTORY.md) - Complete onboarding bug fix history
- [HEADER_RESPONSIVE_FIX.md](fixes/HEADER_RESPONSIVE_FIX.md) - Header responsive layout fix
- [BREADCRUMB_CUMULATIVE_FIX.md](fixes/BREADCRUMB_CUMULATIVE_FIX.md) - Breadcrumb fixes
- [JOBS_MODULE_ERROR_REMEDIATION_2025_10_14.md](fixes/JOBS_MODULE_ERROR_REMEDIATION_2025_10_14.md) - Jobs module fixes
- [REPORTS_MODULE_ERROR_REMEDIATION_2025_10_14.md](fixes/REPORTS_MODULE_ERROR_REMEDIATION_2025_10_14.md) - Reports module fixes
- [RESOURCES_MODULE_ERROR_REMEDIATION_2025_10_13.md](fixes/RESOURCES_MODULE_ERROR_REMEDIATION_2025_10_13.md) - Resources module fixes
- [PROCUREMENT_MODULE_ERROR_LOADING_DATA_FIX_2025_10_13.md](fixes/PROCUREMENT_MODULE_ERROR_LOADING_DATA_FIX_2025_10_13.md) - Procurement fixes
- [PEOPLE_MODULE_ERROR_LOADING_DATA_FIX.md](fixes/PEOPLE_MODULE_ERROR_LOADING_DATA_FIX.md) - People module fixes
- [ASSETS_MODULE_ERROR_LOADING_DATA_FIX_2025_10_13.md](fixes/ASSETS_MODULE_ERROR_LOADING_DATA_FIX_2025_10_13.md) - Assets module fixes

### Module Status & Verification (status/ folder)
- [ANALYTICS_MODULE_VERIFICATION.md](status/ANALYTICS_MODULE_VERIFICATION.md) - Analytics verification
- [INSIGHTS_MODULE_VERIFICATION.md](status/INSIGHTS_MODULE_VERIFICATION.md) - Insights verification
- [PEOPLE_MODULE_TAB_VERIFICATION.md](status/PEOPLE_MODULE_TAB_VERIFICATION.md) - People tabs verification
- [FINANCE_MODULE_QUICK_TEST.md](status/FINANCE_MODULE_QUICK_TEST.md) - Finance quick test
- [COMMUNITY_IMPLEMENTATION_COMPLETE.md](status/COMMUNITY_IMPLEMENTATION_COMPLETE.md) - Community status
- [DASHBOARD_IMPLEMENTATION_STATUS.md](status/DASHBOARD_IMPLEMENTATION_STATUS.md) - Dashboard status
- [DASHBOARD_INTEGRATION_COMPLETE.md](status/DASHBOARD_INTEGRATION_COMPLETE.md) - Dashboard integration
- [DASHBOARD_INTEGRATION_FINAL.md](status/DASHBOARD_INTEGRATION_FINAL.md) - Dashboard final status
- [PROFILE_MODULE_COMPLETE_SUMMARY.md](status/PROFILE_MODULE_COMPLETE_SUMMARY.md) - Profile module summary
- [PROFILE_MODULE_FINAL_STATUS.md](status/PROFILE_MODULE_FINAL_STATUS.md) - Profile final status
- [NOTIFICATIONS_REFACTOR_SUMMARY.md](status/NOTIFICATIONS_REFACTOR_SUMMARY.md) - Notifications refactor
- [RELATIONSHIP_FIX_SUMMARY.md](status/RELATIONSHIP_FIX_SUMMARY.md) - Database relationship fixes
- [I18N_REMEDIATION_CHECKLIST.md](status/I18N_REMEDIATION_CHECKLIST.md) - I18n remediation checklist

---

## 📖 Guides

Development and operational guides:

### Development
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [FRONTEND_QUICKSTART.md](guides/FRONTEND_QUICKSTART.md) - Frontend development
- [DEVELOPMENT.md](guides/DEVELOPMENT.md) - Development workflow

### Deployment
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [MIGRATION_INSTRUCTIONS.md](MIGRATION_INSTRUCTIONS.md) - Database migration guide
- [GITHUB_SETUP.md](guides/GITHUB_SETUP.md) - GitHub integration

### Testing
- [RESPONSIVE_TEST_GUIDE.md](guides/RESPONSIVE_TEST_GUIDE.md) - Responsive testing
- [LANGUAGE_TESTING_GUIDE.md](guides/LANGUAGE_TESTING_GUIDE.md) - i18n testing

### Implementation Guides (guides/implementation/)
- [STORAGE_SETUP.md](guides/implementation/STORAGE_SETUP.md) - Supabase storage configuration | Status: ✅ Complete
- [RESPONSIVE_OPTIMIZATION_IMPLEMENTATION.md](guides/implementation/RESPONSIVE_OPTIMIZATION_IMPLEMENTATION.md) - Mobile responsive optimizations | Status: ✅ Complete
- [STRIPE_IMPLEMENTATION_GUIDE.md](guides/implementation/STRIPE_IMPLEMENTATION_GUIDE.md) - Stripe integration guide | Status: ✅ Complete
- [STRIPE_QUICK_START.md](guides/implementation/STRIPE_QUICK_START.md) - Stripe quick start | Status: ✅ Complete

---

## 📊 Project Status

### Overall Progress
- **Backend**: ✅ 100% Complete - All migrations deployed
- **Frontend Hooks**: ✅ 100% Complete - All data access ready
- **UI Components**: ✅ 95% Complete - Mock data ready for real data
- **Internationalization**: 🟡 70% Complete - Infrastructure done, strings in progress
- **Documentation**: ✅ 100% Complete - Fully consolidated and organized
- **Supabase Integration**: ✅ 100% Complete - All modules connected
- **Field Mapping**: ✅ 100% Complete - All 500+ fields aligned

### Module Status
All 20 modules implemented with full tab support (174 tabs total).

### Layer Status
All 8 architectural layers complete and deployed.

### Integration Status
- [SUPABASE_INTEGRATION_STATUS.md](SUPABASE_INTEGRATION_STATUS.md) - Complete integration status | Status: ✅ Production Ready
- [FIELD_MAPPING_STATUS.md](FIELD_MAPPING_STATUS.md) - Field mapping reference | Status: ✅ 100% Complete

### Business & Planning (business/ folder)
- [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) - Product roadmap and feature planning | Status: 🟡 Active Development
- [ENTERPRISE_READINESS_CHECKLIST.md](business/ENTERPRISE_READINESS_CHECKLIST.md) - Enterprise feature checklist
- [PRICING_STRUCTURE.md](business/PRICING_STRUCTURE.md) - Product pricing tiers

---

## 🔍 Finding Information

### By Use Case

**"How do I add a new module?"**
→ See [ARCHITECTURE.md](ARCHITECTURE.md#extending-the-platform)

**"How do I connect to the database?"**
→ See [LAYER_7_UI.md](layers/LAYER_7_UI.md)

**"How do I add translations?"**
→ See [FEATURE_I18N.md](features/FEATURE_I18N.md#adding-new-translations)

**"How do I deploy to production?"**
→ See [DEPLOYMENT.md](DEPLOYMENT.md)

**"What's the database schema?"**
→ See [LAYER_1_DATABASE.md](layers/LAYER_1_DATABASE.md)

**"How do real-time updates work?"**
→ See [LAYER_5_REALTIME.md](layers/LAYER_5_REALTIME.md)

**"What modules are available?"**
→ See [Modules](#-modules) section above

**"How was the onboarding bug fixed?"**
→ See [ONBOARDING_FIXES_HISTORY.md](fixes/ONBOARDING_FIXES_HISTORY.md)

---

## 📝 Documentation Standards

### File Naming
- Layers: `LAYER_N_NAME.md`
- Modules: `MODULE_NAME.md`
- Features: `FEATURE_NAME.md`
- Guides: `descriptive-name.md`

### Structure
Each document includes:
- **Header**: Source files, status, last updated
- **Overview**: Brief description
- **Content**: Detailed information
- **Status**: Current state
- **Next Steps**: Future work

### Maintenance
- Update date when content changes
- Mark status (✅ Complete, 🟡 In Progress, 🔴 Not Started)
- Reference source files in header
- Keep cross-references updated

---

## 🗃️ Archive

Old documentation files have been consolidated. Original files preserved in:
- Git history (all changes tracked)
- `docs/archive/` (if needed for reference)

Consolidated files replace:
- 10+ i18n documentation files → `FEATURE_I18N.md`
- 8+ CRUD documentation files → `FEATURE_CRUD.md`
- 15+ status reports → Module/Layer documentation
- 20+ completion reports → Module documentation
- And many more...

---

## 🤝 Contributing to Docs

### Adding New Documentation
1. Determine category (Layer, Module, Feature, Guide)
2. Create file with proper naming convention
3. Use standard structure (header, overview, content, status)
4. Update this index
5. Cross-reference related documents

### Updating Existing Documentation
1. Update content
2. Update "Last Updated" date
3. Update status if changed
4. Update cross-references if needed

---

## 📞 Support

### Documentation Issues
- Missing information? Create an issue
- Outdated content? Submit a PR
- Questions? Check the relevant guide first

### Code Issues
- See [ARCHITECTURE.md](ARCHITECTURE.md) for system overview
- See layer docs for technical details
- See module docs for feature specifics

---

## ✅ Documentation Consolidation History

### October 14, 2025 - Enhanced Organization (Latest)
- **Created folders:** `audits/`, `status/`, `business/`, `guides/implementation/`
- **Organized 30+ files:** Moved audits, status docs, business docs to proper folders
- **Result:** ✅ Clean, logical folder structure
- **Top-level docs:** Only 12 essential files remain

### October 14, 2025 - FINAL Consolidation
- **Moved ALL files to docs/:** Only `README.md` remains in root
- **Files moved:** 7 essential files to docs/
- **Result:** ✅ Root directory has ONLY README.md
- **Documentation home:** All 70+ files now in docs/ directory

### October 14, 2025 - Second Consolidation
- **Created:** 3 comprehensive summary documents
  - `COMPREHENSIVE_AUDIT_SUMMARY.md` - All audits consolidated
  - `MODULE_FIXES_COMPLETE_SUMMARY.md` - All module fixes
  - `DEPLOYMENT_AND_INTEGRATION_STATUS.md` - Deployment & integration
- **Moved:** `PRODUCT_ROADMAP.md`, `MIGRATION_INSTRUCTIONS.md` to docs/
- **Removed:** 13 redundant files from root directory

### October 13, 2025 - Initial Consolidation
- **Before**: 92+ markdown files in root directory
- **After**: ~40 organized files in `docs/` structure
- **Result**: Clear hierarchy, easy navigation, single source of truth per topic

See [DOCUMENTATION_AUDIT.md](audits/DOCUMENTATION_AUDIT.md) and [CONSOLIDATION_COMPLETE_OCT_14.md](audits/CONSOLIDATION_COMPLETE_OCT_14.md) for full consolidation manifests.

---

**Welcome to Dragonfly 26.00 Documentation! 🚀**

