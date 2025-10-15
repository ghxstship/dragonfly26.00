"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export interface ProductOption {
  id: string
  name: string
  position: number
  values: string[]
}

export interface ProductVariant {
  id: string
  title: string
  option1: string | null
  option2: string | null
  option3: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  barcode: string | null
  inventory_quantity: number
  available_for_sale: boolean
  image_url: string | null
}

interface VariantSelectorProps {
  productId: string
  options?: ProductOption[]
  variants?: ProductVariant[]
  onVariantChange?: (variant: ProductVariant | null) => void
  defaultVariantId?: string
  className?: string
}

export function VariantSelector({
  productId,
  options = [],
  variants = [],
  onVariantChange,
  defaultVariantId,
  className
}: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null)

  // Initialize with first available options or default variant
  useEffect(() => {
    if (defaultVariantId && variants.length > 0) {
      const defaultVar = variants.find(v => v.id === defaultVariantId)
      if (defaultVar) {
        const initial: Record<string, string> = {}
        if (defaultVar.option1) initial['option1'] = defaultVar.option1
        if (defaultVar.option2) initial['option2'] = defaultVar.option2
        if (defaultVar.option3) initial['option3'] = defaultVar.option3
        setSelectedOptions(initial)
      }
    } else if (options.length > 0 && variants.length > 0) {
      // Auto-select first available option for each
      const initial: Record<string, string> = {}
      options.forEach(opt => {
        const key = `option${opt.position}`
        if (opt.values.length > 0) {
          initial[key] = opt.values[0]
        }
      })
      setSelectedOptions(initial)
    }
  }, [defaultVariantId, options, variants])

  // Find matching variant when options change
  useEffect(() => {
    if (variants.length === 0) {
      setCurrentVariant(null)
      onVariantChange?.(null)
      return
    }

    const matchingVariant = variants.find(v => {
      const matches = []
      if (selectedOptions['option1']) matches.push(v.option1 === selectedOptions['option1'])
      if (selectedOptions['option2']) matches.push(v.option2 === selectedOptions['option2'])
      if (selectedOptions['option3']) matches.push(v.option3 === selectedOptions['option3'])
      return matches.every(m => m)
    })

    setCurrentVariant(matchingVariant || null)
    onVariantChange?.(matchingVariant || null)
  }, [selectedOptions, variants, onVariantChange])

  const handleOptionChange = (position: number, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [`option${position}`]: value
    }))
  }

  const isOptionAvailable = (position: number, value: string): boolean => {
    // Check if selecting this value would result in an available variant
    const testOptions = { ...selectedOptions, [`option${position}`]: value }
    return variants.some(v => {
      const matches = []
      if (testOptions['option1']) matches.push(v.option1 === testOptions['option1'])
      if (testOptions['option2']) matches.push(v.option2 === testOptions['option2'])
      if (testOptions['option3']) matches.push(v.option3 === testOptions['option3'])
      return matches.every(m => m) && v.available_for_sale && v.inventory_quantity > 0
    })
  }

  if (options.length === 0 || variants.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {options.map((option) => {
          const key = `option${option.position}`
          return (
            <div key={option.id}>
              <label className="text-sm font-medium mb-2 block">
                {option.name}
                {selectedOptions[key] && (
                  <span className="ml-2 text-muted-foreground">
                    {selectedOptions[key]}
                  </span>
                )}
              </label>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selectedOptions[key] === value
                  const isAvailable = isOptionAvailable(option.position, value)
                  
                  return (
                    <Button
                      key={value}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      className="relative"
                      onClick={() => handleOptionChange(option.position, value)}
                      disabled={!isAvailable}
                    >
                      {value}
                      {isSelected && (
                        <Check className="ml-1 h-3 w-3" />
                      )}
                      {!isAvailable && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-full bg-muted-foreground rotate-45" />
                        </span>
                      )}
                    </Button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {currentVariant && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">SKU:</span>
            <span className="font-mono">{currentVariant.sku || 'N/A'}</span>
          </div>
          
          {currentVariant.compare_at_price && currentVariant.compare_at_price > currentVariant.price && (
            <div className="flex items-center justify-between">
              <span className="text-sm line-through text-muted-foreground">
                ${currentVariant.compare_at_price.toFixed(2)}
              </span>
              <Badge variant="secondary" className="bg-green-600 text-white">
                Save ${(currentVariant.compare_at_price - currentVariant.price).toFixed(2)}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Availability:</span>
            {currentVariant.inventory_quantity > 0 ? (
              <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                {currentVariant.inventory_quantity} in stock
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                Out of stock
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
