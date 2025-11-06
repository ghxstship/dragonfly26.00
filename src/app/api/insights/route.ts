import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ObjectiveSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  type: z.enum(['strategic', 'operational', 'tactical', 'personal']),
  category: z.string().min(1),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  unit: z.string().optional(),
  start_date: z.string().datetime(),
  target_date: z.string().datetime(),
  status: z.enum(['not_started', 'in_progress', 'at_risk', 'completed', 'cancelled']).default('not_started'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  owner_id: z.string().uuid().optional(),
  parent_objective_id: z.string().uuid().optional(),
  metadata: z.record(z.any()).optional()
});

const KPISchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  category: z.string().min(1),
  metric_type: z.enum(['number', 'percentage', 'currency', 'duration', 'count']),
  target_value: z.number(),
  current_value: z.number(),
  unit: z.string(),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  objective_id: z.string().uuid().optional(),
  threshold_warning: z.number().optional(),
  threshold_critical: z.number().optional(),
  metadata: z.record(z.any()).optional()
});

const PredictionSchema = z.object({
  type: z.enum(['trend', 'forecast', 'anomaly', 'recommendation']),
  category: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  confidence_score: z.number().min(0).max(100),
  predicted_value: z.number().optional(),
  predicted_date: z.string().datetime().optional(),
  impact_level: z.enum(['low', 'medium', 'high', 'critical']),
  data_source: z.string(),
  metadata: z.record(z.any()).optional()
});

// GET /api/insights - List objectives, KPIs, or predictions
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'objectives';
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (type === 'objectives') {
      let query = supabase
        .from('objectives')
        .select(`
          *,
          owner:profiles!objectives_owner_id_fkey(id, full_name, avatar_url),
          kpis:kpis(count),
          children:objectives!objectives_parent_objective_id_fkey(count)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ 
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: count ? offset + limit < count : false
        }
      });
    } else if (type === 'kpis') {
      let query = supabase
        .from('kpis')
        .select(`
          *,
          objective:objectives!kpis_objective_id_fkey(id, title),
          history:kpi_history(value, recorded_at)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ 
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: count ? offset + limit < count : false
        }
      });
    } else if (type === 'predictions') {
      let query = supabase
        .from('predictions')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const predictionType = searchParams.get('prediction_type');
      if (predictionType) {
        query = query.eq('type', predictionType);
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return NextResponse.json({ 
        data,
        pagination: {
          total: count,
          limit,
          offset,
          hasMore: count ? offset + limit < count : false
        }
      });
    } else if (type === 'recommendations') {
      // Generate AI-powered recommendations based on current data
      const { data: objectives } = await supabase
        .from('objectives')
        .select('*')
        .eq('status', 'at_risk')
        .limit(10);
      
      const { data: kpis } = await supabase
        .from('kpis')
        .select('*')
        .lt('current_value', 'target_value')
        .limit(10);
      
      const recommendations = [];
      
      // Generate recommendations for at-risk objectives
      if (objectives) {
        for (const obj of objectives) {
          recommendations.push({
            type: 'objective_risk',
            title: `Action needed: ${obj.title}`,
            description: `This objective is at risk. Consider reviewing progress and adjusting resources.`,
            priority: 'high',
            related_id: obj.id,
            related_type: 'objective'
          });
        }
      }
      
      // Generate recommendations for underperforming KPIs
      if (kpis) {
        for (const kpi of kpis) {
          const gap = ((kpi.target_value - kpi.current_value) / kpi.target_value) * 100;
          if (gap > 20) {
            recommendations.push({
              type: 'kpi_underperformance',
              title: `KPI Alert: ${kpi.name}`,
              description: `Currently ${gap.toFixed(1)}% below target. Review strategy and implementation.`,
              priority: gap > 50 ? 'critical' : 'high',
              related_id: kpi.id,
              related_type: 'kpi'
            });
          }
        }
      }
      
      return NextResponse.json({ data: recommendations });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Insights GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/insights - Create objective, KPI, or prediction
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { type, ...rest } = body;
    
    if (type === 'objective') {
      const validated = ObjectiveSchema.parse(rest);
      
      const { data, error } = await supabase
        .from('objectives')
        .insert({
          ...validated,
          created_by: user.id,
          owner_id: validated.owner_id || user.id
        })
        .select(`
          *,
          owner:profiles!objectives_owner_id_fkey(id, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    } else if (type === 'kpi') {
      const validated = KPISchema.parse(rest);
      
      const { data, error } = await supabase
        .from('kpis')
        .insert({
          ...validated,
          created_by: user.id
        })
        .select(`
          *,
          objective:objectives!kpis_objective_id_fkey(id, title)
        `)
        .single();
      
      if (error) throw error;
      
      // Record initial value in history
      await supabase
        .from('kpi_history')
        .insert({
          kpi_id: data.id,
          value: validated.current_value,
          recorded_at: new Date().toISOString(),
          recorded_by: user.id
        });
      
      return NextResponse.json({ data }, { status: 201 });
    } else if (type === 'prediction') {
      const validated = PredictionSchema.parse(rest);
      
      const { data, error } = await supabase
        .from('predictions')
        .insert({
          ...validated,
          created_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Insights POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/insights - Update objective or KPI
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { type, id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    if (type === 'objective') {
      const validated = ObjectiveSchema.partial().parse(updates);
      
      const { data, error } = await supabase
        .from('objectives')
        .update({
          ...validated,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          owner:profiles!objectives_owner_id_fkey(id, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else if (type === 'kpi') {
      const validated = KPISchema.partial().parse(updates);
      
      const { data, error } = await supabase
        .from('kpis')
        .update({
          ...validated,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          objective:objectives!kpis_objective_id_fkey(id, title)
        `)
        .single();
      
      if (error) throw error;
      
      // If current_value was updated, record in history
      if (validated.current_value !== undefined) {
        await supabase
          .from('kpi_history')
          .insert({
            kpi_id: id,
            value: validated.current_value,
            recorded_at: new Date().toISOString(),
            recorded_by: user.id
          });
      }
      
      return NextResponse.json({ data });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Insights PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/insights - Delete objective, KPI, or prediction
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type');
    
    if (!id || !type) {
      return NextResponse.json({ error: 'ID and type required' }, { status: 400 });
    }
    
    if (type === 'objective') {
      const { error } = await supabase
        .from('objectives')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true });
    } else if (type === 'kpi') {
      const { error } = await supabase
        .from('kpis')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true });
    } else if (type === 'prediction') {
      const { error } = await supabase
        .from('predictions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Insights DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
