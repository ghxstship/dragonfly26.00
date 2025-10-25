"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Plus, Link2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Dependency, DependencyType, DataItem } from "@/types"

interface DependenciesManagerProps {
  itemId: string
  itemType: string
  dependencies: Dependency[]
  availableItems: DataItem[]
  onDependenciesChange: (dependencies: Dependency[]) => void
}

const getDependencyTypes = (t: any): { value: DependencyType; label: string; description: string }[] => [
  {
    value: "blocks",
    label: t('dependencies.blocksTitle'),
    description: t('dependencies.blocksDescription'),
  },
  {
    value: "blocked_by",
    label: t('dependencies.blockedByTitle'),
    description: t('dependencies.blockedByDescription'),
  },
  {
    value: "relates_to",
    label: t('dependencies.relatesTitle'),
    description: t('dependencies.relatesDescription'),
  },
  {
    value: "duplicates",
    label: t('dependencies.duplicateTitle'),
    description: t('dependencies.duplicateDescription'),
  },
]

export function DependenciesManager({
  itemId,
  itemType,
  dependencies,
  availableItems,
  onDependenciesChange,
}: DependenciesManagerProps) {
  const t = useTranslations()
  const [open, setOpen] = useState(false)
  const DEPENDENCY_TYPES = getDependencyTypes(t)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState("")
  const [dependencyType, setDependencyType] = useState<DependencyType>("blocks")
  const [lagDays, setLagDays] = useState(0)

  const addDependency = () => {
    if (!selectedItemId) return

    const newDependency: Dependency = {
      id: `dep-${Date.now()}`,
      from_item_id: itemId,
      from_item_type: itemType,
      to_item_id: selectedItemId,
      to_item_type: itemType,
      dependency_type: dependencyType,
      lag_days: lagDays,
      created_by: "current-user",
      created_at: new Date().toISOString(),
    }

    onDependenciesChange([...dependencies, newDependency])
    setSelectedItemId("")
    setLagDays(0)
    setIsAdding(false)
  }

  const removeDependency = (depId: string) => {
    onDependenciesChange(dependencies.filter((d: any) => d.id !== depId))
  }

  const getItemName = (depItemId: string) => {
    const item = availableItems.find((i) => i.id === depItemId)
    return item?.name || item?.title || t('dependencies.unknownItem')
  }

  const hasBlockedDependencies = dependencies.some(
    (d) => d.to_item_id === itemId && d.dependency_type === "blocked_by"
  )

  return (
    <div className="space-y-4">
      {/* Warning if blocked */}
      {hasBlockedDependencies && (
        <div className="flex flex-wrap flex-col md:flex-row items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            This item is blocked. Complete blocking items before marking this as done.
          </div>
        </div>
      )}

      {/* Dependencies List */}
      <div className="space-y-2">
        {dependencies.map((dep) => {
          const isFromCurrent = dep.from_item_id === itemId
          const relatedItemId = isFromCurrent ? dep.to_item_id : dep.from_item_id
          const relatedItemName = getItemName(relatedItemId)

          return (
            <div
              key={dep.id}
              className="flex flex-col md:flex-row items-center gap-2 p-2 border rounded-lg hover:bg-accent"
            >
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 text-sm">
                <span className="font-medium capitalize">
                  {dep.dependency_type.replace(/_/g, " ")}
                </span>
                {" "}
                <span className="text-muted-foreground">{relatedItemName}</span>
                {dep.lag_days > 0 && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (+{dep.lag_days} days)
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeDependency(dep.id)}
              >
                Remove
              </Button>
            </div>
          )
        })}

        {dependencies.length === 0 && (
          <div className="text-center py-6 text-sm text-muted-foreground">
            No dependencies yet
          </div>
        )}
      </div>

      {/* Add Dependency */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2 max-w-full">
            <Plus className="h-4 w-4" />
            Add Dependency
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Dependency Type</Label>
              <Select
                value={dependencyType}
                onValueChange={(value: DependencyType) => setDependencyType(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DEPENDENCY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div>{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Related Item</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder={t('dependencies.selectItem')} />
                </SelectTrigger>
                <SelectContent>
                  {availableItems
                    .filter((item: any) => item.id !== itemId)
                    .map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name || item.title || "Untitled"}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {(dependencyType === "blocks" || dependencyType === "blocked_by") && (
              <div className="space-y-2">
                <Label>Lag Time (days)</Label>
                <Input
                  type="number"
                  min="0"
                  value={lagDays}
                  onChange={(e) => setLagDays(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground">
                  Optional delay between dependencies
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={addDependency} className="flex-1">
                Add Dependency
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
