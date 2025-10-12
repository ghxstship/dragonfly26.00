// =============================================
// LAYER 6: BUSINESS LOGIC - Event Service
// Event scheduling, conflict detection, notifications
// =============================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export class EventService {
  
  // Create event with conflict checking
  async createEvent(data: any) {
    // 1. Validate time range
    if (new Date(data.start_time) >= new Date(data.end_time)) {
      throw new Error('End time must be after start time')
    }

    // 2. Check for conflicts
    const conflicts = await this.checkConflicts({
      start_time: data.start_time,
      end_time: data.end_time,
      location_id: data.location_id
    })

    if (conflicts.length > 0) {
      const warning = {
        hasConflicts: true,
        conflicts: conflicts.map((c: any) => ({
          event: c.event_name,
          time: c.start_time
        }))
      }
      // Return warning but allow creation
      console.warn('Scheduling conflicts detected:', warning)
    }

    // 3. Create event
    const { data: event, error } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single()

    if (error) throw error

    // 4. Send invitations to attendees
    if (data.attendees && data.attendees.length > 0) {
      await this.sendEventInvitations(event.id, data.attendees)
    }

    // 5. Create run of show if needed
    if (data.type === 'performance' && data.create_run_of_show) {
      await this.initializeRunOfShow(event.id, data.workspace_id)
    }

    return event
  }

  // Check scheduling conflicts
  async checkConflicts(params: {
    start_time: string
    end_time: string
    location_id?: string
    exclude_event_id?: string
  }) {
    const { data } = await supabase
      .rpc('check_schedule_conflict', {
        p_start_time: params.start_time,
        p_end_time: params.end_time,
        p_location_id: params.location_id,
        p_exclude_event_id: params.exclude_event_id
      })

    return data || []
  }

  // Send event invitations
  private async sendEventInvitations(eventId: string, attendeeIds: string[]) {
    const { data: event } = await supabase
      .from('events')
      .select('name, start_time, location_details')
      .eq('id', eventId)
      .single()

    if (!event) return

    const notifications = attendeeIds.map(userId => ({
      user_id: userId,
      type: 'event_invitation',
      title: 'Event Invitation',
      message: `You're invited to ${event.name} on ${new Date(event.start_time).toLocaleDateString()}`,
      link: `/events/${eventId}`
    }))

    await supabase.from('notifications').insert(notifications)
  }

  // Initialize run of show template
  private async initializeRunOfShow(eventId: string, workspaceId: string) {
    const defaultCues = [
      { sequence: 1, action: 'House Opens', duration: '00:30:00' },
      { sequence: 2, action: 'Show Start', duration: '00:00:00' },
      { sequence: 3, action: 'Intermission', duration: '00:15:00' },
      { sequence: 4, action: 'Act 2 Start', duration: '00:00:00' },
      { sequence: 5, action: 'Show End', duration: '00:00:00' },
      { sequence: 6, action: 'House Closes', duration: '00:30:00' }
    ]

    const cues = defaultCues.map(cue => ({
      event_id: eventId,
      workspace_id: workspaceId,
      sequence_number: cue.sequence,
      action: cue.action,
      duration: cue.duration
    }))

    await supabase.from('run_of_show').insert(cues)
  }

  // Update event with recurrence
  async updateRecurringEvent(eventId: string, updates: any, updateFuture: boolean = false) {
    if (updateFuture) {
      // Get parent event
      const { data: event } = await supabase
        .from('events')
        .select('parent_event_id, start_time')
        .eq('id', eventId)
        .single()

      // Update this and all future occurrences
      await supabase
        .from('events')
        .update(updates)
        .or(`id.eq.${eventId},and(parent_event_id.eq.${event?.parent_event_id || eventId},start_time.gte.${event?.start_time})`)
    } else {
      // Update only this occurrence
      await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
    }
  }

  // Cancel event with notifications
  async cancelEvent(eventId: string, reason?: string) {
    // Update status
    const { data } = await supabase
      .from('events')
      .update({ status: 'cancelled' })
      .eq('id', eventId)
      .select('name, attendees')
      .single()

    if (!data) throw new Error('Event not found')

    // Notify all attendees
    if (data.attendees && data.attendees.length > 0) {
      const notifications = data.attendees.map((userId: string) => ({
        user_id: userId,
        type: 'event_cancelled',
        title: 'Event Cancelled',
        message: `${data.name} has been cancelled${reason ? `: ${reason}` : ''}`,
        link: `/events/${eventId}`
      }))

      await supabase.from('notifications').insert(notifications)
    }

    return data
  }
}

export const eventService = new EventService()
