import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  organization_id: z.string().uuid(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  status: z.enum(['planning', 'active', 'on_hold', 'completed', 'cancelled']).default('planning'),
  budget: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateProjectSchema = CreateProjectSchema.partial().omit({ organization_id: true });

// GET - List projects with hierarchy
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    const organizationId = searchParams.get('organization_id');
    const status = searchParams.get('status');
    
    if (projectId) {
      // Retrieve single project with hierarchy
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          organization:organizations(id, name),
          productions(id, name, status),
          activations(id, name, status)
        `)
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List projects with filters
      let query = supabase
        .from('projects')
        .select(`
          *,
          organization:organizations(id, name),
          productions(count)
        `)
        .order('created_at', { ascending: false });
      
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create project
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateProjectSchema.parse(body);
    
    // Check RBAC permissions (Gladiator+ only)
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateProject = permissions?.some((p: string) => 
      ['project.create', 'organization.manage'].includes(p)
    );
    
    if (!canCreateProject) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Gladiator role or higher required.' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('projects')
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

// PUT - Update project
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateProjectSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateProject = permissions?.some((p: string) => 
      ['project.update', 'project.update.own', 'organization.manage'].includes(p)
    );
    
    if (!canUpdateProject) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update project' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('projects')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
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

// DELETE - Archive project
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions (Gladiator+ only)
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteProject = permissions?.some((p: string) => 
      ['project.delete', 'organization.manage'].includes(p)
    );
    
    if (!canDeleteProject) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Gladiator role or higher required.' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('projects')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
