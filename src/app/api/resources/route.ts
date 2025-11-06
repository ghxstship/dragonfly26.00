import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ResourceSchema = z.object({
  type: z.enum(['library', 'guide', 'course', 'grant', 'publication', 'glossary', 'troubleshooting']),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  content: z.string().optional(),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  file_url: z.string().url().optional(),
  thumbnail_url: z.string().url().optional(),
  difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  duration_minutes: z.number().int().positive().optional(),
  prerequisites: z.array(z.string()).optional(),
  learning_objectives: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('published')
});

const ProgressSchema = z.object({
  resource_id: z.string().uuid(),
  progress_percentage: z.number().min(0).max(100),
  completed: z.boolean().default(false),
  notes: z.string().optional()
});

// GET /api/resources - List resources
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    let query = supabase
      .from('resources')
      .select(`
        *,
        author:profiles!resources_author_id_fkey(id, full_name, avatar_url),
        progress:resource_progress!left(progress_percentage, completed)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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
    console.error('Resources GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/resources - Create resource or track progress
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { action, ...rest } = body;
    
    if (action === 'create') {
      // Check if user has permission to create resources
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const allowedRoles = ['legend', 'phantom', 'aviator', 'gladiator'];
      if (!profile || !allowedRoles.includes(profile.role)) {
        return NextResponse.json({ 
          error: 'Insufficient permissions' 
        }, { status: 403 });
      }
      
      const validated = ResourceSchema.parse(rest);
      
      const { data, error } = await supabase
        .from('resources')
        .insert({
          ...validated,
          author_id: user.id
        })
        .select(`
          *,
          author:profiles!resources_author_id_fkey(id, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    } else if (action === 'progress') {
      const validated = ProgressSchema.parse(rest);
      
      const { data, error } = await supabase
        .from('resource_progress')
        .upsert({
          ...validated,
          user_id: user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,resource_id'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    }
    
    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Resources POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/resources - Update resource
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
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }
    
    const validated = ResourceSchema.partial().parse(updates);
    
    // Check if user is the author or has admin permissions
    const { data: resource } = await supabase
      .from('resources')
      .select('author_id')
      .eq('id', id)
      .single();
    
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const adminRoles = ['legend', 'phantom', 'aviator'];
    const isAuthor = resource.author_id === user.id;
    const isAdmin = profile && adminRoles.includes(profile.role);
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }
    
    const { data, error } = await supabase
      .from('resources')
      .update({
        ...validated,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        author:profiles!resources_author_id_fkey(id, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    
    return NextResponse.json({ data });
  } catch (error: any) {
    console.error('Resources PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/resources - Delete resource
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
      return NextResponse.json({ error: 'Resource ID required' }, { status: 400 });
    }
    
    // Check if user is the author or has admin permissions
    const { data: resource } = await supabase
      .from('resources')
      .select('author_id')
      .eq('id', id)
      .single();
    
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const adminRoles = ['legend', 'phantom', 'aviator'];
    const isAuthor = resource.author_id === user.id;
    const isAdmin = profile && adminRoles.includes(profile.role);
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }
    
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Resources DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
