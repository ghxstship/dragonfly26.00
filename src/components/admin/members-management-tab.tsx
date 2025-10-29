"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
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
  Filter,
  Eye,
  Edit,
  Copy
} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { CrudDrawer } from "@/components/shared/crud-drawer"
import { BulkActionsToolbar } from "@/components/shared/bulk-actions-toolbar"
import { membersSchema } from "@/lib/schemas/admin-schemas"
import type { DataItem } from "@/types"

interface Member {
  id: string
  name: string
  nameKey?: string
  email: string
  avatar?: string
  role: "legend" | "phantom" | "aviator" | "gladiator" | "navigator" | "deviator" | "raider" | "merchant" | "visitor" | "passenger" | "ambassador"
  department: string
  status: "active" | "pending" | "suspended"
  joinedAt: string
  lastActive: string
}

export function MembersManagementTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("raider")
  const [searchQuery, setSearchQuery] = useState("")
  
  // CRUD drawer state
  const [drawerMode, setDrawerMode] = useState<'view' | 'create' | 'edit' | null>(null)
  const [selectedMember, setSelectedMember] = useState<DataItem | null>(null)
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: t('admin.mockData.member1Name'),
      email: "john.doe@example.com",
      avatar: "https://github.com/shadcn.png",
      role: "phantom",
      department: "Leadership",
      status: "active",
      joinedAt: "2023-01-15",
      lastActive: "2 minutes ago",
    },
    {
      id: "2",
      name: t('admin.mockData.member2Name'),
      email: "jane.smith@example.com",
      role: "aviator",
      department: "Production",
      status: "active",
      joinedAt: "2023-02-20",
      lastActive: "10 minutes ago",
    },
    {
      id: "3",
      name: t('admin.mockData.member3Name'),
      email: "bob.wilson@example.com",
      role: "raider",
      department: "Audio",
      status: "active",
      joinedAt: "2023-03-10",
      lastActive: "1 hour ago",
    },
    {
      id: "4",
      name: t('admin.mockData.member4Name'),
      email: "alice.johnson@example.com",
      role: "raider",
      department: "Lighting",
      status: "pending",
      joinedAt: "2024-01-18",
      lastActive: "Never",
    },
    {
      id: "5",
      name: "Mike Chen",
      nameKey: "mike_chen",
      email: "mike.chen@example.com",
      role: "passenger",
      department: "Finance",
      status: "active",
      joinedAt: "2023-11-05",
      lastActive: "Yesterday",
    },
  ])

  const handleInvite = async () => {
    toast({
      title: t('admin.toast.invitationSent'),
      description: `An invitation has been sent to ${inviteEmail}`,
    })
    setInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("member")
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(m => (m as any).id !== memberId))
    toast({
      title: t('admin.toast.memberRemoved'),
      description: t('admin.toast.memberRemovedDesc'),
      variant: "destructive",
    })
  }

  // CRUD handlers
  const handleCreate = async (data: Record<string, unknown>) => {
    const now = new Date().toISOString()
    const newMember: Member = {
      id: String(members.length + 1),
      name: data.name as string,
      email: data.email as string,
      role: (data.role as any) || 'member',
      department: (data.department as string) || '',
      status: 'pending',
      joinedAt: now,
      lastActive: 'Never',
    }
    setMembers([...members, newMember])
    toast({ title: t('admin.toast.memberAdded') })
  }

  const handleUpdate = async (id: string, updates: Record<string, unknown>) => {
    setMembers(members.map(m => m.id === id ? { ...m, ...updates } : m))
    toast({ title: t('admin.toast.memberUpdated') })
  }

  const handleDelete = async (id: string) => {
    handleRemoveMember(id)
  }

  const handleBulkDelete = async (ids: string[]) => {
    setMembers(members.filter(m => !ids.includes(m.id)))
    setSelectedIds([])
    toast({ title: `${ids.length} members removed successfully` })
  }

  const handleDuplicate = async (member: DataItem) => {
    const { id, ...rest } = member
    await handleCreate({ ...rest, name: `${t(member.nameKey)} (Copy)` })
  }

  // Selection handlers
  const handleSelectAll = async () => {
    if (selectedIds.length === filteredMembers.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMembers.map(m => m.id))
    }
  }

  const handleSelectMember = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const handleChangeRole = (memberId: string, newRole: string) => {
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, role: newRole as Member["role"] } : m
    ))
    toast({
      title: t('admin.toast.roleUpdated'),
      description: t('admin.toast.roleUpdatedDesc'),
    })
  }

  const getRoleBadgeColor = (role: Member["role"]) => {
    switch (role) {
      case "legend": return "default"
      case "phantom": return "default"
      case "aviator": return "secondary"
      case "gladiator": return "secondary"
      case "navigator": return "outline"
      case "deviator": return "outline"
      case "raider": return "outline"
      case "merchant": return "outline"
      case "visitor": return "outline"
      case "passenger": return "outline"
      case "ambassador": return "outline"
      default: return "outline"
    }
  }

  const getStatusIcon = (status: Member["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" aria-hidden="true" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" aria-hidden="true" />
      case "suspended":
        return <XCircle className="h-4 w-4 text-red-500" aria-hidden="true" />
    }
  }

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>{t('admin.members.totalMembers')}</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">{members.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {members.filter(m => (m as any).status === "active").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {members.filter(m => (m as any).status === "pending").length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>High-Level Roles</CardDescription>
            <CardTitle className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">
              {members.filter(m => ['legend', 'phantom', 'aviator', 'gladiator'].includes(m.role)).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1">
              <Search className="absolute sm:relative sm:inset-auto left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground sm:relative sm:inset-auto" />
              <Input
                placeholder={t('admin.members.searchPlaceholder')}
                value={searchQuery as any}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <CardTitle>All Members ({filteredMembers.length})</CardTitle>
            <div className="flex flex-wrap flex-col md:flex-row items-center gap-2">
              <Checkbox
                checked={selectedIds.length === filteredMembers.length && filteredMembers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-muted-foreground">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member: any) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer ${
                  selectedIds.includes(member.id) ? 'bg-accent/50 border-primary' : ''
                }`}
                onClick={() => {
                  setSelectedMember(member as any)
                  setDrawerMode('view')
                }}
              >
                <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 md:gap-3 lg:gap-4 flex-1">
                  <Checkbox
                    checked={selectedIds.includes(member.id)}
                    onCheckedChange={() => handleSelectMember(member.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 mb-1">
                      <p className="font-medium truncate">{member.nameKey ? t(member.nameKey) : member.name}</p>
                      {(member.role === "legend" || member.role === "phantom") && (
                        <Crown className="h-4 w-4 text-yellow-500" aria-hidden="true" />
                      )}
                      {getStatusIcon(member.status)}
                    </div>
                    <div className="flex flex-wrap flex-col md:flex-row items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" aria-hidden="true" />
                      <span className="truncate">{member.email}</span>
                      <span>•</span>
                      <span>{member.department}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last active: {member.lastActive}
                    </p>
                  </div>

                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <Badge variant={getRoleBadgeColor(member.role)}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" aria-label="Member actions">
                          <MoreVertical className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMember(member as any)
                            setDrawerMode('view')
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" aria-hidden="true" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedMember(member as any)
                            setDrawerMode('edit')
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDuplicate(member as any)
                          }}
                        >
                          <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                          Duplicate
                        </DropdownMenuItem>
                        
                        {!['legend', 'phantom'].includes(member.role) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleChangeRole(member.id, "aviator")
                              }}
                              disabled={member.role === "aviator"}
                            >
                              <Shield className="h-4 w-4 mr-2" aria-hidden="true" />
                              Make Aviator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleChangeRole(member.id, "raider")
                              }}
                              disabled={member.role === "raider"}
                            >
                              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                              Make Raider
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleChangeRole(member.id, "passenger")
                              }}
                              disabled={member.role === "passenger"}
                            >
                              <Users className="h-4 w-4 mr-2" aria-hidden="true" />
                              Make Passenger
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveMember(member.id)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" aria-hidden="true" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                placeholder={t('admin.members.emailPlaceholder')}
                value={inviteEmail as any}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select value={inviteRole as any} onValueChange={setInviteRole}>
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

      {/* CRUD Drawer */}
      <CrudDrawer
        mode={drawerMode || 'view'}
        item={selectedMember}
        schema={membersSchema.fields}
        open={drawerMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerMode(null)
            setSelectedMember(null)
          }
        }}
        onCreate={async (data) => {
          await handleCreate(data)
          setDrawerMode(null)
        }}
        onUpdate={async (id, updates) => {
          await handleUpdate(id, updates)
          setDrawerMode(null)
        }}
        onDelete={async (id) => {
          await handleDelete(id)
          setDrawerMode(null)
        }}
        onDuplicate={async (item) => {
          await handleDuplicate(item)
          setDrawerMode(null)
        }}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedIds.length}
        onClearSelection={() => setSelectedIds([])}
        onDelete={() => handleBulkDelete(selectedIds)}
        onDuplicate={() => {
          selectedIds.forEach(id => {
            const member = members.find(m => m.id === id)
            if (member) handleDuplicate(member as any)
          })
          setSelectedIds([])
        }}
        onArchive={() => {
          // Archive functionality
          toast({ title: `${selectedIds.length} members archived` })
          setSelectedIds([])
        }}
      />
    </div>
  )
}
