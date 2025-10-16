#!/bin/bash

# Intelligence Hub Complete i18n Remediation Script
# This script will process all 29 Intelligence Hub tab files

echo "========================================================================"
echo "INTELLIGENCE HUB COMPLETE i18n REMEDIATION"
echo "========================================================================"
echo ""
echo "Processing 29 files across Analytics, Reports, and Insights modules..."
echo ""

# Set the base directory
BASE_DIR="/Users/julianclarkson/Documents/Dragonfly26.00"
cd "$BASE_DIR" || exit 1

# Counter for tracking
TOTAL_FILES=0
SUCCESS_COUNT=0

# Function to process each file
process_file() {
    local file=$1
    echo "Processing: $file"
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Use Node.js to process the file
    node scripts/process-intelligence-file.js "$file"
    
    if [ $? -eq 0 ]; then
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        echo "  ✓ Success"
    else
        echo "  ✗ Failed"
    fi
    echo ""
}

# Process all Analytics files
echo "=== ANALYTICS MODULE ==="
for file in src/components/analytics/*-tab.tsx; do
    if [ "$file" != "src/components/analytics/analytics-comparisons-tab.tsx" ]; then
        process_file "$file"
    fi
done

# Process all Reports files
echo "=== REPORTS MODULE ==="
for file in src/components/reports/*-tab.tsx; do
    process_file "$file"
done

# Process all Insights files
echo "=== INSIGHTS MODULE ==="
for file in src/components/insights/*-tab.tsx; do
    process_file "$file"
done

echo "========================================================================"
echo "REMEDIATION COMPLETE"
echo "========================================================================"
echo "Files processed: $TOTAL_FILES"
echo "Successful: $SUCCESS_COUNT"
echo "Failed: $((TOTAL_FILES - SUCCESS_COUNT))"
echo ""
echo "Running verification..."
node scripts/audit-intelligence-hub-i18n.js
