"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { RecordActionsMenu } from "./record-actions-menu"
import type { DataItem } from "@/types"
import type { FieldSchema } from "@/lib/data-schemas"

interface MobileTableCardProps {
  item: DataItem
  schema: FieldSchema[]
  onViewDetails: (item: DataItem) => void
  onEdit: (item: DataItem) => void
  onDuplicate: (item: DataItem) => void
  onDelete: (id: string) => void
}

export function MobileTableCard({
  item,
  schema,
  onViewDetails,
  onEdit,
  onDuplicate,
  onDelete,
}: MobileTableCardProps) {
  // Get display fields (max 4 for mobile)
  const displayFields = schema
    .filter(f => f.showInList !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .slice(0, 4)

  const renderFieldValue = (value: any, field: FieldSchema) => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">—</span>

    switch (field.type) {
      case 'status':
      case 'priority':
      case 'label':
        const option = field.options?.find(opt => opt.value === value)
        return (
          <Badge 
            variant="secondary" 
            style={{ backgroundColor: option?.color + '20', color: option?.color }}
            className="text-xs"
          >
            {option?.label || value}
          </Badge>
        )
      
      case 'date':
        return <span className="text-sm">{new Date(value).toLocaleDateString()}</span>
      
      case 'currency':
        return <span className="text-sm font-medium">${value.toLocaleString()}</span>
      
      case 'tags':
      case 'multiselect':
        if (!Array.isArray(value)) return null
        return (
          <div className="flex flex-wrap gap-1">
            {value.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {value.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{value.length - 2}
              </Badge>
            )}
          </div>
        )
      
      default:
        return <span className="text-sm line-clamp-1">{String(value)}</span>
    }
  }

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onViewDetails(item)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title/Name field - prominently displayed */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base line-clamp-2">
                {item.name || item.title || item.id}
              </h3>
            </div>
            <RecordActionsMenu
              onViewDetails={() => onViewDetails(item)}
              onEdit={() => onEdit(item)}
              onDuplicate={() => onDuplicate(item)}
              onDelete={() => onDelete(item.id)}
            />
          </div>

          {/* Key fields */}
          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-3">
            {displayFields.map((field) => {
              const value = item[field.id]
              if (value === null || value === undefined) return null
              
              return (
                <div key={field.id} className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">
                    {field.label}
                  </p>
                  {renderFieldValue(value, field)}
                </div>
              )
            })}
          </div>

          {/* Timestamps */}
          {(item.created_at || item.updated_at) && (
            <div className="text-xs text-muted-foreground pt-2 border-t">
              {item.updated_at && (
                <span>Updated {new Date(item.updated_at).toLocaleDateString()}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
