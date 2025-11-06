"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Send, 
  Upload, 
  UserPlus, 
  X,
  FileText,
  Users,
  Plus
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

export function InviteTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [message, setMessage] = useState("")
  const [invites, setInvites] = useState<Array<{ email: string; role: string }>>([])
  const [bulkEmails, setBulkEmails] = useState("")

  const handleAddInvite = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address",
        variant: "destructive",
      })
      return
    }

    // Basic email validation
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setInvites([...invites, { email, role }])
    setEmail("")
  }

  const handleRemoveInvite = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
  }

  const handleSendInvites = async () => {
    if (invites.length === 0) {
      toast({
        title: "No invites to send",
        description: "Please add at least one email address",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement actual invite sending logic
    toast({
      title: "Invitations sent",
      description: `Successfully sent ${invites.length} invitation${invites.length > 1 ? 's' : ''}`,
    })
    setInvites([])
    setMessage("")
  }

  const handleBulkImport = async () => {
    if (!bulkEmails.trim()) {
      toast({
        title: "No emails provided",
        description: "Please enter email addresses",
        variant: "destructive",
      })
      return
    }

    // Parse emails from textarea (comma, semicolon, or newline separated)
    const emails = bulkEmails
      .split(/[,;\n]/)
      .map(e => e.trim())
      .filter(e => e && e.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))

    if (emails.length === 0) {
      toast({
        title: "No valid emails found",
        description: "Please enter valid email addresses",
        variant: "destructive",
      })
      return
    }

    const newInvites = emails.map(email => ({ email, role }))
    setInvites([...invites, ...newInvites])
    setBulkEmails("")
    
    toast({
      title: "Emails imported",
      description: `Added ${emails.length} email${emails.length > 1 ? 's' : ''} to the invite list`,
    })
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground">
          Invite new team members
        </p>
        <Button size="sm">
          <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>


      {/* Single Invite */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <UserPlus aria-hidden="true" className="h-5 w-5" />
            Invite Team Members
          </CardTitle>
          <CardDescription>
            Send email invitations to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Mail aria-hidden="true" className="h-4 w-4" />
              Email Address
            </Label>
            <div className="flex flex-wrap gap-2">
              <Input
                id="email"
                type="email"
                placeholder="colleague@example.com"
                value={email as any}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddInvite()
                  }
                }}
              />
              <Select value={role as any} onValueChange={setRole}>
                <SelectTrigger aria-hidden="true" className="w-full max-w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddInvite}>
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Press Enter or click Add to include this email in the invite list
            </p>
          </div>

          {invites.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                  <Users aria-hidden="true" className="h-4 w-4" />
                  Pending Invites ({invites.length})
                </Label>
                <div className="space-y-2 max-h-[200px] overflow-auto border rounded-md p-3">
                  {invites.map((invite, index: number) => (
                    <div key={index} className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between gap-2 p-2 bg-muted rounded-md">
                      <div className="flex flex-col md:flex-row-1 flex flex-wrap items-center gap-2">
                        <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{invite.email}</span>
                        <Badge variant="outline" className="text-xs">
                          {invite.role}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInvite(index)}
                      >
                        <X aria-hidden="true" className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a personal message to your invitation..."
              value={message as any}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              This message will be included in the invitation email
            </p>
          </div>

          <div className="flex flex-wrap justify-end">
            <Button onClick={handleSendInvites} size="lg" disabled={invites.length === 0}>
              <Send aria-hidden="true" className="h-4 w-4 mr-2" />
              Send {invites.length > 0 ? `${invites.length} ` : ''}Invitation{invites.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Invite */}
      <Card>
        <CardHeader>
          <CardTitle aria-hidden="true" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <Upload aria-hidden="true" className="h-5 w-5" />
            Bulk Invite
          </CardTitle>
          <CardDescription>
            Import multiple email addresses at once
          </CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulkEmails" className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <FileText aria-hidden="true" className="h-4 w-4" />
              Email Addresses
            </Label>
            <Textarea
              id="bulkEmails"
              placeholder="Enter multiple emails separated by commas, semicolons, or new lines&#10;example1@company.com, example2@company.com&#10;example3@company.com"
              value={bulkEmails as any}
              onChange={(e) => setBulkEmails(e.target.value)}
              className="min-h-[150px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Separate emails with commas, semicolons, or line breaks
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bulkRole">Default Role</Label>
            <Select value={role as any} onValueChange={setRole}>
              <SelectTrigger id="bulkRole">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All imported emails will be assigned this role
            </p>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setBulkEmails("")}>
              Clear
            </Button>
            <Button onClick={handleBulkImport}>
              <Upload aria-hidden="true" className="h-4 w-4 mr-2" />
              Import Emails
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
