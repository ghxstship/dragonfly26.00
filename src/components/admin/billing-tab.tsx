"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Users,
  Database,
  Calendar,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { DataTableOrganism } from "@/components/organisms"
import { billingSchema } from "@/lib/schemas/admin-schemas"
import type { DataItem } from "@/types"

export function BillingTab() {
  const t = useTranslations()
  const { toast } = useToast()

  // Current plan data
  const currentPlan = {
    nameKey: "executive",
    price: 100,
    billingCycle: "monthly",
    nextBillingDate: "2024-02-20",
    seats: -1, // unlimited
    usedSeats: 42,
    storage: 1000,
    usedStorage: 640,
  }

  // Mock invoice data
  const [invoices, setInvoices] = useState<DataItem[]>([
    { 
      id: "1",
      invoice_number: "INV-001", 
      billing_date: "2024-01-20", 
      due_date: "2024-02-20",
      amount: 100.00, 
      status: "paid",
      plan: "executive-monthly",
      payment_method: "Visa •••• 4242",
      created_at: "2024-01-20T10:00:00Z",
      updated_at: "2024-01-20T10:00:00Z"
    },
    { 
      id: "2",
      invoice_number: "INV-002", 
      billing_date: "2023-12-20", 
      due_date: "2024-01-20",
      amount: 100.00, 
      status: "paid",
      plan: "executive-monthly",
      payment_method: "Visa •••• 4242",
      created_at: "2023-12-20T10:00:00Z",
      updated_at: "2023-12-20T10:00:00Z"
    },
    { 
      id: "3",
      invoice_number: "INV-003", 
      billing_date: "2023-11-20", 
      due_date: "2023-12-20",
      amount: 100.00, 
      status: "paid",
      plan: "executive-monthly",
      payment_method: "Visa •••• 4242",
      created_at: "2023-11-20T10:00:00Z",
      updated_at: "2023-11-20T10:00:00Z"
    },
  ])

  const handleCreate = async (data: Record<string, unknown>) => {
    const now = new Date().toISOString()
    const newInvoice: DataItem = {
      id: String(invoices.length + 1),
      invoice_number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      ...data,
      created_at: now,
      updated_at: now,
    }
    setInvoices([...invoices, newInvoice])
    toast({ title: t('admin.toast.invoiceCreated') })
  }

  const handleUpdate = async (id: string, updates: Record<string, unknown>) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv))
    toast({ title: t('admin.toast.invoiceUpdated') })
  }

  const handleDelete = async (id: string) => {
    setInvoices(invoices.filter(inv => (inv as any).id !== id))
    toast({ title: t('admin.toast.invoiceDeleted') })
  }

  const handleBulkDelete = async (ids: string[]) => {
    setInvoices(invoices.filter(inv => !ids.includes(inv.id)))
    toast({ title: `${ids.length} invoices deleted successfully` })
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('admin.billingTab.currentPlan')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{t(currentPlan.nameKey)}</h3>
              <p className="text-muted-foreground mt-1">
                ${currentPlan.price}/{currentPlan.billingCycle}
              </p>
            </div>
            <Badge variant="default" className="text-base px-4 py-1">{t('admin.billingTab.active')}</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" aria-hidden="true" />
                {t('admin.billingTab.teamSeats')}
              </div>
              <p className="text-2xl font-bold">
                {currentPlan.seats === -1 
                  ? `${currentPlan.usedSeats} / Unlimited` 
                  : `${currentPlan.usedSeats} / ${currentPlan.seats}`}
              </p>
              {currentPlan.seats !== -1 && (
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                  <div className="h-full bg-primary" style={{ width: `${(currentPlan.usedSeats / currentPlan.seats) * 100}%` }} />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" aria-hidden="true" />
                {t('admin.billingTab.storage')}
              </div>
              <p className="text-2xl font-bold">{currentPlan.usedStorage} / {currentPlan.storage}GB</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary" style={{ width: `${(currentPlan.usedStorage / currentPlan.storage) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {t('admin.billingTab.nextBilling')}
              </div>
              <p className="text-2xl font-bold">
                {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <Button className="w-full" variant="outline" size="sm" aria-label={t('admin.billingTab.viewAllPlans')}>
            {t('admin.billingTab.viewAllPlans')}
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">{t('admin.billingTab.paymentMethod')}</CardTitle>
            <Button variant="outline" size="sm">{t('admin.billingTab.update')}</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{t('admin.billingTab.cardEnding', { last4: '4242' })}</p>
              <p className="text-sm text-muted-foreground">{t('admin.billingTab.expires', { date: '12/2025' })}</p>
            </div>
            <Badge variant="outline">{t('admin.billingTab.default')}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing History with CRUD */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('admin.billingTab.billingHistory')}</CardTitle>
          <CardDescription>
            {t('admin.billingTab.manageInvoices')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTableOrganism
            {...{
              data: invoices,
              schema: billingSchema.fields,
              moduleId: "admin",
              tabSlug: "billing",
              workspaceId: '',
              onCreate: handleCreate,
              onUpdate: handleUpdate,
              onDelete: handleDelete,
              loading: false
            } as any}
          />
        </CardContent>
      </Card>
    </div>
  )
}
