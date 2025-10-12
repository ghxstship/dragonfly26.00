import type { DataItem } from "@/types"

// Helper function to generate random dates
const getRandomFutureDate = (daysAhead: number) => {
  return new Date(Date.now() + Math.random() * daysAhead * 24 * 60 * 60 * 1000).toISOString()
}

const getRandomPastDate = (daysBack: number) => {
  return new Date(Date.now() - Math.random() * daysBack * 24 * 60 * 60 * 1000).toISOString()
}

export function generateEventsMockData(tabSlug: string, count: number = 20): DataItem[] {
  switch (tabSlug) {
    case 'all-events':
      return generateAllEventsData(count)
    case 'activities':
      return generateActivitiesData(count)
    case 'run-of-show':
      return generateRunOfShowData(count)
    case 'rehearsals':
      return generateRehearsalsData(count)
    case 'blocks':
      return generateBlocksData(count)
    case 'bookings':
      return generateBookingsData(count)
    case 'tours':
      return generateToursData(count)
    case 'itineraries':
      return generateItinerariesData(count)
    case 'reservations':
      return generateReservationsData(count)
    case 'equipment':
      return generateEquipmentData(count)
    case 'shipping-receiving':
      return generateShippingReceivingData(count)
    case 'trainings':
      return generateTrainingsData(count)
    case 'incidents':
      return generateIncidentsData(count)
    case 'internal':
      return generateInternalData(count)
    default:
      return generateGenericData(count)
  }
}

