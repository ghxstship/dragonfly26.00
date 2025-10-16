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
  UserPlus, 
  Save, 
  Upload, 
  X,
  FileSpreadsheet,
  Users,
  AlertCircle
} from "lucide-react"
import { Plus } from "lucide-react"
import { Plus } from "lucide-react"
import { Plus } from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface NewUser {
  email: string
  name: string
  role: string
  password?: string
}

export function CreateTab() {
  const t = useTranslations()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("member")
  const [password, setPassword] = useState("")
  const [users, setUsers] = useState<NewUser[]>([])
  const [bulkData, setBulkData] = useState("")

  const generatePassword = () => {
    // Generate a secure password that meets requirements:
    // At least 8 characters with lowercase, uppercase, digit, and symbol
    const lowercase = "abcdefghijklmnopqrstuvwxyz"
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const digits = "0123456789"
    const symbols = "!@#$%^&*"
    const allChars = lowercase + uppercase + digits + symbols
    
    let password = ""
    // Ensure at least one of each required type
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += digits[Math.floor(Math.random() * digits.length)]
    password += symbols[Math.floor(Math.random() * symbols.length)]
    
    // Fill the rest to make it 12 characters total
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }
    
    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => Math.random() - 0.5).join('')
    setPassword(password)
  }

  const handleAddUser = () => {
    if (!email || !name) {
      toast({
        title: "Required fields missing",
        description: "Please enter both email and name",
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

    const newUser: NewUser = {
      email,
      name,
      role,
      password: password || undefined
    }

    setUsers([...users, newUser])
    setEmail("")
    setName("")
    setPassword("")
  }

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index))
  }

  const handleCreateUsers = () => {
    if (users.length === 0) {
      toast({
        title: "No users to create",
        description: "Please add at least one user",
        variant: "destructive",
      })
      return
    }

    // TODO: Implement actual user creation logic
    toast({
      title: "Users created",
      description: `Successfully created ${users.length} user account${users.length > 1 ? 's' : ''}`,
    })
    setUsers([])
  }

  const handleBulkImport = () => {
    if (!bulkData.trim()) {
      toast({
        title: "No data provided",
        description: "Please enter user data",
        variant: "destructive",
      })
      return
    }

    try {
      // Parse CSV or tab-separated data
      // Expected format: email,name,role (one per line)
      const lines = bulkData.split('\n').filter(line => line.trim())
      const newUsers: NewUser[] = []

      for (const line of lines) {
        const parts = line.split(/[,\t]/).map(p => p.trim())
        
        if (parts.length < 2) continue

        const [email, name, role = "member"] = parts

        if (email && name && email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          newUsers.push({
            email,
            name,
            role: ["admin", "member", "viewer"].includes(role.toLowerCase()) 
              ? role.toLowerCase() 
              : "member"
          })
        }
      }

      if (newUsers.length === 0) {
        toast({
          title: "No valid users found",
          description: "Please check the data format",
          variant: "destructive",
        })
        return
      }

      setUsers([...users, ...newUsers])
      setBulkData("")
      
      toast({
        title: "Users imported",
        description: `Added ${newUsers.length} user${newUsers.length > 1 ? 's' : ''} to the creation list`,
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Please check the data format and try again",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Buttons - Standard Positioning */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Create member profiles
        </p>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create
        </Button>
      </div>


      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Direct Account Creation</AlertTitle>
        <AlertDescription>
          Creating accounts directly bypasses the invitation process. Users will receive their credentials via email and can log in immediately.
        </AlertDescription>
      </Alert>

      {/* Single User Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Create User Account
          </CardTitle>
          <CardDescription>
            Create a new user account without sending an invitation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createEmail">Email Address *</Label>
              <Input
                id="createEmail"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="createName">Full Name *</Label>
              <Input
                id="createName"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="createRole">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="createRole">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="createPassword">Password (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="createPassword"
                  type="text"
                  placeholder="Auto-generate if empty"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="outline" onClick={generatePassword}>
                  Generate
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with lowercase, uppercase, digit, and symbol. Leave empty to auto-generate.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </div>

          {users.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pending Accounts ({users.length})
                </Label>
                <div className="space-y-2 max-h-[250px] overflow-auto border rounded-md p-3">
                  {users.map((user, index) => (
                    <div key={index} className="flex items-center justify-between gap-2 p-3 bg-muted rounded-md">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        {user.password && (
                          <p className="text-xs font-mono text-muted-foreground">
                            Password: {user.password}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveUser(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button onClick={handleCreateUsers} size="lg" disabled={users.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Create {users.length > 0 ? `${users.length} ` : ''}Account{users.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Import
          </CardTitle>
          <CardDescription>
            Import multiple users from CSV or spreadsheet data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Format:</strong> email, name, role (one user per line)
              <br />
              <strong>Example:</strong> john@example.com, John Doe, member
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="bulkData" className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              User Data
            </Label>
            <Textarea
              id="bulkData"
              placeholder="john@example.com, John Doe, member&#10;jane@example.com, Jane Smith, admin&#10;bob@example.com, Bob Johnson, viewer"
              value={bulkData}
              onChange={(e) => setBulkData(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Format: email, name, role (comma or tab-separated, one per line)
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBulkData("")}>
              Clear
            </Button>
            <Button onClick={handleBulkImport}>
              <Upload className="h-4 w-4 mr-2" />
              Import Users
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
