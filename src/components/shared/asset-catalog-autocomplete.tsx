"use client"

import { useState, useEffect, useRef } from "react"
import { Check, Loader2, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCatalogAutocomplete } from "@/hooks/use-asset-catalog"
import { cn } from "@/lib/utils"

interface AssetCatalogAutocompleteProps {
  label: string
  description?: string
  required?: boolean
  value?: string
  assetCategory?: string
  onChange: (value: string, selectedItem?: any) => void
}

export function AssetCatalogAutocomplete({
  label,
  description,
  required,
  value = '',
  assetCategory,
  onChange
}: AssetCatalogAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const {
    query,
    setQuery,
    suggestions,
    loading,
    clearSuggestions
  } = useCatalogAutocomplete(assetCategory, 300)

  // Update internal state when value prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Trigger search when input changes
  useEffect(() => {
    setQuery(inputValue)
    if (inputValue.length >= 2) {
      setShowSuggestions(true)
      setSelectedIndex(-1)
    } else {
      setShowSuggestions(false)
    }
  }, [inputValue, setQuery])

  const handleSelect = (suggestion: any) => {
    setInputValue(suggestion.name)
    onChange(suggestion.name, suggestion)
    setShowSuggestions(false)
    clearSuggestions()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  const handleClear = async () => {
    setInputValue('')
    onChange('')
    clearSuggestions()
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        break
    }
  }

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        })
      }
    }
  }, [selectedIndex])

  return (
    <div className="grid gap-2 relative">
      <Label htmlFor="asset-autocomplete">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
        <Input
          ref={inputRef}
          id="asset-autocomplete"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length >= 2 && suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          placeholder="Search from catalog or enter new item"
          required={required}
          className="pl-9 pr-20"
        />
        <div className="absolute sm:relative sm:inset-auto right-2 top-1/2 -translate-y-1/2 flex flex-wrap flex-col md:flex-row items-center gap-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {inputValue && !loading && (
            <button
              type="button"
              onClick={handleClear}
              className="hover:bg-muted rounded p-1"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute sm:relative sm:inset-auto top-full left-0 right-0 mt-1 z-50 sm:relative sm:inset-auto">
          <ul
            ref={listRef}
            className="bg-popover border rounded-md shadow-md max-h-[300px] overflow-y-auto"
          >
            {suggestions.map((suggestion: any, index: number) => (
              <li
                key={suggestion.id}
                className={cn(
                  "px-4 py-3 cursor-pointer hover:bg-accent transition-colors border-b last:border-b-0",
                  selectedIndex === index && "bg-accent"
                )}
                onClick={() => handleSelect(suggestion)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{suggestion.name}</div>
                    <div className="text-xs text-muted-foreground flex flex-wrap flex-col md:flex-row items-center gap-2 mt-1">
                      {suggestion.manufacturer && (
                        <span>{suggestion.manufacturer}</span>
                      )}
                      {suggestion.category && (
                        <>
                          <span>•</span>
                          <span className="capitalize">{suggestion.category}</span>
                        </>
                      )}
                    </div>
                  </div>
                  {selectedIndex === index && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results message */}
      {showSuggestions && !loading && inputValue.length >= 2 && suggestions.length === 0 && (
        <div className="absolute sm:relative sm:inset-auto top-full left-0 right-0 mt-1 z-50 sm:relative sm:inset-auto">
          <div className="bg-popover border rounded-md shadow-md p-4 text-sm text-muted-foreground">
            No catalog items found. You can still enter a custom item name.
          </div>
        </div>
      )}
    </div>
  )
}
