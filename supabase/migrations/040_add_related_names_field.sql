-- =============================================
-- ADD RELATED NAMES FIELD TO ASSETS
-- Migration: 040
-- Purpose: Separate searchable alternative names from descriptions
-- =============================================

-- Add related_names field for alternative/searchable names
ALTER TABLE assets ADD COLUMN IF NOT EXISTS related_names TEXT[] DEFAULT '{}';

-- Create GIN index for efficient array searching
CREATE INDEX IF NOT EXISTS idx_assets_related_names_gin ON assets USING gin (related_names);

-- Create trigram index for fuzzy searching on related names
CREATE INDEX IF NOT EXISTS idx_assets_related_names_trgm ON assets USING gin (
    array_to_string(related_names, ' ') gin_trgm_ops
);

-- Update existing assets to extract related names from descriptions
UPDATE assets
SET related_names = (
    SELECT ARRAY(
        SELECT TRIM(unnest(string_to_array(
            COALESCE(
                substring(description FROM 'Also: ([^.]+)'),
                substring(description FROM 'Alt: ([^.]+)')
            ), ','
        )))
    )
)
WHERE description LIKE '%Also:%' OR description LIKE '%Alt:%';

-- Clean up descriptions by removing "Also:" and "Alt:" sections
UPDATE assets
SET description = TRIM(regexp_replace(description, '\s*(Also|Alt):[^.]+\.?\s*', '', 'gi'))
WHERE description LIKE '%Also:%' OR description LIKE '%Alt:%';

-- Add comment
COMMENT ON COLUMN assets.related_names IS 'Alternative names, nicknames, and industry terms for fuzzy search - not displayed as primary name';

-- Create helper function for comprehensive asset search
CREATE OR REPLACE FUNCTION search_assets(
    search_query TEXT,
    category_filter TEXT DEFAULT NULL,
    workspace_filter UUID DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    asset_category TEXT,
    manufacturer TEXT,
    model_number TEXT,
    relevance FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.description,
        a.asset_category,
        a.manufacturer,
        a.model_number,
        GREATEST(
            similarity(a.name, search_query) * 3.0,  -- Primary name weight highest
            similarity(array_to_string(a.related_names, ' '), search_query) * 2.0,  -- Related names second
            similarity(a.description, search_query) * 1.0,  -- Description lowest
            similarity(array_to_string(a.tags, ' '), search_query) * 1.5  -- Tags medium
        ) as relevance
    FROM assets a
    WHERE 
        (workspace_filter IS NULL OR a.workspace_id = workspace_filter)
        AND (category_filter IS NULL OR a.asset_category = category_filter)
        AND (
            a.name % search_query
            OR array_to_string(a.related_names, ' ') % search_query
            OR a.description % search_query
            OR array_to_string(a.tags, ' ') % search_query
        )
    ORDER BY relevance DESC
    LIMIT 50;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION search_assets IS 'Comprehensive fuzzy search across asset names, related names, descriptions, and tags with weighted relevance scoring';
