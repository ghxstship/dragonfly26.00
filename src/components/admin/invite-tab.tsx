"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, Mail, Send, Copy, Check, X, Clock, 
  MoreHorizontal, Trash2, RefreshCw 
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Invitation {
  id: string
  email: string
  role: string
  status: "pending" | "accepted" | "expired"
  invited_by: string
  invited_at: string
  expires_at: string
}

export function InviteTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("member")
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [invitations] = useState<Invitation[]>([
    {
      id: "inv_1",
      email: "john.doe@example.com",
      role: "admin",
      status: "pending",
      invited_by: "Sarah Smith",
      invited_at: "2025-01-15T10:00:00Z",
      expires_at: "2025-01-22T10:00:00Z",
    },
    {
      id: "inv_2",
      email: "jane.smith@example.com",
      role: "member",
      status: "accepted",
      invited_by: "Sarah Smith",
      invited_at: "2025-01-14T14:30:00Z",
      expires_at: "2025-01-21T14:30:00Z",
    },
    {
      id: "inv_3",
      email: "bob.wilson@example.com",
      role: "viewer",
      status: "expired",
      invited_by: "John Doe",
      invited_at: "2025-01-01T09:00:00Z",
      expires_at: "2025-01-08T09:00:00Z",
    },
  ])

  const handleSendInvite = async () => {
    if (!email) {
      toast({
        title: t('common.error'),
        description: t('admin.invite.toast.emailRequired'),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // TODO: Send invitation via Supabase
      toast({
        title: t('success.sent'),
        description: t('admin.invite.toast.inviteSent', { email }),
      })
      setEmail("")
      setRole("member")
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('admin.invite.toast.inviteFailed'),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = (invitationId: string) => {
    const link = `${window.location.origin}/invite/${invitationId}`
    navigator.clipboard.writeText(link)
    setCopiedId(invitationId)
    toast({
      title: t('success.copied'),
      description: t('admin.invite.toast.linkCopied'),
    })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleResendInvite = async (invitationId: string) => {
    try {
      // TODO: Resend invitation
      toast({
        title: t('success.sent'),
        description: t('admin.invite.toast.inviteResent'),
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('admin.invite.toast.resendFailed'),
        variant: "destructive",
      })
    }
  }

  const handleRevokeInvite = async (invitationId: string) => {
    try {
      // TODO: Revoke invitation
      toast({
        title: t('success.revoked'),
        description: t('admin.invite.toast.inviteRevoked'),
      })
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: t('admin.invite.toast.revokeFailed'),
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: Invitation["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock aria-hidden="true" className="h-3 w-3 mr-1" />
          {t('admin.invite.status.pending')}
        </Badge>
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Check aria-hidden="true" className="h-3 w-3 mr-1 flex-shrink-0" />
          {t('admin.invite.status.accepted')}
        </Badge>
      case "expired":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          <X aria-hidden="true" className="h-3 w-3 mr-1" />
          {t('admin.invite.status.expired')}
        </Badge>
    }
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Send Invitation */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
            <UserPlus aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
            <CardTitle>{t('admin.invite.sendInvitation')}</CardTitle>
          </div>
          <CardDescription>
            {t('admin.invite.sendInvitationDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap flex-col gap-2 md:gap-3 lg:gap-4 sm:flex-col md:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">{t('admin.invite.emailAddress')}</Label>
              <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
                <Mail aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email as any}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('admin.invite.emailPlaceholder')}
                  onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
                />
              </div>
            </div>
            <div className="w-full sm:w-48 space-y-2 max-w-full">
              <Label htmlFor="role">{t('admin.invite.role')}</Label>
              <Select value={role as any} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('admin.invite.roles.admin')}</SelectItem>
                  <SelectItem value="member">{t('admin.invite.roles.member')}</SelectItem>
                  <SelectItem value="viewer">{t('admin.invite.roles.viewer')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-end">
              <Button onClick={handleSendInvite} disabled={loading}>
                <Send aria-hidden="true" className="h-4 w-4 mr-2" />
                {loading ? t('common.sending') : t('admin.invite.send')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.invite.pendingInvitations')}</CardTitle>
          <CardDescription>
            {t('admin.invite.pendingInvitationsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.invite.email')}</TableHead>
                <TableHead>{t('admin.invite.role')}</TableHead>
                <TableHead>{t('admin.invite.status')}</TableHead>
                <TableHead>{t('admin.invite.invitedBy')}</TableHead>
                <TableHead>{t('admin.invite.expires')}</TableHead>
                <TableHead aria-hidden="true" className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation: any) => (
                <TableRow key={invitation.id}>
                  <TableCell aria-hidden="true" className="font-medium">{invitation.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {t(`admin.invite.roles.${invitation.role}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell aria-hidden="true" className="text-muted-foreground">{invitation.invited_by}</TableCell>
                  <TableCell aria-hidden="true" className="text-muted-foreground">
                    {new Date(invitation.expires_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell aria-hidden="true" className="text-right">
                    <div className="flex flex-wrap flex-col md:flex-row items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(invitation.id)}
                        aria-label={t('admin.invite.copyLink')}
                      >
                        {copiedId === invitation.id ? (
                          <Check aria-hidden="true" className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Copy aria-hidden="true" className="h-4 w-4" />
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" aria-label={t('common.moreActions')}>
                            <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleResendInvite(invitation.id)}>
                            <RefreshCw aria-hidden="true" className="h-4 w-4 mr-2" />
                            {t('admin.invite.resend')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleRevokeInvite(invitation.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                            {t('admin.invite.revoke')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
