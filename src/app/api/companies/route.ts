import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateCompanySchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  company_type: z.enum(['client', 'vendor', 'partner', 'competitor', 'other']).optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  workspace_id: z.string().uuid(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  company_type: z.enum(['client', 'vendor', 'partner', 'competitor', 'other']).optional(),
  industry: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// GET - List companies
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const companyType = searchParams.get('company_type');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    if (companyId) {
      // Retrieve single company
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .eq('id', companyId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List companies with filters
      let query = supabase
        .from('companies')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('name', { ascending: true });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (companyType) {
        query = query.eq('company_type', companyType);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (search) {
        query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create company
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateCompanySchema.parse(body);
    
    const { data, error } = await supabase
      .from('companies')
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

// PUT - Update company
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('id');
    
    if (!companyId) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateCompanySchema.parse(body);
    
    const { data, error } = await supabase
      .from('companies')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', companyId)
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
