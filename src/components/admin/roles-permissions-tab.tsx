"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Crown, Shield, Plane, Sword, Compass, Users as UsersIcon, User, Briefcase, UserPlus, Eye, Megaphone, type LucideIcon } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { BRANDED_ROLES, getAllRolesSorted } from "@/lib/rbac/role-definitions"
import { getRolePermissions } from "@/lib/rbac/permission-matrix"
import type { RoleSlug, RoleMetadata } from "@/types/rbac"

// Icon mapping for branded roles
const ROLE_ICONS: Record<string, LucideIcon> = {
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
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      {/* Roles List */}
      <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
        <p className="text-muted-foreground">
          11 distinct roles with comprehensive permission matrix
        </p>
      </div>

      {/* Role Hierarchy Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Total Roles</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">11</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Permission Categories</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">12</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Total Permissions</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">72+</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader aria-hidden="true" className="pb-3">
            <CardDescription>Access Levels</CardDescription>
            <CardTitle aria-hidden="true" className="text-base md:text-lg lg:text-xl md:text-lg md:text-xl lg:text-2xl lg:text-3xl">8</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Branded Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
        {brandedRoles.map((role: any) => {
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
                  <div className="flex flex-wrap flex-col md:flex-row items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Icon aria-hidden="true" className="h-5 w-5" style={{ color: role.color }} />
                    </div>
                    <div>
                      <CardTitle aria-hidden="true" className="text-base">{role.name}</CardTitle>
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
                <CardDescription aria-hidden="true" className="mt-2 line-clamp-2">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                    <span className="text-muted-foreground">Level</span>
                    <span className="font-medium">{role.level}</span>
                  </div>
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
                    <span className="text-muted-foreground">Permissions</span>
                    <span className="font-medium">{permissionCount}</span>
                  </div>
                  <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between text-sm">
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
        <Card aria-hidden="true" className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          <CardHeader aria-hidden="true" className="p-4 sm:p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {(() => {
                  const role = BRANDED_ROLES[selectedRole]
                  const Icon = getRoleIcon(role.icon)
                  return (
                    <>
                      <div 
                        className="p-2 sm:p-3 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        <Icon aria-hidden="true" className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: role.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle aria-hidden="true" className="text-base sm:text-lg">{t('roles.userRoles')}</CardTitle>
                        <CardDescription aria-hidden="true" className="mt-1 text-sm">{role.description}</CardDescription>
                      </div>
                    </>
                  )
                })()}
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedRole(null)}
                className="w-full sm:w-auto flex-shrink-0"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent aria-hidden="true" className="p-4 sm:p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Key Capabilities */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Key Capabilities</h3>
                <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2">
                  {BRANDED_ROLES[selectedRole].capabilities.map((capability: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm min-w-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-hidden="true" />
                      <span className="flex-1 min-w-0 break-words">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permission Count */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Permission Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{getRolePermissionCount(selectedRole)}</div>
                    <div className="text-xs text-muted-foreground mt-1">Total Permissions</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{BRANDED_ROLES[selectedRole].level}</div>
                    <div className="text-xs text-muted-foreground mt-1">Hierarchy Level</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold capitalize">{BRANDED_ROLES[selectedRole].scope}</div>
                    <div className="text-xs text-muted-foreground mt-1">Permission Scope</div>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground mt-1">Categories</div>
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
