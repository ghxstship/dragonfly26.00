"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/lib/hooks/use-toast"
import { EnhancedTableView } from "@/components/shared/enhanced-table-view"
import { rolesPermissionsSchema } from "@/lib/schemas/admin-schemas"
import type { DataItem } from "@/types"

export function RolesPermissionsTab() {
  const { toast } = useToast()

  const permissionCategories = {
    projects: [
      { id: "projects.view", label: "View Projects", description: "Can view all projects" },
      { id: "projects.create", label: "Create Projects", description: "Can create new projects" },
      { id: "projects.edit", label: "Edit Projects", description: "Can edit project details" },
      { id: "projects.delete", label: "Delete Projects", description: "Can delete projects" },
    ],
    members: [
      { id: "members.view", label: "View Members", description: "Can view member list" },
      { id: "members.invite", label: "Invite Members", description: "Can invite new members" },
      { id: "members.edit", label: "Edit Members", description: "Can edit member details" },
      { id: "members.remove", label: "Remove Members", description: "Can remove members" },
    ],
    finance: [
      { id: "finance.view", label: "View Finances", description: "Can view financial data" },
      { id: "finance.edit", label: "Edit Budgets", description: "Can edit budgets and expenses" },
      { id: "finance.approve", label: "Approve Expenses", description: "Can approve expense requests" },
    ],
    settings: [
      { id: "settings.view", label: "View Settings", description: "Can view organization settings" },
      { id: "settings.edit", label: "Edit Settings", description: "Can modify organization settings" },
      { id: "settings.billing", label: "Manage Billing", description: "Can manage billing and subscription" },
    ],
  }

  const [roles, setRoles] = useState<Role[]>([
    {
      id: "owner",
      name: "Owner",
      description: "Full access to everything",
      memberCount: 1,
      permissions: Object.fromEntries(
        Object.values(permissionCategories).flat().map(p => [p.id, true])
      ),
      isSystem: true,
    },
    {
      id: "admin",
      name: "Admin",
      description: "Can manage most aspects of the organization",
      memberCount: 3,
      permissions: {
        "projects.view": true,
        "projects.create": true,
        "projects.edit": true,
        "projects.delete": true,
        "members.view": true,
        "members.invite": true,
        "members.edit": true,
        "members.remove": false,
        "finance.view": true,
        "finance.edit": true,
        "finance.approve": true,
        "settings.view": true,
        "settings.edit": false,
        "settings.billing": false,
      },
      isSystem: true,
    },
    {
      id: "member",
      name: "Member",
      description: "Standard access to projects and resources",
      memberCount: 28,
      permissions: {
        "projects.view": true,
        "projects.create": true,
        "projects.edit": true,
        "projects.delete": false,
        "members.view": true,
        "members.invite": false,
        "members.edit": false,
        "members.remove": false,
        "finance.view": false,
        "finance.edit": false,
        "finance.approve": false,
        "settings.view": false,
        "settings.edit": false,
        "settings.billing": false,
      },
      isSystem: true,
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access",
      memberCount: 10,
      permissions: {
        "projects.view": true,
        "projects.create": false,
        "projects.edit": false,
        "projects.delete": false,
        "members.view": true,
        "members.invite": false,
        "members.edit": false,
        "members.remove": false,
        "finance.view": false,
        "finance.edit": false,
        "finance.approve": false,
        "settings.view": false,
        "settings.edit": false,
        "settings.billing": false,
      },
      isSystem: true,
    },
  ])

  const handleCreateRole = () => {
    setSelectedRole(null)
    setDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setDialogOpen(true)
  }

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter(r => r.id !== roleId))
    toast({
      title: "Role deleted",
      description: "The role has been removed successfully.",
      variant: "destructive",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleCreateRole}>
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Roles</CardDescription>
            <CardTitle className="text-3xl">{roles.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Custom Roles</CardDescription>
            <CardTitle className="text-3xl">
              {roles.filter(r => !r.isSystem).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Members</CardDescription>
            <CardTitle className="text-3xl">
              {roles.reduce((sum, r) => sum + r.memberCount, 0)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Roles List */}
      <div className="space-y-3">
        {roles.map((role) => {
          const enabledPermissions = Object.values(role.permissions).filter(Boolean).length
          const totalPermissions = Object.keys(role.permissions).length

          return (
            <Card key={role.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      {role.isSystem && (
                        <Badge variant="secondary">
                          <Lock className="h-3 w-3 mr-1" />
                          System Role
                        </Badge>
                      )}
                      <Badge variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        {role.memberCount} members
                      </Badge>
                    </div>
                    <CardDescription>{role.description}</CardDescription>
                  </div>
                  {!role.isSystem && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <span className="font-medium">
                      {enabledPermissions} of {totalPermissions} enabled
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(enabledPermissions / totalPermissions) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Permission Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Matrix</CardTitle>
          <CardDescription>
            Overview of all roles and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold mb-3 capitalize">
                  {category}
                </h3>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{permission.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {permission.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center justify-center w-8 h-8"
                            title={role.name}
                          >
                            {role.permissions[permission.id] ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <div className="h-4 w-4 rounded-full border-2 border-muted" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? "Edit Role" : "Create New Role"}
            </DialogTitle>
            <DialogDescription>
              Define the role name and configure permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input
                placeholder="e.g., Production Manager"
                defaultValue={selectedRole?.name}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                placeholder="Brief description of this role"
                defaultValue={selectedRole?.description}
              />
            </div>

            <Separator />

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <Label>Permissions</Label>
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold mb-2 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-2 ml-4">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{permission.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {permission.description}
                          </p>
                        </div>
                        <Switch />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Role saved",
                  description: "The role has been saved successfully.",
                })
                setDialogOpen(false)
              }}
            >
              {selectedRole ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
