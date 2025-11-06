#!/bin/bash

# COMPREHENSIVE FULL-STACK ATOMIC WORKFLOW AUDIT EXECUTION SCRIPT
# This orchestrates the complete audit process across all phases

echo "🚀 INITIATING MISSION-CRITICAL FULL-STACK ATOMIC WORKFLOW AUDIT"
echo "================================================================"
echo ""

# Create audit output directory
AUDIT_DIR="docs/audits/COMPREHENSIVE_ATOMIC_AUDIT_$(date +%Y_%m_%d_%H%M)"
mkdir -p "$AUDIT_DIR"

echo "📁 Audit results will be saved to: $AUDIT_DIR"
echo ""

# Phase 1: Repository Structure Analysis
echo "📊 PHASE 1: Repository Structure Analysis"
echo "----------------------------------------"
node scripts/audit-phase1-repository-structure.js > "$AUDIT_DIR/phase1-repository-structure.json"
echo "✅ Phase 1 Complete"
echo ""

# Phase 2: Database Schema Analysis
echo "🗄️  PHASE 2: Database Schema Analysis"
echo "------------------------------------"
node scripts/audit-phase2-database-schema.js > "$AUDIT_DIR/phase2-database-schema.json"
echo "✅ Phase 2 Complete"
echo ""

# Phase 3: API Endpoints Audit
echo "🌐 PHASE 3: API Endpoints Audit"
echo "------------------------------"
node scripts/audit-phase3-api-endpoints.js > "$AUDIT_DIR/phase3-api-endpoints.json"
echo "✅ Phase 3 Complete"
echo ""

# Phase 4: Frontend Components Mapping
echo "🎨 PHASE 4: Frontend Components Mapping"
echo "--------------------------------------"
node scripts/audit-phase4-frontend-components.js > "$AUDIT_DIR/phase4-frontend-components.json"
echo "✅ Phase 4 Complete"
echo ""

# Phase 5: Role-Based Access Verification
echo "🔐 PHASE 5: Role-Based Access Verification"
echo "-----------------------------------------"
node scripts/audit-phase5-rbac-verification.js > "$AUDIT_DIR/phase5-rbac-verification.json"
echo "✅ Phase 5 Complete"
echo ""

# Phase 6: Documentation Cross-Validation
echo "📚 PHASE 6: Documentation Cross-Validation"
echo "-----------------------------------------"
node scripts/audit-phase6-documentation-validation.js > "$AUDIT_DIR/phase6-documentation-validation.json"
echo "✅ Phase 6 Complete"
echo ""

# Phase 7: Workflow Analysis
echo "🔄 PHASE 7: Workflow Analysis"
echo "----------------------------"
node scripts/audit-phase7-workflow-analysis.js > "$AUDIT_DIR/phase7-workflow-analysis.json"
echo "✅ Phase 7 Complete"
echo ""

# Phase 8: Gap Analysis & Severity Classification
echo "🔎 PHASE 8: Gap Analysis & Severity Classification"
echo "-------------------------------------------------"
node scripts/audit-phase8-gap-analysis.js > "$AUDIT_DIR/phase8-gap-analysis.json"
echo "✅ Phase 8 Complete"
echo ""

# Phase 9: Generate Comprehensive Reports
echo "📄 PHASE 9: Generating Comprehensive Reports"
echo "-------------------------------------------"
node scripts/audit-phase9-generate-reports.js "$AUDIT_DIR"
echo "✅ Phase 9 Complete"
echo ""

echo "================================================================"
echo "✅ COMPREHENSIVE AUDIT COMPLETE"
echo "================================================================"
echo ""
echo "📊 Results available in: $AUDIT_DIR"
echo ""
echo "Generated deliverables:"
echo "  - Executive Summary Report"
echo "  - Complete Workflow Inventory"
echo "  - Gap Analysis Matrix"
echo "  - Documentation Audit Report"
echo "  - Code-Level Findings"
echo "  - Architecture & Data Flow Maps"
echo "  - Remediation Roadmap"
echo ""
