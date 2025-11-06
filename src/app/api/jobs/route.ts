import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateJobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string(),
  department: z.string().max(100).optional(),
  location: z.string().optional(),
  employment_type: z.enum(['full_time', 'part_time', 'contractor', 'temporary', 'volunteer']),
  experience_level: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).optional(),
  salary_min: z.number().optional(),
  salary_max: z.number().optional(),
  workspace_id: z.string().uuid(),
  status: z.enum(['draft', 'open', 'closed', 'filled']).default('draft'),
  requirements: z.array(z.string()).optional(),
  responsibilities: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  application_deadline: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateJobSchema = CreateJobSchema.partial().omit({ workspace_id: true });

// GET - List job postings
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const status = searchParams.get('status');
    const employmentType = searchParams.get('employment_type');
    const department = searchParams.get('department');
    
    if (jobId) {
      // Retrieve single job posting
      const { data, error } = await supabase
        .from('job_openings')
        .select(`
          *,
          workspace:workspaces(id, name),
          created_by_user:profiles!job_openings_created_by_fkey(id, full_name)
        `)
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List job postings with filters
      let query = supabase
        .from('job_openings')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (employmentType) {
        query = query.eq('employment_type', employmentType);
      }
      
      if (department) {
        query = query.eq('department', department);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create job posting
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateJobSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateJob = permissions?.some((p: string) => 
      ['task.create', 'task.assign'].includes(p)
    );
    
    if (!canCreateJob) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to create job postings' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('job_openings')
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

// PUT - Update job posting
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateJobSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateJob = permissions?.some((p: string) => 
      ['task.update', 'task.update.own'].includes(p)
    );
    
    if (!canUpdateJob) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update job posting' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('job_openings')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
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

// DELETE - Close job posting
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('id');
    
    if (!jobId) {
      return NextResponse.json({ error: 'Job ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteJob = permissions?.some((p: string) => 
      ['task.delete', 'task.delete.own'].includes(p)
    );
    
    if (!canDeleteJob) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to close job posting' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('job_openings')
      .update({
        status: 'closed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
