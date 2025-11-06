import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateEventSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  event_type: z.enum(['meeting', 'deadline', 'milestone', 'task', 'other']),
  start_date: z.string(),
  end_date: z.string().optional(),
  location: z.string().optional(),
  workspace_id: z.string().uuid(),
  assigned_to: z.array(z.string().uuid()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).default('scheduled'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateEventSchema = CreateEventSchema.partial().omit({ workspace_id: true });

// GET - List events with filters
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const eventType = searchParams.get('event_type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    if (eventId) {
      // Retrieve single event
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          workspace:workspaces(id, name),
          created_by_user:profiles!events_created_by_fkey(id, full_name)
        `)
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List events with filters
      let query = supabase
        .from('events')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('start_date', { ascending: true });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (eventType) {
        query = query.eq('event_type', eventType);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (startDate) {
        query = query.gte('start_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('end_date', endDate);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateEventSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateEvent = permissions?.some((p: string) => 
      ['task.create', 'task.create.own'].includes(p)
    );
    
    if (!canCreateEvent) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to create events' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...validated,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT - Update event
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateEventSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateEvent = permissions?.some((p: string) => 
      ['task.update', 'task.update.own', 'task.update.assigned'].includes(p)
    );
    
    if (!canUpdateEvent) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update event' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('events')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE - Cancel event
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('id');
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteEvent = permissions?.some((p: string) => 
      ['task.delete', 'task.delete.own'].includes(p)
    );
    
    if (!canDeleteEvent) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to delete event' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('events')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', eventId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
