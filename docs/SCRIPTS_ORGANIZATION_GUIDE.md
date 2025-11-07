# Scripts Organization Guide
**Quick Reference for Organized Script Structure**

## Directory Structure

```
scripts/
├── accessibility/      12 files
├── archive/            0 files (ready for deprecated)
├── audit/             32 files
├── database/          49 files
├── deployment/         1 file
├── fix/               64 files
├── generation/        14 files
├── i18n/              59 files
├── marketing/         26 files
├── responsive/        13 files
├── testing/            3 files
├── typography/        15 files
└── utilities/         36 files
```

## Category Descriptions

### 🎯 accessibility/ (12 files)
**Purpose:** WCAG compliance, ARIA labels, screen reader support

**Common Scripts:**
- `accessibility-achieve-perfect-100.js` - Final accessibility push
- `fix-accessibility-comprehensive.js` - Comprehensive fixes
- `verify-accessibility-100-percent.js` - Verification

**Use When:** Working on accessibility features, WCAG compliance, ARIA labels

---

### 🌍 i18n/ (59 files)
**Purpose:** Translation, localization, internationalization

**Common Scripts:**
- `translate-all-languages-complete.js` - Translate all 20 languages
- `verify-all-languages-complete.js` - Verify translations
- `translate-*.sh` - Individual language translation scripts

**Use When:** Adding translations, fixing i18n issues, language support

---

### 🗄️ database/ (49 files)
**Purpose:** Migrations, RLS policies, schema management

**Common Scripts:**
- `apply-all-migrations-sequentially.js` - Apply migrations in order
- `comprehensive-rls-audit.js` - Audit RLS policies
- `verify-database-tables.ts` - Verify schema

**Use When:** Database changes, migrations, RLS policies, schema updates

---

### 📱 responsive/ (13 files)
**Purpose:** Mobile-first design, breakpoints, responsive UX

**Common Scripts:**
- `achieve-100-percent-responsive.js` - Responsive fixes
- `fix-responsive-atomic-ux.js` - Atomic-level responsive fixes
- `comprehensive-responsive-audit.js` - Audit responsive design

**Use When:** Mobile optimization, breakpoint issues, responsive design

---

### 🔤 typography/ (15 files)
**Purpose:** Font management, heading standardization

**Common Scripts:**
- `comprehensive-typography-audit.js` - Audit typography
- `fix-all-typography-issues.js` - Fix typography violations
- `standardize-h1-sizes.js` - Standardize heading sizes

**Use When:** Font changes, heading issues, typography standardization

---

### 📢 marketing/ (26 files)
**Purpose:** Marketing pages, pricing, landing pages

**Common Scripts:**
- `create-all-marketing-pages.js` - Generate marketing pages
- `update-marketing-brand-voice.js` - Update brand voice
- `verify-marketing-implementation.js` - Verify marketing

**Use When:** Marketing site updates, pricing changes, landing pages

---

### 🔍 audit/ (32 files)
**Purpose:** Verification, validation, compliance checks

**Common Scripts:**
- `comprehensive-full-stack-audit.js` - Full stack audit
- `zero-tolerance-12-layer-audit.js` - 12-layer compliance
- `validate-production-build.js` - Production validation

**Use When:** Quality assurance, compliance checks, pre-deployment

---

### 🔧 fix/ (64 files)
**Purpose:** Bug fixes, error remediation, repairs

**Common Scripts:**
- `fix-all-errors-final.js` - Comprehensive error fixes
- `fix-all-lint-errors-now.js` - Lint error fixes
- `emergency-repair-all-damage.js` - Emergency repairs

**Use When:** Bug fixes, error remediation, code repairs

---

### 🎨 generation/ (14 files)
**Purpose:** Asset generation, icons, favicons

**Common Scripts:**
- `generate-icons.js` - Generate icon assets
- `create-atlvs-favicon.js` - Create favicon
- `generate-logo-pngs.js` - Generate logo PNGs

**Use When:** Creating assets, icons, favicons, logos

---

### 🧪 testing/ (3 files)
**Purpose:** Test scripts, validation