function generateAllEventsData(count: number): DataItem[] {
  const eventTypes = ["Performance", "Rehearsal", "Meeting", "Training", "Setup", "Breakdown", "Social Event", "Conference"]
  const statuses = ["scheduled", "in_progress", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    name: `${eventTypes[i % eventTypes.length]} - ${new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    description: "Scheduled event with crew assignments and logistics",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Sarah Mitchell" : i % 3 === 1 ? "Alex Turner" : "Jordan Lee",
    assignee_name: i % 3 === 0 ? "Sarah Mitchell" : i % 3 === 1 ? "Alex Turner" : "Jordan Lee",
    due_date: getRandomFutureDate(90),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["event", eventTypes[i % eventTypes.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateActivitiesData(count: number): DataItem[] {
  const activities = [
    "Evening Performance",
    "Morning Rehearsal",
    "Acting Workshop",
    "Dance Class",
    "Voice Training Session",
    "Team Building Recreation",
    "Yoga Class",
    "Music Masterclass",
    "Stage Combat Workshop",
    "Improv Session",
  ]
  const activityTypes = ["performance", "rehearsal", "class", "workshop", "recreation"]
  const statuses = ["scheduled", "ongoing", "completed", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `activity-${i + 1}`,
    name: activities[i % activities.length],
    description: "Scheduled activity for performers, crew, or staff members",
    status: statuses[i % statuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 4 === 0 ? "Maya Rodriguez" : i % 4 === 1 ? "Chris Anderson" : i % 4 === 2 ? "Taylor Kim" : "Sam Parker",
    assignee_name: i % 4 === 0 ? "Maya Rodriguez" : i % 4 === 1 ? "Chris Anderson" : i % 4 === 2 ? "Taylor Kim" : "Sam Parker",
    due_date: getRandomFutureDate(45),
    start_date: getRandomFutureDate(15),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: [activityTypes[i % activityTypes.length], "scheduled"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateRunOfShowData(count: number): DataItem[] {
  const rosItems = [
    "House Opens",
    "Pre-Show Announcement",
    "Overture",
    "Act 1 Opening",
    "Scene 1",
    "Scene 2 - Set Change",
    "Intermission",
    "Act 2 Opening",
    "Finale",
    "Curtain Call",
    "House Lights Up",
  ]
  const cueTypes = ["lighting", "sound", "video", "stage", "actor", "technical"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `ros-${i + 1}`,
    name: `${i + 1}. ${rosItems[i % rosItems.length]} - ${(i * 5).toString().padStart(2, '0')}:${(i * 30 % 60).toString().padStart(2, '0')}`,
    description: `Cue #${i + 1} - ${cueTypes[i % cueTypes.length]} cue with specific timing and execution notes`,
    status: i % 5 === 0 ? "pending" : i % 5 === 1 ? "rehearsed" : i % 5 === 2 ? "locked" : i % 5 === 3 ? "live" : "revision_needed",
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "David Chen" : i % 3 === 1 ? "Lisa Morgan" : "Kevin Foster",
    assignee_name: i % 3 === 0 ? "David Chen" : i % 3 === 1 ? "Lisa Morgan" : "Kevin Foster",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(5),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: ["run-of-show", cueTypes[i % cueTypes.length], "cue"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateRehearsalsData(count: number): DataItem[] {
  const rehearsals = [
    "Full Cast Rehearsal",
    "Technical Rehearsal",
    "Dress Rehearsal",
    "Blocking Rehearsal",
    "Music Rehearsal",
    "Dance Rehearsal",
    "Fight Choreography",
    "Lighting Cue Rehearsal",
    "Sound Check Rehearsal",
    "Run-Through",
  ]
  const statuses = ["scheduled", "in_progress", "completed", "rescheduled", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `rehearsal-${i + 1}`,
    name: `${rehearsals[i % rehearsals.length]} - Week ${Math.floor(i / 2) + 1}`,
    description: "Scheduled rehearsal session with cast, crew, and production notes",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Rachel Green" : i % 3 === 1 ? "Marcus Williams" : "Emily Carter",
    assignee_name: i % 3 === 0 ? "Rachel Green" : i % 3 === 1 ? "Marcus Williams" : "Emily Carter",
    due_date: getRandomFutureDate(30),
    start_date: getRandomFutureDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["rehearsal", "production"],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateBlocksData(count: number): DataItem[] {
  const blockTypes = [
    "Dressing Room A - Lead Performers",
    "Dressing Room B - Ensemble",
    "Green Room VIP",
    "Green Room General",
    "Studio Block - Recording",
    "Studio Block - Rehearsal",
    "Hotel Room Block - Crew",
    "Hotel Room Block - Talent",
    "Production Office Block",
    "Hair & Makeup Station",
  ]
  const statuses = ["reserved", "confirmed", "occupied", "released", "pending"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `block-${i + 1}`,
    name: blockTypes[i % blockTypes.length],
    description: "Room or space block reservation with occupancy details and schedule",
    status: statuses[i % statuses.length],
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Nina Patel" : i % 3 === 1 ? "Oscar Martinez" : "Sophie Zhang",
    assignee_name: i % 3 === 0 ? "Nina Patel" : i % 3 === 1 ? "Oscar Martinez" : "Sophie Zhang",
    due_date: getRandomFutureDate(60),
    start_date: getRandomFutureDate(20),
    created_at: getRandomPastDate(40),
    updated_at: new Date().toISOString(),
    tags: ["block", "space", "reservation"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 4),
  }))
}

function generateBookingsData(count: number): DataItem[] {
  const venues = [
    "Madison Square Garden",
    "Radio City Music Hall",
    "Brooklyn Steel",
    "The Apollo Theater",
    "Barclays Center",
    "Terminal 5",
    "Beacon Theatre",
    "Webster Hall",
    "Forest Hills Stadium",
    "Kings Theatre",
  ]
  const bookingStatuses = ["inquiry", "option", "confirmed", "contracted", "cancelled"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `booking-${i + 1}`,
    name: `${venues[i % venues.length]} - ${new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    description: "Venue booking with contract details, capacity, and technical specifications",
    status: bookingStatuses[i % bookingStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Tom Anderson" : i % 3 === 1 ? "Rebecca Lee" : "James Wilson",
    assignee_name: i % 3 === 0 ? "Tom Anderson" : i % 3 === 1 ? "Rebecca Lee" : "James Wilson",
    due_date: getRandomFutureDate(120),
    start_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(60),
    updated_at: new Date().toISOString(),
    tags: ["venue", "booking", "contract"],
    comments_count: Math.floor(Math.random() * 18),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateToursData(count: number): DataItem[] {
  const tours = [
    "North American Tour 2024",
    "European Summer Festival Circuit",
    "Asia Pacific Tour",
    "UK & Ireland Tour",
    "South American Tour",
    "Worldwide Stadium Tour",
    "Regional Theater Tour",
    "College Campus Tour",
  ]
  const tourStatuses = ["planning", "announced", "on_sale", "in_progress", "completed"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `tour-${i + 1}`,
    name: tours[i % tours.length],
    description: "Multi-city tour schedule with venues, dates, and logistics coordination",
    status: tourStatuses[i % tourStatuses.length],
    priority: i % 2 === 0 ? "urgent" : "high",
    assignee: i % 3 === 0 ? "Victoria Santos" : i % 3 === 1 ? "Daniel Kim" : "Ashley Cooper",
    assignee_name: i % 3 === 0 ? "Victoria Santos" : i % 3 === 1 ? "Daniel Kim" : "Ashley Cooper",
    due_date: getRandomFutureDate(180),
    start_date: getRandomFutureDate(90),
    created_at: getRandomPastDate(90),
    updated_at: new Date().toISOString(),
    tags: ["tour", "multi-city", "logistics"],
    comments_count: Math.floor(Math.random() * 30),
    attachments_count: Math.floor(Math.random() * 20),
  }))
}

function generateItinerariesData(count: number): DataItem[] {
  const itineraries = [
    "Band Travel to NYC",
    "Crew Bus to Boston",
    "International Flight to London",
    "Ground Transport to Venue",
    "Hotel Check-in Schedule",
    "Day-of-Show Timing",
    "Post-Show Departure",
    "Tour Bus Routing",
    "Talent Flight Itinerary",
    "Equipment Truck Route",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `itinerary-${i + 1}`,
    name: `${itineraries[i % itineraries.length]} - ${new Date(Date.now() + (i + 2) * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
    description: "Detailed travel itinerary with flights, ground transport, and timing",
    status: i % 4 === 0 ? "draft" : i % 4 === 1 ? "confirmed" : i % 4 === 2 ? "in_transit" : "completed",
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Megan Brown" : i % 3 === 1 ? "Lucas Martinez" : "Olivia Taylor",
    assignee_name: i % 3 === 0 ? "Megan Brown" : i % 3 === 1 ? "Lucas Martinez" : "Olivia Taylor",
    due_date: getRandomFutureDate(45),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(20),
    updated_at: new Date().toISOString(),
    tags: ["travel", "itinerary", "logistics"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 8),
  }))
}

function generateReservationsData(count: number): DataItem[] {
  const reservations = [
    "VIP Dinner at Per Se",
    "Team Lunch Catering",
    "Post-Show Reception",
    "Crew Meal Service",
    "Hospitality Suite Setup",
    "Artist Meet & Greet",
    "Industry Networking Event",
    "Opening Night Gala",
    "Backstage Catering",
    "Green Room Refreshments",
  ]
  const reservationTypes = ["restaurant", "catering", "hospitality", "entertainment", "reception"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `reservation-${i + 1}`,
    name: `${reservations[i % reservations.length]} - ${Math.floor(Math.random() * 50) + 10} guests`,
    description: "Hospitality or entertainment reservation with guest count and dietary requirements",
    status: i % 4 === 0 ? "requested" : i % 4 === 1 ? "confirmed" : i % 4 === 2 ? "completed" : "cancelled",
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Hannah Lee" : i % 3 === 1 ? "Ryan Clark" : "Isabella White",
    assignee_name: i % 3 === 0 ? "Hannah Lee" : i % 3 === 1 ? "Ryan Clark" : "Isabella White",
    due_date: getRandomFutureDate(30),
    start_date: getRandomFutureDate(20),
    created_at: getRandomPastDate(25),
    updated_at: new Date().toISOString(),
    tags: ["reservation", reservationTypes[i % reservationTypes.length]],
    comments_count: Math.floor(Math.random() * 12),
    attachments_count: Math.floor(Math.random() * 6),
  }))
}

function generateEquipmentData(count: number): DataItem[] {
  const equipment = [
    "Wireless Microphone Package",
    "LED Stage Lighting Rig",
    "Video Projection System",
    "Audio Mixing Console",
    "Stage Monitoring System",
    "Truss and Rigging Hardware",
    "Spotlight Package",
    "Drum Riser Platform",
    "Speaker Array System",
    "Fog Machine & Effects",
  ]
  const equipmentStatuses = ["available", "assigned", "in_use", "maintenance", "unavailable"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `equipment-${i + 1}`,
    name: `${equipment[i % equipment.length]} - ${String.fromCharCode(65 + (i % 5))}${(i % 10) + 1}`,
    description: "Event equipment assignment with checkout details and condition notes",
    status: equipmentStatuses[i % equipmentStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Carlos Rodriguez" : i % 3 === 1 ? "Emma Johnson" : "Nathan Gray",
    assignee_name: i % 3 === 0 ? "Carlos Rodriguez" : i % 3 === 1 ? "Emma Johnson" : "Nathan Gray",
    due_date: getRandomFutureDate(14),
    start_date: getRandomPastDate(3),
    created_at: getRandomPastDate(30),
    updated_at: new Date().toISOString(),
    tags: ["equipment", "rental", "assignment"],
    comments_count: Math.floor(Math.random() * 8),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateShippingReceivingData(count: number): DataItem[] {
  const shipments = [
    "Lighting Fixtures - Freight",
    "Sound Equipment - Overnight",
    "Stage Props - Ground",
    "Video Gear - Air Freight",
    "Costumes - Express",
    "Instruments - Ground",
    "Scenic Elements - LTL",
    "Rigging Hardware - Priority",
    "Cables & Accessories - Ground",
    "Backdrop & Drapes - Freight",
  ]
  const shipmentStatuses = ["pending", "in_transit", "delivered", "delayed", "returned"]
  const carriers = ["FedEx", "UPS", "DHL", "Local Courier", "Freight Company"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `shipment-${i + 1}`,
    name: `${shipments[i % shipments.length]} - ${carriers[i % carriers.length]}`,
    description: `Tracking #: ${Math.random().toString(36).substring(2, 15).toUpperCase()} - Equipment and materials shipment`,
    status: shipmentStatuses[i % shipmentStatuses.length],
    priority: i % 3 === 0 ? "urgent" : i % 3 === 1 ? "high" : "normal",
    assignee: i % 3 === 0 ? "Patrick O'Brien" : i % 3 === 1 ? "Samantha Hill" : "Derek Stone",
    assignee_name: i % 3 === 0 ? "Patrick O'Brien" : i % 3 === 1 ? "Samantha Hill" : "Derek Stone",
    due_date: getRandomFutureDate(21),
    start_date: getRandomPastDate(7),
    created_at: getRandomPastDate(14),
    updated_at: new Date().toISOString(),
    tags: ["shipping", "logistics", carriers[i % carriers.length].toLowerCase()],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 7),
  }))
}

function generateTrainingsData(count: number): DataItem[] {
  const trainings = [
    "Safety & Rigging Certification",
    "Emergency Response Training",
    "Audio Console Operation",
    "Lighting Board Programming",
    "Fire Safety Workshop",
    "First Aid Certification",
    "Forklift Operation Training",
    "Fall Protection Protocol",
    "Hazmat Handling Course",
    "Communication Systems Training",
  ]
  const trainingStatuses = ["scheduled", "in_progress", "completed", "certification_pending", "expired"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `training-${i + 1}`,
    name: `${trainings[i % trainings.length]} - Session ${Math.floor(i / trainings.length) + 1}`,
    description: "Training session with attendance tracking and certification requirements",
    status: trainingStatuses[i % trainingStatuses.length],
    priority: i % 2 === 0 ? "high" : "normal",
    assignee: i % 4 === 0 ? "Jennifer White" : i % 4 === 1 ? "Michael Chen" : i % 4 === 2 ? "Laura Martinez" : "Brian Foster",
    assignee_name: i % 4 === 0 ? "Jennifer White" : i % 4 === 1 ? "Michael Chen" : i % 4 === 2 ? "Laura Martinez" : "Brian Foster",
    due_date: getRandomFutureDate(60),
    start_date: getRandomFutureDate(30),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["training", "certification", "safety"],
    comments_count: Math.floor(Math.random() * 15),
    attachments_count: Math.floor(Math.random() * 10),
  }))
}

