"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Crown, Shield, Plane, Sword, Compass, Users as UsersIcon, User, Briefcase, UserPlus, Eye, Megaphone } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { BRANDED_ROLES, getAllRolesSorted } from "@/lib/rbac/role-definitions"
import { getRolePermissions } from "@/lib/rbac/permission-matrix"
import type { RoleSlug, RoleMetadata } from "@/types/rbac"

// Icon mapping for branded roles
const ROLE_ICONS: Record<string, any> = {
  crown: Crown,
  shield: Shield,
  plane: Plane,
  sword: Sword,
  compass: Compass,
  users: UsersIcon,
  user: User,
  briefcase: Briefcase,
  'user-plus': UserPlus,
  eye: Eye,
  megaphone: Megaphone,
}

export function RolesPermissionsTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [brandedRoles, setBrandedRoles] = useState<RoleMetadata[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleSlug | null>(null)
  
  useEffect(() => {
    // Load branded roles
    setBrandedRoles(getAllRolesSorted())
  }, [])

  const getRoleIcon = (iconName: string) => {
    return ROLE_ICONS[iconName] || User
  }

  const getRolePermissionCount = (roleSlug: RoleSlug): number => {
    const permissions = getRolePermissions(roleSlug)
    return Object.keys(permissions).length
  }

  const handleViewRole = (roleSlug: RoleSlug) => {
    setSelectedRole(roleSlug)
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {t('admin.rolesPermissions')}
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
          {t('roles.createRole')}
        </Button>
      </div>


      {/* Description */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          11 distinct roles with comprehensive permission matrix
        </p>
      </div>

      {/* Role Hierarchy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Roles</CardDescription>
            <CardTitle className="text-3xl">11</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Permission Categories</CardDescription>
            <CardTitle className="text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Permissions</CardDescription>
            <CardTitle className="text-3xl">72+</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Access Levels</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Branded Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brandedRoles.map((role) => {
          const Icon = getRoleIcon(role.icon)
          const permissionCount = getRolePermissionCount(role.slug)

          return (
            <Card 
              key={role.slug} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleViewRole(role.slug)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: role.color }} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{role.name}</CardTitle>
                      <Badge 
                        variant="secondary" 
                        className="mt-1"
                        style={{ 
                          backgroundColor: `${role.color}20`,
                          color: role.color,
                          borderColor: role.color
                        }}
                      >
                        {role.badge}
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2 line-clamp-2">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{role.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <span className="font-medium">{permissionCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scope</span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {role.scope}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Role Details Panel */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {(() => {
                  const role = BRANDED_ROLES[selectedRole]
                  const Icon = getRoleIcon(role.icon)
                  return (
                    <>
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: role.color }} />
                      </div>
                      <div>
                        <CardTitle>{t('roles.userRoles')}</CardTitle>
                        <CardDescription>{role.description}</CardDescription>
                      </div>
                    </>
                  )
                })()}
              </div>
              <Button variant="outline" onClick={() => setSelectedRole(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Key Capabilities */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Key Capabilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {BRANDED_ROLES[selectedRole].capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {capability}
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Count */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Permission Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{getRolePermissionCount(selectedRole)}</div>
                    <div className="text-xs text-muted-foreground">Total Permissions</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">{BRANDED_ROLES[selectedRole].level}</div>
                    <div className="text-xs text-muted-foreground">Hierarchy Level</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold capitalize">{BRANDED_ROLES[selectedRole].scope}</div>
                    <div className="text-xs text-muted-foreground">Permission Scope</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Categories</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
