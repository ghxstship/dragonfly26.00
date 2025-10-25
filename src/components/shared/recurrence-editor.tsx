"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Repeat, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { ItemRecurrence, RecurrenceFrequency } from "@/types"

interface RecurrenceEditorProps {
  recurrence?: ItemRecurrence | null
  onRecurrenceChange: (recurrence: ItemRecurrence | null) => void
}

const WEEKDAYS = [
  { label: "Sun", value: 0 },
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
]

export function RecurrenceEditor({ recurrence, onRecurrenceChange }: RecurrenceEditorProps) {
  const t = useTranslations()
  const [isEditing, setIsEditing] = useState(false)
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(
    recurrence?.frequency || "weekly"
  )
  const [interval, setInterval] = useState(recurrence?.interval || 1)
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>(
    recurrence?.by_weekday || [1]
  )
  const [endType, setEndType] = useState<"never" | "date" | "count">("never")
  const [endDate, setEndDate] = useState("")
  const [endCount, setEndCount] = useState(10)

  const handleSave = async () => {
    const newRecurrence: ItemRecurrence = {
      id: recurrence?.id || `recurrence-${Date.now()}`,
      item_id: "current-item",
      item_type: "task",
      frequency,
      interval,
      by_weekday: frequency === "weekly" ? selectedWeekdays : undefined,
      end_date: endType === "date" ? endDate : undefined,
      end_after_occurrences: endType === "count" ? endCount : undefined,
      is_active: true,
      created_at: recurrence?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    onRecurrenceChange(newRecurrence)
    setIsEditing(false)
  }

  const handleRemove = async () => {
    onRecurrenceChange(null)
    setIsEditing(false)
  }

  const toggleWeekday = (day: number) => {
    setSelectedWeekdays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    )
  }

  const getRecurrenceLabel = () => {
    if (!recurrence) return t('recurrence.notRecurring')

    const parts = []
    parts.push(`Every ${recurrence.interval > 1 ? recurrence.interval : ""}`)
    parts.push(recurrence.frequency)
    
    if (recurrence.by_weekday && recurrence.by_weekday.length > 0) {
      const days = recurrence.by_weekday
        .map((d) => WEEKDAYS[d].label)
        .join(", ")
      parts.push(`on ${days}`)
    }

    return parts.join(" ")
  }

  return (
    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
      {recurrence && (
        <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
          <Repeat className="h-4 w-4" />
          <span>{getRecurrenceLabel()}</span>
        </div>
      )}

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogTrigger asChild>
          <Button variant={recurrence ? "ghost" : "outline"} size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {recurrence ? t('common.edit') : t('recurrence.setRecurrence')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Recurrence</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {/* Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
              <div className="space-y-2">
                <Label>Repeat every</Label>
                <Input
                  type="number"
                  min="1"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={frequency}
                  onValueChange={(value: RecurrenceFrequency) => setFrequency(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Day(s)</SelectItem>
                    <SelectItem value="weekly">Week(s)</SelectItem>
                    <SelectItem value="monthly">Month(s)</SelectItem>
                    <SelectItem value="yearly">Year(s)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weekly: Select days */}
            {frequency === "weekly" && (
              <div className="space-y-2">
                <Label>Repeat on</Label>
                <div className="flex flex-wrap gap-2">
                  {WEEKDAYS.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => toggleWeekday(day.value)}
                      className={`h-10 w-10 rounded-full border ${
                        selectedWeekdays.includes(day.value)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-input hover:bg-accent"
                      }`}
                    >
                      {day.label[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* End condition */}
            <div className="space-y-2">
              <Label>Ends</Label>
              <Select value={endType} onValueChange={(value: any) => setEndType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="date">On date</SelectItem>
                  <SelectItem value="count">After occurrences</SelectItem>
                </SelectContent>
              </Select>

              {endType === "date" && (
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              )}

              {endType === "count" && (
                <Input
                  type="number"
                  min="1"
                  value={endCount}
                  onChange={(e) => setEndCount(parseInt(e.target.value) || 1)}
                  placeholder={t('recurrence.numberOfOccurrences')}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {recurrence && (
                <Button
                  variant="destructive"
                  onClick={handleRemove}
                  className="flex-1"
                >
                  Remove Recurrence
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex-1">
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
