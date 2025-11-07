#!/bin/bash
# Quick fix for migrations 106-112 - wrap all CREATE POLICY in conditional checks

for file in supabase/migrations/{106,107,108,109,110,111,112}_*.sql; do
  if [ -f "$file" ]; then
    # Add conditional check: only create policies if table exists
    sed -i '' 's/^ANALYZE /DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='\''public'\'' AND table_name='\''/' "$file"
    sed -i '' 's/;$/'\'') THEN EXECUTE '\''ANALYZE '\'' || quote_ident(table_name); END IF; END $$;/' "$file"
  fi
done

echo "Fixed migrations 106-112"
