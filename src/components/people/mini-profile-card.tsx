"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Mail, 
  Phone, 
  User,
  Clock,
  Calendar,
  ExternalLink 
} from "lucide-react"
import { StatusBadge, EmploymentTypeBadge, StatusDot } from "./status-badge"

interface MiniProfileCardProps {
  personnel: {
    id: string
    name: string
    title: string
    department: string
    email: string
    phone?: string
    avatar?: string
    manager?: string
    employmentStatus: string
    employmentType: string
    ptoAvailable?: number
    isClockedIn?: boolean
  }
  onViewFullProfile?: () => void
  className?: string
}

export function MiniProfileCard({
  personnel,
  onViewFullProfile,
  className
}: MiniProfileCardProps) {
  const initials = personnel.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={personnel.avatar} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{personnel.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {personnel.title}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {personnel.department}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Contact Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <a 
              href={`mailto:${personnel.email}`} 
              className="text-primary hover:underline truncate"
            >
              {personnel.email}
            </a>
          </div>
          {personnel.phone && (
            <div className="flex items-center gap-2 text-xs">
              <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <a 
                href={`tel:${personnel.phone}`}
                className="text-primary hover:underline"
              >
                {personnel.phone}
              </a>
            </div>
          )}
          {personnel.manager && (
            <div className="flex items-center gap-2 text-xs">
              <User className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-muted-foreground">
                Manager: <span className="text-foreground">{personnel.manager}</span>
              </span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Status & Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Status:</span>
            <StatusBadge 
              type="employment" 
              status={personnel.employmentStatus}
            />
            <EmploymentTypeBadge type={personnel.employmentType} />
          </div>

          {personnel.isClockedIn !== undefined && (
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">
                {personnel.isClockedIn ? (
                  <span className="flex items-center gap-1">
                    <StatusDot status="success" size="sm" />
                    <span className="text-green-600 font-medium">Clocked In</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Clocked Out</span>
                )}
              </span>
            </div>
          )}

          {personnel.ptoAvailable !== undefined && (
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                PTO: <span className="font-medium text-foreground">{personnel.ptoAvailable} days</span> available
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        {onViewFullProfile && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onViewFullProfile}
          >
            View Full Profile
            <ExternalLink className="h-3 w-3 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Hover popover version (lightweight)
export function MiniProfilePopover({
  personnel,
  children
}: {
  personnel: MiniProfileCardProps['personnel']
  children: React.ReactNode
}) {
  return (
    <div className="group relative inline-block">
      {children}
      <div className="absolute z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 left-0 top-full mt-2 w-80">
        <MiniProfileCard personnel={personnel} />
      </div>
    </div>
  )
}
