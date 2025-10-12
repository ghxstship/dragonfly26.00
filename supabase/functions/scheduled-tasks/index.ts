// =============================================
// LAYER 4: EDGE FUNCTIONS - Scheduled Tasks
// Cron jobs for notifications, reminders, and maintenance
// =============================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role for admin access
    )

    const { task } = await req.json()

    let result
    switch (task) {
      case 'send_daily_reminders':
        result = await sendDailyReminders(supabaseClient)
        break
      case 'check_compliance_expiry':
        result = await checkComplianceExpiry(supabaseClient)
        break
      case 'generate_daily_reports':
        result = await generateDailyReports(supabaseClient)
        break
      case 'cleanup_old_data':
        result = await cleanupOldData(supabaseClient)
        break
      case 'update_production_health':
        result = await updateProductionHealth(supabaseClient)
        break
      default:
        throw new Error(`Unknown task: ${task}`)
    }

    return new Response(
      JSON.stringify({ success: true, task, result }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})

// Send daily reminders for upcoming tasks and events
async function sendDailyReminders(supabase: any) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  const dayAfter = new Date(tomorrow)
  dayAfter.setDate(dayAfter.getDate() + 1)

  // Find tasks due tomorrow
  const { data: tasks } = await supabase
    .from('project_tasks')
    .select('*, assignee:assignee_id(*), production:production_id(name)')
    .gte('due_date', tomorrow.toISOString())
    .lt('due_date', dayAfter.toISOString())
    .in('status', ['todo', 'in_progress'])

  // Find events happening tomorrow
  const { data: events } = await supabase
    .from('events')
    .select('*, organizer:organizer_id(*)')
    .gte('start_time', tomorrow.toISOString())
    .lt('start_time', dayAfter.toISOString())
    .eq('status', 'scheduled')

  // Create notifications
  const notifications = []
  
  for (const task of tasks || []) {
    if (task.assignee_id) {
      notifications.push({
        user_id: task.assignee_id,
        type: 'task_reminder',
        title: 'Task Due Tomorrow',
        message: `"${task.name}" is due tomorrow in ${task.production?.name}`,
        link: `/tasks/${task.id}`
      })
    }
  }

  for (const event of events || []) {
    if (event.organizer_id) {
      notifications.push({
        user_id: event.organizer_id,
        type: 'event_reminder',
        title: 'Event Tomorrow',
        message: `"${event.name}" starts tomorrow at ${new Date(event.start_time).toLocaleTimeString()}`,
        link: `/events/${event.id}`
      })
    }
    // Notify all attendees
    for (const attendeeId of event.attendees || []) {
      notifications.push({
        user_id: attendeeId,
        type: 'event_reminder',
        title: 'Event Tomorrow',
        message: `"${event.name}" tomorrow at ${new Date(event.start_time).toLocaleTimeString()}`,
        link: `/events/${event.id}`
      })
    }
  }

  if (notifications.length > 0) {
    await supabase.from('notifications').insert(notifications)
  }

  return { tasks: tasks?.length || 0, events: events?.length || 0, notifications: notifications.length }
}

// Check for expiring compliance items
async function checkComplianceExpiry(supabase: any) {
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const { data: expiringCompliance } = await supabase
    .from('project_compliance')
    .select('*, production:production_id(name, project_manager_id)')
    .lte('expiry_date', thirtyDaysFromNow.toISOString())
    .in('status', ['approved', 'pending'])

  const notifications = (expiringCompliance || []).map(item => ({
    user_id: item.production.project_manager_id,
    type: 'compliance_expiry',
    title: 'Compliance Item Expiring Soon',
    message: `${item.type} "${item.name}" expires on ${new Date(item.expiry_date).toLocaleDateString()}`,
    link: `/compliance/${item.id}`
  }))

  if (notifications.length > 0) {
    await supabase.from('notifications').insert(notifications)
  }

  return { expiring: expiringCompliance?.length || 0 }
}

// Generate and cache daily reports
async function generateDailyReports(supabase: any) {
  // Get all active workspaces
  const { data: workspaces } = await supabase
    .from('workspaces')
    .select('id, name, organization_id')

  const reports = []
  for (const workspace of workspaces || []) {
    // Call the dashboard stats function
    const { data: stats } = await supabase
      .rpc('get_workspace_dashboard', { p_workspace_id: workspace.id })

    reports.push({
      workspace_id: workspace.id,
      report_type: 'daily_summary',
      data: stats,
      generated_at: new Date().toISOString()
    })
  }

  // Store in generated_reports table if it exists
  // For now, just return the count
  return { reports_generated: reports.length }
}

// Cleanup old data (soft deletes, old logs, etc.)
async function cleanupOldData(supabase: any) {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  // Archive old activities
  const { count: activitiesArchived } = await supabase
    .from('activities')
    .delete()
    .lt('created_at', sixMonthsAgo.toISOString())

  // Delete old notifications
  const { count: notificationsDeleted } = await supabase
    .from('notifications')
    .delete()
    .eq('read', true)
    .lt('created_at', sixMonthsAgo.toISOString())

  return { activitiesArchived, notificationsDeleted }
}

// Update production health scores
async function updateProductionHealth(supabase: any) {
  const { data: productions } = await supabase
    .from('productions')
    .select('id')
    .in('status', ['active', 'planning'])

  let updated = 0
  for (const production of productions || []) {
    const { data: health } = await supabase
      .rpc('calculate_production_health', { p_production_id: production.id })
    
    if (health) {
      await supabase
        .from('productions')
        .update({ health })
        .eq('id', production.id)
      updated++
    }
  }

  return { productions_updated: updated }
}
