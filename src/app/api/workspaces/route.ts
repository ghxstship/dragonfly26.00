import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateWorkspaceSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  activation_id: z.string().uuid().optional(),
  production_id: z.string().uuid().optional(),
  workspace_type: z.enum(['department', 'zone', 'team', 'other']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional().default('active'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateWorkspaceSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  activation_id: z.string().uuid().optional(),
  production_id: z.string().uuid().optional(),
  workspace_type: z.enum(['department', 'zone', 'team', 'other']).optional(),
  status: z.enum(['active', 'inactive', 'archived']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// GET - List workspaces
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('id');
    const activationId = searchParams.get('activation_id');
    const productionId = searchParams.get('production_id');
    const status = searchParams.get('status');
    
    if (workspaceId) {
      // Retrieve single workspace with hierarchy
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          activation:activations(id, name, production_id),
          production:productions(id, name, project_id),
          project:projects(id, name, organization_id),
          organization:organizations(id, name)
        `)
        .eq('id', workspaceId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List workspaces with filters
      let query = supabase
        .from('workspaces')
        .select(`
          *,
          activation:activations(id, name),
          production:productions(id, name)
        `)
        .order('name', { ascending: true });
      
      if (activationId) {
        query = query.eq('activation_id', activationId);
      }
      
      if (productionId) {
        query = query.eq('production_id', productionId);
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

// POST - Create workspace
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateWorkspaceSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateWorkspace = permissions?.some((p: string) => 
      ['activation.create', 'production.create'].includes(p)
    );
    
    if (!canCreateWorkspace) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to create workspaces' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('workspaces')
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

// PUT - Update workspace
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('id');
    
    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateWorkspaceSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateWorkspace = permissions?.some((p: string) => 
      ['activation.update', 'production.update'].includes(p)
    );
    
    if (!canUpdateWorkspace) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update workspace' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('workspaces')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', workspaceId)
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
