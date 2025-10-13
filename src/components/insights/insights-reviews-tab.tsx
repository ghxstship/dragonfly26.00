"use client"

import { Calendar, Users, FileText, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const upcomingReviews = [
  {
    id: "1",
    title: "Q4 2025 Business Review",
    date: "2025-10-15",
    time: "2:00 PM",
    type: "Quarterly",
    attendees: ["Executive Team", "Department Heads"],
    agenda: ["Q4 Results", "Annual Planning", "Strategic Initiatives"],
    status: "upcoming"
  },
  {
    id: "2",
    title: "Monthly Operations Check-in",
    date: "2025-10-20",
    time: "10:00 AM",
    type: "Monthly",
    attendees: ["Operations Team", "Product Team"],
    agenda: ["KPI Review", "Process Improvements", "Blockers"],
    status: "upcoming"
  },
  {
    id: "3",
    title: "Customer Success Sprint Retro",
    date: "2025-10-25",
    time: "3:00 PM",
    type: "Sprint",
    attendees: ["CS Team"],
    agenda: ["What Went Well", "Areas for Improvement", "Action Items"],
    status: "upcoming"
  },
]

const pastReviews = [
  {
    id: "1",
    title: "Q3 2025 Strategic Review",
    date: "2025-09-30",
    type: "Quarterly",
    outcomes: ["Approved market expansion", "Adjusted budget allocations", "Updated OKRs"],
    attendees: 12,
    duration: "2 hours"
  },
  {
    id: "2",
    title: "September Operations Review",
    date: "2025-09-25",
    type: "Monthly",
    outcomes: ["Identified automation opportunities", "Resource reallocation", "Process updates"],
    attendees: 8,
    duration: "1 hour"
  },
]

interface InsightsReviewsTabProps {
  data?: any[]
  loading?: boolean
}

export function InsightsReviewsTab({ data = [], loading = false }: InsightsReviewsTabProps) {
  const displayReviews = data.length > 0 ? data : pastReviews
  return (
    <div className="space-y-6">
      {/* Upcoming Reviews */}
      <div>
        <h3 className="font-semibold mb-4">Upcoming Reviews</h3>
        <div className="space-y-3">
          {upcomingReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Calendar className="h-8 w-8 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-lg">{review.title}</h4>
                        <Badge variant="outline">{review.type}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <p className="text-muted-foreground">Date & Time</p>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {review.date} at {review.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Attendees</p>
                          <p className="font-medium flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {review.attendees.join(", ")}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Agenda</p>
                        <div className="flex flex-wrap gap-2">
                          {review.agenda.map((item, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Past Reviews */}
      <div>
        <h3 className="font-semibold mb-4">Recent Reviews</h3>
        <div className="space-y-3">
          {pastReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{review.title}</h4>
                      <Badge variant="outline">{review.type}</Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Completed
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                      <span>{review.date}</span>
                      <span>•</span>
                      <span>{review.attendees} attendees</span>
                      <span>•</span>
                      <span>{review.duration}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium mb-2">Key Outcomes</p>
                      <ul className="space-y-1">
                        {review.outcomes.map((outcome, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    View Notes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
