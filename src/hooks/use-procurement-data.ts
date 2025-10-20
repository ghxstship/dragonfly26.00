'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface PurchaseOrder {
  id: string
  organization_id: string
  po_number: string
  vendor_id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'received' | 'cancelled'
  total_amount: number
  currency: string
  requested_by: string
  approved_by: string | null
  order_date: string
  delivery_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PurchaseRequisition {
  id: string
  organization_id: string
  requisition_number: string
  requested_by: string
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'converted'
  total_amount: number
  currency: string
  justification: string | null
  created_at: string
  updated_at: string
}

export interface GoodsReceipt {
  id: string
  purchase_order_id: string
  receipt_number: string
  received_by: string
  received_date: string
  quantity_received: number
  condition: 'good' | 'damaged' | 'partial'
  notes: string | null
  created_at: string
}

export interface Vendor {
  id: string
  organization_id: string
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  payment_terms: string | null
  rating: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useProcurementData() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [requisitions, setRequisitions] = useState<PurchaseRequisition[]>([])
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchAllData()
    const channel = supabase
      .channel('procurement-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_orders' }, fetchPurchaseOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchase_requisitions' }, fetchRequisitions)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAllData() {
    setLoading(true)
    try {
      await Promise.all([fetchPurchaseOrders(), fetchRequisitions(), fetchReceipts(), fetchVendors()])
      setError(null)
    } catch (err: any) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPurchaseOrders() {
    const { data, error } = await supabase.from('purchase_orders').select('*').order('order_date', { ascending: false })
    if (error) throw error
    setPurchaseOrders(data || [])
  }

  async function fetchRequisitions() {
    const { data, error } = await supabase.from('purchase_requisitions').select('*').order('created_at', { ascending: false })
    if (error) throw error
    setRequisitions(data || [])
  }

  async function fetchReceipts() {
    const { data, error } = await supabase.from('goods_receipts').select('*').order('received_date', { ascending: false })
    if (!error && data) setReceipts(data)
  }

  async function fetchVendors() {
    const { data, error } = await supabase.from('vendors').select('*').order('name')
    if (!error && data) setVendors(data)
  }

  async function createPurchaseOrder(poData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('purchase_orders').insert(poData).select().single()
    if (error) throw error
    await fetchPurchaseOrders()
    return data
  }

  async function updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>) {
    const { id: _, created_at, ...validUpdates } = updates as any
    const { data, error } = await supabase.from('purchase_orders').update({ ...validUpdates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchPurchaseOrders()
    return data
  }

  async function approvePurchaseOrder(id: string, approvedBy: string) {
    const { data, error } = await supabase.from('purchase_orders').update({ status: 'approved', approved_by: approvedBy, updated_at: new Date().toISOString() }).eq('id', id).select().single()
    if (error) throw error
    await fetchPurchaseOrders()
    return data
  }

  async function createRequisition(reqData: Omit<PurchaseRequisition, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase.from('purchase_requisitions').insert(reqData).select().single()
    if (error) throw error
    await fetchRequisitions()
    return data
  }

  async function createGoodsReceipt(receiptData: Omit<GoodsReceipt, 'id' | 'created_at'>) {
    const { data, error } = await supabase.from('goods_receipts').insert(receiptData).select().single()
    if (error) throw error
    await fetchReceipts()
    return data
  }

  async function threeWayMatch(poId: string, receiptId: string, invoiceId: string) {
    // Implement three-way matching logic
    const po = purchaseOrders.find(p => p.id === poId)
    const receipt = receipts.find(r => r.id === receiptId)
    if (!po || !receipt) throw new Error('PO or Receipt not found')
    
    return {
      matched: true,
      po_amount: po.total_amount,
      receipt_quantity: receipt.quantity_received,
      discrepancies: [],
    }
  }

  return {
    purchaseOrders, requisitions, receipts, vendors, loading, error,
    createPurchaseOrder, updatePurchaseOrder, approvePurchaseOrder,
    createRequisition, createGoodsReceipt, threeWayMatch,
    refresh: fetchAllData,
  }
}
