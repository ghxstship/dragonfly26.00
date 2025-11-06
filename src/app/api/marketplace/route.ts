import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ProductSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  price: z.number().positive(),
  stock_quantity: z.number().int().nonnegative(),
  category: z.string().min(1),
  images: z.array(z.string().url()).optional(),
  specifications: z.record(z.any()).optional(),
  status: z.enum(['active', 'inactive', 'out_of_stock']).default('active')
});

const OrderSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  shipping_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    postal_code: z.string(),
    country: z.string()
  }),
  notes: z.string().optional()
});

const ReviewSchema = z.object({
  product_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(1).max(100).optional(),
  comment: z.string().min(1).max(2000).optional()
});

// GET /api/marketplace - List products or orders
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'products';
    const category = searchParams.get('category');
    const vendorId = searchParams.get('vendor_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    if (type === 'products') {
      let query = supabase
        .from('marketplace_products')
        .select(`
          *,
          vendor:marketplace_vendors!marketplace_products_vendor_id_fkey(id, business_name, logo_url),
          reviews:marketplace_reviews(rating)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (category) {
        query = query.eq('category', category);
      }
      
      if (vendorId) {
        query = query.eq('vendor_id', vendorId);
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
    } else if (type === 'orders') {
      const { data, error, count } = await supabase
        .from('marketplace_orders')
        .select(`
          *,
          product:marketplace_products!marketplace_orders_product_id_fkey(*),
          vendor:marketplace_vendors!marketplace_orders_vendor_id_fkey(business_name)
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
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
    } else if (type === 'reviews') {
      const productId = searchParams.get('product_id');
      
      let query = supabase
        .from('marketplace_reviews')
        .select(`
          *,
          user:profiles!marketplace_reviews_user_id_fkey(id, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      if (productId) {
        query = query.eq('product_id', productId);
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
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Marketplace GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/marketplace - Create product, order, or review
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await request.json();
    const { type, ...rest } = body;
    
    if (type === 'product') {
      // Check if user is a vendor
      const { data: vendor } = await supabase
        .from('marketplace_vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!vendor) {
        return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
      }
      
      const validated = ProductSchema.parse(rest);
      
      const { data, error } = await supabase
        .from('marketplace_products')
        .insert({
          ...validated,
          vendor_id: vendor.id
        })
        .select(`
          *,
          vendor:marketplace_vendors!marketplace_products_vendor_id_fkey(id, business_name, logo_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    } else if (type === 'order') {
      const validated = OrderSchema.parse(rest);
      
      // Get product details
      const { data: product } = await supabase
        .from('marketplace_products')
        .select('price, vendor_id, stock_quantity')
        .eq('id', validated.product_id)
        .single();
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      if (product.stock_quantity < validated.quantity) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
      }
      
      const totalAmount = product.price * validated.quantity;
      
      const { data, error } = await supabase
        .from('marketplace_orders')
        .insert({
          ...validated,
          buyer_id: user.id,
          vendor_id: product.vendor_id,
          total_amount: totalAmount,
          status: 'pending'
        })
        .select(`
          *,
          product:marketplace_products!marketplace_orders_product_id_fkey(*),
          vendor:marketplace_vendors!marketplace_orders_vendor_id_fkey(business_name)
        `)
        .single();
      
      if (error) throw error;
      
      // Update stock quantity
      await supabase
        .from('marketplace_products')
        .update({ stock_quantity: product.stock_quantity - validated.quantity })
        .eq('id', validated.product_id);
      
      return NextResponse.json({ data }, { status: 201 });
    } else if (type === 'review') {
      const validated = ReviewSchema.parse(rest);
      
      // Check if user has purchased this product
      const { data: order } = await supabase
        .from('marketplace_orders')
        .select('id')
        .eq('buyer_id', user.id)
        .eq('product_id', validated.product_id)
        .eq('status', 'delivered')
        .single();
      
      if (!order) {
        return NextResponse.json({ 
          error: 'Can only review purchased products' 
        }, { status: 403 });
      }
      
      const { data, error } = await supabase
        .from('marketplace_reviews')
        .insert({
          ...validated,
          user_id: user.id
        })
        .select(`
          *,
          user:profiles!marketplace_reviews_user_id_fkey(id, full_name, avatar_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data }, { status: 201 });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Marketplace POST error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/marketplace - Update product or order
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
    
    if (type === 'product') {
      // Check if user is the vendor
      const { data: vendor } = await supabase
        .from('marketplace_vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!vendor) {
        return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
      }
      
      const validated = ProductSchema.partial().parse(updates);
      
      const { data, error } = await supabase
        .from('marketplace_products')
        .update({
          ...validated,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('vendor_id', vendor.id)
        .select(`
          *,
          vendor:marketplace_vendors!marketplace_products_vendor_id_fkey(id, business_name, logo_url)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    } else if (type === 'order') {
      // Only allow status updates for vendors
      const { data: vendor } = await supabase
        .from('marketplace_vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!vendor) {
        return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
      }
      
      const { status } = updates;
      
      if (!status) {
        return NextResponse.json({ error: 'Status required' }, { status: 400 });
      }
      
      const { data, error } = await supabase
        .from('marketplace_orders')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('vendor_id', vendor.id)
        .select(`
          *,
          product:marketplace_products!marketplace_orders_product_id_fkey(*),
          vendor:marketplace_vendors!marketplace_orders_vendor_id_fkey(business_name)
        `)
        .single();
      
      if (error) throw error;
      
      return NextResponse.json({ data });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Marketplace PUT error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/marketplace - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'product';
    
    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }
    
    if (type === 'product') {
      // Check if user is the vendor
      const { data: vendor } = await supabase
        .from('marketplace_vendors')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (!vendor) {
        return NextResponse.json({ error: 'Not a vendor' }, { status: 403 });
      }
      
      const { error } = await supabase
        .from('marketplace_products')
        .delete()
        .eq('id', id)
        .eq('vendor_id', vendor.id);
      
      if (error) throw error;
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error: any) {
    console.error('Marketplace DELETE error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
