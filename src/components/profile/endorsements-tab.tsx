"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageSquare, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Endorsement {
  id: string
  endorserName: string
  endorserTitle: string
  endorserImage?: string
  skill: string
  message: string
  date: string
  projectName?: string
}

interface SkillEndorsement {
  skill: string
  count: number
  endorsers: string[]
}

export function EndorsementsTab() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const [endorsements] = useState<Endorsement[]>([
    {
      id: "1",
      endorserName: "Sarah Johnson",
      endorserTitle: "Production Director",
      skill: "Production Management",
      message:
        "I've worked with this professional on multiple large-scale events. Their organizational skills and ability to manage complex productions under pressure is exceptional. They consistently deliver high-quality results.",
      date: "2024-09-15",
      projectName: "Summer Music Festival 2024",
    },
    {
      id: "2",
      endorserName: "Michael Chen",
      endorserTitle: "Event Coordinator",
      skill: "Audio Engineering",
      message:
        "Outstanding audio engineer with deep technical knowledge. Always ensures perfect sound quality and is quick to troubleshoot any issues. A pleasure to work with.",
      date: "2024-08-22",
      projectName: "Corporate Conference",
    },
    {
      id: "3",
      endorserName: "Robert Williams",
      endorserTitle: "Technical Director",
      skill: "Team Leadership",
      message:
        "Excellent team player and natural leader. Great at motivating crew members and maintaining positive energy even during challenging production schedules.",
      date: "2024-07-10",
      projectName: "Broadway Production Setup",
    },
    {
      id: "4",
      endorserName: "Emily Rodriguez",
      endorserTitle: "Stage Manager",
      skill: "Problem Solving",
      message:
        "Incredibly resourceful and thinks on their feet. I've seen them solve complex technical challenges that saved us time and money. Highly recommend!",
      date: "2024-06-05",
    },
    {
      id: "5",
      endorserName: "David Kim",
      endorserTitle: "Lighting Designer",
      skill: "Lighting Design",
      message:
        "Creative and technically proficient. Has a great eye for lighting design and understands how to create the perfect atmosphere for any production.",
      date: "2024-05-18",
    },
  ])

  const skillEndorsements: SkillEndorsement[] = [
    {
      skill: "Production Management",
      count: 12,
      endorsers: ["Sarah Johnson", "Michael Chen", "+10 others"],
    },
    {
      skill: "Team Leadership",
      count: 10,
      endorsers: ["Robert Williams", "Emily Rodriguez", "+8 others"],
    },
    {
      skill: "Audio Engineering",
      count: 8,
      endorsers: ["Michael Chen", "David Kim", "+6 others"],
    },
    {
      skill: "Problem Solving",
      count: 15,
      endorsers: ["Emily Rodriguez", "Sarah Johnson", "+13 others"],
    },
    {
      skill: "Lighting Design",
      count: 6,
      endorsers: ["David Kim", "Robert Williams", "+4 others"],
    },
    {
      skill: "Stage Management",
      count: 9,
      endorsers: ["Emily Rodriguez", "Sarah Johnson", "+7 others"],
    },
  ]

  const filteredEndorsements = endorsements.filter(
    (endorsement) =>
      endorsement.endorserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endorsement.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      endorsement.message.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Endorsements</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{endorsements.length}</div>
            <p className="text-xs text-muted-foreground">From colleagues and managers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Endorsed</CardTitle>
            <Badge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillEndorsements.length}</div>
            <p className="text-xs text-muted-foreground">Different skills validated</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skill</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skillEndorsements.sort((a, b) => b.count - a.count)[0]?.skill.split(" ")[0]}
            </div>
            <p className="text-xs text-muted-foreground">
              {skillEndorsements.sort((a, b) => b.count - a.count)[0]?.count} endorsements
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills & Endorsements</CardTitle>
          <CardDescription>Skills validated by your colleagues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {skillEndorsements.map((skillEndorsement) => (
              <div
                key={skillEndorsement.skill}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-medium">{skillEndorsement.skill}</p>
                  <p className="text-sm text-muted-foreground">
                    Endorsed by {skillEndorsement.endorsers.join(", ")}
                  </p>
                </div>
                <Badge variant="secondary">{skillEndorsement.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recommendations</CardTitle>
              <CardDescription>Detailed recommendations from colleagues</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Request Endorsement
            </Button>
          </div>
          <div className="pt-4">
            <Input
              placeholder="Search endorsements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {filteredEndorsements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No endorsements found matching your search
            </p>
          ) : (
            filteredEndorsements.map((endorsement) => (
              <div key={endorsement.id} className="border-b pb-6 last:border-0">
                <div className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={endorsement.endorserImage} />
                    <AvatarFallback>
                      {endorsement.endorserName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{endorsement.endorserName}</p>
                        <p className="text-sm text-muted-foreground">
                          {endorsement.endorserTitle}
                        </p>
                      </div>
                      <Badge variant="outline">{endorsement.skill}</Badge>
                    </div>

                    <p className="text-sm leading-relaxed">{endorsement.message}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{new Date(endorsement.date).toLocaleDateString()}</span>
                      {endorsement.projectName && (
                        <>
                          <span>•</span>
                          <span>{endorsement.projectName}</span>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm">
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Thank
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Give Endorsements</CardTitle>
          <CardDescription>
            Endorse your colleagues for their skills and contributions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Help your colleagues by endorsing their skills and writing recommendations
            </p>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Endorse a Colleague
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Endorsements help build trust and credibility. Request endorsements
          from colleagues you've worked with closely, and be sure to return the favor by endorsing
          others for their valuable contributions.
        </p>
      </div>
    </div>
  )
}
