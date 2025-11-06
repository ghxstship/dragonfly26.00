import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateLocationSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  location_type: z.enum(['venue', 'office', 'warehouse', 'site', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  workspace_id: z.string().uuid(),
  capacity: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateLocationSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  location_type: z.enum(['venue', 'office', 'warehouse', 'site', 'other']).optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  capacity: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

// GET - List locations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const locationType = searchParams.get('location_type');
    const status = searchParams.get('status');
    
    if (locationId) {
      // Retrieve single location
      const { data, error } = await supabase
        .from('locations')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .eq('id', locationId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List locations with filters
      let query = supabase
        .from('locations')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('name', { ascending: true });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (locationType) {
        query = query.eq('location_type', locationType);
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

// POST - Create location
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateLocationSchema.parse(body);
    
    const { data, error } = await supabase
      .from('locations')
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

// PUT - Update location
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('id');
    
    if (!locationId) {
      return NextResponse.json({ error: 'Location ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateLocationSchema.parse(body);
    
    const { data, error } = await supabase
      .from('locations')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', locationId)
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
