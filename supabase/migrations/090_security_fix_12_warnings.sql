-- Migration 115: Fix Final 12 Auth RLS Warnings
-- Created: 2025-10-21
-- Purpose: Fix the 3 tables that still have old separate policies
-- Impact: Resolves final 15 warnings (12 auth + 3 duplicate)

-- People keyboard shortcuts - drop old policies and create consolidated one
DROP POLICY IF EXISTS "Users can view people_keyboard_shortcuts in their workspace" ON people_keyboard_shortcuts;
DROP POLICY IF EXISTS "Users can insert people_keyboard_shortcuts in their workspace" ON people_keyboard_shortcuts;
DROP POLICY IF EXISTS "Users can update people_keyboard_shortcuts in their workspace" ON people_keyboard_shortcuts;
DROP POLICY IF EXISTS "Users can delete people_keyboard_shortcuts in their workspace" ON people_keyboard_shortcuts;
DROP POLICY IF EXISTS "Users can manage people_keyboard_shortcuts in their workspace" ON people_keyboard_shortcuts;

CREATE POLICY "people_keyboard_shortcuts_workspace_access" ON people_keyboard_shortcuts
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = (SELECT auth.uid())
    )
    AND deleted_at IS NULL
  );

-- People org chart - drop old policies and create consolidated one
DROP POLICY IF EXISTS "Users can view people_org_chart in their workspace" ON people_org_chart;
DROP POLICY IF EXISTS "Users can insert people_org_chart in their workspace" ON people_org_chart;
DROP POLICY IF EXISTS "Users can update people_org_chart in their workspace" ON people_org_chart;
DROP POLICY IF EXISTS "Users can delete people_org_chart in their workspace" ON people_org_chart;
DROP POLICY IF EXISTS "Users can manage people_org_chart in their workspace" ON people_org_chart;

CREATE POLICY "people_org_chart_workspace_access" ON people_org_chart
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = (SELECT auth.uid())
    )
    AND deleted_at IS NULL
  );

-- Project calendar - drop old policies and create consolidated one
DROP POLICY IF EXISTS "Users can view project_calendar in their workspace" ON project_calendar;
DROP POLICY IF EXISTS "Users can insert project_calendar in their workspace" ON project_calendar;
DROP POLICY IF EXISTS "Users can update project_calendar in their workspace" ON project_calendar;
DROP POLICY IF EXISTS "Users can delete project_calendar in their workspace" ON project_calendar;
DROP POLICY IF EXISTS "Users can manage project_calendar in their workspace" ON project_calendar;

CREATE POLICY "project_calendar_workspace_access" ON project_calendar
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = (SELECT auth.uid())
    )
    AND deleted_at IS NULL
  );
