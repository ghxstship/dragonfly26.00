import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const LineItemSchema = z.object({
  item_name: z.string().min(1).max(200),
  description: z.string().optional(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
  total_price: z.number().min(0),
  category: z.string().optional(),
});

const CreateProcurementSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  workspace_id: z.string().uuid(),
  vendor_id: z.string().uuid().optional(),
  requisition_type: z.enum(['purchase', 'rental', 'service', 'other']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  status: z.enum(['draft', 'pending', 'approved', 'ordered', 'received', 'cancelled']).default('draft'),
  line_items: z.array(LineItemSchema),
  total_amount: z.number().min(0),
  budget_code: z.string().optional(),
  delivery_date: z.string().optional(),
  delivery_location: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateProcurementSchema = CreateProcurementSchema.partial().omit({ workspace_id: true });

// GET - List orders
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const status = searchParams.get('status');
    const vendorId = searchParams.get('vendor_id');
    const priority = searchParams.get('priority');
    
    if (orderId) {
      // Retrieve single order
      const { data, error } = await supabase
        .from('procurement_orders')
        .select(`
          *,
          workspace:workspaces(id, name),
          vendor:marketplace_vendors(id, name),
          created_by_user:profiles!procurement_orders_created_by_fkey(id, full_name)
        `)
        .eq('id', orderId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List orders with filters
      let query = supabase
        .from('procurement_orders')
        .select(`
          *,
          workspace:workspaces(id, name),
          vendor:marketplace_vendors(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
      }
      
      if (priority) {
        query = query.eq('priority', priority);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Create requisition
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateProcurementSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateOrder = permissions?.some((p: string) => 
      ['finance.create', 'finance.create.own'].includes(p)
    );
    
    if (!canCreateOrder) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to create procurement orders' 
      }, { status: 403 });
    }
    
    // Validate budget if budget_code provided
    if (validated.budget_code) {
      const { data: budget } = await supabase
        .from('budgets')
        .select('allocated_amount, spent_amount')
        .eq('code', validated.budget_code)
        .single();
      
      if (budget) {
        const available = budget.allocated_amount - budget.spent_amount;
        if (validated.total_amount > available) {
          return NextResponse.json({ 
            error: 'Insufficient budget',
            details: { available, requested: validated.total_amount }
          }, { status: 400 });
        }
      }
    }
    
    const { data, error } = await supabase
      .from('procurement_orders')
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

// PUT - Update order
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateProcurementSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateOrder = permissions?.some((p: string) => 
      ['finance.update', 'finance.update.own'].includes(p)
    );
    
    if (!canUpdateOrder) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update procurement order' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('procurement_orders')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
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

// DELETE - Cancel order
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteOrder = permissions?.some((p: string) => 
      ['finance.delete', 'finance.delete.own'].includes(p)
    );
    
    if (!canDeleteOrder) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to cancel procurement order' 
      }, { status: 403 });
    }
    
    // Soft delete by updating status
    const { data, error } = await supabase
      .from('procurement_orders')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
