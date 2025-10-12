"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Users, 
  UserPlus, 
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  Crown,
  CheckCircle2,
  XCircle,
  Clock
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member" | "guest"
  status: "active" | "pending" | "suspended"
  joinedAt: string
}

export function TeamTab() {
  const { toast } = useToast()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://github.com/shadcn.png",
      role: "owner",
      status: "active",
      joinedAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      status: "active",
      joinedAt: "2023-02-20",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      role: "member",
      status: "active",
      joinedAt: "2023-03-10",
    },
    {
      id: "4",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "member",
      status: "pending",
      joinedAt: "2024-01-18",
    },
  ])

  const handleInvite = () => {
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    })
    setInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("member")
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => m.id !== memberId))
    toast({
      title: "Member removed",
      description: "The team member has been removed successfully.",
      variant: "destructive",
    })
  }

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole as TeamMember["role"] } : m
    ))
    toast({
      title: "Role updated",
      description: "The member's role has been changed successfully.",
    })
  }

  const getRoleBadgeColor = (role: TeamMember["role"]) => {
    switch (role) {
      case "owner":
        return "default"
      case "admin":
        return "secondary"
      case "member":
        return "outline"
      case "guest":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: TeamMember["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Members
              </CardTitle>
              <CardDescription className="mt-2">
                Manage your team members and their roles
              </CardDescription>
            </div>
            <Button onClick={() => setInviteDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Members</CardDescription>
            <CardTitle className="text-3xl">{members.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl">
              {members.filter(m => m.status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">
              {members.filter(m => m.status === "pending").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Admins</CardDescription>
            <CardTitle className="text-3xl">
              {members.filter(m => m.role === "admin" || m.role === "owner").length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{member.name}</p>
                      {member.role === "owner" && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      {getStatusIcon(member.status)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                      <span>•</span>
                      <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeColor(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>

                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "admin")}
                            disabled={member.role === "admin"}
                          >
                            <Shield className="h-4 w-4 mr-2" />
                            Make Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "member")}
                            disabled={member.role === "member"}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Make Member
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding team member roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex gap-3 p-3 border rounded-lg">
              <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Owner</p>
                <p className="text-sm text-muted-foreground">
                  Full access to all features, billing, and team management
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Admin</p>
                <p className="text-sm text-muted-foreground">
                  Can manage team members, projects, and organization settings
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-3 border rounded-lg">
              <Users className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Member</p>
                <p className="text-sm text-muted-foreground">
                  Can create and edit projects, but cannot manage team settings
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
