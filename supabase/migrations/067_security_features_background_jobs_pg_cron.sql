-- Enable pg_cron extension for background job scheduling
-- This allows automated tasks like cleanup, notifications, analytics aggregation, etc.

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- ============================================================================
-- SCHEDULED JOBS
-- ============================================================================

-- Job 1: Clean up expired invitations (runs daily at 2 AM UTC)
SELECT cron.schedule(
  'cleanup-expired-invitations',
  '0 2 * * *', -- Every day at 2 AM
  $$
  DELETE FROM invitations 
  WHERE status = 'pending' 
  AND expires_at < NOW();
  $$
);

-- Job 2: Clean up old audit logs (runs weekly on Sunday at 3 AM UTC)
-- Keeps last 90 days of audit logs
SELECT cron.schedule(
  'cleanup-old-audit-logs',
  '0 3 * * 0', -- Every Sunday at 3 AM
  $$
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '90 days';
  $$
);

-- Job 3: Update materialized views (runs every 6 hours)
-- Refreshes hierarchy rollup for better query performance
SELECT cron.schedule(
  'refresh-hierarchy-rollup',
  '0 */6 * * *', -- Every 6 hours
  $$
  REFRESH MATERIALIZED VIEW CONCURRENTLY hierarchy_rollup;
  $$
);

-- Job 4: Clean up expired sessions (runs every hour)
SELECT cron.schedule(
  'cleanup-expired-sessions',
  '0 * * * *', -- Every hour
  $$
  DELETE FROM auth.sessions 
  WHERE expires_at < NOW();
  $$
);

-- Job 5: Aggregate daily analytics (runs daily at 1 AM UTC)
-- Creates daily snapshots for faster reporting
SELECT cron.schedule(
  'aggregate-daily-analytics',
  '0 1 * * *', -- Every day at 1 AM
  $$
  INSERT INTO analytics_daily_snapshots (date, metric_type, metric_value, metadata)
  SELECT 
    CURRENT_DATE - INTERVAL '1 day' as date,
    'active_users' as metric_type,
    COUNT(DISTINCT user_id) as metric_value,
    jsonb_build_object('source', 'pg_cron') as metadata
  FROM audit_logs
  WHERE created_at >= CURRENT_DATE - INTERVAL '1 day'
  AND created_at < CURRENT_DATE
  ON CONFLICT (date, metric_type) DO UPDATE
  SET metric_value = EXCLUDED.metric_value,
      updated_at = NOW();
  $$
);

-- Job 6: Send reminder notifications for upcoming events (runs every 4 hours)
-- This would trigger a webhook or edge function to send actual notifications
SELECT cron.schedule(
  'event-reminders',
  '0 */4 * * *', -- Every 4 hours
  $$
  -- Mark events that need reminders
  UPDATE events
  SET metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{reminder_sent}',
    'true'::jsonb
  )
  WHERE start_date BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
  AND (metadata->>'reminder_sent' IS NULL OR metadata->>'reminder_sent' = 'false')
  AND status = 'scheduled';
  $$
);

-- Job 7: Archive completed projects (runs weekly on Monday at 4 AM UTC)
SELECT cron.schedule(
  'archive-completed-projects',
  '0 4 * * 1', -- Every Monday at 4 AM
  $$
  UPDATE projects
  SET status = 'archived',
      metadata = jsonb_set(
        COALESCE(metadata, '{}'::jsonb),
        '{archived_at}',
        to_jsonb(NOW())
      )
  WHERE status = 'completed'
  AND updated_at < NOW() - INTERVAL '90 days';
  $$
);

-- ============================================================================
-- HELPER FUNCTIONS FOR JOB MANAGEMENT
-- ============================================================================

-- Function to list all scheduled jobs
CREATE OR REPLACE FUNCTION get_scheduled_jobs()
RETURNS TABLE (
  jobid bigint,
  schedule text,
  command text,
  nodename text,
  nodeport integer,
  database text,
  username text,
  active boolean,
  jobname text
) 
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM cron.job ORDER BY jobname;
$$;

-- Function to manually trigger a job by name
CREATE OR REPLACE FUNCTION trigger_job(job_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  job_command text;
BEGIN
  -- Get the job command
  SELECT command INTO job_command
  FROM cron.job
  WHERE jobname = job_name;
  
  IF job_command IS NULL THEN
    RAISE EXCEPTION 'Job % not found', job_name;
  END IF;
  
  -- Execute the command
  EXECUTE job_command;
END;
$$;

-- Function to get job execution history
CREATE OR REPLACE FUNCTION get_job_history(job_name text DEFAULT NULL, limit_rows int DEFAULT 100)
RETURNS TABLE (
  jobid bigint,
  runid bigint,
  job_pid integer,
  database text,
  username text,
  command text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    jr.jobid,
    jr.runid,
    jr.job_pid,
    jr.database,
    jr.username,
    jr.command,
    jr.status,
    jr.return_message,
    jr.start_time,
    jr.end_time
  FROM cron.job_run_details jr
  LEFT JOIN cron.job j ON jr.jobid = j.jobid
  WHERE job_name IS NULL OR j.jobname = job_name
  ORDER BY jr.start_time DESC
  LIMIT limit_rows;
$$;

-- ============================================================================
-- ANALYTICS DAILY SNAPSHOTS TABLE
-- ============================================================================

-- Create table for daily analytics snapshots (if not exists)
CREATE TABLE IF NOT EXISTS analytics_daily_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, metric_type)
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_daily_snapshots(date DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_type ON analytics_daily_snapshots(metric_type);

-- Enable RLS
ALTER TABLE analytics_daily_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can read all analytics
CREATE POLICY "Admins can read analytics snapshots"
  ON analytics_daily_snapshots
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_role_assignments ura
      JOIN roles r ON ura.role_id = r.id
      WHERE ura.user_id = auth.uid()
      AND r.slug IN ('legend', 'phantom', 'aviator')
      AND ura.is_active = true
      AND (ura.valid_until IS NULL OR ura.valid_until > NOW())
    )
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL - enables background tasks';
COMMENT ON FUNCTION get_scheduled_jobs() IS 'List all scheduled cron jobs';
COMMENT ON FUNCTION trigger_job(text) IS 'Manually trigger a scheduled job by name';
COMMENT ON FUNCTION get_job_history(text, int) IS 'Get execution history for jobs';
COMMENT ON TABLE analytics_daily_snapshots IS 'Daily aggregated analytics for faster reporting';
