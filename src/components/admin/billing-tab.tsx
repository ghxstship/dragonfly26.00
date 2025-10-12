"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  Download,
  Users,
  Database,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function BillingTab() {
  const { toast } = useToast()

  const currentPlan = {
    name: "Enterprise",
    price: 99,
    billingCycle: "monthly",
    nextBillingDate: "2024-02-20",
    seats: 50,
    usedSeats: 42,
    storage: 1000,
    usedStorage: 640,
  }

  const invoices = [
    { id: "INV-001", date: "2024-01-20", amount: 99.00, status: "paid" as const },
    { id: "INV-002", date: "2023-12-20", amount: 99.00, status: "paid" as const },
    { id: "INV-003", date: "2023-11-20", amount: 99.00, status: "paid" as const },
  ]

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
              <p className="text-muted-foreground mt-1">
                ${currentPlan.price}/{currentPlan.billingCycle}
              </p>
            </div>
            <Badge variant="default" className="text-base px-4 py-1">Active</Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                Team Seats
              </div>
              <p className="text-2xl font-bold">{currentPlan.usedSeats} / {currentPlan.seats}</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary" style={{ width: `${(currentPlan.usedSeats / currentPlan.seats) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                Storage
              </div>
              <p className="text-2xl font-bold">{currentPlan.usedStorage} / {currentPlan.storage}GB</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary" style={{ width: `${(currentPlan.usedStorage / currentPlan.storage) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Next Billing
              </div>
              <p className="text-2xl font-bold">
                {new Date(currentPlan.nextBillingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>

          <Button className="w-full" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-base">Payment Method</CardTitle>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-muted-foreground">Expires 12/2025</p>
            </div>
            <Badge variant="outline">Default</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Billing History</CardTitle>
          <CardDescription>
            Download your past invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(invoice.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${invoice.amount.toFixed(2)}</p>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Paid
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
