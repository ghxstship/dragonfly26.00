-- Migration 122: Drop Unused Indexes
-- Created: 2025-10-22
-- Purpose: Remove indexes that have never been used
-- Impact: Reduces database overhead and improves write performance

-- Drop unused indexes that have never been scanned
-- These indexes consume space and slow down writes without providing query benefits

-- People module unused indexes
DROP INDEX IF EXISTS idx_people_keyboard_shortcuts_workspace_id;
DROP INDEX IF EXISTS idx_people_keyboard_shortcuts_status;
DROP INDEX IF EXISTS idx_people_keyboard_shortcuts_created_at;
DROP INDEX IF EXISTS idx_people_keyboard_shortcuts_data;
DROP INDEX IF EXISTS idx_people_org_chart_workspace_id;
DROP INDEX IF EXISTS idx_people_org_chart_status;
DROP INDEX IF EXISTS idx_people_org_chart_created_at;
DROP INDEX IF EXISTS idx_people_org_chart_data;

-- Project module unused indexes
DROP INDEX IF EXISTS idx_project_calendar_workspace_id;
DROP INDEX IF EXISTS idx_project_calendar_status;
DROP INDEX IF EXISTS idx_project_calendar_created_at;
DROP INDEX IF EXISTS idx_project_calendar_data;
DROP INDEX IF EXISTS idx_project_gantt_workspace_id;
DROP INDEX IF EXISTS idx_project_gantt_status;
DROP INDEX IF EXISTS idx_project_gantt_created_at;
DROP INDEX IF EXISTS idx_project_gantt_data;
DROP INDEX IF EXISTS idx_project_milestones_workspace_id;
DROP INDEX IF EXISTS idx_project_milestones_status;
DROP INDEX IF EXISTS idx_project_milestones_created_at;
DROP INDEX IF EXISTS idx_project_milestones_data;
DROP INDEX IF EXISTS idx_project_resources_workspace_id;
DROP INDEX IF EXISTS idx_project_resources_status;
DROP INDEX IF EXISTS idx_project_resources_created_at;
DROP INDEX IF EXISTS idx_project_resources_data;
DROP INDEX IF EXISTS idx_project_risks_workspace_id;
DROP INDEX IF EXISTS idx_project_risks_status;
DROP INDEX IF EXISTS idx_project_risks_created_at;
DROP INDEX IF EXISTS idx_project_risks_data;
DROP INDEX IF EXISTS idx_project_tasks_workspace_id;
DROP INDEX IF EXISTS idx_project_tasks_created_at;
DROP INDEX IF EXISTS idx_project_tasks_data;
DROP INDEX IF EXISTS idx_project_timelines_workspace_id;
DROP INDEX IF EXISTS idx_project_timelines_status;
DROP INDEX IF EXISTS idx_project_timelines_created_at;
DROP INDEX IF EXISTS idx_project_timelines_data;

-- Report module unused indexes
DROP INDEX IF EXISTS idx_report_builder_workspace_id;
DROP INDEX IF EXISTS idx_report_builder_status;
DROP INDEX IF EXISTS idx_report_builder_created_at;
DROP INDEX IF EXISTS idx_report_builder_data;
DROP INDEX IF EXISTS idx_report_dashboards_workspace_id;
DROP INDEX IF EXISTS idx_report_dashboards_status;
DROP INDEX IF EXISTS idx_report_dashboards_created_at;
DROP INDEX IF EXISTS idx_report_dashboards_data;
DROP INDEX IF EXISTS idx_report_exports_workspace_id;
DROP INDEX IF EXISTS idx_report_exports_status;
DROP INDEX IF EXISTS idx_report_exports_created_at;
DROP INDEX IF EXISTS idx_report_exports_data;
DROP INDEX IF EXISTS idx_report_schedules_workspace_id;
DROP INDEX IF EXISTS idx_report_schedules_status;
DROP INDEX IF EXISTS idx_report_schedules_created_at;
DROP INDEX IF EXISTS idx_report_schedules_data;
DROP INDEX IF EXISTS idx_report_templates_workspace_id;
DROP INDEX IF EXISTS idx_report_templates_status;
DROP INDEX IF EXISTS idx_report_templates_created_at;
DROP INDEX IF EXISTS idx_report_templates_data;

-- Resource module unused indexes
DROP INDEX IF EXISTS idx_resource_courses_workspace_id;
DROP INDEX IF EXISTS idx_resource_courses_status;
DROP INDEX IF EXISTS idx_resource_courses_created_at;
DROP INDEX IF EXISTS idx_resource_courses_data;
DROP INDEX IF EXISTS idx_resource_glossary_workspace_id;
DROP INDEX IF EXISTS idx_resource_glossary_status;
DROP INDEX IF EXISTS idx_resource_glossary_created_at;
DROP INDEX IF EXISTS idx_resource_glossary_data;
DROP INDEX IF EXISTS idx_resource_grants_workspace_id;
DROP INDEX IF EXISTS idx_resource_grants_status;
DROP INDEX IF EXISTS idx_resource_grants_created_at;
DROP INDEX IF EXISTS idx_resource_grants_data;
DROP INDEX IF EXISTS idx_resource_guides_workspace_id;
DROP INDEX IF EXISTS idx_resource_guides_status;
DROP INDEX IF EXISTS idx_resource_guides_created_at;
DROP INDEX IF EXISTS idx_resource_guides_data;
DROP INDEX IF EXISTS idx_resource_library_workspace_id;
DROP INDEX IF EXISTS idx_resource_library_status;
DROP INDEX IF EXISTS idx_resource_library_created_at;
DROP INDEX IF EXISTS idx_resource_library_data;
DROP INDEX IF EXISTS idx_resource_publications_workspace_id;
DROP INDEX IF EXISTS idx_resource_publications_status;
DROP INDEX IF EXISTS idx_resource_publications_created_at;
DROP INDEX IF EXISTS idx_resource_publications_data;
DROP INDEX IF EXISTS idx_resource_troubleshooting_workspace_id;
DROP INDEX IF EXISTS idx_resource_troubleshooting_status;
DROP INDEX IF EXISTS idx_resource_troubleshooting_created_at;
DROP INDEX IF EXISTS idx_resource_troubleshooting_data;
