"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InviteTab } from "./invite-tab"
import { CreateTab } from "./create-tab"
import { 
  Mail, 
  UserPlus 
} from "lucide-react"

export function MembersPage() {
  const t = useTranslations()
  const [activeTab, setActiveTab] = useState("invite")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b bg-background p-6">
        <h1 className="text-3xl font-bold">Invite & Create Members</h1>
        <p className="text-muted-foreground mt-2">
          Invite new team members or create accounts directly
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="invite" className="gap-2">
              <Mail className="h-4 w-4" />
              Invite
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="space-y-4">
            <InviteTab />
          </TabsContent>

          <TabsContent value="create" className="space-y-4">
            <CreateTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
