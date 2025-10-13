"use client"

import { X, Trash2, Plus, Minus, ShoppingCart } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface CartItem {
  id: string
  name: string
  price: string
  quantity: number
  stock?: string
  assignee_name?: string
}

interface MarketplaceCartDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cartItems: CartItem[]
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemoveItem?: (id: string) => void
  onCheckout?: () => void
}

export function MarketplaceCartDrawer({
  open,
  onOpenChange,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: MarketplaceCartDrawerProps) {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
      return total + (price * item.quantity)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const tax = subtotal * 0.08 // 8% tax
  const shipping = subtotal > 500 ? 0 : 25
  const total = subtotal + tax + shipping

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:max-w-[500px] p-0 flex flex-col">
        {/* Header */}
        <SheetHeader className="border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <SheetTitle className="text-xl">Shopping Cart</SheetTitle>
              <Badge variant="secondary">{cartItems.length} items</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-lg">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground">
                    Add items from the marketplace to get started
                  </p>
                </div>
                <Button onClick={() => onOpenChange(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="space-y-3">
                      <div className="flex gap-4">
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded flex items-center justify-center flex-shrink-0">
                          <ShoppingCart className="h-8 w-8 text-muted-foreground/30" />
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-sm line-clamp-2">{item.name}</p>
                              {item.assignee_name && (
                                <p className="text-xs text-muted-foreground">by {item.assignee_name}</p>
                              )}
                              {item.stock && (
                                <p className="text-xs text-muted-foreground">{item.stock} available</p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onRemoveItem?.(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity?.(item.id, Math.max(1, item.quantity - 1))}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="font-bold">{item.price}</p>
                          </div>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Summary */}
              <div className="border-t">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Shipping</span>
                        {shipping === 0 && (
                          <Badge variant="secondary" className="text-xs">Free</Badge>
                        )}
                      </div>
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">Total</span>
                      <span className="font-bold text-2xl">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-xs text-blue-600">
                        Add ${(500 - subtotal).toFixed(2)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <Button className="w-full" size="lg" onClick={onCheckout}>
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
