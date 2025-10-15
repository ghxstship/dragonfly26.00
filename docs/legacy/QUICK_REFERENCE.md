# Quick Reference - Dragonfly 26.00

**Last Updated:** October 14, 2025

---

## 📍 Most Important Documents

### Critical References
1. **[FIELD_MAPPING_STATUS.md](FIELD_MAPPING_STATUS.md)** - All 940 field mappings
2. **[SUPABASE_INTEGRATION_STATUS.md](SUPABASE_INTEGRATION_STATUS.md)** - Complete integration status

### Comprehensive Summaries
1. **[COMPREHENSIVE_AUDIT_SUMMARY.md](COMPREHENSIVE_AUDIT_SUMMARY.md)** - All audits (Oct 2025)
2. **[MODULE_FIXES_COMPLETE_SUMMARY.md](fixes/MODULE_FIXES_COMPLETE_SUMMARY.md)** - All module fixes
3. **[DEPLOYMENT_AND_INTEGRATION_STATUS.md](DEPLOYMENT_AND_INTEGRATION_STATUS.md)** - Production status

### Getting Started
1. **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture
3. **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment

---

## 🎯 Common Tasks

### "I need to understand what was fixed"
→ Read `docs/fixes/MODULE_FIXES_COMPLETE_SUMMARY.md`
- 78 tabs fixed
- 68+ RLS policies
- All modules operational

### "I need to see deployment status"
→ Read `docs/DEPLOYMENT_AND_INTEGRATION_STATUS.md`
- 17 modules, 78 tabs operational
- 6 migrations applied
- Production ready

### "I need to understand all audits"
→ Read `docs/COMPREHENSIVE_AUDIT_SUMMARY.md`
- 4 major audits documented
- Issues identified and fixed
- Prevention measures

### "I need field mappings"
→ Read `FIELD_MAPPING_STATUS.md` (in docs/)
- 17 modules
- 77 tables
- 940 fields aligned

### "I need Supabase integration details"
→ Read `SUPABASE_INTEGRATION_STATUS.md` (in docs/)
- 150+ table mappings
- 58 custom components
- RLS policies

---

## 📊 Current Status

### Production Status
- ✅ **All Modules:** 17/17 operational
- ✅ **All Tabs:** 78/78 working
- ✅ **RLS Policies:** 68+ active
- ✅ **Field Mappings:** 100% aligned
- 🟡 **I18n:** 32.6% complete (in progress)

### Documentation Status
- ✅ **Root Files:** 1 file (README.md ONLY)
- ✅ **docs/ Files:** 64+ organized files
- ✅ **Comprehensive Summaries:** 3 major documents
- ✅ **Single Source of Truth:** Established

---

## 🗂️ Documentation Structure

```
Root (1 file ONLY):
└── README.md (project entry point)

docs/ (70+ files - ALL documentation):
├── README.md (documentation index)
├── QUICK_REFERENCE.md (this file)
├── QUICKSTART.md (quick start guide)
├── ARCHITECTURE.md (system architecture)
├── DEPLOYMENT.md (deployment guide)
├── FIELD_MAPPING_STATUS.md (critical field mappings)
├── SUPABASE_INTEGRATION_STATUS.md (critical integration status)
├── PROJECT_README.md (project overview)
├── COMPREHENSIVE_AUDIT_SUMMARY.md (all audits consolidated)
├── DEPLOYMENT_AND_INTEGRATION_STATUS.md (production status)
├── PRODUCT_ROADMAP.md (roadmap)
├── MIGRATION_INSTRUCTIONS.md (migration guide)
│
├── audits/ (13 files - all audit documents)
│   ├── ZERO_TOLERANCE_ERROR_AUDIT_2025_10_13.md
│   ├── I18N_ZERO_TOLERANCE_AUDIT.md
│   ├── DOCUMENTATION_AUDIT.md
│   ├── CONSOLIDATION_COMPLETE_OCT_14.md
│   └── ... (9 more module audits)
│
├── status/ (13 files - module status & verification)
│   ├── ANALYTICS_MODULE_VERIFICATION.md
│   ├── DASHBOARD_IMPLEMENTATION_STATUS.md
│   ├── I18N_REMEDIATION_CHECKLIST.md
│   └── ... (10 more status documents)
│
├── business/ (2 files - business documents)
│   ├── ENTERPRISE_READINESS_CHECKLIST.md
│   └── PRICING_STRUCTURE.md
│
├── layers/ (8 files - architectural layers)
├── modules/ (20 files - feature modules)
├── features/ (8 files - cross-cutting features)
├── fixes/ (9+ files - historical bug fixes)
│   └── MODULE_FIXES_COMPLETE_SUMMARY.md
│
└── guides/ (6+ files - development guides)
    ├── FRONTEND_QUICKSTART.md
    ├── RESPONSIVE_TEST_GUIDE.md
    └── implementation/ (4 files - implementation guides)
```

---

## 🚀 Next Steps

### For Developers
1. Read `QUICKSTART.md` to get started
2. Review `ARCHITECTURE.md` for system understanding
3. Check `docs/DEPLOYMENT_AND_INTEGRATION_STATUS.md` for current state
4. Refer to module-specific docs in `docs/modules/` as needed

### For Project Managers
1. Review `docs/DEPLOYMENT_AND_INTEGRATION_STATUS.md` for status
2. Check `docs/PRODUCT_ROADMAP.md` for upcoming work
3. See `docs/COMPREHENSIVE_AUDIT_SUMMARY.md` for quality metrics

### For QA/Testing
1. Read `docs/COMPREHENSIVE_AUDIT_SUMMARY.md` for what was tested
2. Check `docs/fixes/MODULE_FIXES_COMPLETE_SUMMARY.md` for what was fixed
3. Review testing guides in `docs/guides/`

---

**For complete documentation index, see [docs/README.md](README.md)**
