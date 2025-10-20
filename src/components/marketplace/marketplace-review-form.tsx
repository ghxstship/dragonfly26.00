"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, Upload, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReviewFormProps {
  productId: string
  productName: string
  orderId?: string
  open: boolean
  onClose: () => void
  onSubmit?: (review: ReviewSubmission) => Promise<void>
}

export interface ReviewSubmission {
  product_id: string
  order_id?: string
  rating: number
  title: string
  body: string
  photos: string[]
  is_verified_purchase: boolean
}

export function ReviewForm({
  productId,
  productName,
  orderId,
  open,
  onClose,
  onSubmit
}: ReviewFormProps) {
  const t = useTranslations()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [photos, setPhotos] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0 || !body.trim()) {
      return
    }

    setLoading(true)

    try {
      const reviewData: ReviewSubmission = {
        product_id: productId,
        order_id: orderId,
        rating,
        title: title.trim(),
        body: body.trim(),
        photos,
        is_verified_purchase: !!orderId
      }

      await onSubmit?.(reviewData)
      setSubmitted(true)

      // Reset form after brief delay
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (error: any) {
      console.error('Failed to submit review:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoverRating(0)
    setTitle('')
    setBody('')
    setPhotos([])
    setSubmitted(false)
    onClose()
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    // In real implementation, upload files to storage and get URLs
    // For now, create object URLs for preview
    const newPhotos = files.map(file => URL.createObjectURL(file))
    setPhotos([...photos, ...newPhotos].slice(0, 5)) // Max 5 photos
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Thank you for your review!</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your review will be published after moderation.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {productName}
            {orderId && (
              <Badge variant="secondary" className="ml-2">
                Verified Purchase
              </Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Rating */}
          <div className="space-y-2">
            <Label>Overall Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star: any) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoverRating || rating) >= star
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-muted-foreground">
                {rating === 5 && "Excellent!"}
                {rating === 4 && "Very Good"}
                {rating === 3 && "Good"}
                {rating === 2 && "Fair"}
                {rating === 1 && "Poor"}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (Optional)</Label>
            <Input
              id="title"
              placeholder={t('marketplace.review.titlePlaceholder')}
              value={title as any}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">
              {title.length}/100
            </p>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">Your Review *</Label>
            <Textarea
              id="body"
              placeholder={t('marketplace.review.descriptionPlaceholder')}
              value={body as any}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {body.length}/2000
            </p>
          </div>

          {/* Photos */}
          <div className="space-y-2">
            <Label>Add Photos (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Help others by adding photos of the product. Max 5 photos.
            </p>
            
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative group h-20 w-20">
                  <Image
                    src={photo}
                    alt={`Upload ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    sizes="80px"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="h-20 w-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-6 w-6 text-muted-foreground/50" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={rating === 0 || !body.trim() || loading}
              className="flex-1"
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
