#!/bin/bash

# Community File Collaboration - Implementation Verification Script
# Run this to verify all files are in place

echo "🔍 Verifying Community File Collaboration Implementation..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}❌${NC} $2 - MISSING: $1"
        ((FAILED++))
    fi
}

echo "📁 Checking Database Migrations..."
check_file "supabase/migrations/072_community_file_collaboration_optimization.sql" "Migration 072 (File Collaboration)"
check_file "supabase/migrations/073_community_advanced_file_features.sql" "Migration 073 (Advanced Features)"
echo ""

echo "🎣 Checking Hooks..."
check_file "src/hooks/use-file-collaboration.ts" "File Collaboration Hooks"
echo ""

echo "🧩 Checking UI Components..."
check_file "src/components/files/file-share-dialog.tsx" "Share Dialog Component"
check_file "src/components/files/file-comments-panel.tsx" "Comments Panel Component"
check_file "src/components/files/file-activity-timeline.tsx" "Activity Timeline Component"
check_file "src/components/files/file-attachment-button.tsx" "File Attachment Button"
echo ""

echo "🔄 Checking Updated Components..."
check_file "src/components/community/activity-tab.tsx" "Activity Tab (Updated)"
check_file "src/hooks/use-module-data.ts" "Module Data Hook (Updated)"
echo ""

echo "🧪 Checking Mock Data..."
check_file "src/lib/mock-data/file-collaboration-mock.ts" "File Collaboration Mock Data"
echo ""

echo "📚 Checking Documentation..."
check_file "docs/COMMUNITY_FILE_COLLABORATION_OPTIMIZATION.md" "Complete Feature Guide"
check_file "docs/COMMUNITY_FILE_QUICK_REFERENCE.md" "Developer Quick Reference"
check_file "docs/COMMUNITY_FILE_ARCHITECTURE.md" "System Architecture"
check_file "docs/COMMUNITY_FILE_IMPLEMENTATION_CHECKLIST.md" "Implementation Checklist"
check_file "COMMUNITY_OPTIMIZATION_SUMMARY.md" "Executive Summary"
check_file "COMMUNITY_UI_IMPLEMENTATION_VERIFICATION.md" "UI Verification Report"
check_file "COMMUNITY_FILE_QUICK_START.md" "Quick Start Guide"
check_file "IMPLEMENTATION_COMPLETE_SUMMARY.md" "Implementation Summary"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Results:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All files present! Implementation verified!${NC}"
    echo ""
    echo "🚀 Next Steps:"
    echo "1. Run: supabase db push"
    echo "2. Test components with mock data"
    echo "3. Deploy to production"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Some files are missing. Please create them.${NC}"
    echo ""
    exit 1
fi
