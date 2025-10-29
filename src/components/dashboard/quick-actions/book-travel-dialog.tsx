"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/lib/hooks/use-toast"

interface BookTravelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  userId: string
  onSuccess?: () => void
}

export function BookTravelDialog({ open, onOpenChange, workspaceId, userId, onSuccess }: BookTravelDialogProps) {
  const [loading, setLoading] = useState(false)
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [formData, setFormData] = useState({
    destination: '',
    purpose: '',
    travelType: 'flight',
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!departureDate) {
      alert('Please select a departure date')
      return
    }
    
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('travel_itineraries')
        .insert({
          workspace_id: workspaceId,
          traveler_id: userId,
          destination_city: formData.destination,
          origin_city: formData.purpose,
          transportation_type: formData.travelType,
          departure_date: format(departureDate, 'yyyy-MM-dd HH:mm:ssXXX'),
          arrival_date: returnDate ? format(returnDate, 'yyyy-MM-dd HH:mm:ssXXX') : format(departureDate, 'yyyy-MM-dd HH:mm:ssXXX'),
          notes: formData.notes,
          status: 'pending'
        })

      if (error) throw error

      // Reset form
      setFormData({
        destination: '',
        purpose: '',
        travelType: 'flight',
        notes: ''
      })
      setDepartureDate(undefined)
      setReturnDate(undefined)
      
      onOpenChange(false)
      onSuccess?.()
      
      toast({
        title: "Travel request submitted",
        description: `Your travel request to ${formData.destination} has been submitted for approval.`,
      })
    } catch (error: any) {
      console.error('Error booking travel:', error)
      toast({
        title: "Failed to submit travel request",
        description: error instanceof Error ? (error as any).message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
              <Plane className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle>Book Travel</DialogTitle>
              <DialogDescription>
                Submit a travel request for approval
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination *</Label>
            <Input
              id="destination"
              placeholder="e.g. New York, NY"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input
              id="purpose"
              placeholder="e.g. Client meeting, Conference"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelType">Travel Type *</Label>
            <Select value={formData.travelType} onValueChange={(value) => setFormData({ ...formData, travelType: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flight">Flight</SelectItem>
                <SelectItem value="train">Train</SelectItem>
                <SelectItem value="car">Car/Rental</SelectItem>
                <SelectItem value="accommodation">Accommodation</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label>Departure Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={setDepartureDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP") : <span>Pick date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => departureDate ? date < departureDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Input
              id="notes"
              placeholder="Special requirements, preferences, etc."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
