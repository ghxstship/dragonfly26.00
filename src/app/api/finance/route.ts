import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateTransactionSchema = z.object({
  transaction_type: z.enum(['income', 'expense', 'transfer', 'adjustment']),
  amount: z.number().min(0),
  currency: z.string().length(3).default('USD'),
  description: z.string().min(1).max(500),
  category: z.string().optional(),
  workspace_id: z.string().uuid(),
  budget_code: z.string().optional(),
  vendor_id: z.string().uuid().optional(),
  payment_method: z.enum(['cash', 'check', 'credit_card', 'debit_card', 'wire_transfer', 'other']).optional(),
  transaction_date: z.string(),
  reference_number: z.string().optional(),
  status: z.enum(['pending', 'completed', 'cancelled', 'failed']).default('pending'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateTransactionSchema = CreateTransactionSchema.partial().omit({ workspace_id: true });

// GET - List transactions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const transactionType = searchParams.get('transaction_type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const budgetCode = searchParams.get('budget_code');
    
    // Check RBAC permissions (Navigator+ only)
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canViewFinance = permissions?.some((p: string) => 
      ['finance.view', 'finance.view.own'].includes(p)
    );
    
    if (!canViewFinance) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Navigator role or higher required.' 
      }, { status: 403 });
    }
    
    if (transactionId) {
      // Retrieve single transaction
      const { data, error } = await supabase
        .from('financial_transactions')
        .select(`
          *,
          workspace:workspaces(id, name),
          vendor:marketplace_vendors(id, name),
          created_by_user:profiles!financial_transactions_created_by_fkey(id, full_name)
        `)
        .eq('id', transactionId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List transactions with filters
      let query = supabase
        .from('financial_transactions')
        .select(`
          *,
          workspace:workspaces(id, name),
          vendor:marketplace_vendors(id, name)
        `)
        .order('transaction_date', { ascending: false });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (transactionType) {
        query = query.eq('transaction_type', transactionType);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (startDate) {
        query = query.gte('transaction_date', startDate);
      }
      
      if (endDate) {
        query = query.lte('transaction_date', endDate);
      }
      
      if (budgetCode) {
        query = query.eq('budget_code', budgetCode);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - Record transaction
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = CreateTransactionSchema.parse(body);
    
    // Check RBAC permissions (Navigator+ only)
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateTransaction = permissions?.some((p: string) => 
      ['finance.create', 'finance.create.own'].includes(p)
    );
    
    if (!canCreateTransaction) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Navigator role or higher required.' 
      }, { status: 403 });
    }
    
    // Validate budget if budget_code provided
    if (validated.budget_code && validated.transaction_type === 'expense') {
      const { data: budget } = await supabase
        .from('budgets')
        .select('allocated_amount, spent_amount')
        .eq('code', validated.budget_code)
        .single();
      
      if (budget) {
        const available = budget.allocated_amount - budget.spent_amount;
        if (validated.amount > available) {
          return NextResponse.json({ 
            error: 'Insufficient budget',
            details: { available, requested: validated.amount }
          }, { status: 400 });
        }
      }
    }
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        ...validated,
        created_by: user.id,
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update budget spent amount if applicable
    if (validated.budget_code && validated.transaction_type === 'expense' && data) {
      await supabase.rpc('update_budget_spent', {
        p_budget_code: validated.budget_code,
        p_amount: validated.amount
      });
    }
    
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

// PUT - Update transaction
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get('id');
    
    if (!transactionId) {
      return NextResponse.json({ error: 'Transaction ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateTransactionSchema.parse(body);
    
    // Check RBAC permissions (Navigator+ only)
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateTransaction = permissions?.some((p: string) => 
      ['finance.update', 'finance.update.own'].includes(p)
    );
    
    if (!canUpdateTransaction) {
      return NextResponse.json({ 
        error: 'Insufficient permissions. Navigator role or higher required.' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('financial_transactions')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', transactionId)
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
