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
  Clock,
  Search,
  Filter
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Member {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member" | "viewer"
  department: string
  status: "active" | "pending" | "suspended"
  joinedAt: string
  lastActive: string
}

export function MembersManagementTab() {
  const { toast } = useToast()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [searchQuery, setSearchQuery] = useState("")

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://github.com/shadcn.png",
      role: "owner",
      department: "Leadership",
      status: "active",
      joinedAt: "2023-01-15",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      department: "Production",
      status: "active",
      joinedAt: "2023-02-20",
      lastActive: "10 minutes ago",
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@example.com",
      role: "member",
      department: "Audio",
      status: "active",
      joinedAt: "2023-03-10",
      lastActive: "1 hour ago",
    },
    {
      id: "4",
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "member",
      department: "Lighting",
      status: "pending",
      joinedAt: "2024-01-18",
      lastActive: "Never",
    },
    {
      id: "5",
      name: "Mike Chen",
      email: "mike.chen@example.com",
      role: "viewer",
      department: "Finance",
      status: "active",
      joinedAt: "2023-11-05",
      lastActive: "Yesterday",
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
      m.id === memberId ? { ...m, role: newRole as Member["role"] } : m
    ))
    toast({
      title: "Role updated",
      description: "The member's role has been changed successfully.",
    })
  }

  const getRoleBadgeColor = (role: Member["role"]) => {
    switch (role) {
      case "owner": return "default"
      case "admin": return "secondary"
      case "member": return "outline"
      case "viewer": return "outline"
      default: return "outline"
    }
  }

  const getStatusIcon = (status: Member["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => setInviteDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

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

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>All Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
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
                      <span>{member.department}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last active: {member.lastActive}
                    </p>
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
                          <DropdownMenuItem
                            onClick={() => handleChangeRole(member.id, "viewer")}
                            disabled={member.role === "viewer"}
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Make Viewer
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

      {/* Invite Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
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
                  <SelectItem value="viewer">Viewer</SelectItem>
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
