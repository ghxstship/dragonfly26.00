"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Plus, Trash2 } from "lucide-react"

interface EmergencyContact {
  id: string
  name: string
  relationship: string
  phone: string
  email: string
  address: string
  isPrimary: boolean
}

export function EmergencyContactTab() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: "1",
      name: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
      isPrimary: true,
    },
  ])

  const addContact = () => {
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: "",
      relationship: "",
      phone: "",
      email: "",
      address: "",
      isPrimary: false,
    }
    setContacts([...contacts, newContact])
  }

  const removeContact = (id: string) => {
    if (contacts.length > 1) {
      setContacts(contacts.filter((c) => c.id !== id))
    }
  }

  const updateContact = (id: string, field: keyof EmergencyContact, value: string | boolean) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    )
  }

  const setPrimaryContact = (id: string) => {
    setContacts(
      contacts.map((contact) => ({
        ...contact,
        isPrimary: contact.id === id,
      }))
    )
  }

  const handleSave = () => {
    console.log("Saving emergency contacts:", contacts)
    // TODO: Save to Supabase
  }

  return (
    <div className="space-y-6">
      {contacts.map((contact, index) => (
        <Card key={contact.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {contact.isPrimary ? "Primary " : ""}Emergency Contact {index + 1}
                </CardTitle>
                <CardDescription>
                  Person to contact in case of emergency
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {!contact.isPrimary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPrimaryContact(contact.id)}
                  >
                    Set as Primary
                  </Button>
                )}
                {contacts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeContact(contact.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${contact.id}`}>Full Name</Label>
                <Input
                  id={`name-${contact.id}`}
                  value={contact.name}
                  onChange={(e) => updateContact(contact.id, "name", e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`relationship-${contact.id}`}>Relationship</Label>
                <Input
                  id={`relationship-${contact.id}`}
                  value={contact.relationship}
                  onChange={(e) => updateContact(contact.id, "relationship", e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`phone-${contact.id}`}>Phone Number</Label>
                <Input
                  id={`phone-${contact.id}`}
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => updateContact(contact.id, "phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${contact.id}`}>Email</Label>
                <Input
                  id={`email-${contact.id}`}
                  type="email"
                  value={contact.email}
                  onChange={(e) => updateContact(contact.id, "email", e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${contact.id}`}>Address</Label>
              <Input
                id={`address-${contact.id}`}
                value={contact.address}
                onChange={(e) => updateContact(contact.id, "address", e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addContact} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Another Emergency Contact
      </Button>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  )
}
