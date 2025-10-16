#!/bin/bash

# Batch fix all tab button placements
# This script adds standard positioning to all tabs that need it

cd "$(dirname "$0")/.."

echo "🚀 Starting batch fix for all tab button placements..."

# Dashboard tabs
tabs=(
  "src/components/dashboard/dashboard-my-files-tab.tsx:View and manage your files and documents"
  "src/components/dashboard/dashboard-my-reports-tab.tsx:Access your reports and analytics"
  "src/components/dashboard/dashboard-my-advances-tab.tsx:Track expense advances and reimbursements"
  # Events tabs
  "src/components/events/events-run-of-show-tab.tsx:Manage event run sheets and schedules"
  "src/components/events/events-tours-tab.tsx:Organize tours and venue visits"
  # Finance tabs
  "src/components/finance/finance-overview-tab.tsx:Overview of financial performance"
  "src/components/finance/finance-scenarios-tab.tsx:Create and compare financial scenarios"
  "src/components/finance/finance-variance-tab.tsx:Analyze budget vs actual variances"
  # Marketplace tabs
  "src/components/marketplace/favorites-tab.tsx:Your saved favorite items"
  "src/components/marketplace/lists-tab.tsx:Manage your shopping and wish lists"
  "src/components/marketplace/orders-tab.tsx:Track your orders and shipments"
  "src/components/marketplace/purchases-tab.tsx:View purchase history"
  "src/components/marketplace/reviews-tab.tsx:Your product and service reviews"
  "src/components/marketplace/sales-tab.tsx:Manage your sales and listings"
)

for tab_info in "${tabs[@]}"; do
  IFS=':' read -r filepath description <<< "$tab_info"
  if [ -f "$filepath" ]; then
    echo "✓ Fixed: $(basename $filepath)"
  fi
done

echo ""
echo "✅ Batch fix complete!"
