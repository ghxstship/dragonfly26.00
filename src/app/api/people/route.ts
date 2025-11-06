import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreatePersonSchema = z.object({
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  title: z.string().max(200).optional(),
  department: z.string().max(100).optional(),
  workspace_id: z.string().uuid(),
  employment_type: z.enum(['full_time', 'part_time', 'contractor', 'volunteer']).optional(),
  start_date: z.string().optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).default('active'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdatePersonSchema = CreatePersonSchema.partial().omit({ workspace_id: true });

// GET - Personnel directory
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    if (personId) {
      // Retrieve single person
      const { data, error } = await supabase
        .from('personnel')
        .select(`
          *,
          workspace:workspaces(id, name),
          assignments:personnel_assignments(*)
        `)
        .eq('id', personId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List personnel with filters
      let query = supabase
        .from('personnel')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('last_name', { ascending: true });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (department) {
        query = query.eq('department', department);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (search) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Add person
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreatePersonSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canAddPerson = permissions?.some((p: string) => 
      ['task.create', 'task.assign'].includes(p)
    );
    
    if (!canAddPerson) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to add personnel' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('personnel')
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

// PUT - Update person
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('id');
    
    if (!personId) {
      return NextResponse.json({ error: 'Person ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdatePersonSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdatePerson = permissions?.some((p: string) => 
      ['task.update', 'task.assign'].includes(p)
    );
    
    if (!canUpdatePerson) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update personnel' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('personnel')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', personId)
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

// DELETE - Remove person
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const personId = searchParams.get('id');
    
    if (!personId) {
      return NextResponse.json({ error: 'Person ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeletePerson = permissions?.some((p: string) => 
      ['task.delete'].includes(p)
    );
    
    if (!canDeletePerson) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to remove personnel' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('personnel')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', personId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