function generateIncidentsData(count: number): DataItem[] {
  const incidents = [
    "Minor Equipment Malfunction",
    "Slip and Fall - Stage Area",
    "Power Outage During Show",
    "Medical Emergency - Crew",
    "Sound System Failure",
    "Lighting Fixture Fell",
    "Stage Prop Damage",
    "Weather-Related Delay",
    "Security Incident",
    "Fire Alarm Activation",
  ]
  const severities = ["minor", "moderate", "major", "critical"]
  const incidentStatuses = ["reported", "investigating", "resolved", "pending_action"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `incident-${i + 1}`,
    name: `INC-${(1000 + i).toString()} - ${incidents[i % incidents.length]}`,
    description: "Incident report with details, severity assessment, and corrective actions",
    status: incidentStatuses[i % incidentStatuses.length],
    priority: i % 4 === 0 ? "urgent" : i % 4 === 1 ? "high" : i % 4 === 2 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Robert Johnson" : i % 3 === 1 ? "Amanda Davis" : "Gregory Moore",
    assignee_name: i % 3 === 0 ? "Robert Johnson" : i % 3 === 1 ? "Amanda Davis" : "Gregory Moore",
    due_date: getRandomFutureDate(7),
    start_date: getRandomPastDate(2),
    created_at: getRandomPastDate(5),
    updated_at: new Date().toISOString(),
    tags: ["incident", "safety", severities[i % severities.length]],
    comments_count: Math.floor(Math.random() * 20),
    attachments_count: Math.floor(Math.random() * 12),
  }))
}

