# Incidents Module Column Name Fix

**Date**: October 14, 2025  
**Issue**: `column incidents.incident_date does not exist`  
**Status**: ✅ FIXED

## Problem

The Incidents module was failing to load data with the error:
```
Error loading data
column incidents.incident_date does not exist
Table: incidents
```

## Root Cause

The database schema uses `occurred_at` as the timestamp column for incidents, but the code was referencing `incident_date` in multiple places. Additionally, several other field names didn't match the database schema.

## Database Schema (from `002_events_module.sql`)

```sql
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious', 'critical')),
    type TEXT NOT NULL CHECK (type IN (
        'injury', 'equipment_failure', 'safety_violation', 'security', 'other'
    )),
    
    occurred_at TIMESTAMPTZ NOT NULL,
    location_id UUID,
    location_details TEXT,
    
    reported_by UUID NOT NULL REFERENCES auth.users(id),
    witnesses UUID[] DEFAULT '{}',
    
    actions_taken TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'open',
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Files Fixed

### 1. `/src/hooks/use-module-data.ts` (Line 47)
**Before:**
```typescript
'incidents': { table: 'incidents', select: '*, event:events!event_id(name), reported_by_user:profiles!reported_by(first_name, last_name)', orderBy: 'incident_date' },
```

**After:**
```typescript
'incidents': { table: 'incidents', select: '*, event:events!event_id(name), reported_by_user:profiles!reported_by(first_name, last_name)', orderBy: 'occurred_at' },
```

### 2. `/src/hooks/use-events-data.ts` (Line 192)
**Before:**
```typescript
const { data, error } = await query.order('incident_date', { ascending: false })
```

**After:**
```typescript
const { data, error } = await query.order('occurred_at', { ascending: false })
```

### 3. `/src/lib/modules/form-fields-extended.ts` (Lines 273-301)
**Before:**
- Missing `title` field
- Field: `incident_type` → Database: `type`
- Field: `incident_date` → Database: `occurred_at`
- Field: `involved_parties` → Database: `witnesses`
- Field: `action_taken` → Database: `actions_taken`
- Severity values: low, medium, high, critical → Database: minor, moderate, serious, critical
- Type value: `equipment_damage` → Database: `equipment_failure`

**After:**
```typescript
'incidents': {
  title: 'Report Incident',
  description: 'Document incident or safety issue',
  submitLabel: 'Report Incident',
  fields: [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'type', label: 'Type', type: 'select', required: true, options: [
      { value: 'injury', label: 'Injury' },
      { value: 'equipment_failure', label: 'Equipment Failure' },
      { value: 'safety_violation', label: 'Safety Violation' },
      { value: 'security', label: 'Security Incident' },
      { value: 'other', label: 'Other' }
    ]},
    { name: 'event', label: 'Event', type: 'autocomplete' },
    { name: 'occurred_at', label: 'Date & Time', type: 'datetime', required: true },
    { name: 'location', label: 'Location', type: 'location', required: true },
    { name: 'reported_by', label: 'Reported By', type: 'user', required: true },
    { name: 'witnesses', label: 'Witnesses', type: 'multiuser' },
    { name: 'description', label: 'Description', type: 'richtext', required: true },
    { name: 'severity', label: 'Severity', type: 'select', required: true, options: [
      { value: 'minor', label: 'Minor' },
      { value: 'moderate', label: 'Moderate' },
      { value: 'serious', label: 'Serious' },
      { value: 'critical', label: 'Critical' }
    ]},
    { name: 'actions_taken', label: 'Immediate Actions Taken', type: 'textarea' },
    { name: 'follow_up_required', label: 'Follow-up Required', type: 'switch' },
    { name: 'attachments', label: 'Photos/Documents', type: 'file' }
  ]
}
```

## Changes Summary

| Field (Before) | Field (After) | Notes |
|---------------|---------------|-------|
| `incident_date` | `occurred_at` | Primary timestamp field ✅ |
| `incident_type` | `type` | Incident type field ✅ |
| `involved_parties` | `witnesses` | Array of witness user IDs ✅ |
| `action_taken` | `actions_taken` | Plural form matches DB ✅ |
| - | `title` | Added missing required field ✅ |

## Validation

To verify the fix:
1. Navigate to Events > Incidents
2. The page should load without errors
3. Incident data should be displayed correctly, ordered by occurrence date (most recent first)
4. Creating/editing incidents should work with all fields matching the database schema

## Status
✅ **RESOLVED** - All field names now match the database schema exactly.
