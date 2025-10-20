#!/bin/bash

# Comprehensive Codebase Cleanup Script
# Removes legacy documentation, audit reports, and temporary files

set -e

echo "🧹 Starting comprehensive codebase cleanup..."

# Root-level cleanup
echo "📄 Cleaning root-level documentation..."
rm -f CODEBASE_CLEANUP_SUMMARY_2025_10_19.md
rm -f FINAL_CLEANUP_REPORT_2025_10_19.md
rm -f FINAL_PRODUCTION_BUILD_SUCCESS.log
rm -f PERFORMANCE_REMEDIATION_SUMMARY.md
rm -f SUPABASE_MIGRATIONS_100_PERCENT_COMPLETE.md

# Archive entire docs directory except essential files
echo "📚 Cleaning docs directory..."

# Keep only essential documentation
KEEP_DOCS=(
  "README.md"
  "DOCUMENTATION_INDEX.md"
  "QUICK_DEPLOYMENT_GUIDE.md"
  "developer/"
  "business/"
)

# Remove archive directories
rm -rf docs/archive/

# Remove audit directories
rm -rf docs/audits/

# Remove legacy directories
rm -rf docs/legacy/

# Remove reports directories
rm -rf docs/reports/

# Remove fixes directories
rm -rf docs/fixes/

# Remove completion and status reports from root docs
find docs/ -maxdepth 1 -type f \( \
  -name "*COMPLETE*.md" -o \
  -name "*AUDIT*.md" -o \
  -name "*REMEDIATION*.md" -o \
  -name "*SUMMARY*.md" -o \
  -name "*STATUS*.md" -o \
  -name "*PHASE*.md" -o \
  -name "*CHECKLIST*.md" -o \
  -name "*IMPLEMENTATION*.md" -o \
  -name "*OPTIMIZATION*.md" -o \
  -name "*REFACTORING*.md" -o \
  -name "*VERIFICATION*.md" -o \
  -name "*EXECUTION*.md" -o \
  -name "100_PERCENT*.md" \
\) -delete

# Clean up scripts directory
echo "🔧 Cleaning scripts directory..."

# Remove temporary/one-off scripts
rm -f scripts/add-drop-if-exists.js
rm -f scripts/check-remaining-tables.js
rm -f scripts/check-table-columns.js
rm -f scripts/final-sync-verification.js
rm -f scripts/generate-complete-rls-remediation.js
rm -f scripts/generate-search-path-fix.js
rm -f scripts/monitor-database-performance.js
rm -f scripts/monitor-performance-simple.js
rm -f scripts/optimize-all-realtime-hooks.js
rm -f scripts/triple-verification.js
rm -f scripts/verify-performance-indexes.js
rm -f scripts/verify-remote-migrations.js

# Remove shell scripts (keep only essential ones)
find scripts/ -name "*.sh" ! -name "comprehensive-cleanup.sh" -delete

# Remove Python scripts
rm -f scripts/*.py

# Clean up build artifacts
echo "🏗️  Cleaning build artifacts..."
rm -f tsconfig.tsbuildinfo
rm -rf .next/

# Clean up temporary files
echo "🗑️  Cleaning temporary files..."
find . -name ".DS_Store" -delete
find . -name "*.log" ! -name "package-lock.json" -delete
find . -name "*.tmp" -delete

echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Removed root-level documentation files"
echo "  - Removed docs/archive/, docs/audits/, docs/legacy/, docs/reports/, docs/fixes/"
echo "  - Removed completion/audit reports from docs/"
echo "  - Removed temporary scripts"
echo "  - Removed build artifacts"
echo "  - Removed temporary files"
echo ""
echo "✨ Codebase is now clean and production-ready!"
