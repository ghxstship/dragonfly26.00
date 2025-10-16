"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Mail, 
  Send, 
  Upload, 
  UserPlus, 
  X,
  FileText,
  Users,
  Building2,
  FolderKanban
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Invite {
  email: string
  role: string
  organization?: string
  project?: string
}

export function InviteDialog({ open, onOpenChange }: InviteDialogProps) {
  const t = useTranslations()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("single")
  
  // Single invite form
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [organization, setOrganization] = useState("")
  const [project, setProject] = useState("")
  const [message, setMessage] = useState("")
  const [invites, setInvites] = useState<Invite[]>([])
  
  // Bulk invite
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

    const newInvite: Invite = {
      email,
      role,
      ...(organization && { organization }),
      ...(project && { project })
    }

    setInvites([...invites, newInvite])
    setEmail("")
    setOrganization("")
    setProject("")
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

    try {
      // TODO: Implement actual invite sending logic with Supabase
      // await supabase.from('invitations').insert(invites)
      
      toast({
        title: "Invitations sent",
        description: `Successfully sent ${invites.length} invitation${invites.length > 1 ? 's' : ''}`,
      })
      
      // Reset form
      setInvites([])
      setMessage("")
      setEmail("")
      setOrganization("")
      setProject("")
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error sending invitations",
        description: "Please try again later",
        variant: "destructive",
      })
    }
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

    const newInvites: Invite[] = emails.map(email => ({
      email,
      role,
      ...(organization && { organization }),
      ...(project && { project })
    }))
    
    setInvites([...invites, ...newInvites])
    setBulkEmails("")
    
    toast({
      title: "Emails imported",
      description: `Added ${emails.length} email${emails.length > 1 ? 's' : ''} to the invite list`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite Team Members
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single" className="gap-2">
              <Mail className="h-4 w-4" />
              Single Invite
            </TabsTrigger>
            <TabsTrigger value="bulk" className="gap-2">
              <Upload className="h-4 w-4" />
              Bulk Invite
            </TabsTrigger>
          </TabsList>

          {/* Single Invite Tab */}
          <TabsContent value="single" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddInvite()
                    }
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization (Optional)
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Organization name"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project" className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Project (Optional)
                  </Label>
                  <Input
                    id="project"
                    placeholder="Project name"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddInvite} className="w-full">
                <UserPlus className="h-4 w-4 mr-2" />
                Add to Invite List
              </Button>
            </div>
          </TabsContent>

          {/* Bulk Invite Tab */}
          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulkEmails" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Email Addresses <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="bulkEmails"
                  placeholder="Enter multiple emails separated by commas, semicolons, or new lines&#10;example1@company.com, example2@company.com&#10;example3@company.com"
                  value={bulkEmails}
                  onChange={(e) => setBulkEmails(e.target.value)}
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Separate emails with commas, semicolons, or line breaks
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bulkOrganization" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Organization (Optional)
                  </Label>
                  <Input
                    id="bulkOrganization"
                    placeholder="Organization name"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bulkProject" className="flex items-center gap-2">
                    <FolderKanban className="h-4 w-4" />
                    Project (Optional)
                  </Label>
                  <Input
                    id="bulkProject"
                    placeholder="Project name"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bulkRole">Default Role</Label>
                <Select value={role} onValueChange={setRole}>
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

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setBulkEmails("")} className="flex-1">
                  Clear
                </Button>
                <Button onClick={handleBulkImport} className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Import Emails
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pending Invites List */}
        {invites.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pending Invites ({invites.length})
              </Label>
              <div className="space-y-2 max-h-[200px] overflow-auto border rounded-md p-3">
                {invites.map((invite: any, index: number) => (
                  <div key={index} className="flex items-center justify-between gap-2 p-2 bg-muted rounded-md">
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{invite.email}</span>
                        <Badge variant="outline" className="text-xs">
                          {invite.role}
                        </Badge>
                      </div>
                      {(invite.organization || invite.project) && (
                        <div className="flex items-center gap-2 ml-6 text-xs text-muted-foreground">
                          {invite.organization && (
                            <span className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {invite.organization}
                            </span>
                          )}
                          {invite.project && (
                            <span className="flex items-center gap-1">
                              <FolderKanban className="h-3 w-3" />
                              {invite.project}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveInvite(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Custom Message (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a personal message to your invitation..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-muted-foreground">
                This message will be included in the invitation email
              </p>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendInvites} disabled={invites.length === 0}>
            <Send className="h-4 w-4 mr-2" />
            Send {invites.length > 0 ? `${invites.length} ` : ''}Invitation{invites.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