function generateInternalData(count: number): DataItem[] {
  const internalEvents = [
    "Production Team Meeting",
    "Budget Review Session",
    "Department Heads Meeting",
    "Weekly Status Update",
    "Contract Negotiations",
    "Planning Session",
    "Staff Performance Review",
    "Quarterly Business Review",
    "Administrative Briefing",
    "Vendor Coordination Meeting",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `internal-${i + 1}`,
    name: `${internalEvents[i % internalEvents.length]} - Week ${Math.floor(i / 3) + 1}`,
    description: "Internal administrative or operational event for team coordination",
    status: i % 4 === 0 ? "scheduled" : i % 4 === 1 ? "in_progress" : i % 4 === 2 ? "completed" : "postponed",
    priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "normal" : "low",
    assignee: i % 3 === 0 ? "Catherine Lee" : i % 3 === 1 ? "William Brown" : "Michelle Garcia",
    assignee_name: i % 3 === 0 ? "Catherine Lee" : i % 3 === 1 ? "William Brown" : "Michelle Garcia",
    due_date: getRandomFutureDate(30),
    start_date: getRandomFutureDate(14),
    created_at: getRandomPastDate(21),
    updated_at: new Date().toISOString(),
    tags: ["internal", "administrative", "meeting"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}

function generateGenericData(count: number): DataItem[] {
  const statuses = ["scheduled", "in_progress", "completed", "cancelled"]
  const priorities = ["urgent", "high", "normal", "low"]
  const names = [
    "Event Planning",
    "Coordination Task",
    "Logistics Setup",
    "Team Assignment",
    "Schedule Review",
    "Documentation",
    "Final Delivery",
    "Follow-up Action",
  ]
  
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    name: names[i % names.length],
    description: "Event item requiring attention and completion",
    status: statuses[i % statuses.length],
    priority: priorities[i % priorities.length],
    assignee: i % 3 === 0 ? "Event Coordinator" : i % 3 === 1 ? "Production Manager" : "Operations Lead",
    assignee_name: i % 3 === 0 ? "Event Coordinator" : i % 3 === 1 ? "Production Manager" : "Operations Lead",
    due_date: getRandomFutureDate(30),
    start_date: getRandomPastDate(10),
    created_at: getRandomPastDate(45),
    updated_at: new Date().toISOString(),
    tags: ["event"],
    comments_count: Math.floor(Math.random() * 10),
    attachments_count: Math.floor(Math.random() * 5),
  }))
}
