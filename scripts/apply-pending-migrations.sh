#!/bin/bash

# APPLY PENDING MIGRATIONS TO REMOTE SUPABASE
# Uses npx to apply all pending migrations without requiring global installation

set -e  # Exit on error

echo "🚀 APPLYING PENDING MIGRATIONS TO REMOTE SUPABASE"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env or .env.local exists
if [ ! -f .env ] && [ ! -f .env.local ]; then
    echo -e "${RED}❌ Error: .env or .env.local file not found${NC}"
    echo "Please create one with your Supabase credentials"
    exit 1
fi

# Extract project ref from NEXT_PUBLIC_SUPABASE_URL
if [ -f .env.local ]; then
    source .env.local
elif [ -f .env ]; then
    source .env
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "${RED}❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in environment${NC}"
    exit 1
fi

PROJECT_REF=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -n 's/.*https:\/\/\([^.]*\)\.supabase\.co.*/\1/p')

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}❌ Error: Could not extract project reference from Supabase URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Project Reference: $PROJECT_REF${NC}"
echo ""

# Check if already linked
if [ ! -f .git/supabase-project-ref ]; then
    echo "🔗 Linking to Supabase project..."
    npx supabase link --project-ref $PROJECT_REF
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to link to Supabase project${NC}"
        echo "You may need to authenticate first:"
        echo "  npx supabase login"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Successfully linked to project${NC}"
    echo ""
else
    echo -e "${GREEN}✅ Already linked to Supabase project${NC}"
    echo ""
fi

# Show pending migrations
echo "📋 Checking for pending migrations..."
node scripts/check-remote-migrations.js
echo ""

# Confirm before pushing
echo -e "${YELLOW}⚠️  WARNING: This will apply 37 pending migrations to your remote database${NC}"
echo ""
read -p "Do you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted by user"
    exit 0
fi

echo ""
echo "🚀 Pushing migrations to remote database..."
echo ""

npx supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SUCCESS! All migrations applied${NC}"
    echo ""
    echo "📊 Verifying database state..."
    npx supabase db diff
    echo ""
    echo "🎉 Your remote database is now in sync!"
    echo ""
    echo "Next steps:"
    echo "  1. Run workflow audit: node scripts/comprehensive-workflow-audit.js"
    echo "  2. Test your application against the remote database"
    echo "  3. Deploy to production"
else
    echo ""
    echo -e "${RED}❌ FAILED: Error applying migrations${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check the error message above"
    echo "  2. Verify your database credentials"
    echo "  3. Check for conflicting migrations"
    echo "  4. Try applying migrations manually via Supabase Dashboard"
    exit 1
fi
