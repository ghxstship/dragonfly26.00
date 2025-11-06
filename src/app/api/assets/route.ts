import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateAssetSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  asset_type: z.enum(['equipment', 'vehicle', 'facility', 'tool', 'other']),
  category: z.string().optional(),
  serial_number: z.string().optional(),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.number().optional(),
  current_value: z.number().optional(),
  workspace_id: z.string().uuid(),
  location_id: z.string().uuid().optional(),
  status: z.enum(['available', 'in_use', 'maintenance', 'retired']).default('available'),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateAssetSchema = CreateAssetSchema.partial().omit({ workspace_id: true });

// GET - Asset catalog
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const assetType = searchParams.get('asset_type');
    const status = searchParams.get('status');
    const locationId = searchParams.get('location_id');
    
    if (assetId) {
      // Retrieve single asset
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          workspace:workspaces(id, name),
          location:locations(id, name),
          transactions:asset_transactions(*)
        `)
        .eq('id', assetId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List assets with filters
      let query = supabase
        .from('assets')
        .select(`
          *,
          workspace:workspaces(id, name),
          location:locations(id, name)
        `)
        .order('name', { ascending: true });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (assetType) {
        query = query.eq('asset_type', assetType);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Register asset
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateAssetSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateAsset = permissions?.some((p: string) => 
      ['document.create', 'document.create.own'].includes(p)
    );
    
    if (!canCreateAsset) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to register assets' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('assets')
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

// PUT - Update asset
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('id');
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateAssetSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateAsset = permissions?.some((p: string) => 
      ['document.update', 'document.update.own'].includes(p)
    );
    
    if (!canUpdateAsset) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update asset' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('assets')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', assetId)
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

// DELETE - Retire asset
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get('id');
    
    if (!assetId) {
      return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteAsset = permissions?.some((p: string) => 
      ['document.delete', 'document.delete.own'].includes(p)
    );
    
    if (!canDeleteAsset) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to retire asset' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('assets')
      .update({
        status: 'retired',
        updated_at: new Date().toISOString(),
      })
      .eq('id', assetId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