**Common Scripts:**
- `test-role-workflows.ts` - Test RBAC workflows
- `test-waitlist-system.ts` - Test waitlist
- `test-language-toggles.sh` - Test language switching

**Use When:** Running tests, validating functionality

---

### 🚀 deployment/ (1 file)
**Purpose:** Deployment automation

**Common Scripts:**
- `deploy-performance-optimization.js` - Deploy with optimization

**Use When:** Deploying to production, performance optimization

---

### 🛠️ utilities/ (36 files)
**Purpose:** Helper scripts, tools, general utilities

**Common Scripts:**
- `connect-all-tabs-to-supabase.js` - Connect components
- `standardize-empty-states.js` - Standardize UI
- `update-module-registries.js` - Update registries

**Use When:** General maintenance, utilities, helper tasks

---

### 📦 archive/ (0 files)
**Purpose:** Deprecated scripts (future use)

**Use When:** Archiving old scripts, keeping history

## Quick Find Guide

### "I need to..."

**Fix accessibility issues**
→ `scripts/accessibility/`

**Add translations**
→ `scripts/i18n/`

**Update database schema**
→ `scripts/database/`

**Fix mobile responsiveness**
→ `scripts/responsive/`

**Update fonts/headings**
→ `scripts/typography/`

**Update marketing pages**
→ `scripts/marketing/`

**Run quality checks**
→ `scripts/audit/`

**Fix bugs/errors**
→ `scripts/fix/`

**Generate assets**
→ `scripts/generation/`

**Run tests**
→ `scripts/testing/`

**Deploy to production**
→ `scripts/deployment/`

**General utilities**
→ `scripts/utilities/`

## Running Scripts

### Basic Usage
```bash
# Navigate to project root
cd /path/to/Dragonfly26.00

# Run a script
node scripts/[category]/[script-name].js

# Example: Run accessibility audit
node scripts/accessibility/verify-accessibility-100-percent.js
```

### Common Patterns

**Audit → Fix → Verify**
```bash
# 1. Audit
node scripts/audit/comprehensive-full-stack-audit.js

# 2. Fix
node scripts/fix/fix-all-errors-final.js

# 3. Verify
node scripts/audit/validate-production-build.js
```

**Translation Workflow**
```bash
# 1. Find hardcoded strings
node scripts/i18n/find-all-hardcoded-strings.js

# 2. Fix violations
node scripts/i18n/fix-i18n-violations-complete.js

# 3. Verify
node scripts/i18n/verify-all-languages-complete.js
```

## Best Practices

### 1. Always Audit First
Run audit scripts before making changes to understand current state

### 2. Use Dry-Run When Available
Many scripts support `--dry-run` flag to preview changes

### 3. Backup Before Major Changes
Scripts create backups, but manual backups are recommended

### 4. Verify After Changes
Always run verification scripts after making changes

### 5. Check Script Documentation
Many scripts have detailed comments at the top

## Script Naming Conventions

- `audit-*.js` - Audits and reports
- `fix-*.js` - Fixes and remediation
- `verify-*.js` - Verification and validation
- `generate-*.js` - Asset generation
- `create-*.js` - Creation scripts
- `update-*.js` - Update scripts
- `comprehensive-*.js` - Full/complete operations
- `final-*.js` - Final/ultimate versions

## Maintenance

### Adding New Scripts
1. Determine appropriate category
2. Follow naming conventions
3. Add to correct subdirectory
4. Update this guide if needed

### Archiving Old Scripts
1. Move to `scripts/archive/`
2. Document reason for archival
3. Update references if needed

### Regular Cleanup
- Review scripts quarterly
- Archive obsolete scripts
- Update documentation
- Consolidate duplicates

## Support

For questions about script organization:
1. Check this guide
2. Review script comments
3. Check operation log: `docs/REORGANIZATION_LOG_2025_11_06.json`
4. Review completion report: `docs/CODEBASE_REORGANIZATION_COMPLETE_2025_11_06.md`

---

**Last Updated:** November 6, 2025  
**Total Scripts:** 324 organized into 13 categories  
**Status:** Production Ready
