"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  CreditCard, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Users,
  Database,
  Shield
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Invoice {
  id: string
  date: string
  amount: number
  status: "paid" | "pending" | "failed"
  description: string
}

export function BillingTab() {
  const { toast } = useToast()
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")

  const currentPlan = {
    name: "Professional",
    price: 49,
    billingCycle: "monthly",
    nextBillingDate: "2024-02-20",
    users: 10,
    storage: 100,
  }

  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      date: "2024-01-20",
      amount: 49.00,
      status: "paid",
      description: "Professional Plan - January 2024",
    },
    {
      id: "INV-002",
      date: "2023-12-20",
      amount: 49.00,
      status: "paid",
      description: "Professional Plan - December 2023",
    },
    {
      id: "INV-003",
      date: "2023-11-20",
      amount: 49.00,
      status: "paid",
      description: "Professional Plan - November 2023",
    },
  ])

  const plans = [
    {
      id: "network",
      name: "Network",
      price: 0,
      annualPrice: 0,
      description: "Free Forever - Perfect for individuals getting started",
      features: [
        "Up to 5 users",
        "5GB storage",
        "Ambassador & Passenger roles",
        "Basic projects & events",
        "Email support",
      ],
    },
    {
      id: "crew",
      name: "Crew",
      price: 10,
      annualPrice: 12,
      description: "For small teams and freelancers",
      features: [
        "Up to 15 users",
        "25GB storage",
        "Merchant, Raider & Visitor roles",
        "Projects, events, assets & files",
        "Integrations",
        "Email support",
      ],
    },
    {
      id: "team",
      name: "Team",
      price: 20,
      annualPrice: 24,
      description: "For growing teams",
      features: [
        "Up to 30 users",
        "50GB storage",
        "Deviator role + all lower roles",
        "Analytics & reporting",
        "Advanced integrations",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: 30,
      annualPrice: 36,
      description: "For professional teams with advanced needs",
      features: [
        "Up to 50 users",
        "100GB storage",
        "Navigator role + all lower roles",
        "Finance & procurement modules",
        "Advanced reporting",
        "Priority support",
      ],
    },
    {
      id: "core",
      name: "Core",
      price: 50,
      annualPrice: 60,
      description: "Core capabilities for established organizations",
      features: [
        "Up to 100 users",
        "250GB storage",
        "Aviator role + all lower roles",
        "All modules included",
        "Custom branding",
        "Custom workflows",
        "Priority support",
      ],
    },
    {
      id: "executive",
      name: "Executive",
      price: 100,
      annualPrice: 120,
      description: "For large organizations with executive oversight",
      features: [
        "Unlimited users",
        "1TB storage",
        "Phantom role + all roles",
        "White-label options",
        "SSO & SAML",
        "API access",
        "24/7 dedicated support",
        "Custom integrations",
      ],
    },
  ]

  const handleUpgrade = (planId: string) => {
    setSelectedPlan(planId)
    setUpgradeDialogOpen(true)
  }

  const handleConfirmUpgrade = () => {
    toast({
      title: "Plan upgraded",
      description: `Successfully upgraded to ${plans.find(p => p.id === selectedPlan)?.name} plan.`,
    })
    setUpgradeDialogOpen(false)
  }

  const handleDownloadInvoice = (invoice: Invoice) => {
    toast({
      title: "Download started",
      description: `Downloading invoice ${invoice.id}`,
    })
  }

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>
      case "pending":
        return <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>
      case "failed":
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Failed</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Current Plan
          </CardTitle>
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
                Users
              </div>
              <p className="text-2xl font-bold">{currentPlan.users}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Database className="h-4 w-4" />
                Storage
              </div>
              <p className="text-2xl font-bold">{currentPlan.storage}GB</p>
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
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Method
              </CardTitle>
              <CardDescription className="mt-2">
                Manage your payment methods
              </CardDescription>
            </div>
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

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Available Plans</CardTitle>
              <CardDescription>
                Choose the plan that&apos;s right for you
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              <Button
                variant={billingCycle === "monthly" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </Button>
              <Button
                variant={billingCycle === "annual" ? "default" : "ghost"}
                size="sm"
                onClick={() => setBillingCycle("annual")}
              >
                Annual
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const displayPrice = billingCycle === "annual" ? plan.annualPrice : plan.price
              const isCurrentPlan = plan.id === "professional"
              
              return (
                <Card key={plan.id} className={plan.popular ? "border-primary shadow-lg" : ""}>
                  <CardHeader>
                    {plan.popular && (
                      <Badge className="w-fit mb-2">Most Popular</Badge>
                    )}
                    {plan.price === 0 && (
                      <Badge variant="secondary" className="w-fit mb-2">Free Forever</Badge>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">${displayPrice}</span>
                      <span className="text-muted-foreground">
                        /{billingCycle === "annual" ? "year" : "month"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={isCurrentPlan ? "default" : "outline"}
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? "Current Plan" : plan.price === 0 ? "Downgrade" : "Upgrade"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
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
                    <p className="font-medium">{invoice.description}</p>
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
                    {getStatusBadge(invoice.status)}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Usage This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Team Members</span>
                <span className="text-sm text-muted-foreground">4 / {currentPlan.users}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "40%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-muted-foreground">42GB / {currentPlan.storage}GB</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "42%" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Plan</DialogTitle>
            <DialogDescription>
              Confirm your plan upgrade
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedPlan && (
              <>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Upgrading to</p>
                  <p className="text-xl font-bold">
                    {plans.find(p => p.id === selectedPlan)?.name}
                  </p>
                  <p className="text-2xl font-bold mt-2">
                    ${billingCycle === "annual" 
                      ? plans.find(p => p.id === selectedPlan)?.annualPrice 
                      : plans.find(p => p.id === selectedPlan)?.price}
                    <span className="text-sm text-muted-foreground font-normal">
                      /{billingCycle === "annual" ? "year" : "month"}
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">What&apos;s included:</p>
                  <ul className="space-y-1">
                    {plans.find(p => p.id === selectedPlan)?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    Your card will be charged immediately. The new plan takes effect right away.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmUpgrade}>
              Confirm Upgrade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
