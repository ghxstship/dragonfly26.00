"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Camera, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface CountExecutionMobileProps {
  items: Array<{
    id: string
    name: string
    sku: string
    photos: string[]
    expected_quantity: number
    location: string
  }>
  onCountSubmit: (itemId: string, countedQty: number) => void
}

export function CountExecutionMobile({ items, onCountSubmit }: CountExecutionMobileProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [countedQty, setCountedQty] = useState('')

  const currentItem = items[currentIndex]
  const progress = ((currentIndex + 1) / items.length) * 100

  const handleNext = async () => {
    if (countedQty) {
      onCountSubmit(currentItem.id, parseInt(countedQty))
      setCountedQty('')
    }
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setCountedQty('')
    }
  }

  const handleNumberPad = (num: string) => {
    if (num === 'clear') {
      setCountedQty('')
    } else if (num === 'backspace') {
      setCountedQty(prev => prev.slice(0, -1))
    } else {
      setCountedQty(prev => prev + num)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Progress Bar */}
      <div className="bg-primary h-1" style={{ width: `${progress}%`, transition: 'width 0.3s' }} />

      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Counting Items</h3>
          <Badge variant="secondary">
            {currentIndex + 1} of {items.length}
          </Badge>
        </div>
      </div>

      {/* Item Display */}
      <div className="flex-1 overflow-auto p-4">
        <Card className="p-4">
          {/* Photo */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
            {currentItem.photos?.[0] ? (
              <Image
                src={currentItem.photos[0]}
                alt={currentItem.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Item Info */}
          <div className="space-y-2 mb-4">
            <h2 className="text-xl font-bold">{currentItem.name}</h2>
            <p className="text-sm text-muted-foreground">SKU: {currentItem.sku}</p>
            {currentItem.location && (
              <p className="text-sm text-muted-foreground">📍 {currentItem.location}</p>
            )}
          </div>

          {/* Expected vs Counted */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Expected</p>
              <p className="text-2xl font-bold">{currentItem.expected_quantity}</p>
            </div>
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Counted</p>
              <p className="text-2xl font-bold text-primary">{countedQty || '0'}</p>
            </div>
          </div>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'backspace'].map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                className="h-16 text-xl font-semibold"
                onClick={() => handleNumberPad(num)}
              >
                {num === 'clear' ? 'C' : num === 'backspace' ? '⌫' : num}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="flex-1" onClick={handlePrevious} disabled={currentIndex === 0}>
              <ChevronLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>
            <Button size="lg" className="flex-1" onClick={handleNext}>
              {currentIndex < items.length - 1 ? (
                <>
                  Next
                  <ChevronRight className="h-5 w-5 ml-2" />
                </>
              ) : (
                'Complete'
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full" size="lg">
          <Camera className="h-5 w-5 mr-2" />
          Scan Barcode
        </Button>
      </div>
    </div>
  )
}
