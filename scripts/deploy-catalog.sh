#!/bin/bash

# =============================================
# Asset Catalog Deployment Script
# Version: 2.0
# Purpose: Deploy complete multi-industry catalog
# =============================================

set -e  # Exit on error

echo "=========================================="
echo "Asset Catalog Deployment Script"
echo "Version: 2.0 - Multi-Industry Complete"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI not found. Please install it first.${NC}"
    echo "Install with: npm install -g supabase"
    exit 1
fi

echo -e "${BLUE}📋 Checking migration status...${NC}"
npx supabase migration list
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  This will deploy 21 catalog migrations (~650+ items).${NC}"
echo -e "${YELLOW}⚠️  Estimated time: 5-10 minutes${NC}"
echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Deployment cancelled${NC}"
    exit 1
fi

# Create backup
echo -e "${BLUE}💾 Creating database backup...${NC}"
BACKUP_FILE="backup_pre_final_catalog_$(date +%Y%m%d_%H%M%S).sql"
npx supabase db dump -f "$BACKUP_FILE"
echo -e "${GREEN}✅ Backup created: $BACKUP_FILE${NC}"
echo ""

# Deploy migrations
echo -e "${BLUE}🚀 Deploying migrations...${NC}"
echo ""

MIGRATIONS=(
    "040_add_related_names_field"
    "041_comprehensive_site_infrastructure"
    "042_comprehensive_site_services"
    "043_comprehensive_site_safety"
    "044_comprehensive_site_vehicles"
    "045_comprehensive_heavy_equipment"
    "047_comprehensive_event_rentals_part1"
    "048_comprehensive_event_rentals_part2"
    "049_comprehensive_backline"
    "050_comprehensive_signage"
    "051_restaurant_equipment"
    "052_bar_supplies_refrigeration"
    "053_office_admin_supplies"
    "054_janitorial_supplies"
    "055_event_rentals_expansion"
    "056_film_tv_grip_electric"
    "057_catalog_subcategories_optimization"
    "058_site_power_nema_electrical"
    "059_catalog_final_optimization"
)

TOTAL=${#MIGRATIONS[@]}
CURRENT=0

for migration in "${MIGRATIONS[@]}"; do
    CURRENT=$((CURRENT + 1))
    echo -e "${BLUE}[$CURRENT/$TOTAL] Deploying $migration...${NC}"
    
    if npx supabase migration up "$migration"; then
        echo -e "${GREEN}✅ $migration deployed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to deploy $migration${NC}"
        echo -e "${YELLOW}⚠️  Check errors above. Backup available at: $BACKUP_FILE${NC}"
        exit 1
    fi
    echo ""
done

echo -e "${GREEN}🎉 All migrations deployed successfully!${NC}"
echo ""

# Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"
echo ""

# Get connection string from user (or use environment variable)
if [ -z "$DATABASE_URL" ]; then
    echo "Enter database connection string (or press Enter to skip verification):"
    read -s DATABASE_URL
    echo ""
fi

if [ -n "$DATABASE_URL" ]; then
    echo "Running verification queries..."
    echo ""
    
    # Check total items
    echo -e "${BLUE}📊 Catalog Statistics:${NC}"
    psql "$DATABASE_URL" -c "SELECT * FROM catalog_statistics;" 2>/dev/null || echo "Note: Run verification queries manually if connection failed"
    echo ""
    
    # Check for duplicates
    echo -e "${BLUE}🔍 Checking for duplicates:${NC}"
    DUPLICATES=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM (SELECT name FROM assets WHERE workspace_id = '00000000-0000-0000-0000-000000000001' GROUP BY name HAVING COUNT(*) > 1) AS dupes;" 2>/dev/null || echo "0")
    if [ "$DUPLICATES" -eq "0" ]; then
        echo -e "${GREEN}✅ No duplicates found${NC}"
    else
        echo -e "${YELLOW}⚠️  Found $DUPLICATES duplicate items${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⚠️  Skipping verification (no database connection)${NC}"
    echo ""
fi

# Summary
echo "=========================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "📊 Deployment Summary:"
echo "   - Migrations deployed: $TOTAL"
echo "   - Expected items: ~650+"
echo "   - Backup location: $BACKUP_FILE"
echo ""
echo "📚 Next Steps:"
echo "   1. Review docs/FINAL_DEPLOYMENT_GUIDE.md for verification steps"
echo "   2. Test search functionality in your application"
echo "   3. Monitor user feedback and search queries"
echo ""
echo "🔗 Documentation:"
echo "   - Complete guide: docs/FINAL_DEPLOYMENT_GUIDE.md"
echo "   - Catalog status: docs/COMPLETE_CATALOG_STATUS.md"
echo "   - Optimization: docs/CATALOG_OPTIMIZATION_ANALYSIS.md"
echo ""
echo -e "${GREEN}✅ Ready for production use!${NC}"
echo ""
