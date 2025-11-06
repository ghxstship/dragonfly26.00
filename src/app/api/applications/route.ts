import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateApplicationSchema = z.object({
  job_opening_id: z.string().uuid(),
  applicant_name: z.string().min(1).max(200),
  applicant_email: z.string().email(),
  applicant_phone: z.string().optional(),
  resume_url: z.string().url().optional(),
  cover_letter: z.string().optional(),
  status: z.enum(['submitted', 'under_review', 'interview', 'offered', 'accepted', 'rejected']).optional().default('submitted'),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateApplicationSchema = z.object({
  status: z.enum(['submitted', 'under_review', 'interview', 'offered', 'accepted', 'rejected']).optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

// GET - List applications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    const jobOpeningId = searchParams.get('job_opening_id');
    const status = searchParams.get('status');
    
    if (applicationId) {
      // Retrieve single application
      const { data, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job_opening:job_openings(id, title, status)
        `)
        .eq('id', applicationId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List applications with filters
      let query = supabase
        .from('job_applications')
        .select(`
          *,
          job_opening:job_openings(id, title)
        `)
        .order('created_at', { ascending: false });
      
      if (jobOpeningId) {
        query = query.eq('job_opening_id', jobOpeningId);
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

// POST - Submit application
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateApplicationSchema.parse(body);
    
    const { data, error } = await supabase
      .from('job_applications')
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

// PUT - Update application status
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    
    if (!applicationId) {
      return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateApplicationSchema.parse(body);
    
    const { data, error } = await supabase
      .from('job_applications')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)
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
