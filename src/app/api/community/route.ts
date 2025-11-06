import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ActivitySchema = z.object({
  type: z.enum(['post', 'comment', 'event', 'discussion', 'announcement']),
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).max(10000),
  visibility: z.enum(['public', 'connections', 'private']).default('public'),
  tags: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

const CommentSchema = z.object({
  activity_id: z.string().uuid(),
  content: z.string().min(1).max(2000),
  parent_comment_id: z.string().uuid().optional()
});

// GET /api/community - List community activities
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const visibility = searchParams.get('visibility');
    
    let query = supabase
      .from('community_activities')
      .select(`
        *,
        user:profiles!community_activities_user_id_fkey(id, full_name, avatar_url),
        comments:community_comments(count),
        likes:community_likes(count),
        user_liked:community_likes!inner(user_id)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (visibility) {
      query = query.eq('visibility', visibility);
    } else {
      // Default: show public and user's own content
      query = query.or(`visibility.eq.public,user_id.eq.${user.id}`);
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
  } catch (error: any) {
    console.error('Community GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/community - Create activity
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const validated = ActivitySchema.parse(body);
    
    const { data, error } = await supabase
      .from('community_activities')
      .insert({
        ...validated,
        user_id: user.id
      })
      .select(`
        *,
        user:profiles!community_activities_user_id_fkey(id, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error('Community POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/community - Update activity
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }
    
    const validated = ActivitySchema.partial().parse(updates);
    
    const { data, error } = await supabase
      .from('community_activities')
      .update({
        ...validated,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select(`
        *,
        user:profiles!community_activities_user_id_fkey(id, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Community PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/community - Delete activity
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Activity ID required' }, { status: 400 });
    }
    
    const { error } = await supabase
      .from('community_activities')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Community DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
