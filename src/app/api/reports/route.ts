import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Input validation schemas
const CreateReportSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  report_type: z.enum(['financial', 'project', 'asset', 'personnel', 'custom']),
  workspace_id: z.string().uuid(),
  parameters: z.record(z.unknown()).optional(),
  schedule: z.enum(['once', 'daily', 'weekly', 'monthly']).optional().default('once'),
  recipients: z.array(z.string().email()).optional(),
  status: z.enum(['draft', 'scheduled', 'generating', 'completed', 'failed']).optional().default('draft'),
  metadata: z.record(z.unknown()).optional(),
});

const UpdateReportSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  parameters: z.record(z.unknown()).optional(),
  schedule: z.enum(['once', 'daily', 'weekly', 'monthly']).optional(),
  recipients: z.array(z.string().email()).optional(),
  status: z.enum(['draft', 'scheduled', 'generating', 'completed', 'failed']).optional(),
  metadata: z.record(z.unknown()).optional(),
});

const GenerateReportSchema = z.object({
  report_id: z.string().uuid(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  format: z.enum(['json', 'csv', 'pdf']).optional().default('json'),
});

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');
    const workspaceId = searchParams.get('workspace_id');
    const reportType = searchParams.get('report_type');
    const status = searchParams.get('status');
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canViewReports = permissions?.some((p: string) => 
      ['document.view', 'document.view.own'].includes(p)
    );
    
    if (!canViewReports) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to view reports' 
      }, { status: 403 });
    }
    
    if (reportId) {
      // Retrieve single report
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          workspace:workspaces(id, name),
          created_by_user:profiles!reports_created_by_fkey(id, full_name)
        `)
        .eq('id', reportId)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else {
      // List reports with filters
      let query = supabase
        .from('reports')
        .select(`
          *,
          workspace:workspaces(id, name)
        `)
        .order('created_at', { ascending: false });
      
      if (workspaceId) {
        query = query.eq('workspace_id', workspaceId);
      }
      
      if (reportType) {
        query = query.eq('report_type', reportType);
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

// POST - Create report or generate report
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canCreateReport = permissions?.some((p: string) => 
      ['document.create', 'document.create.own'].includes(p)
    );
    
    if (!canCreateReport) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to create reports' 
      }, { status: 403 });
    }
    
    if (action === 'generate') {
      // Generate report
      const validated = GenerateReportSchema.parse(body);
      
      // Fetch report configuration
      const { data: report, error: reportError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', validated.report_id)
        .single();
      
      if (reportError) throw reportError;
      
      // Generate report data based on type
      const reportData = await generateReportData(
        supabase,
        report.report_type,
        report.workspace_id,
        validated.start_date,
        validated.end_date,
        report.parameters
      );
      
      // Update report status
      await supabase
        .from('reports')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', validated.report_id);
      
      return NextResponse.json({ 
        data: reportData,
        format: validated.format,
        generated_at: new Date().toISOString(),
      });
    } else {
      // Create new report configuration
      const validated = CreateReportSchema.parse(body);
      
      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...validated,
          created_by: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    }
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

// PUT - Update report
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');
    
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }
    
    const body = await request.json();
    const validated = UpdateReportSchema.parse(body);
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canUpdateReport = permissions?.some((p: string) => 
      ['document.update', 'document.update.own'].includes(p)
    );
    
    if (!canUpdateReport) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to update report' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('reports')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId)
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

// DELETE - Delete report
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');
    
    if (!reportId) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 });
    }
    
    // Check RBAC permissions
    const { data: permissions } = await supabase.rpc('get_user_permissions', {
      p_user_id: user.id
    });
    
    const canDeleteReport = permissions?.some((p: string) => 
      ['document.delete', 'document.delete.own'].includes(p)
    );
    
    if (!canDeleteReport) {
      return NextResponse.json({ 
        error: 'Insufficient permissions to delete report' 
      }, { status: 403 });
    }
    
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);
    
    if (error) throw error;
    
    return NextResponse.json({ message: 'Report deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Helper function to generate report data
async function generateReportData(
  supabase: any,
  reportType: string,
  workspaceId: string,
  startDate?: string,
  endDate?: string,
  parameters?: Record<string, unknown>
) {
  const now = new Date().toISOString();
  const defaultStart = startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const defaultEnd = endDate || now;
  
  switch (reportType) {
    case 'financial':
      const { data: transactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('transaction_date', defaultStart)
        .lte('transaction_date', defaultEnd);
      
      return {
        type: 'financial',
        summary: {
          total_income: transactions?.filter((t: any) => t.transaction_type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0) || 0,
          total_expenses: transactions?.filter((t: any) => t.transaction_type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0) || 0,
          transaction_count: transactions?.length || 0,
        },
        transactions,
      };
      
    case 'project':
      const { data: projects } = await supabase
        .from('projects')
        .select('*, productions(count)')
        .gte('created_at', defaultStart)
        .lte('created_at', defaultEnd);
      
      return {
        type: 'project',
        summary: {
          total_projects: projects?.length || 0,
          active_projects: projects?.filter((p: any) => p.status === 'active').length || 0,
          completed_projects: projects?.filter((p: any) => p.status === 'completed').length || 0,
        },
        projects,
      };
      
    case 'asset':
      const { data: assets } = await supabase
        .from('assets')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('created_at', defaultStart)
        .lte('created_at', defaultEnd);
      
      return {
        type: 'asset',
        summary: {
          total_assets: assets?.length || 0,
          available_assets: assets?.filter((a: any) => a.status === 'available').length || 0,
          in_use_assets: assets?.filter((a: any) => a.status === 'in_use').length || 0,
        },
        assets,
      };
      
    case 'personnel':
      const { data: personnel } = await supabase
        .from('personnel')
        .select('*')
        .eq('workspace_id', workspaceId)
        .gte('created_at', defaultStart)
        .lte('created_at', defaultEnd);
      
      return {
        type: 'personnel',
        summary: {
          total_personnel: personnel?.length || 0,
          active_personnel: personnel?.filter((p: any) => p.status === 'active').length || 0,
        },
        personnel,
      };
      
    default:
      return {
        type: 'custom',
        message: 'Custom report generation not yet implemented',
        parameters,
      };
  }
}
