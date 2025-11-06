import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useVendorData() {
  const supabase = createClient();
  const queryClient = useQueryClient();

  // Get current user's vendor profile
  const { data: vendorProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['vendor', 'profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('marketplace_vendors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Get vendor orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['vendor', 'orders', vendorProfile?.id],
    queryFn: async () => {
      if (!vendorProfile?.id) return [];

      const { data, error } = await supabase
        .from('marketplace_orders')
        .select('*, product:marketplace_products(*), buyer:profiles(*)')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorProfile?.id
  });

  // Get vendor products
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['vendor', 'products', vendorProfile?.id],
    queryFn: async () => {
      if (!vendorProfile?.id) return [];

      const { data, error } = await supabase
        .from('marketplace_products')
        .select('*, reviews:marketplace_reviews(rating)')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorProfile?.id
  });

  // Get vendor invoices
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['vendor', 'invoices', vendorProfile?.id],
    queryFn: async () => {
      if (!vendorProfile?.id) return [];

      const { data, error } = await supabase
        .from('vendor_invoices')
        .select('*, order:marketplace_orders(*)')
        .eq('vendor_id', vendorProfile.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorProfile?.id
  });

  // Get vendor analytics
  const { data: analytics } = useQuery({
    queryKey: ['vendor', 'analytics', vendorProfile?.id],
    queryFn: async () => {
      if (!vendorProfile?.id) return null;

      const { data, error } = await supabase
        .rpc('get_vendor_analytics', { vendor_id: vendorProfile.id });
      
      if (error) throw error;
      return data;
    },
    enabled: !!vendorProfile?.id
  });

  // Submit invoice mutation
  const submitInvoice = useMutation({
    mutationFn: async (invoiceData: {
      order_id: string;
      amount: number;
      due_date: string;
      line_items: any[];
      notes?: string;
    }) => {
      if (!vendorProfile?.id) throw new Error('Vendor profile not found');

      const { data, error } = await supabase
        .from('vendor_invoices')
        .insert({
          ...invoiceData,
          vendor_id: vendorProfile.id,
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'invoices'] });
    }
  });

  // Update product mutation
  const updateProduct = useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<{
        name: string;
        description: string;
        price: number;
        stock_quantity: number;
        images: string[];
        category: string;
        status: string;
      }>;
    }) => {
      const { data, error } = await supabase
        .from('marketplace_products')
        .update(updates)
        .eq('id', id)
        .eq('vendor_id', vendorProfile?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    }
  });

  // Create product mutation
  const createProduct = useMutation({
    mutationFn: async (productData: {
      name: string;
      description: string;
      price: number;
      stock_quantity: number;
      images?: string[];
      category: string;
    }) => {
      if (!vendorProfile?.id) throw new Error('Vendor profile not found');

      const { data, error } = await supabase
        .from('marketplace_products')
        .insert({
          ...productData,
          vendor_id: vendorProfile.id,
          status: 'active'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'products'] });
    }
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: async ({ 
      orderId, 
      status 
    }: { 
      orderId: string; 
      status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    }) => {
      const { data, error } = await supabase
        .from('marketplace_orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('vendor_id', vendorProfile?.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'orders'] });
    }
  });

  // Update vendor profile mutation
  const updateVendorProfile = useMutation({
    mutationFn: async (updates: Partial<{
      business_name: string;
      description: string;
      logo_url: string;
      contact_email: string;
      contact_phone: string;
      address: any;
      business_hours: any;
      shipping_policies: string;
      return_policies: string;
    }>) => {
      if (!vendorProfile?.id) throw new Error('Vendor profile not found');

      const { data, error } = await supabase
        .from('marketplace_vendors')
        .update(updates)
        .eq('id', vendorProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor', 'profile'] });
    }
  });

  return {
    // Data
    vendorProfile,
    orders,
    products,
    invoices,
    analytics,
    
    // Loading states
    isLoading: isLoadingProfile || isLoadingOrders || isLoadingProducts || isLoadingInvoices,
    isLoadingProfile,
    isLoadingOrders,
    isLoadingProducts,
    isLoadingInvoices,
    
    // Mutations
    submitInvoice,
    updateProduct,
    createProduct,
    updateOrderStatus,
    updateVendorProfile
  };
}
