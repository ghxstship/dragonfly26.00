import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const AnalyticsQuerySchema = z.object({
  metric: z.enum(['users', 'events', 'projects', 'tasks', 'budget', 'assets', 'revenue']),
  start_date: z.string(),
  end_date: z.string(),
  workspace_id: z.string().uuid().optional(),
  group_by: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional().default('day'),
  filters: z.record(z.unknown()).optional(),
});

// GET - Analytics data with aggregations
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const workspaceId = searchParams.get('workspace_id');
    const groupBy = searchParams.get('group_by') || 'day';
    
    if (!metric || !startDate || !endDate) {
      return NextResponse.json({ 
        error: 'Missing required parameters: metric, start_date, end_date' 
      }, { status: 400 });
    }
    
    // Validate parameters
    const validated = AnalyticsQuerySchema.parse({
      metric,
      start_date: startDate,
      end_date: endDate,
      workspace_id: workspaceId,
      group_by: groupBy,
    });
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canViewAnalytics = permissions?.some((p: string) => 
      ['document.view', 'document.view.own'].includes(p)
    );
    
    if (!canViewAnalytics) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to view analytics' 
      }, { status: 403 });
    }
    
    // Build analytics query based on metric
    let data: any = null;
    let error: any = null;
    
    switch (validated.metric) {
      case 'users':
        ({ data, error } = await supabase
          .from('profiles')
          .select('id, created_at')
          .gte('created_at', validated.start_date)
          .lte('created_at', validated.end_date));
        break;
        
      case 'events':
        let query = supabase
          .from('events')
          .select('id, created_at, status')
          .gte('created_at', validated.start_date)
          .lte('created_at', validated.end_date);
        
        if (validated.workspace_id) {
          query = query.eq('workspace_id', validated.workspace_id);
        }
        
        ({ data, error } = await query);
        break;
        
      case 'projects':
        ({ data, error } = await supabase
          .from('projects')
          .select('id, created_at, status')
          .gte('created_at', validated.start_date)
          .lte('created_at', validated.end_date));
        break;
        
      case 'tasks':
        let taskQuery = supabase
          .from('events')
          .select('id, created_at, status, event_type')
          .eq('event_type', 'task')
          .gte('created_at', validated.start_date)
          .lte('created_at', validated.end_date);
        
        if (validated.workspace_id) {
          taskQuery = taskQuery.eq('workspace_id', validated.workspace_id);
        }
        
        ({ data, error } = await taskQuery);
        break;
        
      case 'budget':
        ({ data, error } = await supabase
          .from('financial_transactions')
          .select('id, amount, transaction_type, transaction_date')
          .gte('transaction_date', validated.start_date)
          .lte('transaction_date', validated.end_date));
        break;
        
      case 'assets':
        let assetQuery = supabase
          .from('assets')
          .select('id, created_at, status, asset_type')
          .gte('created_at', validated.start_date)
          .lte('created_at', validated.end_date);
        
        if (validated.workspace_id) {
          assetQuery = assetQuery.eq('workspace_id', validated.workspace_id);
        }
        
        ({ data, error } = await assetQuery);
        break;
        
      case 'revenue':
        ({ data, error } = await supabase
          .from('financial_transactions')
          .select('id, amount, transaction_date')
          .eq('transaction_type', 'income')
          .gte('transaction_date', validated.start_date)
          .lte('transaction_date', validated.end_date));
        break;
        
      default:
        return NextResponse.json({ 
          error: 'Invalid metric' 
        }, { status: 400 });
    }
    
    if (error) throw error;
    
    // Aggregate data by time period
    const aggregated = aggregateByTimePeriod(data, validated.group_by);
    
    return NextResponse.json({ 
      metric: validated.metric,
      start_date: validated.start_date,
      end_date: validated.end_date,
      group_by: validated.group_by,
      data: aggregated,
      total: data?.length || 0,
    });
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

// Helper function to aggregate data by time period
function aggregateByTimePeriod(data: any[], groupBy: string) {
  if (!data || data.length === 0) return [];
  
  const grouped: Record<string, any[]> = {};
  
  data.forEach(item => {
    const date = new Date(item.created_at || item.transaction_date);
    let key: string;
    
    switch (groupBy) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'month':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        break;
      case 'quarter':
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        key = `${date.getFullYear()}-Q${quarter}`;
        break;
      case 'year':
        key = String(date.getFullYear());
        break;
      default:
        key = date.toISOString().split('T')[0];
    }
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });
  
  return Object.entries(grouped).map(([period, items]) => ({
    period,
    count: items.length,
    items: items.length <= 10 ? items : undefined, // Only include items if <= 10
  })).sort((a, b) => a.period.localeCompare(b.period));
}
